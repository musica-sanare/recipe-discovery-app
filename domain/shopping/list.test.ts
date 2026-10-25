import { describe, expect, expectTypeOf, it } from "vitest";
import { defaultState, type RecipeState } from "../nutrition/amounts.ts";
import { SHOPPING_LIST_MAX_RECIPES, buildShoppingList, changedItemKeys, type ShoppingEntry, type ShoppingList, type ShoppingRecipe } from "./list.ts";

// Two fixture recipes share foods in different states; `stew` has a removable side with a
// linked topping, a substitution with its own measure, and stir-fry oil included in a
// cooked value; `karaage` has a coating and frying oil included in a fried ingredient.
const stew: ShoppingRecipe = {
  id: "stew",
  servings: 1,
  ingredients: [
    { key: "chicken", food: "chicken_breast", grams: 150, state: "raw", cooking: "simmer", role: "main_protein", adjust: { kind: "grams", min: 100, max: 200, step: 10 } },
    { key: "salt", food: "salt", grams: 1, state: "as_is", role: "seasoning", measure: { unit: "pinch", quantity: 1 }, linkedTo: "chicken" },
    { key: "soy", food: "soy_sauce", grams: 6, state: "as_is", role: "seasoning", measure: { unit: "tsp", quantity: 1 } },
    { key: "onion", food: "onion", grams: 50, state: "stir_fry", role: "vegetable", measure: { unit: "piece", quantity: 0.25 } },
    { key: "oil", food: "vegetable_oil", grams: 4, state: "as_is", role: "fat", measure: { unit: "tsp", quantity: 1 }, includedIn: "onion" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb" },
    { key: "sesame", food: "sesame", grams: 2, state: "as_is", role: "seasoning", linkedTo: "rice" },
    { key: "parsley", food: "parsley", grams: 1, state: "raw", role: "vegetable" },
  ],
  sides: [{ key: "rice", ingredients: ["rice"] }],
  substitutions: [{ key: "tofu", ingredient: "chicken", food: "tofu_firm", state: "raw", cooking: "simmer", ratio: 2, measure: { unit: "block", quantity: 1 } }],
};

const karaage: ShoppingRecipe = {
  id: "karaage",
  servings: 1,
  ingredients: [
    { key: "chicken", food: "chicken_breast", grams: 100, state: "grill", role: "main_protein" },
    { key: "thigh", food: "chicken_thigh", grams: 200, state: "karaage", role: "main_protein" },
    { key: "coating", food: "karaage_flour", grams: 30, state: "as_is", role: "coating", includedIn: "thigh" },
    { key: "frying_oil", food: "vegetable_oil", grams: 500, state: "as_is", role: "fat", includedIn: "thigh" },
    { key: "soy", food: "soy_sauce", grams: 18, state: "as_is", role: "seasoning", measure: { unit: "tbsp", quantity: 1 } },
    { key: "parsley", food: "parsley", grams: 2, state: "raw", role: "seasoning" },
    { key: "onion", food: "onion", grams: 100, state: "raw", role: "vegetable", measure: { unit: "piece", quantity: 0.5 } },
  ],
  sides: [],
  substitutions: [],
};

const tortilla: ShoppingRecipe = {
  id: "tortilla",
  servings: 2,
  ingredients: [
    { key: "potato", food: "potato", grams: 300, state: "raw", estimate: "slow_frying", role: "main_carb" },
    { key: "oil", food: "olive_oil", grams: 200, state: "as_is", role: "fat", includedIn: "potato" },
    { key: "dressing", food: "olive_oil", grams: 5, state: "as_is", role: "fat" },
  ],
  sides: [],
  substitutions: [],
};

const recipes = [stew, karaage, tortilla];
const entry = (recipe: ShoppingRecipe, overrides: Partial<RecipeState> = {}): ShoppingEntry => ({ recipe: recipe.id, state: { ...defaultState(recipe), ...overrides } });

function list(entries: readonly ShoppingEntry[]): ShoppingList {
  const result = buildShoppingList(entries, recipes);
  if (!result.ok) throw new Error(JSON.stringify(result.errors));
  return result.value;
}

const item = (from: ShoppingList, key: string) => {
  const found = from.items.find((candidate) => candidate.key === key);
  if (!found) throw new Error(key);
  return found;
};

describe("amounts and combination", () => {
  it("lists every ingredient of a recipe at its resolved grams, including those counted in another value", () => {
    const { items } = list([entry(stew)]);
    expect(Object.fromEntries(items.map(({ key, grams }) => [key, grams]))).toEqual({
      chicken_breast: 150,
      salt: 1,
      soy_sauce: 6,
      onion: 50,
      vegetable_oil: 4,
      rice_cooked: 150,
      sesame: 2,
      parsley: 1,
    });
  });

  it("combines the same food across recipes and states", () => {
    const combined = list([entry(stew), entry(karaage)]);
    expect(item(combined, "chicken_breast")).toMatchObject({ grams: 250, frying: false });
    expect(item(combined, "chicken_breast").contributions).toEqual([
      { recipe: "stew", grams: 150, measure: undefined },
      { recipe: "karaage", grams: 100, measure: undefined },
    ]);
    expect(item(combined, "onion").grams).toBe(150);
  });

  it("follows servings, adjusted amounts, and linked ingredients", () => {
    const scaled = list([entry(stew, { servings: 2, amounts: { chicken: 200 } })]);
    expect(item(scaled, "chicken_breast").grams).toBe(400);
    expect(item(scaled, "salt")).toMatchObject({ grams: 2 * (200 / 150), measure: { unit: "pinch", quantity: 32 / 12 } });
    expect(item(scaled, "soy_sauce")).toMatchObject({ grams: 12, measure: { unit: "tsp", quantity: 2 } });
  });

  it("leaves out a side that is switched off and the ingredients linked to it", () => {
    const keys = list([entry(stew, { sidesOff: ["rice"] })]).items.map(({ key }) => key);
    expect(keys).not.toContain("rice_cooked");
    expect(keys).not.toContain("sesame");
  });

  it("lists the substitute food with its own measure", () => {
    const substituted = list([entry(stew, { substitutions: ["tofu"] })]);
    expect(substituted.items.map(({ key }) => key)).not.toContain("chicken_breast");
    expect(item(substituted, "tofu_firm")).toMatchObject({ grams: 300, measure: { unit: "block", quantity: 1 } });
  });
});

describe("frying oil", () => {
  it("keeps oil included in a fried ingredient apart from the same oil used otherwise", () => {
    const combined = list([entry(stew), entry(karaage)]);
    expect(item(combined, "vegetable_oil")).toMatchObject({ grams: 4, frying: false });
    expect(item(combined, "vegetable_oil:frying")).toMatchObject({ food: "vegetable_oil", grams: 500, frying: true, section: "pantry" });
    expect(item(combined, "karaage_flour")).toMatchObject({ frying: false, section: "ingredients" });
  });

  it("treats oil included in a slow-fried ingredient as frying oil, scaled with servings", () => {
    const fried = list([entry(tortilla, { servings: 4 })]);
    expect(item(fried, "olive_oil:frying").grams).toBe(400);
    expect(item(fried, "olive_oil").grams).toBe(10);
  });
});

describe("household measures", () => {
  it("adds measures of the same unit and drops the total when units differ or a measure is missing", () => {
    const combined = list([entry(stew), entry(karaage)]);
    expect(item(combined, "onion").measure).toEqual({ unit: "piece", quantity: 0.75 });
    expect(item(combined, "soy_sauce").measure).toBeUndefined();
    expect(item(combined, "soy_sauce").contributions.map(({ measure }) => measure)).toEqual([
      { unit: "tsp", quantity: 1 },
      { unit: "tbsp", quantity: 1 },
    ]);
    expect(item(combined, "parsley").measure).toBeUndefined();
  });

  it("drops a measure that is no longer a multiple of 1/12 after scaling", () => {
    expect(item(list([entry(stew, { amounts: { chicken: 160 } })]), "salt").measure).toBeUndefined();
  });
});

describe("sections and order", () => {
  it("orders by section, role, and first appearance, with frying oil last", () => {
    expect(list([entry(stew), entry(karaage)]).items.map(({ key, section }) => `${section}:${key}`)).toEqual([
      "ingredients:chicken_breast",
      "ingredients:chicken_thigh",
      "ingredients:rice_cooked",
      "ingredients:onion",
      "ingredients:parsley",
      "ingredients:karaage_flour",
      "pantry:salt",
      "pantry:soy_sauce",
      "pantry:sesame",
      "pantry:vegetable_oil",
      "pantry:vegetable_oil:frying",
    ]);
  });

  it("puts a food in the pantry section only when every role in the list is seasoning or fat", () => {
    expect(item(list([entry(karaage)]), "parsley").section).toBe("pantry");
    expect(item(list([entry(karaage), entry(stew)]), "parsley").section).toBe("ingredients");
  });

  it("follows the order in which recipes were added", () => {
    const keys = list([entry(karaage), entry(stew)]).items.map(({ key }) => key);
    expect(keys.slice(0, 2)).toEqual(["chicken_breast", "chicken_thigh"]);
    // karaage lists parsley before onion; both rank as vegetables because stew uses parsley as one.
    expect(keys.indexOf("parsley")).toBeLessThan(keys.indexOf("onion"));
  });
});

describe("errors", () => {
  it("rejects unknown, duplicate, and invalid entries", () => {
    const result = buildShoppingList([entry(stew), entry(stew), { recipe: "nothing", state: defaultState(stew) }, entry(karaage, { servings: 0 })], recipes);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.map((error) => error.code)).toEqual(["duplicate_recipe", "unknown_recipe", "invalid_state"]);
    expect(result.errors[2]).toEqual({ code: "invalid_state", recipe: "karaage", errors: [{ code: "invalid_servings", servings: 0 }] });
  });

  it(`accepts at most ${String(SHOPPING_LIST_MAX_RECIPES)} recipes`, () => {
    const many = Array.from({ length: SHOPPING_LIST_MAX_RECIPES + 1 }, (_, index): ShoppingRecipe => ({ ...karaage, id: `recipe_${String(index)}` }));
    const entries = many.map((recipe) => entry(recipe));
    expect(buildShoppingList(entries.slice(0, SHOPPING_LIST_MAX_RECIPES), many).ok).toBe(true);
    const result = buildShoppingList(entries, many);
    expect(result.ok ? [] : result.errors).toEqual([{ code: "too_many_recipes", count: SHOPPING_LIST_MAX_RECIPES + 1, max: SHOPPING_LIST_MAX_RECIPES }]);
  });

  it("returns an empty list for no entries", () => {
    expect(list([])).toEqual({ items: [] });
  });
});

describe("determinism and locale independence", () => {
  it("returns the same list for the same input", () => {
    const entries = [entry(stew, { servings: 3, substitutions: ["tofu"] }), entry(karaage), entry(tortilla)];
    expect(list(entries)).toEqual(list(entries));
    expect(JSON.stringify(list(entries))).toBe(JSON.stringify(list(structuredClone(entries))));
  });

  it("takes no locale", () => {
    expectTypeOf(buildShoppingList).parameters.toEqualTypeOf<[readonly ShoppingEntry[], readonly ShoppingRecipe[]]>();
  });
});

describe("changedItemKeys", () => {
  it("names items whose total changed or that disappeared", () => {
    const before = list([entry(stew), entry(karaage)]);
    const after = list([entry(stew, { servings: 2 })]);
    // Doubling stew changes each of its items; the karaage items disappear.
    expect(changedItemKeys(before, after)).toEqual(before.items.map(({ key }) => key));
    expect(changedItemKeys(before, before)).toEqual([]);
  });

  it("keeps items whose total did not change", () => {
    const before = list([entry(stew)]);
    const after = list([entry(stew), entry(tortilla)]);
    expect(changedItemKeys(before, after)).toEqual([]);
  });
});
