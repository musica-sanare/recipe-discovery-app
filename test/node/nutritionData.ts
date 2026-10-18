/** Loads the tracked composition and content into the calculation's input shape (tests only). */
import { readFileSync } from "node:fs";
import path from "node:path";
import * as z from "zod/mini";
import { foods } from "../../content/foods.ts";
import type { NutritionData } from "../../domain/nutrition/calculate.ts";
import { compositionSubsetSchema } from "../../shared/composition.ts";
import type { Food } from "../../shared/content.ts";
import { cookingDataSchema } from "../../shared/cooking.ts";

const dataDir = path.join(import.meta.dirname, "..", "..", "data", "composition");
const readJson = (name: string): unknown => JSON.parse(readFileSync(path.join(dataDir, name), "utf8"));

export const composition = z.parse(compositionSubsetSchema, readJson("foods.json"));
export const cooking = z.parse(cookingDataSchema, readJson("cooking.json"));

export function nutritionData(foodList: readonly Food[] = foods): NutritionData {
  return {
    foods: new Map(foodList.map((food) => [food.id, food])),
    composition: new Map(composition.foods.map((food) => [food.code, food])),
    rates: new Map(cooking.weightChangeRates.map((rate) => [rate.code, rate])),
  };
}
