import { BROWSER_LOCALE, choosePresetCut, expect, heading1, openTargets, search, t, test } from "./support.ts";

// Motion, forced colors, and the translucent bars of ADR-041 (docs/en/UI_DESIGN.md §5).

async function candidates(page: Parameters<typeof openTargets>[0]): Promise<void> {
  await openTargets(page, "ja");
  await choosePresetCut(page);
  await search(page, "ja");
  await heading1(page, t("ja", "nav.views.candidates"));
}

const animationNames = (page: Parameters<typeof openTargets>[0]) => page.locator("article").evaluateAll((cards) => cards.map((card) => getComputedStyle(card.parentElement ?? card).animationName));

test.describe("motion", () => {
  test.use({ locale: BROWSER_LOCALE.ja });

  test("cards deal in, and a changed value is highlighted", async ({ page }) => {
    await candidates(page);
    expect(new Set(await animationNames(page))).toEqual(new Set(["deal-in"]));

    await page.locator("article a").first().click();
    await expect(page.getByRole("heading", { level: 2, name: t("ja", "detail.perServing") })).toBeVisible();
    // The second "increase" button is the first ingredient's (the first one is servings).
    const increase = page.getByRole("button", { name: new RegExp(`^${t("ja", "adjust.increase", { field: ".+" })}$`) });
    await increase.nth(1).click();
    const values = page.locator("#nutrition-heading ~ dl dd > span:first-child");
    await expect.poll(() => values.evaluateAll((spans) => spans.some((span) => getComputedStyle(span).animationName === "flash"))).toBe(true);
  });

  test.describe("with reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("nothing moves, and every card is visible at once", async ({ page }) => {
      await candidates(page);
      expect(new Set(await animationNames(page))).toEqual(new Set(["none"]));
      for (const card of await page.locator("article").all()) expect(await card.evaluate((element) => getComputedStyle(element.parentElement ?? element).opacity)).toBe("1");
    });
  });
});

test.describe("forced colors", () => {
  test.use({ locale: BROWSER_LOCALE.ja, forcedColors: "active" });

  test("hide the bars, keep every nutrient text, and make the bars opaque", async ({ page }) => {
    await candidates(page);
    const card = page.locator("article").first();
    await expect(card.locator('div[aria-hidden="true"]').first()).toBeHidden();
    await expect(card.getByText(t("ja", "target.kcal"))).toBeVisible();
    await expect(card.getByRole("definition").first()).toBeVisible();
    const header = await page.locator("header").evaluate((element) => getComputedStyle(element).backdropFilter);
    expect(header).toBe("none");
  });
});
