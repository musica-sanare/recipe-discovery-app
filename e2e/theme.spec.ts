import { readFileSync } from "node:fs";
import type { Page } from "@playwright/test";
import { BROWSER_LOCALE, choosePresetCut, expect, expectNoAxeViolations, expectNoHorizontalOverflow, heading1, LOCALES, openTargets, search, t, test, type Locale } from "./support.ts";

// The theme choice of ADR-042: system, light, or dark, stored only for light and dark, and
// applied before the first paint. Colors are read through retrying assertions, because the
// reduced-motion rule of src/styles.css gives every property a very short transition.
const THEME_KEY = "recipe-discovery.theme";
const LIGHT_BG = "rgb(251, 246, 238)";
const DARK_BG = "rgb(15, 17, 20)";
const RECIPE = "/recipes/beef_potato_tomato_stew";
const TOKENS = [...new Set([...readFileSync("src/styles.css", "utf8").matchAll(/--color-([a-z-]+):\s*#[0-9a-f]{6};/g)].map((match) => `--color-${match[1] ?? ""}`))];

const control = (page: Page, locale: Locale) => page.getByRole("combobox", { name: t(locale, "theme.label") });
const expectBackground = (page: Page, color: string) => expect(page.locator("body")).toHaveCSS("background-color", color);
const storedKeys = (page: Page) => page.evaluate(() => Object.keys(localStorage).sort());
const tokenValues = (page: Page) => page.evaluate((names) => names.map((name) => `${name}: ${getComputedStyle(document.documentElement).getPropertyValue(name).trim()}`), TOKENS);

async function storeChoice(page: Page, choice: string): Promise<void> {
  await page.addInitScript(([key, value]) => {
    localStorage.setItem(key ?? "", value ?? "");
  }, [THEME_KEY, choice]);
}

for (const locale of LOCALES) {
  test.describe(`theme control in ${locale}`, () => {
    test.use({ locale: BROWSER_LOCALE[locale] });

    test("names the control and its three choices, and starts on system with nothing stored", async ({ page }) => {
      await openTargets(page, locale);
      const select = control(page, locale);
      await expect(select).toHaveValue("system");
      await expect(select.getByRole("option")).toHaveText([t(locale, "theme.system"), t(locale, "theme.light"), t(locale, "theme.dark")]);
      expect(await storedKeys(page)).toEqual([]);
    });

    test("fits at 320, 375, and from md with the shopping link in the header", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      await page.goto(RECIPE);
      await page.getByRole("button", { name: t(locale, "shopping.add") }).click();
      await expect(page.getByRole("banner").getByRole("link")).toHaveCount(2);
      for (const select of await page.getByRole("banner").getByRole("combobox").all()) {
        expect((await select.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(24);
      }
      await expectNoHorizontalOverflow(page);
      await page.setViewportSize({ width: 375, height: 800 });
      await expectNoHorizontalOverflow(page);
      // From md the header sticks, and `scroll-padding-top` keeps focused elements below 80 px of it (WCAG 2.4.11).
      await page.setViewportSize({ width: 768, height: 800 });
      expect((await page.getByRole("banner").boundingBox())?.height ?? 0).toBeLessThanOrEqual(80);
    });

    for (const { name, os, stored } of [
      { name: "system on a dark OS", os: "dark", stored: undefined },
      { name: "light on a dark OS", os: "dark", stored: "light" },
      { name: "dark on a light OS", os: "light", stored: "dark" },
    ] as const) {
      test(`has no accessibility violation with ${name}`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: os });
        if (stored !== undefined) await storeChoice(page, stored);
        await openTargets(page, locale);
        await expectNoAxeViolations(page);
        await choosePresetCut(page);
        await search(page, locale);
        await heading1(page, t(locale, "nav.views.candidates"));
        await expectNoAxeViolations(page);
        await page.locator("article a").first().click();
        await expect(page.getByRole("heading", { level: 2, name: t(locale, "detail.perServing") })).toBeVisible();
        await expectNoAxeViolations(page);
      });
    }
  });
}

test.describe("theme choice", () => {
  test.use({ locale: BROWSER_LOCALE.ja });

  test("applies each choice, keeps it over a reload, and stores only light and dark", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await openTargets(page, "ja");
    await expectBackground(page, DARK_BG);

    await control(page, "ja").selectOption("light");
    await expectBackground(page, LIGHT_BG);
    await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
    expect(await storedKeys(page)).toEqual([THEME_KEY]);
    await page.reload();
    await heading1(page, t("ja", "nav.views.targets"));
    await expect(control(page, "ja")).toHaveValue("light");
    await expectBackground(page, LIGHT_BG);

    await page.emulateMedia({ colorScheme: "light" });
    await control(page, "ja").selectOption("dark");
    await expectBackground(page, DARK_BG);
    await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
    await page.reload();
    await heading1(page, t("ja", "nav.views.targets"));
    await expect(control(page, "ja")).toHaveValue("dark");
    await expectBackground(page, DARK_BG);

    await control(page, "ja").selectOption("system");
    await expectBackground(page, LIGHT_BG);
    expect(await storedKeys(page)).toEqual([]);
    await expect(page.locator("html")).not.toHaveAttribute("data-theme");
  });

  test("follows a change of the OS setting on system, and ignores it on a choice", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await openTargets(page, "ja");
    await expectBackground(page, LIGHT_BG);
    await page.emulateMedia({ colorScheme: "dark" });
    await expectBackground(page, DARK_BG);

    await control(page, "ja").selectOption("light");
    await expectBackground(page, LIGHT_BG);
    await page.emulateMedia({ colorScheme: "light" });
    await page.emulateMedia({ colorScheme: "dark" });
    await expectBackground(page, LIGHT_BG);
  });

  test("gives the OS setting and the choice the same value for every token", async ({ page }) => {
    expect(TOKENS.length).toBeGreaterThan(20);
    await page.emulateMedia({ colorScheme: "dark" });
    await openTargets(page, "ja");
    const osDark = await tokenValues(page);
    await page.emulateMedia({ colorScheme: "light" });
    const osLight = await tokenValues(page);
    expect(osDark).not.toEqual(osLight);

    await control(page, "ja").selectOption("dark");
    expect(await tokenValues(page)).toEqual(osDark);
    await page.emulateMedia({ colorScheme: "dark" });
    await control(page, "ja").selectOption("light");
    expect(await tokenValues(page)).toEqual(osLight);
  });

  for (const { stored, os, want } of [
    { stored: "dark", os: "light", want: DARK_BG },
    { stored: "light", os: "dark", want: LIGHT_BG },
  ] as const) {
    test(`shows no frame of the other theme with ${stored} on a ${os} OS and a slow startup chunk`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: os });
      await storeChoice(page, stored);
      await page.route("**/assets/index-*.js", async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        await route.continue();
      });
      await page.addInitScript(() => {
        const frames: string[] = [];
        Object.assign(window, { __frames: frames });
        const tick = () => {
          const body = document.querySelector("body");
          if (body !== null && getComputedStyle(document.documentElement).getPropertyValue("--color-bg") !== "") frames.push(getComputedStyle(body).backgroundColor);
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      await openTargets(page, "ja");
      const frames = await page.evaluate(() => (window as unknown as { __frames: string[] }).__frames);
      expect(frames.length).toBeGreaterThan(0);
      expect(frames.filter((color) => color !== want)).toEqual([]);
    });
  }

  for (const { name, os, stored } of [
    { name: "the dark choice", os: "light", stored: "dark" },
    { name: "a dark OS", os: "dark", stored: undefined },
  ] as const) {
    test(`prints with the light tokens under ${name}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: os });
      if (stored !== undefined) await storeChoice(page, stored);
      await page.goto(RECIPE);
      await expectBackground(page, DARK_BG);
      await page.emulateMedia({ media: "print" });
      await expectBackground(page, LIGHT_BG);
      await expect(page.locator("body")).toHaveCSS("color", "rgb(42, 39, 34)");
      await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
    });
  }

  test("ignores an invalid stored value", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await storeChoice(page, "purple");
    await openTargets(page, "ja");
    await expect(page.locator("html")).not.toHaveAttribute("data-theme");
    await expect(control(page, "ja")).toHaveValue("system");
    await expectBackground(page, LIGHT_BG);
  });

  test("works when storage fails, and the choice lasts for the page", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new DOMException("denied", "SecurityError");
        },
      });
    });
    await openTargets(page, "ja");
    await expectBackground(page, DARK_BG);
    await control(page, "ja").selectOption("light");
    await expectBackground(page, LIGHT_BG);
  });

  test("agrees with the choice when the early script fails to load", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await storeChoice(page, "dark");
    await page.route("**/theme-init.js", (route) => route.abort());
    await openTargets(page, "ja");
    await expect(control(page, "ja")).toHaveValue("dark");
    await expectBackground(page, DARK_BG);
  });

  test("serves the early script with the security headers and without the immutable rule", async ({ request }) => {
    const response = await request.get("/theme-init.js");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-security-policy"]).toContain("script-src 'self'");
    expect(response.headers()["cache-control"] ?? "").not.toContain("immutable");
  });
});
