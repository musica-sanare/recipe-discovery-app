/**
 * Application state (ADR-030 D2): one reducer, kept in memory only (ADR-015, ADR-030 D9).
 * Engine calls happen in `src/state/recommendation.ts`; the reducer only stores results,
 * so it stays cheap and pure.
 */
import type { RecipeState } from "../../domain/nutrition/amounts";
import type { EvaluatedPool } from "../../domain/recommendation/pool";
import type { Selection } from "../../domain/recommendation/recommend";
import type { RecipeId, Session } from "../../domain/recommendation/types";
import type { TargetsDraft } from "../views/targets/draft";

export const MAX_COMPARE = 3;

export const EMPTY_SESSION: Session = { shown: [], excluded: [], previous: [], keep: [] };

/** Why the set on screen did not change, or why it repeats recipes (ADR-030 D5). */
export type SetNotice = "all_shown";

export interface SearchState {
  readonly pool: EvaluatedPool;
  readonly session: Session;
  readonly seed: number;
  readonly selection: Selection;
  readonly notice: SetNotice | undefined;
}

export interface AppState {
  /** The targets form as typed, so it survives view changes (not reloads). */
  readonly draft: TargetsDraft | undefined;
  readonly search: SearchState | undefined;
  /** Recipes selected for comparison, in selection order. */
  readonly compare: readonly RecipeId[];
  /** Adjusted states per recipe in the detail view; a missing entry means the starting state. */
  readonly adjustments: Readonly<Partial<Record<RecipeId, RecipeState>>>;
}

export const INITIAL_STATE: AppState = { draft: undefined, search: undefined, compare: [], adjustments: {} };

export type AppAction =
  | { readonly type: "draftChanged"; readonly draft: TargetsDraft }
  | { readonly type: "searched"; readonly pool: EvaluatedPool; readonly selection: Selection }
  | { readonly type: "resuggested"; readonly session: Session; readonly seed: number; readonly selection: Selection }
  | { readonly type: "toggledCompare"; readonly recipe: RecipeId }
  | { readonly type: "adjusted"; readonly recipe: RecipeId; readonly state: RecipeState | undefined }
  | { readonly type: "cleared" };

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "draftChanged":
      return { ...state, draft: action.draft };
    case "searched":
      return {
        draft: state.draft,
        search: { pool: action.pool, session: EMPTY_SESSION, seed: 0, selection: action.selection, notice: undefined },
        compare: [],
        adjustments: {},
      };
    case "resuggested": {
      const search = state.search;
      if (search === undefined) return state;
      // A result without any recipe that meets the targets does not replace the set on screen.
      if (action.selection.candidates.length === 0) return { ...state, search: { ...search, notice: "all_shown" } };
      const onScreen = new Set(action.selection.candidates.map((entry) => entry.recipe));
      return {
        ...state,
        search: { pool: search.pool, session: action.session, seed: action.seed, selection: action.selection, notice: action.selection.exhausted ? "all_shown" : undefined },
        compare: state.compare.filter((recipe) => onScreen.has(recipe)),
      };
    }
    case "toggledCompare": {
      if (state.compare.includes(action.recipe)) return { ...state, compare: state.compare.filter((recipe) => recipe !== action.recipe) };
      if (state.compare.length >= MAX_COMPARE) return state;
      return { ...state, compare: [...state.compare, action.recipe] };
    }
    case "adjusted": {
      const others = Object.fromEntries(Object.entries(state.adjustments).filter(([recipe]) => recipe !== action.recipe));
      return { ...state, adjustments: action.state === undefined ? others : { ...others, [action.recipe]: action.state } };
    }
    case "cleared":
      return INITIAL_STATE;
  }
}
