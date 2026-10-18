// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "./App";
import { createI18n } from "./i18n/createI18n";
import { LOCALE_STORAGE_KEY } from "./i18n/localePreference";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

function renderApp() {
  render(
    <I18nextProvider i18n={createI18n("ja")}>
      <App />
    </I18nextProvider>,
  );
}

describe("App shell", () => {
  it("renders Japanese by default and sets document metadata", () => {
    renderApp();

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("栄養目標と条件に合う、まだ知らないレシピを見つけよう。");
    expect(document.documentElement.lang).toBe("ja");
    expect(document.title).toContain("Recipe Discovery");
  });

  it.each([
    ["en", "Language"],
    ["es", "Idioma"],
  ] as const)("switches to %s, updates lang, and stores the choice", (locale, label) => {
    renderApp();

    fireEvent.change(screen.getByLabelText("言語"), { target: { value: locale } });

    expect(screen.getByLabelText(label)).toBeDefined();
    expect(document.documentElement.lang).toBe(locale);
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe(locale);
  });
});
