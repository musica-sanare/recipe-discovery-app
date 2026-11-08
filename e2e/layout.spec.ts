import type { Page } from "@playwright/test";
import { BROWSER_LOCALE, choosePresetCut, expect, expectNoAxeViolations, expectNoHorizontalOverflow, heading1, LOCALES, openTargets, search, t, test, type Locale } from "./support.ts";

// The comparison view, the candidate cards, and the desktop ingredient table of Stage 19.3.
const RECIPE = "/recipes/beef_potato_tomato_stew";
const barSelector = '[aria-hidden="true"].relative';

async function openCandidates(page: Page, locale: Locale): Promise<void> {
  await openTargets(page, locale);
  await choosePresetCut(page);
  await search(page, locale);
  await heading1(page, t(locale, "nav.views.candidates"));
}

async function openComparison(page: Page, locale: Locale, count: number): Promise<void> {
  await openCandidates(page, locale);
  for (let index = 0; index < count; index++) await page.getByRole("article").nth(index).getByRole("checkbox").check();
  await page.getByRole("button", { name: t(locale, "candidates.compareButton", { count }) }).click();
  await heading1(page, t(locale, "nav.views.comparison"));
}

const tableRegion = (page: Page) => page.getByRole("region", { name: t("ja", "comparison.caption") });

for (const locale of LOCALES) {
  test.describe(`comparison layout in ${locale}`, () => {
    test.use({ locale: BROWSER_LOCALE[locale] });

    for (const count of [2, 3]) {
      test(`${String(count)} recipes: equal columns, bars on one scale, targets in the row headers`, async ({ page }) => {
        await openComparison(page, locale, count);
        const table = page.getByRole("table");
        const widths = await table.locator("thead th").evaluateAll((cells) => cells.map((cell) => Math.round(cell.getBoundingClientRect().width)));
        expect(new Set(widths.slice(1)).size).toBe(1);
        expect(widths[0]).toBeGreaterThanOrEqual(110);

        // The preset sets energy, protein, and fat, and leaves carbohydrate without a target.
        const bars = table.locator(barSelector);
        await expect(bars).toHaveCount(count * 3);
        const proteinRow = table.getByRole("row", { name: new RegExp(t(locale, "target.protein")) });
        await expect(proteinRow.getByRole("rowheader")).toContainText(t(locale, "target.protein"));
        await expect(table.getByRole("row", { name: new RegExp(t(locale, "target.carbohydrate")) }).getByRole("rowheader")).toContainText(t(locale, "status.noTarget"));
        // One scale per row: the target band starts at the same place in each cell.
        const starts = await proteinRow.locator(`${barSelector} > div:first-child`).evaluateAll((bands) => bands.map((band) => (band as HTMLElement).style.left));
        expect(new Set(starts).size).toBe(1);

        // No text leaves its cell, and the page itself never scrolls sideways.
        const spilled = await table.locator("th, td").evaluateAll((cells) => cells.filter((cell) => cell.scrollWidth > cell.clientWidth + 1).map((cell) => cell.textContent));
        expect(spilled).toEqual([]);
        await expectNoHorizontalOverflow(page);
        await expectNoAxeViolations(page);
      });
    }

    test("fits at 320 and 375 px, scrolling inside its own region", async ({ page }) => {
      await openComparison(page, locale, 3);
      for (const width of [320, 375]) {
        await page.setViewportSize({ width, height: 800 });
        await expectNoHorizontalOverflow(page);
        expect((await page.getByRole("table").locator("thead th").first().boundingBox())?.width ?? 0).toBeGreaterThanOrEqual(110);
      }
      expect(await page.locator('[role="region"]').first().evaluate((region) => region.scrollWidth > region.clientWidth)).toBe(true);
    });

    test("cards keep the bar on the label row when there is room, and on its own row at 320 px", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 800 });
      await openCandidates(page, locale);
      const firstLine = page.getByRole("article").first().locator("dl > div").first();
      const rows = async () => {
        const [label, bar] = await Promise.all([firstLine.locator("dt").boundingBox(), firstLine.locator(barSelector).boundingBox()]);
        if (label === null || bar === null) throw new Error("Missing label or bar");
        return { label, bar };
      };
      const wide = await rows();
      expect(wide.bar.y).toBeLessThan(wide.label.y + wide.label.height);

      await page.setViewportSize({ width: 320, height: 800 });
      await expect.poll(async () => { const narrow = await rows(); return narrow.bar.y >= narrow.label.y + narrow.label.height; }).toBe(true);
      await expectNoHorizontalOverflow(page);
    });

    for (const width of [1024, 1152, 1280]) {
      test(`the ingredient table hides nothing at ${String(width)} px, next to no column`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(RECIPE);
        const region = page.locator('[role="region"][aria-labelledby="ingredients-caption"]');
        await expect(region).toBeVisible();
        expect(await region.evaluate((element) => element.scrollWidth - element.clientWidth)).toBe(0);
        const nutrition = await page.locator('section[aria-labelledby="nutrition-heading"]').boundingBox();
        const adjust = await page.locator('section[aria-labelledby="adjust-heading"]').boundingBox();
        const table = await region.boundingBox();
        if (nutrition === null || adjust === null || table === null) throw new Error("Missing section");
        // Two columns above the table, and the table below the nutrition at nearly the full width.
        expect(nutrition.x).toBeGreaterThan(adjust.x + adjust.width);
        expect(table.y).toBeGreaterThan(nutrition.y + nutrition.height);
        expect(table.width).toBeGreaterThan(adjust.width + nutrition.width / 2);
      });
    }

    test("the ingredient table keeps scrolling inside its region on a phone", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 800 });
      await page.goto(RECIPE);
      await expect(page.locator('[role="region"][aria-labelledby="ingredients-caption"]')).toBeVisible();
      await expectNoHorizontalOverflow(page);
    });
  });
}

test.describe("comparison on the dark choice", () => {
  test.use({ locale: BROWSER_LOCALE.ja });

  test("has no accessibility violation", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("recipe-discovery.theme", "dark");
    });
    await openComparison(page, "ja", 2);
    await expect(tableRegion(page)).toBeVisible();
    await expectNoAxeViolations(page);
  });
});
