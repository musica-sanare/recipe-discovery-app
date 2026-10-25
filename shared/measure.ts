/**
 * Household measures for scaled amounts (ADR-026). A measure is a display aid authored
 * for the default grams; it is shown for other amounts only while it stays a multiple
 * of 1/12, otherwise grams alone. Used by the recipe detail and the shopping list.
 */
import type { Measure } from "./content.ts";

const TOLERANCE = 1e-6;

/** The quantity as a positive multiple of 1/12, or undefined when it is not one. */
export function twelfthsQuantity(quantity: number): number | undefined {
  const twelfths = quantity * 12;
  const whole = Math.round(twelfths);
  return Math.abs(twelfths - whole) < TOLERANCE && whole > 0 ? whole / 12 : undefined;
}

interface MeasuredRecipe {
  readonly ingredients: readonly { readonly key: string; readonly grams: number; readonly measure?: Measure | undefined }[];
  readonly substitutions: readonly { readonly key: string; readonly ratio: number; readonly measure?: Measure | undefined }[];
}

/**
 * The household measure for an ingredient's shown amount: the authored measure (or the
 * chosen substitution's) scaled with the grams.
 */
export function scaledMeasure(recipe: MeasuredRecipe, ingredient: { readonly key: string; readonly grams: number; readonly substitution: string | undefined }): Measure | undefined {
  const authored = recipe.ingredients.find((candidate) => candidate.key === ingredient.key);
  const substitution = recipe.substitutions.find((candidate) => candidate.key === ingredient.substitution);
  const measure = substitution?.measure ?? authored?.measure;
  if (authored === undefined || measure === undefined) return undefined;
  const authoredGrams = authored.grams * (substitution?.ratio ?? 1);
  const quantity = twelfthsQuantity((measure.quantity * ingredient.grams) / authoredGrams);
  return quantity === undefined ? undefined : { unit: measure.unit, quantity };
}
