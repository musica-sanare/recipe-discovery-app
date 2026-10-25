/**
 * The recipe detail's state and what it shows (docs/en/UI_DESIGN.md §3.4, §8, ADR-030 D8).
 * Values come from `calculateNutrition`; this module chooses states, steps, and notes.
 */
import { substitutedAdjust, type RecipeState } from "../../../domain/nutrition/amounts";
import type { RecipeNutrition } from "../../../domain/nutrition/engine";
import type { PoolEntry } from "../../../domain/recommendation/pool";
import { INPUT_LIMITS } from "../../../domain/recommendation/validate";
import type { BundleRecipe } from "../../../shared/bundle";
import type { Adjust } from "../../../shared/content";

type Ingredient = BundleRecipe["ingredients"][number];

/** The state with default amounts: the forced sides and substitutions of a search apply (ADR-029 D7). */
export function defaultRecipeState(entry: PoolEntry | undefined, servings: number): RecipeState {
  return { servings, sidesOff: entry?.forced.sidesOff ?? [], amounts: {}, substitutions: entry?.forced.substitutions ?? [] };
}

/** The state shown first: the one on the candidate card after a search, otherwise the default. */
export function startingState(entry: PoolEntry | undefined, servings: number): RecipeState {
  return entry?.solution.state ?? defaultRecipeState(entry, servings);
}

export interface AdjustableAmount {
  readonly ingredient: Ingredient;
  readonly adjust: Adjust;
  /** The current value in the state unit (grams or whole units) at the authored servings. */
  readonly value: number;
}

/**
 * Adjustable ingredients with their bounds after a chosen substitution and their current
 * value. The default is the authored amount times the substitution ratio (ADR-028 A),
 * in grams or whole units.
 */
export function adjustableAmounts(recipe: BundleRecipe, state: RecipeState): AdjustableAmount[] {
  return recipe.ingredients.flatMap((ingredient): AdjustableAmount[] => {
    const substitution = recipe.substitutions.find((candidate) => candidate.ingredient === ingredient.key && state.substitutions.includes(candidate.key));
    const adjust = substitution === undefined ? ingredient.adjust : substitutedAdjust(ingredient.adjust, substitution);
    if (adjust === undefined) return [];
    const grams = ingredient.grams * (substitution?.ratio ?? 1);
    const fallback = adjust.kind === "grams" ? grams : Math.round(grams / adjust.unitGrams);
    return [{ ingredient, adjust, value: state.amounts[ingredient.key] ?? fallback }];
  });
}

/** One step on the authored grid (grams) or one whole unit, within the bounds. */
export function steppedAmount(adjust: Adjust, value: number, direction: 1 | -1): number {
  if (adjust.kind === "count") return Math.min(adjust.max, Math.max(adjust.min, Math.round(value) + direction));
  const index = Math.round((value - adjust.min) / adjust.step) + direction;
  const steps = Math.floor((adjust.max - adjust.min) / adjust.step + 1e-9);
  return Number((adjust.min + Math.min(steps, Math.max(0, index)) * adjust.step).toFixed(6));
}

export function steppedServings(servings: number, direction: 1 | -1): number {
  return Math.min(INPUT_LIMITS.servings.max, Math.max(INPUT_LIMITS.servings.min, servings + direction));
}

/** Switching a substitution replaces any other substitution of the same ingredient. */
export function withSubstitution(recipe: BundleRecipe, state: RecipeState, ingredient: string, substitution: string | undefined): RecipeState {
  const others = state.substitutions.filter((key) => recipe.substitutions.find((candidate) => candidate.key === key)?.ingredient !== ingredient);
  const amounts = Object.fromEntries(Object.entries(state.amounts).filter(([key]) => key !== ingredient));
  return { ...state, amounts, substitutions: substitution === undefined ? others : [...others, substitution] };
}

export function withSide(state: RecipeState, side: string, on: boolean): RecipeState {
  return { ...state, sidesOff: on ? state.sidesOff.filter((key) => key !== side) : [...state.sidesOff, side] };
}

export interface ShownStep {
  readonly key: string;
  /** The substitution whose text replaces the step, if any. */
  readonly substitution: string | undefined;
  /** Indexes of the step notes whose amount threshold is reached. */
  readonly notes: readonly number[];
}

/**
 * Steps of the state: side steps are hidden when their side is off; a chosen
 * substitution may replace a step's text; notes appear from `atLeastGrams` upward,
 * compared with the whole recipe's grams after scaling (ADR-026).
 */
export function shownSteps(recipe: BundleRecipe, state: RecipeState, nutrition: RecipeNutrition): { readonly steps: ShownStep[]; readonly hidden: number } {
  const grams = new Map(nutrition.ingredients.map((ingredient) => [ingredient.key, ingredient.grams]));
  const chosen = recipe.substitutions.filter((substitution) => state.substitutions.includes(substitution.key));
  const visible = recipe.steps.filter((step) => step.side === undefined || !state.sidesOff.includes(step.side));
  return {
    hidden: recipe.steps.length - visible.length,
    steps: visible.map((step) => ({
      key: step.key,
      substitution: chosen.find((substitution) => substitution.stepTexts.includes(step.key))?.key,
      notes: step.notes.flatMap((note, index) => ((grams.get(note.ingredient) ?? 0) >= note.atLeastGrams ? [index] : [])),
    })),
  };
}

/** Safety notes of the state: a chosen substitution may replace notes and add its own. */
export function shownSafetyNotes(recipe: BundleRecipe, state: RecipeState): { readonly key: string; readonly substitution: string | undefined }[] {
  const chosen = recipe.substitutions.filter((substitution) => state.substitutions.includes(substitution.key));
  const replaced = (key: string) => chosen.find((substitution) => substitution.safetyNotes.replace.includes(key))?.key;
  return [
    ...recipe.safetyNotes.map((key) => ({ key, substitution: replaced(key) })),
    ...chosen.flatMap((substitution) => substitution.safetyNotes.add.map((key) => ({ key, substitution: substitution.key }))),
  ];
}

/** Recipe time with the minutes of chosen substitutions (as the filters count them). */
export function recipeMinutes(recipe: BundleRecipe, state: RecipeState): number {
  return recipe.minutes + recipe.substitutions.filter((substitution) => state.substitutions.includes(substitution.key)).reduce((sum, substitution) => sum + (substitution.minutesDelta ?? 0), 0);
}

/** The household measure for the shown amount (ADR-026); shared with the shopping list. */
export { scaledMeasure } from "../../../shared/measure";
