/**
 * Terms the UI catalogs must translate consistently (docs/en/CONTENT_POLICY.md §6), in
 * addition to `content/glossary.ts`. When a Japanese message uses a term, the English and
 * Spanish messages of the same key contain the listed stem (case-insensitive);
 * `src/i18n/policy.test.ts` enforces this. Longer terms are matched first.
 */
export interface UiTerm {
  readonly ja: string;
  readonly en: string;
  readonly es: string;
}

export const uiGlossary: readonly UiTerm[] = [
  { ja: "推定値", en: "estimate", es: "estima" },
  { ja: "アレルゲン", en: "allergen", es: "alérgeno" },
  { ja: "付け合わせ", en: "side", es: "acompañamiento" },
  { ja: "置き換え", en: "substitut", es: "sustitu" },
  { ja: "概算", en: "approximat", es: "aproxima" },
  { ja: "使いたい食材", en: "want", es: "quieres" },
  { ja: "除きたい食材", en: "leav", es: "evit" },
  { ja: "目標", en: "target", es: "objetivo" },
  { ja: "人数", en: "serving", es: "raci" },
  { ja: "手間", en: "effort", es: "esfuerzo" },
  { ja: "設備", en: "equipment", es: "utensilio" },
  { ja: "栄養成分表示", en: "nutrition label", es: "etiquetado nutricional" },
  { ja: "成分表データ", en: "composition data", es: "datos de composición" },
  { ja: "成分表", en: "table", es: "tabla" },
];
