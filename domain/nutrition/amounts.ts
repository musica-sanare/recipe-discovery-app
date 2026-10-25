/**
 * Amount resolution for a recipe state (docs/en/NUTRITION_CALCULATION.md §10, ADR-024,
 * ADR-026, ADR-028). Pure and locale-free: the same recipe and state always give the
 * same grams per ingredient.
 */
import type { BundleRecipe } from "../../shared/bundle.ts";
import type { Adjust } from "../../shared/content.ts";

type BundleIngredient = BundleRecipe["ingredients"][number];
type BundleSubstitution = BundleRecipe["substitutions"][number];

/** The recipe fields amount resolution reads; both content recipes and bundle recipes fit. */
export interface AmountRecipe {
  readonly servings: number;
  readonly ingredients: readonly Pick<BundleIngredient, "key" | "food" | "grams" | "state" | "cooking" | "adjust" | "linkedTo" | "estimate" | "includedIn">[];
  readonly sides: readonly Pick<BundleRecipe["sides"][number], "key" | "ingredients">[];
  readonly substitutions: readonly Pick<BundleSubstitution, "key" | "ingredient" | "food" | "state" | "cooking" | "ratio" | "adjust">[];
}

/**
 * What the user chose. `amounts` and the bounds refer to the authored servings
 * (ADR-028 decision F): grams for `grams` adjustment, a whole count for `count`
 * adjustment. Ingredients not listed keep their default.
 */
export interface RecipeState {
  readonly servings: number;
  readonly sidesOff: readonly string[];
  readonly amounts: Readonly<Record<string, number>>;
  readonly substitutions: readonly string[];
}

export type AmountError =
  | { readonly code: "invalid_servings"; readonly servings: number }
  | { readonly code: "unknown_side"; readonly side: string }
  | { readonly code: "unknown_substitution"; readonly substitution: string }
  | { readonly code: "conflicting_substitutions"; readonly ingredient: string; readonly substitutions: readonly string[] }
  | { readonly code: "unknown_ingredient"; readonly ingredient: string }
  | { readonly code: "not_adjustable"; readonly ingredient: string }
  | { readonly code: "invalid_number"; readonly ingredient: string; readonly value: number }
  | { readonly code: "out_of_bounds"; readonly ingredient: string; readonly value: number; readonly min: number; readonly max: number }
  | { readonly code: "off_grid"; readonly ingredient: string; readonly value: number; readonly min: number; readonly step: number }
  | { readonly code: "not_whole_units"; readonly ingredient: string; readonly value: number };

export type Result<T, E> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly errors: readonly E[] };

export interface ResolvedIngredient {
  readonly key: string;
  /** Food, state, and cooking after a chosen substitution. */
  readonly food: string;
  readonly state: BundleIngredient["state"];
  readonly cooking: BundleIngredient["cooking"];
  readonly estimate: BundleIngredient["estimate"];
  readonly includedIn: string | undefined;
  readonly substitution: string | undefined;
  /** Grams for the requested servings (raw edible grams, or grams as sold for `as_is`). */
  readonly grams: number;
  /** Whole units for `count` adjustment, for the requested servings; may be fractional after scaling. */
  readonly units: number | undefined;
  /** True when the ingredient's side, or its leader's side, is switched off. */
  readonly switchedOff: boolean;
}

export interface ResolvedRecipe {
  readonly servings: number;
  readonly ingredients: readonly ResolvedIngredient[];
}

/** An ingredient after a chosen substitution, before amounts are applied. */
interface Effective {
  readonly ingredient: AmountRecipe["ingredients"][number];
  readonly substitution: string | undefined;
  readonly food: string;
  readonly state: BundleIngredient["state"];
  readonly cooking: BundleIngredient["cooking"];
  /** Default grams at the authored servings. */
  readonly defaultGrams: number;
  readonly adjust: Adjust | undefined;
}

const EPSILON = 1e-9;

/** The authored default state of a recipe. */
export function defaultState(recipe: Pick<AmountRecipe, "servings">): RecipeState {
  return { servings: recipe.servings, sidesOff: [], amounts: {}, substitutions: [] };
}

/** Bounds of a substituted ingredient: its own, or the original grams bounds scaled by the ratio. */
export function substitutedAdjust(adjust: Adjust | undefined, substitution: Pick<BundleSubstitution, "ratio" | "adjust">): Adjust | undefined {
  if (substitution.adjust) return substitution.adjust;
  if (adjust?.kind !== "grams") return undefined;
  const { ratio } = substitution;
  return { kind: "grams", min: adjust.min * ratio, max: adjust.max * ratio, step: adjust.step * ratio };
}

function amountError(key: string, value: number, adjust: Adjust): AmountError | undefined {
  if (!Number.isFinite(value)) return { code: "invalid_number", ingredient: key, value };
  if (adjust.kind === "count") {
    if (!Number.isInteger(value)) return { code: "not_whole_units", ingredient: key, value };
    if (value < adjust.min || value > adjust.max) return { code: "out_of_bounds", ingredient: key, value, min: adjust.min, max: adjust.max };
    return undefined;
  }
  if (value < adjust.min - EPSILON || value > adjust.max + EPSILON) return { code: "out_of_bounds", ingredient: key, value, min: adjust.min, max: adjust.max };
  const steps = (value - adjust.min) / adjust.step;
  if (Math.abs(steps - Math.round(steps)) > EPSILON) return { code: "off_grid", ingredient: key, value, min: adjust.min, step: adjust.step };
  return undefined;
}

/**
 * Grams per ingredient for a recipe state: substitutions, chosen amounts, links
 * (default × leader amount / leader default), sides switched off (0 g, including
 * linked ingredients), then servings scaling. Invalid states return every error found.
 */
export function resolveAmounts(recipe: AmountRecipe, state: RecipeState): Result<ResolvedRecipe, AmountError> {
  const errors: AmountError[] = [];
  if (!Number.isInteger(state.servings) || state.servings < 1) errors.push({ code: "invalid_servings", servings: state.servings });

  const sideKeys = new Set(recipe.sides.map((side) => side.key));
  for (const side of [...new Set(state.sidesOff)].sort()) if (!sideKeys.has(side)) errors.push({ code: "unknown_side", side });
  const off = new Set(recipe.sides.filter((side) => state.sidesOff.includes(side.key)).flatMap((side) => side.ingredients));

  const substitutionByKey = new Map(recipe.substitutions.map((substitution) => [substitution.key, substitution]));
  const chosenByIngredient = new Map<string, string[]>();
  for (const key of [...new Set(state.substitutions)].sort()) {
    const substitution = substitutionByKey.get(key);
    if (!substitution) {
      errors.push({ code: "unknown_substitution", substitution: key });
      continue;
    }
    chosenByIngredient.set(substitution.ingredient, [...(chosenByIngredient.get(substitution.ingredient) ?? []), key]);
  }
  for (const [ingredient, keys] of chosenByIngredient) if (keys.length > 1) errors.push({ code: "conflicting_substitutions", ingredient, substitutions: keys });

  const effective = recipe.ingredients.map((ingredient): Effective => {
    const key = chosenByIngredient.get(ingredient.key)?.[0];
    const substitution = key === undefined ? undefined : substitutionByKey.get(key);
    if (!substitution) {
      const { food, state, cooking, grams, adjust } = ingredient;
      return { ingredient, substitution: undefined, food, state, cooking, defaultGrams: grams, adjust };
    }
    return {
      ingredient,
      substitution: substitution.key,
      food: substitution.food,
      state: substitution.state,
      cooking: substitution.cooking,
      defaultGrams: ingredient.grams * substitution.ratio,
      adjust: substitutedAdjust(ingredient.adjust, substitution),
    };
  });
  const byKey = new Map(effective.map((entry) => [entry.ingredient.key, entry]));

  for (const key of Object.keys(state.amounts).sort()) {
    const entry = byKey.get(key);
    const value = state.amounts[key] ?? Number.NaN;
    if (!entry) errors.push({ code: "unknown_ingredient", ingredient: key });
    else if (!entry.adjust) errors.push({ code: "not_adjustable", ingredient: key });
    else {
      const problem = amountError(key, value, entry.adjust);
      if (problem) errors.push(problem);
    }
  }
  if (errors.length > 0) return { ok: false, errors };

  const chosenGrams = (entry: Effective): number => {
    const value = state.amounts[entry.ingredient.key];
    if (value === undefined || !entry.adjust) return entry.defaultGrams;
    return entry.adjust.kind === "count" ? value * entry.adjust.unitGrams : value;
  };
  const scale = state.servings / recipe.servings;

  const ingredients = effective.map((entry): ResolvedIngredient => {
    const { ingredient } = entry;
    const leader = ingredient.linkedTo === undefined ? undefined : byKey.get(ingredient.linkedTo);
    const switchedOff = off.has(ingredient.key) || (leader !== undefined && off.has(leader.ingredient.key));
    let grams = 0;
    if (!switchedOff) grams = leader ? (entry.defaultGrams * chosenGrams(leader)) / leader.defaultGrams : chosenGrams(entry);
    grams *= scale;
    return {
      key: ingredient.key,
      food: entry.food,
      state: entry.state,
      cooking: entry.cooking,
      estimate: ingredient.estimate,
      includedIn: ingredient.includedIn,
      substitution: entry.substitution,
      grams,
      units: entry.adjust?.kind === "count" ? grams / entry.adjust.unitGrams : undefined,
      switchedOff,
    };
  });
  return { ok: true, value: { servings: state.servings, ingredients } };
}
