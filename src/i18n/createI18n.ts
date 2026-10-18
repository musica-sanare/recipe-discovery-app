import i18next, { type i18n } from "i18next";
import { initReactI18next } from "react-i18next";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "../../shared/locales";
import { DEFAULT_NAMESPACE, resources } from "./resources";

/**
 * Creates an isolated, synchronously initialized i18next instance. UI catalogs
 * are complete in every locale (type-checked), so no runtime fallback is used.
 */
export function createI18n(locale: Locale = DEFAULT_LOCALE): i18n {
  const instance = i18next.createInstance();
  void instance.use(initReactI18next).init({
    resources,
    lng: locale,
    fallbackLng: false,
    supportedLngs: SUPPORTED_LOCALES,
    defaultNS: DEFAULT_NAMESPACE,
    // React already escapes rendered strings.
    interpolation: { escapeValue: false },
    initAsync: false,
  });
  return instance;
}
