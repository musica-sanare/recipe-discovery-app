/**
 * On-demand evaluation of the free-text conditions (ADR-034 D4, Stage 12.3); never a CI
 * job. `parser` runs the deterministic parser (ADR-034, revised again); `expected` is a
 * fake that returns each case's expected output and checks the pipeline. `--split dev`
 * is for tuning, `--split holdout` decides acceptance.
 *
 *   node tools/evaluate-ai.ts [--adapter parser|expected] [--split all|dev|holdout] [--locale ja]... [--intent <id>]... [--cases] [--json]
 */
import { parseArgs } from "node:util";
import type { SuggestionAdapter } from "../server/ai/adapter.ts";
import { isLocale, SUPPORTED_LOCALES, type Locale } from "../shared/locales.ts";
import { loadEvaluationSet, splitIntents, SPLITS, type Split } from "./ai-evaluation/cases.ts";
import { FIELDS, THRESHOLDS, canonicalOutput, outputOf, report, type Scores } from "./ai-evaluation/metrics.ts";
import { expectedAnswers, parserAdapter, runEvaluation } from "./ai-evaluation/run.ts";

const { values } = parseArgs({
  options: {
    adapter: { type: "string", default: "parser" },
    split: { type: "string", default: "all" },
    locale: { type: "string", multiple: true },
    intent: { type: "string", multiple: true },
    cases: { type: "boolean", default: false },
    json: { type: "boolean", default: false },
  },
});

const locales: Locale[] = [];
for (const locale of values.locale ?? SUPPORTED_LOCALES) {
  if (!isLocale(locale)) throw new Error(`Unknown locale ${locale}`);
  locales.push(locale);
}

const isSplit = (split: string): split is Split => (SPLITS as readonly string[]).includes(split);
if (!isSplit(values.split)) throw new Error(`Unknown split ${values.split}: use ${SPLITS.join(", ")}.`);
const fullSet = splitIntents(loadEvaluationSet(), values.split);
const unknownIntents = (values.intent ?? []).filter((id) => !fullSet.intents.some((intent) => intent.id === id));
if (unknownIntents.length > 0) throw new Error(`Unknown intents: ${unknownIntents.join(", ")}`);
const set = values.intent === undefined ? fullSet : { ...fullSet, intents: fullSet.intents.filter((intent) => values.intent?.includes(intent.id)) };

let adapter: SuggestionAdapter;
if (values.adapter === "parser") adapter = parserAdapter();
else if (values.adapter === "expected") adapter = expectedAnswers(set);
else throw new Error(`Unknown adapter ${values.adapter}: use "parser" or "expected".`);

const results = await runEvaluation(set, adapter, locales);
const result = report(results, set.intents);
const planned = set.intents.length * locales.length;

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
  console.log(JSON.stringify({ adapter: values.adapter, version: set.version, review: set.review, planned, ...result }, null, 2));
} else {
  console.log(`Adapter: ${values.adapter}; split ${values.split}; evaluation set version ${String(set.version)}; review ${JSON.stringify(set.review)}`);
  if (values.cases) {
    for (const { intent, locale, result: caseResult } of results) {
      const output = canonicalOutput(outputOf(caseResult)) ?? `${caseResult.body.kind === "error" ? caseResult.body.error : ""}${caseResult.rejection === undefined ? "" : ` (${caseResult.rejection})`}`;
      console.log(`${intent} ${locale} ${String(caseResult.status)} ${output}`);
    }
  }
  console.log(["locale  ", "case", "  prec.", " recall", ...FIELDS.map((field) => field.slice(0, 7).padStart(8)), "forbid.", "decline", "  topic"].join(" "));
  console.log(line("all", result.overall));
  for (const locale of locales) {
    const scores = result.byLocale[locale];
    if (scores !== undefined) console.log(line(locale, scores));
  }
  console.log(`Cross-locale consistency: ${percent(result.crossLocaleConsistency)}`);
  console.log(`Errors: ${JSON.stringify(result.overall.errors)}; rejections: ${JSON.stringify(result.overall.rejections)}`);
  if (results.length < planned) console.log(`Stopped after ${String(results.length)} of ${String(planned)} cases.`);
  console.log(`Thresholds: ${JSON.stringify(THRESHOLDS)}`);
  console.log(result.failedThresholds.length === 0 ? "All thresholds met." : `Failed thresholds: ${result.failedThresholds.join(", ")}`);
}
if (result.failedThresholds.length > 0 || results.length < planned) process.exitCode = 1;
