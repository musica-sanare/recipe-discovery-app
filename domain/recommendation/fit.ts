/**
 * Target fit (docs/NUTRITION_CALCULATION.md §9, ADR-025, ADR-029 D1–D3). Statuses use
 * full-precision values: the point value, or the per-serving range when it is shown.
 * Bounds and tolerance limits are inclusive; no epsilon.
 */
import type { Nutrient } from "../nutrition/data.ts";
import type { RecipeNutrition } from "../nutrition/engine.ts";
import type { Targets } from "./types.ts";
import { PROTEIN_SHORTFALL, TOLERANCE } from "./validate.ts";

export type TargetKey = "kcal" | "protein" | "fat" | "carbohydrate";
export type NutrientStatus = "met" | "near" | "not_met" | "unknown";
export type Tier = "met" | "near" | "not_met";
export type Position = "inside" | "below_min" | "above_max" | "straddles_min" | "straddles_max" | "straddles_both" | "unknown";

export const TARGET_NUTRIENT: Readonly<Record<TargetKey, Nutrient>> = { kcal: "ENERC_KCAL", protein: "PROT-", fat: "FAT-", carbohydrate: "CHOCDF-" };

export interface NutrientFit {
  readonly target: TargetKey;
  readonly status: NutrientStatus;
  /** `range` when the range is shown and decided the status. */
  readonly basis: "point" | "range";
  readonly position: Position;
  /** Full-precision point value; `null` when unknown. */
  readonly value: number | null;
  /** Distance of the point value outside the target (0 when inside); `null` when unknown. */
  readonly gap: number | null;
  /** Gap divided by the tolerance width; Infinity for a positive gap on a zero-width tolerance. */
  readonly gapRatio: number | null;
}

export interface Fit {
  readonly tier: Tier;
  readonly nutrients: readonly NutrientFit[];
  readonly nearCount: number;
  /** Not met or unknown. */
  readonly notMetCount: number;
  /** Sum of gap ratios over the nutrients that are not met. */
  readonly gapScore: number;
}

/** A target as an inclusive interval with its tolerance zone; open sides are infinite. */
interface Window {
  readonly target: TargetKey;
  readonly low: number;
  readonly high: number;
  readonly toleranceLow: number;
  readonly toleranceHigh: number;
}

function windows(targets: Targets): Window[] {
  const result: Window[] = [
    { target: "kcal", low: targets.kcal.min, high: targets.kcal.max, toleranceLow: targets.kcal.min * (1 - TOLERANCE), toleranceHigh: targets.kcal.max * (1 + TOLERANCE) },
  ];
  if (targets.proteinMin !== undefined) {
    const min = targets.proteinMin;
    result.push({ target: "protein", low: min, high: Number.POSITIVE_INFINITY, toleranceLow: min - PROTEIN_SHORTFALL, toleranceHigh: Number.POSITIVE_INFINITY });
  }
  if (targets.fatMax !== undefined) {
    const max = targets.fatMax;
    result.push({ target: "fat", low: Number.NEGATIVE_INFINITY, high: max, toleranceLow: Number.NEGATIVE_INFINITY, toleranceHigh: max * (1 + TOLERANCE) });
  }
  if (targets.carbohydrate !== undefined) {
    const { min, max } = targets.carbohydrate;
    result.push({ target: "carbohydrate", low: min, high: max, toleranceLow: min * (1 - TOLERANCE), toleranceHigh: max * (1 + TOLERANCE) });
  }
  return result;
}

function position(low: number, high: number, window: Window): Position {
  if (low >= window.low && high <= window.high) return "inside";
  if (high < window.low) return "below_min";
  if (low > window.high) return "above_max";
  if (low < window.low && high > window.high) return "straddles_both";
  return low < window.low ? "straddles_min" : "straddles_max";
}

function ratio(gap: number, width: number): number {
  if (gap === 0) return 0;
  return width > 0 ? gap / width : Number.POSITIVE_INFINITY;
}

function nutrientFit(window: Window, nutrition: Pick<RecipeNutrition, "perServing" | "ranges">): NutrientFit {
  const nutrient = TARGET_NUTRIENT[window.target];
  const value = nutrition.perServing[nutrient];
  if (value === null) return { target: window.target, status: "unknown", basis: "point", position: "unknown", value: null, gap: null, gapRatio: null };
  const range = nutrition.ranges[nutrient];
  const basis = range?.shown === true ? "range" : "point";
  const [low, high] = range?.shown === true ? [range.low, range.high] : [value, value];
  const where = position(low, high, window);
  const status: NutrientStatus = where === "inside" ? "met" : high < window.toleranceLow || low > window.toleranceHigh ? "not_met" : "near";
  const below = value < window.low ? window.low - value : 0;
  const above = value > window.high ? value - window.high : 0;
  const gapRatio = below > 0 ? ratio(below, window.low - window.toleranceLow) : ratio(above, window.toleranceHigh - window.high);
  return { target: window.target, status, basis, position: where, value, gap: below + above, gapRatio };
}

/** `evaluateFit` for fixed targets, with the windows computed once (the solver scores thousands of states). */
export function fitEvaluator(targets: Targets): (nutrition: Pick<RecipeNutrition, "perServing" | "ranges">) => Fit {
  const targetWindows = windows(targets);
  return (nutrition) => {
    const nutrients = targetWindows.map((window) => nutrientFit(window, nutrition));
    const nearCount = nutrients.filter((entry) => entry.status === "near").length;
    const notMetCount = nutrients.filter((entry) => entry.status === "not_met" || entry.status === "unknown").length;
    const gapScore = nutrients.reduce((sum, entry) => sum + (entry.status === "met" ? 0 : (entry.gapRatio ?? 0)), 0);
    const tier: Tier = notMetCount > 0 ? "not_met" : nearCount > 0 ? "near" : "met";
    return { tier, nutrients, nearCount, notMetCount, gapScore };
  };
}

/** Per-nutrient statuses for the set targets and the overall tier (the worst; unknown counts as not met). */
export function evaluateFit(nutrition: Pick<RecipeNutrition, "perServing" | "ranges">, targets: Targets): Fit {
  return fitEvaluator(targets)(nutrition);
}

const TIER_RANK: Readonly<Record<Tier, number>> = { met: 0, near: 1, not_met: 2 };

/**
 * Order of fits (ADR-029 D3): better tier first; within near, fewer near nutrients,
 * then the smaller gap score; within not met, fewer not-met nutrients, then the
 * smaller gap score. Negative when `a` is better.
 */
export function compareFits(a: Fit, b: Fit): number {
  const tier = TIER_RANK[a.tier] - TIER_RANK[b.tier];
  if (tier !== 0) return tier;
  if (a.tier === "met") return 0;
  const count = a.tier === "near" ? a.nearCount - b.nearCount : a.notMetCount - b.notMetCount;
  if (count !== 0) return count;
  if (a.gapScore === b.gapScore) return 0;
  return a.gapScore < b.gapScore ? -1 : 1;
}
