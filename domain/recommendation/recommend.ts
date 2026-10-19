/**
 * Candidate selection for a session and seed (ADR-029 D5, D6, D8). The expensive part
 * is `evaluatePool` (pool.ts); "show a different type" and "exclude this one" call
 * `selectCandidates` again on the same pool.
 */
import type { Result } from "../nutrition/amounts.ts";
import { compareFits } from "./fit.ts";
import { tierCounts, type EvaluatedPool, type PoolEntry, type TierCounts } from "./pool.ts";
import { reasonsFor, type ReasonData } from "./reasons.ts";
import { suggestRelaxations, type Relaxation } from "./relax.ts";
import { seededKey, selectDiverse } from "./select.ts";
import type { ExclusionCount, InputError, Session } from "./types.ts";
import { validateSession } from "./validate.ts";

export { evaluatePool, type EvaluatedPool, type PoolEntry, type TierCounts } from "./pool.ts";

export const MAX_CANDIDATES = 5;
export const MIN_CANDIDATES = 3;

export interface Recommended extends PoolEntry {
  readonly reasons: readonly ReasonData[];
}

export interface Selection {
  /** Recipes that meet the targets: kept cards first, then new picks; at most 5. */
  readonly candidates: readonly Recommended[];
  /** When fewer than 3 candidates: the closest other recipes, best fit first, up to 3 in total. */
  readonly alternatives: readonly Recommended[];
  /** Fewer than 3 unshown recipes met the targets, so shown ones were offered again. */
  readonly exhausted: boolean;
  /** Pool exclusions plus the recipes the user excluded in the session. */
  readonly exclusions: readonly ExclusionCount[];
  /** When fewer than 3 recipes meet the targets: one-constraint relaxations with their gains. */
  readonly relaxations: readonly Relaxation[];
  /** Over the eligible recipes the user did not exclude. */
  readonly tiers: TierCounts;
  /** Eligible recipes the user did not exclude, in recipe ID order. */
  readonly available: readonly PoolEntry[];
}

const CHANGE_EPSILON = 1e-9;

/** Close alternatives: better fit, then smaller change, then the seeded order and the ID. */
function compareAlternatives(a: PoolEntry, b: PoolEntry, seed: number): number {
  const fit = compareFits(a.solution.fit, b.solution.fit);
  if (fit !== 0) return fit;
  if (Math.abs(a.relativeChange - b.relativeChange) > CHANGE_EPSILON) return a.relativeChange - b.relativeChange;
  const order = seededKey(seed, a.recipe) - seededKey(seed, b.recipe);
  if (order !== 0) return order;
  return a.recipe < b.recipe ? -1 : a.recipe > b.recipe ? 1 : 0;
}

/**
 * Candidates for a session and seed. Kept cards stay first; the free slots are filled
 * from recipes that meet the targets and were not shown, with the kept and previous
 * recipes counting as taken for diversity. When fewer than 3 such recipes remain (or
 * fewer than the free slots), the set is exhausted: after the unshown ones, shown
 * recipes other than the previous set fill the free slots.
 */
export function selectCandidates(pool: EvaluatedPool, session: Session, seed: number): Result<Selection, InputError> {
  const validated = validateSession(session, seed, pool.recipeIds);
  if (!validated.ok) return validated;
  const { shown, excluded, previous, keep } = validated.value;
  const excludedSet = new Set(excluded);
  const available = pool.entries.filter((entry) => !excludedSet.has(entry.recipe));
  const met = available.filter((entry) => entry.solution.fit.tier === "met");
  const metById = new Map(met.map((entry) => [entry.recipe, entry]));
  const entryById = new Map(pool.entries.map((entry) => [entry.recipe, entry]));

  const kept = keep
    .flatMap((id) => {
      const entry = metById.get(id);
      return entry ? [entry] : [];
    })
    .slice(0, MAX_CANDIDATES);
  const keptIds = new Set(kept.map((entry) => entry.recipe));
  const slots = MAX_CANDIDATES - kept.length;
  const previousAttributes = previous.flatMap((id) => {
    const entry = entryById.get(id);
    return entry ? [entry.attributes] : [];
  });
  const taken = [...kept.map((entry) => entry.attributes), ...previousAttributes];

  const shownSet = new Set(shown);
  const previousSet = new Set(previous);
  const unshown = met.filter((entry) => !shownSet.has(entry.recipe) && !keptIds.has(entry.recipe));
  const reshowable = met.filter((entry) => shownSet.has(entry.recipe) && !keptIds.has(entry.recipe) && !previousSet.has(entry.recipe));
  const exhausted = unshown.length < Math.min(MIN_CANDIDATES, slots) && reshowable.length > 0;
  // Unshown recipes first; when exhausted, shown ones (except the previous set) fill the rest.
  const fresh = selectDiverse(unshown, slots, taken, seed);
  const again = exhausted ? selectDiverse(reshowable, slots - fresh.length, [...taken, ...fresh.map((entry) => entry.attributes)], seed) : [];
  const chosen = [...kept, ...fresh, ...again];

  // Close alternatives fill up to 3 recipes in total, unshown ones first.
  const chosenIds = new Set(chosen.map((entry) => entry.recipe));
  const others = available.filter((entry) => entry.solution.fit.tier !== "met" && !chosenIds.has(entry.recipe));
  const ordered = [...others].sort((a, b) => Number(shownSet.has(a.recipe)) - Number(shownSet.has(b.recipe)) || compareAlternatives(a, b, seed));
  const alternativeEntries = ordered.slice(0, Math.max(0, MIN_CANDIDATES - chosen.length));

  const context = { request: pool.request, candidates: chosen, previous: previousAttributes };
  const withReasons = (entry: PoolEntry): Recommended => ({ ...entry, reasons: reasonsFor(entry, context) });

  const sessionExclusion: ExclusionCount[] =
    excluded.length === 0
      ? []
      : [{ item: { constraint: "sessionExcluded" }, count: excluded.length, onlyThis: pool.entries.filter((entry) => excludedSet.has(entry.recipe)).length }];

  const tiers = tierCounts(available);
  return {
    ok: true,
    value: {
      candidates: chosen.map(withReasons),
      alternatives: alternativeEntries.map(withReasons),
      exhausted,
      exclusions: [...sessionExclusion, ...pool.exclusions],
      relaxations: tiers.met < MIN_CANDIDATES ? suggestRelaxations(pool, excludedSet) : [],
      tiers,
      available,
    },
  };
}
