import { describe, expect, it } from "vitest";
import type { RecommendationFood } from "./data.ts";
import { applyHardFilters, checkRecipe, type FilterRecipe } from "./filters.ts";
import type { Conditions } from "./types.ts";

const food = (allergens: RecommendationFood["allergens"]): RecommendationFood => ({ allergens, proteinGroup: undefined });
const foods = new Map<string, RecommendationFood>([
  ["chicken_breast", food([{ allergen: "chicken", confidence: "contains" }])],
  ["tofu_firm", food([{ allergen: "soybean", confidence: "contains" }])],
  ["rice_cooked", food([])],
  ["sesame", food([{ allergen: "sesame", confidence: "contains" }])],
  ["broccoli", food([])],
  ["soy_sauce", food([{ allergen: "wheat", confidence: "contains" }, { allergen: "soybean", confidence: "contains" }])],
  ["stock_granules", food("unknown")],
  ["egg", food([{ allergen: "egg", confidence: "contains" }])],
  ["mayonnaise", food([{ allergen: "egg", confidence: "may_contain" }])],
]);

// Chicken with a soy sauce seasoning, a removable rice side with a linked sesame
// topping outside the side, a vegetable side, and a tofu substitution that adds 5 minutes.
const bowl: FilterRecipe = {
  id: "bowl",
  minutes: 20,
  equipment: ["stove", "frying_pan"],
  ingredients: [
    { key: "chicken", food: "chicken_breast" },
    { key: "soy", food: "soy_sauce", linkedTo: "chicken" },
    { key: "rice", food: "rice_cooked" },
    { key: "topping", food: "sesame", linkedTo: "rice" },
    { key: "broccoli", food: "broccoli" },
  ],
  sides: [
    { key: "rice", ingredients: ["rice"] },
    { key: "vegetables", ingredients: ["broccoli"] },
  ],
  substitutions: [{ key: "tofu", ingredient: "chicken", food: "tofu_firm", minutesDelta: 5 }],
};
const soup: FilterRecipe = {
  id: "soup",
  minutes: 30,
  equipment: ["stove", "pot"],
  ingredients: [
    { key: "egg", food: "egg" },
    { key: "stock", food: "stock_granules" },
  ],
  sides: [],
  substitutions: [],
};
const salad: FilterRecipe = {
  id: "salad",
  minutes: 10,
  equipment: [],
  ingredients: [
    { key: "chicken", food: "chicken_breast" },
    { key: "dressing", food: "mayonnaise" },
  ],
  sides: [],
  substitutions: [],
};

const none: Conditions = { excludedFoods: [], excludedAllergens: [], requiredFoods: [], cuisines: [] };
const check = (recipe: FilterRecipe, conditions: Partial<Conditions>, excluded: readonly string[] = []) =>
  checkRecipe(recipe, { ...none, ...conditions }, new Set(excluded), foods);

describe("time and equipment", () => {
  it("allows a recipe exactly at the maximum time", () => {
    expect(check(bowl, { maxMinutes: 20 }).failed).toEqual([]);
    expect(check(bowl, { maxMinutes: 19 }).failed).toEqual([{ constraint: "maxMinutes" }]);
  });

  it("requires every piece of equipment to be available and names each missing one", () => {
    expect(check(bowl, { equipment: ["stove", "frying_pan", "microwave"] }).failed).toEqual([]);
    expect(check(bowl, { equipment: ["microwave"] }).failed).toEqual([
      { constraint: "equipment", equipment: "frying_pan" },
      { constraint: "equipment", equipment: "stove" },
    ]);
    expect(check(salad, { equipment: [] }).failed).toEqual([]);
  });
});

describe("allergens (best effort, never rescued)", () => {
  it("excludes contains, may_contain, and unknown allergen information", () => {
    expect(check(bowl, { excludedAllergens: ["wheat"] }).failed).toEqual([{ constraint: "allergen", allergen: "wheat" }]);
    expect(check(salad, { excludedAllergens: ["egg"] }).failed).toEqual([{ constraint: "allergen", allergen: "egg" }]);
    expect(check(soup, { excludedAllergens: ["milk"] }).failed).toEqual([{ constraint: "allergen", allergen: "milk" }]);
  });

  it("treats a food missing from the dictionary as may contain", () => {
    const recipe: FilterRecipe = { ...salad, ingredients: [{ key: "x", food: "not_in_dictionary" }] };
    expect(check(recipe, { excludedAllergens: ["peanut"] }).failed).toEqual([{ constraint: "allergen", allergen: "peanut" }]);
  });

  it("is not rescued by a side that could be switched off", () => {
    expect(check(bowl, { excludedAllergens: ["sesame"] }).failed).toEqual([{ constraint: "allergen", allergen: "sesame" }]);
  });

  it("checks the food a forced substitution brings in", () => {
    expect(check(bowl, { excludedFoods: ["chicken_breast"], excludedAllergens: ["soybean"] }).failed).toEqual([{ constraint: "allergen", allergen: "soybean" }]);
  });
});

describe("excluded foods", () => {
  it("switches off the side that holds the food, or the side of its leader", () => {
    expect(check(bowl, { excludedFoods: ["rice_cooked"] })).toEqual({ failed: [], forced: { sidesOff: ["rice"], substitutions: [] }, minutes: 20 });
    expect(check(bowl, { excludedFoods: ["sesame"] }).forced).toEqual({ sidesOff: ["rice"], substitutions: [] });
    expect(check(bowl, { excludedFoods: ["broccoli", "rice_cooked"] }).forced.sidesOff).toEqual(["rice", "vegetables"]);
  });

  it("applies a substitution that replaces the food and adds its minutes", () => {
    const result = check(bowl, { excludedFoods: ["chicken_breast"], maxMinutes: 25 });
    expect(result).toEqual({ failed: [], forced: { sidesOff: [], substitutions: ["tofu"] }, minutes: 25 });
    expect(check(bowl, { excludedFoods: ["chicken_breast"], maxMinutes: 24 }).failed).toEqual([{ constraint: "maxMinutes" }]);
  });

  it("does not use a substitution to another excluded food", () => {
    expect(check(bowl, { excludedFoods: ["chicken_breast", "tofu_firm"] }).failed).toEqual([{ constraint: "excludedFood", food: "chicken_breast" }]);
  });

  it("excludes the recipe when nothing removes the food", () => {
    expect(check(bowl, { excludedFoods: ["soy_sauce"] }).failed).toEqual([{ constraint: "excludedFood", food: "soy_sauce" }]);
  });
});

describe("required foods", () => {
  it("needs one food of every item among the authored ingredients", () => {
    expect(check(bowl, { requiredFoods: [["chicken_breast"], ["broccoli", "egg"]] }).failed).toEqual([]);
    expect(check(bowl, { requiredFoods: [["egg"], ["chicken_breast"], ["tofu_firm"]] }).failed).toEqual([
      { constraint: "requiredFood", index: 0 },
      { constraint: "requiredFood", index: 2 },
    ]);
  });

  it("does not count a food that only a substitution brings in", () => {
    expect(check(bowl, { excludedFoods: ["chicken_breast"], requiredFoods: [["tofu_firm"]] }).failed).toEqual([{ constraint: "requiredFood", index: 0 }]);
  });

  it("fails when an excluded food switches off the side that holds the required food", () => {
    expect(check(bowl, { excludedFoods: ["sesame"], requiredFoods: [["rice_cooked"]] }).failed).toEqual([{ constraint: "requiredFood", index: 0 }]);
  });
});

describe("applyHardFilters", () => {
  const recipes = [bowl, salad, soup];

  it("keeps everything without conditions and reports no items", () => {
    const result = applyHardFilters(recipes, none, new Set(), foods);
    expect(result.eligible.map((entry) => entry.recipe.id)).toEqual(["bowl", "salad", "soup"]);
    expect(result.exclusions).toEqual([]);
  });

  it("counts every active item, including items that exclude nothing, and recipes failing only that item", () => {
    const conditions: Conditions = { ...none, maxMinutes: 25, excludedAllergens: ["egg", "peanut"], excludedFoods: ["broccoli"], requiredFoods: [["chicken_breast"]] };
    const result = applyHardFilters(recipes, conditions, new Set(["salad"]), foods);
    expect(result.eligible).toEqual([{ recipe: bowl, forced: { sidesOff: ["vegetables"], substitutions: [] }, minutes: 20 }]);
    expect(result.exclusions).toEqual([
      { item: { constraint: "sessionExcluded" }, count: 1, onlyThis: 0 },
      { item: { constraint: "maxMinutes" }, count: 1, onlyThis: 0 },
      { item: { constraint: "allergen", allergen: "egg" }, count: 2, onlyThis: 0 },
      { item: { constraint: "allergen", allergen: "peanut" }, count: 1, onlyThis: 0 },
      { item: { constraint: "excludedFood", food: "broccoli" }, count: 0, onlyThis: 0 },
      { item: { constraint: "requiredFood", index: 0 }, count: 1, onlyThis: 0 },
    ]);
  });

  it("reports onlyThis when a recipe fails a single item, and equipment items only when they exclude something", () => {
    const result = applyHardFilters(recipes, { ...none, equipment: ["stove", "frying_pan"] }, new Set(), foods);
    expect(result.eligible.map((entry) => entry.recipe.id)).toEqual(["bowl", "salad"]);
    expect(result.exclusions).toEqual([{ item: { constraint: "equipment", equipment: "pot" }, count: 1, onlyThis: 1 }]);
  });

  it("does not depend on the order of the condition lists", () => {
    const a = applyHardFilters(recipes, { ...none, excludedAllergens: ["egg", "wheat"] }, new Set(), foods);
    const b = applyHardFilters(recipes, { ...none, excludedAllergens: ["wheat", "egg"] }, new Set(), foods);
    expect(a).toEqual(b);
  });
});
