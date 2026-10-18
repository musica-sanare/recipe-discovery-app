/**
 * Builds the content bundles (ADR-027) from validated content. Pure and
 * deterministic: the same content and data always give byte-identical JSON. The
 * calculation bundle takes no locale; texts go only into the per-locale bundles.
 */
import * as z from "zod/mini";
import { BUNDLE_SCHEMA_VERSION, type BundleVersions, type CalcBundle, type TextBundle } from "../../shared/bundle.ts";
import type { CompositionSubset } from "../../shared/composition.ts";
import type { Food, Recipe } from "../../shared/content.ts";
import type { cookingDataSchema } from "../../shared/cooking.ts";
import type { Locale } from "../../shared/locales.ts";

export interface BundleInput {
  readonly foods: readonly Food[];
  readonly recipes: readonly Recipe[];
  readonly composition: CompositionSubset;
  readonly cooking: z.infer<typeof cookingDataSchema>;
  readonly contentVersion: string;
}

function versions(input: BundleInput): BundleVersions {
  return {
    schemaVersion: BUNDLE_SCHEMA_VERSION,
    contentVersion: input.contentVersion,
    composition: { workbookUpdated: input.composition.source.workbookUpdated, workbookSha256: input.composition.source.sha256, cookingSha256: input.cooking.source.sha256 },
  };
}

/** Copy of `value` without the localized `note` field. */
function withoutNote<T extends { note?: unknown }>(value: T): Omit<T, "note"> {
  return Object.fromEntries(Object.entries(value).filter(([key]) => key !== "note")) as Omit<T, "note">;
}

const byCode = (a: { code: string }, b: { code: string }) => (a.code < b.code ? -1 : a.code > b.code ? 1 : 0);

export function buildCalcBundle(input: BundleInput): CalcBundle {
  const codes = new Set(input.foods.flatMap((food) => Object.values(food.composition)));
  return {
    ...versions(input),
    foods: input.foods.map((food) => ({ id: food.id, composition: food.composition, allergens: food.allergens, ...(food.proteinGroup ? { proteinGroup: food.proteinGroup } : {}) })),
    compositionFoods: input.composition.foods
      .filter((food) => codes.has(food.code))
      .map(({ code, refuse, nutrients }) => ({
        code,
        refuse,
        nutrients: { ENERC_KCAL: nutrients.ENERC_KCAL, "PROT-": nutrients["PROT-"], "FAT-": nutrients["FAT-"], "CHOCDF-": nutrients["CHOCDF-"], NACL_EQ: nutrients.NACL_EQ },
      }))
      .sort(byCode),
    rates: input.cooking.weightChangeRates
      .filter((rate) => codes.has(rate.code))
      .map((rate) => ({ code: rate.code, ratePercent: rate.ratePercent, ...(rate.postCookingRefuse === undefined ? {} : { postCookingRefuse: true as const }) }))
      .sort(byCode),
    recipes: input.recipes.map((recipe) => ({
      id: recipe.id,
      cuisine: recipe.cuisine,
      goals: recipe.goals,
      mainProteinGroup: recipe.mainProteinGroup,
      tags: recipe.tags,
      minutes: recipe.minutes,
      effort: recipe.effort,
      equipment: recipe.equipment,
      servings: recipe.servings,
      ingredients: recipe.ingredients.map(withoutNote),
      sides: recipe.sides.map(({ key, ingredients, solverMayRemove }) => ({ key, ingredients, solverMayRemove })),
      steps: recipe.steps.map((step) => ({
        key: step.key,
        ...(step.side === undefined ? {} : { side: step.side }),
        notes: (step.notes ?? []).map(({ ingredient, atLeastGrams }) => ({ ingredient, atLeastGrams })),
      })),
      safetyNotes: recipe.safetyNotes.map((note) => note.key),
      substitutions: recipe.substitutions.map(({ stepTexts, safetyNotes, ...substitution }) => ({
        ...withoutNote(substitution),
        stepTexts: (stepTexts ?? []).map((entry) => entry.step),
        safetyNotes: { replace: (safetyNotes?.replace ?? []).map((note) => note.key), add: (safetyNotes?.add ?? []).map((note) => note.key) },
      })),
    })),
  };
}

export function buildTextBundle(input: BundleInput, locale: Locale): TextBundle {
  const keyed = <T>(entries: readonly T[], key: (entry: T) => string, text: (entry: T) => string) => Object.fromEntries(entries.map((entry) => [key(entry), text(entry)]));
  return {
    ...versions(input),
    locale,
    foods: Object.fromEntries(
      input.foods.map((food) => [food.id, { name: food.names[locale], aliases: food.aliases[locale], ...(food.note ? { note: food.note[locale] } : {}) }]),
    ),
    recipes: Object.fromEntries(
      input.recipes.map((recipe) => [
        recipe.id,
        {
          name: recipe.texts.name[locale],
          summary: recipe.texts.summary[locale],
          ingredientNotes: Object.fromEntries(recipe.ingredients.flatMap((ingredient) => (ingredient.note ? [[ingredient.key, ingredient.note[locale]]] : []))),
          steps: Object.fromEntries(recipe.steps.map((step) => [step.key, { text: step.text[locale], notes: (step.notes ?? []).map((note) => note.text[locale]) }])),
          safetyNotes: keyed(recipe.safetyNotes, (note) => note.key, (note) => note.text[locale]),
          sides: keyed(recipe.sides, (side) => side.key, (side) => side.label[locale]),
          substitutions: Object.fromEntries(
            recipe.substitutions.map((substitution) => [
              substitution.key,
              {
                note: substitution.note[locale],
                stepTexts: keyed(substitution.stepTexts ?? [], (entry) => entry.step, (entry) => entry.text[locale]),
                safetyNotes: keyed([...(substitution.safetyNotes?.replace ?? []), ...(substitution.safetyNotes?.add ?? [])], (note) => note.key, (note) => note.text[locale]),
              },
            ]),
          ),
        },
      ]),
    ),
  };
}

/** Compact JSON; key order follows construction, so output is deterministic. */
export function serializeBundle(bundle: CalcBundle | TextBundle): string {
  return JSON.stringify(bundle);
}
