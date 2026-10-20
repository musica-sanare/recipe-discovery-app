import { useTranslation } from "react-i18next";
import { DEFAULT_LOCALE, isLocale, type Locale } from "../../shared/locales";

/** The active UI locale. */
export function useLocale(): Locale {
  const { i18n } = useTranslation();
  return isLocale(i18n.resolvedLanguage) ? i18n.resolvedLanguage : DEFAULT_LOCALE;
}
