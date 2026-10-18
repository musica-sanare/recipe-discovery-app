import { describe, expect, it } from "vitest";
import type { BundleRecipe } from "../../shared/bundle.ts";
import type { CompositionValue } from "../../shared/composition.ts";
import { defaultState, type RecipeState } from "./amounts.ts";
import { nutritionBasis } from "./basis.ts";
import type { EngineComposition, EngineData } from "./data.ts";
import { calculateNutrition, type RecipeNutrition } from "./engine.ts";

const v = (value: number): CompositionValue => ({ value, notation: "measured" });
const zero: CompositionValue = { value: 0, notation: "zero" };
const food = (kcal: number, fat: number, salt: CompositionValue = zero): EngineComposition => ({
  refuse: zero,
  nutrients: { ENERC_KCAL: v(kcal), "PROT-": v(10), "FAT-": v(fat), "CHOCDF-": zero, NACL_EQ: salt },
});

const data: EngineData = {
  foods: new Map([
    ["pork", { tonkatsu: "90011", grill: "90012" }],
    ["coating", { as_is: "90013" }],
    ["oil", { as_is: "90014" }],
    ["potato", { microwave: "90015" }],
    ["pepper", { as_is: "90016" }],
    ["salt", { as_is: "90017" }],
  ]),
  composition: new Map([
    ["90011", food(400, 30)],
    ["90012", food(200, 5)],
    ["90013", food(350, 2)],
    ["90014", food(900, 100)],
    ["90015", food(80, 0)],
    ["90016", food(360, 6, { value: 0, notation: "trace" })],
    ["90017", food(0, 0, v(99.5))],
  ]),
  rates: new Map([
    ["90011", { ratePercent: 110, postCookingRefuse: false }],
    ["90012", { ratePercent: 70, postCookingRefuse: false }],
    ["90015", { ratePercent: 90, postCookingRefuse: true }],
  ]),
  versions: { contentVersion: "2026-10-18.1", composition: { workbookUpdated: "2026-03-27", workbookSha256: "a".repeat(64), cookingSha256: "b".repeat(64) } },
};

// A breaded and fried cutlet with its coating and frying oil already in the cooked
// value, dressing oil counted in full, a peeled microwaved potato, and pinches.
const recipe: Pick<BundleRecipe, "servings" | "ingredients" | "sides" | "substitutions"> = {
  servings: 1,
  ingredients: [
    { key: "pork", food: "pork", grams: 120, state: "tonkatsu", role: "main_protein" },
    { key: "coating", food: "coating", grams: 15, state: "as_is", role: "coating", includedIn: "pork" },
    { key: "frying_oil", food: "oil", grams: 12, state: "as_is", role: "fat", includedIn: "pork" },
    { key: "dressing_oil", food: "oil", grams: 4, state: "as_is", role: "fat", measure: { unit: "tsp", quantity: 1 } },
    { key: "potato", food: "potato", grams: 100, state: "microwave", role: "main_carb" },
    { key: "pepper", food: "pepper", grams: 0.2, state: "as_is", role: "seasoning", measure: { unit: "pinch", quantity: 1 } },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", role: "seasoning", measure: { unit: "pinch", quantity: 1 } },
  ],
  sides: [],
  substitutions: [
    {
      key: "grilled",
      ingredient: "pork",
      food: "pork",
      state: "grill",
      ratio: 1,
      stepTexts: [],
      safetyNotes: { replace: [], add: [] },
    },
  ],
};

function basisFor(state: Partial<RecipeState> = {}) {
  const result = calculateNutrition(recipe, { ...defaultState(recipe), ...state }, data);
  if (!result.ok) throw new Error(JSON.stringify(result.errors));
  const nutrition: RecipeNutrition = result.value;
  const basis = nutritionBasis(recipe, nutrition, data);
  return new Map(basis.ingredients.map((ingredient) => [ingredient.key, ingredient]));
}

describe("nutrition basis", () => {
  it("carries the data versions", () => {
    const result = calculateNutrition(recipe, defaultState(recipe), data);
    if (!result.ok) throw new Error("invalid");
    expect(nutritionBasis(recipe, result.value, data).versions).toBe(data.versions);
  });

  it("traces each ingredient to its food code, state, data version, class, and reasons", () => {
    expect(basisFor().get("pork")).toEqual({
      key: "pork",
      food: "pork",
      code: "90011",
      state: "tonkatsu",
      cooking: undefined,
      substitution: undefined,
      dataVersion: "2026-03-27",
      ratePercent: 110,
      grams: 120,
      effectiveGrams: 132,
      counted: true,
      notCounted: undefined,
      class: "approximation",
      reasons: ["fried"],
      notations: { "CHOCDF-": "zero", NACL_EQ: "zero" },
      assumptions: [{ code: "energy_from_fat", kcalPerGram: 9 }],
    });
  });

  it("states that coating and frying oil are contained in the fried value", () => {
    const basis = basisFor();
    expect(basis.get("coating")).toMatchObject({ counted: false, notCounted: "included_in", assumptions: [{ code: "included_in_cooked_value", ingredient: "pork" }] });
    expect(basis.get("frying_oil")?.assumptions).toEqual([{ code: "included_in_cooked_value", ingredient: "pork" }]);
  });

  it("states that other oil is counted in full (ADR-022)", () => {
    expect(basisFor().get("dressing_oil")?.assumptions).toEqual([{ code: "oil_counted_in_full" }]);
  });

  it("states removal after cooking", () => {
    expect(basisFor().get("potato")).toMatchObject({ reasons: ["post_cooking_refuse"], assumptions: [{ code: "parts_removed_after_cooking" }] });
  });

  it("notes that a pinch uses the stated grams, without changing the class", () => {
    const basis = basisFor();
    expect(basis.get("pepper")).toMatchObject({ class: "exact", notations: { "CHOCDF-": "zero", NACL_EQ: "trace" }, assumptions: [{ code: "pinch_as_stated_grams", grams: 0.2 }] });
    expect(basis.get("salt")).toMatchObject({ class: "exact", assumptions: [{ code: "pinch_as_stated_grams", grams: 0.5 }] });
  });

  it("follows a substitution", () => {
    expect(basisFor({ substitutions: ["grilled"] }).get("pork")).toMatchObject({ code: "90012", state: "grill", substitution: "grilled", class: "exact", reasons: [], assumptions: [] });
  });
});
