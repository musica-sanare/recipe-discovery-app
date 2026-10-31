import { describe, expect, it } from "vitest";
import { forbiddenExpressions } from "../../content/glossary";
import { forbiddenIn } from "../../shared/policy";
import { SUPPORTED_LOCALES } from "../../shared/locales";
import { resources } from "./resources";
import { glossary } from "../../content/glossary";
import { uiGlossary } from "./uiGlossary";

type Tree = { readonly [key: string]: string | Tree };

function texts(tree: Tree, prefix = ""): [string, string][] {
  return Object.entries(tree).flatMap(([key, value]) => (typeof value === "string" ? [[`${prefix}${key}`, value] as [string, string]] : texts(value, `${prefix}${key}.`)));
}

describe("UI catalogs and the content policy", () => {
  it.each(SUPPORTED_LOCALES)("%s contains no forbidden expressions (docs/en/CONTENT_POLICY.md §2, §4)", (locale) => {
    const found = texts(resources[locale].translation).flatMap(([key, text]) => forbiddenIn(locale, text, forbiddenExpressions[locale]).map((word) => `${key}: ${word}`));
    expect(found).toEqual([]);
  });

  it("detects a forbidden expression in each locale", () => {
    expect(forbiddenIn("ja", "脂肪燃焼をサポート", forbiddenExpressions.ja)).toContain("脂肪燃焼");
    expect(forbiddenIn("en", "Allergen-free and tasty", forbiddenExpressions.en)).toContain("allergen-free");
    expect(forbiddenIn("es", "Receta sin alérgenos", forbiddenExpressions.es)).toContain("sin alérgenos");
    expect(forbiddenIn("fr", "Recette sans allergènes", forbiddenExpressions.fr)).toContain("sans allergène");
    expect(forbiddenIn("fr", "Un plat Détox", forbiddenExpressions.fr)).toContain("détox");
  });

  it("translates glossary terms consistently (docs/en/CONTENT_POLICY.md §6)", () => {
    const translated = SUPPORTED_LOCALES.filter((locale) => locale !== "ja").map((locale) => [locale, new Map(texts(resources[locale].translation))] as const);
    const terms = [...glossary, ...uiGlossary].sort((a, b) => b.ja.length - a.ja.length);
    const problems: string[] = [];
    // The MEXT attribution keeps its Japanese wording in every locale.
    for (const [key, ja] of texts(resources.ja.translation).filter(([key]) => key !== "attribution.source")) {
      let rest = ja;
      for (const term of terms) {
        if (!rest.includes(term.ja)) continue;
        rest = rest.replaceAll(term.ja, "");
        for (const [locale, messages] of translated) {
          if (!(messages.get(key) ?? "").toLowerCase().includes(term[locale].toLowerCase())) problems.push(`${key}.${locale}: "${term.ja}" → "${term[locale]}"`);
        }
      }
    }
    expect(problems).toEqual([]);
  });
});
