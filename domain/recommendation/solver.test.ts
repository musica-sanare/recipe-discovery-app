import { describe, expect, it } from "vitest";
import type { CompositionValue } from "../../shared/composition.ts";
import type { EngineComposition, EngineData } from "../nutrition/data.ts";
import { precompute, solve, solveExhaustive, type SolveInput, type SolverRecipe } from "./solver.ts";
import type { Targets } from "./types.ts";

// Hand-made raw and as-sold foods (per 100 g) so that every amount below can be checked by hand.
const v = (value: number): CompositionValue => ({ value, notation: "measured" });
const zero: CompositionValue = { value: 0, notation: "zero" };
const food = (kcal: number, protein: number, fat: number, carb: number): EngineComposition => ({
  refuse: zero,
  nutrients: { ENERC_KCAL: v(kcal), "PROT-": v(protein), "FAT-": v(fat), "CHOCDF-": v(carb), NACL_EQ: zero },
});
const data: EngineData = {
  foods: new Map([
    ["chicken", { raw: "90001" }],
    ["rice", { as_is: "90002" }],
    ["egg", { raw: "90003" }],
    ["oil", { as_is: "90004" }],
    ["tofu", { raw: "90005" }],
    ["thigh", { raw: "90006" }],
    ["sauce", { as_is: "90007" }],
  ]),
  composition: new Map([
    ["90001", food(100, 20, 2, 0)],
    ["90002", food(150, 2.5, 0.3, 35)],
    ["90003", food(140, 12, 10, 0)],
    ["90004", food(900, 0, 100, 0)],
    ["90005", food(70, 7, 4, 2)],
    ["90006", food(200, 17, 14, 0)],
    // Carbohydrate unmeasured ("-"): the recipe's carbohydrate is unknown.
    ["90007", { refuse: zero, nutrients: { ENERC_KCAL: v(80), "PROT-": v(2), "FAT-": v(1), "CHOCDF-": { value: null, notation: "unmeasured" }, NACL_EQ: zero } }],
  ]),
  rates: new Map(),
  versions: { contentVersion: "2026-10-19.1", composition: { workbookUpdated: "2026-03-27", workbookSha256: "0".repeat(64), cookingSha256: "1".repeat(64) } },
};

// Chicken 150 g (100–250 g, step 10) with oil linked to it, and a rice side the solver
// may switch off (100–300 g, step 50). Default: 420 kcal, protein 33.75 g, fat 8.45 g.
const bowl: SolverRecipe = {
  servings: 1,
  ingredients: [
    { key: "chicken", food: "chicken", grams: 150, state: "raw", adjust: { kind: "grams", min: 100, max: 250, step: 10 } },
    { key: "oil", food: "oil", grams: 5, state: "as_is", linkedTo: "chicken" },
    { key: "rice", food: "rice", grams: 150, state: "as_is", adjust: { kind: "grams", min: 100, max: 300, step: 50 } },
  ],
  sides: [{ key: "rice", ingredients: ["rice"], solverMayRemove: true }],
  substitutions: [{ key: "tofu", ingredient: "chicken", food: "tofu", state: "raw", ratio: 1.5 }],
};

// Two eggs as whole units (1–4) with rice that belongs to the dish (no side).
const eggs: SolverRecipe = {
  servings: 1,
  ingredients: [
    { key: "egg", food: "egg", grams: 100, state: "raw", adjust: { kind: "count", unitGrams: 50, min: 1, max: 4 } },
    { key: "rice", food: "rice", grams: 150, state: "as_is" },
  ],
  sides: [],
  substitutions: [],
};

// Two identical adjustable chicken portions, to test ties.
const twins: SolverRecipe = {
  servings: 1,
  ingredients: [
    { key: "first", food: "chicken", grams: 100, state: "raw", adjust: { kind: "grams", min: 50, max: 150, step: 10 } },
    { key: "second", food: "chicken", grams: 100, state: "raw", adjust: { kind: "grams", min: 50, max: 150, step: 10 } },
  ],
  sides: [],
  substitutions: [],
};

// Chicken thigh calculated from raw for karaage: bands −15 %/+5 % and ±30 % of fat.
const karaage: SolverRecipe = {
  servings: 1,
  ingredients: [{ key: "thigh", food: "thigh", grams: 150, state: "raw", cooking: "karaage", adjust: { kind: "grams", min: 100, max: 200, step: 10 } }],
  sides: [],
  substitutions: [],
};

// Three adjustable ingredients, one with an unmeasured carbohydrate, and a removable side.
const stew: SolverRecipe = {
  servings: 1,
  ingredients: [
    { key: "chicken", food: "chicken", grams: 120, state: "raw", adjust: { kind: "grams", min: 80, max: 200, step: 20 } },
    { key: "egg", food: "egg", grams: 50, state: "raw", adjust: { kind: "count", unitGrams: 50, min: 0, max: 3 } },
    { key: "sauce", food: "sauce", grams: 30, state: "as_is", adjust: { kind: "grams", min: 10, max: 50, step: 10 } },
    { key: "rice", food: "rice", grams: 150, state: "as_is", adjust: { kind: "grams", min: 100, max: 250, step: 50 } },
  ],
  sides: [{ key: "rice", ingredients: ["rice"], solverMayRemove: true }],
  substitutions: [],
};

const input = (recipe: SolverRecipe, targets: Targets, overrides: Partial<SolveInput> = {}): SolveInput => ({
  recipe,
  targets,
  servings: recipe.servings,
  forced: { sidesOff: [], substitutions: [] },
  lockedSides: [],
  ...overrides,
});
const grams = (solution: ReturnType<typeof solve>, key: string) => solution.nutrition.ingredients.find((ingredient) => ingredient.key === key)?.grams;

describe("solve", () => {
  it("keeps the default amounts when they already meet the targets", () => {
    const solution = solve(input(bowl, { kcal: { min: 300, max: 450 }, proteinMin: 30 }), data);
    expect(solution).toMatchObject({ changes: [], sidesOff: [], relativeChange: 0, method: "linear" });
    expect(solution.state).toEqual({ servings: 1, sidesOff: [], amounts: {}, substitutions: [] });
    expect(solution.fit.tier).toBe("met");
    expect(solution.defaultFit.tier).toBe("met");
  });

  it("chooses the smallest relative change among the states that meet the targets", () => {
    // Chicken with its linked oil is 1.3 kcal/g: 190 g gives 472 kcal (change 4/15), which beats
    // rice 150 → 200 g (1/3) and every combination.
    const solution = solve(input(bowl, { kcal: { min: 470, max: 650 }, proteinMin: 34 }), data);
    expect(solution.changes).toEqual([{ ingredient: "chicken", from: 150, to: 190, unit: "g" }]);
    expect(solution.relativeChange).toBeCloseTo(40 / 150, 12);
    expect(solution.fit.tier).toBe("met");
    // The default 420 kcal is below the tolerance limit of 423 kcal.
    expect(solution.defaultFit.tier).toBe("not_met");
  });

  it("scales linked ingredients with their leader", () => {
    // Without rice: chicken 150 g gives 195 kcal (with 5 g of oil); 260 kcal needs chicken 200 g.
    const solution = solve(input(bowl, { kcal: { min: 250, max: 300 } }, { forced: { sidesOff: ["rice"], substitutions: [] } }), data);
    expect(solution.changes).toEqual([{ ingredient: "chicken", from: 150, to: 200, unit: "g" }]);
    expect(grams(solution, "oil")).toBeCloseTo(5 * (200 / 150), 12);
  });

  it("switches off a side the solver may remove when that is the closest way to the targets", () => {
    const solution = solve(input(bowl, { kcal: { min: 150, max: 250 }, proteinMin: 30 }), data);
    expect(solution.sidesOff).toEqual(["rice"]);
    expect(solution.state.sidesOff).toEqual(["rice"]);
    expect(solution.changes).toEqual([]);
    expect(solution.relativeChange).toBe(1);
    expect(solution.fit.tier).toBe("met");
  });

  it("keeps a locked side on and a forced side off", () => {
    const locked = solve(input(bowl, { kcal: { min: 150, max: 250 }, proteinMin: 30 }, { lockedSides: ["rice"] }), data);
    expect(locked.state.sidesOff).toEqual([]);
    expect(locked.fit.tier).not.toBe("met");
    const forced = solve(input(bowl, { kcal: { min: 300, max: 450 } }, { forced: { sidesOff: ["rice"], substitutions: [] } }), data);
    expect(forced.state.sidesOff).toEqual(["rice"]);
    expect(forced.sidesOff).toEqual([]);
    // 300 kcal needs chicken 240 g (1.3 kcal/g); the forced rice side does not count as a change.
    expect(forced.changes).toEqual([{ ingredient: "chicken", from: 150, to: 240, unit: "g" }]);
    expect(forced.relativeChange).toBeCloseTo(90 / 150, 12);
  });

  it("returns the closest state as near with its gap when nothing in bounds meets the targets", () => {
    // Without rice the maximum is chicken 250 g with 8.3 g oil: 325 kcal, short of 360 by 35 kcal (tolerance 36).
    const solution = solve(input(bowl, { kcal: { min: 360, max: 500 } }, { forced: { sidesOff: ["rice"], substitutions: [] } }), data);
    expect(solution.changes).toEqual([{ ingredient: "chicken", from: 150, to: 250, unit: "g" }]);
    expect(solution.fit.tier).toBe("near");
    expect(solution.fit.nutrients[0]?.gap).toBeCloseTo(360 - (250 + 900 * ((5 * 250) / 150) / 100), 9);
  });

  it("keeps whole units", () => {
    // Rice 225 kcal; 2 eggs 140 kcal (365) are short of 400; 3 eggs (435) meet.
    const solution = solve(input(eggs, { kcal: { min: 400, max: 500 } }), data);
    expect(solution.changes).toEqual([{ ingredient: "egg", from: 2, to: 3, unit: "count" }]);
    expect(solution.state.amounts).toEqual({ egg: 3 });
    expect(grams(solution, "egg")).toBe(150);
  });

  it("breaks ties by the smallest amounts in ingredient order", () => {
    // +10 g of either portion meets 210 kcal at the same cost; the first stays at 100 g.
    const solution = solve(input(twins, { kcal: { min: 210, max: 215 } }), data);
    expect(solution.changes).toEqual([{ ingredient: "second", from: 100, to: 110, unit: "g" }]);
  });

  it("moves a wide fried range inside the target instead of stopping at the point value", () => {
    // Fat 21 g at 150 g is inside 25 g by point, but the range reaches 21 × 1.35 = 28.35 g.
    // 130 g gives a high end of 18.2 × 1.35 = 24.57 g.
    const solution = solve(input(karaage, { kcal: { min: 100, max: 500 }, fatMax: 25 }), data);
    expect(solution.defaultFit.tier).toBe("near");
    expect(solution.changes).toEqual([{ ingredient: "thigh", from: 150, to: 130, unit: "g" }]);
    expect(solution.fit.nutrients.find((entry) => entry.target === "fat")).toMatchObject({ status: "met", basis: "range" });
  });

  it("uses the bounds of a forced substitution, scaled by its ratio", () => {
    // Tofu 225 g (150–375 g, step 15) with its linked oil is 0.9 kcal/g, plus 225 kcal of rice:
    // 480 kcal needs tofu 285 g (481.5 kcal).
    const solution = solve(input(bowl, { kcal: { min: 480, max: 600 } }, { forced: { sidesOff: [], substitutions: ["tofu"] } }), data);
    expect(solution.state.substitutions).toEqual(["tofu"]);
    expect(solution.changes).toEqual([{ ingredient: "chicken", from: 225, to: 285, unit: "g" }]);
  });

  it("does not depend on the servings", () => {
    const targets: Targets = { kcal: { min: 470, max: 650 }, proteinMin: 34 };
    const one = solve(input(bowl, targets), data);
    const four = solve(input(bowl, targets, { servings: 4 }), data);
    expect(four.state).toEqual({ ...one.state, servings: 4 });
    expect(four.nutrition.perServing.ENERC_KCAL).toBeCloseTo(one.nutrition.perServing.ENERC_KCAL ?? Number.NaN, 9);
  });

  it("is deterministic and equal to the exhaustive search", () => {
    const cases: SolveInput[] = [
      input(bowl, { kcal: { min: 300, max: 450 }, proteinMin: 30 }),
      input(bowl, { kcal: { min: 470, max: 650 }, proteinMin: 34 }),
      input(bowl, { kcal: { min: 150, max: 250 }, proteinMin: 30, fatMax: 5 }),
      input(bowl, { kcal: { min: 600, max: 900 }, proteinMin: 45, carbohydrate: { min: 60, max: 90 } }),
      input(bowl, { kcal: { min: 480, max: 600 } }, { forced: { sidesOff: [], substitutions: ["tofu"] } }),
      input(eggs, { kcal: { min: 400, max: 500 }, fatMax: 12 }),
      input(twins, { kcal: { min: 210, max: 215 } }),
      input(karaage, { kcal: { min: 100, max: 500 }, fatMax: 25 }),
      input(karaage, { kcal: { min: 700, max: 900 }, proteinMin: 50 }),
      input(stew, { kcal: { min: 400, max: 550 }, proteinMin: 35, fatMax: 15 }),
      input(stew, { kcal: { min: 300, max: 450 }, proteinMin: 30, carbohydrate: { min: 20, max: 60 } }),
    ];
    for (const entry of cases) {
      const linear = solve(entry, data);
      expect(solve(entry, data)).toEqual(linear);
      const exhaustive = solveExhaustive(entry, data);
      expect({ ...linear, method: "exhaustive" }).toEqual(exhaustive);
    }
  });
});

describe("precompute", () => {
  it("gives the same solution as computing everything in the search", () => {
    const cases: SolveInput[] = [
      input(bowl, { kcal: { min: 300, max: 450 }, proteinMin: 30 }),
      input(bowl, { kcal: { min: 150, max: 250 }, proteinMin: 30 }),
      input(bowl, { kcal: { min: 150, max: 250 }, proteinMin: 30 }, { lockedSides: ["rice"] }),
      input(eggs, { kcal: { min: 400, max: 500 }, fatMax: 12 }),
      input(twins, { kcal: { min: 210, max: 215 } }),
      input(karaage, { kcal: { min: 100, max: 500 }, fatMax: 25 }),
    ];
    for (const entry of cases) {
      expect(solve({ ...entry, precomputed: precompute(entry.recipe, data) }, data)).toStrictEqual(solve(entry, data));
    }
  });

  it("holds one model per combination of removable sides", () => {
    expect([...precompute(bowl, data).models.keys()]).toEqual(["", "rice"]);
    expect([...precompute(eggs, data).models.keys()]).toEqual([""]);
  });

  it("is used only for one serving without forced sides or substitutions", () => {
    // Results of another recipe show whether the search used them.
    const foreign = { ...precompute(karaage, data), models: new Map() };
    const targets: Targets = { kcal: { min: 470, max: 650 }, proteinMin: 34 };
    for (const overrides of [{ servings: 2 }, { forced: { sidesOff: ["rice"], substitutions: [] } }, { forced: { sidesOff: [], substitutions: ["tofu"] } }]) {
      const entry = input(bowl, targets, overrides);
      expect(solve({ ...entry, precomputed: foreign }, data)).toStrictEqual(solve(entry, data));
    }
    const entry = input(bowl, targets);
    expect(solve({ ...entry, precomputed: foreign }, data)).not.toStrictEqual(solve(entry, data));
  });
});
