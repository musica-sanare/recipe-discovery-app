import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import * as z from "zod/mini";
import { forbiddenExpressions, glossary } from "../../content/glossary.ts";
import { foods } from "../../content/foods.ts";
import { recipes } from "../../content/recipes/index.ts";
import { CONTENT_VERSION } from "../../content/version.ts";
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

  it("keeps default amounts on their adjustment grid and only adjusts main ingredients", () => {
    const problems = recipe.ingredients.flatMap(({ key, grams, adjust, measure, role }) => {
      if (!adjust) return [];
      const issues: string[] = [];
      if (role !== "main_protein" && role !== "main_carb") issues.push(`${key}: adjustable role ${role}`);
      if (adjust.min > adjust.max) issues.push(`${key}: min above max`);
      if (adjust.kind === "grams") {
        const steps = (grams - adjust.min) / adjust.step;
        if (grams > adjust.max || steps < 0 || Math.abs(steps - Math.round(steps)) > 1e-9) issues.push(`${key}: ${String(grams)} g off the grid`);
      } else {
        const units = grams / adjust.unitGrams;
        if (!Number.isInteger(units) || units < adjust.min || units > adjust.max) issues.push(`${key}: ${String(grams)} g is not a count in bounds`);
        if (measure && measure.quantity !== units) issues.push(`${key}: measure ${String(measure.quantity)} differs from count ${String(units)}`);
      }
      return issues;
    });
    expect(problems).toEqual([]);
  });

  it("can be adjusted by at least one ingredient or side (ADR-023)", () => {
    expect(recipe.ingredients.some((ingredient) => ingredient.adjust) || recipe.sides.some((side) => side.solverMayRemove)).toBe(true);
  });

  it("links ingredients only to adjustable leaders, one level deep", () => {
    const byKey = new Map(recipe.ingredients.map((ingredient) => [ingredient.key, ingredient]));
    const invalid = recipe.ingredients.filter((ingredient) => {
      if (ingredient.linkedTo === undefined) return false;
      const leader = byKey.get(ingredient.linkedTo);
      return !leader || leader.adjust === undefined || leader.linkedTo !== undefined || ingredient.adjust !== undefined;
    });
    expect(invalid.map((ingredient) => ingredient.key)).toEqual([]);
  });

  it("has unique step, safety note, side, and substitution keys with valid references", () => {
    const ingredientKeys = new Set(recipe.ingredients.map((ingredient) => ingredient.key));
    const stepKeys = recipe.steps.map((step) => step.key);
    const safetyKeys = recipe.safetyNotes.map((note) => note.key);
    const sideKeys = recipe.sides.map((side) => side.key);
    const sideIngredients = recipe.sides.flatMap((side) => side.ingredients);
    for (const keys of [stepKeys, safetyKeys, sideKeys, sideIngredients, recipe.substitutions.map((substitution) => substitution.key)]) {
      expect(new Set(keys).size).toBe(keys.length);
    }
    expect(sideIngredients.filter((key) => !ingredientKeys.has(key))).toEqual([]);
    expect(recipe.steps.filter((step) => step.side !== undefined && !sideKeys.includes(step.side)).map((step) => step.key)).toEqual([]);
    const notes = recipe.steps.flatMap((step) => step.notes ?? []);
    expect(notes.filter((note) => !ingredientKeys.has(note.ingredient))).toEqual([]);
  });

  it("references existing ingredients, foods, steps, and safety notes in substitutions", () => {
    const keys = new Set(recipe.ingredients.map((ingredient) => ingredient.key));
    const stepKeys = new Set(recipe.steps.map((step) => step.key));
    const safetyKeys = new Set(recipe.safetyNotes.map((note) => note.key));
    const invalid = recipe.substitutions.filter(
      (substitution) =>
        !keys.has(substitution.ingredient) ||
        !(substitution.state in (foodById.get(substitution.food)?.composition ?? {})) ||
        (substitution.stepTexts ?? []).some((entry) => !stepKeys.has(entry.step)) ||
        (substitution.safetyNotes?.replace ?? []).some((note) => !safetyKeys.has(note.key)),
    );
    expect(invalid.map((substitution) => substitution.key)).toEqual([]);
  });

  it("names a main protein group used by one of its main protein foods", () => {
    const groups = recipe.ingredients.filter((ingredient) => ingredient.role === "main_protein").map((ingredient) => foodById.get(ingredient.food)?.proteinGroup);
    expect(groups).toContain(recipe.mainProteinGroup);
  });

  it("has at least one food safety note when it handles meat, fish, eggs, or hot oil", () => {
    expect(recipe.safetyNotes.length).toBeGreaterThan(0);
  });
});

describe("content version", () => {
  it("uses the YYYY-MM-DD.n format", () => {
    expect(CONTENT_VERSION).toMatch(/^\d{4}-\d{2}-\d{2}\.[1-9]\d*$/);
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
