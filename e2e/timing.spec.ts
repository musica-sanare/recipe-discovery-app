import { writeFileSync, mkdirSync } from "node:fs";
import type { Page } from "@playwright/test";
import { BROWSER_LOCALE, choosePresetCut, expect, heading1, openAdvanced, openTargets, search, setNumber, t, test } from "./support.ts";

// Phone-class timing (open question 17, ADR-030 D10): click to committed and laid-out DOM,
// in Chromium with CDP CPU throttling. Run with `npm run test:e2e:timing`; the numbers are
// written to test-results/timing.json and recorded in docs/working/DECISIONS.md "Stage 5.4".
const RATES = [1, 4, 6] as const;
const RUNS = 15;
const WARM_UP = 2;

test.use({ locale: BROWSER_LOCALE.ja });
test.describe.configure({ mode: "serial" });

/** Clicks the button and resolves with the time until the first DOM commit under `main` has been laid out. */
async function timeClick(page: Page, name: string): Promise<number> {
  return page.evaluate(async (label) => {
    const button = [...document.querySelectorAll("button")].find((element) => element.textContent === label || element.getAttribute("aria-label") === label);
    const main = document.querySelector("main");
    if (button === undefined || main === null) throw new Error(`No button ${label}`);
    const committed = new Promise<void>((resolve) => {
      const observer = new MutationObserver(() => {
        observer.disconnect();
        resolve();
      });
      observer.observe(main, { subtree: true, childList: true, characterData: true, attributes: true });
    });
    const start = performance.now();
    button.click();
    await committed;
    document.body.getBoundingClientRect();
    return performance.now() - start;
  }, name);
}

function summary(samples: readonly number[]) {
  const sorted = [...samples].sort((a, b) => a - b);
  const at = (q: number) => sorted[Math.min(sorted.length - 1, Math.ceil(q * sorted.length) - 1)] ?? Number.NaN;
  return { median: Number(at(0.5).toFixed(1)), p90: Number(at(0.9).toFixed(1)), min: Number((sorted[0] ?? Number.NaN).toFixed(1)), max: Number((sorted.at(-1) ?? Number.NaN).toFixed(1)) };
}

type Setup = (page: Page) => Promise<void>;
const SEARCHES: Readonly<Record<string, Setup>> = {
  "cut": async (page) => {
    await choosePresetCut(page);
  },
  "bulk": async (page) => {
    await page.locator("input[name=preset]").nth(2).check();
  },
  "maintain, tofu required": async (page) => {
    await page.locator("input[name=preset]").nth(1).check();
    await openAdvanced(page, "ja");
    const box = page.locator("#targets-required");
    await box.fill("豆腐");
    await box.press("Enter");
  },
  "bulk, ≤ 15 min": async (page) => {
    await page.locator("input[name=preset]").nth(2).check();
    await setNumber(page, "maxMinutes", "15");
  },
};

const results: Record<string, Record<string, ReturnType<typeof summary>>> = {};

for (const rate of RATES) {
  test(`timing at ${String(rate)}× CPU slowdown @timing`, async ({ page }) => {
    test.setTimeout(240_000);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate });
    const searchLabel = t("ja", "targets.search");
    const rows: Record<string, ReturnType<typeof summary>> = {};

    for (const [name, setup] of Object.entries(SEARCHES)) {
      await openTargets(page, "ja");
      await setup(page);
      const samples: number[] = [];
      for (let run = 0; run < WARM_UP + RUNS; run++) {
        const ms = await timeClick(page, searchLabel);
        await heading1(page, t("ja", "nav.views.candidates"));
        if (run >= WARM_UP) samples.push(ms);
        await page.goBack();
        await heading1(page, t("ja", "nav.views.targets"));
      }
      rows[`search: ${name}`] = summary(samples);
    }

    // Re-suggestion: "show a different type" on the cut search; the set may repeat once all are shown.
    await openTargets(page, "ja");
    await choosePresetCut(page);
    await search(page, "ja");
    await heading1(page, t("ja", "nav.views.candidates"));
    const resuggest: number[] = [];
    for (let run = 0; run < WARM_UP + RUNS; run++) {
      const ms = await timeClick(page, t("ja", "candidates.differentType"));
      if (run >= WARM_UP) resuggest.push(ms);
    }
    rows["re-suggestion"] = summary(resuggest);

    // Recalculation: one servings step in the detail view, alternating up and down.
    await page.goto("/recipes/beef_potato_tomato_stew");
    await expect(page.getByRole("heading", { level: 2, name: t("ja", "detail.perServing") })).toBeVisible();
    const field = t("ja", "adjust.servings");
    const recalc: number[] = [];
    for (let run = 0; run < WARM_UP + RUNS; run++) {
      const ms = await timeClick(page, t("ja", run % 2 === 0 ? "adjust.increase" : "adjust.decrease", { field }));
      if (run >= WARM_UP) recalc.push(ms);
    }
    rows["recalculation"] = summary(recalc);

    results[`${String(rate)}x`] = rows;
    console.log(`CPU ${String(rate)}×`, JSON.stringify(rows));
    mkdirSync("test-results", { recursive: true });
    writeFileSync("test-results/timing.json", `${JSON.stringify({ measured: new Date().toISOString(), browser: page.context().browser()?.version(), runs: RUNS, results }, null, 2)}\n`);
  });
}
