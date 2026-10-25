/**
 * Relaxation options (ADR-029 D8, docs/en/SPEC.md §12): one hard constraint at a time,
 * with the resulting gain in recipes that meet (and nearly meet) the targets,
 * recomputed exactly with the same filters and solver. Allergens and recipes the user
 * excluded are never relaxed.
 */
import type { Equipment } from "../../shared/content.ts";
import { applyHardFilters, checkRecipe } from "./filters.ts";
import { poolEntry, tierCounts, type EvaluatedPool, type TierCounts } from "./pool.ts";
import type { Conditions, FoodId, RecipeId } from "./types.ts";

export interface Gain {
  readonly met: number;
  readonly near: number;
}

export type Relaxation =
  | { readonly constraint: "maxMinutes"; readonly to: number; readonly gain: Gain }
  | { readonly constraint: "equipment"; readonly add: Equipment; readonly gain: Gain }
  | { readonly constraint: "requiredFood"; readonly index: number; readonly gain: Gain }
  | { readonly constraint: "excludedFood"; readonly food: FoodId; readonly gain: Gain };

const ORDER: readonly Relaxation["constraint"][] = ["maxMinutes", "equipment", "requiredFood", "excludedFood"];

function relaxationKey(relaxation: Relaxation): string {
  switch (relaxation.constraint) {
    case "maxMinutes":
      return String(relaxation.to).padStart(6, "0");
    case "equipment":
      return relaxation.add;
    case "requiredFood":
      return String(relaxation.index).padStart(6, "0");
    case "excludedFood":
      return relaxation.food;
  }
}

/** Tier counts over the recipes that pass `conditions`, without the user's exclusions. */
export function countFor(pool: EvaluatedPool, conditions: Conditions, excluded: ReadonlySet<RecipeId>): TierCounts {
  const { eligible } = applyHardFilters(pool.data.recipes, conditions, excluded, pool.data.foods);
  return tierCounts(eligible.map((entry) => poolEntry(pool, entry, conditions)));
}

/** Options that add met or near recipes, best first; empty when the search was blocked. */
export function suggestRelaxations(pool: EvaluatedPool, excluded: ReadonlySet<RecipeId>): Relaxation[] {
  if (pool.blocked) return [];
  const conditions = pool.request.conditions;
  const current = countFor(pool, conditions, excluded);
  const gainOf = (relaxed: Conditions): Gain => {
    const counts = countFor(pool, relaxed, excluded);
    return { met: counts.met - current.met, near: counts.near - current.near };
  };
  const options: Relaxation[] = [];

  if (conditions.maxMinutes !== undefined) {
    const limit = conditions.maxMinutes;
    const withoutTime: Conditions = {
      excludedFoods: conditions.excludedFoods,
      excludedAllergens: conditions.excludedAllergens,
      requiredFoods: conditions.requiredFoods,
      cuisines: conditions.cuisines,
      ...(conditions.equipment === undefined ? {} : { equipment: conditions.equipment }),
    };
    const times = [
      ...new Set(pool.data.recipes.map((recipe) => checkRecipe(recipe, withoutTime, excluded, pool.data.foods).minutes).filter((minutes) => minutes > limit)),
    ].sort((a, b) => a - b);
    // The smallest time that adds a met recipe, otherwise the smallest that adds a near one.
    let nearOption: Relaxation | undefined;
    for (const to of times) {
      const gain = gainOf({ ...conditions, maxMinutes: to });
      if (gain.met > 0) {
        options.push({ constraint: "maxMinutes", to, gain });
        nearOption = undefined;
        break;
      }
      if (gain.near > 0 && !nearOption) nearOption = { constraint: "maxMinutes", to, gain };
    }
    if (nearOption) options.push(nearOption);
  }

  if (conditions.equipment !== undefined) {
    const available = conditions.equipment;
    const missing = [...new Set(pool.data.recipes.flatMap((recipe) => recipe.equipment))].filter((equipment) => !available.includes(equipment)).sort();
    for (const add of missing) options.push({ constraint: "equipment", add, gain: gainOf({ ...conditions, equipment: [...available, add].sort() }) });
  }

  conditions.requiredFoods.forEach((_, index) => {
    options.push({ constraint: "requiredFood", index, gain: gainOf({ ...conditions, requiredFoods: conditions.requiredFoods.filter((__, other) => other !== index) }) });
  });

  for (const food of conditions.excludedFoods) {
    options.push({ constraint: "excludedFood", food, gain: gainOf({ ...conditions, excludedFoods: conditions.excludedFoods.filter((other) => other !== food) }) });
  }

  return options
    .filter((option) => option.gain.met > 0 || option.gain.near > 0)
    .sort((a, b) => {
      if (a.gain.met !== b.gain.met) return b.gain.met - a.gain.met;
      if (a.gain.near !== b.gain.near) return b.gain.near - a.gain.near;
      const order = ORDER.indexOf(a.constraint) - ORDER.indexOf(b.constraint);
      if (order !== 0) return order;
      const [x, y] = [relaxationKey(a), relaxationKey(b)];
      return x < y ? -1 : x > y ? 1 : 0;
    });
}
