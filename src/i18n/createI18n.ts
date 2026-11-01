import i18next, { type i18n } from "i18next";
import { initReactI18next } from "react-i18next";
import { SUPPORTED_LOCALES, type Locale } from "../../shared/locales";
import { addLocaleData, DEFAULT_NAMESPACE, type LocaleData } from "./localeData";

/**
 * Creates an isolated, synchronously initialized i18next instance with one locale's data
 * (ADR-039). UI catalogs are complete in every locale (type-checked), so no runtime
 * fallback is used; other locales are added before switching to them.
 */
export function createI18n(locale: Locale, data: LocaleData): i18n {
  const instance = i18next.createInstance();
  void instance.use(initReactI18next).init({
    resources: { [locale]: { [DEFAULT_NAMESPACE]: data.messages } },
    lng: locale,
    fallbackLng: false,
    supportedLngs: SUPPORTED_LOCALES,
    defaultNS: DEFAULT_NAMESPACE,
    // React already escapes rendered strings.
    interpolation: { escapeValue: false },
    initAsync: false,
  });
  // Registers the word list; the catalog is already in `resources`, so `resolvedLanguage` is set.
  addLocaleData(instance, locale, data);
  return instance;
}
