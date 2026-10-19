/**
 * The UI's calls into the recommendation engine (ADR-029, ADR-030 D2, D13). Requests and
 * results pass through unchanged; the UI only builds sessions and seeds.
 */
import type { Result } from "../../domain/nutrition/amounts";
import type { RecommendationData } from "../../domain/recommendation/data";
import { evaluatePool, type EvaluatedPool } from "../../domain/recommendation/pool";
import { selectCandidates, type Selection } from "../../domain/recommendation/recommend";
import type { InputError, PoolRequest, RecipeId, Session } from "../../domain/recommendation/types";
import { EMPTY_SESSION, type SearchState } from "./reducer";

export interface SearchResult {
  readonly pool: EvaluatedPool;
  readonly selection: Selection;
}

/** A new search: seed 0 and an empty session. A blocked pool has no entries; the UI shows its contradictions. */
export function search(request: PoolRequest, data: RecommendationData): Result<SearchResult, InputError> {
  const pool = evaluatePool(request, data);
  if (!pool.ok) return pool;
  const selection = selectCandidates(pool.value, EMPTY_SESSION, 0);
  if (!selection.ok) return selection;
  return { ok: true, value: { pool: pool.value, selection: selection.value } };
}

function onScreen(current: SearchState): RecipeId[] {
  return current.selection.candidates.map((entry) => entry.recipe);
}

function union(a: readonly RecipeId[], b: readonly RecipeId[]): RecipeId[] {
  return [...new Set([...a, ...b])];
}

export interface Resuggestion {
  readonly session: Session;
  readonly seed: number;
  readonly selection: Selection;
}

/** "Show a different type" (ADR-029 D6): the set on screen becomes shown and previous; the seed increases by 1. */
export function differentType(current: SearchState): Result<Resuggestion, InputError> {
  const ids = onScreen(current);
  const session: Session = { shown: union(current.session.shown, ids), excluded: current.session.excluded, previous: ids, keep: [] };
  const seed = current.seed + 1;
  const selection = selectCandidates(current.pool, session, seed);
  return selection.ok ? { ok: true, value: { session, seed, selection: selection.value } } : selection;
}

/** "Exclude this one" (ADR-029 D6): the other cards stay; only the free slot is filled. The seed is unchanged. */
export function excludeOne(current: SearchState, recipe: RecipeId): Result<Resuggestion, InputError> {
  const ids = onScreen(current);
  const session: Session = {
    shown: union(current.session.shown, ids),
    excluded: union(current.session.excluded, [recipe]),
    previous: ids,
    keep: ids.filter((id) => id !== recipe),
  };
  const selection = selectCandidates(current.pool, session, current.seed);
  return selection.ok ? { ok: true, value: { session, seed: current.seed, selection: selection.value } } : selection;
}
