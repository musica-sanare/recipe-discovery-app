import { describe, expect, it } from "vitest";
import * as z from "zod/mini";
import { foods } from "../../content/foods.ts";
import { recipes } from "../../content/recipes/index.ts";
import { CONTENT_VERSION } from "../../content/version.ts";
import { calculateRecipe, type NutritionData } from "../../domain/nutrition/calculate.ts";
import { BUNDLE_NUTRIENT_IDS, bundleMismatches, calcBundleSchema, textBundleSchema } from "../../shared/bundle.ts";
import { NUTRIENT_IDS, type CompositionFood } from "../../shared/composition.ts";
import { SUPPORTED_LOCALES } from "../../shared/locales.ts";
import { composition, cooking, nutritionData } from "../../test/node/nutritionData.ts";
import { buildCalcBundle, buildTextBundle, serializeBundle, type BundleInput } from "./bundle.ts";

const input: BundleInput = { foods, recipes, composition, cooking, contentVersion: CONTENT_VERSION };
const calc = z.parse(calcBundleSchema, buildCalcBundle(input));

describe("content bundles", () => {
  it("are deterministic", () => {
    expect(serializeBundle(buildCalcBundle(input))).toBe(serializeBundle(buildCalcBundle(input)));
    for (const locale of SUPPORTED_LOCALES) expect(serializeBundle(buildTextBundle(input, locale))).toBe(serializeBundle(buildTextBundle(input, locale)));
  });

  it("carry the content and composition versions", () => {
    expect(calc).toMatchObject({ contentVersion: CONTENT_VERSION, composition: { workbookUpdated: composition.source.workbookUpdated, workbookSha256: composition.source.sha256 } });
  });

  it("keep texts out of the calculation bundle", () => {
    const json = serializeBundle(calc);
    expect(json).not.toMatch(/[぀-ヿ一-鿿]/u);
    expect(json).not.toMatch(/"(ja|en|es|names|aliases|note|texts|text|label)":/);
  });

  it("have a complete, matching text bundle for every locale", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const text = z.parse(textBundleSchema, buildTextBundle(input, locale));
      expect(text.locale).toBe(locale);
      expect(bundleMismatches(calc, text)).toEqual([]);
    }
  });

  it("detect a text bundle that misses a key or has another version", () => {
    const text = z.parse(textBundleSchema, buildTextBundle(input, "es"));
    const recipe = text.recipes["chicken_lemon_herb_grill"];
    if (recipe) delete recipe.steps["cook"];
    expect(bundleMismatches(calc, { ...text, contentVersion: "2000-01-01.1" })).toEqual([
      "content version 2000-01-01.1 differs from " + CONTENT_VERSION,
      "recipes.chicken_lemon_herb_grill.steps.cook",
    ]);
  });

  it("give the same nutrition as the source data for the displayed nutrients", () => {
    const source = nutritionData();
    const unmeasured = { value: null, notation: "unmeasured" } as const;
    const fromBundle: NutritionData = {
      foods: source.foods,
      composition: new Map(
        calc.compositionFoods.map((food): [string, CompositionFood] => [
          food.code,
          { code: food.code, nameJa: "", refuse: food.refuse, nutrients: Object.fromEntries(NUTRIENT_IDS.map((id) => [id, (food.nutrients as Record<string, CompositionFood["refuse"]>)[id] ?? unmeasured])) as CompositionFood["nutrients"] },
        ]),
      ),
      rates: new Map(calc.rates.map((rate) => [rate.code, { ratePercent: rate.ratePercent, postCookingRefuse: rate.postCookingRefuse ? "yes" : undefined }])),
    };
    for (const recipe of recipes) {
      const expected = calculateRecipe(recipe, source);
      const actual = calculateRecipe(recipe, fromBundle);
      for (const id of BUNDLE_NUTRIENT_IDS) expect(actual.total[id]).toBe(expected.total[id]);
      expect(actual.ingredients.map((ingredient) => ingredient.reasons)).toEqual(expected.ingredients.map((ingredient) => ingredient.reasons));
    }
  });
});
