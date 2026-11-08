import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { applyTheme, isThemeChoice, readStoredTheme, storeTheme, THEME_CHOICES, type ThemeChoice } from "../theme/themePreference";

/** The theme choice (ADR-042). On "system" the page follows the OS through CSS alone, so no listener is needed. */
export function ThemeSwitcher() {
  const { t } = useTranslation();
  const id = useId();
  const [choice, setChoice] = useState<ThemeChoice>(() => readStoredTheme());

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor={id}>{t("theme.label")}</label>
      <select
        id={id}
        className="h-8 rounded border border-border bg-surface px-2 text-text"
        value={choice}
        onChange={(event) => {
          const next = event.target.value;
          if (!isThemeChoice(next)) return;
          setChoice(next);
          applyTheme(next, document.documentElement);
          storeTheme(next);
        }}
      >
        {THEME_CHOICES.map((option) => (
          <option key={option} value={option}>
            {t(`theme.${option}`)}
          </option>
        ))}
      </select>
    </div>
  );
}
