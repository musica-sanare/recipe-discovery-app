import { describe, expect, expectTypeOf, it } from "vitest";
import * as z from "zod/mini";
import { foods } from "../../content/foods.ts";
import { recipes, validationRecipes } from "../../content/recipes/index.ts";
import { defaultState, type AmountRecipe, type RecipeState } from "../../domain/nutrition/amounts.ts";
import { nutritionBasis } from "../../domain/nutrition/basis.ts";
import { engineDataFromBundle, type EngineData } from "../../domain/nutrition/data.ts";
import { NUTRIENTS, calculateNutrition, type RecipeNutrition } from "../../domain/nutrition/engine.ts";
import { bundleMismatches, textBundleSchema } from "../../shared/bundle.ts";
import { SUPPORTED_LOCALES, type Locale } from "../../shared/locales.ts";
import { buildCalcBundle, buildTextBundle, serializeBundle } from "../../tools/content/bundle.ts";
import { repositoryBundleInput, repositoryEngine } from "../../tools/content/repository.ts";

// Engine input comes from the in-memory calculation bundle, as in the browser (ADR-028 E).
const input = repositoryBundleInput();
const { composition } = input;
const { calc, data } = repositoryEngine(input);

const results = new Map(
  calc.recipes.map((recipe): [string, RecipeNutrition] => {
    const result = calculateNutrition(recipe, defaultState(recipe), data);
    if (!result.ok) throw new Error(`${recipe.id}: ${JSON.stringify(result.errors)}`);
    return [recipe.id, result.value];
  }),
);
const result = (id: string): RecipeNutrition => {
  const found = results.get(id);
  if (!found) throw new Error(id);
  return found;
};

describe("hand-checked recipes", () => {
  // Expected values computed by hand from data/composition (Stage 0.5 cross-check):
  // sum over ingredients of value per 100 g x grams / 100 (x rate / 100 for cooked states).
  it("chicken_lemon_herb_grill (cooked states with rates)", () => {
    const { perServing } = result("chicken_lemon_herb_grill");
    expect(perServing["PROT-"]).toBeCloseTo(43.915, 6);
    expect(perServing["FAT-"]).toBeCloseTo(7.9865, 6);
    expect(perServing.ENERC_KCAL).toBeCloseTo(472.689, 6);
  });

  it("tuna_tofu_bowl (no cooking)", () => {
    const { perServing } = result("tuna_tofu_bowl");
    expect(perServing["PROT-"]).toBeCloseTo(35.051, 6);
    expect(perServing["FAT-"]).toBeCloseTo(9.735, 6);
    expect(perServing.ENERC_KCAL).toBeCloseTo(454.63, 6);
  });

  it("divides batch recipes by servings", () => {
    const batch = result("boiled_chicken_negi_salt");
    expect(batch.servings).toBe(3);
    expect(batch.perServing["PROT-"]).toBeCloseTo((batch.total["PROT-"] ?? Number.NaN) / 3, 10);
  });
});

describe("classification and counting", () => {
  it("does not count ingredients included in another cooked value", () => {
    const karaage = result("chicken_thigh_karaage");
    expect(karaage.ingredients.filter((ingredient) => ingredient.counted).map((ingredient) => ingredient.key)).toEqual(["chicken", "lemon", "cabbage", "rice"]);
    expect(karaage.ingredients.find((ingredient) => ingredient.key === "chicken")).toMatchObject({ fried: true, reasons: ["fried"] });
  });

  it("classifies a raw value for an untabulated method and a tabulated cooked value", () => {
    expect(result("boiled_chicken_negi_salt").ingredients.find((ingredient) => ingredient.key === "chicken")).toMatchObject({
      class: "approximation",
      reasons: ["raw_value_for_cooking"],
      cooking: "boil",
      state: "raw",
    });
    expect(result("chicken_lemon_herb_grill").ingredients.find((ingredient) => ingredient.key === "chicken")).toMatchObject({ class: "exact", reasons: [] });
  });
});

// Reviewed counts (Stage 1.3, Phase 2) refer to the validation recipes.
const validationIds = new Set(validationRecipes.map((recipe) => recipe.id));

describe("engine on the repository content", () => {
  it("splits the approximation reasons of Stage 1.3 (ADR-028)", () => {
    const counts: Record<string, number> = {};
    for (const [id, result] of results) {
      if (!validationIds.has(id)) continue;
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

  it("states the assumptions of every recipe in the basis", () => {
    const counts: Record<string, number> = {};
    for (const recipe of calc.recipes) {
      const nutrition = results.get(recipe.id);
      if (!nutrition) throw new Error(recipe.id);
      const basis = nutritionBasis(recipe, nutrition, data);
      expect(basis.versions.composition.workbookUpdated).toBe(composition.source.workbookUpdated);
      for (const ingredient of basis.ingredients) {
        expect(ingredient.dataVersion).toBe(composition.source.workbookUpdated);
        if (!validationIds.has(recipe.id)) continue;
        for (const assumption of ingredient.assumptions) counts[assumption.code] = (counts[assumption.code] ?? 0) + 1;
      }
    }
    expect(counts).toEqual({ oil_counted_in_full: 17, included_in_cooked_value: 17, parts_removed_after_cooking: 1, energy_from_fat: 5, pinch_as_stated_grams: 9 });
  });
});

const round2 = (value: number | null) => (value === null ? null : Number(value.toFixed(2)));

describe("engine snapshot", () => {
  // Default state, per serving, two decimals; full precision stays internal. Every change
  // needs an explanation per recipe and nutrient and the owner's approval.
  it("records point values, ranges, classes, reasons, and incompleteness of every recipe", () => {
    const table = Object.fromEntries(
      calc.recipes.map((recipe) => {
        const result = results.get(recipe.id);
        if (!result) throw new Error(recipe.id);
        return [
          recipe.id,
          {
            class: result.class,
            perServing: Object.fromEntries(NUTRIENTS.map((nutrient) => [nutrient, round2(result.perServing[nutrient])])),
            ranges: Object.fromEntries(
              NUTRIENTS.map((nutrient) => {
                const range = result.ranges[nutrient];
                return [nutrient, range === null ? null : `${String(round2(range.low))}–${String(round2(range.high))}${range.shown ? " shown" : ""}`];
              }),
            ),
            reasons: Object.fromEntries(result.ingredients.filter((ingredient) => ingredient.counted && ingredient.reasons.length > 0).map((ingredient) => [ingredient.key, ingredient.reasons.join(", ")])),
            incomplete: Object.fromEntries(NUTRIENTS.filter((nutrient) => result.incomplete[nutrient].length > 0).map((nutrient) => [nutrient, result.incomplete[nutrient]])),
          },
        ];
      }),
    );
    expect(table).toMatchSnapshot();
  });
});

describe("locale invariance", () => {
  it("has no locale in the engine signature", () => {
    expectTypeOf(calculateNutrition).parameters.toEqualTypeOf<[AmountRecipe, RecipeState, EngineData]>();
    expectTypeOf(calculateNutrition).parameters.not.toEqualTypeOf<[AmountRecipe, RecipeState, EngineData, Locale]>();
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

  it("gives identical results for every recipe with each text bundle loaded", () => {
    const perLocale = SUPPORTED_LOCALES.map((locale) => {
      const text = z.parse(textBundleSchema, buildTextBundle(input, locale));
      expect(bundleMismatches(calc, text)).toEqual([]);
      return calc.recipes.map((recipe) => calculateNutrition(recipe, defaultState(recipe), engineDataFromBundle(calc)));
    });
    for (const other of perLocale.slice(1)) expect(other).toEqual(perLocale[0]);
    expect(perLocale[0]?.map((result) => (result.ok ? result.value : null))).toEqual([...results.values()]);
  });

  it("builds the same calculation bundle whichever locale's texts the content holds", () => {
    const serialized = SUPPORTED_LOCALES.map((locale) =>
      serializeBundle(buildCalcBundle({ ...input, foods: localizedOnly(foods, locale), recipes: localizedOnly(recipes, locale) })),
    );
    for (const other of serialized.slice(1)) expect(other).toBe(serialized[0]);
    expect(serialized[0]).toBe(serializeBundle(calc));
  });
});

describe("determinism", () => {
  const all = (engineData: EngineData) => calc.recipes.map((recipe) => calculateNutrition(recipe, defaultState(recipe), engineData));

  it("gives deep-equal results across runs", () => {
    expect(all(data)).toEqual(all(data));
    expect(all(engineDataFromBundle(calc))).toEqual(all(data));
  });

  it("does not depend on the order of foods, composition values, or rates in the bundle", () => {
    const reversed = engineDataFromBundle({ ...calc, foods: [...calc.foods].reverse(), compositionFoods: [...calc.compositionFoods].reverse(), rates: [...calc.rates].reverse() });
    expect(all(reversed)).toEqual(all(data));
  });

  it("gives the same totals when ingredients are listed in another order", () => {
    for (const recipe of calc.recipes) {
      const reordered = { ...recipe, ingredients: [...recipe.ingredients].reverse() };
      const a = calculateNutrition(recipe, defaultState(recipe), data);
      const b = calculateNutrition(reordered, defaultState(reordered), data);
      if (!a.ok || !b.ok) throw new Error(recipe.id);
      for (const nutrient of NUTRIENTS) {
        expect(b.value.perServing[nutrient], `${recipe.id} ${nutrient}`).toBeCloseTo(a.value.perServing[nutrient] ?? Number.NaN, 9);
        expect(b.value.ranges[nutrient]?.low, `${recipe.id} ${nutrient}`).toBeCloseTo(a.value.ranges[nutrient]?.low ?? Number.NaN, 9);
        expect(b.value.ranges[nutrient]?.shown).toBe(a.value.ranges[nutrient]?.shown);
      }
      expect(b.value.class).toBe(a.value.class);
    }
  });
});
