// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Locale } from "../../shared/locales.ts";
import { App } from "../../src/App.tsx";
import { createI18n } from "../../src/i18n/createI18n.ts";
import { axeViolations } from "../../src/testing/axe.ts";
import { repositoryFetch, repositoryUrls } from "./repositoryContent.ts";

// The about page (Stage 5.3, ADR-030 D2 revised, docs/UI_DESIGN.md §3.6).

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(repositoryFetch));
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) =>
    setTimeout(() => {
      callback(0);
    }, 0),
  );
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
  window.history.replaceState(null, "", "/");
});

function renderApp(locale: Locale, path: string) {
  window.history.replaceState(null, "", path);
  render(
    <I18nextProvider i18n={createI18n(locale)}>
      <App contentUrls={repositoryUrls} />
    </I18nextProvider>,
  );
}

const TITLES: Record<Locale, string> = { ja: "このアプリについて", en: "About this app", es: "Acerca de esta app" };

const SECTIONS: Record<Locale, readonly string[]> = {
  ja: ["このアプリでできること", "栄養値の計算", "出典とデータの版", "アレルゲン", "健康について", "このアプリがしないこと", "プライバシー", "オープンソースのライセンス"],
  en: [
    "What this app does",
    "How nutrition values are calculated",
    "Source and data versions",
    "Allergens",
    "About health",
    "What this app does not do",
    "Privacy",
    "Open-source licenses",
  ],
  es: [
    "Qué hace esta app",
    "Cómo se calculan los valores nutricionales",
    "Fuente y versiones de los datos",
    "Alérgenos",
    "Sobre la salud",
    "Lo que esta app no hace",
    "Privacidad",
    "Licencias de código abierto",
  ],
};

describe("about page", () => {
  it.each(["ja", "en", "es"] as const)("%s: opens from its own path with every section and no violations", async (locale) => {
    renderApp(locale, "/about");
    const heading = await screen.findByRole("heading", { level: 1 });
    expect(heading.textContent).toBe(TITLES[locale]);
    expect(screen.getAllByRole("heading", { level: 2 }).map((element) => element.textContent)).toEqual(SECTIONS[locale]);
    const main = screen.getByRole("main");
    expect(within(main).getByText("日本食品標準成分表（八訂）増補2023年から引用")).toBeDefined();
    expect(main.querySelector('a[href="/third-party-licenses.txt"]')).not.toBeNull();
    expect(await axeViolations()).toEqual([]);
  });

  it("is reached from the footer link and focuses its heading", async () => {
    renderApp("ja", "/");
    await screen.findByRole("heading", { level: 1, name: "目標と条件" });
    fireEvent.click(within(screen.getByRole("contentinfo")).getByRole("link", { name: "このアプリについて" }));
    const heading = await screen.findByRole("heading", { level: 1, name: "このアプリについて" });
    expect(window.location.pathname).toBe("/about");
    expect(document.activeElement).toBe(heading);
    expect(document.title).toBe("このアプリについて — Recipe Discovery");
  });
});
