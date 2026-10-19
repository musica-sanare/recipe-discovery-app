/**
 * Every code the engines and the content schema can emit, as runtime lists. The type
 * helper makes each list fail to compile when a code is added to its union but not
 * here, so src/i18n/engineCodes.test.ts can require a catalog entry for each of them.
 */
import type { Assumption } from "../../domain/nutrition/basis";
import type { Nutrient } from "../../domain/nutrition/data";
import type { Reason, UncertaintyClass } from "../../domain/nutrition/engine";
import type { NutrientStatus, TargetKey, Tier } from "../../domain/recommendation/fit";
import type { ReasonData } from "../../domain/recommendation/reasons";
import type { Relaxation } from "../../domain/recommendation/relax";
import type { Attributes } from "../../domain/recommendation/select";
import type { ConstraintItem, Contradiction, InputError, InputField, Preset } from "../../domain/recommendation/types";
import { BUNDLE_NUTRIENT_IDS } from "../../shared/bundle";
import { ALLERGENS, CUISINES, EQUIPMENT, HOUSEHOLD_UNITS, PROTEIN_GROUPS } from "../../shared/content";
import { METHOD_FAMILIES } from "../../shared/recipe";

/** Returns the list unchanged; fails to type-check unless it holds every member of `T`. */
function all<T extends string>() {
  return <const L extends readonly T[]>(list: L & ([T] extends [L[number]] ? unknown : { readonly missing: Exclude<T, L[number]> })): L => list;
}

export const INPUT_ERROR_CODES = all<InputError["code"]>()([
  "invalid_number",
  "out_of_range",
  "inverted_bound",
  "unknown_food",
  "empty_required_item",
  "required_and_excluded",
  "unknown_recipe",
  "invalid_servings",
  "invalid_seed",
]);
export const INPUT_FIELDS = all<InputField | "kcal" | "carbohydrate">()([
  "kcal.min",
  "kcal.max",
  "kcal",
  "proteinMin",
  "fatMax",
  "carbohydrate.min",
  "carbohydrate.max",
  "carbohydrate",
  "maxMinutes",
]);
export const CONTRADICTION_CODES = all<Contradiction["code"]>()(["minimum_energy_exceeds_kcal_max"]);
export const CONTRADICTION_SEVERITIES = all<Contradiction["severity"]>()(["blocking", "warning"]);
export const NUTRIENT_STATUSES = all<NutrientStatus>()(["met", "near", "not_met", "unknown"]);
export const TIERS = all<Tier>()(["met", "near", "not_met"]);
export const TARGET_KEYS = all<TargetKey>()(["kcal", "protein", "fat", "carbohydrate"]);
export const NUTRIENTS = all<Nutrient>()(BUNDLE_NUTRIENT_IDS);
export const REASON_CODES = all<ReasonData["code"]>()([
  "meets_all_targets",
  "meets_with_adjustment",
  "near_target",
  "misses_target",
  "unknown_value",
  "range_straddles",
  "highest_among_candidates",
  "lowest_among_candidates",
  "new_attribute",
  "matches_cuisine",
  "within_effort",
  "quick",
  "uses_required_foods",
]);
export const ATTRIBUTES = all<keyof Attributes>()(["proteinGroup", "cuisine", "method"]);
export const CONSTRAINTS = all<ConstraintItem["constraint"]>()(["maxMinutes", "equipment", "allergen", "excludedFood", "requiredFood", "sessionExcluded"]);
export const RELAXATIONS = all<Relaxation["constraint"]>()(["maxMinutes", "equipment", "requiredFood", "excludedFood"]);
export const UNCERTAINTY_CLASSES = all<UncertaintyClass>()(["exact", "approximation", "hard_to_estimate"]);
export const UNCERTAINTY_REASONS = all<Reason>()(["raw_value_for_cooking", "related_cooked_value", "post_cooking_refuse", "fried", "slow_frying", "estimated_source_value"]);
export const ASSUMPTION_CODES = all<Assumption["code"]>()([
  "oil_counted_in_full",
  "included_in_cooked_value",
  "parts_removed_after_cooking",
  "energy_from_fat",
  "pinch_as_stated_grams",
]);
export const PRESETS = all<Preset>()(["cut", "maintain", "bulk"]);
export const ALLERGEN_CONFIDENCES = ["contains", "may_contain", "unknown"] as const;
export { ALLERGENS, CUISINES, EQUIPMENT, HOUSEHOLD_UNITS, METHOD_FAMILIES, PROTEIN_GROUPS };
