import { describe, expect, it } from "vitest";
import { recommendationDataFromBundle } from "../../domain/recommendation/data.ts";
import { applyHardFilters } from "../../domain/recommendation/filters.ts";
import type { Conditions } from "../../domain/recommendation/types.ts";
import { presetTargets, validatePoolRequest } from "../../domain/recommendation/validate.ts";
import { repositoryEngine } from "../../tools/content/repository.ts";

// Recommendation input from the in-memory calculation bundle, as in the browser.
const { calc } = repositoryEngine();
const data = recommendationDataFromBundle(calc);
const none: Conditions = { excludedFoods: [], excludedAllergens: [], requiredFoods: [], cuisines: [] };
const filter = (conditions: Partial<Conditions>, excluded: readonly string[] = []) =>
  applyHardFilters(data.recipes, { ...none, ...conditions }, new Set(excluded), data.foods);
const ids = (conditions: Partial<Conditions>) => filter(conditions).eligible.map((entry) => entry.recipe.id);

const CHICKEN = ["chicken_breast", "chicken_mince", "chicken_thigh"];
const TOFU = ["tofu_firm", "tofu_silken"];

describe("recommendation data", () => {
  it("lists the recipes in ID order and every food of the dictionary", () => {
    const sorted = data.recipes.map((recipe) => recipe.id);
    expect(sorted).toEqual([...sorted].sort());
    expect(data.recipes).toHaveLength(calc.recipes.length);
    expect([...data.foods.keys()].sort()).toEqual(calc.foods.map((food) => food.id).sort());
  });

  it("accepts every dictionary food as an excluded or required food", () => {
    const foods = calc.foods.map((food) => food.id);
    const result = validatePoolRequest({ targets: presetTargets("maintain"), servings: 1, conditions: { ...none, requiredFoods: foods.map((food) => [food]) } }, data.foods);
    expect(result.ok).toBe(true);
    expect(validatePoolRequest({ targets: presetTargets("maintain"), servings: 1, conditions: { ...none, excludedFoods: foods } }, data.foods).ok).toBe(true);
  });
});

describe("hard filters on the validation recipes", () => {
  // Eligible counts of the Stage 0.6 scenarios (docs/DECISIONS.md, with the Stage 0.6 allergen follow-up).
  it("reproduces the eligible counts of the coverage evaluation", () => {
    expect(ids({})).toHaveLength(20);
    expect(ids({ maxMinutes: 20 })).toHaveLength(13);
    expect(ids({ excludedAllergens: ["egg"] })).toHaveLength(14);
    expect(ids({ requiredFoods: [CHICKEN] })).toHaveLength(6);
    expect(ids({ requiredFoods: [TOFU] })).toHaveLength(3);
    expect(ids({ maxMinutes: 25 })).toHaveLength(15);
  });

  it("keeps every recipe with a time limit at or above its minutes and none below", () => {
    for (const recipe of data.recipes) {
      expect(ids({ maxMinutes: recipe.minutes })).toContain(recipe.id);
      expect(ids({ maxMinutes: recipe.minutes - 1 })).not.toContain(recipe.id);
    }
  });

  it("switches off rice sides instead of excluding the recipes when rice is excluded", () => {
    const result = filter({ excludedFoods: ["rice_cooked"] });
    const withRiceSide = data.recipes.filter((recipe) => recipe.sides.some((side) => side.key === "rice"));
    for (const recipe of withRiceSide) {
      expect(result.eligible.find((entry) => entry.recipe.id === recipe.id)?.forced.sidesOff).toContain("rice");
    }
    // Rice that belongs to the dish (a bowl) cannot be switched off.
    const excluded = result.exclusions.find((entry) => entry.item.constraint === "excludedFood");
    expect(excluded?.count).toBe(data.recipes.length - result.eligible.length);
    expect(ids({ excludedFoods: ["rice_cooked"] })).not.toContain("tuna_tofu_bowl");
  });

  it("leaves no recipe when the required ingredients are not used together", () => {
    // Three recipes use tofu and three use salmon, none both: each item alone excludes the other three.
    const result = filter({ requiredFoods: [TOFU, ["salmon"]] });
    expect(result.eligible).toEqual([]);
    expect(result.exclusions).toEqual([
      { item: { constraint: "requiredFood", index: 0 }, count: 17, onlyThis: 3 },
      { item: { constraint: "requiredFood", index: 1 }, count: 17, onlyThis: 3 },
    ]);
  });

  it("excludes every recipe with a matching or unknown allergen link, including sides and included ingredients", () => {
    for (const allergen of ["egg", "wheat", "soybean", "milk"] as const) {
      const eligible = new Set(ids({ excludedAllergens: [allergen] }));
      for (const recipe of data.recipes) {
        const blocked = recipe.ingredients.some((ingredient) => {
          const food = data.foods.get(ingredient.food);
          return food === undefined || food.allergens === "unknown" || food.allergens.some((link) => link.allergen === allergen);
        });
        expect(eligible.has(recipe.id), `${allergen} ${recipe.id}`).toBe(!blocked);
      }
    }
  });

  it("removes the recipes the user excluded in the session", () => {
    const result = filter({}, ["salmon_tempura"]);
    expect(result.eligible.map((entry) => entry.recipe.id)).not.toContain("salmon_tempura");
    expect(result.exclusions).toEqual([{ item: { constraint: "sessionExcluded" }, count: 1, onlyThis: 1 }]);
  });
});
