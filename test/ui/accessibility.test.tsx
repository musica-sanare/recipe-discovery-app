// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Locale } from "../../shared/locales.ts";
import { App } from "../../src/App.tsx";
import { createI18n } from "../../src/i18n/createI18n.ts";
import { axeViolations } from "../../src/testing/axe.ts";
import { repositoryFetch, repositoryUrls } from "./repositoryContent.ts";

// Exceptional states not covered by the other UI tests, in every locale (Stage 4.7).
// Covered elsewhere: targets view, errors, warning, reload notice, not found, content error
// (src/App.test.tsx, src/views/TargetsView.test.tsx); candidates with alternatives and
// relaxations, comparison (test/ui/candidates.test.tsx); detail before and after a change
// (test/ui/detail.test.tsx).

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(repositoryFetch));
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) =>
    setTimeout(() => {
      callback(0);
    }, 0),
  );
  window.history.replaceState(null, "", "/");
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
});

const LOCALES = ["ja", "en", "es"] as const;

async function form(locale: Locale) {
  render(
    <I18nextProvider i18n={createI18n(locale)}>
      <App contentUrls={repositoryUrls} />
    </I18nextProvider>,
  );
  await screen.findByRole("heading", { level: 1 });
  const details = document.querySelector("details");
  if (details) details.open = true;
}

function set(field: string, value: string) {
  fireEvent.change(document.getElementById(`targets-${field}`) as HTMLElement, { target: { value } });
}

function addExcluded(query: string) {
  const input = document.getElementById("targets-excluded") as HTMLElement;
  fireEvent.change(input, { target: { value: query } });
  fireEvent.keyDown(input, { key: "Enter" });
}

function submit() {
  fireEvent.click(document.querySelector("button[type=submit]") as HTMLElement);
}

const presetCut = () => {
  fireEvent.click(document.querySelectorAll("input[name=preset]")[0] as HTMLElement);
};

describe.each(LOCALES)("exceptional states in %s (axe-core)", (locale) => {
  it("blocked contradiction", async () => {
    await form(locale);
    set("kcalMax", "600");
    set("proteinMin", "200");
    submit();
    await screen.findByRole("alert");
    expect(await axeViolations()).toEqual([]);
  });

  it("all recipes shown, with the held alternatives open (P4)", async () => {
    await form(locale);
    presetCut();
    set("kcalMax", "550");
    set("fatMax", "10");
    submit();
    await screen.findAllByRole("article");
    fireEvent.click(screen.getByRole("button", { name: { ja: "別のタイプを見る", en: "Show a different type", es: "Ver otro tipo" }[locale] }));
    fireEvent.click(screen.getByRole("button", { name: { ja: "近い候補を見る", en: "Show close alternatives", es: "Ver alternativas cercanas" }[locale] }));
    expect(await axeViolations()).toEqual([]);
  });

  it("nothing meets the targets, with exclusion counts and the equipment review", async () => {
    await form(locale);
    presetCut();
    fireEvent.click(document.querySelectorAll("input[name=equipment-mode]")[1] as HTMLElement);
    addExcluded({ ja: "卵", en: "egg", es: "huevo" }[locale]);
    addExcluded({ ja: "ご飯", en: "rice", es: "arroz" }[locale]);
    submit();
    await screen.findByRole("heading", { level: 2, name: { ja: "条件に合うレシピがありません", en: "No recipes match the conditions", es: "Ninguna receta cumple las condiciones" }[locale] });
    expect(await axeViolations()).toEqual([]);
  });

  it("recipe detail after a search, with statuses and a change", async () => {
    await form(locale);
    presetCut();
    submit();
    const [first] = await screen.findAllByRole("article");
    fireEvent.click(first?.querySelector("h3 a") as HTMLElement);
    await screen.findByRole("heading", { level: 2, name: { ja: "1人分の栄養（推定値）", en: "Per serving (estimates)", es: "Por ración (estimaciones)" }[locale] });
    fireEvent.click(screen.getByRole("button", { name: { ja: "元の量に戻す", en: "Reset the amounts", es: "Restablecer las cantidades" }[locale] }));
    expect(await axeViolations()).toEqual([]);
  });
});
