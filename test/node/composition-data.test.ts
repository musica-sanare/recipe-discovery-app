import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import * as z from "zod/mini";
import { compositionSubsetSchema } from "../../shared/composition.ts";

const dataDir = path.join(import.meta.dirname, "..", "..", "data", "composition");
const readJson = (name: string): unknown => JSON.parse(readFileSync(path.join(dataDir, name), "utf8"));

// Checks the tracked subset without the original workbook (docs/en/DATA_SOURCES.md).
describe("tracked composition subset", () => {
  const subset = z.parse(compositionSubsetSchema, readJson("foods.json"));
  const manifest = readJson("manifest.json") as { source: unknown; requestedCodes: string[] };

  it("matches the manifest source and requested codes", () => {
    expect(subset.source).toEqual(manifest.source);
    expect(subset.foods.map((food) => food.code)).toEqual([...manifest.requestedCodes].sort());
  });

  it("has energy, protein, and fat for every food", () => {
    const missing = subset.foods.filter((food) =>
      (["ENERC_KCAL", "PROT-", "FAT-"] as const).some((id) => food.nutrients[id].notation === "unmeasured"),
    );
    expect(missing.map((food) => food.code)).toEqual([]);
  });
});
