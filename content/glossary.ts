/**
 * Translation glossary (docs/CONTENT_POLICY.md §6). When a Japanese text uses a
 * term, the English and Spanish texts of the same item must use the listed
 * equivalents; a test enforces this. Longer terms are matched first.
 */
import type { LocalizedText } from "../shared/content.ts";

export const glossary: readonly LocalizedText[] = [
  { ja: "強めの中火", en: "medium-high heat", es: "fuego medio-alto" },
  { ja: "弱めの中火", en: "medium-low heat", es: "fuego medio-bajo" },
  { ja: "中火", en: "medium heat", es: "fuego medio" },
  { ja: "弱火", en: "low heat", es: "fuego bajo" },
  { ja: "余熱", en: "residual heat", es: "calor residual" },
  { ja: "600W", en: "600 W", es: "600 W" },
  { ja: "170℃", en: "170 °C", es: "170 °C" },
];

/**
 * Health, efficacy, and allergen-safety expressions that must not appear in any
 * content (docs/CONTENT_POLICY.md §2 and §4). English and Spanish patterns are
 * matched case-insensitively at word starts.
 */
export const forbiddenExpressions: { readonly ja: readonly string[]; readonly en: readonly string[]; readonly es: readonly string[] } = {
  ja: ["痩せ", "やせる", "脂肪燃焼", "燃焼", "デトックス", "治る", "治す", "予防", "効く", "効果", "免疫", "アレルギー対応", "アレルゲンフリー", "アレルギーの方も安心"],
  en: ["burn fat", "fat-burning", "fat burning", "detox", "cure", "prevent", "boost", "immun", "weight loss", "slimming", "allergen-free", "allergy-safe", "safe for allerg"],
  es: ["quema grasa", "quemagrasa", "adelgaz", "detox", "cura ", "previen", "inmun", "sin alérgenos", "apto para alérgicos", "seguro para alérgicos"],
};
