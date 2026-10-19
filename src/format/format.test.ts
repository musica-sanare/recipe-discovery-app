import { describe, expect, it } from "vitest";
import { roundForDisplay } from "../../domain/nutrition/rounding";
import {
  boundaryNote,
  formatDifference,
  formatGap,
  formatNumber,
  formatNutrient,
  formatNutrientRange,
  formatPercent,
  formatPrecise,
  formatQuantity,
  householdPluralCount,
  quantityParts,
} from "./format";

describe("formatNutrient", () => {
  it.each([
    ["ja", "ENERC_KCAL", 1034.4, "1,030"],
    ["en", "ENERC_KCAL", 1034.4, "1,030"],
    ["es", "ENERC_KCAL", 1034.4, "1030"],
    ["ja", "PROT-", 43.915, "44"],
    ["es", "FAT-", 7.4999, "7"],
    ["ja", "NACL_EQ", 1.15, "1.2"],
    ["en", "NACL_EQ", 1.15, "1.2"],
    ["es", "NACL_EQ", 1.15, "1,2"],
    ["es", "NACL_EQ", 2, "2,0"],
  ] as const)("%s %s %s → %s", (locale, nutrient, value, expected) => {
    expect(formatNutrient(locale, nutrient, value)).toBe(expected);
  });

  it("formats the value of roundForDisplay, not its own rounding", () => {
    for (const value of [0.5, 1.5, 2.5, 34.5, 44.999999999999]) {
      expect(formatNutrient("en", "PROT-", value)).toBe(String(roundForDisplay("PROT-", value)));
    }
  });

  it("keeps unknown values unknown instead of zero", () => {
    expect(formatNutrient("ja", "FAT-", null)).toBeNull();
  });

  it("does not depend on anything but the locale for separators", () => {
    const values = ["ja", "en", "es"].map((locale) => formatNutrient(locale as "ja", "NACL_EQ", 3.25)?.replace(",", "."));
    expect(new Set(values)).toEqual(new Set(["3.3"]));
  });
});

describe("formatNutrientRange", () => {
  it.each([
    ["ja", "500～540"],
    ["en", "500–540"],
    ["es", "500-540"],
  ] as const)("%s uses its range format", (locale, expected) => {
    expect(formatNutrientRange(locale, "ENERC_KCAL", 498, 543)).toBe(expected);
  });

  it("collapses a range whose ends round to the same value", () => {
    expect(formatNutrientRange("en", "PROT-", 40.2, 40.4)).toBe("40");
  });
});

describe("formatGap", () => {
  it("rounds gaps like values", () => {
    expect(formatGap("en", "FAT-", 4.4)).toBe("4");
    expect(formatGap("es", "ENERC_KCAL", 46)).toBe("50");
  });

  it("never shows a non-zero gap as zero", () => {
    expect(formatGap("en", "PROT-", 0.4)).toBe("0.4");
    expect(formatGap("es", "PROT-", 0.4)).toBe("0,4");
    expect(formatGap("ja", "ENERC_KCAL", 3)).toBe("3");
  });
});

describe("formatDifference", () => {
  it("is the difference of the displayed values, with a sign (ADR-030 D8)", () => {
    // 35.4 → 44.6 displays 35 → 45, so the difference reads +10, not +9.
    expect(formatDifference("en", "PROT-", 35.4, 44.6)).toBe("+10");
    expect(formatDifference("ja", "ENERC_KCAL", 512, 448)).toBe("-60");
    expect(formatDifference("es", "NACL_EQ", 1.1, 1.2)).toBe("+0,1");
    expect(formatDifference("en", "FAT-", 8.2, 7.9)).toBe("0");
  });

  it("is unknown when either value is unknown", () => {
    expect(formatDifference("en", "FAT-", null, 8)).toBeNull();
  });
});

describe("boundary notes", () => {
  it("flags values that round onto a bound they miss", () => {
    expect(boundaryNote("PROT-", 34.6, { side: "min", value: 35 })).toBe("justBelow");
    expect(boundaryNote("FAT-", 15.4, { side: "max", value: 15 })).toBe("justAbove");
    expect(boundaryNote("PROT-", 35, { side: "min", value: 35 })).toBeUndefined();
    expect(boundaryNote("PROT-", 34.4, { side: "min", value: 35 })).toBeUndefined();
  });

  it.each([
    ["ja", "34.6"],
    ["en", "34.6"],
    ["es", "34,6"],
  ] as const)("%s shows one more decimal", (locale, expected) => {
    expect(formatPrecise(locale, "PROT-", 34.6)).toBe(expected);
  });
});

describe("household quantities", () => {
  it("splits multiples of 1/12 into reduced fractions", () => {
    expect(quantityParts(1.5)).toEqual({ whole: 1, numerator: 1, denominator: 2 });
    expect(quantityParts(2 / 3)).toEqual({ whole: 0, numerator: 2, denominator: 3 });
    expect(quantityParts(0.75)).toEqual({ whole: 0, numerator: 3, denominator: 4 });
    expect(quantityParts(5)).toEqual({ whole: 5, numerator: 0, denominator: 1 });
  });

  it.each([
    ["ja", 1.5, "1と1/2"],
    ["en", 1.5, "1 1/2"],
    ["es", 1.5, "1 y 1/2"],
    ["ja", 0.25, "1/4"],
    ["es", 2, "2"],
  ] as const)("%s %s → %s", (locale, quantity, expected) => {
    const templates = { ja: (w: string, f: string) => `${w}と${f}`, en: (w: string, f: string) => `${w} ${f}`, es: (w: string, f: string) => `${w} y ${f}` };
    expect(formatQuantity(locale, quantity, templates[locale])).toBe(expected);
  });

  it("uses the singular up to one unit", () => {
    expect([0.5, 1, 1.5, 2].map(householdPluralCount)).toEqual([1, 1, 2, 2]);
  });
});

describe("other numbers", () => {
  it.each([
    ["ja", "25%"],
    ["en", "25%"],
    ["es", "25 %"],
  ] as const)("%s percent", (locale, expected) => {
    expect(formatPercent(locale, 0.25).replace(/\u00a0/g, " ")).toBe(expected);
  });

  it("formats fractional scaled counts with one decimal", () => {
    expect(formatNumber("es", 1.5, 1)).toBe("1,5");
  });
});
