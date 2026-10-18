import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import * as z from "zod/mini";
import { forbiddenExpressions, glossary } from "../../content/glossary.ts";
import { foods } from "../../content/foods.ts";
import { recipes } from "../../content/recipes/index.ts";
import { compositionSubsetSchema } from "../../shared/composition.ts";
import { foodSchema, recipeSchema, type LocalizedText } from "../../shared/content.ts";
import { cookingDataSchema } from "../../shared/cooking.ts";

const dataDir = path.join(import.meta.dirname, "..", "..", "data", "composition");
const readJson = (name: string): unknown => JSON.parse(readFileSync(path.join(dataDir, name), "utf8"));
const compositionCodes = new Set(z.parse(compositionSubsetSchema, readJson("foods.json")).foods.map((food) => food.code));
const ratedCodes = new Set(z.parse(cookingDataSchema, readJson("cooking.json")).weightChangeRates.map((rate) => rate.code));
const foodById = new Map(foods.map((food) => [food.id, food]));

/** Every localized text in an object tree. */
function texts(value: unknown): LocalizedText[] {
  if (Array.isArray(value)) {
    return value.flatMap(texts);
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record["ja"] === "string" && typeof record["en"] === "string" && typeof record["es"] === "string") {
      return [record as unknown as LocalizedText];
    }
    return Object.values(record).flatMap(texts);
  }
  return [];
}

describe("food dictionary", () => {
  it("matches the schema with unique ids", () => {
    for (const food of foods) {
      z.parse(foodSchema, food);
    }
    expect(foodById.size).toBe(foods.length);
  });

  it("references only extracted food codes", () => {
    const missing = foods.flatMap((food) => Object.values(food.composition)).filter((code) => !compositionCodes.has(code));
    expect(missing).toEqual([]);
  });

  it("has a weight change rate for every cooked state", () => {
    const missing = foods.flatMap((food) =>
      Object.entries(food.composition)
        .filter(([state, code]) => state !== "raw" && state !== "as_is" && !ratedCodes.has(code))
        .map(([state]) => `${food.id}.${state}`),
    );
    expect(missing).toEqual([]);
  });
});

describe.each(recipes.map((recipe) => [recipe.id, recipe] as const))("recipe %s", (id, recipe) => {
  it("matches the schema and its file name", () => {
    z.parse(recipeSchema, recipe);
    expect(readFileSync(path.join(import.meta.dirname, "..", "..", "content", "recipes", `${id}.ts`), "utf8")).toContain(`id: "${id}"`);
  });

  it("uses known foods in available states", () => {
    const problems = recipe.ingredients.flatMap((ingredient) => {
      const food = foodById.get(ingredient.food);
      if (!food) return [`${ingredient.key}: unknown food ${ingredient.food}`];
      return ingredient.state in food.composition ? [] : [`${ingredient.key}: ${ingredient.food} has no state ${ingredient.state}`];
    });
    expect(problems).toEqual([]);
  });

  it("only marks a cooking method when the tables have no value for it", () => {
    const avoidable = recipe.ingredients.filter(
      (ingredient) => ingredient.cooking !== undefined && ingredient.cooking in (foodById.get(ingredient.food)?.composition ?? {}),
    );
    expect(avoidable.map((ingredient) => ingredient.key)).toEqual([]);
  });

  it("has unique ingredient keys and valid includedIn references", () => {
    const keys = recipe.ingredients.map((ingredient) => ingredient.key);
    expect(new Set(keys).size).toBe(keys.length);
    const counted = new Set(recipe.ingredients.filter((ingredient) => ingredient.includedIn === undefined).map((ingredient) => ingredient.key));
    const invalid = recipe.ingredients.filter((ingredient) => ingredient.includedIn !== undefined && !counted.has(ingredient.includedIn));
    expect(invalid.map((ingredient) => ingredient.key)).toEqual([]);
  });

  it("keeps default amounts inside their adjustment bounds", () => {
    const outside = recipe.ingredients.filter(
      ({ adjust, grams }) => adjust !== undefined && (adjust.min > grams || grams > adjust.max || adjust.min > adjust.max),
    );
    expect(outside.map((ingredient) => ingredient.key)).toEqual([]);
  });

  it("references existing ingredients and foods in substitutions", () => {
    const keys = new Set(recipe.ingredients.map((ingredient) => ingredient.key));
    const invalid = recipe.substitutions.filter(
      (substitution) => !keys.has(substitution.ingredient) || !(substitution.state in (foodById.get(substitution.food)?.composition ?? {})),
    );
    expect(invalid).toEqual([]);
  });

  it("has at least one food safety note when it handles meat, fish, eggs, or hot oil", () => {
    expect(recipe.safetyNotes.length).toBeGreaterThan(0);
  });
});

describe("content language rules", () => {
  const allTexts = [...texts(foods), ...texts(recipes)];

  it("uses the glossary equivalents in English and Spanish", () => {
    const sorted = [...glossary].sort((a, b) => b.ja.length - a.ja.length);
    const problems: string[] = [];
    for (const text of allTexts) {
      let japanese = text.ja;
      for (const term of sorted) {
        if (!japanese.includes(term.ja)) continue;
        japanese = japanese.replaceAll(term.ja, "");
        if (!text.en.toLowerCase().includes(term.en.toLowerCase())) problems.push(`en missing "${term.en}": ${text.en}`);
        if (!text.es.toLowerCase().includes(term.es.toLowerCase())) problems.push(`es missing "${term.es}": ${text.es}`);
      }
    }
    expect(problems).toEqual([]);
  });

  it("contains no health, efficacy, or allergen-safety claims", () => {
    const found = allTexts.flatMap((text) => [
      ...forbiddenExpressions.ja.filter((word) => text.ja.includes(word)).map((word) => `ja "${word}": ${text.ja}`),
      ...forbiddenExpressions.en.filter((word) => new RegExp(`\\b${word}`, "i").test(text.en)).map((word) => `en "${word}": ${text.en}`),
      ...forbiddenExpressions.es.filter((word) => new RegExp(`(^|[^\\p{L}])${word}`, "iu").test(text.es)).map((word) => `es "${word}": ${text.es}`),
    ]);
    expect(found).toEqual([]);
  });
});
