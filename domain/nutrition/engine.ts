/**
 * Nutrition engine (docs/en/NUTRITION_CALCULATION.md §3–§8, ADR-028). Pure, deterministic,
 * and locale-free: the inputs are a recipe, a recipe state, and the engine data.
 * Values keep full precision; rounding is a display concern.
 */
import { BUNDLE_NUTRIENT_IDS } from "../../shared/bundle.ts";
import type { Notation } from "../../shared/composition.ts";
import type { FoodState } from "../../shared/content.ts";
import { FRIED_STATES, isFriedIngredient } from "../../shared/recipe.ts";
import { resolveAmounts, type AmountError, type AmountRecipe, type RecipeState, type ResolvedIngredient, type Result } from "./amounts.ts";
import type { EngineData, EngineRate, Nutrient } from "./data.ts";

export const NUTRIENTS: readonly Nutrient[] = BUNDLE_NUTRIENT_IDS;

export type UncertaintyClass = "exact" | "approximation" | "hard_to_estimate";

export type Reason = "raw_value_for_cooking" | "related_cooked_value" | "post_cooking_refuse" | "fried" | "slow_frying" | "estimated_source_value";

export const REASON_CLASS: Readonly<Record<Reason, UncertaintyClass>> = {
  raw_value_for_cooking: "approximation",
  related_cooked_value: "approximation",
  post_cooking_refuse: "approximation",
  fried: "approximation",
  slow_frying: "hard_to_estimate",
  estimated_source_value: "approximation",
};

const CLASS_ORDER: readonly UncertaintyClass[] = ["exact", "approximation", "hard_to_estimate"];

/** Energy from fat in the fried and slow-frying bands (ADR-028 decision B; an assumption). */
export const KCAL_PER_GRAM_FAT = 9;

/** A range is shown when wider than twice the display unit (ADR-025, ADR-028 decision G). */
export const RANGE_THRESHOLD: Readonly<Record<Nutrient, number>> = { ENERC_KCAL: 20, "PROT-": 2, "FAT-": 2, "CHOCDF-": 2, NACL_EQ: 0.2 };

/** Amount of one nutrient; `null` when a counted source value is unmeasured (never zero). */
export type Amount = number | null;

/** Error band of a contribution in grams or kcal: the value may be `minus` lower or `plus` higher. */
export interface Band {
  readonly minus: number;
  readonly plus: number;
}

export type ContributionReason = "raw_value_for_cooking" | "related_cooked_value" | "post_cooking_refuse";

/**
 * Error bands as fractions of the ingredient's contribution, per reason and nutrient
 * (ADR-028, revised in Stage 6.5; evidence in docs/working/DECISIONS.md "Stage 6.5").
 */
export const CONTRIBUTION_BANDS: Readonly<Record<ContributionReason, Readonly<Record<Nutrient, Band>>>> = {
  raw_value_for_cooking: {
    ENERC_KCAL: { minus: 0.25, plus: 0.05 },
    "PROT-": { minus: 0.15, plus: 0.05 },
    "FAT-": { minus: 0.35, plus: 0.05 },
    "CHOCDF-": { minus: 0.3, plus: 0.1 },
    NACL_EQ: { minus: 0.15, plus: 0.05 },
  },
  related_cooked_value: {
    ENERC_KCAL: { minus: 0.15, plus: 0.15 },
    "PROT-": { minus: 0.1, plus: 0.1 },
    "FAT-": { minus: 0.35, plus: 0.35 },
    "CHOCDF-": { minus: 0.1, plus: 0.1 },
    NACL_EQ: { minus: 0.05, plus: 0.05 },
  },
  post_cooking_refuse: {
    ENERC_KCAL: { minus: 0.05, plus: 0.05 },
    "PROT-": { minus: 0.05, plus: 0.05 },
    "FAT-": { minus: 0.05, plus: 0.05 },
    "CHOCDF-": { minus: 0.05, plus: 0.05 },
    NACL_EQ: { minus: 0.05, plus: 0.05 },
  },
};

export type NotCounted = "included_in" | "side_off";

export interface IngredientNutrition extends ResolvedIngredient {
  readonly code: string;
  readonly ratePercent: number | undefined;
  /** Mass to which the per-100 g values apply: (c4) for cooked states. */
  readonly effectiveGrams: number;
  readonly counted: boolean;
  readonly notCounted: NotCounted | undefined;
  readonly class: UncertaintyClass;
  readonly reasons: readonly Reason[];
  readonly fried: boolean;
  /** Source notations other than plain measured values. */
  readonly notations: Readonly<Partial<Record<Nutrient, Notation>>>;
  readonly amounts: Readonly<Record<Nutrient, Amount>>;
  /** `null` for a nutrient whose band cannot be computed because a value is unmeasured. */
  readonly bands: Readonly<Record<Nutrient, Band | null>>;
}

export interface Range {
  readonly low: number;
  readonly high: number;
  /** Wider than twice the display unit. */
  readonly shown: boolean;
}

export interface RecipeNutrition {
  readonly servings: number;
  readonly ingredients: readonly IngredientNutrition[];
  readonly total: Readonly<Record<Nutrient, Amount>>;
  readonly perServing: Readonly<Record<Nutrient, Amount>>;
  /** Per serving; `null` when the nutrient is unknown. */
  readonly ranges: Readonly<Record<Nutrient, Range | null>>;
  /** Keys of counted ingredients with an unmeasured value, per nutrient. */
  readonly incomplete: Readonly<Record<Nutrient, readonly string[]>>;
  /** Most severe class among counted ingredients. */
  readonly class: UncertaintyClass;
}

/** Margin of the range display threshold against binary noise. */
export const RANGE_EPSILON = 1e-9;

// A plain loop instead of Object.fromEntries: this runs several times per engine call,
// hundreds of times per search (Phase 6 Stage 6.2). Key order stays that of NUTRIENTS.
function record<T>(make: (nutrient: Nutrient) => T): Record<Nutrient, T> {
  const result = {} as Record<Nutrient, T>;
  for (const nutrient of NUTRIENTS) result[nutrient] = make(nutrient);
  return result;
}

function mostSevere(classes: readonly UncertaintyClass[]): UncertaintyClass {
  return classes.reduce<UncertaintyClass>((worst, current) => (CLASS_ORDER.indexOf(current) > CLASS_ORDER.indexOf(worst) ? current : worst), "exact");
}

function lookup<T>(map: ReadonlyMap<string, T>, key: string, what: string): T {
  const value = map.get(key);
  if (value === undefined) throw new Error(`Unknown ${what}: ${key}`);
  return value;
}

/** (c5) Mass to buy, including refuse, for a raw edible mass. */
export function purchaseGrams(edibleGrams: number, refusePercent: number): number {
  if (refusePercent < 0 || refusePercent >= 100) throw new RangeError(`Invalid refuse rate: ${String(refusePercent)}`);
  return (edibleGrams * 100) / (100 - refusePercent);
}

/** (c4) Raw and as-sold states use the stated grams; cooked states multiply by the weight change rate. */
export function effectiveGrams(grams: number, state: FoodState, rate: EngineRate | undefined): number {
  if (state === "raw" || state === "as_is") return grams;
  if (!rate) throw new Error(`Missing weight change rate for state ${state}`);
  return (grams * rate.ratePercent) / 100;
}

function reasonsFor(ingredient: ResolvedIngredient, rate: EngineRate | undefined, notations: Partial<Record<Nutrient, Notation>>): Reason[] {
  const reasons: Reason[] = [];
  if (ingredient.cooking !== undefined) {
    reasons.push(ingredient.state === "raw" || ingredient.state === "as_is" ? "raw_value_for_cooking" : "related_cooked_value");
  }
  if (rate?.postCookingRefuse === true) reasons.push("post_cooking_refuse");
  if (ingredient.estimate === "slow_frying") reasons.push("slow_frying");
  else if (FRIED_STATES.has(ingredient.state) || (ingredient.cooking !== undefined && FRIED_STATES.has(ingredient.cooking))) reasons.push("fried");
  if (Object.values(notations).includes("estimated")) reasons.push("estimated_source_value");
  return reasons;
}

/** Bands of all reasons added up (ADR-028 decision G); `slow_frying` already replaces `fried`. */
function bandsFor(reasons: readonly Reason[], amounts: Readonly<Record<Nutrient, Amount>>): Record<Nutrient, Band | null> {
  const fat = amounts["FAT-"];
  return record((nutrient) => {
    const amount = amounts[nutrient];
    let minus = 0;
    let plus = 0;
    for (const reason of reasons) {
      if (reason === "raw_value_for_cooking" || reason === "related_cooked_value" || reason === "post_cooking_refuse") {
        if (amount === null) return null;
        const band = CONTRIBUTION_BANDS[reason][nutrient];
        minus += amount * band.minus;
        plus += amount * band.plus;
      } else if ((reason === "fried" || reason === "slow_frying") && (nutrient === "FAT-" || nutrient === "ENERC_KCAL")) {
        if (fat === null) return null;
        const fatBand = nutrient === "FAT-" ? fat : fat * KCAL_PER_GRAM_FAT;
        if (reason === "fried") minus += fatBand * 0.3;
        plus += fatBand * (reason === "fried" ? 0.3 : 0.5);
      }
    }
    return { minus, plus };
  });
}

function calculateIngredient(ingredient: ResolvedIngredient, data: EngineData): IngredientNutrition {
  const codes = lookup(data.foods, ingredient.food, "food");
  const code = codes[ingredient.state];
  if (code === undefined) throw new Error(`Food ${ingredient.food} has no state ${ingredient.state}`);
  const composition = lookup(data.composition, code, "food code");
  const rate = ingredient.state === "raw" || ingredient.state === "as_is" ? undefined : data.rates.get(code);
  const grams = effectiveGrams(ingredient.grams, ingredient.state, rate);

  const notations: Partial<Record<Nutrient, Notation>> = {};
  for (const nutrient of NUTRIENTS) {
    const { notation } = composition.nutrients[nutrient];
    if (notation !== "measured") notations[nutrient] = notation;
  }
  const amounts = record((nutrient) => {
    const { value } = composition.nutrients[nutrient];
    return value === null ? null : (value * grams) / 100;
  });
  const reasons = reasonsFor(ingredient, rate, notations);
  let notCounted: NotCounted | undefined;
  if (ingredient.includedIn !== undefined) notCounted = "included_in";
  else if (ingredient.switchedOff) notCounted = "side_off";

  return {
    ...ingredient,
    code,
    ratePercent: rate?.ratePercent,
    effectiveGrams: grams,
    counted: notCounted === undefined,
    notCounted,
    class: mostSevere(reasons.map((reason) => REASON_CLASS[reason])),
    reasons,
    fried: isFriedIngredient(ingredient),
    notations,
    amounts,
    bands: bandsFor(reasons, amounts),
  };
}

/**
 * Calculates a recipe in a state. Unmeasured counted values make the nutrient unknown
 * (`null`) and are listed in `incomplete`. Bands are summed per nutrient; ranges are
 * per serving.
 */
export function calculateNutrition(recipe: AmountRecipe, state: RecipeState, data: EngineData): Result<RecipeNutrition, AmountError> {
  const resolved = resolveAmounts(recipe, state);
  if (!resolved.ok) return resolved;
  const { servings } = resolved.value;
  const ingredients = resolved.value.ingredients.map((ingredient) => {
    try {
      return calculateIngredient(ingredient, data);
    } catch (error) {
      throw new Error(`ingredients.${ingredient.key}: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
    }
  });
  const counted = ingredients.filter((ingredient) => ingredient.counted);

  const incomplete = record((nutrient) => counted.filter((ingredient) => ingredient.amounts[nutrient] === null).map((ingredient) => ingredient.key));
  const total = record((nutrient): Amount => (incomplete[nutrient].length > 0 ? null : counted.reduce((sum, ingredient) => sum + (ingredient.amounts[nutrient] ?? 0), 0)));
  const perServing = record((nutrient): Amount => {
    const value = total[nutrient];
    return value === null ? null : value / servings;
  });
  const ranges = record((nutrient): Range | null => {
    const point = perServing[nutrient];
    const bands = counted.map((ingredient) => ingredient.bands[nutrient]);
    if (point === null || bands.includes(null)) return null;
    const minus = bands.reduce((sum, band) => sum + (band?.minus ?? 0), 0) / servings;
    const plus = bands.reduce((sum, band) => sum + (band?.plus ?? 0), 0) / servings;
    return { low: point - minus, high: point + plus, shown: minus + plus > RANGE_THRESHOLD[nutrient] + RANGE_EPSILON };
  });

  return {
    ok: true,
    value: { servings, ingredients, total, perServing, ranges, incomplete, class: mostSevere(counted.map((ingredient) => ingredient.class)) },
  };
}
