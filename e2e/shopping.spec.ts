import { BROWSER_LOCALE, LOCALES, cardNames, choosePresetCut, expect, expectNoHorizontalOverflow, heading1, openTargets, search, t, test } from "./support.ts";

// The shopping list on the production build (docs/en/SPEC.md §18, ADR-032): two recipes from
// their details, checking off, copying, printing, and the reload notice, per locale and project.
for (const locale of LOCALES) {
  test.describe(`shopping list in ${locale}`, () => {
    test.use({ locale: BROWSER_LOCALE[locale] });

    test("add from the details → list → check → copy → print → reload", async ({ page }) => {
      await openTargets(page, locale);
      await choosePresetCut(page);
      await search(page, locale);
      await heading1(page, t(locale, "nav.views.candidates"));
      const [a = "", b = ""] = await cardNames(page);

      await page.getByRole("article").getByRole("link", { name: a, exact: true }).click();
      await heading1(page, a);
      await page.getByRole("button", { name: t(locale, "shopping.add") }).click();
      const headerLink = (count: number) => page.getByRole("banner").getByRole("link", { name: t(locale, "shopping.headerLink_other", { count }) });
      await expect(headerLink(1)).toBeVisible();
      await expectNoHorizontalOverflow(page);

      await page.goBack();
      await heading1(page, t(locale, "nav.views.candidates"));
      await page.getByRole("article").getByRole("link", { name: b, exact: true }).click();
      await heading1(page, b);
      await page.getByRole("button", { name: t(locale, "adjust.increase", { field: t(locale, "adjust.servings") }) }).click();
      await page.getByRole("button", { name: t(locale, "shopping.add") }).click();
      await headerLink(2).click();

      await heading1(page, t(locale, "nav.views.shoppingList"));
      await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
      await expect(page.getByRole("link", { name: a, exact: true })).toBeVisible();
      await expect(page.getByRole("link", { name: b, exact: true })).toBeVisible();
      const boxes = page.getByRole("checkbox");
      expect(await boxes.count()).toBeGreaterThan(3);
      await expectNoHorizontalOverflow(page);

      const first = boxes.first();
      const checkedLabel = (await page.locator(`label[for="${(await first.getAttribute("id")) ?? ""}"]`).textContent()) ?? "";
      await first.check();
      await page.evaluate(() => {
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: {
            writeText: (text: string) => {
              Object.assign(window, { __copied: text });
              return Promise.resolve();
            },
          },
        });
      });
      await page.getByRole("button", { name: t(locale, "shopping.copy") }).click();
      const copied = await page.waitForFunction(() => (window as unknown as { __copied?: string }).__copied).then(async (handle) => (await handle.jsonValue()) ?? "");
      expect(copied.split("\n")[0]).toBe(t(locale, "shopping.textTitle_other", { count: 2 }));
      expect(copied).toContain(a);
      expect(copied).toContain(b);
      expect(copied).not.toContain(`- ${checkedLabel}\n`);
      expect(copied.trimEnd().endsWith(t(locale, "shopping.basisNote"))).toBe(true);

      await page.evaluate(() => {
        window.print = () => {
          Object.assign(window, { __printed: true });
        };
      });
      await page.getByRole("button", { name: t(locale, "shopping.print") }).click();
      expect(await page.evaluate(() => (window as unknown as { __printed?: boolean }).__printed)).toBe(true);
      await page.emulateMedia({ media: "print" });
      await expect(page.getByRole("button", { name: t(locale, "shopping.copy") })).toBeHidden();
      await expect(page.getByRole("banner")).toBeHidden();
      await expect(boxes.first()).toBeHidden();
      await expect(page.getByText("☐").first()).toBeVisible();
      await page.emulateMedia({ media: "screen" });

      // The list is memory only (ADR-032 D5).
      await page.reload();
      await heading1(page, t(locale, "nav.views.targets"));
      await expect(page.getByText(t(locale, "nav.reloadNotice"))).toBeVisible();
      await expect(page.getByRole("banner").getByRole("link", { name: t(locale, "shopping.headerLink_other", { count: 2 }) })).toHaveCount(0);
    });
  });
}
