/**
 * Shopping list aggregation (docs/en/SPEC.md §18, ADR-032). Pure, deterministic, and
 * locale-free: recipe states in, food IDs with grams out. Amounts come from
 * `resolveAmounts`, so they match the recipe detail; no nutrition value is computed.
 */
import type { BundleRecipe } from "../../shared/bundle.ts";
import type { Measure } from "../../shared/content.ts";
import { scaledMeasure, twelfthsQuantity } from "../../shared/measure.ts";
import { isFriedIngredient } from "../../shared/recipe.ts";
import { resolveAmounts, type AmountError, type AmountRecipe, type RecipeState, type Result } from "../nutrition/amounts.ts";

export const SHOPPING_LIST_MAX_RECIPES = 10;

type BundleIngredient = BundleRecipe["ingredients"][number];
type Role = BundleIngredient["role"];

/** The recipe fields the aggregation reads; bundle recipes fit. */
export interface ShoppingRecipe extends AmountRecipe {
  readonly id: string;
  readonly ingredients: readonly (AmountRecipe["ingredients"][number] & Pick<BundleIngredient, "role" | "measure">)[];
  readonly substitutions: readonly (AmountRecipe["substitutions"][number] & Pick<BundleRecipe["substitutions"][number], "measure">)[];
}

/** One recipe in the list with the state copied from the recipe detail. */
export interface ShoppingEntry {
  readonly recipe: string;
  readonly state: RecipeState;
}

export type ShoppingSection = "ingredients" | "pantry";

export interface ShoppingContribution {
  readonly recipe: string;
  /** Raw edible grams, or grams as sold for `as_is` foods, at full precision. */
  readonly grams: number;
  readonly measure: Measure | undefined;
}

export interface ShoppingItem {
  /** Stable within a list: the food ID, with `:frying` for frying oil. */
  readonly key: string;
  readonly food: string;
  readonly frying: boolean;
  readonly section: ShoppingSection;
  readonly grams: number;
  /** Shown only when every contribution has a measure of the same unit and the sum is a multiple of 1/12. */
  readonly measure: Measure | undefined;
  /** Per recipe, in the order the recipes were added. */
  readonly contributions: readonly ShoppingContribution[];
}

export interface ShoppingList {
  /** Ordered by section, role, then first appearance. */
  readonly items: readonly ShoppingItem[];
}

export type ShoppingError =
  | { readonly code: "too_many_recipes"; readonly count: number; readonly max: number }
  | { readonly code: "duplicate_recipe"; readonly recipe: string }
  | { readonly code: "unknown_recipe"; readonly recipe: string }
  | { readonly code: "invalid_state"; readonly recipe: string; readonly errors: readonly AmountError[] };

/** Role order within the list; frying oil comes after every role. */
const ROLE_ORDER: readonly Role[] = ["main_protein", "main_carb", "vegetable", "other", "coating", "seasoning", "fat"];
const PANTRY_ROLES: ReadonlySet<Role> = new Set<Role>(["seasoning", "fat"]);
const FRYING_RANK = ROLE_ORDER.length;

interface Accumulator {
  readonly key: string;
  readonly food: string;
  readonly frying: boolean;
  readonly first: number;
  readonly roles: Set<Role>;
  readonly contributions: { recipe: string; grams: number; measures: (Measure | undefined)[] }[];
}

function sumMeasures(measures: readonly (Measure | undefined)[]): Measure | undefined {
  const [first] = measures;
  if (first === undefined) return undefined;
  let quantity = 0;
  for (const measure of measures) {
    if (measure?.unit !== first.unit) return undefined;
    quantity += measure.quantity;
  }
  const exact = twelfthsQuantity(quantity);
  return exact === undefined ? undefined : { unit: first.unit, quantity: exact };
}

function rank(entry: Accumulator): number {
  if (entry.frying) return FRYING_RANK;
  return Math.min(...[...entry.roles].map((role) => ROLE_ORDER.indexOf(role)));
}

/**
 * Builds the list for the recipes in the order they were added. Items are combined by
 * food ID; the cooking state never splits them. Frying oil is its own item.
 */
export function buildShoppingList(entries: readonly ShoppingEntry[], recipes: readonly ShoppingRecipe[]): Result<ShoppingList, ShoppingError> {
  const errors: ShoppingError[] = [];
  if (entries.length > SHOPPING_LIST_MAX_RECIPES) errors.push({ code: "too_many_recipes", count: entries.length, max: SHOPPING_LIST_MAX_RECIPES });
  const recipeById = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  const seen = new Set<string>();
  const items = new Map<string, Accumulator>();
  let appearance = 0;

  for (const entry of entries) {
    if (seen.has(entry.recipe)) {
      errors.push({ code: "duplicate_recipe", recipe: entry.recipe });
      continue;
    }
    seen.add(entry.recipe);
    const recipe = recipeById.get(entry.recipe);
    if (!recipe) {
      errors.push({ code: "unknown_recipe", recipe: entry.recipe });
      continue;
    }
    const resolved = resolveAmounts(recipe, entry.state);
    if (!resolved.ok) {
      errors.push({ code: "invalid_state", recipe: entry.recipe, errors: resolved.errors });
      continue;
    }
    const resolvedByKey = new Map(resolved.value.ingredients.map((ingredient) => [ingredient.key, ingredient]));
    for (const [index, ingredient] of resolved.value.ingredients.entries()) {
      if (ingredient.switchedOff || ingredient.grams <= 0) continue;
      const authored = recipe.ingredients[index];
      if (authored === undefined) continue;
      const host = ingredient.includedIn === undefined ? undefined : resolvedByKey.get(ingredient.includedIn);
      const frying = authored.role === "fat" && host !== undefined && isFriedIngredient(host);
      const key = frying ? `${ingredient.food}:frying` : ingredient.food;
      let item = items.get(key);
      if (!item) {
        item = { key, food: ingredient.food, frying, first: appearance++, roles: new Set(), contributions: [] };
        items.set(key, item);
      }
      item.roles.add(authored.role);
      const measure = scaledMeasure(recipe, ingredient);
      const last = item.contributions.at(-1);
      if (last?.recipe === recipe.id) {
        last.grams += ingredient.grams;
        last.measures.push(measure);
      } else {
        item.contributions.push({ recipe: recipe.id, grams: ingredient.grams, measures: [measure] });
      }
    }
  }
  if (errors.length > 0) return { ok: false, errors };

  const section = (entry: Accumulator): ShoppingSection => ([...entry.roles].every((role) => PANTRY_ROLES.has(role)) ? "pantry" : "ingredients");
  const sorted = [...items.values()].sort((a, b) => {
    const bySection = Number(section(a) === "pantry") - Number(section(b) === "pantry");
    return bySection !== 0 ? bySection : rank(a) - rank(b) || a.first - b.first;
  });
  return {
    ok: true,
    value: {
      items: sorted.map((entry): ShoppingItem => ({
        key: entry.key,
        food: entry.food,
        frying: entry.frying,
        section: section(entry),
        grams: entry.contributions.reduce((sum, contribution) => sum + contribution.grams, 0),
        measure: sumMeasures(entry.contributions.flatMap((contribution) => contribution.measures)),
        contributions: entry.contributions.map((contribution) => ({
          recipe: contribution.recipe,
          grams: contribution.grams,
          measure: sumMeasures(contribution.measures),
        })),
      })),
    },
  };
}

/**
 * Keys of items whose total changed or that disappeared between two lists; their
 * checks are cleared (ADR-032 D5).
 */
export function changedItemKeys(previous: ShoppingList, next: ShoppingList): readonly string[] {
  const nextByKey = new Map(next.items.map((item) => [item.key, item]));
  return previous.items
    .filter((item) => {
      const other = nextByKey.get(item.key);
      return other === undefined || other.grams !== item.grams || other.measure?.unit !== item.measure?.unit || other.measure?.quantity !== item.measure?.quantity;
    })
    .map((item) => item.key);
}
