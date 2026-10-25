import {
  BROWSER_LOCALE,
  LOCALES,
  cardNames,
  choosePresetCut,
  expect,
  expectNoHorizontalOverflow,
  heading1,
  openAdvanced,
  openTargets,
  search,
  setNumber,
  t,
  test,
} from "./support.ts";

// Exceptional states of docs/SPEC.md §12 on the 60-recipe library. The conditions were
// chosen with the recommendation engine (docs/DECISIONS.md "Stage 5.4").
for (const locale of LOCALES) {
  test.describe(`exceptional states in ${locale}`, () => {
    test.use({ locale: BROWSER_LOCALE[locale] });

    test("input errors are listed and linked to their fields", async ({ page }) => {
      await openTargets(page, locale);
      await setNumber(page, "kcalMin", "900");
      await setNumber(page, "kcalMax", "500");
      await search(page, locale);
      const summary = page.getByRole("alert");
      await expect(summary).toBeFocused();
      await summary.getByRole("link").first().click();
      await expect(page.locator("[aria-invalid=true]").first()).toBeFocused();
      await expectNoHorizontalOverflow(page);
    });

    test("a blocking contradiction stops the search", async ({ page }) => {
      await openTargets(page, locale);
      await setNumber(page, "kcalMax", "600");
      await setNumber(page, "proteinMin", "200");
      await search(page, locale);
      await expect(page.getByRole("alert")).toBeVisible();
      await heading1(page, t(locale, "nav.views.targets"));
    });

    test("every recipe that meets the targets has been shown", async ({ page }) => {
      await openTargets(page, locale);
      await choosePresetCut(page);
      await setNumber(page, "kcalMax", "500");
      await setNumber(page, "fatMax", "8");
      await search(page, locale);
      await heading1(page, t(locale, "nav.views.candidates"));
      const first = await cardNames(page);
      await page.getByRole("button", { name: t(locale, "candidates.differentType") }).click();
      // The notice is also announced through a visually hidden live region; the status box is checked.
      await expect(page.getByRole("status")).toContainText(t(locale, "candidates.allShown"));
      expect(await cardNames(page)).toEqual(first);
      await page.getByRole("button", { name: t(locale, "candidates.showAlternatives") }).click();
      await expect(page.getByRole("heading", { name: t(locale, "candidates.alternativesHeading") })).toBeVisible();
      await expectNoHorizontalOverflow(page);
    });

    test("close alternatives when nothing meets the targets", async ({ page }) => {
      await openTargets(page, locale);
      await choosePresetCut(page);
      await openAdvanced(page, locale);
      await page.locator("input[name=equipment-mode]").nth(1).check();
      for (const food of [{ ja: "卵", en: "egg", es: "huevo" }, { ja: "ご飯", en: "rice", es: "arroz" }, { ja: "パン", en: "bread", es: "pan" }]) {
        const box = page.locator("#targets-excluded");
        await box.fill(food[locale]);
        await box.press("Enter");
      }
      await search(page, locale);
      await heading1(page, t(locale, "nav.views.candidates"));
      await expect(page.getByText(t(locale, "candidates.noneMet"))).toBeVisible();
      await expect(page.getByRole("heading", { name: t(locale, "candidates.alternativesHeading") })).toBeVisible();
      await expectNoHorizontalOverflow(page);
    });

    test("no recipe passes the filters, with a relaxation to apply", async ({ page }) => {
      await openTargets(page, locale);
      await choosePresetCut(page);
      await setNumber(page, "maxMinutes", "5");
      await search(page, locale);
      await expect(page.getByRole("heading", { level: 2, name: t(locale, "candidates.noneHeading") })).toBeVisible();
      await expectNoHorizontalOverflow(page);
    });

    test("a content bundle that cannot be loaded shows the error and a retry", async ({ page }) => {
      let fail = true;
      await page.route("**/assets/calc-*.json", (route) => (fail ? route.abort() : route.continue()));
      await page.goto("/");
      await expect(page.getByRole("alert")).toContainText(t(locale, "content.error"));
      fail = false;
      await page.getByRole("button", { name: t(locale, "content.retry") }).click();
      await heading1(page, t(locale, "nav.views.targets"));
    });
  });
}
