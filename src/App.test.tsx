// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";
import { fixtureFetch, fixtureUrls } from "./content/bundleFixtures";
import { createI18n } from "./i18n/createI18n";
import { LOCALE_STORAGE_KEY } from "./i18n/localePreference";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(fixtureFetch));
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
});

function renderApp() {
  render(
    <I18nextProvider i18n={createI18n("ja")}>
      <App contentUrls={fixtureUrls} />
    </I18nextProvider>,
  );
}

describe("App shell", () => {
  it("renders Japanese by default and sets document metadata", async () => {
    renderApp();

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("栄養目標と条件に合う、まだ知らないレシピを見つけよう。");
    expect(document.documentElement.lang).toBe("ja");
    expect(document.title).toContain("Recipe Discovery");
    expect(await screen.findByText("コンテンツ版 2026-10-18.1・成分表データ 2026年3月27日 更新")).toBeDefined();
  });

  it.each([
    ["en", "Language", "Content version 2026-10-18.1 · Composition data updated March 27, 2026"],
    ["es", "Idioma", "Versión del contenido 2026-10-18.1 · Datos de composición actualizados el 27 de marzo de 2026"],
  ] as const)("switches to %s, loads its texts, updates lang, and stores the choice", async (locale, label, versions) => {
    renderApp();
    await screen.findByText(/2026-10-18\.1/);

    fireEvent.change(screen.getByLabelText("言語"), { target: { value: locale } });

    expect(screen.getByLabelText(label)).toBeDefined();
    expect(document.documentElement.lang).toBe(locale);
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe(locale);
    expect(await screen.findByText(versions)).toBeDefined();
    expect(fetch).toHaveBeenCalledWith(fixtureUrls.text[locale]);
  });
});

describe("content loading", () => {
  it("shows a loading status before the content arrives", () => {
    renderApp();
    expect(screen.getByRole("status").textContent).toBe("コンテンツを読み込んでいます…");
  });

  it("shows an error with a retry action when the content is unreachable, and recovers on retry", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError("Failed to fetch"));
    renderApp();

    expect((await screen.findByRole("alert")).textContent).toContain("コンテンツを読み込めませんでした。");
    fireEvent.click(screen.getByRole("button", { name: "再読み込み" }));

    expect(await screen.findByText(/コンテンツ版 2026-10-18\.1/)).toBeDefined();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("shows the error state for an invalid bundle instead of crashing", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(Response.json({ schemaVersion: 99 }));
    renderApp();

    expect(await screen.findByRole("alert")).toBeDefined();
  });
});
