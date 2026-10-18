import { describe, expect, it } from "vitest";
import * as z from "zod/mini";
import { foods } from "../../content/foods.ts";
import { recipes } from "../../content/recipes/index.ts";
import { CONTENT_VERSION } from "../../content/version.ts";
import { defaultState } from "../../domain/nutrition/amounts.ts";
import { calculateRecipe } from "../../domain/nutrition/calculate.ts";
import { engineDataFromBundle } from "../../domain/nutrition/data.ts";
import { NUTRIENTS, calculateNutrition, type RecipeNutrition } from "../../domain/nutrition/engine.ts";
import { calcBundleSchema } from "../../shared/bundle.ts";
import { buildCalcBundle } from "../../tools/content/bundle.ts";
import { composition, cooking, nutritionData } from "./nutritionData.ts";

// Engine input comes from the in-memory calculation bundle, as in the browser (ADR-028 E).
const calc = z.parse(calcBundleSchema, buildCalcBundle({ foods, recipes, composition, cooking, contentVersion: CONTENT_VERSION }));
const data = engineDataFromBundle(calc);
const phase0 = nutritionData();

const results = new Map(
  calc.recipes.map((recipe): [string, RecipeNutrition] => {
    const result = calculateNutrition(recipe, defaultState(recipe), data);
    if (!result.ok) throw new Error(`${recipe.id}: ${JSON.stringify(result.errors)}`);
    return [recipe.id, result.value];
  }),
);

describe("engine on the repository content", () => {
  it("gives the Phase 0 per-serving values at the default state", () => {
    for (const recipe of recipes) {
      const expected = calculateRecipe(recipe, phase0).perServing;
      const actual = results.get(recipe.id)?.perServing;
      for (const nutrient of NUTRIENTS) {
        const value = expected[nutrient];
        if (value === null) expect(actual?.[nutrient], `${recipe.id} ${nutrient}`).toBeNull();
        else expect(actual?.[nutrient], `${recipe.id} ${nutrient}`).toBeCloseTo(value, 9);
      }
    }
  });

  it("splits the Phase 0 approximation reasons as measured in Stage 1.3", () => {
    const counts: Record<string, number> = {};
    for (const result of results.values()) {
      for (const ingredient of result.ingredients) {
        if (!ingredient.counted) continue;
        for (const reason of ingredient.reasons) counts[reason] = (counts[reason] ?? 0) + 1;
      }
    }
    expect(counts).toEqual({ raw_value_for_cooking: 9, related_cooked_value: 3, post_cooking_refuse: 1, slow_frying: 2, fried: 3 });
  });

  it("has no unknown displayed nutrient in any recipe", () => {
    for (const [id, result] of results) expect(Object.values(result.incomplete).flat(), id).toEqual([]);
  });
});
