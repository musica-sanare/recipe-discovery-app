/**
 * On-demand evaluation of the AI free-text conditions (ADR-034 D4, Stage 12.3); never a
 * CI job. Only the fake adapter exists until the owner approves access to Workers AI.
 *
 *   node tools/evaluate-ai.ts [--adapter expected] [--locale ja] [--json]
 */
import { parseArgs } from "node:util";
import { isLocale, SUPPORTED_LOCALES, type Locale } from "../shared/locales.ts";
import { loadEvaluationSet } from "./ai-evaluation/cases.ts";
import { FIELDS, THRESHOLDS, report, type Scores } from "./ai-evaluation/metrics.ts";
import { expectedAnswers, runEvaluation } from "./ai-evaluation/run.ts";

const { values } = parseArgs({
  options: {
    adapter: { type: "string", default: "expected" },
    locale: { type: "string", multiple: true },
    json: { type: "boolean", default: false },
  },
});

const locales: Locale[] = [];
for (const locale of values.locale ?? SUPPORTED_LOCALES) {
  if (!isLocale(locale)) throw new Error(`Unknown locale ${locale}`);
  locales.push(locale);
}
if (values.adapter !== "expected") {
  throw new Error(`Unknown adapter ${values.adapter}: only "expected" (a fake returning the expected outputs) exists until the owner approves Workers AI access.`);
}

const set = loadEvaluationSet();
const results = await runEvaluation(set, expectedAnswers(set), locales);
const result = report(results, set.intents);

const percent = (value: number) => `${(value * 100).toFixed(1)} %`;
const line = (name: string, scores: Scores) =>
  [
    name.padEnd(8),
    String(scores.cases).padStart(4),
    percent(scores.foodPrecision).padStart(8),
    percent(scores.foodRecall).padStart(8),
    ...FIELDS.map((field) => percent(scores.fieldAccuracy[field]).padStart(8)),
    percent(scores.forbiddenRate).padStart(8),
    percent(scores.outOfScopeDeclined).padStart(8),
    percent(scores.outOfScopeTopic).padStart(8),
  ].join(" ");

if (values.json) {
  console.log(JSON.stringify({ adapter: values.adapter, version: set.version, review: set.review, ...result }, null, 2));
} else {
  console.log(`Adapter: ${values.adapter}; evaluation set version ${String(set.version)}; review ${JSON.stringify(set.review)}`);
  console.log(["locale  ", "case", "  prec.", " recall", ...FIELDS.map((field) => field.slice(0, 7).padStart(8)), "forbid.", "decline", "  topic"].join(" "));
  console.log(line("all", result.overall));
  for (const locale of locales) {
    const scores = result.byLocale[locale];
    if (scores !== undefined) console.log(line(locale, scores));
  }
  console.log(`Cross-locale consistency: ${percent(result.crossLocaleConsistency)}`);
  console.log(`Errors: ${JSON.stringify(result.overall.errors)}; rejections: ${JSON.stringify(result.overall.rejections)}`);
  console.log(`Thresholds: ${JSON.stringify(THRESHOLDS)}`);
  console.log(result.failedThresholds.length === 0 ? "All thresholds met." : `Failed thresholds: ${result.failedThresholds.join(", ")}`);
}
if (result.failedThresholds.length > 0) process.exitCode = 1;
