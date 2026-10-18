/**
 * Input and output types of the recommendation engine (ADR-029). Locale-free: every
 * value is an identifier, a code, or a number; texts come from the UI catalogs.
 */
import type { Allergen, Cuisine, Equipment } from "../../shared/content.ts";

export type FoodId = string;
export type RecipeId = string;

export interface Bound {
  readonly min: number;
  readonly max: number;
}

/** Per-meal targets (per serving). Only kcal is required. */
export interface Targets {
  readonly kcal: Bound;
  readonly proteinMin?: number;
  readonly fatMax?: number;
  readonly carbohydrate?: Bound;
}

export type Preset = "cut" | "maintain" | "bulk";

export interface Conditions {
  /** Hard. */
  readonly maxMinutes?: number;
  /** Hard: the equipment the user has; recipes needing anything else are excluded. Undefined means no limit. */
  readonly equipment?: readonly Equipment[];
  /** Hard. */
  readonly excludedFoods: readonly FoodId[];
  /** Hard, best effort (ADR-008). */
  readonly excludedAllergens: readonly Allergen[];
  /** Hard: each item is an any-of set; a recipe must contain one food of every item. */
  readonly requiredFoods: readonly (readonly FoodId[])[];
  /** Soft: preferred maximum effort. */
  readonly effort?: 1 | 2 | 3;
  /** Soft. */
  readonly cuisines: readonly Cuisine[];
}

export interface PoolRequest {
  readonly targets: Targets;
  readonly servings: number;
  readonly conditions: Conditions;
}

/** Session state kept in memory by the UI (ADR-015). */
export interface Session {
  readonly shown: readonly RecipeId[];
  /** "Exclude this one". */
  readonly excluded: readonly RecipeId[];
  /** The set on screen. */
  readonly previous: readonly RecipeId[];
  /** Cards kept when one is replaced. */
  readonly keep: readonly RecipeId[];
}

export type InputField = "kcal.min" | "kcal.max" | "proteinMin" | "fatMax" | "carbohydrate.min" | "carbohydrate.max" | "maxMinutes";
export type SessionField = "shown" | "excluded" | "previous" | "keep";

export type InputError =
  | { readonly code: "invalid_number"; readonly field: InputField; readonly value: number }
  | { readonly code: "out_of_range"; readonly field: InputField; readonly value: number; readonly min: number; readonly max: number }
  | { readonly code: "inverted_bound"; readonly field: "kcal" | "carbohydrate"; readonly min: number; readonly max: number }
  | { readonly code: "unknown_food"; readonly field: "excludedFoods" | "requiredFoods"; readonly food: FoodId }
  | { readonly code: "empty_required_item"; readonly index: number }
  /** Every food of a required item is excluded. */
  | { readonly code: "required_and_excluded"; readonly index: number; readonly foods: readonly FoodId[] }
  | { readonly code: "unknown_recipe"; readonly field: SessionField; readonly recipe: RecipeId }
  | { readonly code: "invalid_servings"; readonly servings: number }
  | { readonly code: "invalid_seed"; readonly seed: number };

/**
 * Targets that cannot hold together (ADR-029 D9). `blocking`: no search; `warning`:
 * the search runs and the UI explains. Energies use the general factors (an assumption).
 */
export interface Contradiction {
  readonly code: "minimum_energy_exceeds_kcal_max";
  readonly severity: "blocking" | "warning";
  /** 4 × protein minimum + 4 × carbohydrate minimum. */
  readonly minimumKcal: number;
  /** The same with the tolerance applied (protein −3 g, carbohydrate −10 %). */
  readonly minimumKcalWithTolerance: number;
  readonly kcalMax: number;
}

/** One hard-constraint item a recipe can fail. */
export type ConstraintItem =
  | { readonly constraint: "maxMinutes" }
  | { readonly constraint: "equipment"; readonly equipment: Equipment }
  | { readonly constraint: "allergen"; readonly allergen: Allergen }
  | { readonly constraint: "excludedFood"; readonly food: FoodId }
  | { readonly constraint: "requiredFood"; readonly index: number }
  | { readonly constraint: "sessionExcluded" };

export interface ExclusionCount {
  readonly item: ConstraintItem;
  /** Recipes failing this item (a recipe can fail several). */
  readonly count: number;
  /** Recipes failing this item and nothing else. */
  readonly onlyThis: number;
}

/** State changes forced by excluded foods (ADR-029 D7). */
export interface ForcedState {
  readonly sidesOff: readonly string[];
  readonly substitutions: readonly string[];
}
