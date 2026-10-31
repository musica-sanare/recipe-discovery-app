/**
 * Search normalization per locale (docs/en/ARCHITECTURE.md §4), shared by the ingredient
 * search and the free-text conditions parser.
 */
import type { Locale } from "./locales.ts";

/**
 * `ja`: NFKC, katakana folded to hiragana; `en`: NFKC and case folding; `es`: NFKC, case
 * and accent folding; `fr`: as `es`, and the ligatures œ and æ spelled out. Every locale
 * also folds case and width, which never hurts matching.
 */
export function normalizeForSearch(locale: Locale, text: string): string {
  let result = text.normalize("NFKC").toLowerCase().trim();
  if (locale === "ja") result = result.replace(/[ァ-ヶ]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60));
  if (locale === "es" || locale === "fr") result = result.normalize("NFD").replace(/\p{M}/gu, "").normalize("NFC");
  if (locale === "fr") result = result.replaceAll("œ", "oe").replaceAll("æ", "ae");
  return result;
}
