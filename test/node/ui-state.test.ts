import { describe, expect, it } from "vitest";
import { defaultState } from "../../domain/nutrition/amounts.ts";
import { recommendationDataFromBundle } from "../../domain/recommendation/data.ts";
import { evaluatePool, selectCandidates } from "../../domain/recommendation/recommend.ts";
import type { Conditions, PoolRequest } from "../../domain/recommendation/types.ts";
import { presetTargets } from "../../domain/recommendation/validate.ts";
import { appReducer, EMPTY_SESSION, INITIAL_STATE, MAX_COMPARE, type AppState, type SearchState } from "../../src/state/reducer.ts";
import { differentType, excludeOne, search } from "../../src/state/recommendation.ts";
import { repositoryEngine } from "../../tools/content/repository.ts";

// The UI's session handling on the repository content (ADR-029 D6, ADR-030 D2, D5, D13).
const { calc } = repositoryEngine();
const data = recommendationDataFromBundle(calc);
const none: Conditions = { excludedFoods: [], excludedAllergens: [], requiredFoods: [], cuisines: [] };
const cut: PoolRequest = { targets: presetTargets("cut"), servings: 1, conditions: none };
// Persona P4 (Stage 3.7): all five recipes that meet the targets appear in the first set.
const p4: PoolRequest = { targets: { kcal: { min: 450, max: 550 }, proteinMin: 35, fatMax: 10 }, servings: 1, conditions: none };

function searched(request: PoolRequest): AppState {
  const result = search(request, data);
  if (!result.ok) throw new Error("search failed");
  return appReducer(INITIAL_STATE, { type: "searched", ...result.value });
}

function current(state: AppState): SearchState {
  if (state.search === undefined) throw new Error("no search");
  return state.search;
}

const ids = (state: AppState) => current(state).selection.candidates.map((entry) => entry.recipe);

describe("search", () => {
  it("passes the request to the engine unchanged and starts with seed 0 and an empty session", () => {
    const pool = evaluatePool(cut, data);
    if (!pool.ok) throw new Error("pool");
    const state = current(searched(cut));
    expect({ ok: true, value: state.selection }).toEqual(selectCandidates(pool.value, EMPTY_SESSION, 0));
    expect(state.pool.request).toEqual(pool.value.request);
    expect([state.seed, state.session]).toEqual([0, EMPTY_SESSION]);
  });

  it("returns the engine's input errors", () => {
    expect(search({ ...cut, servings: 0 }, data)).toEqual({ ok: false, errors: [{ code: "invalid_servings", servings: 0 }] });
  });
});

describe("show a different type", () => {
  it("marks the set as shown and previous and increases the seed by 1", () => {
    const first = searched(cut);
    const result = differentType(current(first));
    if (!result.ok) throw new Error("resuggestion");
    expect(result.value.seed).toBe(1);
    expect(result.value.session).toEqual({ shown: ids(first), excluded: [], previous: ids(first), keep: [] });
    const next = appReducer(first, { type: "resuggested", ...result.value });
    expect(ids(next).some((id) => ids(first).includes(id))).toBe(false);
    expect(current(next).notice).toBeUndefined();
  });

  it("keeps the set on screen when no other recipe meets the targets (ADR-030 D5)", () => {
    const first = searched(p4);
    const result = differentType(current(first));
    if (!result.ok) throw new Error("resuggestion");
    expect(result.value.selection.candidates).toEqual([]);
    const next = appReducer(first, { type: "resuggested", ...result.value });
    expect(ids(next)).toEqual(ids(first));
    expect(current(next).notice).toBe("all_shown");
    expect(current(next).seed).toBe(0);
  });
});

describe("exclude this one", () => {
  it("keeps the other cards, fills the free slot, and keeps the seed", () => {
    const first = searched(cut);
    const [removed = ""] = ids(first);
    const result = excludeOne(current(first), removed);
    if (!result.ok) throw new Error("exclusion");
    const next = appReducer(first, { type: "resuggested", ...result.value });
    expect(result.value.seed).toBe(0);
    expect(ids(next)).not.toContain(removed);
    expect(ids(next).slice(0, ids(first).length - 1)).toEqual(ids(first).filter((id) => id !== removed));
    expect(ids(next)).toHaveLength(ids(first).length);
  });
});

describe("reducer", () => {
  it(`selects at most ${String(MAX_COMPARE)} recipes for comparison and toggles them off`, () => {
    let state = searched(cut);
    for (const id of ids(state)) state = appReducer(state, { type: "toggledCompare", recipe: id });
    expect(state.compare).toEqual(ids(state).slice(0, MAX_COMPARE));
    const [first = ""] = state.compare;
    state = appReducer(state, { type: "toggledCompare", recipe: first });
    expect(state.compare).not.toContain(first);
  });

  it("stores and clears adjustment states, and a new search clears them", () => {
    const recipe = calc.recipes[0];
    if (recipe === undefined) throw new Error("no recipe");
    let state = appReducer(searched(cut), { type: "adjusted", recipe: recipe.id, state: { ...defaultState(recipe), servings: 2 } });
    expect(state.adjustments[recipe.id]?.servings).toBe(2);
    state = appReducer(state, { type: "adjusted", recipe: recipe.id, state: undefined });
    expect(state.adjustments).toEqual({});
    state = appReducer(state, { type: "adjusted", recipe: recipe.id, state: defaultState(recipe) });
    const result = search(cut, data);
    if (!result.ok) throw new Error("search");
    expect(appReducer(state, { type: "searched", ...result.value }).adjustments).toEqual({});
  });
});
