/**
 * Recipe properties derived from content instead of authored (ADR-026), so they
 * cannot contradict the minutes and ingredient states they depend on.
 */
import type { FoodState, Recipe, RecipeIngredient } from "./content.ts";

/** "Quick" recipes take at most this many minutes (ADR-023). */
export const QUICK_MAX_MINUTES = 20;

/** Fried states: values depend on oil absorption (docs/NUTRITION_CALCULATION.md §6). */
export const FRIED_STATES: ReadonlySet<FoodState> = new Set<FoodState>(["deep_fry", "tempura", "tonkatsu", "karaage"]);

export function isQuick(recipe: Pick<Recipe, "minutes">): boolean {
  return recipe.minutes <= QUICK_MAX_MINUTES;
}

export function isFriedIngredient(ingredient: Pick<RecipeIngredient, "state" | "cooking" | "estimate">): boolean {
  return (
    FRIED_STATES.has(ingredient.state) || (ingredient.cooking !== undefined && FRIED_STATES.has(ingredient.cooking)) || ingredient.estimate === "slow_frying"
  );
}

/** A recipe is fried when a counted ingredient is fried. */
export function isFried(recipe: Pick<Recipe, "ingredients">): boolean {
  return recipe.ingredients.some((ingredient) => ingredient.includedIn === undefined && isFriedIngredient(ingredient));
}
