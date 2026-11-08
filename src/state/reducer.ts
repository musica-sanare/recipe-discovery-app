/**
 * Application state (ADR-030 D2): one reducer, kept in memory only (ADR-015, ADR-030 D9).
 * Engine calls happen in `src/state/recommendation.ts`; the reducer only stores results,
 * so it stays cheap and pure.
 */
import type { RecipeState } from "../../domain/nutrition/amounts";
import type { EvaluatedPool } from "../../domain/recommendation/pool";
import type { Recommended, Selection } from "../../domain/recommendation/recommend";
import type { RecipeId, Session } from "../../domain/recommendation/types";
import { SHOPPING_LIST_MAX_RECIPES, type ShoppingEntry } from "../../domain/shopping/list";
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
  /** Card order on screen: "exclude this one" puts the new recipe in the removed card's place. */
  readonly order: readonly RecipeId[];
  readonly notice: SetNotice | undefined;
  /**
   * Close alternatives of a re-suggestion that found no recipe meeting the targets; the
   * set on screen stays and these are offered on request (ADR-030 D5).
   */
  readonly heldAlternatives: readonly Recommended[];
}

/**
 * "Exclude this one" keeps the other cards where they were: the new recipe takes the
 * removed card's place, and any further new recipes follow.
 */
export function orderInPlace(previous: readonly RecipeId[], next: readonly RecipeId[]): RecipeId[] {
  const nextSet = new Set(next);
  const fresh = next.filter((id) => !previous.includes(id));
  const ordered = previous.flatMap((id) => {
    if (nextSet.has(id)) return [id];
    const replacement = fresh.shift();
    return replacement === undefined ? [] : [replacement];
  });
  return [...ordered, ...fresh];
}

/** The shopping list (ADR-032 D2, D5): copied recipe states in the order added, and checked item keys. */
export interface ShoppingListState {
  readonly entries: readonly ShoppingEntry[];
  readonly checked: readonly string[];
}

export const EMPTY_SHOPPING_LIST: ShoppingListState = { entries: [], checked: [] };

/** What the targets view says about saved conditions (ADR-036 D3, D4). */
export type SavedNotice = "restored" | "deleted" | "writeFailed";

/**
 * Opt-in saving of the targets form (ADR-036). `on` mirrors whether this page wrote or
 * restored a record; writes and deletes happen in the targets view, not here.
 */
export interface SavedConditionsState {
  /** The stored record was read once after the content loaded. */
  readonly checked: boolean;
  readonly on: boolean;
  readonly allergens: boolean;
  readonly notice: SavedNotice | undefined;
  /** Saved items left out on restore because the content no longer has them. */
  readonly dropped: number;
}

export const INITIAL_SAVED: SavedConditionsState = { checked: false, on: false, allergens: false, notice: undefined, dropped: 0 };

export interface AppState {
  /** The targets form as typed, so it survives view changes; restored after a reload only when saved. */
  readonly draft: TargetsDraft | undefined;
  readonly search: SearchState | undefined;
  /** Recipes selected for comparison, in selection order. */
  readonly compare: readonly RecipeId[];
  /** Adjusted states per recipe in the detail view; a missing entry means the starting state. */
  readonly adjustments: Readonly<Partial<Record<RecipeId, RecipeState>>>;
  /** Kept by a new search; lost on reload like everything else. */
  readonly shoppingList: ShoppingListState;
  readonly saved: SavedConditionsState;
  /**
   * Recipes shown in earlier candidate sets of this page, for the "new to you" mark
   * (ADR-041 D4). Memory only, like everything else here (ADR-030 D9).
   */
  readonly seen: readonly RecipeId[];
}

export const INITIAL_STATE: AppState = { draft: undefined, search: undefined, compare: [], adjustments: {}, shoppingList: EMPTY_SHOPPING_LIST, saved: INITIAL_SAVED, seen: [] };

/** `seen` with the set that leaves the screen added. */
function seenWith(seen: readonly RecipeId[], leaving: readonly RecipeId[]): readonly RecipeId[] {
  const added = leaving.filter((recipe) => !seen.includes(recipe));
  return added.length === 0 ? seen : [...seen, ...added];
}

/** A candidate is new to the user when an earlier set exists and did not show it. */
export function isNewToUser(seen: readonly RecipeId[], recipe: RecipeId): boolean {
  return seen.length > 0 && !seen.includes(recipe);
}

export type AppAction =
  | { readonly type: "draftChanged"; readonly draft: TargetsDraft }
  | { readonly type: "searched"; readonly pool: EvaluatedPool; readonly selection: Selection }
  | { readonly type: "resuggested"; readonly session: Session; readonly seed: number; readonly selection: Selection }
  | { readonly type: "toggledCompare"; readonly recipe: RecipeId }
  | { readonly type: "adjusted"; readonly recipe: RecipeId; readonly state: RecipeState | undefined }
  /**
   * Adds a recipe at the end or replaces its entry in place. `uncheck` names the items whose
   * total changed (`changedItemKeys`), computed by the caller because the reducer has no content.
   */
  | { readonly type: "shoppingSaved"; readonly entry: ShoppingEntry; readonly uncheck: readonly string[] }
  | { readonly type: "shoppingRemoved"; readonly recipe: RecipeId; readonly uncheck: readonly string[] }
  | { readonly type: "shoppingCleared" }
  | { readonly type: "shoppingChecked"; readonly item: string; readonly checked: boolean }
  /** The one read of the stored record; `draft` is set when a record was restored. */
  | { readonly type: "savedChecked"; readonly draft: TargetsDraft | undefined; readonly allergens: boolean; readonly dropped: number }
  | { readonly type: "savedChanged"; readonly on: boolean; readonly allergens: boolean; readonly notice: SavedNotice | undefined }
  | { readonly type: "cleared" };

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "draftChanged":
      return { ...state, draft: action.draft };
    case "searched":
      return {
        draft: state.draft,
        search: {
          pool: action.pool,
          session: EMPTY_SESSION,
          seed: 0,
          selection: action.selection,
          order: action.selection.candidates.map((entry) => entry.recipe),
          notice: undefined,
          heldAlternatives: [],
        },
        compare: [],
        adjustments: {},
        shoppingList: state.shoppingList,
        saved: state.saved.notice === "restored" ? { ...state.saved, notice: undefined, dropped: 0 } : state.saved,
        seen: seenWith(state.seen, state.search?.order ?? []),
      };
    case "resuggested": {
      const search = state.search;
      if (search === undefined) return state;
      // A result without any recipe that meets the targets does not replace the set on screen.
      if (action.selection.candidates.length === 0) return { ...state, search: { ...search, notice: "all_shown", heldAlternatives: action.selection.alternatives } };
      const ids = action.selection.candidates.map((entry) => entry.recipe);
      const onScreen = new Set(ids);
      const order = action.session.keep.length > 0 ? orderInPlace(search.order, ids) : ids;
      return {
        ...state,
        search: {
          pool: search.pool,
          session: action.session,
          seed: action.seed,
          selection: action.selection,
          order,
          notice: action.selection.exhausted ? "all_shown" : undefined,
          heldAlternatives: [],
        },
        compare: state.compare.filter((recipe) => onScreen.has(recipe)),
        seen: seenWith(state.seen, search.order),
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
    case "shoppingSaved": {
      const { entries } = state.shoppingList;
      const index = entries.findIndex((entry) => entry.recipe === action.entry.recipe);
      if (index < 0 && entries.length >= SHOPPING_LIST_MAX_RECIPES) return state;
      const next = index < 0 ? [...entries, action.entry] : entries.map((entry, position) => (position === index ? action.entry : entry));
      return { ...state, shoppingList: { entries: next, checked: withoutKeys(state.shoppingList.checked, action.uncheck) } };
    }
    case "shoppingRemoved":
      return {
        ...state,
        shoppingList: {
          entries: state.shoppingList.entries.filter((entry) => entry.recipe !== action.recipe),
          checked: withoutKeys(state.shoppingList.checked, action.uncheck),
        },
      };
    case "shoppingCleared":
      return { ...state, shoppingList: EMPTY_SHOPPING_LIST };
    case "shoppingChecked": {
      const others = state.shoppingList.checked.filter((key) => key !== action.item);
      return { ...state, shoppingList: { ...state.shoppingList, checked: action.checked ? [...others, action.item] : others } };
    }
    case "savedChecked":
      if (state.saved.checked) return state;
      if (action.draft === undefined) return { ...state, saved: { ...state.saved, checked: true } };
      return {
        ...state,
        draft: state.draft ?? action.draft,
        saved: { checked: true, on: true, allergens: action.allergens, notice: "restored", dropped: action.dropped },
      };
    case "savedChanged":
      return { ...state, saved: { ...state.saved, on: action.on, allergens: action.allergens, notice: action.notice, dropped: 0 } };
    case "cleared":
      return { ...INITIAL_STATE, saved: state.saved, seen: state.seen };
  }
}

function withoutKeys(keys: readonly string[], remove: readonly string[]): readonly string[] {
  return remove.length === 0 ? keys : keys.filter((key) => !remove.includes(key));
}
