/**
 * Forbidden-expression matching (docs/en/CONTENT_POLICY.md §2, §4), shared by content
 * validation and the UI catalog test. Japanese matches substrings; English matches at
 * word starts; Spanish matches after a non-letter, both case-insensitively.
 */
import type { Locale } from "./locales.ts";

export function forbiddenIn(locale: Locale, text: string, expressions: readonly string[]): string[] {
  switch (locale) {
    case "ja":
      return expressions.filter((word) => text.includes(word));
    case "en":
      return expressions.filter((word) => new RegExp(`\\b${word}`, "i").test(text));
    case "es":
      return expressions.filter((word) => new RegExp(`(^|[^\\p{L}])${word}`, "iu").test(text));
  }
}
