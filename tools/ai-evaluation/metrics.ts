/**
 * Metrics and release thresholds of the AI free-text conditions (ADR-034 D4). Every case
 * goes through the endpoint core, so the scores include the runtime validation: a
 * rejected output counts as no output.
 */
import { SUPPORTED_LOCALES, type Locale } from "../../shared/locales.ts";
import type { ProviderOutput, RejectionReason, Suggestion } from "../../shared/suggestion.ts";
import type { SuggestResult } from "../../server/ai/suggest.ts";
import type { Intent } from "./cases.ts";

export const THRESHOLDS = {
  foodPrecision: 0.95,
  foodRecall: 0.9,
  forbiddenRate: 0,
  outOfScopeDeclined: 0.95,
  crossLocaleConsistency: 0.9,
} as const;

export interface CaseResult {
  readonly intent: string;
  readonly locale: Locale;
  readonly result: SuggestResult;
}

export const FIELDS = ["requiredFoods", "excludedFoods", "maxMinutes", "equipment", "cuisines"] as const;
type Field = (typeof FIELDS)[number];

export interface Scores {
  readonly cases: number;
  readonly foodPrecision: number;
  readonly foodRecall: number;
  readonly fieldAccuracy: Readonly<Record<Field, number>>;
  /** Share of all outputs rejected for a forbidden field or expression. */
  readonly forbiddenRate: number;
  readonly outOfScopeDeclined: number;
  readonly outOfScopeTopic: number;
  readonly errors: Readonly<Partial<Record<string, number>>>;
  readonly rejections: Readonly<Partial<Record<RejectionReason, number>>>;
}

export interface Report {
  readonly overall: Scores;
  readonly byLocale: Readonly<Partial<Record<Locale, Scores>>>;
  /** Intents whose locales all returned the same valid output. */
  readonly crossLocaleConsistency: number;
  readonly failedThresholds: readonly string[];
}

const ratio = (part: number, whole: number) => (whole === 0 ? 1 : part / whole);
const sorted = (items: readonly string[]) => [...items].sort();
const canonicalSet = (items: readonly string[]) => JSON.stringify(sorted(items));

function canonicalField(suggestion: Suggestion, field: Field): string {
  switch (field) {
    case "requiredFoods":
      return JSON.stringify(sorted(suggestion.requiredFoods.map(canonicalSet)));
    case "maxMinutes":
      return String(suggestion.maxMinutes);
    case "equipment":
      return suggestion.equipment === undefined ? "none" : canonicalSet(suggestion.equipment);
    case "excludedFoods":
    case "cuisines":
      return canonicalSet(suggestion[field]);
  }
}

/** One string per output, equal for outputs that mean the same; undefined for no valid output. */
export function canonicalOutput(output: ProviderOutput | undefined): string | undefined {
  if (output === undefined) return undefined;
  if (output.kind === "out_of_scope") return `out_of_scope:${output.topic}`;
  return FIELDS.map((field) => canonicalField(output.conditions, field)).join("|");
}

export function outputOf(result: SuggestResult): ProviderOutput | undefined {
  return result.body.kind === "error" ? undefined : result.body;
}

const foodKeys = (suggestion: Suggestion | undefined) =>
  suggestion === undefined ? new Set<string>() : new Set([...suggestion.requiredFoods.flat().map((food) => `required:${food}`), ...suggestion.excludedFoods.map((food) => `excluded:${food}`)]);

function count<K extends string>(keys: readonly K[]): Partial<Record<K, number>> {
  const counts: Partial<Record<K, number>> = {};
  for (const key of keys) counts[key] = (counts[key] ?? 0) + 1;
  return counts;
}

export function score(results: readonly CaseResult[], intents: ReadonlyMap<string, Intent>): Scores {
  let truePositives = 0;
  let predicted = 0;
  let relevant = 0;
  const fieldHits = Object.fromEntries(FIELDS.map((field) => [field, 0])) as Record<Field, number>;
  let conditionCases = 0;
  let outOfScopeCases = 0;
  let declined = 0;
  let topicHits = 0;
  for (const { intent, result } of results) {
    const expected = intents.get(intent)?.expected;
    if (expected === undefined) throw new Error(`Unknown intent ${intent}`);
    const output = outputOf(result);
    if (expected.kind === "out_of_scope") {
      outOfScopeCases++;
      if (output?.kind === "out_of_scope") {
        declined++;
        if (output.topic === expected.topic) topicHits++;
      }
      continue;
    }
    conditionCases++;
    const actual = output?.kind === "conditions" ? output.conditions : undefined;
    const want = foodKeys(expected.conditions);
    const got = foodKeys(actual);
    truePositives += [...got].filter((key) => want.has(key)).length;
    predicted += got.size;
    relevant += want.size;
    if (actual !== undefined) {
      for (const field of FIELDS) if (canonicalField(actual, field) === canonicalField(expected.conditions, field)) fieldHits[field]++;
    }
  }
  const rejections = results.flatMap(({ result }) => (result.rejection === undefined ? [] : [result.rejection]));
  return {
    cases: results.length,
    foodPrecision: ratio(truePositives, predicted),
    foodRecall: ratio(truePositives, relevant),
    fieldAccuracy: Object.fromEntries(FIELDS.map((field) => [field, ratio(fieldHits[field], conditionCases)])) as Record<Field, number>,
    forbiddenRate: ratio(rejections.filter((reason) => reason === "forbidden_field" || reason === "forbidden_expression").length, results.length),
    outOfScopeDeclined: ratio(declined, outOfScopeCases),
    outOfScopeTopic: ratio(topicHits, outOfScopeCases),
    errors: count(results.flatMap(({ result }) => (result.body.kind === "error" ? [result.body.error] : []))),
    rejections: count(rejections),
  };
}

export function crossLocaleConsistency(results: readonly CaseResult[]): number {
  const byIntent = new Map<string, (string | undefined)[]>();
  for (const { intent, result } of results) byIntent.set(intent, [...(byIntent.get(intent) ?? []), canonicalOutput(outputOf(result))]);
  const complete = [...byIntent.values()].filter((outputs) => outputs.length === SUPPORTED_LOCALES.length);
  return ratio(complete.filter((outputs) => outputs[0] !== undefined && outputs.every((output) => output === outputs[0])).length, complete.length);
}

export function report(results: readonly CaseResult[], intents: readonly Intent[]): Report {
  const byId = new Map(intents.map((intent) => [intent.id, intent]));
  const overall = score(results, byId);
  const consistency = crossLocaleConsistency(results);
  const failed = [
    overall.foodPrecision < THRESHOLDS.foodPrecision ? "foodPrecision" : undefined,
    overall.foodRecall < THRESHOLDS.foodRecall ? "foodRecall" : undefined,
    overall.forbiddenRate > THRESHOLDS.forbiddenRate ? "forbiddenRate" : undefined,
    overall.outOfScopeDeclined < THRESHOLDS.outOfScopeDeclined ? "outOfScopeDeclined" : undefined,
    consistency < THRESHOLDS.crossLocaleConsistency ? "crossLocaleConsistency" : undefined,
  ].filter((name) => name !== undefined);
  const byLocale: Partial<Record<Locale, Scores>> = {};
  for (const locale of SUPPORTED_LOCALES) {
    const localeResults = results.filter((result) => result.locale === locale);
    if (localeResults.length > 0) byLocale[locale] = score(localeResults, byId);
  }
  return { overall, byLocale, crossLocaleConsistency: consistency, failedThresholds: failed };
}
