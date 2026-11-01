import type { Page } from "@playwright/test";
import {
  BROWSER_LOCALE,
  LOCALES,
  cardNames,
  choosePresetCut,
  expect,
  expectNoAxeViolations,
  expectNoHorizontalOverflow,
  heading1,
  openTargets,
  search,
  setNumber,
  t,
  test,
} from "./support.ts";

// Opt-in saved conditions (ADR-036) on the production build, per locale and project.

const KEY = "recipe-discovery.conditions";

async function storedKeys(page: Page): Promise<string[]> {
  return page.evaluate(() => Object.keys(localStorage).sort());
}

for (const locale of LOCALES) {
  test.describe(`saved conditions in ${locale}`, () => {
    test.use({ locale: BROWSER_LOCALE[locale] });

    test("save, reload, restore, search again, then turn saving off", async ({ page }) => {
      await openTargets(page, locale);
      await choosePresetCut(page);
      await setNumber(page, "maxMinutes", "25");
      await search(page, locale);
      await heading1(page, t(locale, "nav.views.candidates"));
      expect((await storedKeys(page)).filter((key) => key !== "recipe-discovery.locale"), "no new key with saving off").toEqual([]);

      await page.goBack();
      await heading1(page, t(locale, "nav.views.targets"));
      await page.getByRole("checkbox", { name: t(locale, "saved.save") }).check();
      await search(page, locale);
      await heading1(page, t(locale, "nav.views.candidates"));
      const first = await cardNames(page);
      expect(await storedKeys(page)).toContain(KEY);

      await page.reload();
      await heading1(page, t(locale, "nav.views.targets"));
      await expect(page.getByText(t(locale, "saved.restored"))).toBeVisible();
      await expect(page.getByText(t(locale, "nav.reloadNoticeSaved"))).toBeVisible();
      await expect(page.locator("#targets-maxMinutes")).toHaveValue("25");
      await expect(page.getByRole("checkbox", { name: t(locale, "saved.save") })).toBeChecked();
      await expectNoHorizontalOverflow(page);
      await expectNoAxeViolations(page);

      await search(page, locale);
      await heading1(page, t(locale, "nav.views.candidates"));
      expect(await cardNames(page)).toEqual(first);

      await page.goBack();
      await page.getByRole("checkbox", { name: t(locale, "saved.save") }).uncheck();
      await expect(page.getByText(t(locale, "saved.deleted"))).toBeVisible();
      await page.reload();
      await heading1(page, t(locale, "nav.views.targets"));
      await expect(page.getByText(t(locale, "saved.restored"))).toHaveCount(0);
      await expect(page.locator("#targets-maxMinutes")).toHaveValue("");
      expect((await storedKeys(page)).filter((key) => key !== "recipe-discovery.locale")).toEqual([]);
    });
  });
}
