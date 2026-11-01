/**
 * Per-locale UI data (ADR-039): each locale's UI catalog and free-text word list are one
 * chunk, loaded before the first render and before a language switch. App code reaches
 * the word lists only through the i18next instance they were added to, so a locale is
 * never active without both.
 */
import type { i18n } from "i18next";
import type { Lexicon } from "../../shared/freeText/lexicon";
import type { Locale } from "../../shared/locales";
import type { Messages } from "./messages/ja";

export const DEFAULT_NAMESPACE = "translation";

export interface LocaleData {
  readonly messages: Messages;
  readonly lexicon: Lexicon;
}

export type LoadLocaleData = (locale: Locale) => Promise<LocaleData>;

const CHUNKS: Readonly<Record<Locale, () => Promise<LocaleData>>> = {
  ja: () => import("./locales/ja"),
  en: () => import("./locales/en"),
  es: () => import("./locales/es"),
  fr: () => import("./locales/fr"),
};

export const loadLocaleData: LoadLocaleData = (locale) => CHUNKS[locale]();

/**
 * Keyed by the instance's resource store: `useTranslation` returns a copy of the instance
 * whenever the language changes, but every copy shares the store.
 */
const lexicons = new WeakMap<i18n["store"], Partial<Record<Locale, Lexicon>>>();

/** Adds a locale's catalog and word list to `instance`; call before switching to it. */
export function addLocaleData(instance: i18n, locale: Locale, data: LocaleData): void {
  instance.addResourceBundle(locale, DEFAULT_NAMESPACE, data.messages);
  lexicons.set(instance.store, { ...lexicons.get(instance.store), [locale]: data.lexicon });
}

export function hasLocaleData(instance: i18n, locale: Locale): boolean {
  return lexicons.get(instance.store)?.[locale] !== undefined;
}

export function lexiconOf(instance: i18n, locale: Locale): Lexicon {
  const lexicon = lexicons.get(instance.store)?.[locale];
  if (lexicon === undefined) throw new Error(`No word list added for ${locale}`);
  return lexicon;
}
