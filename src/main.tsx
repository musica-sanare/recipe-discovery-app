import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import calcUrl from "../generated/content/calc.json?url";
import textEnUrl from "../generated/content/text-en.json?url";
import textEsUrl from "../generated/content/text-es.json?url";
import textFrUrl from "../generated/content/text-fr.json?url";
import textJaUrl from "../generated/content/text-ja.json?url";
import { App } from "./App";
import { createI18n } from "./i18n/createI18n";
import { resolveInitialLocale } from "./i18n/localePreference";
import "./styles.css";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Missing #root element");
}

createRoot(root).render(
  <StrictMode>
    <I18nextProvider i18n={createI18n(resolveInitialLocale())}>
      <App contentUrls={{ calc: calcUrl, text: { ja: textJaUrl, en: textEnUrl, es: textEsUrl, fr: textFrUrl } }} />
    </I18nextProvider>
  </StrictMode>,
);
