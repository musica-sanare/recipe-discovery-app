import { describe, expect, it } from "vitest";
import { defaultState, resolveAmounts } from "../../domain/nutrition/amounts.ts";
import { calculateNutrition } from "../../domain/nutrition/engine.ts";
import { adjustableAmounts, scaledMeasure, shownSafetyNotes, shownSteps, steppedAmount, withSide, withSubstitution } from "../../src/views/detail/model.ts";
import { repositoryEngine } from "../../tools/content/repository.ts";

// The detail view's state helpers against the engine on the repository recipes (Stage 4.5).
const { calc, data } = repositoryEngine();
const recipe = (id: string) => {
  const found = calc.recipes.find((candidate) => candidate.id === id);
  if (found === undefined) throw new Error(id);
  return found;
};

describe("adjustable amounts", () => {
  it("start from the amounts the engine resolves for the default state, in every recipe", () => {
    for (const item of calc.recipes) {
      const resolved = resolveAmounts(item, defaultState(item));
      if (!resolved.ok) throw new Error(item.id);
      for (const { ingredient, adjust, value } of adjustableAmounts(item, defaultState(item))) {
        const grams = resolved.value.ingredients.find((candidate) => candidate.key === ingredient.key)?.grams;
        expect(adjust.kind === "grams" ? value : value * adjust.unitGrams).toBeCloseTo(grams ?? Number.NaN, 9);
      }
    }
  });

  it("step on the authored grid and stay within the bounds", () => {
    const grams = { kind: "grams", min: 120, max: 220, step: 10 } as const;
    expect([steppedAmount(grams, 150, 1), steppedAmount(grams, 220, 1), steppedAmount(grams, 120, -1), steppedAmount(grams, 155, 1)]).toEqual([160, 220, 120, 170]);
    const count = { kind: "count", unitGrams: 50, min: 1, max: 4 } as const;
    expect([steppedAmount(count, 2, 1), steppedAmount(count, 4, 1), steppedAmount(count, 1, -1)]).toEqual([3, 4, 1]);
  });

  it("every stepped state is accepted by the engine", () => {
    for (const item of calc.recipes) {
      for (const { ingredient, adjust, value } of adjustableAmounts(item, defaultState(item))) {
        for (const direction of [1, -1] as const) {
          const state = { ...defaultState(item), amounts: { [ingredient.key]: steppedAmount(adjust, value, direction) } };
          expect(calculateNutrition(item, state, data).ok).toBe(true);
        }
      }
    }
  });
});

describe("steps, notes, and measures", () => {
  it("hides side steps when the side is off", () => {
    const grill = recipe("chicken_lemon_herb_grill");
    const side = grill.sides.find((candidate) => grill.steps.some((step) => step.side === candidate.key))?.key ?? "";
    const on = calculateNutrition(grill, defaultState(grill), data);
    const offState = withSide(defaultState(grill), side, false);
    const off = calculateNutrition(grill, offState, data);
    if (!on.ok || !off.ok) throw new Error("calculation");
    const sideSteps = grill.steps.filter((step) => step.side === side).length;
    expect(sideSteps).toBeGreaterThan(0);
    expect(shownSteps(grill, offState, off.value).hidden).toBe(sideSteps);
    expect(shownSteps(grill, defaultState(grill), on.value).hidden).toBe(0);
  });

  it("uses the substitution's step texts and safety notes", () => {
    const grill = recipe("chicken_lemon_herb_grill");
    const substitution = grill.substitutions[0];
    if (substitution === undefined) throw new Error("no substitution");
    const state = withSubstitution(grill, defaultState(grill), substitution.ingredient, substitution.key);
    const nutrition = calculateNutrition(grill, state, data);
    if (!nutrition.ok) throw new Error("calculation");
    const replaced = shownSteps(grill, state, nutrition.value).steps.filter((step) => step.substitution === substitution.key).map((step) => step.key);
    expect(replaced).toEqual(substitution.stepTexts);
    const notes = shownSafetyNotes(grill, state);
    expect(notes.filter((note) => note.substitution === substitution.key).map((note) => note.key).sort()).toEqual([...substitution.safetyNotes.replace, ...substitution.safetyNotes.add].sort());
    expect(withSubstitution(grill, state, substitution.ingredient, undefined).substitutions).toEqual([]);
  });

  it("scales a household measure with the grams only when it stays on twelfths", () => {
    const grill = recipe("chicken_lemon_herb_grill");
    const oil = grill.ingredients.find((ingredient) => ingredient.key === "oil");
    if (oil?.measure === undefined) throw new Error("oil");
    expect(scaledMeasure(grill, { key: "oil", grams: oil.grams, substitution: undefined })).toEqual(oil.measure);
    expect(scaledMeasure(grill, { key: "oil", grams: oil.grams * 2, substitution: undefined })).toEqual({ unit: oil.measure.unit, quantity: oil.measure.quantity * 2 });
    expect(scaledMeasure(grill, { key: "oil", grams: oil.grams * 1.07, substitution: undefined })).toBeUndefined();
  });
});
