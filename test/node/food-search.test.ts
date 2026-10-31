import { describe, expect, it } from "vitest";
import type { Locale } from "../../shared/locales.ts";
import { buildTextBundle } from "../../tools/content/bundle.ts";
import { repositoryBundleInput, repositoryEngine } from "../../tools/content/repository.ts";
import { foodOptions, queryVariants, searchFoods } from "../../src/views/targets/foodSearch.ts";

// Ingredient search on the repository dictionary (ADR-030 D6, open question 21).
const input = repositoryBundleInput();
const { calc } = repositoryEngine(input);
const options = (locale: Locale) => foodOptions(calc, buildTextBundle(input, locale), (group) => group);
const found = (locale: Locale, query: string) => searchFoods(options(locale), locale, query, new Set(), 20).map((option) => option.key);

describe("ingredient search on the repository dictionary", () => {
  it.each([
    ["とうふ", ["tofu_firm", "tofu_silken"]],
    ["ブタロース", ["pork_loin"]],
    ["かたくりこ", ["potato_starch"]],
    ["さとう", ["sugar"]],
  ] as const)("finds foods by their Japanese reading: %s", (query, expected) => {
    expect(found("ja", query)).toEqual(expect.arrayContaining([...expected]));
  });

  it.each([
    ["トーフ", ["tofu_firm", "tofu_silken"]],
    ["ナットー", ["natto"]],
    ["ブロッコリー", ["broccoli"]],
  ] as const)("matches a katakana long-vowel mark against readings: %s", (query, expected) => {
    expect(found("ja", query)).toEqual(expect.arrayContaining([...expected]));
  });

  it("expands a long-vowel mark only in Japanese", () => {
    expect(queryVariants("ja", "トーフ")).toEqual(["とーふ", "とおふ", "とうふ"]);
    expect(queryVariants("ja", "ケーキ")).toEqual(["けーき", "けえき", "けいき"]);
    expect(queryVariants("ja", "ルー")).toEqual(["るー", "るう"]);
    expect(queryVariants("ja", "ー")).toEqual(["ー"]);
    expect(queryVariants("en", "tofu")).toEqual(["tofu"]);
  });

  it("finds regional Spanish terms and English names", () => {
    expect(found("es", "papa")).toContain("potato");
    expect(found("en", "tofu")).toEqual(expect.arrayContaining(["tofu_firm", "tofu_silken"]));
  });

  // Stage 6.3 R4: regional aliases, and no alias that names a different food.
  it.each([
    ["babilla", "beef_round"],
    ["pan de caja", "bread"],
    ["pan lactal", "bread"],
  ] as const)("finds the Spanish regional term %s", (query, food) => {
    expect(found("es", query)).toContain(food);
  });

  it("does not offer shimeji for button mushrooms (champiñones)", () => {
    expect(found("es", "champiñones")).not.toContain("shimeji");
  });

  it("finds every food by its own name in every locale", () => {
    for (const locale of ["ja", "en", "es", "fr"] as const) {
      const text = buildTextBundle(input, locale);
      const missing = calc.foods.filter((food) => !found(locale, text.foods[food.id]?.name ?? "").includes(food.id)).map((food) => food.id);
      expect(missing).toEqual([]);
    }
  });
});
