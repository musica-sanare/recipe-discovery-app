/**
 * Content bundles shipped to the browser (ADR-027). The calculation bundle is
 * locale-neutral: foods, the composition values that are displayed, weight change
 * rates, and recipes without texts. Each locale has a text bundle keyed by the same
 * IDs and keys. The browser validates both with these schemas before use.
 */
import * as z from "zod/mini";
import { compositionValueSchema, type NutrientId } from "./composition.ts";
import { COOKING_METHODS } from "./cooking.ts";
import {
  CUISINES,
  EQUIPMENT,
  GOALS,
  PROTEIN_GROUPS,
  RECIPE_TAGS,
  adjustSchema,
  foodCode,
  foodSchema,
  measureSchema,
  nonBlank,
  recipeIngredientSchema,
  slug,
  FOOD_STATES,
} from "./content.ts";
import { SUPPORTED_LOCALES } from "./locales.ts";

/** Bumped whenever a bundle's shape changes incompatibly. */
export const BUNDLE_SCHEMA_VERSION = 1;

/** Nutrients the app displays (ADR-011); the comparison columns stay in the repository only. */
export const BUNDLE_NUTRIENT_IDS = ["ENERC_KCAL", "PROT-", "FAT-", "CHOCDF-", "NACL_EQ"] as const satisfies readonly NutrientId[];

export const bundleVersionsSchema = z.object({
  schemaVersion: z.literal(BUNDLE_SCHEMA_VERSION),
  contentVersion: z.string().check(z.regex(/^\d{4}-\d{2}-\d{2}\.[1-9]\d*$/)),
  composition: z.object({
    /** Workbook update date as published by MEXT (YYYY-MM-DD). */
    workbookUpdated: z.string().check(z.regex(/^\d{4}-\d{2}-\d{2}$/)),
    workbookSha256: z.string().check(z.regex(/^[0-9a-f]{64}$/)),
    /** SHA-256 of the explanation PDF from which the cooking tables were transcribed. */
    cookingSha256: z.string().check(z.regex(/^[0-9a-f]{64}$/)),
  }),
});
export type BundleVersions = z.infer<typeof bundleVersionsSchema>;

const bundleCompositionSchema = z.object({
  code: foodCode,
  refuse: compositionValueSchema,
  nutrients: z.object({
    ENERC_KCAL: compositionValueSchema,
    "PROT-": compositionValueSchema,
    "FAT-": compositionValueSchema,
    "CHOCDF-": compositionValueSchema,
    NACL_EQ: compositionValueSchema,
  }),
});

const bundleRateSchema = z.object({
  code: foodCode,
  ratePercent: z.number().check(z.positive()),
  /** Parts are removed after cooking (the source names them in Japanese; only the fact is shipped). */
  postCookingRefuse: z.optional(z.literal(true)),
});

const bundleRecipeSchema = z.object({
  id: slug,
  cuisine: z.enum(CUISINES),
  goals: z.array(z.enum(GOALS)),
  mainProteinGroup: z.enum(PROTEIN_GROUPS),
  tags: z.array(z.enum(RECIPE_TAGS)),
  minutes: z.number().check(z.int(), z.positive()),
  effort: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  equipment: z.array(z.enum(EQUIPMENT)),
  servings: z.number().check(z.int(), z.positive()),
  ingredients: z.array(z.omit(recipeIngredientSchema, { note: true })),
  sides: z.array(z.object({ key: slug, ingredients: z.array(slug), solverMayRemove: z.boolean() })),
  steps: z.array(z.object({ key: slug, side: z.optional(slug), notes: z.array(z.object({ ingredient: slug, atLeastGrams: z.number().check(z.positive()) })) })),
  safetyNotes: z.array(slug),
  substitutions: z.array(
    z.object({
      key: slug,
      ingredient: slug,
      food: slug,
      state: z.enum(FOOD_STATES),
      cooking: z.optional(z.enum(COOKING_METHODS)),
      ratio: z.number().check(z.positive()),
      adjust: z.optional(adjustSchema),
      measure: z.optional(measureSchema),
      minutesDelta: z.optional(z.number().check(z.int())),
      stepTexts: z.array(slug),
      safetyNotes: z.object({ replace: z.array(slug), add: z.array(slug) }),
    }),
  ),
});
export type BundleRecipe = z.infer<typeof bundleRecipeSchema>;

export const calcBundleSchema = z.extend(bundleVersionsSchema, {
  foods: z.array(z.pick(foodSchema, { id: true, composition: true, allergens: true, proteinGroup: true })),
  compositionFoods: z.array(bundleCompositionSchema),
  rates: z.array(bundleRateSchema),
  recipes: z.array(bundleRecipeSchema),
});
export type CalcBundle = z.infer<typeof calcBundleSchema>;

const textMap = z.record(slug, nonBlank);

export const textBundleSchema = z.extend(bundleVersionsSchema, {
  locale: z.enum(SUPPORTED_LOCALES),
  foods: z.record(slug, z.object({ name: nonBlank, aliases: z.array(nonBlank), note: z.optional(nonBlank) })),
  recipes: z.record(
    slug,
    z.object({
      name: nonBlank,
      summary: nonBlank,
      ingredientNotes: textMap,
      /** Step notes are in the same order as in the calculation bundle. */
      steps: z.record(slug, z.object({ text: nonBlank, notes: z.array(nonBlank) })),
      safetyNotes: textMap,
      sides: textMap,
      substitutions: z.record(slug, z.object({ note: nonBlank, stepTexts: textMap, safetyNotes: textMap })),
    }),
  ),
});
export type TextBundle = z.infer<typeof textBundleSchema>;

/**
 * Cross-bundle checks the schemas cannot express: matching versions and a text for
 * every ID and key of the calculation bundle. Returns the problems found.
 */
export function bundleMismatches(calc: CalcBundle, text: TextBundle): string[] {
  const problems: string[] = [];
  if (text.contentVersion !== calc.contentVersion) problems.push(`content version ${text.contentVersion} differs from ${calc.contentVersion}`);
  if (text.composition.workbookSha256 !== calc.composition.workbookSha256) problems.push("composition version differs");
  for (const food of calc.foods) if (!(food.id in text.foods)) problems.push(`foods.${food.id}`);
  for (const recipe of calc.recipes) {
    const texts = text.recipes[recipe.id];
    if (!texts) {
      problems.push(`recipes.${recipe.id}`);
      continue;
    }
    const at = (path: string) => `recipes.${recipe.id}.${path}`;
    for (const step of recipe.steps) {
      const stepText = texts.steps[step.key];
      if (!stepText) problems.push(at(`steps.${step.key}`));
      else if (stepText.notes.length !== step.notes.length) problems.push(at(`steps.${step.key}.notes`));
    }
    for (const key of recipe.safetyNotes) if (!(key in texts.safetyNotes)) problems.push(at(`safetyNotes.${key}`));
    for (const side of recipe.sides) if (!(side.key in texts.sides)) problems.push(at(`sides.${side.key}`));
    for (const substitution of recipe.substitutions) {
      const subTexts = texts.substitutions[substitution.key];
      if (!subTexts) {
        problems.push(at(`substitutions.${substitution.key}`));
        continue;
      }
      for (const key of substitution.stepTexts) if (!(key in subTexts.stepTexts)) problems.push(at(`substitutions.${substitution.key}.stepTexts.${key}`));
      for (const key of [...substitution.safetyNotes.replace, ...substitution.safetyNotes.add]) {
        if (!(key in subTexts.safetyNotes)) problems.push(at(`substitutions.${substitution.key}.safetyNotes.${key}`));
      }
    }
  }
  return problems;
}
