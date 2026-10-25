/**
 * Locale formatting of engine values (docs/en/UI_DESIGN.md §1, docs/en/NUTRITION_CALCULATION.md §8).
 * Nutrient values are always rounded with `roundForDisplay` first; `Intl` only adds the
 * locale's separators. Statuses never come from these functions.
 */
import type { Nutrient } from "../../domain/nutrition/data";
import { roundForDisplay } from "../../domain/nutrition/rounding";
import type { Locale } from "../../shared/locales";

const DISPLAY_DECIMALS: Readonly<Record<Nutrient, number>> = { ENERC_KCAL: 0, "PROT-": 0, "FAT-": 0, "CHOCDF-": 0, NACL_EQ: 1 };

// Formatters are reused (Phase 9 Stage 9.3, U1): creating one per call took about 2 ms of a
// search at a 4× CPU slowdown. A formatter's output depends only on its locale and options,
// and the keys are few (three locales, a handful of option sets).
const formatters = new Map<string, Intl.NumberFormat>();

function cachedFormat(locale: Locale, options: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = `${locale} ${JSON.stringify(options)}`;
  let format = formatters.get(key);
  if (format === undefined) {
    format = new Intl.NumberFormat(locale, options);
    formatters.set(key, format);
  }
  return format;
}

function numberFormat(locale: Locale, decimals: number, options: Intl.NumberFormatOptions = {}): Intl.NumberFormat {
  return cachedFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals, ...options });
}

/** A plain number with a fixed number of decimals. */
export function formatNumber(locale: Locale, value: number, decimals = 0): string {
  return numberFormat(locale, decimals).format(value);
}

/** The displayed value of a nutrient, or `null` when it is unknown (never zero). */
export function formatNutrient(locale: Locale, nutrient: Nutrient, value: number | null): string | null {
  const rounded = roundForDisplay(nutrient, value);
  return rounded === null ? null : formatNumber(locale, rounded, DISPLAY_DECIMALS[nutrient]);
}

/** A shown range of a nutrient, e.g. "500–540"; a single value when both ends round to the same number. */
export function formatNutrientRange(locale: Locale, nutrient: Nutrient, low: number, high: number): string {
  const [from, to] = [roundForDisplay(nutrient, low), roundForDisplay(nutrient, high)];
  const format = numberFormat(locale, DISPLAY_DECIMALS[nutrient]);
  return from === to ? format.format(from) : format.formatRange(from, to);
}

/**
 * The distance outside a target (engine gaps are positive). A gap that rounds to zero
 * is shown up to one decimal finer, so a recipe that misses a target never reads "0 g".
 */
export function formatGap(locale: Locale, nutrient: Nutrient, gap: number): string {
  const rounded = roundForDisplay(nutrient, Math.abs(gap));
  if (rounded === 0 && gap !== 0) {
    return cachedFormat(locale, { maximumFractionDigits: DISPLAY_DECIMALS[nutrient] + 1 }).format(Math.abs(gap));
  }
  return formatNumber(locale, rounded, DISPLAY_DECIMALS[nutrient]);
}

/**
 * The difference between two states as the difference of their displayed values
 * (ADR-030 D8), with a sign, e.g. "+8"; `null` when either value is unknown.
 */
export function formatDifference(locale: Locale, nutrient: Nutrient, previous: number | null, next: number | null): string | null {
  const difference = displayedDifference(nutrient, previous, next);
  return difference === null ? null : numberFormat(locale, DISPLAY_DECIMALS[nutrient], { signDisplay: "exceptZero" }).format(difference);
}

/** The difference of the displayed values, or `null` when either is unknown. */
export function displayedDifference(nutrient: Nutrient, previous: number | null, next: number | null): number | null {
  const [before, after] = [roundForDisplay(nutrient, previous), roundForDisplay(nutrient, next)];
  if (before === null || after === null) return null;
  return Number((after - before).toFixed(DISPLAY_DECIMALS[nutrient])) + 0;
}

/** An ingredient amount in grams (not a nutrient value): up to one decimal. */
export function formatGrams(locale: Locale, grams: number): string {
  return cachedFormat(locale, { maximumFractionDigits: 1 }).format(grams);
}

export function formatPercent(locale: Locale, ratio: number): string {
  return cachedFormat(locale, { style: "percent", maximumFractionDigits: 0 }).format(ratio);
}

export type BoundaryNote = "justBelow" | "justAbove";

/**
 * When the rounded value looks like it meets a bound that the full value misses
 * (34.6 g shown as 35 g against a 35 g minimum), the UI shows one decimal and this note.
 */
export function boundaryNote(nutrient: Nutrient, value: number, bound: { readonly side: "min" | "max"; readonly value: number }): BoundaryNote | undefined {
  const rounded = roundForDisplay(nutrient, value);
  if (bound.side === "min" && value < bound.value && rounded >= bound.value) return "justBelow";
  if (bound.side === "max" && value > bound.value && rounded <= bound.value) return "justAbove";
  return undefined;
}

/** The value one decimal finer than the display unit, for values with a boundary note. */
export function formatPrecise(locale: Locale, nutrient: Nutrient, value: number): string {
  return formatNumber(locale, value, DISPLAY_DECIMALS[nutrient] + 1);
}

/** Household quantities are multiples of 1/12 (ADR-026). */
export function quantityParts(quantity: number): { readonly whole: number; readonly numerator: number; readonly denominator: number } {
  const twelfths = Math.round(quantity * 12);
  const whole = Math.floor(twelfths / 12);
  const rest = twelfths - whole * 12;
  const divisor = gcd(rest, 12);
  return { whole, numerator: rest / divisor, denominator: 12 / divisor };
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/** "2", "1/2", or a mixed number built by the locale's template, e.g. "1と1/2" or "1 1/2". */
export function formatQuantity(locale: Locale, quantity: number, mixed: (whole: string, fraction: string) => string): string {
  const { whole, numerator, denominator } = quantityParts(quantity);
  const fraction = `${String(numerator)}/${String(denominator)}`;
  if (numerator === 0) return formatNumber(locale, whole);
  if (whole === 0) return fraction;
  return mixed(formatNumber(locale, whole), fraction);
}

/**
 * The count that selects a household unit's plural form: singular up to one unit
 * ("1/2 clove", "1 clove"), plural above ("1 1/2 cloves").
 */
export function householdPluralCount(quantity: number): number {
  return quantity <= 1 ? 1 : 2;
}
