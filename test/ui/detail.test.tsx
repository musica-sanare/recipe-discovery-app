// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defaultState, type RecipeState } from "../../domain/nutrition/amounts.ts";
import { calculateNutrition, type RecipeNutrition } from "../../domain/nutrition/engine.ts";
import type { Locale } from "../../shared/locales.ts";
import { App } from "../../src/App.tsx";
import { formatDifference, formatNutrient } from "../../src/format/format.ts";
import { createI18n } from "../../src/i18n/createI18n.ts";
import { axeViolations } from "../../src/testing/axe.ts";
import { repositoryEngine, validationBundleInput } from "../../tools/content/repository.ts";
import { repositoryFetch, repositoryUrls } from "./repositoryContent.ts";

// Recipe detail and adjustment on the repository recipes (Stage 4.5).
const { calc, data } = repositoryEngine(validationBundleInput());

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

function recipeOf(id: string) {
  const recipe = calc.recipes.find((candidate) => candidate.id === id);
  if (recipe === undefined) throw new Error(id);
  return recipe;
}

function nutritionOf(id: string, state: RecipeState): RecipeNutrition {
  const result = calculateNutrition(recipeOf(id), state, data);
  if (!result.ok) throw new Error("calculation");
  return result.value;
}

async function openDetail(id: string, locale: Locale = "ja") {
  window.history.replaceState(null, "", `/recipes/${id}`);
  render(
    <I18nextProvider i18n={createI18n(locale)}>
      <App contentUrls={repositoryUrls} />
    </I18nextProvider>,
  );
  await screen.findByRole("heading", { level: 1 });
}

/** The per-serving values as shown, by nutrient label. */
function shownValues(): Record<string, string> {
  const list = within(screen.getByRole("region", { name: /1人分の栄養|Per serving|Por ración|Par portion/ })).getAllByRole("term");
  return Object.fromEntries(list.map((term) => [term.textContent, term.nextElementSibling?.querySelector("span")?.textContent ?? ""]));
}

describe("recipe detail without a search", () => {
  it("shows the default state calculated by the engine, the basis, steps, and safety notes", async () => {
    await openDetail("chicken_lemon_herb_grill");
    const recipe = recipeOf("chicken_lemon_herb_grill");
    const expected = nutritionOf(recipe.id, defaultState(recipe));
    // The visible caption of the ingredient table sits outside its scrolling region (Stage 5.4).
    const caption = document.getElementById("ingredients-caption");
    const region = document.querySelector('[role="region"][aria-labelledby="ingredients-caption"]');
    expect(region?.querySelector("table")).not.toBeNull();
    expect(region?.contains(caption)).toBe(false);
    expect(shownValues()).toEqual({
      エネルギー: `${formatNutrient("ja", "ENERC_KCAL", expected.perServing.ENERC_KCAL) ?? ""} kcal`,
      たんぱく質: `${formatNutrient("ja", "PROT-", expected.perServing["PROT-"]) ?? ""} g`,
      脂質: `${formatNutrient("ja", "FAT-", expected.perServing["FAT-"]) ?? ""} g`,
      炭水化物: `${formatNutrient("ja", "CHOCDF-", expected.perServing["CHOCDF-"]) ?? ""} g`,
      食塩相当量: `${formatNutrient("ja", "NACL_EQ", expected.perServing.NACL_EQ) ?? ""} g`,
    });
    expect(screen.getByText(/目標を入力して検索すると/)).toBeDefined();
    expect(screen.queryByRole("button", { name: "目標に合わせる" })).toBeNull();
    expect(screen.getAllByText(/食品番号 \d{5}/).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { level: 2, name: "作り方" })).toBeDefined();
    expect(screen.getByRole("heading", { level: 2, name: "安全のための注意" })).toBeDefined();
    expect(screen.getAllByText("日本食品標準成分表（八訂）増補2023年から引用").length).toBeGreaterThan(0);
    expect(screen.getByText(/エネルギーは成分表の値を使っているため/)).toBeDefined();
  });

  it("recalculates with the engine on every change and shows the differences of the displayed values", async () => {
    await openDetail("chicken_lemon_herb_grill");
    const recipe = recipeOf("chicken_lemon_herb_grill");
    const before = nutritionOf(recipe.id, defaultState(recipe));
    fireEvent.click(screen.getByRole("button", { name: "鶏むね肉（皮なし）を増やす" }));
    const state: RecipeState = { ...defaultState(recipe), amounts: { chicken: 160 } };
    const after = nutritionOf(recipe.id, state);
    expect(shownValues()["たんぱく質"]).toBe(`${formatNutrient("ja", "PROT-", after.perServing["PROT-"]) ?? ""} g`);
    const protein = formatDifference("ja", "PROT-", before.perServing["PROT-"], after.perServing["PROT-"]) ?? "";
    expect(screen.getByText(new RegExp(`^前回から：.*たんぱく質 ${protein.replace("+", "\\+")} g`))).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "人数を増やす" }));
    expect(screen.getByRole("heading", { level: 2, name: "材料（2人分）" })).toBeDefined();
    // Per-serving values do not depend on servings (ADR-028 F).
    expect(screen.getByText("前回から変化はありません。")).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "元の量に戻す" }));
    expect(shownValues()["たんぱく質"]).toBe(`${formatNutrient("ja", "PROT-", before.perServing["PROT-"]) ?? ""} g`);
  });

  it("switches a side off, hides its steps, and applies a substitution with its texts", async () => {
    await openDetail("chicken_lemon_herb_grill");
    const recipe = recipeOf("chicken_lemon_herb_grill");
    const side = recipe.sides.find((candidate) => recipe.steps.some((step) => step.side === candidate.key));
    const steps = () => within(screen.getByRole("region", { name: "作り方" })).getAllByRole("listitem").length;
    const all = steps();
    const sideBox = within(screen.getByRole("group", { name: "付け合わせ" })).getAllByRole("checkbox")[recipe.sides.indexOf(side ?? recipe.sides[0] ?? { key: "", ingredients: [], solverMayRemove: false })];
    fireEvent.click(sideBox as HTMLElement);
    expect(steps()).toBeLessThan(all);
    expect(screen.getByText(/付け合わせなしのため、\d+つの手順を省いています。/)).toBeDefined();

    const stepTextsBefore = within(screen.getByRole("region", { name: "作り方" })).getAllByRole("listitem")[0]?.textContent;
    const group = screen.getByRole("group", { name: /^置き換え：/ });
    fireEvent.click(within(group).getAllByRole("radio")[1] as HTMLElement);
    expect(within(screen.getByRole("region", { name: "作り方" })).getAllByRole("listitem")[0]?.textContent).not.toBe(stepTextsBefore);
    expect(screen.getAllByText("置き換え後").length).toBeGreaterThan(0);
  });

  it("keeps the underlying values when the language changes", async () => {
    await openDetail("beef_steak_potatoes");
    const digits = () => Object.values(shownValues()).map((value) => value.replace(/(\d)[.,](\d{3})/g, "$1$2").replace(",", "."));
    const ja = digits();
    fireEvent.change(screen.getByRole("combobox", { name: "言語" }), { target: { value: "es" } });
    await screen.findByRole("heading", { level: 2, name: "Por ración (estimaciones)" }, { timeout: 5000 });
    expect(digits().map((value) => value.replace(/[^\d.]/g, ""))).toEqual(ja.map((value) => value.replace(/[^\d.]/g, "")));
  });

  it("keeps the underlying values through ja → fr → ja", async () => {
    await openDetail("beef_steak_potatoes");
    const ja = shownValues();
    const numbers = (values: Record<string, string>) =>
      Object.values(values).map((value) => value.replace(/(\d)[.,\u202f\u00a0](\d{3})/g, "$1$2").replace(",", ".").replace(/[^\d.]/g, ""));
    fireEvent.change(screen.getByRole("combobox", { name: "言語" }), { target: { value: "fr" } });
    await screen.findByRole("heading", { level: 2, name: "Par portion (estimations)" }, { timeout: 5000 });
    expect(numbers(shownValues())).toEqual(numbers(ja));
    fireEvent.change(screen.getByRole("combobox", { name: "Langue" }), { target: { value: "ja" } });
    await screen.findByRole("heading", { level: 2, name: "1人分の栄養（推定値）" }, { timeout: 5000 });
    expect(shownValues()).toEqual(ja);
  });
});

describe("recipe detail after a search", () => {
  it("starts from the candidate's state, compares with the targets, and fits to them again", async () => {
    render(
      <I18nextProvider i18n={createI18n("ja")}>
        <App contentUrls={repositoryUrls} />
      </I18nextProvider>,
    );
    await screen.findByRole("heading", { level: 1 });
    fireEvent.click(screen.getByRole("radio", { name: /減量の例/ }));
    fireEvent.click(screen.getByRole("button", { name: "レシピを探す" }));
    await screen.findByRole("heading", { level: 1, name: "候補" });
    const firstCard = screen.getAllByRole("article")[0] as HTMLElement;
    const cardProtein = within(firstCard).getByText("たんぱく質").nextElementSibling?.querySelector("span")?.textContent;
    fireEvent.click(within(firstCard).getByRole("link", { name: /の詳細を見る$/ }));
    await screen.findByRole("heading", { level: 2, name: "1人分の栄養（推定値）" });

    expect(shownValues()["たんぱく質"]).toBe(cardProtein);
    expect(screen.getAllByText(/目標の範囲内|目標に近い|目標外/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "元の量に戻す" }));
    fireEvent.click(screen.getByRole("button", { name: "目標に合わせる" }));
    expect(shownValues()["たんぱく質"]).toBe(cardProtein);
    fireEvent.click(screen.getByRole("link", { name: "候補に戻る" }));
    expect(screen.getByRole("heading", { level: 1, name: "候補" })).toBeDefined();
  });
});

describe("accessibility of the detail view (axe-core)", () => {
  it.each(["ja", "en", "es", "fr"] as const)("%s has no violations, also after changes", async (locale) => {
    await openDetail("chicken_thigh_karaage", locale);
    expect(await axeViolations()).toEqual([]);
    fireEvent.click(screen.getAllByRole("button", { name: /人数|Servings|Raciones|Portions/ })[1] as HTMLElement);
    expect(await axeViolations()).toEqual([]);
  });
});
