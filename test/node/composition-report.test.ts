import { describe, expect, it } from "vitest";
import { compositionCoverage, formatCompositionReport } from "../../tools/content/composition-report.ts";
import { repositoryEngine, validationBundleInput } from "../../tools/content/repository.ts";

const { calc, data } = repositoryEngine();
const recipe = (id: string) => {
  const found = calc.recipes.find((entry) => entry.id === id);
  if (!found) throw new Error(id);
  return found;
};
const ingredient = (id: string, key: string) => compositionCoverage(recipe(id), data).ingredients.find((entry) => entry.key === key);
const classes = (id: string) => Object.fromEntries(compositionCoverage(recipe(id), data).ingredients.map((entry) => [entry.key, entry.coverage]));

describe("composition coverage report", () => {
  it("marks a cooked ingredient calculated from its raw value as an approximation with the reason", () => {
    expect(ingredient("boiled_chicken_negi_salt", "chicken")).toMatchObject({ coverage: "approximation", reasons: ["raw_value_for_cooking"], state: "raw", cooking: "boil" });
  });

  it("distinguishes a related cooked value from a raw value", () => {
    expect(ingredient("chicken_thigh_teriyaki", "chicken")).toMatchObject({ coverage: "approximation", reasons: ["related_cooked_value"], state: "grill", cooking: "saute" });
  });

  it("marks slow frying as hard to estimate and fried, and frying oil as not counted", () => {
    expect(classes("tortilla_espanola")).toMatchObject({ potato: "hard_to_estimate", onion: "hard_to_estimate", frying_oil: "not_counted", egg: "exact" });
    expect(ingredient("tortilla_espanola", "potato")).toMatchObject({ fried: true, reasons: ["slow_frying"] });
  });

  it("marks a fried state with a table value as an approximation and fried (ADR-028 G)", () => {
    expect(ingredient("chicken_thigh_karaage", "chicken")).toMatchObject({ coverage: "approximation", reasons: ["fried"], fried: true });
  });

  it("fails naming the recipe and ingredient when a cooked state has no weight change rate", () => {
    const noRates = { ...data, rates: new Map() };
    expect(() => compositionCoverage(recipe("chicken_lemon_herb_grill"), noRates)).toThrow(/^chicken_lemon_herb_grill › ingredients\.chicken: Missing weight change rate/);
  });

  it("covers every recipe deterministically", () => {
    const first = formatCompositionReport(calc.recipes.map((entry) => compositionCoverage(entry, data)));
    expect(formatCompositionReport(calc.recipes.map((entry) => compositionCoverage(entry, data)))).toBe(first);
    // Reviewed totals of Stage 1.3 refer to the validation recipes.
    const validation = repositoryEngine(validationBundleInput());
    expect(formatCompositionReport(validation.calc.recipes.map((entry) => compositionCoverage(entry, validation.data)))).toContain(
      "Total (20 recipes): exact 141, approximation 16, hard to estimate 2, not counted 17, fried 5",
    );
  });
});
