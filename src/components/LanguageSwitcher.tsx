import { useId } from "react";
import { useTranslation } from "react-i18next";
import { isLocale, SUPPORTED_LOCALES } from "../../shared/locales";
import { storeLocale } from "../i18n/localePreference";

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const id = useId();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id}>{t("language.label")}</label>
      <select
        id={id}
        className="rounded border border-border bg-surface px-2 py-1 text-text"
        value={i18n.resolvedLanguage}
        onChange={(event) => {
          const locale = event.target.value;
          if (isLocale(locale)) {
            storeLocale(locale);
            void i18n.changeLanguage(locale);
          }
        }}
      >
        {SUPPORTED_LOCALES.map((locale) => (
          // Each language name is shown in its own language, so it carries its own `lang`.
          <option key={locale} value={locale} lang={locale}>
            {t(`language.names.${locale}`)}
          </option>
        ))}
      </select>
    </div>
  );
}
