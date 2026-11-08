/**
 * Geometry of a nutrition bar (ADR-041 D4, docs/en/UI_DESIGN.md §5): where the target band,
 * the estimate range, and the value sit on a track. Inputs are the numbers shown as text
 * next to the bar (displayed values, shown ranges, and the user's targets), so the drawing
 * adds no number of its own. Positions are percentages of the track, rounded to 0.1.
 */
import type { Nutrient } from "../../domain/nutrition/data";
import { roundForDisplay } from "../../domain/nutrition/rounding";
import { displayedValue } from "../format/format";

export interface BarInput {
  /** The displayed value (`displayedValue`). */
  readonly value: number;
  /** The shown estimate range, already rounded for display; absent when it is not shown. */
  readonly range?: { readonly low: number; readonly high: number } | undefined;
  /** The user's target; at least one side is set. */
  readonly target: { readonly min?: number | undefined; readonly max?: number | undefined };
  /** The largest shown number of a comparison row, so that bars side by side share one scale. */
  readonly rowLargest?: number | undefined;
}

export interface BarGeometry {
  /** Start and end of the target band; an open side runs to the edge of the track. */
  readonly band: { readonly from: number; readonly to: number };
  readonly bandEdges: { readonly start: boolean; readonly end: boolean };
  readonly range: { readonly from: number; readonly to: number } | undefined;
  readonly value: number;
}

/** Each nutrient keeps one pastel for its target band; the label, not the color, tells them apart (ADR-037 D1, ADR-041 D2). */
export const TARGET_BAND: Readonly<Record<"kcal" | "protein" | "fat" | "carbohydrate", string>> = {
  kcal: "bg-butter",
  protein: "bg-mint",
  fat: "bg-lilac",
  carbohydrate: "bg-sky",
};

/** Room after the largest number, so that a value at the top of the scale stays inside the track. */
const HEADROOM = 1.25;

function percent(value: number, scale: number): number {
  return Math.round(Math.min(100, Math.max(0, (value / scale) * 100)) * 10) / 10;
}

/**
 * The bar of a shown nutrient, or undefined when there is nothing to draw against: no target,
 * or an unknown value (never drawn as zero).
 */
export function nutrientBar(
  nutrient: Nutrient,
  value: number | null,
  precise: boolean,
  range: { readonly low: number; readonly high: number; readonly shown: boolean } | undefined,
  target: { readonly min?: number; readonly max?: number } | undefined,
  rowLargest?: number,
): BarGeometry | undefined {
  if (value === null || target === undefined || (target.min === undefined && target.max === undefined)) return undefined;
  return barGeometry({
    value: displayedValue(nutrient, value, precise),
    range: range?.shown === true ? { low: roundForDisplay(nutrient, range.low), high: roundForDisplay(nutrient, range.high) } : undefined,
    target,
    rowLargest,
  });
}

/** The largest number one recipe shows for a nutrient: an input of `rowLargest`. An unknown value adds nothing. */
export function shownLargest(nutrient: Nutrient, value: number | null, precise: boolean, range: { readonly high: number; readonly shown: boolean } | undefined): number {
  return Math.max(value === null ? 0 : displayedValue(nutrient, value, precise), range?.shown === true ? roundForDisplay(nutrient, range.high) : 0);
}

export function barGeometry({ value, range, target, rowLargest = 0 }: BarInput): BarGeometry {
  const largest = Math.max(value, range?.high ?? 0, target.max ?? 0, target.min ?? 0, rowLargest);
  const scale = largest > 0 ? largest * HEADROOM : 1;
  const position = (number: number) => percent(number, scale);
  return {
    band: { from: target.min === undefined ? 0 : position(target.min), to: target.max === undefined ? 100 : position(target.max) },
    bandEdges: { start: target.min !== undefined, end: target.max !== undefined },
    range: range === undefined ? undefined : { from: position(range.low), to: position(range.high) },
    value: position(value),
  };
}
