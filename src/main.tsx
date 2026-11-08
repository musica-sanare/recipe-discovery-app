import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import calcUrl from "../generated/content/calc.json?url";
import textEnUrl from "../generated/content/text-en.json?url";
import textEsUrl from "../generated/content/text-es.json?url";
import textFrUrl from "../generated/content/text-fr.json?url";
import textJaUrl from "../generated/content/text-ja.json?url";
import { App } from "./App";
import { BootError } from "./BootError";
import { createI18n } from "./i18n/createI18n";
import { loadLocaleData } from "./i18n/localeData";
import { resolveInitialLocale } from "./i18n/localePreference";
import { applyTheme, readStoredTheme } from "./theme/themePreference";
import "./styles.css";

// `theme-init.js` normally did this before the first paint; if that file failed to load, the
// page and the theme choice still agree from here on (ADR-042).
applyTheme(readStoredTheme(), document.documentElement);

const root = document.getElementById("root");
if (!root) {
  throw new Error("Missing #root element");
}

// Nothing is rendered until the first locale's catalog is loaded, so no other language
// and no message key is shown (ADR-039 D2).
const locale = resolveInitialLocale();
loadLocaleData(locale).then(
  (data) => {
    createRoot(root).render(
      <StrictMode>
        <I18nextProvider i18n={createI18n(locale, data)}>
          <App contentUrls={{ calc: calcUrl, text: { ja: textJaUrl, en: textEnUrl, es: textEsUrl, fr: textFrUrl } }} />
        </I18nextProvider>
      </StrictMode>,
    );
  },
  () => {
    document.documentElement.lang = locale;
    createRoot(root).render(
      <StrictMode>
        <BootError
          locale={locale}
          onRetry={() => {
            window.location.reload();
          }}
        />
      </StrictMode>,
    );
  },
);
