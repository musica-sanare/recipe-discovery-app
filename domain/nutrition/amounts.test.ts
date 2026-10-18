import { describe, expect, it } from "vitest";
import { recipes } from "../../content/recipes/index.ts";
import { defaultState, resolveAmounts, type AmountRecipe, type RecipeState, type ResolvedRecipe } from "./amounts.ts";

// Fixture for every rule: an adjustable leader with a linked seasoning, a counted
// ingredient, a removable side with a linked topping outside the side, a vegetable
// side, an ingredient included in another one's cooked value, and substitutions.
const recipe: AmountRecipe = {
  servings: 2,
  ingredients: [
    { key: "chicken", food: "chicken_breast", grams: 200, state: "raw", cooking: "boil", adjust: { kind: "grams", min: 160, max: 280, step: 20 } },
    { key: "salt", food: "salt", grams: 2, state: "as_is", linkedTo: "chicken" },
    { key: "egg", food: "egg", grams: 100, state: "boil", adjust: { kind: "count", unitGrams: 50, min: 1, max: 3 } },
    { key: "rice", food: "rice_cooked", grams: 300, state: "as_is", adjust: { kind: "grams", min: 200, max: 400, step: 50 } },
    { key: "furikake", food: "sesame", grams: 4, state: "as_is", linkedTo: "rice" },
    { key: "broccoli", food: "broccoli", grams: 80, state: "boil" },
    { key: "oil", food: "vegetable_oil", grams: 6, state: "as_is", includedIn: "chicken" },
  ],
  sides: [
    { key: "rice", ingredients: ["rice"] },
    { key: "vegetables", ingredients: ["broccoli"] },
  ],
  substitutions: [
    { key: "tofu", ingredient: "chicken", food: "tofu_firm", state: "raw", ratio: 1.5 },
    { key: "pork", ingredient: "chicken", food: "pork_leg", state: "grill", ratio: 1 },
    { key: "egg_white", ingredient: "egg", food: "egg_white", state: "boil", ratio: 1, adjust: { kind: "count", unitGrams: 35, min: 1, max: 4 } },
  ],
};

const state = (overrides: Partial<RecipeState> = {}): RecipeState => ({ ...defaultState(recipe), ...overrides });

function resolved(input: RecipeState, from: AmountRecipe = recipe): ResolvedRecipe {
  const result = resolveAmounts(from, input);
  if (!result.ok) throw new Error(JSON.stringify(result.errors));
  return result.value;
}

const grams = (input: RecipeState): Record<string, number> =>
  Object.fromEntries(resolved(input).ingredients.map((ingredient) => [ingredient.key, ingredient.grams]));

const errors = (input: RecipeState) => {
  const result = resolveAmounts(recipe, input);
  return result.ok ? [] : result.errors;
};

describe("default state", () => {
  it("keeps the authored grams, foods, and states", () => {
    const { servings, ingredients } = resolved(state());
    expect(servings).toBe(2);
    expect(grams(state())).toEqual({ chicken: 200, salt: 2, egg: 100, rice: 300, furikake: 4, broccoli: 80, oil: 6 });
    expect(ingredients[0]).toEqual({
      key: "chicken",
      food: "chicken_breast",
      state: "raw",
      cooking: "boil",
      estimate: undefined,
      includedIn: undefined,
      substitution: undefined,
      grams: 200,
      units: undefined,
      switchedOff: false,
    });
    expect(ingredients.find((ingredient) => ingredient.key === "egg")?.units).toBe(2);
    expect(ingredients.find((ingredient) => ingredient.key === "oil")?.includedIn).toBe("chicken");
  });

  it("resolves every repository recipe to its authored grams", () => {
    for (const content of recipes) {
      const { ingredients } = resolved(defaultState(content), content);
      expect(ingredients.map((ingredient) => ingredient.grams), content.id).toEqual(content.ingredients.map((ingredient) => ingredient.grams));
    }
  });
});

describe("chosen amounts and links", () => {
  it("scales linked ingredients with their leader (default × leader amount / leader default)", () => {
    expect(grams(state({ amounts: { chicken: 240 } }))).toMatchObject({ chicken: 240, salt: 2.4 });
    expect(grams(state({ amounts: { rice: 200 } }))).toMatchObject({ rice: 200, furikake: (4 * 200) / 300 });
  });

  it("converts a count to whole units of grams", () => {
    const { ingredients } = resolved(state({ amounts: { egg: 3 } }));
    expect(ingredients.find((ingredient) => ingredient.key === "egg")).toMatchObject({ grams: 150, units: 3 });
  });

  it("accepts both ends of the bounds", () => {
    expect(grams(state({ amounts: { chicken: 160, rice: 400, egg: 1 } }))).toMatchObject({ chicken: 160, rice: 400, egg: 50 });
    expect(grams(state({ amounts: { chicken: 280, rice: 200, egg: 3 } }))).toMatchObject({ chicken: 280, rice: 200, egg: 150 });
  });
});

describe("sides", () => {
  it("sets a side switched off and the ingredients linked to it to 0 g", () => {
    const { ingredients } = resolved(state({ sidesOff: ["rice"] }));
    const byKey = new Map(ingredients.map((ingredient) => [ingredient.key, ingredient]));
    expect(byKey.get("rice")).toMatchObject({ grams: 0, switchedOff: true });
    // The topping is not part of the side, but its leader is.
    expect(byKey.get("furikake")).toMatchObject({ grams: 0, switchedOff: true });
    expect(byKey.get("broccoli")).toMatchObject({ grams: 80, switchedOff: false });
  });

  it("keeps a switched-off side at 0 g even when an amount is chosen for it", () => {
    expect(grams(state({ sidesOff: ["rice"], amounts: { rice: 400 } }))).toMatchObject({ rice: 0, furikake: 0 });
  });

  it("switches off a vegetable side without touching the rest", () => {
    expect(grams(state({ sidesOff: ["vegetables"] }))).toEqual({ chicken: 200, salt: 2, egg: 100, rice: 300, furikake: 4, broccoli: 0, oil: 6 });
  });
});

describe("servings", () => {
  it("multiplies every amount by requested / authored servings after the choices", () => {
    expect(grams(state({ servings: 4, amounts: { chicken: 240 } }))).toEqual({ chicken: 480, salt: 4.8, egg: 200, rice: 600, furikake: 8, broccoli: 160, oil: 12 });
    expect(grams(state({ servings: 1 }))).toEqual({ chicken: 100, salt: 1, egg: 50, rice: 150, furikake: 2, broccoli: 40, oil: 3 });
  });

  it("keeps the same amounts per serving for every number of servings (ADR-028 F)", () => {
    const perServing = (servings: number) =>
      resolved(state({ servings, amounts: { chicken: 260, egg: 3 }, sidesOff: ["vegetables"] })).ingredients.map((ingredient) => ingredient.grams / servings);
    for (const servings of [1, 3, 5]) {
      perServing(servings).forEach((value, index) => {
        expect(value).toBeCloseTo(perServing(2)[index] ?? Number.NaN, 12);
      });
    }
  });

  it("reports fractional units after scaling", () => {
    const egg = resolved(state({ servings: 1, amounts: { egg: 3 } })).ingredients.find((ingredient) => ingredient.key === "egg");
    expect(egg).toMatchObject({ grams: 75, units: 1.5 });
  });
});

describe("substitutions", () => {
  it("replaces food, state, and cooking and scales the default by the ratio", () => {
    const chicken = resolved(state({ substitutions: ["tofu"] })).ingredients[0];
    expect(chicken).toMatchObject({ key: "chicken", food: "tofu_firm", state: "raw", cooking: undefined, substitution: "tofu", grams: 300 });
  });

  it("keeps linked ingredients in proportion to the substituted default", () => {
    expect(grams(state({ substitutions: ["tofu"] }))).toMatchObject({ chicken: 300, salt: 2 });
    expect(grams(state({ substitutions: ["tofu"], amounts: { chicken: 330 } }))).toMatchObject({ chicken: 330, salt: 2.2 });
  });

  it("scales grams bounds by the ratio unless the substitution has its own", () => {
    // 160–280 g in steps of 20 becomes 240–420 g in steps of 30.
    expect(grams(state({ substitutions: ["tofu"], amounts: { chicken: 420 } }))).toMatchObject({ chicken: 420 });
    expect(errors(state({ substitutions: ["tofu"], amounts: { chicken: 280 } }))).toEqual([{ code: "off_grid", ingredient: "chicken", value: 280, min: 240, step: 30 }]);
    expect(errors(state({ substitutions: ["tofu"], amounts: { chicken: 450 } }))).toEqual([{ code: "out_of_bounds", ingredient: "chicken", value: 450, min: 240, max: 420 }]);
    const egg = resolved(state({ substitutions: ["egg_white"], amounts: { egg: 4 } })).ingredients.find((ingredient) => ingredient.key === "egg");
    expect(egg).toMatchObject({ food: "egg_white", grams: 140, units: 4 });
  });
});

describe("invalid states", () => {
  it("rejects servings that are not positive integers", () => {
    expect(errors(state({ servings: 0 }))).toEqual([{ code: "invalid_servings", servings: 0 }]);
    expect(errors(state({ servings: 1.5 }))).toEqual([{ code: "invalid_servings", servings: 1.5 }]);
  });

  it("rejects unknown sides, substitutions, and ingredients", () => {
    expect(errors(state({ sidesOff: ["soup"] }))).toEqual([{ code: "unknown_side", side: "soup" }]);
    expect(errors(state({ substitutions: ["beef"] }))).toEqual([{ code: "unknown_substitution", substitution: "beef" }]);
    expect(errors(state({ amounts: { bread: 50 } }))).toEqual([{ code: "unknown_ingredient", ingredient: "bread" }]);
  });

  it("rejects two substitutions for the same ingredient", () => {
    expect(errors(state({ substitutions: ["tofu", "pork"] }))).toEqual([{ code: "conflicting_substitutions", ingredient: "chicken", substitutions: ["pork", "tofu"] }]);
  });

  it("rejects amounts for ingredients that are not adjustable", () => {
    expect(errors(state({ amounts: { salt: 3 } }))).toEqual([{ code: "not_adjustable", ingredient: "salt" }]);
  });

  it("rejects amounts outside the bounds, off the grid, or not whole units", () => {
    expect(errors(state({ amounts: { chicken: 300 } }))).toEqual([{ code: "out_of_bounds", ingredient: "chicken", value: 300, min: 160, max: 280 }]);
    expect(errors(state({ amounts: { chicken: 150 } }))).toEqual([{ code: "out_of_bounds", ingredient: "chicken", value: 150, min: 160, max: 280 }]);
    expect(errors(state({ amounts: { chicken: 170 } }))).toEqual([{ code: "off_grid", ingredient: "chicken", value: 170, min: 160, step: 20 }]);
    expect(errors(state({ amounts: { egg: 2.5 } }))).toEqual([{ code: "not_whole_units", ingredient: "egg", value: 2.5 }]);
    expect(errors(state({ amounts: { egg: 4 } }))).toEqual([{ code: "out_of_bounds", ingredient: "egg", value: 4, min: 1, max: 3 }]);
    expect(errors(state({ amounts: { rice: Number.NaN } }))).toEqual([{ code: "invalid_number", ingredient: "rice", value: Number.NaN }]);
  });

  it("reports every error at once in a stable order", () => {
    const input = state({ servings: 0, sidesOff: ["soup"], substitutions: ["beef"], amounts: { salt: 1, chicken: 170 } });
    expect(errors(input).map((error) => error.code)).toEqual(["invalid_servings", "unknown_side", "unknown_substitution", "off_grid", "not_adjustable"]);
  });
});

describe("determinism", () => {
  it("gives the same result for the same input and for reordered lists and keys", () => {
    const a = state({ servings: 3, sidesOff: ["rice", "vegetables"], substitutions: ["tofu", "egg_white"], amounts: { chicken: 360, egg: 2 } });
    const b = state({ servings: 3, sidesOff: ["vegetables", "rice"], substitutions: ["egg_white", "tofu"], amounts: { egg: 2, chicken: 360 } });
    expect(resolveAmounts(recipe, a)).toEqual(resolveAmounts(recipe, a));
    expect(resolveAmounts(recipe, b)).toEqual(resolveAmounts(recipe, a));
  });
});
