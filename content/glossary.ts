/**
 * Translation glossary (docs/en/CONTENT_POLICY.md §6). When a Japanese text uses a
 * term, the English, Spanish, and French texts of the same item must use the listed
 * equivalents; a test enforces this. Longer terms are matched first.
 */
import type { LocalizedText } from "../shared/content.ts";
import type { Locale } from "../shared/locales.ts";

export const glossary: readonly LocalizedText[] = [
  { ja: "強めの中火", en: "medium-high heat", es: "fuego medio-alto", fr: "feu moyen-vif" },
  { ja: "弱めの中火", en: "medium-low heat", es: "fuego medio-bajo", fr: "feu moyen-doux" },
  { ja: "中火", en: "medium heat", es: "fuego medio", fr: "feu moyen" },
  { ja: "弱火", en: "low heat", es: "fuego bajo", fr: "feu doux" },
  { ja: "余熱", en: "residual heat", es: "calor residual", fr: "chaleur résiduelle" },
  { ja: "600W", en: "600 W", es: "600 W", fr: "600 W" },
  { ja: "170℃", en: "170 °C", es: "170 °C", fr: "170 °C" },
];

/**
 * Health, efficacy, and allergen-safety expressions that must not appear in any
 * content (docs/en/CONTENT_POLICY.md §2 and §4). English, Spanish, and French patterns
 * are matched case-insensitively at word starts.
 */
export const forbiddenExpressions: Readonly<Record<Locale, readonly string[]>> = {
  ja: ["痩せ", "やせる", "脂肪燃焼", "燃焼", "デトックス", "治る", "治す", "予防", "効く", "効果", "免疫", "アレルギー対応", "アレルゲンフリー", "アレルギーの方も安心"],
  en: ["burn fat", "fat-burning", "fat burning", "detox", "cure", "prevent", "boost", "immun", "weight loss", "slimming", "allergen-free", "allergy-safe", "safe for allerg"],
  es: ["quema grasa", "quemagrasa", "adelgaz", "detox", "cura ", "previen", "inmun", "sin alérgenos", "apto para alérgicos", "seguro para alérgicos"],
  fr: ["brûle-graisse", "brûle les graisses", "brûler les graisses", "minceur", "maigrir", "amincissant", "perte de poids", "détox", "detox", "guéri", "prévien", "prévenir", "immunit", "booste", "sans allergène", "convient aux allergiques", "sans danger pour les allergiques"],
};
