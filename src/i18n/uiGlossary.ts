/**
 * Terms the UI catalogs must translate consistently (docs/en/CONTENT_POLICY.md §6), in
 * addition to `content/glossary.ts`. When a Japanese message uses a term, the English,
 * Spanish, and French messages of the same key contain the listed stem (case-insensitive);
 * `src/i18n/policy.test.ts` enforces this. Longer terms are matched first.
 */
export interface UiTerm {
  readonly ja: string;
  readonly en: string;
  readonly es: string;
  readonly fr: string;
}

export const uiGlossary: readonly UiTerm[] = [
  { ja: "推定値", en: "estimate", es: "estima", fr: "estim" },
  { ja: "アレルゲン", en: "allergen", es: "alérgeno", fr: "allergène" },
  { ja: "付け合わせ", en: "side", es: "acompañamiento", fr: "accompagnement" },
  { ja: "置き換え", en: "substitut", es: "sustitu", fr: "remplac" },
  { ja: "概算", en: "approximat", es: "aproxima", fr: "approximati" },
  { ja: "使いたい食材", en: "want", es: "quieres", fr: "souhait" },
  { ja: "除きたい食材", en: "leav", es: "evit", fr: "évit" },
  { ja: "目標", en: "target", es: "objetivo", fr: "objectif" },
  { ja: "人数", en: "serving", es: "raci", fr: "portion" },
  { ja: "手間", en: "effort", es: "esfuerzo", fr: "effort" },
  { ja: "設備", en: "equipment", es: "utensilio", fr: "équipement" },
  { ja: "栄養成分表示", en: "nutrition label", es: "etiquetado nutricional", fr: "étiquetage nutritionnel" },
  { ja: "成分表データ", en: "composition data", es: "datos de composición", fr: "données de composition" },
  { ja: "成分表", en: "table", es: "tabla", fr: "table" },
];
