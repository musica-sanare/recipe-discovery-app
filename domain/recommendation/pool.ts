/**
 * The evaluated pool (ADR-029): validation, contradictions, hard filters, and one
 * solver run per eligible recipe, done once per targets and conditions. Solutions are
 * memoized per recipe and state so that relaxation can evaluate other conditions
 * without repeating work; the cache never changes a result.
 */
import type { BundleRecipe } from "../../shared/bundle.ts";
import { methodFamily } from "../../shared/recipe.ts";
import type { Result } from "../nutrition/amounts.ts";
import type { RecommendationData } from "./data.ts";
import { applyHardFilters, type EligibleRecipe } from "./filters.ts";
import type { Tier } from "./fit.ts";
import { preferenceScore, type Selectable } from "./select.ts";
import { solve, type Solution } from "./solver.ts";
import type { Conditions, Contradiction, ExclusionCount, ForcedState, InputError, PoolRequest, RecipeId } from "./types.ts";
import { checkContradictions, validatePoolRequest } from "./validate.ts";

export interface PoolEntry extends Selectable {
  readonly minutes: number;
  readonly effort: 1 | 2 | 3;
  readonly forced: ForcedState;
  readonly solution: Solution;
}

export interface EvaluatedPool {
  /** The validated, normalized request. */
  readonly request: PoolRequest;
  readonly contradictions: readonly Contradiction[];
  /** A blocking contradiction stops the search: no entries. */
  readonly blocked: boolean;
  /** Recipes that pass the hard filters, in recipe ID order. */
  readonly entries: readonly PoolEntry[];
  readonly exclusions: readonly ExclusionCount[];
  readonly recipeIds: ReadonlySet<RecipeId>;
  readonly data: RecommendationData;
  /** Memoized entries by recipe, forced state, and locked sides. */
  readonly cache: Map<string, PoolEntry>;
}

export interface TierCounts {
  readonly met: number;
  readonly near: number;
  readonly not_met: number;
}

export function tierCounts(entries: readonly PoolEntry[]): TierCounts {
  const count = (tier: Tier) => entries.filter((entry) => entry.solution.fit.tier === tier).length;
  return { met: count("met"), near: count("near"), not_met: count("not_met") };
}

/** Sides holding a food of a required item; the solver keeps them on (ADR-029 D4). */
function lockedSides(recipe: BundleRecipe, conditions: Conditions): string[] {
  const required = new Set(conditions.requiredFoods.flat());
  const foodOf = new Map(recipe.ingredients.map((ingredient) => [ingredient.key, ingredient.food]));
  return recipe.sides.filter((side) => side.ingredients.some((key) => required.has(foodOf.get(key) ?? ""))).map((side) => side.key);
}

/** The entry of an eligible recipe under the request's targets and the given conditions. */
export function poolEntry(pool: Pick<EvaluatedPool, "request" | "data" | "cache">, eligible: EligibleRecipe<BundleRecipe>, conditions: Conditions): PoolEntry {
  const { recipe, forced, minutes } = eligible;
  const locked = lockedSides(recipe, conditions);
  const key = [recipe.id, forced.sidesOff.join(","), forced.substitutions.join(","), locked.join(",")].join("|");
  const cached = pool.cache.get(key);
  // Preferences depend on the soft conditions, which relaxation never changes.
  if (cached) return cached;
  const { request, data } = pool;
  const solution = solve({ recipe, targets: request.targets, servings: request.servings, forced, lockedSides: locked }, data.engine);
  const entry: PoolEntry = {
    recipe: recipe.id,
    attributes: { proteinGroup: recipe.mainProteinGroup, cuisine: recipe.cuisine, method: methodFamily(recipe, (food) => data.foods.get(food)?.proteinGroup) },
    preference: preferenceScore(recipe, request.conditions),
    relativeChange: solution.relativeChange,
    minutes,
    effort: recipe.effort,
    forced,
    solution,
  };
  pool.cache.set(key, entry);
  return entry;
}

export function evaluatePool(request: PoolRequest, data: RecommendationData): Result<EvaluatedPool, InputError> {
  const validated = validatePoolRequest(request, data.foods);
  if (!validated.ok) return validated;
  const valid = validated.value;
  const contradictions = checkContradictions(valid.targets);
  const blocked = contradictions.some((contradiction) => contradiction.severity === "blocking");
  const filtered = applyHardFilters(data.recipes, valid.conditions, new Set(), data.foods);
  const base = { request: valid, data, cache: new Map<string, PoolEntry>() };
  const entries = blocked ? [] : filtered.eligible.map((eligible) => poolEntry(base, eligible, valid.conditions));
  return {
    ok: true,
    value: { ...base, contradictions, blocked, entries, exclusions: filtered.exclusions, recipeIds: new Set(data.recipes.map((recipe) => recipe.id)) },
  };
}
