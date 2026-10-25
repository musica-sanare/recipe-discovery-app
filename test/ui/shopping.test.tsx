// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { validationRecipes } from "../../content/recipes/index.ts";
import { defaultState, type RecipeState } from "../../domain/nutrition/amounts.ts";
import { SHOPPING_LIST_MAX_RECIPES, buildShoppingList, type ShoppingEntry } from "../../domain/shopping/list.ts";
import type { Locale } from "../../shared/locales.ts";
import { App } from "../../src/App.tsx";
import { createI18n } from "../../src/i18n/createI18n.ts";
import { axeViolations } from "../../src/testing/axe.ts";
import { amountText, itemName } from "../../src/views/shopping/text.ts";
import { buildTextBundle } from "../../tools/content/bundle.ts";
import { repositoryEngine, validationBundleInput } from "../../tools/content/repository.ts";
import { repositoryFetch, repositoryUrls } from "./repositoryContent.ts";

// The shopping list on the repository recipes (Stage 8.3, ADR-032): the detail block, the
// list view, checks, copy, print, clearing, language changes, the limit, and axe-core.
const input = validationBundleInput();
const { calc } = repositoryEngine(input);
const RECIPE = "chicken_lemon_herb_grill";
const OTHER = "tuna_tofu_bowl";

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
  Reflect.deleteProperty(navigator, "clipboard");
});

async function openDetail(id: string, locale: Locale = "ja") {
  window.history.replaceState(null, "", `/recipes/${id}`);
  render(
    <I18nextProvider i18n={createI18n(locale)}>
      <App contentUrls={repositoryUrls} />
    </I18nextProvider>,
  );
  await screen.findByRole("heading", { level: 1 });
}

/** Moves to another view in the same page, as the back and forward buttons do. */
async function goTo(path: string) {
  act(() => {
    window.history.pushState(null, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  await screen.findByRole("heading", { level: 1 });
}

function recipeOf(id: string) {
  const recipe = calc.recipes.find((candidate) => candidate.id === id);
  if (recipe === undefined) throw new Error(id);
  return recipe;
}

/** The item labels the list should show for these entries, computed from the module. */
function expectedLabels(entries: readonly ShoppingEntry[], locale: Locale): string[] {
  const result = buildShoppingList(entries, calc.recipes);
  if (!result.ok) throw new Error("list");
  const { t } = createI18n(locale);
  const text = buildTextBundle(input, locale);
  const foodName = (food: string) => text.foods[food]?.name ?? food;
  return result.value.items.map((item) => `${itemName(t, foodName, item)} ${amountText(t, locale, item.grams, item.measure)}`);
}

const shownLabels = () => [...document.querySelectorAll<HTMLInputElement>("input[type=checkbox]")].map((box) => box.labels?.[0]?.textContent ?? "");
const entry = (id: string, state: Partial<RecipeState> = {}): ShoppingEntry => ({ recipe: id, state: { ...defaultState(recipeOf(id)), ...state } });

describe("detail block and list view", () => {
  it("adds the current state, updates it on request, and lists the module's items", async () => {
    await openDetail(RECIPE);
    expect(screen.queryByRole("link", { name: /買い物リスト（/ })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "買い物リストに追加" }));
    expect(screen.getByRole("link", { name: "買い物リスト（1）" })).toBeTruthy();
    expect(screen.getByText(/買い物リストに入っています（1人分）/)).toBeTruthy();
    expect(screen.queryByRole("button", { name: "リストを今の分量に更新" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "人数を増やす" }));
    expect(screen.getByText("今の分量は、リストに入れた内容と違います。")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "リストを今の分量に更新" }));
    expect(screen.getByText(/買い物リストに入っています（2人分）/)).toBeTruthy();
    expect(screen.queryByText("今の分量は、リストに入れた内容と違います。")).toBeNull();

    fireEvent.click(screen.getByRole("link", { name: "買い物リスト（1）" }));
    await screen.findByRole("heading", { level: 1, name: "買い物リスト" });
    expect(shownLabels()).toEqual(expectedLabels([entry(RECIPE, { servings: 2 })], "ja"));
    expect(screen.getByText("分量は可食部（皮・骨・殻などを除く）または市販品の重さです。")).toBeTruthy();
    expect(screen.getByText("2人分")).toBeTruthy();
  });

  it("keeps the list across views, clears changed checks, and removes recipes", async () => {
    await openDetail(RECIPE);
    fireEvent.click(screen.getByRole("button", { name: "買い物リストに追加" }));
    await goTo(`/recipes/${OTHER}`);
    fireEvent.click(screen.getByRole("button", { name: "買い物リストに追加" }));
    fireEvent.click(screen.getByRole("link", { name: "買い物リスト（2）" }));
    await screen.findByRole("heading", { level: 1, name: "買い物リスト" });
    expect(shownLabels()).toEqual(expectedLabels([entry(RECIPE), entry(OTHER)], "ja"));

    const boxes = () => [...document.querySelectorAll<HTMLInputElement>("input[type=checkbox]")];
    for (const box of boxes()) fireEvent.click(box);
    expect(boxes().every((box) => box.checked)).toBe(true);
    expect(screen.getByRole<HTMLButtonElement>("button", { name: "テキストでコピー" }).disabled).toBe(true);

    // Doubling one recipe changes its items only; their checks are cleared.
    fireEvent.click(screen.getByRole("link", { name: /レモンハーブ/ }));
    await screen.findByRole("button", { name: "人数を増やす" });
    fireEvent.click(screen.getByRole("button", { name: "人数を増やす" }));
    fireEvent.click(screen.getByRole("button", { name: "リストを今の分量に更新" }));
    fireEvent.click(screen.getByRole("link", { name: "リストを見る" }));
    await screen.findByRole("heading", { level: 1, name: "買い物リスト" });
    const before = buildShoppingList([entry(RECIPE), entry(OTHER)], calc.recipes);
    const after = buildShoppingList([entry(RECIPE, { servings: 2 }), entry(OTHER)], calc.recipes);
    if (!before.ok || !after.ok) throw new Error("list");
    const unchanged = after.value.items.filter((item) => before.value.items.some((old) => old.key === item.key && old.grams === item.grams)).length;
    expect(boxes().filter((box) => box.checked)).toHaveLength(unchanged);
    expect(unchanged).toBeGreaterThan(0);
    expect(unchanged).toBeLessThan(after.value.items.length);

    const [firstRemove] = screen.getAllByRole("button", { name: /をリストから外す$/ });
    if (firstRemove === undefined) throw new Error("no remove button");
    fireEvent.click(firstRemove);
    await waitFor(() => {
      expect(screen.getByRole("link", { name: "買い物リスト（1）" })).toBeTruthy();
    });
    expect(document.activeElement?.id).toMatch(/^shopping-remove-/);
  });

  it("copies the unchecked items, falls back to a text area, prints, and clears after confirmation", async () => {
    await openDetail(RECIPE);
    fireEvent.click(screen.getByRole("button", { name: "買い物リストに追加" }));
    fireEvent.click(screen.getByRole("link", { name: "リストを見る" }));
    await screen.findByRole("heading", { level: 1, name: "買い物リスト" });

    const writeText = vi.fn<(text: string) => Promise<void>>(() => Promise.resolve());
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    const first = document.querySelector<HTMLInputElement>("input[type=checkbox]");
    if (first === null) throw new Error("no item");
    fireEvent.click(first);
    fireEvent.click(screen.getByRole("button", { name: "テキストでコピー" }));
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledTimes(1);
    });
    const copied = writeText.mock.calls[0]?.[0] ?? "";
    expect(copied.split("\n").slice(0, 2)).toEqual(["買い物リスト（1品）", `- ${buildTextBundle(input, "ja").recipes[RECIPE]?.name ?? ""}（1人分）`]);
    expect(copied).not.toContain(first.labels?.[0]?.textContent ?? "-");
    expect(await screen.findByText(/品目をコピーしました。/)).toBeTruthy();

    Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("denied")) }, configurable: true });
    fireEvent.click(screen.getByRole("button", { name: "テキストでコピー" }));
    const area = await screen.findByRole<HTMLTextAreaElement>("textbox", { name: "コピーするテキスト" });
    expect(area.value).toBe(copied);
    expect(screen.getByText(/自動ではコピーできませんでした/)).toBeTruthy();

    const print = vi.fn();
    vi.stubGlobal("print", print);
    fireEvent.click(screen.getByRole("button", { name: "印刷" }));
    expect(print).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "すべて消す" }));
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "消す" }));
    fireEvent.click(screen.getByRole("button", { name: "キャンセル" }));
    expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "すべて消す" }));
    fireEvent.click(screen.getByRole("button", { name: "消す" }));
    expect(await screen.findByText("まだレシピがありません。レシピの詳細から追加できます。")).toBeTruthy();
    expect(screen.queryByRole("link", { name: /買い物リスト（/ })).toBeNull();
    expect(document.activeElement?.id).toBe("view-heading");
  });

  it("keeps every amount when the language changes", async () => {
    await openDetail(RECIPE);
    fireEvent.click(screen.getByRole("button", { name: "買い物リストに追加" }));
    fireEvent.click(screen.getByRole("link", { name: "リストを見る" }));
    await screen.findByRole("heading", { level: 1, name: "買い物リスト" });
    fireEvent.change(screen.getByRole("combobox", { name: "言語" }), { target: { value: "es" } });
    await screen.findByRole("heading", { level: 1, name: "Lista de la compra" });
    expect(shownLabels()).toEqual(expectedLabels([entry(RECIPE)], "es"));
  });

  it(`accepts at most ${String(SHOPPING_LIST_MAX_RECIPES)} recipes`, async () => {
    const ids = validationRecipes.map((recipe) => recipe.id);
    await openDetail(ids[0] ?? "");
    for (const [index, id] of ids.slice(0, SHOPPING_LIST_MAX_RECIPES + 1).entries()) {
      if (index > 0) await goTo(`/recipes/${id}`);
      const add = screen.getByRole<HTMLButtonElement>("button", { name: "買い物リストに追加" });
      if (index < SHOPPING_LIST_MAX_RECIPES) fireEvent.click(add);
      else {
        expect(add.disabled).toBe(true);
        expect(screen.getByText(`リストに入れられるのは${String(SHOPPING_LIST_MAX_RECIPES)}レシピまでです。`)).toBeTruthy();
      }
    }
    expect(screen.getByRole("link", { name: `買い物リスト（${String(SHOPPING_LIST_MAX_RECIPES)}）` })).toBeTruthy();
  });

  it("opens the targets view with the reload notice when a reload empties the list", async () => {
    window.history.replaceState({ view: "shoppingList" }, "", "/");
    render(
      <I18nextProvider i18n={createI18n("ja")}>
        <App contentUrls={repositoryUrls} />
      </I18nextProvider>,
    );
    expect(await screen.findByText(/買い物リストは保持されません/)).toBeTruthy();
    expect(window.history.state).toEqual({ view: "targets" });
  });
});

describe.each(["ja", "en", "es"] as const)("axe-core in %s", (locale) => {
  it("detail block, list view, text area fallback, and empty list have no violations", async () => {
    const { t } = createI18n(locale);
    await openDetail(RECIPE, locale);
    fireEvent.click(screen.getByRole("button", { name: t("shopping.add") }));
    expect(await axeViolations(document.body)).toEqual([]);
    fireEvent.click(screen.getByRole("link", { name: t("shopping.viewList") }));
    await screen.findByRole("heading", { level: 1, name: t("nav.views.shoppingList") });
    const first = document.querySelector<HTMLInputElement>("input[type=checkbox]");
    if (first) fireEvent.click(first);
    Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("denied")) }, configurable: true });
    fireEvent.click(screen.getByRole("button", { name: t("shopping.copy") }));
    await screen.findByRole("textbox", { name: t("shopping.copyFallbackLabel") });
    fireEvent.click(screen.getByRole("button", { name: t("shopping.clear") }));
    expect(await axeViolations(document.body)).toEqual([]);
    fireEvent.click(screen.getByRole("button", { name: t("shopping.clearYes") }));
    await screen.findByText(t("shopping.empty"));
    expect(await axeViolations(document.body)).toEqual([]);
  });
});
