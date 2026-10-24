import { describe, expect, it } from "vitest";
import { recommendationDataFromBundle } from "../../domain/recommendation/data.ts";
import { evaluatePool, type PoolEntry } from "../../domain/recommendation/recommend.ts";
import type { Conditions, PoolRequest } from "../../domain/recommendation/types.ts";
import { presetTargets } from "../../domain/recommendation/validate.ts";
import { repositoryEngine } from "../../tools/content/repository.ts";

// Exact solver results on the repository recipes, so that performance work (Phase 6
// Stage 6.2) can show that no amount, side, change, or value moved. Numbers are
// compared at full precision; any difference is a behavior change (ADR-029 D4).
const data = recommendationDataFromBundle(repositoryEngine().calc);
const none: Conditions = { excludedFoods: [], excludedAllergens: [], requiredFoods: [], cuisines: [] };

const requests: Readonly<Record<string, PoolRequest>> = {
  "cut": { targets: presetTargets("cut"), servings: 1, conditions: none },
  "maintain": { targets: presetTargets("maintain"), servings: 1, conditions: none },
  "bulk": { targets: presetTargets("bulk"), servings: 1, conditions: none },
  "lean with carbohydrate range": { targets: { kcal: { min: 400, max: 600 }, proteinMin: 40, fatMax: 12, carbohydrate: { min: 30, max: 60 } }, servings: 1, conditions: none },
  "large meal, 3 servings": { targets: { kcal: { min: 700, max: 1000 }, proteinMin: 50, fatMax: 35 }, servings: 3, conditions: none },
  "maintain, cooked rice excluded": { targets: presetTargets("maintain"), servings: 1, conditions: { ...none, excludedFoods: ["rice_cooked"] } },
  "cut, chicken breast and atsuage excluded": { targets: presetTargets("cut"), servings: 1, conditions: { ...none, excludedFoods: ["chicken_breast", "atsuage"] } },
  "maintain, tofu required": { targets: presetTargets("maintain"), servings: 1, conditions: { ...none, requiredFoods: [["tofu_firm", "tofu_silken"]] } },
};

function describeEntry(entry: PoolEntry): string {
  const { solution, forced } = entry;
  const amounts = Object.entries(solution.state.amounts).map(([key, value]) => `${key}=${String(value)}`);
  const values = Object.entries(solution.nutrition.perServing).map(([nutrient, value]) => `${nutrient}=${String(value)}`);
  return [
    entry.recipe,
    solution.method,
    solution.fit.tier,
    `forced off [${forced.sidesOff.join(",")}] subs [${forced.substitutions.join(",")}]`,
    `solver off [${solution.sidesOff.join(",")}]`,
    `amounts [${amounts.join(",")}]`,
    `change ${String(solution.relativeChange)}`,
    values.join(" "),
  ].join(" | ");
}

describe("solver results on the repository recipes", () => {
  it("keeps every chosen state and its values", () => {
    const results = Object.fromEntries(
      Object.entries(requests).map(([name, request]) => {
        const evaluated = evaluatePool(request, data);
        if (!evaluated.ok) throw new Error(JSON.stringify(evaluated.errors));
        return [name, evaluated.value.entries.map(describeEntry)];
      }),
    );
    expect(results).toMatchSnapshot();
  });
});
