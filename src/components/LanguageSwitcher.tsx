import { useId } from "react";
import { useTranslation } from "react-i18next";
import { isLocale, SUPPORTED_LOCALES, type Locale } from "../../shared/locales";
import type { LocaleSwitch } from "../i18n/useLocaleSwitch";

/** The language choice; `useLocaleSwitch` loads the new locale before the UI switches to it. */
export function LanguageSwitcher({ state, onSelect }: { readonly state: LocaleSwitch; readonly onSelect: (locale: Locale) => void }) {
  const { t, i18n } = useTranslation();
  const id = useId();
  const loading = state.status === "loading";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor={id}>{t("language.label")}</label>
      <select
        id={id}
        className="rounded border border-border bg-surface px-2 py-1 text-text"
        value={loading ? state.locale : i18n.resolvedLanguage}
        aria-busy={loading}
        onChange={(event) => {
          const locale = event.target.value;
          if (isLocale(locale)) onSelect(locale);
        }}
      >
        {SUPPORTED_LOCALES.map((locale) => (
          // Each language name is shown in its own language, so it carries its own `lang`.
          <option key={locale} value={locale} lang={locale}>
            {t(`language.names.${locale}`)}
          </option>
        ))}
      </select>
      {loading && (
        <span role="status" className="text-sm text-muted">
          {t("language.loading")}
        </span>
      )}
    </div>
  );
}
