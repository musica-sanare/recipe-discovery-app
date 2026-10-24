import {
  BROWSER_LOCALE,
  LOCALES,
  cardNames,
  choosePresetCut,
  expect,
  expectNoAxeViolations,
  heading1,
  openTargets,
  search,
  t,
  test,
} from "./support.ts";

// axe-core in a real browser with color contrast, light and dark (Stage 5.1 P4), and
// keyboard operation with visible focus.
for (const locale of LOCALES) {
  for (const colorScheme of ["light", "dark"] as const) {
    test.describe(`axe in ${locale}, ${colorScheme}`, () => {
      test.use({ locale: BROWSER_LOCALE[locale], colorScheme });

      test("targets, candidates, comparison, detail, and about have no violations", async ({ page }) => {
        await openTargets(page, locale);
        await expectNoAxeViolations(page);

        await choosePresetCut(page);
        await search(page, locale);
        await heading1(page, t(locale, "nav.views.candidates"));
        await expectNoAxeViolations(page);

        const [a, b] = await cardNames(page);
        for (const name of [a, b]) await page.getByRole("checkbox", { name: t(locale, "candidates.compareSelectNamed", { recipe: name ?? "" }) }).check();
        await page.getByRole("button", { name: t(locale, "candidates.compareButton", { count: 2 }) }).click();
        await heading1(page, t(locale, "nav.views.comparison"));
        await expectNoAxeViolations(page);

        await page.getByRole("table").getByRole("link", { name: a ?? "" }).click();
        await heading1(page, a ?? "");
        await expectNoAxeViolations(page);

        await page.goto("/about");
        await heading1(page, t(locale, "nav.views.about"));
        await expectNoAxeViolations(page);
      });
    });
  }
}

test.describe("keyboard", () => {
  test.use({ locale: BROWSER_LOCALE.en });

  test("skip link, search by keyboard, and a visible focus ring", async ({ page, browserName }) => {
    // WebKit on macOS skips links with Tab unless the user enables it, so the check runs in Chromium.
    test.skip(browserName === "webkit", "Tab does not reach links in WebKit by default");
    await openTargets(page, "en");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: t("en", "common.skipToContent") });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();

    const submit = page.getByRole("button", { name: t("en", "targets.search") });
    for (let presses = 0; presses < 200 && !(await submit.evaluate((element) => element === document.activeElement)); presses++) {
      await page.keyboard.press("Tab");
    }
    await expect(submit).toBeFocused();
    const ring = await submit.evaluate((element) => getComputedStyle(element).outlineStyle);
    expect(ring).not.toBe("none");
    await page.keyboard.press("Enter");
    await heading1(page, t("en", "nav.views.candidates"));
    await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  });
});
