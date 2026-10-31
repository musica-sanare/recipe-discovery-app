import {
  BROWSER_LOCALE,
  LOCALES,
  type Locale,
  cardNames,
  choosePresetCut,
  expect,
  expectNoHorizontalOverflow,
  heading1,
  openTargets,
  search,
  t,
  test,
} from "./support.ts";

// The full flow of docs/en/SPEC.md §15 on the production build, per locale and project.
for (const locale of LOCALES) {
  test.describe(`flow in ${locale}`, () => {
    test.use({ locale: BROWSER_LOCALE[locale] });

    test("targets → candidates → re-suggestion → exclusion → comparison → detail → adjustment → back", async ({ page }) => {
      await openTargets(page, locale);
      await expectNoHorizontalOverflow(page);
      await choosePresetCut(page);
      await search(page, locale);

      await heading1(page, t(locale, "nav.views.candidates"));
      await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
      const first = await cardNames(page);
      expect(first.length).toBeGreaterThanOrEqual(3);
      await expectNoHorizontalOverflow(page);

      await page.getByRole("button", { name: t(locale, "candidates.differentType") }).click();
      await expect.poll(() => cardNames(page)).not.toEqual(first);

      const shown = await cardNames(page);
      const removed = shown[0] ?? "";
      await page.getByRole("button", { name: t(locale, "candidates.exclude", { recipe: removed }) }).click();
      await expect.poll(() => cardNames(page)).not.toContain(removed);

      const [a, b] = await cardNames(page);
      for (const name of [a, b]) await page.getByRole("checkbox", { name: t(locale, "candidates.compareSelectNamed", { recipe: name ?? "" }) }).check();
      await page.getByRole("button", { name: t(locale, "candidates.compareButton", { count: 2 }) }).click();
      await heading1(page, t(locale, "nav.views.comparison"));
      await expect(page.getByRole("table").getByRole("columnheader")).toHaveCount(3);
      await expectNoHorizontalOverflow(page);

      await page.getByRole("table").getByRole("link", { name: a ?? "" }).click();
      await heading1(page, a ?? "");
      await expect(page).toHaveURL(/\/recipes\/[a-z0-9_]+$/);
      const ingredients = page.getByRole("region", { name: new RegExp(t(locale, "detail.ingredientsCaption", { servings: ".*" }).replace(/[()（）]/g, ".")) });
      const before = await ingredients.textContent();
      await page.getByRole("button", { name: t(locale, "adjust.increase", { field: t(locale, "adjust.servings") }) }).click();
      await expect.poll(() => ingredients.textContent()).not.toEqual(before);
      await expectNoHorizontalOverflow(page);

      await page.goBack();
      await heading1(page, t(locale, "nav.views.comparison"));
      await page.goBack();
      await heading1(page, t(locale, "nav.views.candidates"));

      // Targets and conditions are not kept after a reload (ADR-030 D2).
      await page.reload();
      await heading1(page, t(locale, "nav.views.targets"));
      await expect(page.getByText(t(locale, "nav.reloadNotice"))).toBeVisible();
    });

    test("deep links, not found, and the about page", async ({ page }) => {
      await page.goto("/recipes/beef_potato_tomato_stew");
      await expect(page.getByRole("heading", { level: 2, name: t(locale, "detail.perServing") })).toBeVisible();
      await expectNoHorizontalOverflow(page);

      await page.goto("/recipes/no_such_recipe");
      await expect(page.getByText(t(locale, "nav.notFound"))).toBeVisible();

      await page.goto("/");
      await page.getByRole("contentinfo").getByRole("link", { name: t(locale, "nav.views.about") }).click();
      await heading1(page, t(locale, "nav.views.about"));
      await expect(page).toHaveURL(/\/about$/);
      await expect(page.locator('a[href="/third-party-licenses.txt"]')).toBeVisible();
      await expectNoHorizontalOverflow(page);
      await page.reload();
      await heading1(page, t(locale, "nav.views.about"));
    });
  });
}

test.describe("locale switching", () => {
  test.use({ locale: BROWSER_LOCALE.ja });

  test("keeps the view and every displayed number when the language changes", async ({ page }) => {
    await openTargets(page, "ja");
    await choosePresetCut(page);
    await search(page, "ja");
    await heading1(page, t("ja", "nav.views.candidates"));
    // Separators differ by locale (1,030 / 1030 / 1.030 / 1 030); the digits must not.
    const digits = () =>
      page
        .getByRole("article")
        .getByRole("definition")
        .allTextContents()
        .then((cells) => cells.map((cell) => cell.replace(/(\d)[.,\s](\d{3})/g, "$1$2").match(/\d+(?:[.,]\d+)?/g)?.join(" ")));
    const ja = await digits();
    // Ends back in ja: switching through every locale and back must leave the numbers unchanged.
    let previous: Locale = "ja";
    for (const locale of ["en", "es", "fr", "ja"] as const) {
      await page.getByRole("combobox", { name: t(previous, "language.label") }).selectOption(locale);
      previous = locale;
      await heading1(page, t(locale, "nav.views.candidates"));
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      expect(await digits()).toEqual(ja);
      await expectNoHorizontalOverflow(page);
    }
  });
});
