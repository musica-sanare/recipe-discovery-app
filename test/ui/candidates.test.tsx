// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Locale } from "../../shared/locales.ts";
import { App } from "../../src/App.tsx";
import { createI18n } from "../../src/i18n/createI18n.ts";
import { axeViolations } from "../../src/testing/axe.ts";
import { repositoryFetch, repositoryUrls } from "./repositoryContent.ts";

// Candidates, comparison, re-suggestion, and exceptional states on the 20 repository recipes (Stage 4.4).

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

const SEARCH = { ja: "レシピを探す", en: "Find recipes", es: "Buscar recetas", fr: "Chercher des recettes" } as const;

async function openForm(locale: Locale = "ja") {
  render(
    <I18nextProvider i18n={createI18n(locale)}>
      <App contentUrls={repositoryUrls} />
    </I18nextProvider>,
  );
  await screen.findByRole("heading", { level: 1 });
  const details = document.querySelector<HTMLDetailsElement>("#targets-advanced");
  if (details) details.open = true;
}

function setNumber(field: string, value: string) {
  const input = document.getElementById(`targets-${field}`);
  if (input === null) throw new Error(`no field ${field}`);
  fireEvent.change(input, { target: { value } });
}

function addFood(box: "required" | "excluded", query: string) {
  const input = document.getElementById(`targets-${box}`);
  if (input === null) throw new Error(`no field ${box}`);
  fireEvent.change(input, { target: { value: query } });
  fireEvent.keyDown(input, { key: "Enter" });
}

async function searchWith(locale: Locale, setup: () => void = () => undefined) {
  await openForm(locale);
  setup();
  fireEvent.click(screen.getByRole("button", { name: SEARCH[locale] }));
  await screen.findByRole("heading", { level: 1, name: { ja: "候補", en: "Candidates", es: "Candidatas", fr: "Suggestions" }[locale] });
}

const cards = () => within(screen.getByRole("list", { name: /目標を満たす候補|Candidates that meet the targets|Candidatas que cumplen|Suggestions qui atteignent/ })).getAllByRole("article");
const cardNames = () => cards().map((card) => within(card).getByRole("heading", { level: 3 }).textContent);
const cut = () => {
  fireEvent.click(screen.getByRole("radio", { name: /減量の例|Cutting example|Ejemplo de definición|Exemple de sèche/ }));
};

// Each card's detail link and the number in each nutrient line, with separators removed.
const cardSnapshot = () =>
  cards().map((card) => ({
    href: within(card).getAllByRole("link")[0]?.getAttribute("href"),
    values: [...card.querySelectorAll("dd > span:first-child")].map((span) => span.textContent.replace(/(\d)[.,\u202f\u00a0](\d{3})/g, "$1$2").replace(",", ".").replace(/[^\d.]/g, "")),
  }));

describe("candidates", () => {
  it("keeps the same candidates, order, and values through ja → fr → ja", async () => {
    await searchWith("ja", cut);
    const ja = cardSnapshot();
    expect(ja.length).toBeGreaterThanOrEqual(3);
    expect(ja.every((card) => card.href?.startsWith("/recipes/") === true && card.values.length >= 4 && card.values.every((value) => value !== ""))).toBe(true);
    const jaNames = cardNames();
    fireEvent.change(screen.getByRole("combobox", { name: "言語" }), { target: { value: "fr" } });
    await screen.findByRole("heading", { level: 1, name: "Suggestions" });
    expect(cardSnapshot()).toEqual(ja);
    fireEvent.change(screen.getByRole("combobox", { name: "Langue" }), { target: { value: "ja" } });
    await screen.findByRole("heading", { level: 1, name: "候補" });
    expect(cardSnapshot()).toEqual(ja);
    expect(cardNames()).toEqual(jaNames);
  });

  it("shows 3–5 cards with statuses as text, a reason line, and links to the details", async () => {
    await searchWith("ja", cut);
    expect(cards()).toHaveLength(5);
    for (const card of cards()) {
      const scope = within(card);
      expect(scope.getByText(/目標をすべて満たす/)).toBeDefined();
      expect(scope.getAllByText(/目標の範囲内|目標に近い|目標外|不明|目標なし/).length).toBeGreaterThanOrEqual(4);
      expect(scope.getByRole("link", { name: /の詳細を見る$/ }).getAttribute("href")).toMatch(/^\/recipes\/[a-z0-9_]+$/);
    }
    expect(screen.getByText(/検索条件：エネルギー 450～650 kcal/)).toBeDefined();
  });

  it("shows a different type, then says when every recipe meeting the targets was shown", async () => {
    await searchWith("ja", cut);
    const first = cardNames();
    fireEvent.click(screen.getByRole("button", { name: "別のタイプを見る" }));
    const second = cardNames();
    expect(second.some((name) => first.includes(name))).toBe(false);
    expect(document.activeElement?.tagName).toBe("H3");
    expect(document.activeElement?.textContent).toBe(second[0]);

    fireEvent.click(screen.getByRole("button", { name: "別のタイプを見る" }));
    expect(screen.getByRole("status").textContent).toContain("目標を満たすレシピをすべて表示したため");
  });

  it("replaces an excluded card in place and focuses the new card", async () => {
    await searchWith("ja", cut);
    const before = cardNames();
    const removed = before[1] ?? "";
    fireEvent.click(screen.getByRole("button", { name: `${removed}を候補から除外` }));
    const after = cardNames();
    expect(after).not.toContain(removed);
    expect([after[0], ...after.slice(2)]).toEqual([before[0], ...before.slice(2)]);
    expect(document.activeElement?.textContent).toBe(after[1]);
    expect(screen.getByText(`${removed}を除外し、${after[1] ?? ""}を表示しました。`)).toBeDefined();
  });

  it("keeps the set on screen when no other recipe meets the targets and offers close alternatives (P4)", async () => {
    await searchWith("ja", () => {
      cut();
      setNumber("kcalMax", "550");
      setNumber("fatMax", "10");
    });
    const first = cardNames();
    fireEvent.click(screen.getByRole("button", { name: "別のタイプを見る" }));
    expect(cardNames()).toEqual(first);
    expect(screen.getByRole("status").textContent).toContain("目標を満たすレシピは、すべて表示しました。");
    const show = screen.getByRole("button", { name: "近い候補を見る" });
    expect(show.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(show);
    const section = screen.getByRole("region", { name: "近い候補（目標に届いていません）" });
    expect(within(section).getAllByRole("article").length).toBeGreaterThan(0);
    expect(within(section).getAllByText("目標との差").length).toBeGreaterThan(0);
  });
});

describe("few or no candidates", () => {
  it("separates close alternatives with their gaps and applies a relaxation (tofu required)", async () => {
    await searchWith("ja", () => {
      addFood("required", "豆腐");
    });
    expect(cards().length).toBeLessThan(3);
    const alternatives = screen.getByRole("region", { name: "近い候補（目標に届いていません）" });
    expect(within(alternatives).getAllByRole("article").length).toBe(3 - cards().length);
    expect(within(alternatives).getAllByRole("listitem").some((item) => /g|kcal/.test(item.textContent))).toBe(true);
    expect(screen.getAllByText(/使いたい食材：/).length).toBeGreaterThan(0);

    const relax = screen.getByRole("region", { name: "条件をゆるめると" });
    const option = within(relax).getByText(/使いたい食材から大豆製品（部位・種類を問わない）を外す：目標を満たすレシピ \+\d+件/);
    expect(option).toBeDefined();
    fireEvent.click(within(relax).getAllByRole("button", { name: /^この条件で探す: 使いたい食材から/ })[0] as HTMLElement);
    expect(cards().length).toBeGreaterThanOrEqual(3);
    expect(document.activeElement?.id).toBe("view-heading");
    fireEvent.click(screen.getAllByRole("link", { name: "条件を変更" })[0] as HTMLElement);
    expect(screen.queryByRole("list", { name: "選んだ食材" })).toBeNull();
  });

  it("shows exclusion counts, relaxations, and the equipment review when nothing meets the targets", async () => {
    await searchWith("ja", () => {
      cut();
      fireEvent.click(screen.getByRole("radio", { name: "電子レンジのみ" }));
      addFood("excluded", "卵");
      addFood("excluded", "ご飯");
    });
    expect(screen.getByRole("heading", { level: 2, name: "条件に合うレシピがありません" })).toBeDefined();
    const exclusions = screen.getByRole("region", { name: "条件ごとに除外されたレシピ" });
    expect(within(exclusions).getByText(/設備（コンロ）：\d+件/)).toBeDefined();
    expect(screen.getByText(/設備を1つ加えるだけでは/)).toBeDefined();
    expect(screen.queryByRole("button", { name: "別のタイプを見る" })).toBeNull();
  });
});

describe("comparison", () => {
  it("compares two or three candidates side by side and limits the choice to three", async () => {
    await searchWith("ja", cut);
    const compare = screen.getByRole("button", { name: /^比較する（0件）$/ });
    expect(compare).toHaveProperty("disabled", true);
    const boxes = screen.getAllByRole("checkbox", { name: /を比較に加える$/ });
    for (const box of boxes.slice(0, 3)) fireEvent.click(box);
    expect(boxes[3]).toHaveProperty("disabled", true);
    expect(screen.getByText("比較できるのは3件までです。")).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "比較する（3件）" }));

    const table = await screen.findByRole("table", { name: "選んだレシピの比較（1人分、推定値）" });
    expect(within(table).getAllByRole("columnheader")).toHaveLength(4);
    // The visible caption sits outside the scrolling region and labels it (Stage 5.3).
    const region = screen.getByRole("region", { name: "選んだレシピの比較（1人分、推定値）" });
    expect(region.contains(table)).toBe(true);
    expect(region.contains(document.getElementById("comparison-caption"))).toBe(false);
    expect(within(table).getAllByRole("rowheader").map((cell) => cell.textContent)).toEqual([
      "調理時間",
      "手間",
      "料理のジャンル",
      "エネルギー",
      "たんぱく質",
      "脂質",
      "炭水化物",
      "分量の調整",
      "推定の確かさ",
      "アレルゲン",
    ]);
    const firstName = within(table).getAllByRole("columnheader")[1]?.textContent ?? "";
    fireEvent.click(screen.getByRole("button", { name: `${firstName}を比較から外す` }));
    expect(within(screen.getByRole("table")).getAllByRole("columnheader")).toHaveLength(3);
  });
});

describe("locale invariance of displayed values", () => {
  it("shows the same numbers in every locale", async () => {
    await searchWith("ja", cut);
    // Separators differ by locale (1,030 / 1030 / 1.030); the digits must not.
    const numbers = (card: HTMLElement) =>
      within(card)
        .getAllByRole("definition")
        .map((cell) => cell.textContent.replace(/(\d)[.,\s](\d{3})/g, "$1$2").match(/\d+(?:[.,]\d+)?/g)?.join(" "));
    const ja = cards().map(numbers);
    fireEvent.change(screen.getByRole("combobox", { name: "言語" }), { target: { value: "es" } });
    await screen.findByRole("heading", { level: 1, name: "Candidatas" }, { timeout: 5000 });
    expect(cards().map(numbers)).toEqual(ja);
  });
});

describe("accessibility of the result views (axe-core)", () => {
  it.each(["ja", "en", "es", "fr"] as const)("%s: candidates, alternatives, relaxations, and comparison have no violations", async (locale) => {
    await searchWith(locale, () => {
      addFood("required", { ja: "豆腐", en: "tofu", es: "tofu", fr: "tofu" }[locale]);
    });
    expect(await axeViolations()).toEqual([]);
    cleanup();

    await searchWith(locale, cut);
    for (const box of screen.getAllByRole("checkbox").slice(0, 2)) fireEvent.click(box);
    expect(await axeViolations()).toEqual([]);
    fireEvent.click(screen.getByRole("button", { name: /\(2\)|（2件）/ }));
    await screen.findByRole("table");
    expect(await axeViolations()).toEqual([]);
  });
});
