import { describe, expect, expectTypeOf, it } from "vitest";
import { recipes } from "../../content/recipes/index.ts";
import { foods } from "../../content/foods.ts";
import { calculateRecipe, effectiveGrams, purchaseGrams } from "../../domain/nutrition/calculate.ts";
import type { Locale } from "../../shared/locales.ts";
import { SUPPORTED_LOCALES } from "../../shared/locales.ts";
import type { Recipe } from "../../shared/content.ts";
import { nutritionData } from "./nutritionData.ts";

const data = nutritionData();
const recipe = (id: string): Recipe => {
  const found = recipes.find((candidate) => candidate.id === id);
  if (!found) throw new Error(id);
  return found;
};

describe("formulas", () => {
  it("(c4) applies the weight change rate to the raw edible mass", () => {
    // Grilled skinless chicken breast: 150 g raw, rate 61 % -> 91.5 g cooked.
    expect(effectiveGrams(150, "grill", { ratePercent: 61 })).toBeCloseTo(91.5, 10);
    expect(effectiveGrams(150, "raw", undefined)).toBe(150);
    expect(effectiveGrams(200, "as_is", { ratePercent: 210 })).toBe(200);
    expect(() => effectiveGrams(150, "boil", undefined)).toThrow(/weight change rate/);
  });

  it("(c5) adds refuse to get the purchase mass", () => {
    // Whole egg, refuse 14 %: 100 g edible -> 116.28 g with shell.
    expect(purchaseGrams(100, 14)).toBeCloseTo(116.279, 3);
    expect(() => purchaseGrams(100, 100)).toThrow(RangeError);
  });
});

describe("hand-checked recipes", () => {
  // Expected values computed by hand from data/composition (Stage 0.5 cross-check):
  // sum over ingredients of value per 100 g x grams / 100 (x rate / 100 for cooked states).
  it("chicken_lemon_herb_grill (cooked states with rates)", () => {
    const { perServing } = calculateRecipe(recipe("chicken_lemon_herb_grill"), data);
    expect(perServing["PROT-"]).toBeCloseTo(43.915, 6);
    expect(perServing["FAT-"]).toBeCloseTo(7.9865, 6);
    expect(perServing.ENERC_KCAL).toBeCloseTo(472.689, 6);
  });

  it("tuna_tofu_bowl (no cooking)", () => {
    const { perServing } = calculateRecipe(recipe("tuna_tofu_bowl"), data);
    expect(perServing["PROT-"]).toBeCloseTo(35.051, 6);
    expect(perServing["FAT-"]).toBeCloseTo(9.735, 6);
    expect(perServing.ENERC_KCAL).toBeCloseTo(454.63, 6);
  });

  it("divides batch recipes by servings", () => {
    const result = calculateRecipe(recipe("boiled_chicken_negi_salt"), data);
    expect(result.servings).toBe(3);
    expect(result.perServing["PROT-"]).toBeCloseTo((result.total["PROT-"] ?? Number.NaN) / 3, 10);
  });
});

describe("classification and counting", () => {
  it("does not count ingredients included in another cooked value", () => {
    const result = calculateRecipe(recipe("chicken_thigh_karaage"), data);
    const counted = result.ingredients.filter((ingredient) => ingredient.counted).map((ingredient) => ingredient.key);
    expect(counted).toEqual(["chicken", "lemon", "cabbage", "rice"]);
    expect(result.ingredients.find((ingredient) => ingredient.key === "chicken")?.fried).toBe(true);
  });

  it("marks untabulated cooking methods and post-cooking refuse as approximations", () => {
    const boiled = calculateRecipe(recipe("boiled_chicken_negi_salt"), data).ingredients.find((ingredient) => ingredient.key === "chicken");
    expect(boiled).toMatchObject({ mapping: "approximation", reasons: ["cooking_not_tabulated"], cooking: "boil", state: "raw" });

    const grilled = calculateRecipe(recipe("chicken_lemon_herb_grill"), data).ingredients.find((ingredient) => ingredient.key === "chicken");
    expect(grilled).toMatchObject({ mapping: "exact", reasons: [] });
  });

  it("treats an unmeasured source value as unknown, never zero", () => {
    // Olive oil has no amino-acid-based protein value ("-").
    const result = calculateRecipe(recipe("chicken_lemon_herb_grill"), data);
    const oil = result.ingredients.find((ingredient) => ingredient.key === "oil");
    expect(oil?.amounts.PROTCAA).toBeNull();
    expect(oil?.notations.PROTCAA).toBe("unmeasured");
    expect(result.perServing.PROTCAA).toBeNull();
    expect(result.perServing["PROT-"]).not.toBeNull();
  });

  it("calculates every validation recipe with complete energy, protein, fat, and carbohydrate", () => {
    const incomplete = recipes.flatMap((candidate) => {
      const { perServing } = calculateRecipe(candidate, data);
      return (["ENERC_KCAL", "PROT-", "FAT-", "CHOCDF-"] as const).filter((id) => perServing[id] === null).map((id) => `${candidate.id}.${id}`);
    });
    expect(incomplete).toEqual([]);
  });
});

describe("locale invariance", () => {
  it("takes no locale parameter", () => {
    expectTypeOf(calculateRecipe).parameters.not.toEqualTypeOf<[Recipe, ReturnType<typeof nutritionData>, Locale]>();
    expect(calculateRecipe.length).toBe(2);
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

  it("produces identical values for every recipe whichever locale's texts are present", () => {
    const [first, ...others] = SUPPORTED_LOCALES.map((locale) => {
      const localizedData = nutritionData(localizedOnly(foods, locale));
      return recipes.map((candidate) => calculateRecipe(localizedOnly(candidate, locale), localizedData));
    });
    for (const other of others) {
      expect(other).toEqual(first);
    }
  });
});

describe("nutrition snapshot", () => {
  it("records per-serving values of every validation recipe for review", () => {
    const table = Object.fromEntries(
      recipes.map((candidate) => {
        const { perServing } = calculateRecipe(candidate, data);
        return [candidate.id, Object.fromEntries(Object.entries(perServing).map(([id, value]) => [id, value === null ? null : Number(value.toFixed(2))]))];
      }),
    );
    expect(table).toMatchSnapshot();
  });
});
