import { describe, expect, it } from "vitest";
import type { CompositionValue } from "../../shared/composition.ts";
import { defaultState, type AmountRecipe, type RecipeState } from "./amounts.ts";
import type { EngineComposition, EngineData, Nutrient } from "./data.ts";
import { calculateNutrition, effectiveGrams, purchaseGrams, type RecipeNutrition } from "./engine.ts";

// Hand-made composition data (per 100 g) so every expected value below can be
// recomputed by hand. Codes are fictitious.
const v = (value: number): CompositionValue => ({ value, notation: "measured" });
const zero: CompositionValue = { value: 0, notation: "zero" };
const unmeasured: CompositionValue = { value: null, notation: "unmeasured" };
const food = (kcal: CompositionValue, protein: CompositionValue, fat: CompositionValue, carb: CompositionValue, salt: CompositionValue): EngineComposition => ({
  refuse: zero,
  nutrients: { ENERC_KCAL: kcal, "PROT-": protein, "FAT-": fat, "CHOCDF-": carb, NACL_EQ: salt },
});

const data: EngineData = {
  foods: new Map([
    ["chicken", { raw: "90001", grill: "90002" }],
    ["potato", { microwave: "90003" }],
    ["fish", { tempura: "90004" }],
    ["oil", { as_is: "90005" }],
    ["miso", { as_is: "90006" }],
    ["onion", { stir_fry: "90007" }],
    ["mystery", { deep_fry: "90008" }],
  ]),
  composition: new Map([
    ["90001", food(v(100), v(20), v(2), zero, v(0.1))],
    ["90002", food(v(150), v(30), v(4), zero, v(0.2))],
    ["90003", food(v(80), v(2), { value: 0, notation: "trace" }, v(18), zero)],
    ["90004", food(v(200), v(15), v(12), v(10), v(0.3))],
    ["90005", food(v(900), zero, v(100), zero, zero)],
    ["90006", food(v(200), { value: 12, notation: "estimated" }, v(6), v(20), unmeasured)],
    ["90007", food(v(100), v(1), v(6), v(10), { value: 0, notation: "estimated_zero" })],
    ["90008", food(v(100), v(5), unmeasured, v(10), zero)],
  ]),
  rates: new Map([
    ["90002", { ratePercent: 60, postCookingRefuse: false }],
    ["90003", { ratePercent: 90, postCookingRefuse: true }],
    ["90004", { ratePercent: 120, postCookingRefuse: false }],
    ["90007", { ratePercent: 70, postCookingRefuse: false }],
    ["90008", { ratePercent: 100, postCookingRefuse: false }],
  ]),
  versions: { contentVersion: "2026-10-18.1", composition: { workbookUpdated: "2026-03-27", workbookSha256: "0".repeat(64), cookingSha256: "1".repeat(64) } },
};

type Ingredient = AmountRecipe["ingredients"][number];

function calculate(ingredients: readonly Ingredient[], options: { servings?: number; sides?: AmountRecipe["sides"]; state?: Partial<RecipeState> } = {}): RecipeNutrition {
  const recipe: AmountRecipe = { servings: options.servings ?? 1, ingredients, sides: options.sides ?? [], substitutions: [] };
  const result = calculateNutrition(recipe, { ...defaultState(recipe), ...options.state }, data);
  if (!result.ok) throw new Error(JSON.stringify(result.errors));
  return result.value;
}

const only = (result: RecipeNutrition) => {
  const [ingredient] = result.ingredients;
  if (!ingredient) throw new Error("no ingredient");
  return ingredient;
};

const expectValues = (actual: Readonly<Record<Nutrient, number | null>>, expected: Record<Nutrient, number | null>) => {
  for (const [nutrient, value] of Object.entries(expected) as [Nutrient, number | null][]) {
    if (value === null) expect(actual[nutrient], nutrient).toBeNull();
    else expect(actual[nutrient], nutrient).toBeCloseTo(value, 10);
  }
};

describe("formulas", () => {
  it("(c4) applies the weight change rate to the raw edible mass", () => {
    expect(effectiveGrams(150, "grill", { ratePercent: 61, postCookingRefuse: false })).toBeCloseTo(91.5, 10);
    expect(effectiveGrams(150, "raw", undefined)).toBe(150);
    expect(effectiveGrams(200, "as_is", undefined)).toBe(200);
    expect(() => effectiveGrams(150, "boil", undefined)).toThrow(/weight change rate/);
  });

  it("(c5) adds refuse to get the purchase mass", () => {
    // Whole egg, refuse 14 %: 100 g edible -> 116.28 g with shell.
    expect(purchaseGrams(100, 14)).toBeCloseTo(116.279, 3);
    expect(() => purchaseGrams(100, 100)).toThrow(RangeError);
  });

  it("calculates exact cooked values with (c4) and no band", () => {
    // Grilled chicken 200 g raw edible, rate 60 % -> 120 g: 180 kcal, 36 g protein, 4.8 g fat, 0.24 g salt.
    const ingredient = only(calculate([{ key: "chicken", food: "chicken", grams: 200, state: "grill" }]));
    expect(ingredient).toMatchObject({ code: "90002", ratePercent: 60, effectiveGrams: 120, class: "exact", reasons: [], fried: false });
    expectValues(ingredient.amounts, { ENERC_KCAL: 180, "PROT-": 36, "FAT-": 4.8, "CHOCDF-": 0, NACL_EQ: 0.24 });
    expect(ingredient.bands.ENERC_KCAL).toEqual({ minus: 0, plus: 0 });
  });
});

describe("reasons, classes, and bands", () => {
  it("raw value for an untabulated method: −15 % to +5 % of every nutrient", () => {
    // Raw chicken 200 g: 200 kcal, 40 g protein, 4 g fat, 0.2 g salt.
    const result = calculate([{ key: "chicken", food: "chicken", grams: 200, state: "raw", cooking: "boil" }]);
    const ingredient = only(result);
    expect(ingredient).toMatchObject({ class: "approximation", reasons: ["raw_value_for_cooking"], ratePercent: undefined });
    expect(ingredient.bands.ENERC_KCAL).toEqual({ minus: 30, plus: 10 });
    expect(ingredient.bands["PROT-"]?.minus).toBeCloseTo(6, 10);
    expect(ingredient.bands["PROT-"]?.plus).toBeCloseTo(2, 10);
    expect(result.ranges.ENERC_KCAL).toEqual({ low: 170, high: 210, shown: true });
    expect(result.ranges["FAT-"]).toMatchObject({ shown: false }); // 3.4–4.2 g
  });

  it("related cooked value: ±5 %", () => {
    // Grilled value for sautéed chicken: 180 kcal ± 9, 36 g protein ± 1.8.
    const result = calculate([{ key: "chicken", food: "chicken", grams: 200, state: "grill", cooking: "saute" }]);
    expect(only(result)).toMatchObject({ class: "approximation", reasons: ["related_cooked_value"] });
    expect(result.ranges.ENERC_KCAL?.low).toBeCloseTo(171, 10);
    expect(result.ranges.ENERC_KCAL?.high).toBeCloseTo(189, 10);
    expect(result.ranges["PROT-"]?.low).toBeCloseTo(34.2, 10);
    expect(result.ranges["PROT-"]?.high).toBeCloseTo(37.8, 10);
  });

  it("parts removed after cooking: ±5 %, and bands of several reasons add up", () => {
    // Microwaved potato 100 g, rate 90 % -> 90 g: 72 kcal.
    const removal = only(calculate([{ key: "potato", food: "potato", grams: 100, state: "microwave" }]));
    expect(removal).toMatchObject({ class: "approximation", reasons: ["post_cooking_refuse"], effectiveGrams: 90 });
    expect(removal.bands.ENERC_KCAL?.minus).toBeCloseTo(3.6, 10);
    const both = only(calculate([{ key: "potato", food: "potato", grams: 100, state: "microwave", cooking: "steam" }]));
    expect(both.reasons).toEqual(["related_cooked_value", "post_cooking_refuse"]);
    expect(both.bands.ENERC_KCAL?.minus).toBeCloseTo(7.2, 10);
    expect(both.bands.ENERC_KCAL?.plus).toBeCloseTo(7.2, 10);
  });

  it("fried: ±30 % of fat and of 9 kcal per gram of that fat", () => {
    // Tempura 100 g, rate 120 % -> 120 g: 240 kcal, 14.4 g fat; fat ± 4.32 g, energy ± 38.88 kcal.
    const ingredient = only(calculate([{ key: "fish", food: "fish", grams: 100, state: "tempura" }]));
    expect(ingredient).toMatchObject({ class: "approximation", reasons: ["fried"], fried: true });
    expect(ingredient.bands["FAT-"]?.minus).toBeCloseTo(4.32, 10);
    expect(ingredient.bands["FAT-"]?.plus).toBeCloseTo(4.32, 10);
    expect(ingredient.bands.ENERC_KCAL?.minus).toBeCloseTo(38.88, 10);
    expect(ingredient.bands["PROT-"]).toEqual({ minus: 0, plus: 0 });
  });

  it("slow frying: 0 to +50 % of fat and its energy, replacing the fried band", () => {
    // Onion stir-fried 100 g, rate 70 % -> 70 g: 4.2 g fat -> fat +2.1 g, energy +18.9 kcal.
    const onion = only(calculate([{ key: "onion", food: "onion", grams: 100, state: "stir_fry", estimate: "slow_frying" }]));
    expect(onion).toMatchObject({ class: "hard_to_estimate", reasons: ["slow_frying"], fried: true });
    expect(onion.bands["FAT-"]?.minus).toBe(0);
    expect(onion.bands["FAT-"]?.plus).toBeCloseTo(2.1, 10);
    expect(onion.bands.ENERC_KCAL?.plus).toBeCloseTo(18.9, 10);
    const fish = only(calculate([{ key: "fish", food: "fish", grams: 100, state: "tempura", estimate: "slow_frying" }]));
    expect(fish.reasons).toEqual(["slow_frying"]);
    expect(fish.bands["FAT-"]?.minus).toBe(0);
    expect(fish.bands["FAT-"]?.plus).toBeCloseTo(7.2, 10);
  });

  it("estimated ( ) values: approximation without a band; trace and estimated zero are flags only", () => {
    const miso = only(calculate([{ key: "miso", food: "miso", grams: 10, state: "as_is" }]));
    expect(miso).toMatchObject({ class: "approximation", reasons: ["estimated_source_value"] });
    expect(miso.notations["PROT-"]).toBe("estimated");
    expect(miso.bands["PROT-"]).toEqual({ minus: 0, plus: 0 });
    const potato = only(calculate([{ key: "potato", food: "potato", grams: 100, state: "microwave" }]));
    expect(potato.notations).toEqual({ "FAT-": "trace", NACL_EQ: "zero" });
    expect(potato.reasons).toEqual(["post_cooking_refuse"]);
    const onion = only(calculate([{ key: "onion", food: "onion", grams: 100, state: "stir_fry" }]));
    expect(onion).toMatchObject({ class: "exact", reasons: [], notations: { NACL_EQ: "estimated_zero" } });
  });
});

describe("recipe totals and ranges", () => {
  // Raw chicken 200 g for boiling plus tempura fish 100 g, two servings.
  const result = calculate(
    [
      { key: "chicken", food: "chicken", grams: 200, state: "raw", cooking: "boil" },
      { key: "fish", food: "fish", grams: 100, state: "tempura" },
      { key: "oil", food: "oil", grams: 10, state: "as_is", includedIn: "fish" },
    ],
    { servings: 2 },
  );

  it("sums counted ingredients and divides by servings", () => {
    expectValues(result.total, { ENERC_KCAL: 440, "PROT-": 58, "FAT-": 18.4, "CHOCDF-": 12, NACL_EQ: 0.56 });
    expectValues(result.perServing, { ENERC_KCAL: 220, "PROT-": 29, "FAT-": 9.2, "CHOCDF-": 6, NACL_EQ: 0.28 });
  });

  it("does not count ingredients included in another cooked value", () => {
    const oil = result.ingredients.find((ingredient) => ingredient.key === "oil");
    expect(oil).toMatchObject({ counted: false, notCounted: "included_in" });
    expect(oil?.amounts["FAT-"]).toBe(10);
  });

  it("adds the bands per nutrient and reports per-serving ranges", () => {
    // Energy: minus (30 + 38.88) / 2 = 34.44, plus (10 + 38.88) / 2 = 24.44.
    expect(result.ranges.ENERC_KCAL?.low).toBeCloseTo(185.56, 10);
    expect(result.ranges.ENERC_KCAL?.high).toBeCloseTo(244.44, 10);
    // Fat: minus (0.6 + 4.32) / 2 = 2.46, plus (0.2 + 4.32) / 2 = 2.26.
    expect(result.ranges["FAT-"]?.low).toBeCloseTo(6.74, 10);
    expect(result.ranges["FAT-"]?.high).toBeCloseTo(11.46, 10);
    expect(result.ranges["FAT-"]?.shown).toBe(true);
  });

  it("takes the most severe class of the counted ingredients", () => {
    expect(result.class).toBe("approximation");
    const withSlowFrying = calculate([
      { key: "chicken", food: "chicken", grams: 200, state: "grill" },
      { key: "onion", food: "onion", grams: 100, state: "stir_fry", estimate: "slow_frying" },
    ]);
    expect(withSlowFrying.class).toBe("hard_to_estimate");
    expect(calculate([{ key: "chicken", food: "chicken", grams: 200, state: "grill" }]).class).toBe("exact");
  });
});

describe("range thresholds (twice the display unit)", () => {
  // Related cooked value, ±5 %: the width is 10 % of the per-serving value.
  const width = (grams: number) => calculate([{ key: "chicken", food: "chicken", grams, state: "grill", cooking: "saute" }]).ranges;

  it("shows energy above 20 kcal and protein above 2 g, not at or below", () => {
    // 200 g -> 180 kcal (width 18), 36 g protein (width 3.6), 0.24 g salt (width 0.024).
    expect(width(200).ENERC_KCAL?.shown).toBe(false);
    expect(width(200)["PROT-"]?.shown).toBe(true);
    expect(width(200).NACL_EQ?.shown).toBe(false);
    // Exactly 20 kcal wide (200 kcal per serving from 222.2… g raw): not shown.
    expect(width(2000 / 9).ENERC_KCAL?.shown).toBe(false);
    expect(width(250).ENERC_KCAL?.shown).toBe(true); // 225 kcal, width 22.5
    // Protein exactly 2 g wide (20 g per serving): not shown.
    expect(width(1000 / 9)["PROT-"]?.shown).toBe(false);
  });

  it("shows salt above 0.2 g", () => {
    // Raw chicken for boiling: salt 0.1 g per 100 g, width 20 % -> above 0.2 g from 1,000 g.
    const salt = (grams: number) => calculate([{ key: "chicken", food: "chicken", grams, state: "raw", cooking: "boil" }]).ranges.NACL_EQ?.shown;
    expect(salt(1000)).toBe(false);
    expect(salt(1100)).toBe(true);
  });
});

describe("unmeasured values", () => {
  it("make the nutrient unknown, never zero, and list the ingredient", () => {
    const result = calculate([
      { key: "chicken", food: "chicken", grams: 200, state: "grill" },
      { key: "miso", food: "miso", grams: 10, state: "as_is" },
    ]);
    expect(result.total.NACL_EQ).toBeNull();
    expect(result.perServing.NACL_EQ).toBeNull();
    expect(result.ranges.NACL_EQ).toBeNull();
    expect(result.incomplete).toEqual({ ENERC_KCAL: [], "PROT-": [], "FAT-": [], "CHOCDF-": [], NACL_EQ: ["miso"] });
    expect(result.perServing["PROT-"]).toBeCloseTo(37.2, 10);
  });

  it("make a fried ingredient's energy range unknown when its fat is unmeasured", () => {
    const result = calculate([{ key: "mystery", food: "mystery", grams: 100, state: "deep_fry" }]);
    expect(result.perServing.ENERC_KCAL).toBe(100);
    expect(result.perServing["FAT-"]).toBeNull();
    expect(result.ranges.ENERC_KCAL).toBeNull();
    expect(result.ranges["PROT-"]).toMatchObject({ shown: false });
  });

  it("do not matter for ingredients that are switched off", () => {
    const result = calculate(
      [
        { key: "chicken", food: "chicken", grams: 200, state: "grill" },
        { key: "miso", food: "miso", grams: 10, state: "as_is" },
      ],
      { sides: [{ key: "sauce", ingredients: ["miso"] }], state: { sidesOff: ["sauce"] } },
    );
    expect(result.ingredients[1]).toMatchObject({ counted: false, notCounted: "side_off", grams: 0 });
    expect(result.perServing.NACL_EQ).toBeCloseTo(0.24, 10);
    expect(result.incomplete.NACL_EQ).toEqual([]);
  });
});

describe("states", () => {
  it("returns amount errors instead of calculating", () => {
    const recipe: AmountRecipe = { servings: 1, ingredients: [{ key: "chicken", food: "chicken", grams: 200, state: "grill" }], sides: [], substitutions: [] };
    expect(calculateNutrition(recipe, { ...defaultState(recipe), servings: 0 }, data)).toEqual({ ok: false, errors: [{ code: "invalid_servings", servings: 0 }] });
  });

  it("is deterministic", () => {
    const recipe: AmountRecipe = {
      servings: 2,
      ingredients: [
        { key: "chicken", food: "chicken", grams: 200, state: "raw", cooking: "boil" },
        { key: "fish", food: "fish", grams: 100, state: "tempura" },
      ],
      sides: [],
      substitutions: [],
    };
    expect(calculateNutrition(recipe, defaultState(recipe), data)).toEqual(calculateNutrition(recipe, defaultState(recipe), data));
  });

  it("throws on data the build-time validation rules out", () => {
    expect(() => calculate([{ key: "x", food: "unknown", grams: 1, state: "raw" }])).toThrow(/Unknown food/);
    expect(() => calculate([{ key: "x", food: "chicken", grams: 1, state: "boil" }])).toThrow(/no state boil/);
  });
});
