/**
 * What a candidate card shows, derived from engine output only (docs/UI_DESIGN.md §3.2,
 * ADR-030 D12). No value or status is computed here; this module selects and orders
 * what the engines returned.
 */
import type { Nutrient } from "../../../domain/nutrition/data";
import type { RecipeNutrition } from "../../../domain/nutrition/engine";
import type { NutrientFit, TargetKey } from "../../../domain/recommendation/fit";
import { TARGET_NUTRIENT } from "../../../domain/recommendation/fit";
import type { PoolEntry } from "../../../domain/recommendation/pool";
import type { ReasonData } from "../../../domain/recommendation/reasons";
import type { Targets } from "../../../domain/recommendation/types";
import type { BundleRecipe, CalcBundle } from "../../../shared/bundle";
import type { Allergen } from "../../../shared/content";

/** D12: the reason line shows at most two of these, in this order. */
const REASON_ORDER: readonly ReasonData["code"][] = ["highest_among_candidates", "lowest_among_candidates", "new_attribute", "matches_cuisine", "quick", "within_effort"];
const MAX_CARD_REASONS = 2;
const GAP_CODES: ReadonlySet<ReasonData["code"]> = new Set(["near_target", "misses_target", "unknown_value", "range_straddles"]);

/**
 * The card's reason line. The required ingredients used have their own line on the card,
 * so `uses_required_foods` is not repeated here; without any listed reason the fit reason is used.
 */
export function cardReasons(reasons: readonly ReasonData[]): ReasonData[] {
  const ranked = REASON_ORDER.flatMap((code) => reasons.filter((reason) => reason.code === code)).slice(0, MAX_CARD_REASONS);
  if (ranked.length > 0) return ranked;
  return reasons.filter((reason) => reason.code === "meets_all_targets" || reason.code === "meets_with_adjustment").slice(0, 1);
}

/** Every gap reason, for close alternatives. */
export function gapReasons(reasons: readonly ReasonData[]): ReasonData[] {
  return reasons.filter((reason) => GAP_CODES.has(reason.code));
}

export interface TargetLine {
  readonly target: TargetKey;
  readonly nutrient: Nutrient;
  /** Undefined when the user set no target for this nutrient. */
  readonly fit: NutrientFit | undefined;
}

/** The four card nutrients in a fixed order, with their fit when a target is set. */
export function targetLines(entry: PoolEntry): TargetLine[] {
  const fits = new Map(entry.solution.fit.nutrients.map((fit) => [fit.target, fit]));
  return (["kcal", "protein", "fat", "carbohydrate"] as const).map((target) => ({ target, nutrient: TARGET_NUTRIENT[target], fit: fits.get(target) }));
}

/** The bound a boundary note refers to: the one the full value is outside of. */
export function missedBound(targets: Targets, fit: NutrientFit): { readonly side: "min" | "max"; readonly value: number } | undefined {
  const bounds: Readonly<Record<TargetKey, { readonly min?: number; readonly max?: number }>> = {
    kcal: targets.kcal,
    protein: targets.proteinMin === undefined ? {} : { min: targets.proteinMin },
    fat: targets.fatMax === undefined ? {} : { max: targets.fatMax },
    carbohydrate: targets.carbohydrate ?? {},
  };
  const bound = bounds[fit.target];
  if (fit.position === "below_min" && bound.min !== undefined) return { side: "min", value: bound.min };
  if (fit.position === "above_max" && bound.max !== undefined) return { side: "max", value: bound.max };
  return undefined;
}

export type AdjustmentItem =
  | { readonly kind: "amount"; readonly ingredient: string; readonly food: string; readonly from: number; readonly to: number; readonly unit: "g" | "count" }
  | { readonly kind: "side_off"; readonly side: string; readonly forced: boolean }
  | { readonly kind: "substitution"; readonly substitution: string };

/** Amount changes and sides switched off by the solver, then states forced by excluded foods. */
export function adjustmentItems(entry: PoolEntry, recipe: BundleRecipe): AdjustmentItem[] {
  const foodOf = new Map(recipe.ingredients.map((ingredient) => [ingredient.key, ingredient.food]));
  const substitutedFood = new Map(recipe.substitutions.filter((substitution) => entry.forced.substitutions.includes(substitution.key)).map((substitution) => [substitution.ingredient, substitution.food]));
  return [
    ...entry.solution.changes.map((change): AdjustmentItem => ({
      kind: "amount",
      ingredient: change.ingredient,
      food: substitutedFood.get(change.ingredient) ?? foodOf.get(change.ingredient) ?? change.ingredient,
      from: change.from,
      to: change.to,
      unit: change.unit,
    })),
    ...entry.solution.sidesOff.map((side): AdjustmentItem => ({ kind: "side_off", side, forced: false })),
    ...entry.forced.sidesOff.map((side): AdjustmentItem => ({ kind: "side_off", side, forced: true })),
    ...entry.forced.substitutions.map((substitution): AdjustmentItem => ({ kind: "substitution", substitution })),
  ];
}

export interface AllergenNotice {
  readonly allergen: Allergen;
  readonly confidence: "contains" | "may_contain";
}

/**
 * Allergens of the ingredients in the shown state (frying oil and coatings included,
 * sides that are off excluded), strongest confidence first. Foods without reviewed
 * information are reported separately; they are never shown as free of allergens.
 */
export function allergenNotices(nutrition: Pick<RecipeNutrition, "ingredients">, calc: CalcBundle): { readonly allergens: AllergenNotice[]; readonly unknownFoods: string[] } {
  const foods = new Map(calc.foods.map((food) => [food.id, food]));
  const confidence = new Map<Allergen, "contains" | "may_contain">();
  const unknownFoods = new Set<string>();
  for (const ingredient of nutrition.ingredients) {
    if (ingredient.switchedOff) continue;
    const food = foods.get(ingredient.food);
    if (food === undefined || food.allergens === "unknown") {
      unknownFoods.add(ingredient.food);
      continue;
    }
    for (const link of food.allergens) {
      if (link.confidence === "contains" || !confidence.has(link.allergen)) confidence.set(link.allergen, link.confidence);
    }
  }
  const allergens = [...confidence].map(([allergen, level]) => ({ allergen, confidence: level }));
  allergens.sort((a, b) => Number(a.confidence === "may_contain") - Number(b.confidence === "may_contain"));
  return { allergens, unknownFoods: [...unknownFoods].sort() };
}
