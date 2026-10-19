import { describe, expect, it } from "vitest";
import { defaultState } from "../../domain/nutrition/amounts.ts";
import { calculateNutrition, type RecipeNutrition } from "../../domain/nutrition/engine.ts";
import { recommendationDataFromBundle } from "../../domain/recommendation/data.ts";
import { evaluateFit, type Tier } from "../../domain/recommendation/fit.ts";
import { solve, solveExhaustive, type SolveInput } from "../../domain/recommendation/solver.ts";
import { applyHardFilters } from "../../domain/recommendation/filters.ts";
import type { Conditions, Preset } from "../../domain/recommendation/types.ts";
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

describe("fit of the validation recipes at default amounts", () => {
  const PRESETS: readonly Preset[] = ["cut", "maintain", "bulk"];
  const nutrition = new Map(
    data.recipes.map((recipe): [string, RecipeNutrition] => {
      const result = calculateNutrition(recipe, defaultState(recipe), data.engine);
      if (!result.ok) throw new Error(recipe.id);
      return [recipe.id, result.value];
    }),
  );
  const tally = (tiers: readonly Tier[]) => ({
    met: tiers.filter((tier) => tier === "met").length,
    near: tiers.filter((tier) => tier === "near").length,
    not_met: tiers.filter((tier) => tier === "not_met").length,
  });
  const withoutRanges = (value: RecipeNutrition): Pick<RecipeNutrition, "perServing" | "ranges"> => ({
    perServing: value.perServing,
    ranges: Object.fromEntries(Object.entries(value.ranges).map(([key, range]) => [key, range && { ...range, shown: false }])) as RecipeNutrition["ranges"],
  });

  it("matches the Stage 0.7 counts when ranges are ignored", () => {
    const counts = PRESETS.map((preset) => tally([...nutrition.values()].map((value) => evaluateFit(withoutRanges(value), presetTargets(preset)).tier)));
    expect(counts).toEqual([
      { met: 6, near: 2, not_met: 12 },
      { met: 4, near: 2, not_met: 14 },
      { met: 2, near: 1, not_met: 17 },
    ]);
  });

  it("keeps the reviewed statuses with shown ranges", () => {
    const statuses = Object.fromEntries(
      data.recipes.map((recipe) => {
        const value = nutrition.get(recipe.id);
        if (!value) throw new Error(recipe.id);
        const fits = PRESETS.map((preset) => {
          const fit = evaluateFit(value, presetTargets(preset));
          return `${preset} ${fit.tier} (${fit.nutrients.map((entry) => `${entry.target} ${entry.status}${entry.basis === "range" ? " range" : ""}`).join(", ")})`;
        });
        return [recipe.id, fits];
      }),
    );
    expect(statuses).toMatchSnapshot();
  });
});

describe("bounded adjustment on the validation recipes", () => {
  const PRESETS: readonly Preset[] = ["cut", "maintain", "bulk"];
  const solveAll = (conditions: Partial<Conditions>, preset: Preset) =>
    filter(conditions).eligible.map((entry) => {
      const input: SolveInput = { recipe: entry.recipe, targets: presetTargets(preset), servings: entry.recipe.servings, forced: entry.forced, lockedSides: [] };
      return { id: entry.recipe.id, input, solution: solve(input, data.engine) };
    });
  const count = (results: ReturnType<typeof solveAll>) => ({
    met: results.filter((entry) => entry.solution.fit.tier === "met").length,
    near: results.filter((entry) => entry.solution.fit.tier === "near").length,
  });

  it("chooses the same states as the exhaustive search, without falling back", () => {
    for (const conditions of [{}, { excludedFoods: ["rice_cooked"] }]) {
      for (const preset of PRESETS) {
        for (const { id, input, solution } of solveAll(conditions, preset)) {
          expect(solution.method, `${preset} ${id}`).toBe("linear");
          expect({ ...solution, method: "exhaustive" }).toEqual(solveExhaustive(input, data.engine));
        }
      }
    }
  });

  // Stage 3.4 log: the coverage evaluation scenarios with ranges evaluated (ADR-029 D1).
  it("gives the reviewed met and near counts per scenario", () => {
    expect(count(solveAll({}, "cut"))).toEqual({ met: 9, near: 1 });
    expect(count(solveAll({ maxMinutes: 20 }, "cut"))).toEqual({ met: 8, near: 0 });
    expect(count(solveAll({}, "maintain"))).toEqual({ met: 11, near: 5 });
    expect(count(solveAll({}, "bulk"))).toEqual({ met: 7, near: 6 });
    expect(count(solveAll({ excludedAllergens: ["egg"] }, "cut"))).toEqual({ met: 9, near: 1 });
    expect(count(solveAll({ requiredFoods: [CHICKEN] }, "maintain"))).toEqual({ met: 5, near: 1 });
    expect(count(solveAll({ requiredFoods: [TOFU] }, "maintain"))).toEqual({ met: 1, near: 1 });
    expect(count(solveAll({ maxMinutes: 25 }, "bulk"))).toEqual({ met: 5, near: 5 });
  });

  it("keeps the reviewed adjustments", () => {
    const adjustments = Object.fromEntries(
      PRESETS.map((preset) => [
        preset,
        Object.fromEntries(
          solveAll({}, preset).map(({ id, solution }) => [
            id,
            `${solution.fit.tier}: ${[...solution.changes.map((change) => `${change.ingredient} ${String(change.from)}→${String(change.to)}`), ...solution.sidesOff.map((side) => `${side} off`)].join(", ") || "default amounts"}`,
          ]),
        ),
      ]),
    );
    expect(adjustments).toMatchSnapshot();
  });
});
