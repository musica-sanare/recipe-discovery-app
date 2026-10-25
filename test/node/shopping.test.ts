import { describe, expect, it } from "vitest";
import { defaultState, resolveAmounts, type RecipeState } from "../../domain/nutrition/amounts.ts";
import { buildShoppingList, type ShoppingEntry, type ShoppingList } from "../../domain/shopping/list.ts";
import { repositoryEngine } from "../../tools/content/repository.ts";

// The shopping list aggregation on the repository recipes (Stage 8.2, ADR-032).
const { calc } = repositoryEngine();
const recipe = (id: string) => {
  const found = calc.recipes.find((candidate) => candidate.id === id);
  if (found === undefined) throw new Error(id);
  return found;
};
const entry = (id: string, overrides: Partial<RecipeState> = {}): ShoppingEntry => ({ recipe: id, state: { ...defaultState(recipe(id)), ...overrides } });

function list(entries: readonly ShoppingEntry[]): ShoppingList {
  const result = buildShoppingList(entries, calc.recipes);
  if (!result.ok) throw new Error(JSON.stringify(result.errors));
  return result.value;
}

const round = (grams: number): number => Number(grams.toFixed(6));
const measure = (value: { readonly unit: string; readonly quantity: number } | undefined): string => (value === undefined ? "" : ` (${String(round(value.quantity))} ${value.unit})`);

/** One line per item: section, key, grams, measure, and the recipes it comes from. */
const lines = (from: ShoppingList): string[] =>
  from.items.map(
    (item) =>
      `${item.section} ${item.key} ${String(round(item.grams))} g${measure(item.measure)} <- ${item.contributions.map((contribution) => `${contribution.recipe} ${String(round(contribution.grams))}`).join(", ")}`,
  );

describe("repository recipes", () => {
  it("use every food on one amount basis, so combining by food ID never mixes bases", () => {
    for (const food of calc.foods) {
      const states = Object.keys(food.composition);
      if (states.includes("as_is")) expect(states, food.id).toEqual(["as_is"]);
    }
  });

  it("each give a list at the default state with every resolved gram", () => {
    for (const item of calc.recipes) {
      const resolved = resolveAmounts(item, defaultState(item));
      if (!resolved.ok) throw new Error(item.id);
      const expected = resolved.value.ingredients.filter((ingredient) => !ingredient.switchedOff).reduce((sum, ingredient) => sum + ingredient.grams, 0);
      const total = list([entry(item.id)]).items.reduce((sum, shopping) => sum + shopping.grams, 0);
      expect(total, item.id).toBeCloseTo(expected, 9);
    }
  });
});

describe("snapshot of representative selections", () => {
  it("matches the reviewed lists", () => {
    const selections = {
      single: [entry("chicken_lemon_herb_grill")],
      changed: [
        entry("chicken_lemon_herb_grill", { servings: 2, substitutions: ["pork_fillet"], sidesOff: ["broccoli"], amounts: { rice: 150 } }),
        entry("natto_tofu_rice_bowl", { amounts: { natto: 2 } }),
        entry("atsuage_ginger_saute", { sidesOff: ["rice"] }),
      ],
      fried: ["chicken_thigh_karaage", "pork_fillet_tonkatsu", "salmon_tempura", "tortilla_espanola"].map((id) => entry(id)),
      maximum: [
        "beef_pho_rice_noodles",
        "chicken_coconut_curry",
        "tuna_chickpea_salad",
        "egg_white_beans_ranchero",
        "sundubu_tofu_soup",
        "salmon_miso_grill",
        "pork_larb",
        "beef_steak_potatoes",
        "soft_egg_oatmeal_bowl",
        "shrimp_garlic_broccoli",
      ].map((id) => entry(id)),
    };
    expect(Object.fromEntries(Object.entries(selections).map(([name, entries]) => [name, lines(list(entries))]))).toMatchSnapshot();
  });
});
