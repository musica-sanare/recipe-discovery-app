/**
 * The repository's content and tracked composition data as bundle input, and the
 * nutrition engine input built from the in-memory calculation bundle, so tools and
 * tests calculate from exactly what the browser receives (ADR-028 decision E).
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import * as z from "zod/mini";
import { foods } from "../../content/foods.ts";
import { recipes } from "../../content/recipes/index.ts";
import { CONTENT_VERSION } from "../../content/version.ts";
import { engineDataFromBundle, type EngineData } from "../../domain/nutrition/data.ts";
import { calcBundleSchema, type CalcBundle } from "../../shared/bundle.ts";
import { compositionSubsetSchema } from "../../shared/composition.ts";
import { cookingDataSchema } from "../../shared/cooking.ts";
import { buildCalcBundle, type BundleInput } from "./bundle.ts";

const dataDir = path.join(import.meta.dirname, "..", "..", "data", "composition");
const readJson = (name: string): unknown => JSON.parse(readFileSync(path.join(dataDir, name), "utf8"));

export function repositoryBundleInput(): BundleInput {
  return {
    foods,
    recipes,
    composition: z.parse(compositionSubsetSchema, readJson("foods.json")),
    cooking: z.parse(cookingDataSchema, readJson("cooking.json")),
    contentVersion: CONTENT_VERSION,
  };
}

export interface RepositoryEngine {
  readonly calc: CalcBundle;
  readonly data: EngineData;
}

export function repositoryEngine(input: BundleInput = repositoryBundleInput()): RepositoryEngine {
  const calc = z.parse(calcBundleSchema, buildCalcBundle(input));
  return { calc, data: engineDataFromBundle(calc) };
}
