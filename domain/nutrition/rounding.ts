/**
 * Display rounding (ADR-025, docs/en/NUTRITION_CALCULATION.md §8). Values stay full
 * precision everywhere else; fit is never evaluated on rounded values. Locale
 * formatting is a UI concern.
 */
import type { Nutrient } from "./data.ts";

/** Display unit per nutrient: kcal to 10, protein, fat, and carbohydrate to 1 g, salt to 0.1 g. */
export const DISPLAY_UNIT: Readonly<Record<Nutrient, number>> = { ENERC_KCAL: 10, "PROT-": 1, "FAT-": 1, "CHOCDF-": 1, NACL_EQ: 0.1 };

const DECIMALS: Readonly<Record<Nutrient, number>> = { ENERC_KCAL: 0, "PROT-": 0, "FAT-": 0, "CHOCDF-": 0, NACL_EQ: 1 };

/**
 * Rounds half up to the display unit. The quotient is first reduced to 12 significant
 * digits so binary noise does not move a value across a half step (1.15 g → 1.2 g).
 */
export function roundForDisplay(nutrient: Nutrient, value: number): number;
export function roundForDisplay(nutrient: Nutrient, value: number | null): number | null;
export function roundForDisplay(nutrient: Nutrient, value: number | null): number | null {
  if (value === null) return null;
  const units = Math.round(Number((value / DISPLAY_UNIT[nutrient]).toPrecision(12)));
  return Number((units * DISPLAY_UNIT[nutrient]).toFixed(DECIMALS[nutrient])) + 0;
}
