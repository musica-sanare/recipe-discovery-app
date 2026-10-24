import { describe, expect, it } from "vitest";
import { defaultState } from "../../domain/nutrition/amounts.ts";
import { calculateNutrition, type RecipeNutrition } from "../../domain/nutrition/engine.ts";
import { recommendationDataFromBundle } from "../../domain/recommendation/data.ts";
import { evaluateFit, type Tier } from "../../domain/recommendation/fit.ts";
import { evaluatePool, selectCandidates, type EvaluatedPool, type Selection } from "../../domain/recommendation/recommend.ts";
import { solve, solveExhaustive, type SolveInput } from "../../domain/recommendation/solver.ts";
import { applyHardFilters } from "../../domain/recommendation/filters.ts";
import type { Conditions, Preset, Session } from "../../domain/recommendation/types.ts";
import { presetTargets, validatePoolRequest } from "../../domain/recommendation/validate.ts";
import { METHOD_FAMILIES, methodFamily } from "../../shared/recipe.ts";
import { repositoryEngine, validationBundleInput } from "../../tools/content/repository.ts";

// Recommendation input from the in-memory calculation bundle, as in the browser, on the
// 20 validation recipes whose counts and statuses were reviewed in Phases 0 and 3.
const { calc } = repositoryEngine(validationBundleInput());
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
    expect(count(solveAll({}, "cut"))).toEqual({ met: 9, near: 2 });
    expect(count(solveAll({ maxMinutes: 20 }, "cut"))).toEqual({ met: 8, near: 1 });
    expect(count(solveAll({}, "maintain"))).toEqual({ met: 13, near: 5 });
    expect(count(solveAll({}, "bulk"))).toEqual({ met: 8, near: 7 });
    expect(count(solveAll({ excludedAllergens: ["egg"] }, "cut"))).toEqual({ met: 9, near: 1 });
    expect(count(solveAll({ requiredFoods: [CHICKEN] }, "maintain"))).toEqual({ met: 5, near: 1 });
    expect(count(solveAll({ requiredFoods: [TOFU] }, "maintain"))).toEqual({ met: 2, near: 1 });
    expect(count(solveAll({ maxMinutes: 25 }, "bulk"))).toEqual({ met: 6, near: 6 });
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

describe("cooking-method families", () => {
  it("derives the families of the Stage 3.1 log", () => {
    const counts = new Map(METHOD_FAMILIES.map((family) => [family, 0]));
    for (const recipe of data.recipes) {
      const family = methodFamily(recipe, (food) => data.foods.get(food)?.proteinGroup);
      counts.set(family, (counts.get(family) ?? 0) + 1);
    }
    expect(Object.fromEntries(counts)).toEqual({ grill: 2, simmer: 3, steam: 1, stir_fry: 4, pan: 5, fry: 4, no_cook: 1 });
  });
});

describe("candidates and re-suggestion", () => {
  const emptySession: Session = { shown: [], excluded: [], previous: [], keep: [] };
  const poolFor = (preset: Preset, conditions: Partial<Conditions> = {}): EvaluatedPool => {
    const result = evaluatePool({ targets: presetTargets(preset), servings: 1, conditions: { ...none, ...conditions } }, data);
    if (!result.ok) throw new Error(JSON.stringify(result.errors));
    return result.value;
  };
  const select = (pool: EvaluatedPool, session: Session, seed: number): Selection => {
    const result = selectCandidates(pool, session, seed);
    if (!result.ok) throw new Error(JSON.stringify(result.errors));
    return result.value;
  };
  const ids = (selection: Selection) => selection.candidates.map((entry) => entry.recipe);
  const cut = poolFor("cut");

  it("returns up to five distinct recipes that meet the targets, with varied attributes", () => {
    const selection = select(cut, emptySession, 0);
    expect(selection.tiers).toEqual({ met: 9, near: 2, not_met: 9 });
    expect(ids(selection)).toHaveLength(5);
    expect(new Set(ids(selection)).size).toBe(5);
    for (const entry of selection.candidates) expect(entry.solution.fit.tier).toBe("met");
    const values = (key: "proteinGroup" | "cuisine" | "method") => new Set(selection.candidates.map((entry) => entry.attributes[key])).size;
    expect(values("method")).toBe(5);
    expect(values("proteinGroup")).toBeGreaterThanOrEqual(3);
  });

  it("gives the same candidates in the same order for the same input and seed", () => {
    expect(select(poolFor("cut"), emptySession, 4)).toEqual(select(cut, emptySession, 4));
  });

  it("gives reproducible, different sets for different seeds", () => {
    const sets = new Set(Array.from({ length: 30 }, (_, seed) => [...ids(select(cut, emptySession, seed))].sort().join()));
    expect(sets.size).toBeGreaterThan(1);
    expect(ids(select(cut, emptySession, 17))).toEqual(ids(select(cut, emptySession, 17)));
  });

  it("does not repeat shown recipes until the pool is exhausted", () => {
    const first = select(cut, emptySession, 0);
    const secondSession: Session = { ...emptySession, shown: ids(first), previous: ids(first) };
    const second = select(cut, secondSession, 1);
    expect(second.exhausted).toBe(false);
    expect(ids(second)).toHaveLength(4);
    expect(ids(second).filter((id) => ids(first).includes(id))).toEqual([]);
    // All nine met recipes have been shown: the next set comes from the first set again.
    const third = select(cut, { ...emptySession, shown: [...ids(first), ...ids(second)], previous: ids(second) }, 2);
    expect(third.exhausted).toBe(true);
    expect([...ids(third)].sort()).toEqual([...ids(first)].sort());
  });

  it("replaces only an excluded card and counts the exclusion", () => {
    const first = select(cut, emptySession, 0);
    const [removed, ...others] = ids(first);
    if (removed === undefined) throw new Error("no candidate");
    const next = select(cut, { shown: ids(first), excluded: [removed], previous: ids(first), keep: others }, 1);
    expect(ids(next).slice(0, 4)).toEqual(others);
    expect(ids(next)).toHaveLength(5);
    expect(ids(next)).not.toContain(removed);
    expect(next.tiers).toEqual({ met: 8, near: 2, not_met: 9 });
    expect(next.exclusions).toEqual([{ item: { constraint: "sessionExcluded" }, count: 1, onlyThis: 1 }]);
  });

  it("raises preferred recipes when diversity ties", () => {
    const korean = select(poolFor("bulk", { cuisines: ["korean"] }), emptySession, 0);
    expect(ids(korean)[0]).toBe("beef_shimeji_bowl");
  });

  it("returns no candidates for blocking contradictions", () => {
    const result = evaluatePool({ targets: { kcal: { min: 300, max: 400 }, proteinMin: 150 }, servings: 1, conditions: none }, data);
    expect(result.ok && result.value.blocked).toBe(true);
    expect(result.ok && result.value.entries).toEqual([]);
    expect(result.ok && result.value.contradictions.map((entry) => entry.severity)).toEqual(["blocking"]);
  });

  it("rejects invalid sessions and seeds", () => {
    expect(selectCandidates(cut, { ...emptySession, keep: ["missing"] }, 0)).toEqual({ ok: false, errors: [{ code: "unknown_recipe", field: "keep", recipe: "missing" }] });
    expect(selectCandidates(cut, emptySession, -1).ok).toBe(false);
  });

  it("keeps a side that holds a required food on", () => {
    const pool = poolFor("cut", { requiredFoods: [["rice_cooked"]] });
    for (const entry of pool.entries) expect(entry.solution.sidesOff, entry.recipe).not.toContain("rice");
  });
});

describe("few or no candidates, relaxation, reasons", () => {
  const emptySession: Session = { shown: [], excluded: [], previous: [], keep: [] };
  const run = (preset: Preset, conditions: Partial<Conditions>, session: Session = emptySession, seed = 0) => {
    const pool = evaluatePool({ targets: presetTargets(preset), servings: 1, conditions: { ...none, ...conditions } }, data);
    if (!pool.ok) throw new Error(JSON.stringify(pool.errors));
    const selection = selectCandidates(pool.value, session, seed);
    if (!selection.ok) throw new Error(JSON.stringify(selection.errors));
    return selection.value;
  };
  const metCount = (preset: Preset, conditions: Partial<Conditions>, excluded: readonly string[] = []) =>
    run(preset, conditions, { ...emptySession, excluded }).tiers.met;
  const nearCount = (preset: Preset, conditions: Partial<Conditions>, excluded: readonly string[] = []) =>
    run(preset, conditions, { ...emptySession, excluded }).tiers.near;

  it("adds close alternatives up to three recipes, best fit first", () => {
    const selection = run("maintain", { requiredFoods: [["salmon"]] });
    expect(selection.candidates.map((entry) => entry.recipe)).toEqual(["salmon_cabbage_microwave"]);
    expect(selection.alternatives.map((entry) => [entry.recipe, entry.solution.fit.tier])).toEqual([
      ["salmon_tempura", "near"],
      ["salmon_tomato_pasta", "not_met"],
    ]);
  });

  it("has no alternatives or relaxations when at least three recipes meet the targets", () => {
    const selection = run("cut", {});
    expect(selection.alternatives).toEqual([]);
    expect(selection.relaxations).toEqual([]);
  });

  it("returns an empty set with exclusion counts and relaxations when nothing passes the filters", () => {
    const conditions = { requiredFoods: [TOFU, ["salmon"]] };
    const selection = run("maintain", conditions);
    expect(selection.candidates).toEqual([]);
    expect(selection.alternatives).toEqual([]);
    expect(selection.tiers).toEqual({ met: 0, near: 0, not_met: 0 });
    expect(selection.relaxations).toEqual([
      { constraint: "requiredFood", index: 1, gain: { met: metCount("maintain", { requiredFoods: [TOFU] }), near: nearCount("maintain", { requiredFoods: [TOFU] }) } },
      { constraint: "requiredFood", index: 0, gain: { met: metCount("maintain", { requiredFoods: [["salmon"]] }), near: nearCount("maintain", { requiredFoods: [["salmon"]] }) } },
    ]);
  });

  it("offers the smallest time that adds a met recipe, with exactly recomputed gains", () => {
    const selection = run("bulk", { maxMinutes: 10 });
    const [time] = selection.relaxations;
    expect(time?.constraint).toBe("maxMinutes");
    if (time?.constraint !== "maxMinutes") throw new Error("no time relaxation");
    expect(time.to).toBe(15);
    expect(time.gain).toEqual({
      met: metCount("bulk", { maxMinutes: 15 }) - metCount("bulk", { maxMinutes: 10 }),
      near: nearCount("bulk", { maxMinutes: 15 }) - nearCount("bulk", { maxMinutes: 10 }),
    });
    expect(metCount("bulk", { maxMinutes: 14 })).toBe(metCount("bulk", { maxMinutes: 10 }));
  });

  it("recomputes every gain exactly and never relaxes allergens or the user's exclusions", () => {
    const conditions: Partial<Conditions> = { equipment: ["microwave", "pot", "stove"], excludedAllergens: ["egg"], excludedFoods: ["rice_cooked", "broccoli"], maxMinutes: 15 };
    const excluded = ["pork_shabu_salad"];
    const selection = run("cut", conditions, { ...emptySession, excluded });
    expect(selection.tiers.met).toBeLessThan(3);
    expect(selection.relaxations.length).toBeGreaterThan(0);
    const base = { met: metCount("cut", conditions, excluded), near: nearCount("cut", conditions, excluded) };
    for (const relaxation of selection.relaxations) {
      expect(["maxMinutes", "equipment", "requiredFood", "excludedFood"]).toContain(relaxation.constraint);
      let relaxed: Partial<Conditions> = conditions;
      if (relaxation.constraint === "maxMinutes") relaxed = { ...conditions, maxMinutes: relaxation.to };
      if (relaxation.constraint === "equipment") relaxed = { ...conditions, equipment: [...(conditions.equipment ?? []), relaxation.add] };
      if (relaxation.constraint === "excludedFood") relaxed = { ...conditions, excludedFoods: conditions.excludedFoods?.filter((food) => food !== relaxation.food) ?? [] };
      expect(relaxation.gain).toEqual({ met: metCount("cut", relaxed, excluded) - base.met, near: nearCount("cut", relaxed, excluded) - base.near });
    }
    const gains = selection.relaxations.map((relaxation) => [relaxation.gain.met, relaxation.gain.near]);
    expect(gains).toEqual([...gains].sort((a, b) => (b[0] ?? 0) - (a[0] ?? 0) || (b[1] ?? 0) - (a[1] ?? 0)));
  });

  it("gives typed reason data for the candidates", () => {
    const first = run("cut", { cuisines: ["japanese"], effort: 2, requiredFoods: [["pork_fillet", "pork_leg", "pork_loin", "chicken_breast"]] });
    const reasons = first.candidates.flatMap((entry) => entry.reasons.map((reason) => reason.code));
    expect(reasons.filter((code) => code === "highest_among_candidates")).toHaveLength(1);
    expect(reasons.filter((code) => code === "lowest_among_candidates")).toHaveLength(1);
    for (const entry of first.candidates) {
      const codes = entry.reasons.map((reason) => reason.code);
      expect(codes).toContain(entry.solution.changes.length > 0 || entry.solution.sidesOff.length > 0 ? "meets_with_adjustment" : "meets_all_targets");
      expect(codes.includes("matches_cuisine")).toBe(entry.attributes.cuisine === "japanese");
      expect(codes.includes("within_effort")).toBe(entry.effort <= 2);
      expect(codes.includes("quick")).toBe(entry.minutes <= 20);
      expect(entry.reasons.find((reason) => reason.code === "uses_required_foods")).toBeDefined();
      expect(codes).not.toContain("new_attribute");
    }
    const ids = first.candidates.map((entry) => entry.recipe);
    const second = run("cut", {}, { ...emptySession, shown: ids, previous: ids }, 1);
    const previous = first.candidates.map((entry) => entry.attributes);
    for (const entry of second.candidates) {
      const fresh = entry.reasons.flatMap((reason) => (reason.code === "new_attribute" ? [reason.attribute] : []));
      expect(fresh).toEqual((["proteinGroup", "cuisine", "method"] as const).filter((key) => !previous.some((other) => other[key] === entry.attributes[key])));
    }
  });

  it("reports near and missed targets with gaps for alternatives", () => {
    const [champuru, mapo] = run("cut", { requiredFoods: [TOFU] }).alternatives;
    expect(champuru?.reasons).toContainEqual({ code: "range_straddles", target: "protein" });
    const fat = mapo?.reasons.find((reason) => reason.code === "misses_target" && reason.target === "fat");
    expect(fat?.code === "misses_target" && fat.gap).toBeGreaterThan(2);
    expect(mapo?.reasons.map((reason) => reason.code)).not.toContain("meets_all_targets");
  });
});
