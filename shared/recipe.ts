/**
 * Recipe properties derived from content instead of authored (ADR-026), so they
 * cannot contradict the minutes and ingredient states they depend on.
 */
import type { FoodState, ProteinGroup, Recipe, RecipeIngredient } from "./content.ts";

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

/** Cooking-method families for diversification (ADR-029 D5). */
export const METHOD_FAMILIES = ["grill", "simmer", "steam", "stir_fry", "pan", "fry", "no_cook"] as const;
export type MethodFamily = (typeof METHOD_FAMILIES)[number];

function familyOfState(state: FoodState): MethodFamily {
  switch (state) {
    case "grill":
      return "grill";
    case "boil":
    case "simmer":
    case "poach":
    case "rice_cook":
      return "simmer";
    case "steam":
    case "microwave":
      return "steam";
    case "stir_fry":
      return "stir_fry";
    case "saute":
    case "scramble":
    case "fry_egg":
      return "pan";
    case "deep_fry":
    case "tempura":
    case "tonkatsu":
    case "karaage":
      return "fry";
    case "raw":
    case "as_is":
      return "no_cook";
  }
}

/**
 * Derived cooking-method family: fried recipes are `fry`, `no_cook` recipes are
 * `no_cook`, otherwise the method of the first main protein ingredient whose food
 * belongs to the recipe's main protein group (`cooking`, or the state).
 */
export function methodFamily(
  recipe: Pick<Recipe, "ingredients" | "tags" | "mainProteinGroup">,
  proteinGroupOf: (food: string) => ProteinGroup | undefined,
): MethodFamily {
  if (isFried(recipe)) return "fry";
  if (recipe.tags.includes("no_cook")) return "no_cook";
  const main = recipe.ingredients.find((ingredient) => ingredient.role === "main_protein" && proteinGroupOf(ingredient.food) === recipe.mainProteinGroup);
  if (!main) throw new Error(`No main protein of group ${recipe.mainProteinGroup}`);
  return familyOfState(main.cooking ?? main.state);
}
