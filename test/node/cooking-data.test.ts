import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import * as z from "zod/mini";
import { compositionSubsetSchema, type NutrientId } from "../../shared/composition.ts";
import { cookingDataSchema } from "../../shared/cooking.ts";

const dataDir = path.join(import.meta.dirname, "..", "..", "data", "composition");
const readJson = (name: string): unknown => JSON.parse(readFileSync(path.join(dataDir, name), "utf8"));

const cooking = z.parse(cookingDataSchema, readJson("cooking.json"));
const foods = new Map(z.parse(compositionSubsetSchema, readJson("foods.json")).foods.map((food) => [food.code, food]));

function nutrient(code: string, id: NutrientId): number {
  const value = foods.get(code)?.nutrients[id].value;
  if (value === undefined || value === null) {
    throw new Error(`No ${id} for ${code}`);
  }
  return value;
}

const rateByCode = new Map(cooking.weightChangeRates.map((rate) => [rate.code, rate]));
const COATED = new Set(["tempura", "tonkatsu", "karaage"]);

// Plausibility checks that catch transcription errors in the hand-copied tables
// (docs/en/DATA_SOURCES.md "Cooking tables"). The PDF text-layer check is separate
// (tools/verify-cooking-transcription.ts, macOS only).
describe("transcribed cooking tables", () => {
  it("reference foods present in the composition subset", () => {
    const codes = [
      ...cooking.weightChangeRates.flatMap((rate) => [rate.code, rate.rawCode]),
      ...cooking.fryingFat.map((row) => row.code),
      ...cooking.stirFryFat.map((row) => row.code),
    ];
    expect(codes.filter((code) => !foods.has(code))).toEqual([]);
  });

  it("have one weight change rate per cooked food and a fat row only for rated foods", () => {
    expect(rateByCode.size).toBe(cooking.weightChangeRates.length);
    const fatRows = [...cooking.fryingFat, ...cooking.stirFryFat];
    expect(fatRows.filter((row) => !rateByCode.has(row.code)).map((row) => row.code)).toEqual([]);
  });

  it.each(cooking.weightChangeRates.filter((rate) => !COATED.has(rate.method)).map((rate) => [rate.code, rate] as const))(
    "%s keeps 60-115% of its protein (raw x rate)",
    (_, rate) => {
      const retention = (nutrient(rate.code, "PROT-") * rate.ratePercent) / 100 / nutrient(rate.rawCode, "PROT-");
      expect(retention).toBeGreaterThanOrEqual(0.6);
      expect(retention).toBeLessThanOrEqual(1.15);
    },
  );

  it.each(cooking.weightChangeRates.filter((rate) => rate.coatedBasisPercent !== undefined).map((rate) => [rate.code, rate] as const))(
    "%s has a coated-basis rate below the main-food rate",
    (_, rate) => {
      expect(rate.coatedBasisPercent).toBeLessThan(rate.ratePercent);
    },
  );

  // Table 13 lists 81 g for 11290 while table 12 lists 82 %; both are transcribed as printed.
  const KNOWN_MASS_DIFFERENCES = new Map([["11290", 1]]);

  it.each([...cooking.fryingFat, ...cooking.stirFryFat].map((row) => [row.code, row] as const))(
    "%s cooked mass in table 13/14 matches table 12",
    (code, row) => {
      const difference = Math.abs(row.cookedMass - (rateByCode.get(code)?.ratePercent ?? Number.NaN));
      expect(difference).toBeLessThanOrEqual(KNOWN_MASS_DIFFERENCES.get(code) ?? 0);
    },
  );

  it.each([...cooking.fryingFat, ...cooking.stirFryFat].map((row) => [row.code, row] as const))(
    "%s fat change A agrees with the composition values within 1 g",
    (code, row) => {
      const rawCode = rateByCode.get(code)?.rawCode ?? "";
      const computed = (nutrient(code, "FAT-") * row.cookedMass) / 100 - (nutrient(rawCode, "FAT-") * row.mainMass) / 100;
      expect(Math.abs(computed - row.fatChangeFromMain)).toBeLessThanOrEqual(1);
    },
  );
});
