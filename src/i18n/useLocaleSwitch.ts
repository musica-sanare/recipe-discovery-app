import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Locale } from "../../shared/locales";
import { addLocaleData, hasLocaleData, type LoadLocaleData } from "./localeData";
import { storeLocale } from "./localePreference";

export type LocaleSwitch = { readonly status: "idle" } | { readonly status: "loading" | "error"; readonly locale: Locale };

/**
 * Switches the UI language (ADR-039 D3, D4): the new locale's chunk (if not yet added) and
 * its content (`prepare`) load in parallel, then the language changes, so the view stays
 * mounted. A failed chunk keeps the current language and leaves an error to retry. Only
 * the latest choice is applied.
 */
export function useLocaleSwitch(prepare: (locale: Locale) => Promise<void>, load: LoadLocaleData) {
  const { i18n } = useTranslation();
  const [state, setState] = useState<LocaleSwitch>({ status: "idle" });
  const latest = useRef<Locale | undefined>(undefined);

  const switchTo = useCallback(
    async (locale: Locale) => {
      latest.current = locale;
      storeLocale(locale);
      setState({ status: "loading", locale });
      try {
        const [data] = await Promise.all([hasLocaleData(i18n, locale) ? undefined : load(locale), prepare(locale)]);
        if (latest.current !== locale) return;
        if (data !== undefined) addLocaleData(i18n, locale, data);
        await i18n.changeLanguage(locale);
        setState({ status: "idle" });
      } catch {
        if (latest.current === locale) setState({ status: "error", locale });
      }
    },
    [i18n, load, prepare],
  );

  const retry = useCallback(() => {
    if (state.status === "error") void switchTo(state.locale);
  }, [state, switchTo]);

  return { state, switchTo, retry };
}
