import type { Page } from "@playwright/test";
import { BROWSER_LOCALE, LOCALES, expect, heading1, t, test, type Locale } from "./support.ts";

// Per-locale UI catalogs and word lists (ADR-039): one chunk per locale, loaded before the
// first render and before a language switch.

const chunk = (locale: Locale) => new RegExp(`/assets/${locale}-[\\w-]+\\.js$`);

/** Every `h1` text and `lang` value the page showed while loading, in order. */
async function recordFirstRender(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const seen: string[] = [];
    Object.assign(window, { __seen: seen });
    new MutationObserver(() => {
      const heading = document.querySelector("h1")?.textContent;
      const label = document.querySelector("header label")?.textContent;
      if (heading !== undefined || label !== undefined) seen.push(`${document.documentElement.lang}|${label ?? ""}|${heading ?? ""}`);
    }).observe(document, { childList: true, subtree: true, characterData: true, attributes: true });
  });
}

for (const locale of LOCALES) {
  test.describe(`first render in ${locale}`, () => {
    test.use({ locale: BROWSER_LOCALE[locale] });

    test("loads only this locale's chunk and never shows another language or a key", async ({ page }) => {
      const scripts: string[] = [];
      page.on("request", (request) => {
        if (request.resourceType() === "script") scripts.push(new URL(request.url()).pathname);
      });
      await recordFirstRender(page);
      await page.goto("/");
      await heading1(page, t(locale, "nav.views.targets"));
      await expect(page.locator("html")).toHaveAttribute("lang", locale);

      for (const other of LOCALES) expect(scripts.some((path) => chunk(other).test(path)), other).toBe(other === locale);
      const seen = await page.evaluate(() => (window as unknown as { __seen: string[] }).__seen);
      const label = t(locale, "language.label");
      const heading = t(locale, "nav.views.targets");
      // The header appears first; the heading follows once the content is loaded.
      expect(seen.length).toBeGreaterThan(0);
      for (const entry of seen) expect([`${locale}|${label}|`, `${locale}|${label}|${heading}`]).toContain(entry);
    });

    test("a chunk that cannot be loaded at the first render shows the error, and the retry reloads", async ({ page }) => {
      let fail = true;
      await page.route(chunk(locale), (route) => (fail ? route.abort() : route.continue()));
      await page.goto("/");
      await expect(page.getByRole("alert")).toContainText(t(locale, "content.error"));
      await expect(page.locator("main")).toHaveAttribute("lang", locale);
      fail = false;
      await page.getByRole("button", { name: t(locale, "content.retry") }).click();
      await heading1(page, t(locale, "nav.views.targets"));
    });
  });
}

test.describe("language switch loading", () => {
  test.use({ locale: BROWSER_LOCALE.ja });

  test("loads the new locale's chunk on the switch", async ({ page }) => {
    await page.goto("/");
    await heading1(page, t("ja", "nav.views.targets"));
    const request = page.waitForRequest((candidate) => chunk("fr").test(new URL(candidate.url()).pathname));
    await page.getByRole("combobox", { name: t("ja", "language.label") }).selectOption("fr");
    await request;
    await heading1(page, t("fr", "nav.views.targets"));
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  });

  test("a chunk that cannot be loaded keeps the current language, and the retry switches", async ({ page }) => {
    await page.goto("/");
    await heading1(page, t("ja", "nav.views.targets"));
    let fail = true;
    await page.route(chunk("fr"), (route) => (fail ? route.abort() : route.continue()));

    await page.getByRole("combobox", { name: t("ja", "language.label") }).selectOption("fr");
    await expect(page.getByRole("alert")).toContainText(t("ja", "content.error"));
    await heading1(page, t("ja", "nav.views.targets"));
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");

    fail = false;
    await page.getByRole("button", { name: t("ja", "content.retry") }).click();
    await heading1(page, t("fr", "nav.views.targets"));
    await expect(page.getByRole("alert")).toHaveCount(0);
  });
});
