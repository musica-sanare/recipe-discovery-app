import { describe, expect, it } from "vitest";
import * as z from "zod/mini";
import { CONTENT_VERSION } from "../../content/version.ts";
import { BUNDLE_NUTRIENT_IDS, bundleMismatches, calcBundleSchema, textBundleSchema } from "../../shared/bundle.ts";
import { SUPPORTED_LOCALES } from "../../shared/locales.ts";
import { buildCalcBundle, buildTextBundle, serializeBundle } from "./bundle.ts";
import { repositoryBundleInput } from "./repository.ts";

const input = repositoryBundleInput();
const { composition, cooking } = input;
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

  it("carry the source values of the displayed nutrients, refuse rates, and weight change rates unchanged", () => {
    const sourceFoods = new Map(composition.foods.map((food) => [food.code, food]));
    for (const food of calc.compositionFoods) {
      const source = sourceFoods.get(food.code);
      expect(source, food.code).toBeDefined();
      expect(food.refuse).toEqual(source?.refuse);
      for (const id of BUNDLE_NUTRIENT_IDS) expect(food.nutrients[id], `${food.code} ${id}`).toEqual(source?.nutrients[id]);
    }
    const sourceRates = new Map(cooking.weightChangeRates.map((rate) => [rate.code, rate]));
    for (const rate of calc.rates) {
      const source = sourceRates.get(rate.code);
      expect(rate.ratePercent, rate.code).toBe(source?.ratePercent);
      expect(rate.postCookingRefuse === true, rate.code).toBe(source?.postCookingRefuse !== undefined);
    }
  });

  it("contain the composition and rate of every food state the recipes use", () => {
    const codes = new Set(calc.compositionFoods.map((food) => food.code));
    const rated = new Set(calc.rates.map((rate) => rate.code));
    const foodStates = new Map(calc.foods.map((food) => [food.id, food.composition]));
    for (const recipe of calc.recipes) {
      for (const used of [...recipe.ingredients, ...recipe.substitutions]) {
        const code = foodStates.get(used.food)?.[used.state];
        expect(code, `${recipe.id} ${used.food} ${used.state}`).toBeDefined();
        expect(codes.has(code ?? "")).toBe(true);
        if (used.state !== "raw" && used.state !== "as_is") expect(rated.has(code ?? ""), `${recipe.id} ${used.food} ${used.state}`).toBe(true);
      }
    }
  });
});
