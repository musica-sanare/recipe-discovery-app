// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Locale } from "../shared/locales";
import { App } from "./App";
import { fixtureFetch, fixtureUrls } from "./content/bundleFixtures";
import type { LoadLocaleData, LocaleData } from "./i18n/localeData";
import { createTestI18n, testLocaleData } from "./testing/i18n";
import { LOCALE_STORAGE_KEY } from "./i18n/localePreference";
import { resources } from "./i18n/resources";
import { axeViolations } from "./testing/axe";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(fixtureFetch));
  window.history.replaceState(null, "", "/");
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
});

function renderApp(locale: Locale = "ja") {
  render(
    <I18nextProvider i18n={createTestI18n(locale)}>
      <App contentUrls={fixtureUrls} />
    </I18nextProvider>,
  );
}

/**
 * Reads document state at the first DOM mutation where `ready` holds. Effects with visible
 * results must already have run then; passive effects can run later, which CI exposed
 * (docs/working/DECISIONS.md "CI first run").
 */
function readWhen<T>(ready: () => boolean, read: () => T): { readonly values: T[]; stop: () => void } {
  const values: T[] = [];
  const observer = new MutationObserver(() => {
    if (ready()) values.push(read());
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  return {
    values,
    stop: () => {
      observer.disconnect();
    },
  };
}

const heading = () => document.querySelector("h1");

describe("effects visible in the same commit as the view", () => {
  it("names the document when the heading appears", async () => {
    const titles = readWhen(() => heading() !== null, () => document.title);
    renderApp();
    await screen.findByRole("heading", { level: 1, name: "目標と条件" });
    titles.stop();
    expect(titles.values[0]).toBe("目標と条件 — Recipe Discovery");
  });

  it("replaces the history entry when the reload notice appears", async () => {
    window.history.replaceState({ view: "candidates" }, "", "/");
    const states = readWhen(() => document.body.textContent.includes("ページを再読み込みすると"), () => window.history.state as unknown);
    renderApp();
    await screen.findByText(/ページを再読み込みすると/);
    states.stop();
    expect(states.values[0]).toEqual({ view: "targets" });
  });

  it("updates <html lang> and focuses the new heading when they appear", async () => {
    renderApp();
    await screen.findByRole("heading", { level: 1, name: "目標と条件" });
    const langs = readWhen(() => heading()?.textContent === "Targets and conditions", () => document.documentElement.lang);
    fireEvent.change(screen.getByLabelText("言語"), { target: { value: "en" } });
    await screen.findByRole("heading", { level: 1, name: "Targets and conditions" });
    langs.stop();
    expect(langs.values[0]).toBe("en");

    const focus = readWhen(() => heading()?.textContent === "About this app", () => document.activeElement === heading());
    fireEvent.click(screen.getByRole("link", { name: "About this app" }));
    await screen.findByRole("heading", { level: 1, name: "About this app" });
    focus.stop();
    expect(focus.values[0]).toBe(true);

    // The back button is not a React event, so its effects are not flushed with the commit.
    const back = readWhen(() => heading()?.textContent === "Targets and conditions", () => document.activeElement === heading());
    act(() => {
      window.history.back();
    });
    await screen.findByRole("heading", { level: 1, name: "Targets and conditions" });
    back.stop();
    expect(back.values[0]).toBe(true);
  });
});

describe("App shell", () => {

  it("shows the logo beside the product name, which stays the link's text", async () => {
    renderApp();
    await screen.findByRole("heading", { level: 1 });
    const home = screen.getByRole("link", { name: "Recipe Discovery" });
    expect(home.textContent).toBe("Recipe Discovery");
    expect(home.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders Japanese by default and sets document metadata", async () => {
    renderApp();

    expect((await screen.findByRole("heading", { level: 1 })).textContent).toBe("目標と条件");
    expect(document.documentElement.lang).toBe("ja");
    expect(document.title).toBe("目標と条件 — Recipe Discovery");
    expect(await screen.findByText("コンテンツ版 2026-10-18.1・成分表データ 2026年3月27日 更新")).toBeDefined();
    expect(screen.getByText("日本食品標準成分表（八訂）増補2023年から引用").getAttribute("lang")).toBe("ja");
  });

  it.each([
    ["en", "Language", "Content version 2026-10-18.1 · Composition data updated March 27, 2026"],
    ["es", "Idioma", "Versión del contenido 2026-10-18.1 · Datos de composición actualizados el 27 de marzo de 2026"],
  ] as const)("switches to %s, loads its texts, updates lang, and stores the choice", async (locale, label, versions) => {
    renderApp();
    await screen.findByText(/2026-10-18\.1/);

    fireEvent.change(screen.getByLabelText("言語"), { target: { value: locale } });

    expect(await screen.findByLabelText(label)).toBeDefined();
    expect(document.documentElement.lang).toBe(locale);
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe(locale);
    expect(await screen.findByText(versions)).toBeDefined();
    expect(document.title).toBe(`${resources[locale].translation.nav.views.targets} — Recipe Discovery`);
    expect(fetch).toHaveBeenCalledWith(fixtureUrls.text[locale]);
  });
});

describe("language switch", () => {
  it("keeps the view mounted: an open section stays open and no loading state appears", async () => {
    renderApp();
    await screen.findByRole("heading", { level: 1 });
    const details = document.querySelector("details");
    if (details === null) throw new Error("no details");
    fireEvent.click(details.querySelector("summary") as HTMLElement);
    expect(details.open).toBe(true);

    fireEvent.change(screen.getByLabelText("言語"), { target: { value: "es" } });
    expect(screen.queryByText("Cargando el contenido…")).toBeNull();
    await screen.findByRole("heading", { level: 1, name: "Objetivos y condiciones" });
    expect(document.querySelector("details")).toBe(details);
    expect(details.open).toBe(true);
  });
});

describe("per-locale UI data (ADR-039)", () => {
  function deferred() {
    let resolve: (data: LocaleData) => void = () => undefined;
    let reject: (reason: unknown) => void = () => undefined;
    const promise = new Promise<LocaleData>((onResolve, onReject) => {
      resolve = onResolve;
      reject = onReject;
    });
    return { promise, resolve, reject };
  }

  /** Only Japanese is added at start, as after the first render in the browser. */
  async function renderJapaneseOnly(loadLocale: LoadLocaleData) {
    render(
      <I18nextProvider i18n={createTestI18n("ja", { only: true })}>
        <App contentUrls={fixtureUrls} loadLocale={loadLocale} />
      </I18nextProvider>,
    );
    await screen.findByText(/2026-10-18\.1/);
  }

  it("loads a locale's data before switching, with a loading status meanwhile", async () => {
    const french = deferred();
    const loadLocale = vi.fn(() => french.promise);
    await renderJapaneseOnly(loadLocale);

    fireEvent.change(screen.getByLabelText("言語"), { target: { value: "fr" } });
    expect(loadLocale).toHaveBeenCalledWith("fr");
    expect(screen.getByText("言語を切り替えています…").getAttribute("role")).toBe("status");
    expect(screen.getByLabelText("言語").getAttribute("aria-busy")).toBe("true");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("目標と条件");
    expect(await axeViolations()).toEqual([]);

    await act(async () => {
      french.resolve(testLocaleData("fr"));
      await french.promise;
    });
    expect(await screen.findByRole("heading", { level: 1, name: resources.fr.translation.nav.views.targets })).toBeDefined();
    expect(document.documentElement.lang).toBe("fr");
    expect(screen.queryByText("Changement de langue…")).toBeNull();
  });

  it("keeps the current language when a locale's data fails to load, and switches on retry", async () => {
    const loadLocale = vi.fn<LoadLocaleData>().mockRejectedValueOnce(new TypeError("Failed to fetch dynamically imported module")).mockResolvedValueOnce(testLocaleData("fr"));
    await renderJapaneseOnly(loadLocale);

    fireEvent.change(screen.getByLabelText("言語"), { target: { value: "fr" } });
    expect((await screen.findByRole("alert")).textContent).toContain("コンテンツを読み込めませんでした。");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("目標と条件");
    expect(document.documentElement.lang).toBe("ja");
    expect(screen.getByLabelText<HTMLSelectElement>("言語").value).toBe("ja");
    expect(await axeViolations()).toEqual([]);

    fireEvent.click(screen.getByRole("button", { name: "再読み込み" }));
    expect(await screen.findByRole("heading", { level: 1, name: resources.fr.translation.nav.views.targets })).toBeDefined();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(loadLocale).toHaveBeenCalledTimes(2);
  });

  it("applies only the latest choice when an earlier load finishes later", async () => {
    const french = deferred();
    const loadLocale = vi.fn((locale: Locale) => (locale === "fr" ? french.promise : Promise.resolve(testLocaleData(locale))));
    await renderJapaneseOnly(loadLocale);

    fireEvent.change(screen.getByLabelText("言語"), { target: { value: "fr" } });
    fireEvent.change(screen.getByLabelText("言語"), { target: { value: "es" } });
    expect(await screen.findByRole("heading", { level: 1, name: "Objetivos y condiciones" })).toBeDefined();

    await act(async () => {
      french.resolve(testLocaleData("fr"));
      await french.promise;
    });
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Objetivos y condiciones");
    expect(document.documentElement.lang).toBe("es");
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

describe("navigation (ADR-030 D2)", () => {
  it("returns to the targets view with a notice when the search is gone after a reload", async () => {
    window.history.replaceState({ view: "candidates" }, "", "/");
    renderApp();

    expect((await screen.findByRole("heading", { level: 1 })).textContent).toBe("目標と条件");
    expect(screen.getByText(/ページを再読み込みすると/)).toBeDefined();
    expect(window.history.state).toEqual({ view: "targets" });
    expect(window.location.pathname).toBe("/");
  });

  it("opens a recipe detail by URL and shows not found for an unknown recipe", async () => {
    window.history.replaceState(null, "", "/recipes/missing_recipe");
    renderApp();

    expect((await screen.findByRole("heading", { level: 1 })).textContent).toBe("このレシピは見つかりませんでした。");
    expect(screen.getByRole("link", { name: "目標と条件へ" }).getAttribute("href")).toBe("/");
  });

  it("moves between views with links and the back button, focusing the new heading", async () => {
    window.history.replaceState(null, "", "/recipes/missing_recipe");
    renderApp();
    await screen.findByRole("heading", { level: 1 });

    fireEvent.click(screen.getByRole("link", { name: "目標と条件へ" }));
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toBe("目標と条件");
    expect(document.activeElement).toBe(heading);
    expect(window.location.pathname).toBe("/");
    expect(window.history.state).toEqual({ view: "targets" });

    await act(async () => {
      const popped = new Promise((resolve) => {
        window.addEventListener("popstate", resolve, { once: true });
      });
      window.history.back();
      await popped;
    });
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("このレシピは見つかりませんでした。");
  });

  it("never writes targets or conditions into the URL", async () => {
    renderApp();
    await screen.findByRole("heading", { level: 1 });
    expect(window.location.search).toBe("");
    expect(window.location.hash).toBe("");
  });
});

describe("accessibility (axe-core, ADR-030 D11)", () => {
  it.each(["ja", "en", "es", "fr"] as const)("the targets view has no violations in %s", async (locale) => {
    renderApp(locale);
    await screen.findByRole("heading", { level: 1 });
    expect(await axeViolations()).toEqual([]);
  });

  it.each(["ja", "en", "es", "fr"] as const)("the reload notice and the not-found detail have no violations in %s", async (locale) => {
    window.history.replaceState({ view: "comparison" }, "", "/");
    renderApp(locale);
    await screen.findByRole("heading", { level: 1 });
    expect(await axeViolations()).toEqual([]);
    cleanup();

    window.history.replaceState(null, "", "/recipes/missing_recipe");
    renderApp(locale);
    await screen.findByRole("heading", { level: 1 });
    expect(await axeViolations()).toEqual([]);
  });

  it.each(["ja", "en", "es", "fr"] as const)("the content error state has no violations in %s", async (locale) => {
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError("Failed to fetch"));
    renderApp(locale);
    await screen.findByRole("alert");
    expect(await axeViolations()).toEqual([]);
  });
});
