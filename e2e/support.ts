import AxeBuilder from "@axe-core/playwright";
import { test as base, expect, type Page } from "@playwright/test";
import { en } from "../src/i18n/messages/en.ts";
import { es } from "../src/i18n/messages/es.ts";
import { fr } from "../src/i18n/messages/fr.ts";
import { ja } from "../src/i18n/messages/ja.ts";

export type Locale = "ja" | "en" | "es" | "fr";
export const LOCALES: readonly Locale[] = ["ja", "en", "es", "fr"];
/** Browser languages that the app's detection maps to each locale. */
export const BROWSER_LOCALE: Readonly<Record<Locale, string>> = { ja: "ja-JP", en: "en-US", es: "es-ES", fr: "fr-FR" };

const CATALOGS = { ja, en, es, fr } as const;

/** A UI string from the typed catalogs, with `{{name}}` placeholders filled. */
export function t(locale: Locale, key: string, vars: Readonly<Record<string, string | number>> = {}): string {
  let value: unknown = CATALOGS[locale];
  for (const part of key.split(".")) {
    value = typeof value === "object" && value !== null ? (value as Record<string, unknown>)[part] : undefined;
  }
  if (typeof value !== "string") throw new Error(`Missing catalog key ${locale}:${key}`);
  return value.replace(/\{\{(\w+)\}\}/g, (_, name: string) => String(vars[name] ?? `{{${name}}}`));
}

/**
 * Every test fails if the page requests another origin or reports a CSP violation
 * (docs/en/ARCHITECTURE.md §8).
 */
export const test = base.extend<{ guard: undefined }>({
  guard: [
    async ({ page, baseURL }, use) => {
      const origin = new URL(baseURL ?? "http://localhost").origin;
      const external: string[] = [];
      page.on("request", (request) => {
        const url = new URL(request.url());
        if (url.protocol.startsWith("http") && url.origin !== origin) external.push(request.url());
      });
      await page.addInitScript(() => {
        const violations: string[] = [];
        Object.assign(window, { __cspViolations: violations });
        document.addEventListener("securitypolicyviolation", (event) => {
          violations.push(`${event.violatedDirective} ${event.blockedURI} ${event.sourceFile}:${String(event.lineNumber)}:${String(event.columnNumber)} ${event.sample}`);
        });
      });
      await use(undefined);
      expect(external, "requests to another origin").toEqual([]);
      const violations = await page.evaluate(() => (window as unknown as { __cspViolations?: string[] }).__cspViolations ?? []).catch(() => []);
      expect(violations, "CSP violations").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

export async function heading1(page: Page, name: string): Promise<void> {
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
}

/** No element is wider than the viewport outside the scrolling table regions (docs/en/UI_DESIGN.md §5). */
export async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const wide = [...document.querySelectorAll("body *")]
      .filter((element) => element.closest('[role="region"]') === null && element.getBoundingClientRect().right > width + 1)
      .map((element) => `${element.tagName.toLowerCase()} ${element.textContent.slice(0, 40)}`);
    return { page: document.documentElement.scrollWidth - width, wide: wide.slice(0, 5) };
  });
  expect(overflow).toEqual({ page: 0, wide: [] });
}

/** axe-core in the real browser, including color contrast (WCAG 2.2 AA). */
export async function expectNoAxeViolations(page: Page): Promise<void> {
  // Contrast is checked on the final state: cards that are still dealing in (ADR-041 D5) are partly transparent.
  await page.evaluate(() => Promise.all(document.getAnimations().map((animation) => animation.finished.catch(() => undefined))));
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  expect(results.violations.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`)).toEqual([]);
}

export async function openTargets(page: Page, locale: Locale): Promise<void> {
  await page.goto("/");
  await heading1(page, t(locale, "nav.views.targets"));
  await expect(page.locator("html")).toHaveAttribute("lang", locale);
}

export async function openAdvanced(page: Page, locale: Locale): Promise<void> {
  const summary = page.locator("#targets-advanced > summary", { hasText: t(locale, "targets.advanced") });
  if ((await page.locator("#targets-advanced[open]").count()) === 0) await summary.click();
}

/** Fills a number field, opening the advanced section when the field is inside it. */
export async function setNumber(page: Page, field: string, value: string): Promise<void> {
  const input = page.locator(`#targets-${field}`);
  if (!(await input.isVisible())) await page.locator("#targets-advanced > summary").click();
  await input.fill(value);
}

export async function search(page: Page, locale: Locale): Promise<void> {
  await page.getByRole("button", { name: t(locale, "targets.search") }).click();
}

export async function choosePresetCut(page: Page): Promise<void> {
  await page.locator("input[name=preset]").first().check();
}

export async function cardNames(page: Page): Promise<string[]> {
  return page.getByRole("article").getByRole("heading", { level: 3 }).allTextContents();
}
