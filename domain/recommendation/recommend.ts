/**
 * Entry points of the recommendation engine (ADR-029). `evaluatePool` does the
 * expensive part once per targets and conditions (validation, contradictions, hard
 * filters, solver); `selectCandidates` applies the session and the seed, so "show a
 * different type" and "exclude this one" reuse the solver results.
 */
import type { Result } from "../nutrition/amounts.ts";
import { methodFamily } from "../../shared/recipe.ts";
import type { RecommendationData } from "./data.ts";
import { applyHardFilters } from "./filters.ts";
import type { Tier } from "./fit.ts";
import { preferenceScore, selectDiverse, type Selectable } from "./select.ts";
import { solve, type Solution } from "./solver.ts";
import type { Contradiction, ExclusionCount, ForcedState, InputError, PoolRequest, RecipeId, Session } from "./types.ts";
import { checkContradictions, validatePoolRequest, validateSession } from "./validate.ts";

export const MAX_CANDIDATES = 5;
export const MIN_CANDIDATES = 3;

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
}

export interface TierCounts {
  readonly met: number;
  readonly near: number;
  readonly not_met: number;
}

export interface Selection {
  /** Recipes that meet the targets: kept cards first, then new picks; at most 5. */
  readonly candidates: readonly PoolEntry[];
  /** Fewer than 3 unshown recipes met the targets, so shown ones were offered again. */
  readonly exhausted: boolean;
  /** Pool exclusions plus the recipes the user excluded in the session. */
  readonly exclusions: readonly ExclusionCount[];
  /** Over the eligible recipes the user did not exclude. */
  readonly tiers: TierCounts;
  /** Eligible recipes the user did not exclude, in recipe ID order. */
  readonly available: readonly PoolEntry[];
}

export function evaluatePool(request: PoolRequest, data: RecommendationData): Result<EvaluatedPool, InputError> {
  const validated = validatePoolRequest(request, data.foods);
  if (!validated.ok) return validated;
  const valid = validated.value;
  const recipeIds = new Set(data.recipes.map((recipe) => recipe.id));
  const contradictions = checkContradictions(valid.targets);
  const filtered = applyHardFilters(data.recipes, valid.conditions, new Set(), data.foods);
  const blocked = contradictions.some((contradiction) => contradiction.severity === "blocking");
  const proteinGroupOf = (food: string) => data.foods.get(food)?.proteinGroup;
  const required = new Set(valid.conditions.requiredFoods.flat());

  const entries = blocked
    ? []
    : filtered.eligible.map(({ recipe, forced, minutes }): PoolEntry => {
        const lockedSides = recipe.sides
          .filter((side) => side.ingredients.some((key) => required.has(recipe.ingredients.find((ingredient) => ingredient.key === key)?.food ?? "")))
          .map((side) => side.key);
        const solution = solve({ recipe, targets: valid.targets, servings: valid.servings, forced, lockedSides }, data.engine);
        return {
          recipe: recipe.id,
          attributes: { proteinGroup: recipe.mainProteinGroup, cuisine: recipe.cuisine, method: methodFamily(recipe, proteinGroupOf) },
          preference: preferenceScore(recipe, valid.conditions),
          relativeChange: solution.relativeChange,
          minutes,
          effort: recipe.effort,
          forced,
          solution,
        };
      });
  return { ok: true, value: { request: valid, contradictions, blocked, entries, exclusions: filtered.exclusions, recipeIds } };
}

function tierCounts(entries: readonly PoolEntry[]): TierCounts {
  const count = (tier: Tier) => entries.filter((entry) => entry.solution.fit.tier === tier).length;
  return { met: count("met"), near: count("near"), not_met: count("not_met") };
}

/**
 * Candidates for a session and seed (ADR-029 D5, D6). Kept cards stay first; the free
 * slots are filled from recipes that meet the targets and were not shown, with the
 * kept and previous recipes counting as taken for diversity. When fewer than 3 such
 * recipes remain (or fewer than the free slots), the set is exhausted: after the
 * unshown ones, shown recipes other than the previous set fill the free slots.
 */
export function selectCandidates(pool: EvaluatedPool, session: Session, seed: number): Result<Selection, InputError> {
  const validated = validateSession(session, seed, pool.recipeIds);
  if (!validated.ok) return validated;
  const { shown, excluded, previous, keep } = validated.value;
  const excludedSet = new Set(excluded);
  const available = pool.entries.filter((entry) => !excludedSet.has(entry.recipe));
  const met = available.filter((entry) => entry.solution.fit.tier === "met");
  const byId = new Map(met.map((entry) => [entry.recipe, entry]));

  const kept = keep.flatMap((id) => {
    const entry = byId.get(id);
    return entry ? [entry] : [];
  }).slice(0, MAX_CANDIDATES);
  const keptIds = new Set(kept.map((entry) => entry.recipe));
  const slots = MAX_CANDIDATES - kept.length;
  const taken = [...new Set([...kept.map((entry) => entry.recipe), ...previous])].flatMap((id) => {
    const entry = pool.entries.find((candidate) => candidate.recipe === id);
    return entry ? [entry.attributes] : [];
  });

  const shownSet = new Set(shown);
  const unshown = met.filter((entry) => !shownSet.has(entry.recipe) && !keptIds.has(entry.recipe));
  const previousSet = new Set(previous);
  const exhausted = unshown.length < Math.min(MIN_CANDIDATES, slots) && met.some((entry) => shownSet.has(entry.recipe) && !keptIds.has(entry.recipe) && !previousSet.has(entry.recipe));
  // Unshown recipes first; when exhausted, shown ones (except the previous set) fill the rest.
  const fresh = selectDiverse(unshown, slots, taken, seed);
  const again = exhausted
    ? selectDiverse(
        met.filter((entry) => shownSet.has(entry.recipe) && !keptIds.has(entry.recipe) && !previousSet.has(entry.recipe)),
        slots - fresh.length,
        [...taken, ...fresh.map((entry) => entry.attributes)],
        seed,
      )
    : [];
  const picks = [...fresh, ...again];

  const sessionExclusion: ExclusionCount[] =
    excluded.length === 0
      ? []
      : [{ item: { constraint: "sessionExcluded" }, count: excluded.length, onlyThis: pool.entries.filter((entry) => excludedSet.has(entry.recipe)).length }];

  return {
    ok: true,
    value: { candidates: [...kept, ...picks], exhausted, exclusions: [...sessionExclusion, ...pool.exclusions], tiers: tierCounts(available), available },
  };
}
