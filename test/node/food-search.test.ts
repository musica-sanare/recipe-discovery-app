import { describe, expect, it } from "vitest";
import { buildTextBundle } from "../../tools/content/bundle.ts";
import { repositoryBundleInput, repositoryEngine } from "../../tools/content/repository.ts";
import { foodOptions, searchFoods } from "../../src/views/targets/foodSearch.ts";

// Ingredient search on the repository dictionary (ADR-030 D6, open question 21).
const input = repositoryBundleInput();
const { calc } = repositoryEngine(input);
const options = (locale: "ja" | "en" | "es") => foodOptions(calc, buildTextBundle(input, locale), (group) => group);
const found = (locale: "ja" | "en" | "es", query: string) => searchFoods(options(locale), locale, query, new Set(), 20).map((option) => option.key);

describe("ingredient search on the repository dictionary", () => {
  it.each([
    ["とうふ", ["tofu_firm", "tofu_silken"]],
    ["ブタロース", ["pork_loin"]],
    ["かたくりこ", ["potato_starch"]],
    ["さとう", ["sugar"]],
  ] as const)("finds foods by their Japanese reading: %s", (query, expected) => {
    expect(found("ja", query)).toEqual(expect.arrayContaining([...expected]));
  });

  it("finds regional Spanish terms and English names", () => {
    expect(found("es", "papa")).toContain("potato");
    expect(found("en", "tofu")).toEqual(expect.arrayContaining(["tofu_firm", "tofu_silken"]));
  });

  it("finds every food by its own name in every locale", () => {
    for (const locale of ["ja", "en", "es"] as const) {
      const text = buildTextBundle(input, locale);
      const missing = calc.foods.filter((food) => !found(locale, text.foods[food.id]?.name ?? "").includes(food.id)).map((food) => food.id);
      expect(missing).toEqual([]);
    }
  });
});
