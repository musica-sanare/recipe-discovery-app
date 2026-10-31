import { describe, expect, it } from "vitest";
import * as z from "zod/mini";
import { fakeAdapter } from "../../server/ai/fake.ts";
import { SUPPORTED_LOCALES } from "../../shared/locales.ts";
import { providerOutputSchema, suggestRequestSchema, validateValue, type ProviderOutput } from "../../shared/suggestion.ts";
import { CATEGORIES, loadEvaluationSet } from "../../tools/ai-evaluation/cases.ts";
import { report, type CaseResult } from "../../tools/ai-evaluation/metrics.ts";
import { expectedAnswers, repositoryContext, runEvaluation } from "../../tools/ai-evaluation/run.ts";

// Evaluation set and metrics of the AI free-text conditions (ADR-034 D4); fake adapters only.
const set = loadEvaluationSet();

describe("evaluation set", () => {
  it("has 60 intents with unique IDs and texts in every locale", () => {
    expect(set.intents).toHaveLength(60);
    expect(new Set(set.intents.map((intent) => intent.id)).size).toBe(60);
    for (const locale of SUPPORTED_LOCALES) {
      const texts = set.intents.map((intent) => intent.texts[locale]);
      expect(new Set(texts).size, locale).toBe(texts.length);
      for (const text of texts) expect(z.safeParse(suggestRequestSchema, { text, locale }).success, text).toBe(true);
    }
  });

  it("covers every category, with ten out-of-scope intents over all three topics", () => {
    expect(new Set(set.intents.map((intent) => intent.category))).toEqual(new Set(CATEGORIES));
    const outOfScope = set.intents.flatMap((intent) => (intent.expected.kind === "out_of_scope" ? [intent.expected.topic] : []));
    expect(outOfScope).toHaveLength(10);
    expect(new Set(outOfScope)).toEqual(new Set(["allergens", "targets", "other"]));
  });

  it("has expected outputs that pass the runtime validation unchanged", () => {
    for (const intent of set.intents) {
      expect(validateValue(intent.expected, repositoryContext, providerOutputSchema), intent.id).toEqual({ ok: true, value: intent.expected });
    }
  });

  it("marks out-of-scope intents only in the out_of_scope category", () => {
    for (const intent of set.intents) expect(intent.expected.kind === "out_of_scope", intent.id).toBe(intent.category === "out_of_scope");
  });
});

describe("evaluation metrics", () => {
  const conditions = (value: ProviderOutput) => JSON.stringify(value);

  it("meets every threshold when each answer is the expected output", async () => {
    const result = report(await runEvaluation(set, expectedAnswers(set), SUPPORTED_LOCALES), set.intents);
    expect(result.overall.cases).toBe(240);
    expect(result.overall).toMatchObject({ foodPrecision: 1, foodRecall: 1, forbiddenRate: 0, outOfScopeDeclined: 1, outOfScopeTopic: 1 });
    expect(result.crossLocaleConsistency).toBe(1);
    expect(result.failedThresholds).toEqual([]);
  });

  it("counts extra and missing food IDs against precision and recall", async () => {
    const intent = { ...set, intents: set.intents.filter((item) => item.id === "chicken_broccoli") };
    const answer: ProviderOutput = { kind: "conditions", conditions: { requiredFoods: [["chicken_breast"], ["broccoli"]], excludedFoods: ["cod"], cuisines: [] } };
    const result = report(await runEvaluation(intent, fakeAdapter(() => ({ output: conditions(answer) })), ["en"]), intent.intents);
    // Expected: 4 chicken foods and broccoli; got chicken_breast, broccoli, and an extra excluded cod.
    expect(result.overall.foodPrecision).toBeCloseTo(2 / 3);
    expect(result.overall.foodRecall).toBeCloseTo(2 / 5);
    expect(result.overall.fieldAccuracy).toEqual({ requiredFoods: 0, excludedFoods: 0, maxMinutes: 1, equipment: 1, cuisines: 1 });
  });

  it("treats rejected outputs and errors as no output and reports forbidden fields", async () => {
    const intents = { ...set, intents: set.intents.filter((item) => ["chickpeas", "kcal_500"].includes(item.id)) };
    const adapter = fakeAdapter((request) =>
      request.text.includes("500") ? { output: JSON.stringify({ kind: "conditions", conditions: { requiredFoods: [], excludedFoods: [], cuisines: [], kcalMax: 500 } }) } : { error: "timeout" },
    );
    const result = report(await runEvaluation(intents, adapter, SUPPORTED_LOCALES), intents.intents);
    expect(result.overall.foodRecall).toBe(0);
    expect(result.overall.forbiddenRate).toBe(0.5);
    expect(result.overall.outOfScopeDeclined).toBe(0);
    expect(result.overall.errors).toEqual({ timeout: 4, invalid_output: 4 });
    expect(result.overall.rejections).toEqual({ forbidden_field: 4 });
    expect(result.crossLocaleConsistency).toBe(0);
    expect(result.failedThresholds).toEqual(["foodRecall", "forbiddenRate", "outOfScopeDeclined", "crossLocaleConsistency"]);
  });

  it("counts a decline with another topic as declined but not as the right topic", async () => {
    const intents = { ...set, intents: set.intents.filter((item) => item.id === "allergy_egg") };
    const result = report(await runEvaluation(intents, fakeAdapter(() => ({ output: JSON.stringify({ kind: "out_of_scope", topic: "other" }) })), ["ja"]), intents.intents);
    expect(result.overall).toMatchObject({ outOfScopeDeclined: 1, outOfScopeTopic: 0 });
  });

  it("measures cross-locale consistency per intent, ignoring the order of sets", () => {
    const ok = (output: ProviderOutput) => ({ status: 200, body: output });
    const a: ProviderOutput = { kind: "conditions", conditions: { requiredFoods: [["chicken_thigh", "chicken_breast"]], excludedFoods: [], cuisines: [] } };
    const b: ProviderOutput = { kind: "conditions", conditions: { requiredFoods: [["chicken_breast", "chicken_thigh"]], excludedFoods: [], cuisines: [] } };
    const results: CaseResult[] = [
      ...SUPPORTED_LOCALES.map((locale) => ({ intent: "thigh_or_breast", locale, result: ok(locale === "fr" ? b : a) })),
      ...SUPPORTED_LOCALES.map((locale) => ({ intent: "japanese", locale, result: ok(locale === "es" ? { kind: "out_of_scope", topic: "other" } : { kind: "conditions", conditions: { requiredFoods: [], excludedFoods: [], cuisines: ["japanese"] } }) })),
    ];
    expect(report(results, set.intents).crossLocaleConsistency).toBe(0.5);
  });
});
