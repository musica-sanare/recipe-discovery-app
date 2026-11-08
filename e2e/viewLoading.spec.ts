import type { Page } from "@playwright/test";
import { BROWSER_LOCALE, LOCALES, cardNames, choosePresetCut, expect, heading1, openTargets, search, t, test, type Locale } from "./support.ts";

// Views that load after the first view (ADR-043). The first view needs none of their chunks, and
// a chunk that fails shows the retry state without losing the search or the shopping list.
const VIEW_CHUNK = {
  about: /\/assets\/AboutView-[\w-]+\.js$/,
  candidates: /\/assets\/CandidatesView-[\w-]+\.js$/,
  comparison: /\/assets\/ComparisonView-[\w-]+\.js$/,
  detail: /\/assets\/DetailView-[\w-]+\.js$/,
  shopping: /\/assets\/ShoppingListView-[\w-]+\.js$/,
} as const;
const RECIPE = "/recipes/beef_potato_tomato_stew";

/** Fails a chunk until `allow` is called. */
async function failChunk(page: Page, pattern: RegExp): Promise<() => void> {
  let fail = true;
  await page.route(pattern, (route) => (fail ? route.abort() : route.continue()));
  return () => {
    fail = false;
  };
}

async function searchCut(page: Page, locale: Locale): Promise<void> {
  await openTargets(page, locale);
  await choosePresetCut(page);
  await search(page, locale);
}

for (const locale of LOCALES) {
  test.describe(`view loading in ${locale}`, () => {
    test.use({ locale: BROWSER_LOCALE[locale] });

    test("a failed candidates chunk shows the retry, and the retry shows the search", async ({ page }) => {
      const allow = await failChunk(page, VIEW_CHUNK.candidates);
      await searchCut(page, locale);
      await expect(page.getByRole("alert")).toContainText(t(locale, "content.error"));
      allow();
      await page.getByRole("button", { name: t(locale, "content.retry") }).click();
      await heading1(page, t(locale, "nav.views.candidates"));
      expect((await cardNames(page)).length).toBeGreaterThan(0);
      await expect(page.getByRole("alert")).toHaveCount(0);
    });

    test("a failed detail chunk on a direct link shows the retry, and the header still works", async ({ page }) => {
      const allow = await failChunk(page, VIEW_CHUNK.detail);
      await page.goto(RECIPE);
      await expect(page.getByRole("alert")).toContainText(t(locale, "content.error"));
      await expect(page.getByRole("combobox", { name: t(locale, "theme.label") })).toBeVisible();
      allow();
      await page.getByRole("button", { name: t(locale, "content.retry") }).click();
      await expect(page.getByRole("heading", { level: 2, name: t(locale, "detail.perServing") })).toBeVisible();
    });
  });
}

test.describe("view loading", () => {
  test.use({ locale: BROWSER_LOCALE.ja });

  test("the first view loads no view chunk except the preloaded candidates", async ({ page }) => {
    const scripts: string[] = [];
    page.on("request", (request) => {
      if (request.resourceType() === "script") scripts.push(new URL(request.url()).pathname);
    });
    await openTargets(page, "ja");
    await expect.poll(() => scripts.some((path) => VIEW_CHUNK.candidates.test(path))).toBe(true);
    for (const pattern of [VIEW_CHUNK.about, VIEW_CHUNK.comparison, VIEW_CHUNK.detail, VIEW_CHUNK.shopping]) {
      expect(scripts.filter((path) => pattern.test(path))).toEqual([]);
    }
  });

  test("a failed comparison chunk keeps the search, and another view still opens", async ({ page }) => {
    const allow = await failChunk(page, VIEW_CHUNK.comparison);
    await searchCut(page, "ja");
    await heading1(page, t("ja", "nav.views.candidates"));
    const names = await cardNames(page);
    for (const name of names.slice(0, 2)) await page.getByRole("checkbox", { name: t("ja", "candidates.compareSelectNamed", { recipe: name }) }).check();
    await page.getByRole("button", { name: t("ja", "candidates.compareButton", { count: 2 }) }).click();
    await expect(page.getByRole("alert")).toContainText(t("ja", "content.error"));

    await page.goBack();
    await heading1(page, t("ja", "nav.views.candidates"));
    expect(await cardNames(page)).toEqual(names);
    await expect(page.getByRole("alert")).toHaveCount(0);

    allow();
    await page.getByRole("button", { name: t("ja", "candidates.compareButton", { count: 2 }) }).click();
    await expect(page.getByRole("button", { name: t("ja", "content.retry") })).toBeVisible();
    await page.getByRole("button", { name: t("ja", "content.retry") }).click();
    await heading1(page, t("ja", "nav.views.comparison"));
  });

  test("a failed shopping list chunk keeps the list", async ({ page }) => {
    await page.goto(RECIPE);
    await page.getByRole("button", { name: t("ja", "shopping.add") }).click();
    const allow = await failChunk(page, VIEW_CHUNK.shopping);
    const link = page.getByRole("banner").getByRole("link", { name: t("ja", "shopping.headerLink_other", { count: 1 }) });
    await link.click();
    await expect(page.getByRole("alert")).toContainText(t("ja", "content.error"));
    await expect(link).toBeVisible();
    allow();
    await page.getByRole("button", { name: t("ja", "content.retry") }).click();
    await expect(page.getByRole("button", { name: t("ja", "shopping.copy") })).toBeVisible();
  });

  test("a slow view shows the loading state, then moves focus to its heading", async ({ page }) => {
    await page.route(VIEW_CHUNK.about, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      await route.continue();
    });
    await openTargets(page, "ja");
    await page.locator("footer a").last().click();
    await expect(page.getByRole("status")).toContainText(t("ja", "content.loading"));
    await heading1(page, t("ja", "nav.views.about"));
    await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  });
});
