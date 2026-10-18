import { describe, expect, it } from "vitest";
import type { Conditions, InputError, PoolRequest, Session } from "./types.ts";
import { checkContradictions, presetTargets, validatePoolRequest, validateSession } from "./validate.ts";

const foods = new Set(["chicken_breast", "chicken_thigh", "egg", "rice_cooked"]);
const conditions: Conditions = { excludedFoods: [], excludedAllergens: [], requiredFoods: [], cuisines: [] };
const request = (overrides: Partial<PoolRequest> = {}): PoolRequest => ({ targets: presetTargets("cut"), servings: 1, conditions, ...overrides });

const errors = (input: PoolRequest): readonly InputError[] => {
  const result = validatePoolRequest(input, foods);
  return result.ok ? [] : result.errors;
};

describe("presets", () => {
  it("match ADR-025", () => {
    expect(presetTargets("cut")).toEqual({ kcal: { min: 450, max: 650 }, proteinMin: 35, fatMax: 15 });
    expect(presetTargets("maintain")).toEqual({ kcal: { min: 550, max: 750 }, proteinMin: 30, fatMax: 20 });
    expect(presetTargets("bulk")).toEqual({ kcal: { min: 750, max: 950 }, proteinMin: 45, fatMax: 30 });
  });
});

describe("validatePoolRequest", () => {
  it("accepts every preset with default conditions", () => {
    for (const preset of ["cut", "maintain", "bulk"] as const) expect(errors(request({ targets: presetTargets(preset) }))).toEqual([]);
  });

  it("accepts values exactly on the limits", () => {
    const targets = { kcal: { min: 100, max: 2000 }, proteinMin: 0, fatMax: 150, carbohydrate: { min: 0, max: 400 } };
    expect(errors(request({ targets, servings: 20, conditions: { ...conditions, maxMinutes: 5 } }))).toEqual([]);
    expect(errors(request({ servings: 1, conditions: { ...conditions, maxMinutes: 240 } }))).toEqual([]);
  });

  it("rejects numbers outside the limits or not finite", () => {
    const targets = { kcal: { min: 99, max: Number.NaN }, proteinMin: 201, fatMax: -1, carbohydrate: { min: 0, max: Number.POSITIVE_INFINITY } };
    expect(errors(request({ targets, conditions: { ...conditions, maxMinutes: 241 } }))).toEqual([
      { code: "out_of_range", field: "kcal.min", value: 99, min: 100, max: 2000 },
      { code: "invalid_number", field: "kcal.max", value: Number.NaN },
      { code: "out_of_range", field: "proteinMin", value: 201, min: 0, max: 200 },
      { code: "out_of_range", field: "fatMax", value: -1, min: 0, max: 150 },
      { code: "invalid_number", field: "carbohydrate.max", value: Number.POSITIVE_INFINITY },
      { code: "out_of_range", field: "maxMinutes", value: 241, min: 5, max: 240 },
    ]);
  });

  it("rejects inverted bounds only when both ends are valid", () => {
    expect(errors(request({ targets: { kcal: { min: 700, max: 600 }, carbohydrate: { min: 80, max: 40 } } }))).toEqual([
      { code: "inverted_bound", field: "kcal", min: 700, max: 600 },
      { code: "inverted_bound", field: "carbohydrate", min: 80, max: 40 },
    ]);
    expect(errors(request({ targets: { kcal: { min: 2500, max: 600 } } }))).toEqual([{ code: "out_of_range", field: "kcal.min", value: 2500, min: 100, max: 2000 }]);
    expect(errors(request({ targets: { kcal: { min: 600, max: 600 } } }))).toEqual([]);
  });

  it("rejects servings that are not whole numbers from 1 to 20", () => {
    for (const servings of [0, 1.5, 21, Number.NaN]) expect(errors(request({ servings }))).toEqual([{ code: "invalid_servings", servings }]);
  });

  it("rejects foods missing from the dictionary", () => {
    const input = request({ conditions: { ...conditions, excludedFoods: ["tofu_firm"], requiredFoods: [["chicken_breast", "unknown_food"]] } });
    expect(errors(input)).toEqual([
      { code: "unknown_food", field: "excludedFoods", food: "tofu_firm" },
      { code: "unknown_food", field: "requiredFoods", food: "unknown_food" },
    ]);
  });

  it("rejects an empty required item and a required item whose foods are all excluded", () => {
    const input = request({
      conditions: { ...conditions, excludedFoods: ["chicken_breast", "chicken_thigh"], requiredFoods: [[], ["chicken_thigh", "chicken_breast"], ["chicken_breast", "egg"]] },
    });
    expect(errors(input)).toEqual([
      { code: "empty_required_item", index: 0 },
      { code: "required_and_excluded", index: 1, foods: ["chicken_breast", "chicken_thigh"] },
    ]);
  });

  it("normalizes lists so that equal requests are equal", () => {
    const a = validatePoolRequest(
      request({
        conditions: {
          ...conditions,
          equipment: ["stove", "microwave", "stove"],
          excludedFoods: ["egg", "chicken_thigh", "egg"],
          excludedAllergens: ["wheat", "egg"],
          requiredFoods: [["rice_cooked", "chicken_breast"]],
          cuisines: ["western", "japanese"],
        },
      }),
      foods,
    );
    expect(a.ok && a.value.conditions).toEqual({
      equipment: ["microwave", "stove"],
      excludedFoods: ["chicken_thigh", "egg"],
      excludedAllergens: ["egg", "wheat"],
      requiredFoods: [["chicken_breast", "rice_cooked"]],
      cuisines: ["japanese", "western"],
    });
  });
});

describe("validateSession", () => {
  const recipes = new Set(["a", "b", "c"]);
  const session: Session = { shown: ["c", "a", "c"], excluded: [], previous: ["c", "a"], keep: ["c"] };

  it("normalizes the sets and keeps the order of previous and keep", () => {
    expect(validateSession(session, 0, recipes)).toEqual({ ok: true, value: { shown: ["a", "c"], excluded: [], previous: ["c", "a"], keep: ["c"] } });
  });

  it("rejects unknown recipes and invalid seeds", () => {
    const result = validateSession({ ...session, excluded: ["x"], keep: ["y"] }, -1, recipes);
    expect(result.ok ? [] : result.errors).toEqual([
      { code: "unknown_recipe", field: "excluded", recipe: "x" },
      { code: "unknown_recipe", field: "keep", recipe: "y" },
      { code: "invalid_seed", seed: -1 },
    ]);
    for (const seed of [1.5, 2 ** 32]) expect(validateSession(session, seed, recipes).ok).toBe(false);
    expect(validateSession(session, 2 ** 32 - 1, recipes).ok).toBe(true);
  });
});

describe("checkContradictions", () => {
  it("finds none for the presets or without protein and carbohydrate minimums", () => {
    for (const preset of ["cut", "maintain", "bulk"] as const) expect(checkContradictions(presetTargets(preset))).toEqual([]);
    expect(checkContradictions({ kcal: { min: 100, max: 200 } })).toEqual([]);
  });

  it("warns from 80 % of the kcal maximum", () => {
    // 4 × 130 = 520 = 0.8 × 650.
    expect(checkContradictions({ kcal: { min: 450, max: 650 }, proteinMin: 130 })).toEqual([
      { code: "minimum_energy_exceeds_kcal_max", severity: "warning", minimumKcal: 520, minimumKcalWithTolerance: 508, kcalMax: 650 },
    ]);
    expect(checkContradictions({ kcal: { min: 450, max: 650 }, proteinMin: 129.9 })).toEqual([]);
  });

  it("blocks when even the tolerance cannot make room", () => {
    // Exactly 1.1 × 500 = 550 with tolerance is still a warning: 4 × (140 − 3) = 548, plus 4 × 0.9 × 0.5 = 1.8 → 549.8.
    expect(checkContradictions({ kcal: { min: 300, max: 500 }, proteinMin: 140, carbohydrate: { min: 0.5, max: 50 } })[0]?.severity).toBe("warning");
    // 4 × (100 − 3) + 4 × 0.9 × 50 = 388 + 180 = 568 > 550.
    expect(checkContradictions({ kcal: { min: 300, max: 500 }, proteinMin: 100, carbohydrate: { min: 50, max: 80 } })).toEqual([
      { code: "minimum_energy_exceeds_kcal_max", severity: "blocking", minimumKcal: 600, minimumKcalWithTolerance: 568, kcalMax: 500 },
    ]);
  });

  it("does not let the protein tolerance go below zero", () => {
    expect(checkContradictions({ kcal: { min: 100, max: 100 }, proteinMin: 2, carbohydrate: { min: 40, max: 50 } })[0]).toMatchObject({
      minimumKcal: 168,
      minimumKcalWithTolerance: 144,
      severity: "blocking",
    });
  });
});
