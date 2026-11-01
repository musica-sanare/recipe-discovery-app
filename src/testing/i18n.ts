import type { i18n } from "i18next";
import { LEXICONS } from "../../shared/freeText/lexicon/index";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "../../shared/locales";
import { createI18n } from "../i18n/createI18n";
import { addLocaleData, type LocaleData } from "../i18n/localeData";
import { resources } from "../i18n/resources";

/** A locale's data from the static catalogs, as its chunk would provide it. */
export function testLocaleData(locale: Locale): LocaleData {
  return { messages: resources[locale].translation, lexicon: LEXICONS[locale] };
}

/**
 * An i18next instance for tests: `locale` is active and, unless `only` is set, every other
 * locale is already added, so a language switch needs no chunk.
 */
export function createTestI18n(locale: Locale = DEFAULT_LOCALE, { only = false }: { readonly only?: boolean } = {}): i18n {
  const instance = createI18n(locale, testLocaleData(locale));
  if (!only) {
    for (const other of SUPPORTED_LOCALES) {
      if (other !== locale) addLocaleData(instance, other, testLocaleData(other));
    }
  }
  return instance;
}
