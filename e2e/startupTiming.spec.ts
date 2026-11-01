import { mkdirSync, writeFileSync } from "node:fs";
import type { Page } from "@playwright/test";
import { BROWSER_LOCALE, heading1, t, test, type Locale } from "./support.ts";

// Startup and language-switch timing for per-locale loading (ADR-039), with the HTTP cache
// disabled so every run loads the chunks and bundles as a first visit does. Chromium with
// CDP CPU throttling, like e2e/timing.spec.ts; run with `npm run test:e2e:timing`. The numbers
// go to test-results/timing-startup.json.
const RATES = [1, 4, 6] as const;
const RUNS = 10;
const WARM_UP = 1;
const LOCALE_KEY = "recipe-discovery.locale";

test.use({ locale: BROWSER_LOCALE.ja });
test.describe.configure({ mode: "serial" });

function summary(samples: readonly number[]) {
  const sorted = [...samples].sort((a, b) => a - b);
  const at = (q: number) => sorted[Math.min(sorted.length - 1, Math.ceil(q * sorted.length) - 1)] ?? Number.NaN;
  return { median: Number(at(0.5).toFixed(1)), p90: Number(at(0.9).toFixed(1)) };
}

/** Records when the header (the UI catalog is in use) and the view heading (the content is ready) first appear. */
async function recordMilestones(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const marks: { header?: number; heading?: number } = {};
    Object.assign(window, { __marks: marks });
    new MutationObserver(() => {
      if (marks.header === undefined && document.querySelector("header label") !== null) marks.header = performance.now();
      if (marks.heading === undefined && document.querySelector("main h1") !== null) marks.heading = performance.now();
    }).observe(document, { childList: true, subtree: true });
  });
}

async function startup(page: Page, locale: Locale): Promise<{ header: number; heading: number }> {
  await page.goto("about:blank");
  await page.goto("/");
  await heading1(page, t(locale, "nav.views.targets"));
  return page.evaluate(() => {
    const { header, heading } = (window as unknown as { __marks: { header?: number; heading?: number } }).__marks;
    if (header === undefined || heading === undefined) throw new Error("Milestones missing");
    return { header, heading };
  });
}

/** Chooses `next` in the language switcher and resolves with the time until the view heading shows `expected`. */
async function timeSwitch(page: Page, next: Locale, expected: string): Promise<number> {
  return page.evaluate(
    async ({ next, expected }) => {
      const select = document.querySelector("header select");
      if (!(select instanceof HTMLSelectElement)) throw new Error("No language switcher");
      const start = performance.now();
      select.value = next;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      await new Promise<void>((resolve) => {
        const check = () => {
          if (document.querySelector("main h1")?.textContent === expected) resolve();
          else requestAnimationFrame(check);
        };
        check();
      });
      document.body.getBoundingClientRect();
      return performance.now() - start;
    },
    { next, expected },
  );
}

const results: Record<string, Record<string, ReturnType<typeof summary>>> = {};

for (const rate of RATES) {
  test(`startup and switch timing at ${String(rate)}× CPU slowdown @timing`, async ({ page }) => {
    test.setTimeout(240_000);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate });
    await recordMilestones(page);
    const rows: Record<string, ReturnType<typeof summary>> = {};

    for (const locale of ["ja", "fr"] as const) {
      await page.goto("/");
      await page.evaluate(([key, value]) => {
        localStorage.setItem(key, value);
      }, [LOCALE_KEY, locale] as const);
      const header: number[] = [];
      const heading: number[] = [];
      for (let run = 0; run < WARM_UP + RUNS; run++) {
        const marks = await startup(page, locale);
        if (run >= WARM_UP) {
          header.push(marks.header);
          heading.push(marks.heading);
        }
      }
      rows[`startup ${locale}: header`] = summary(header);
      rows[`startup ${locale}: view heading`] = summary(heading);
    }

    const switches: number[] = [];
    for (let run = 0; run < WARM_UP + RUNS; run++) {
      await page.evaluate((key) => {
        localStorage.setItem(key, "ja");
      }, LOCALE_KEY);
      await startup(page, "ja");
      const ms = await timeSwitch(page, "fr", t("fr", "nav.views.targets"));
      if (run >= WARM_UP) switches.push(ms);
    }
    rows["switch ja → fr"] = summary(switches);

    results[`${String(rate)}x`] = rows;
    console.log(`CPU ${String(rate)}×`, JSON.stringify(rows));
    mkdirSync("test-results", { recursive: true });
    writeFileSync("test-results/timing-startup.json", `${JSON.stringify({ measured: new Date().toISOString(), browser: page.context().browser()?.version(), runs: RUNS, results }, null, 2)}\n`);
  });
}
