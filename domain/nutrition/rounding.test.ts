import { describe, expect, it } from "vitest";
import { DISPLAY_UNIT, roundForDisplay } from "./rounding.ts";

describe("display rounding (ADR-025)", () => {
  it("rounds energy to the nearest 10 kcal", () => {
    expect(roundForDisplay("ENERC_KCAL", 472.689)).toBe(470);
    expect(roundForDisplay("ENERC_KCAL", 444.9)).toBe(440);
    expect(roundForDisplay("ENERC_KCAL", 445)).toBe(450);
    expect(roundForDisplay("ENERC_KCAL", 4.9)).toBe(0);
  });

  it("rounds protein, fat, and carbohydrate to whole grams", () => {
    expect(roundForDisplay("PROT-", 34.6)).toBe(35);
    expect(roundForDisplay("FAT-", 24.5)).toBe(25);
    expect(roundForDisplay("FAT-", 24.49)).toBe(24);
    expect(roundForDisplay("CHOCDF-", 0.4)).toBe(0);
  });

  it("rounds salt to 0.1 g without binary noise", () => {
    expect(roundForDisplay("NACL_EQ", 1.15)).toBe(1.2);
    expect(roundForDisplay("NACL_EQ", 0.05)).toBe(0.1);
    expect(roundForDisplay("NACL_EQ", 0.3 * 3)).toBe(0.9);
    expect(roundForDisplay("NACL_EQ", 2.789)).toBe(2.8);
    expect(roundForDisplay("NACL_EQ", 0.04)).toBe(0);
  });

  it("keeps unknown values unknown", () => {
    expect(roundForDisplay("NACL_EQ", null)).toBeNull();
  });

  it("returns multiples of the display unit", () => {
    for (const value of [0, 0.123, 7.77, 99.95, 512.5, 1033.8]) {
      for (const nutrient of ["ENERC_KCAL", "PROT-", "FAT-", "CHOCDF-", "NACL_EQ"] as const) {
        const rounded = roundForDisplay(nutrient, value);
        const units = rounded / DISPLAY_UNIT[nutrient];
        expect(Math.abs(units - Math.round(units))).toBeLessThan(1e-9);
        expect(Math.abs(rounded - value)).toBeLessThanOrEqual(DISPLAY_UNIT[nutrient] / 2 + 1e-9);
      }
    }
  });
});
