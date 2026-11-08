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

    test("stepper rows keep both buttons on the value's line at 320 and 375 px (ADR-041)", async ({ page }) => {
      const label = (key: string) => new RegExp(`^${t(locale, key, { field: "\u0000" }).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace("\u0000", ".+")}$`);
      for (const width of [320, 375]) {
        await page.setViewportSize({ width, height: 800 });
        await page.goto("/recipes/beef_potato_tomato_stew");
        await expect(page.getByRole("heading", { level: 2, name: t(locale, "detail.perServing") })).toBeVisible();
        const decrease = page.getByRole("button", { name: label("adjust.decrease") });
        const increase = page.getByRole("button", { name: label("adjust.increase") });
        const count = await decrease.count();
        expect(count).toBeGreaterThan(1);
        await expect(increase).toHaveCount(count);
        for (let index = 0; index < count; index += 1) {
          const [down, up] = await Promise.all([decrease.nth(index).boundingBox(), increase.nth(index).boundingBox()]);
          expect(up?.y, `row ${String(index)} at ${String(width)} px`).toBe(down?.y);
        }
        await expectNoHorizontalOverflow(page);
      }
    });

    test("the legends of the targets panels stay inside their panels", async ({ page }) => {
      await openTargets(page, locale);
      const outside = await page.locator("fieldset.panel, fieldset.bg-butter").evaluateAll((fieldsets) =>
        fieldsets.flatMap((fieldset) => {
          const legend = fieldset.querySelector(":scope > legend");
          if (legend === null) return [];
          return legend.getBoundingClientRect().top < fieldset.getBoundingClientRect().top + 1 ? [legend.textContent] : [];
        }),
      );
      expect(outside).toEqual([]);
    });

    test("free-text conditions are read in the browser and applied before a search (ADR-034)", async ({ page }) => {
      const requests: string[] = [];
      page.on("request", (request) => requests.push(request.url()));
      await openTargets(page, locale);
      await page.getByText(t(locale, "freeText.summary")).click();
      await page.getByLabel(t(locale, "freeText.label")).fill(FREE_TEXT[locale]);
      const before = requests.length;
      await page.getByRole("button", { name: t(locale, "freeText.read") }).click();
      await expect(page.getByText(t(locale, "freeText.resultHeading"))).toBeVisible();
      expect(requests.slice(before)).toEqual([]);
      await expectNoHorizontalOverflow(page);

      await page.getByRole("button", { name: t(locale, "freeText.apply") }).click();
      await expect(page.locator("#targets-maxMinutes")).toHaveValue("40");
      await search(page, locale);
      await heading1(page, t(locale, "nav.views.candidates"));
      expect(await cardNames(page)).not.toEqual([]);
    });
  });
}

/** Written for this test, not taken from the evaluation set. */
const FREE_TEXT: Readonly<Record<Locale, string>> = {
  ja: "鶏肉を使って40分以内",
  en: "Chicken, 40 minutes or less",
  es: "Pollo, 40 minutos como máximo",
  fr: "Du poulet, 40 minutes maximum",
};

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
