/** Loads the repository content and composition codes into the validator's input. */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import * as z from "zod/mini";
import { foods } from "../../content/foods.ts";
import { forbiddenExpressions, glossary } from "../../content/glossary.ts";
import { recipes } from "../../content/recipes/index.ts";
import { CONTENT_VERSION } from "../../content/version.ts";
import { compositionSubsetSchema } from "../../shared/composition.ts";
import { cookingDataSchema } from "../../shared/cooking.ts";
import type { ContentInput } from "./validate.ts";

const root = path.join(import.meta.dirname, "..", "..");
const readJson = (name: string): unknown => JSON.parse(readFileSync(path.join(root, "data", "composition", name), "utf8"));

export async function loadContentInput(): Promise<ContentInput> {
  const recipeDir = path.join(root, "content", "recipes");
  const files = readdirSync(recipeDir)
    .filter((name) => name.endsWith(".ts") && name !== "index.ts")
    .sort();
  const loaded = await Promise.all(
    files.map(async (name) => {
      const module = (await import(pathToFileURL(path.join(recipeDir, name)).href)) as { recipe?: unknown };
      return { file: `content/recipes/${name}`, recipe: module.recipe };
    }),
  );
  const registered = new Set<unknown>(recipes);
  return {
    foods,
    recipes: loaded.filter((entry) => registered.has(entry.recipe)),
    unregisteredFiles: loaded.filter((entry) => !registered.has(entry.recipe)).map((entry) => entry.file),
    glossary,
    forbiddenExpressions,
    compositionCodes: new Set(z.parse(compositionSubsetSchema, readJson("foods.json")).foods.map((food) => food.code)),
    ratedCodes: new Set(z.parse(cookingDataSchema, readJson("cooking.json")).weightChangeRates.map((rate) => rate.code)),
    contentVersion: CONTENT_VERSION,
  };
}
