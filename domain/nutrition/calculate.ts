/**
 * Minimal nutrition calculation for Phase 0 (docs/NUTRITION_CALCULATION.md §3–§7).
 * Pure and locale-free: inputs are content and composition data, never a locale.
 */
import { NUTRIENT_IDS, type CompositionFood, type Notation, type NutrientId } from "../../shared/composition.ts";
import type { Food, FoodState, Recipe, RecipeIngredient } from "../../shared/content.ts";
import type { CookingMethod } from "../../shared/cooking.ts";
import { FRIED_STATES } from "../../shared/recipe.ts";

export interface WeightChangeRate {
  readonly ratePercent: number;
  readonly postCookingRefuse?: string | undefined;
}

export interface NutritionData {
  readonly foods: ReadonlyMap<string, Food>;
  /** Composition by food code. */
  readonly composition: ReadonlyMap<string, CompositionFood>;
  /** Weight change rate by cooked food code. */
  readonly rates: ReadonlyMap<string, WeightChangeRate>;
}

export type MappingClass = "exact" | "approximation";

export type ApproximationReason = "cooking_not_tabulated" | "post_cooking_refuse";

/** Amount of one nutrient; `null` when any counted source value is unmeasured. */
export type Amount = number | null;

export interface IngredientResult {
  readonly key: string;
  /** False for ingredients already contained in another ingredient's cooked value (`includedIn`). */
  readonly counted: boolean;
  readonly code: string;
  readonly state: FoodState;
  /** Mass whose composition is applied: raw edible grams × weight change rate for cooked states. */
  readonly effectiveGrams: number;
  readonly mapping: MappingClass;
  readonly reasons: readonly ApproximationReason[];
  readonly cooking: CookingMethod | undefined;
  readonly fried: boolean;
  /** Notations other than plain measured values, per nutrient (for the basis display). */
  readonly notations: Readonly<Partial<Record<NutrientId, Notation>>>;
  readonly amounts: Readonly<Record<NutrientId, Amount>>;
}

export interface RecipeResult {
  readonly recipeId: string;
  readonly servings: number;
  readonly ingredients: readonly IngredientResult[];
  readonly total: Readonly<Record<NutrientId, Amount>>;
  readonly perServing: Readonly<Record<NutrientId, Amount>>;
}

function lookup<T>(map: ReadonlyMap<string, T>, key: string, what: string): T {
  const value = map.get(key);
  if (value === undefined) {
    throw new Error(`Unknown ${what}: ${key}`);
  }
  return value;
}

/** (c5) Mass to buy, including refuse, for a raw edible mass. */
export function purchaseGrams(edibleGrams: number, refusePercent: number): number {
  if (refusePercent < 0 || refusePercent >= 100) {
    throw new RangeError(`Invalid refuse rate: ${String(refusePercent)}`);
  }
  return (edibleGrams * 100) / (100 - refusePercent);
}

/**
 * Mass to which per-100 g values apply. Raw and as-sold states use the stated grams;
 * cooked states use (c4): raw edible grams × weight change rate.
 */
export function effectiveGrams(grams: number, state: FoodState, rate: WeightChangeRate | undefined): number {
  if (state === "raw" || state === "as_is") {
    return grams;
  }
  if (!rate) {
    throw new Error(`Missing weight change rate for state ${state}`);
  }
  return (grams * rate.ratePercent) / 100;
}

export function calculateIngredient(ingredient: RecipeIngredient, data: NutritionData): IngredientResult {
  const food = lookup(data.foods, ingredient.food, "food");
  const code = food.composition[ingredient.state];
  if (code === undefined) {
    throw new Error(`Food ${food.id} has no state ${ingredient.state}`);
  }
  const composition = lookup(data.composition, code, "food code");
  const rate = data.rates.get(code);
  const grams = effectiveGrams(ingredient.grams, ingredient.state, rate);

  const reasons: ApproximationReason[] = [];
  if (ingredient.cooking !== undefined) {
    reasons.push("cooking_not_tabulated");
  }
  if (rate?.postCookingRefuse !== undefined) {
    reasons.push("post_cooking_refuse");
  }

  const notations: Partial<Record<NutrientId, Notation>> = {};
  const amounts = {} as Record<NutrientId, Amount>;
  for (const id of NUTRIENT_IDS) {
    const source = composition.nutrients[id];
    if (source.notation !== "measured") {
      notations[id] = source.notation;
    }
    amounts[id] = source.value === null ? null : (source.value * grams) / 100;
  }

  return {
    key: ingredient.key,
    counted: ingredient.includedIn === undefined,
    code,
    state: ingredient.state,
    effectiveGrams: grams,
    mapping: reasons.length > 0 ? "approximation" : "exact",
    reasons,
    cooking: ingredient.cooking,
    fried: FRIED_STATES.has(ingredient.state) || (ingredient.cooking !== undefined && FRIED_STATES.has(ingredient.cooking)),
    notations,
    amounts,
  };
}

function sum(results: readonly IngredientResult[]): Record<NutrientId, Amount> {
  const total = {} as Record<NutrientId, Amount>;
  for (const id of NUTRIENT_IDS) {
    let value: Amount = 0;
    for (const result of results) {
      const amount = result.amounts[id];
      value = value === null || amount === null ? null : value + amount;
    }
    total[id] = value;
  }
  return total;
}

/** Calculates a recipe at its stated amounts. Full precision; rounding is a display concern. */
export function calculateRecipe(recipe: Recipe, data: NutritionData): RecipeResult {
  const ingredients = recipe.ingredients.map((ingredient) => calculateIngredient(ingredient, data));
  const total = sum(ingredients.filter((result) => result.counted));
  const perServing = {} as Record<NutrientId, Amount>;
  for (const id of NUTRIENT_IDS) {
    const value = total[id];
    perServing[id] = value === null ? null : value / recipe.servings;
  }
  return { recipeId: recipe.id, servings: recipe.servings, ingredients, total, perServing };
}
