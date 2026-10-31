/**
 * On-demand evaluation of the AI free-text conditions (ADR-034 D4, Stage 12.3); never a
 * CI job. `expected` is a fake that returns each case's expected output; `workers-ai`
 * calls the Workers AI REST API within the free allocation, with CLOUDFLARE_ACCOUNT_ID
 * and CLOUDFLARE_API_TOKEN from the environment.
 *
 *   node tools/evaluate-ai.ts [--adapter expected|workers-ai] [--model <id>] [--locale ja]... [--intent <id>]... [--cases] [--json]
 */
import { parseArgs } from "node:util";
import type { SuggestionAdapter } from "../server/ai/adapter.ts";
import { WORKERS_AI_MODELS, workersAiAdapter, type WorkersAiModel } from "../server/ai/workers-ai.ts";
import { isLocale, SUPPORTED_LOCALES, type Locale } from "../shared/locales.ts";
import { loadEvaluationSet } from "./ai-evaluation/cases.ts";
import { FIELDS, THRESHOLDS, canonicalOutput, outputOf, report, type Scores } from "./ai-evaluation/metrics.ts";
import { expectedAnswers, promptDictionary, runEvaluation } from "./ai-evaluation/run.ts";
import { credentialsFromEnv, neurons, restRunner, type Usage } from "./ai-evaluation/workers-ai-rest.ts";

const { values } = parseArgs({
  options: {
    adapter: { type: "string", default: "expected" },
    model: { type: "string", default: WORKERS_AI_MODELS[0] },
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
const isModel = (model: string): model is WorkersAiModel => (WORKERS_AI_MODELS as readonly string[]).includes(model);

const fullSet = loadEvaluationSet();
const unknownIntents = (values.intent ?? []).filter((id) => !fullSet.intents.some((intent) => intent.id === id));
if (unknownIntents.length > 0) throw new Error(`Unknown intents: ${unknownIntents.join(", ")}`);
const set = values.intent === undefined ? fullSet : { ...fullSet, intents: fullSet.intents.filter((intent) => values.intent?.includes(intent.id)) };

const usage: Usage = { promptTokens: 0, completionTokens: 0, requests: 0 };
let adapter: SuggestionAdapter;
let model: WorkersAiModel | undefined;
if (values.adapter === "expected") {
  adapter = expectedAnswers(set);
} else if (values.adapter === "workers-ai") {
  if (!isModel(values.model)) throw new Error(`Unknown model ${values.model}; candidates: ${WORKERS_AI_MODELS.join(", ")}`);
  model = values.model;
  adapter = workersAiAdapter({ model, run: restRunner(credentialsFromEnv(), usage), dictionary: promptDictionary });
} else {
  throw new Error(`Unknown adapter ${values.adapter}: use "expected" or "workers-ai".`);
}

const results = await runEvaluation(set, adapter, locales);
const result = report(results, set.intents);
const planned = set.intents.length * locales.length;
const usageSummary = model === undefined ? undefined : { ...usage, neurons: Math.round(neurons(model, usage)) };

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
  console.log(JSON.stringify({ adapter: values.adapter, model, version: set.version, review: set.review, planned, usage: usageSummary, ...result }, null, 2));
} else {
  console.log(`Adapter: ${values.adapter}${model === undefined ? "" : ` (${model})`}; evaluation set version ${String(set.version)}; review ${JSON.stringify(set.review)}`);
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
  if (usageSummary !== undefined) console.log(`Usage: ${JSON.stringify(usageSummary)}`);
  if (results.length < planned) console.log(`Stopped after ${String(results.length)} of ${String(planned)} cases: the daily free allocation is used up.`);
  console.log(`Thresholds: ${JSON.stringify(THRESHOLDS)}`);
  console.log(result.failedThresholds.length === 0 ? "All thresholds met." : `Failed thresholds: ${result.failedThresholds.join(", ")}`);
}
if (result.failedThresholds.length > 0 || results.length < planned) process.exitCode = 1;
