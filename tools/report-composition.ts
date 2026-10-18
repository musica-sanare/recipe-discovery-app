/**
 * Prints the composition coverage report for every recipe
 * (tools/content/composition-report.ts). Fails when a recipe uses a cooked state
 * without a weight change rate.
 *
 *   node tools/report-composition.ts
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import * as z from "zod/mini";
import { foods } from "../content/foods.ts";
import { recipes } from "../content/recipes/index.ts";
import type { NutritionData } from "../domain/nutrition/calculate.ts";
import { compositionSubsetSchema } from "../shared/composition.ts";
import { cookingDataSchema } from "../shared/cooking.ts";
import { compositionCoverage, formatCompositionReport } from "./content/composition-report.ts";

const dataDir = path.join(import.meta.dirname, "..", "data", "composition");
const readJson = (name: string): unknown => JSON.parse(readFileSync(path.join(dataDir, name), "utf8"));
const data: NutritionData = {
  foods: new Map(foods.map((food) => [food.id, food])),
  composition: new Map(z.parse(compositionSubsetSchema, readJson("foods.json")).foods.map((food) => [food.code, food])),
  rates: new Map(z.parse(cookingDataSchema, readJson("cooking.json")).weightChangeRates.map((rate) => [rate.code, rate])),
};

try {
  console.log(formatCompositionReport(recipes.map((recipe) => compositionCoverage(recipe, data))));
} catch (error) {
  console.error(`Composition report failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
