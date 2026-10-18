import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
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
      <App />
    </I18nextProvider>
  </StrictMode>,
);
