import { describe, expect, it } from "vitest";
import { recipes } from "../../content/recipes/index.ts";
import type { Recipe } from "../../shared/content.ts";
import { compositionCoverage, formatCompositionReport } from "../../tools/content/composition-report.ts";
import { nutritionData } from "./nutritionData.ts";

const data = nutritionData();
const recipe = (id: string): Recipe => {
  const found = recipes.find((entry) => entry.id === id);
  if (!found) throw new Error(id);
  return found;
};
const classes = (id: string) => Object.fromEntries(compositionCoverage(recipe(id), data).ingredients.map((ingredient) => [ingredient.key, ingredient.coverage]));

describe("composition coverage report", () => {
  it("marks a cooked ingredient calculated from its raw value as an approximation with the reason", () => {
    const chicken = compositionCoverage(recipe("boiled_chicken_negi_salt"), data).ingredients.find((ingredient) => ingredient.key === "chicken");
    expect(chicken).toMatchObject({ coverage: "approximation", reasons: ["cooking_not_tabulated"], state: "raw", cooking: "boil" });
  });

  it("marks slow frying as hard to estimate and fried, and frying oil as not counted", () => {
    expect(classes("tortilla_espanola")).toMatchObject({ potato: "hard_to_estimate", onion: "hard_to_estimate", frying_oil: "not_counted", egg: "exact" });
    const potato = compositionCoverage(recipe("tortilla_espanola"), data).ingredients.find((ingredient) => ingredient.key === "potato");
    expect(potato).toMatchObject({ fried: true, reasons: ["slow_frying"] });
  });

  it("marks a fried state with a table value as exact and fried", () => {
    expect(compositionCoverage(recipe("chicken_thigh_karaage"), data).ingredients.find((ingredient) => ingredient.key === "chicken")).toMatchObject({ coverage: "exact", fried: true });
  });

  it("fails naming the recipe and ingredient when a cooked state has no weight change rate", () => {
    const noRates = { ...data, rates: new Map() };
    expect(() => compositionCoverage(recipe("chicken_lemon_herb_grill"), noRates)).toThrow(/^chicken_lemon_herb_grill › ingredients\.chicken: Missing weight change rate/);
  });

  it("covers every recipe deterministically", () => {
    const first = formatCompositionReport(recipes.map((entry) => compositionCoverage(entry, data)));
    expect(formatCompositionReport(recipes.map((entry) => compositionCoverage(entry, data)))).toBe(first);
    expect(first).toContain(`Total (${String(recipes.length)} recipes)`);
  });
});
