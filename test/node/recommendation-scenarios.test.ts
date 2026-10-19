import { describe, expect, expectTypeOf, it } from "vitest";
import * as z from "zod/mini";
import { foods } from "../../content/foods.ts";
import { recipes } from "../../content/recipes/index.ts";
import { recommendationDataFromBundle, type RecommendationData } from "../../domain/recommendation/data.ts";
import { evaluatePool, selectCandidates, type EvaluatedPool, type Selection } from "../../domain/recommendation/recommend.ts";
import { reasonsFor } from "../../domain/recommendation/reasons.ts";
import { solve } from "../../domain/recommendation/solver.ts";
import type { Conditions, PoolRequest, Session } from "../../domain/recommendation/types.ts";
import { presetTargets, validatePoolRequest } from "../../domain/recommendation/validate.ts";
import { bundleMismatches, calcBundleSchema, textBundleSchema } from "../../shared/bundle.ts";
import { SUPPORTED_LOCALES, type Locale } from "../../shared/locales.ts";
import { buildCalcBundle, buildTextBundle } from "../../tools/content/bundle.ts";
import { repositoryBundleInput } from "../../tools/content/repository.ts";

// Recommendation input from the in-memory calculation bundle, as in the browser.
const input = repositoryBundleInput();
const calc = z.parse(calcBundleSchema, buildCalcBundle(input));
const data = recommendationDataFromBundle(calc);
const none: Conditions = { excludedFoods: [], excludedAllergens: [], requiredFoods: [], cuisines: [] };
const emptySession: Session = { shown: [], excluded: [], previous: [], keep: [] };
const CHICKEN = ["chicken_breast", "chicken_mince", "chicken_thigh"];
const TOFU = ["tofu_firm", "tofu_silken"];

function pool(request: PoolRequest, from: RecommendationData = data): EvaluatedPool {
  const result = evaluatePool(request, from);
  if (!result.ok) throw new Error(JSON.stringify(result.errors));
  return result.value;
}
function select(evaluated: EvaluatedPool, session: Session = emptySession, seed = 0): Selection {
  const result = selectCandidates(evaluated, session, seed);
  if (!result.ok) throw new Error(JSON.stringify(result.errors));
  return result.value;
}

// Stage 0.6 scenarios and the personas of docs/SPEC.md §2.
const scenarios: Readonly<Record<string, PoolRequest>> = {
  "S1 cut": { targets: presetTargets("cut"), servings: 1, conditions: none },
  "S2 cut, <=20 min": { targets: presetTargets("cut"), servings: 1, conditions: { ...none, maxMinutes: 20 } },
  "S3 maintain": { targets: presetTargets("maintain"), servings: 1, conditions: none },
  "S4 bulk": { targets: presetTargets("bulk"), servings: 1, conditions: none },
  "S5 cut, no egg": { targets: presetTargets("cut"), servings: 1, conditions: { ...none, excludedAllergens: ["egg"] } },
  "S6 maintain, chicken required": { targets: presetTargets("maintain"), servings: 1, conditions: { ...none, requiredFoods: [CHICKEN] } },
  "S7 maintain, tofu required": { targets: presetTargets("maintain"), servings: 1, conditions: { ...none, requiredFoods: [TOFU] } },
  "S8 bulk, <=25 min": { targets: presetTargets("bulk"), servings: 1, conditions: { ...none, maxMinutes: 25 } },
  "P1 cutting office worker": { targets: { kcal: { min: 500, max: 650 }, proteinMin: 35, fatMax: 15 }, servings: 1, conditions: { ...none, maxMinutes: 20 } },
  "P2 bulking student, low effort": { targets: presetTargets("bulk"), servings: 1, conditions: { ...none, effort: 1 } },
  "P3 batch cook, 4 servings": { targets: presetTargets("maintain"), servings: 4, conditions: none },
  "P4 strict dieter": { targets: { kcal: { min: 450, max: 550 }, proteinMin: 35, fatMax: 10 }, servings: 1, conditions: none },
};

/** A compact, reviewable line per displayed recipe. */
function describeEntry(entry: Selection["candidates"][number]): string {
  const { fit, changes, sidesOff } = entry.solution;
  const adjusted = [...changes.map((change) => `${change.ingredient} ${String(change.from)}→${String(change.to)}`), ...sidesOff.map((side) => `${side} off`)];
  const statuses = fit.nutrients.map((nutrient) => `${nutrient.target} ${nutrient.status}`).join(", ");
  return `${entry.recipe} [${fit.tier}; ${statuses}]${adjusted.length > 0 ? ` (${adjusted.join(", ")})` : ""} ${entry.reasons.map((reason) => reason.code).join(" ")}`;
}

function summary(selection: Selection) {
  return {
    tiers: selection.tiers,
    candidates: selection.candidates.map(describeEntry),
    alternatives: selection.alternatives.map(describeEntry),
    relaxations: selection.relaxations.map((relaxation) => JSON.stringify(relaxation)),
    exclusions: selection.exclusions.map((exclusion) => JSON.stringify(exclusion)),
  };
}

describe("scenarios on the validation recipes", () => {
  it("keeps the reviewed first sets and the next set of each scenario", () => {
    const results = Object.fromEntries(
      Object.entries(scenarios).map(([name, request]) => {
        const evaluated = pool(request);
        const first = select(evaluated);
        const ids = first.candidates.map((entry) => entry.recipe);
        const next = select(evaluated, { ...emptySession, shown: ids, previous: ids }, 1);
        return [name, { contradictions: evaluated.contradictions, first: summary(first), next: next.candidates.map((entry) => entry.recipe) }];
      }),
    );
    expect(results).toMatchSnapshot();
  });

  it("gives batch cooks the same candidates and per-serving values as one serving", () => {
    const batch = scenarios["P3 batch cook, 4 servings"];
    if (!batch) throw new Error("missing scenario");
    const one = select(pool({ ...batch, servings: 1 }));
    const four = select(pool(batch));
    expect(four.candidates.map((entry) => entry.recipe)).toEqual(one.candidates.map((entry) => entry.recipe));
    four.candidates.forEach((entry, index) => {
      const other = one.candidates[index];
      expect(entry.solution.state.amounts).toEqual(other?.solution.state.amounts);
      expect(entry.solution.nutrition.perServing.ENERC_KCAL).toBeCloseTo(other?.solution.nutrition.perServing.ENERC_KCAL ?? Number.NaN, 9);
      expect(entry.solution.nutrition.servings).toBe(4);
    });
  });
});

describe("locale invariance", () => {
  it("has no locale in any recommendation signature", () => {
    expectTypeOf(evaluatePool).parameters.toEqualTypeOf<[PoolRequest, RecommendationData]>();
    expectTypeOf(selectCandidates).parameters.toEqualTypeOf<[EvaluatedPool, Session, number]>();
    expectTypeOf<Parameters<typeof validatePoolRequest>["length"]>().toEqualTypeOf<2>();
    expectTypeOf<Parameters<typeof solve>["length"]>().toEqualTypeOf<2>();
    expectTypeOf<Parameters<typeof reasonsFor>["length"]>().toEqualTypeOf<2>();
    expectTypeOf<"locale" extends keyof PoolRequest ? true : false>().toEqualTypeOf<false>();
  });

  // Content as a single-locale build would see it: every text replaced by one locale's string.
  function localizedOnly<T>(value: T, locale: Locale): T {
    if (Array.isArray(value)) return value.map((item: unknown) => localizedOnly(item, locale)) as T;
    if (value && typeof value === "object") {
      const record = value as Record<string, unknown>;
      if (SUPPORTED_LOCALES.every((key) => typeof record[key] === "string" || Array.isArray(record[key]))) {
        const only = record[locale];
        return Object.fromEntries(SUPPORTED_LOCALES.map((key) => [key, only])) as T;
      }
      return Object.fromEntries(Object.entries(record).map(([key, item]) => [key, localizedOnly(item, locale)])) as T;
    }
    return value;
  }

  const run = (from: RecommendationData) =>
    Object.values(scenarios).map((request) => {
      const evaluated = pool(request, from);
      const first = select(evaluated);
      const ids = first.candidates.map((entry) => entry.recipe);
      const { contradictions, blocked, entries, exclusions } = evaluated;
      return { pool: { request: evaluated.request, contradictions, blocked, entries, exclusions }, first, next: select(evaluated, { ...emptySession, shown: ids, previous: ids }, 1) };
    });

  it("gives identical recommendations with each locale's text bundle and with single-locale content", () => {
    const reference = run(data);
    for (const locale of SUPPORTED_LOCALES) {
      const text = z.parse(textBundleSchema, buildTextBundle(input, locale));
      expect(bundleMismatches(calc, text)).toEqual([]);
      const single = z.parse(calcBundleSchema, buildCalcBundle({ ...input, foods: localizedOnly(foods, locale), recipes: localizedOnly(recipes, locale) }));
      expect(run(recommendationDataFromBundle(single))).toEqual(reference);
    }
  });
});
