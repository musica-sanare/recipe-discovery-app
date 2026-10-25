import { describe, expect, it } from "vitest";
import type { Nutrient } from "../nutrition/data.ts";
import type { RecipeNutrition } from "../nutrition/engine.ts";
import { roundForDisplay } from "../nutrition/rounding.ts";
import { compareFits, evaluateFit, type Fit, type NutrientFit, type TargetKey } from "./fit.ts";
import type { Targets } from "./types.ts";

type Nutrition = Pick<RecipeNutrition, "perServing" | "ranges">;
type Input = Partial<Record<Nutrient, number | null | { value: number; low: number; high: number; shown?: boolean }>>;

/** Per-serving values; a range object is shown unless `shown: false`. Missing nutrients are 0 with no shown range. */
function nutrition(input: Input): Nutrition {
  const nutrients: readonly Nutrient[] = ["ENERC_KCAL", "PROT-", "FAT-", "CHOCDF-", "NACL_EQ"];
  const perServing = {} as Record<Nutrient, number | null>;
  const ranges = {} as Record<Nutrient, RecipeNutrition["ranges"][Nutrient]>;
  for (const nutrient of nutrients) {
    const entry = nutrient in input ? input[nutrient] : 0;
    if (entry === undefined) throw new Error(nutrient);
    if (entry === null) {
      perServing[nutrient] = null;
      ranges[nutrient] = null;
    } else if (typeof entry === "number") {
      perServing[nutrient] = entry;
      ranges[nutrient] = { low: entry, high: entry, shown: false };
    } else {
      perServing[nutrient] = entry.value;
      ranges[nutrient] = { low: entry.low, high: entry.high, shown: entry.shown ?? true };
    }
  }
  return { perServing, ranges };
}

const kcalOnly: Targets = { kcal: { min: 450, max: 650 } };
const cut: Targets = { kcal: { min: 450, max: 650 }, proteinMin: 35, fatMax: 15 };

const entry = (fit: Fit, target: TargetKey): NutrientFit => {
  const found = fit.nutrients.find((candidate) => candidate.target === target);
  if (!found) throw new Error(target);
  return found;
};
const kcalStatus = (value: number | { value: number; low: number; high: number; shown?: boolean }) => entry(evaluateFit(nutrition({ ENERC_KCAL: value }), kcalOnly), "kcal");

describe("point values (no range shown)", () => {
  it("is met exactly on both bounds and inside", () => {
    for (const value of [450, 500, 650]) expect(kcalStatus(value)).toMatchObject({ status: "met", position: "inside", basis: "point", gap: 0, gapRatio: 0 });
  });

  it("is near inside the tolerance, including its limits", () => {
    expect(kcalStatus(449.99)).toMatchObject({ status: "near", position: "below_min" });
    expect(kcalStatus(405)).toMatchObject({ status: "near", gap: 45, gapRatio: 1 });
    expect(kcalStatus(715)).toMatchObject({ status: "near", position: "above_max", gap: 65 });
    expect(kcalStatus(715).gapRatio).toBeCloseTo(1, 12);
  });

  it("is not met outside the tolerance", () => {
    expect(kcalStatus(404.99).status).toBe("not_met");
    expect(kcalStatus(715.01).status).toBe("not_met");
  });

  it("applies the protein shortfall of 3 g and the fat tolerance of 10 %", () => {
    const fit = (protein: number, fat: number) => evaluateFit(nutrition({ ENERC_KCAL: 500, "PROT-": protein, "FAT-": fat }), cut);
    expect(entry(fit(35, 15), "protein").status).toBe("met");
    expect(entry(fit(32, 16.5), "protein")).toMatchObject({ status: "near", gap: 3, gapRatio: 1 });
    expect(entry(fit(32, 16.5), "fat")).toMatchObject({ status: "near", position: "above_max" });
    expect(entry(fit(31.99, 16.51), "protein").status).toBe("not_met");
    expect(entry(fit(31.99, 16.51), "fat").status).toBe("not_met");
    // Open sides never fail: very high protein and zero fat are inside.
    expect(entry(fit(200, 0), "protein").status).toBe("met");
    expect(entry(fit(200, 0), "fat").status).toBe("met");
  });

  it("uses the full-precision value, not the rounded display value", () => {
    // 34.6 g is displayed as 35 g but misses a 35 g minimum (docs/en/NUTRITION_CALCULATION.md §8).
    expect(roundForDisplay("PROT-", 34.6)).toBe(35);
    const fit = evaluateFit(nutrition({ ENERC_KCAL: 500, "PROT-": 34.6, "FAT-": 10 }), cut);
    expect(entry(fit, "protein")).toMatchObject({ status: "near", value: 34.6 });
    expect(entry(fit, "protein").gap).toBeCloseTo(0.4, 12);
    // 645 kcal is displayed as 650 kcal and is met; 654 kcal is displayed as 650 kcal and is near.
    expect(kcalStatus(654).status).toBe("near");
  });

  it("evaluates a range that is not shown as its point value", () => {
    expect(kcalStatus({ value: 640, low: 630, high: 655, shown: false })).toMatchObject({ status: "met", basis: "point", position: "inside" });
  });
});

describe("shown ranges (ADR-029 D1)", () => {
  it("is met only when the whole range is inside, bounds included", () => {
    expect(kcalStatus({ value: 550, low: 450, high: 650 })).toMatchObject({ status: "met", basis: "range", position: "inside" });
  });

  it("is near when the range touches or straddles a bound, even with the point inside", () => {
    expect(kcalStatus({ value: 600, low: 560, high: 660 })).toMatchObject({ status: "near", position: "straddles_max", gap: 0, gapRatio: 0 });
    expect(kcalStatus({ value: 460, low: 440, high: 470 })).toMatchObject({ status: "near", position: "straddles_min", gap: 0 });
    expect(kcalStatus({ value: 430, low: 420, high: 450 })).toMatchObject({ status: "near", position: "straddles_min", gap: 20 });
    expect(kcalStatus({ value: 550, low: 400, high: 700 })).toMatchObject({ status: "near", position: "straddles_both" });
  });

  it("is near when only part of the range reaches the tolerance zone", () => {
    // Point 390 kcal is outside the tolerance (405), but the range reaches it.
    expect(kcalStatus({ value: 390, low: 380, high: 405 })).toMatchObject({ status: "near", position: "below_min", gap: 60 });
    expect(kcalStatus({ value: 730, low: 715, high: 760 })).toMatchObject({ status: "near", position: "above_max" });
  });

  it("is not met when the whole range is beyond the tolerance zone", () => {
    expect(kcalStatus({ value: 390, low: 380, high: 404.99 })).toMatchObject({ status: "not_met", position: "below_min" });
    expect(kcalStatus({ value: 800, low: 715.01, high: 900 })).toMatchObject({ status: "not_met", position: "above_max" });
  });

  it("makes a fried dish with a wide fat range near instead of met (D10)", () => {
    // Fat point 14 g under a 15 g maximum, range 10–18 g.
    const fit = evaluateFit(nutrition({ ENERC_KCAL: 600, "PROT-": 40, "FAT-": { value: 14, low: 10, high: 18 } }), cut);
    expect(entry(fit, "fat")).toMatchObject({ status: "near", basis: "range", position: "straddles_max", gap: 0 });
    expect(fit.tier).toBe("near");
  });
});

describe("unknown values (ADR-029 D2)", () => {
  it("gives the status unknown and the not-met tier", () => {
    const fit = evaluateFit(nutrition({ ENERC_KCAL: 500, "PROT-": 40, "FAT-": null }), cut);
    expect(entry(fit, "fat")).toEqual({ target: "fat", status: "unknown", basis: "point", position: "unknown", value: null, gap: null, gapRatio: null });
    expect(fit).toMatchObject({ tier: "not_met", nearCount: 0, notMetCount: 1, gapScore: 0 });
  });

  it("ignores an unknown nutrient that is not a target", () => {
    const fit = evaluateFit(nutrition({ ENERC_KCAL: 500, "CHOCDF-": null }), kcalOnly);
    expect(fit.tier).toBe("met");
    expect(fit.nutrients.map((nutrient) => nutrient.target)).toEqual(["kcal"]);
  });
});

describe("overall tier (ADR-029 D3)", () => {
  it("lists kcal and only the set targets, in a fixed order", () => {
    const targets: Targets = { ...cut, carbohydrate: { min: 40, max: 80 } };
    const fit = evaluateFit(nutrition({ ENERC_KCAL: 500, "PROT-": 40, "FAT-": 10, "CHOCDF-": 60 }), targets);
    expect(fit.nutrients.map((nutrient) => nutrient.target)).toEqual(["kcal", "protein", "fat", "carbohydrate"]);
    expect(fit.tier).toBe("met");
  });

  it("takes the worst status and counts near and not-met nutrients", () => {
    const targets: Targets = { ...cut, carbohydrate: { min: 40, max: 80 } };
    const fit = evaluateFit(nutrition({ ENERC_KCAL: 700, "PROT-": 33.5, "FAT-": 10, "CHOCDF-": 100 }), targets);
    expect(fit.nutrients.map((nutrient) => nutrient.status)).toEqual(["near", "near", "met", "not_met"]);
    expect(fit).toMatchObject({ tier: "not_met", nearCount: 2, notMetCount: 1 });
    // Gap ratios: kcal 50 / 65, protein 1.5 / 3, carbohydrate 20 / 8.
    expect(fit.gapScore).toBeCloseTo(50 / 65 + 0.5 + 2.5, 12);
  });

  it("treats a zero-width tolerance as infinitely far", () => {
    const fit = evaluateFit(nutrition({ ENERC_KCAL: 500, "FAT-": 1 }), { kcal: kcalOnly.kcal, fatMax: 0 });
    expect(entry(fit, "fat")).toMatchObject({ status: "not_met", gapRatio: Number.POSITIVE_INFINITY });
    expect(entry(evaluateFit(nutrition({ ENERC_KCAL: 500, "FAT-": 0 }), { kcal: kcalOnly.kcal, fatMax: 0 }), "fat").status).toBe("met");
  });
});

describe("compareFits", () => {
  const fit = (input: Input) => evaluateFit(nutrition({ ENERC_KCAL: 500, "PROT-": 40, "FAT-": 10, ...input }), cut);

  it("orders by tier", () => {
    expect(compareFits(fit({}), fit({ "FAT-": 16 }))).toBeLessThan(0);
    expect(compareFits(fit({ "FAT-": 16 }), fit({ "FAT-": 20 }))).toBeLessThan(0);
    expect(compareFits(fit({}), fit({ ENERC_KCAL: 600 }))).toBe(0);
  });

  it("orders near fits by the number of near nutrients, then by the gap score", () => {
    expect(compareFits(fit({ "FAT-": 16.4 }), fit({ "FAT-": 15.1, "PROT-": 34.9 }))).toBeLessThan(0);
    expect(compareFits(fit({ "FAT-": 15.5 }), fit({ "PROT-": 33 }))).toBeLessThan(0);
    expect(compareFits(fit({ "PROT-": 33 }), fit({ "FAT-": 15.5 }))).toBeGreaterThan(0);
  });

  it("orders not-met fits by the number of not-met nutrients, then by the gap score", () => {
    expect(compareFits(fit({ "FAT-": 30, "PROT-": 33 }), fit({ "FAT-": 17, "PROT-": 20 }))).toBeLessThan(0);
    expect(compareFits(fit({ "FAT-": 17 }), fit({ "FAT-": 30 }))).toBeLessThan(0);
  });

  it("does not depend on anything but the fits", () => {
    expect(compareFits(fit({ "FAT-": 17 }), fit({ "FAT-": 17 }))).toBe(0);
  });
});
