// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Locale } from "../../shared/locales";
import { App } from "../App";
import { fixtureFetch, fixtureUrls } from "../content/bundleFixtures";
import { createTestI18n } from "../testing/i18n";
import { search } from "../state/recommendation";
import { axeViolations } from "../testing/axe";

vi.mock("../state/recommendation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../state/recommendation")>();
  return { ...actual, search: vi.fn(actual.search) };
});

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(fixtureFetch));
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => setTimeout(() => {
    callback(0);
  }, 0));
  window.history.replaceState(null, "", "/");
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
  vi.mocked(search).mockClear();
});

async function renderForm(locale: Locale = "ja") {
  render(
    <I18nextProvider i18n={createTestI18n(locale)}>
      <App contentUrls={fixtureUrls} />
    </I18nextProvider>,
  );
  await screen.findByRole("heading", { level: 1 });
}

const input = (name: RegExp | string) => screen.getByRole("textbox", { name });
const advanced = () => document.querySelector<HTMLDetailsElement>("#targets-advanced");
const openAdvanced = () => {
  const details = advanced();
  if (details) details.open = true;
};
/** Options of the open ingredient list (the language select has options too). */
const suggestions = () => within(screen.getByRole("listbox")).getAllByRole("option");

describe("targets form", () => {
  it("starts from the maintain preset, labelled as an example, with the medical guidance notice", async () => {
    await renderForm();
    expect(screen.getByRole("radio", { name: /維持の例/ })).toHaveProperty("checked", true);
    expect(screen.getByText("目標の例は参考の値で、推奨ではありません。")).toBeDefined();
    expect(screen.getByText("医師や管理栄養士の指導を受けている方は、その指導に従ってください。")).toBeDefined();
    expect((screen.getAllByRole("textbox", { name: "下限（kcal）" })[0] as HTMLElement as HTMLInputElement).value).toBe("550");
  });

  it("fills the targets from a preset and marks them edited after a change", async () => {
    await renderForm();
    fireEvent.click(screen.getByRole("radio", { name: /減量の例/ }));
    expect((input("たんぱく質の下限（g）") as HTMLInputElement).value).toBe("35");
    fireEvent.change(input("たんぱく質の下限（g）"), { target: { value: "40" } });
    expect(screen.getByText("減量の例（編集済み）")).toBeDefined();
    expect(screen.getByRole("radio", { name: /減量の例/ })).toHaveProperty("checked", false);
  });

  it("steps values with labelled buttons within the limits", async () => {
    await renderForm();
    fireEvent.click(screen.getByRole("button", { name: "調理時間の上限を増やす" }));
    expect((input("調理時間の上限（分）") as HTMLInputElement).value).toBe("5");
    fireEvent.click(screen.getByRole("button", { name: "たんぱく質の下限を減らす" }));
    expect((input("たんぱく質の下限（g）") as HTMLInputElement).value).toBe("29");
  });

  it("passes the typed values to the engine unchanged and opens the candidates", async () => {
    await renderForm();
    openAdvanced();
    fireEvent.change(input("調理時間の上限（分）"), { target: { value: "２０" } });
    fireEvent.change(input("脂質の上限（g）"), { target: { value: "12,5" } });
    fireEvent.click(screen.getByRole("radio", { name: "電子レンジのみ" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "卵" }));
    fireEvent.click(screen.getByRole("button", { name: "レシピを探す" }));

    await screen.findByRole("heading", { level: 1, name: "候補" });
    expect(vi.mocked(search).mock.calls[0]?.[0]).toEqual({
      targets: { kcal: { min: 550, max: 750 }, proteinMin: 30, fatMax: 12.5 },
      servings: 1,
      conditions: { maxMinutes: 20, equipment: ["microwave"], excludedFoods: [], excludedAllergens: ["egg"], requiredFoods: [], cuisines: [] },
    });
  });

  it("keeps the form as typed when coming back from the candidates", async () => {
    await renderForm();
    fireEvent.change(input("調理時間の上限（分）"), { target: { value: "25" } });
    fireEvent.click(screen.getByRole("button", { name: "レシピを探す" }));
    await screen.findByRole("heading", { level: 1, name: "候補" });
    fireEvent.click(screen.getAllByRole("link", { name: "条件を変更" })[0] as HTMLElement);
    expect((input("調理時間の上限（分）") as HTMLInputElement).value).toBe("25");
  });
});

describe("input errors", () => {
  it("shows engine errors at their fields and in a focused summary, and opens the advanced section", async () => {
    await renderForm();
    fireEvent.change(input("調理時間の上限（分）"), { target: { value: "abc" } });
    fireEvent.change(input("たんぱく質の下限（g）"), { target: { value: "500" } });
    fireEvent.click(screen.getByRole("button", { name: "レシピを探す" }));

    const summary = await screen.findByRole("alert");
    await waitFor(() => {
      expect(document.activeElement).toBe(summary);
    });
    expect(within(summary).getByText("入力内容を確認してください（2件）")).toBeDefined();
    const link = within(summary).getByRole("link", { name: "たんぱく質の下限は0〜200の範囲で入力してください。" });
    expect(link.getAttribute("href")).toBe("#targets-proteinMin");
    // The link focuses its field itself, because Safari does not on fragment navigation.
    fireEvent.click(link);
    expect(document.activeElement).toBe(input("たんぱく質の下限（g）"));
    expect(input("たんぱく質の下限（g）").getAttribute("aria-invalid")).toBe("true");
    expect(input("調理時間の上限（分）").getAttribute("aria-describedby")).toContain("error");
    expect(advanced()?.open).toBe(true);
    expect(search).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("heading", { level: 1, name: "候補" })).toBeNull();
  });

  it("reports an inverted energy range at the maximum", async () => {
    await renderForm("en");
    fireEvent.change(screen.getAllByRole("textbox", { name: "Minimum (kcal)" })[0] as HTMLElement, { target: { value: "800" } });
    fireEvent.click(screen.getByRole("button", { name: "Find recipes" }));
    expect(await screen.findByText("The minimum of energy is higher than the maximum.", { selector: "a" })).toBeDefined();
  });
});

describe("contradictions (ADR-029 D9)", () => {
  it("warns before searching and still searches", async () => {
    await renderForm();
    openAdvanced();
    fireEvent.change(screen.getAllByRole("textbox", { name: "上限（kcal）" })[0] as HTMLElement, { target: { value: "600" } });
    fireEvent.change(input("たんぱく質の下限（g）"), { target: { value: "120" } });
    expect(screen.getByText(/近いため、合うレシピが少ない可能性があります/)).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "レシピを探す" }));
    await screen.findByRole("heading", { level: 1, name: "候補" });
  });

  it("blocks the search with an explanation", async () => {
    await renderForm();
    fireEvent.change(screen.getAllByRole("textbox", { name: "上限（kcal）" })[0] as HTMLElement, { target: { value: "600" } });
    fireEvent.change(input("たんぱく質の下限（g）"), { target: { value: "200" } });
    fireEvent.click(screen.getByRole("button", { name: "レシピを探す" }));

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("目標の組み合わせに矛盾があります。");
    expect(alert.textContent).toContain("約800 kcal");
    expect(search).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("目標と条件");
  });
});

describe("ingredient autocomplete (ADR-030 D6)", () => {
  it("chooses with the keyboard, shows the choice, and removes it", async () => {
    await renderForm();
    openAdvanced();
    const box = screen.getByRole("combobox", { name: "使いたい食材" });
    fireEvent.change(box, { target: { value: "トリ" } });
    expect(box.getAttribute("aria-expanded")).toBe("true");
    const options = suggestions();
    expect(options.map((option) => option.textContent)).toEqual(["鶏肉（部位・種類を問わない）", "鶏むね肉（皮なし）"]);

    fireEvent.keyDown(box, { key: "ArrowDown" });
    expect(box.getAttribute("aria-activedescendant")).toBe(options[1]?.id);
    fireEvent.keyDown(box, { key: "ArrowUp" });
    fireEvent.keyDown(box, { key: "Enter" });

    const chosen = screen.getByRole("list", { name: "選んだ食材" });
    expect(within(chosen).getByText("鶏肉（部位・種類を問わない）")).toBeDefined();
    expect((box as HTMLInputElement).value).toBe("");
    fireEvent.click(screen.getByRole("button", { name: "鶏肉（部位・種類を問わない）を外す" }));
    expect(screen.queryByRole("list", { name: "選んだ食材" })).toBeNull();
  });

  it("says when an ingredient is not supported and closes with Escape", async () => {
    await renderForm("es");
    const box = screen.getByRole("combobox", { name: "Ingredientes que quieres evitar" });
    fireEvent.change(box, { target: { value: "langosta" } });
    expect(screen.getByText("Ningún ingrediente coincide con «langosta». Este ingrediente no está disponible.").getAttribute("role")).toBe("status");
    fireEvent.change(box, { target: { value: "papá" } });
    expect(suggestions().map((option) => option.textContent)).toEqual(["Patata"]);
    fireEvent.keyDown(box, { key: "Escape" });
    expect(box.getAttribute("aria-expanded")).toBe("false");
  });

  it("sends a chosen group as one any-of item", async () => {
    await renderForm("en");
    const box = screen.getByRole("combobox", { name: "Ingredients you want to use" });
    fireEvent.change(box, { target: { value: "chicken" } });
    fireEvent.keyDown(box, { key: "ArrowDown" });
    fireEvent.keyDown(box, { key: "ArrowUp" });
    fireEvent.keyDown(box, { key: "Enter" });
    fireEvent.click(screen.getByRole("button", { name: "Find recipes" }));
    await screen.findByRole("heading", { level: 1, name: "Candidates" });
    expect(vi.mocked(search).mock.calls[0]?.[0].conditions.requiredFoods).toEqual([["chicken_breast", "chicken_thigh"]]);
  });
});

describe("accessibility of the form (axe-core)", () => {
  it.each(["ja", "en", "es", "fr"] as const)("%s: open form with choices, errors, and a warning has no violations", async (locale) => {
    await renderForm(locale);
    openAdvanced();
    fireEvent.click(screen.getAllByRole("radio")[5] as HTMLElement);
    const boxes = screen.getAllByRole("combobox");
    fireEvent.change(boxes[0] as HTMLElement, { target: { value: "egg" } });
    fireEvent.change(document.getElementById("targets-fatMax") as HTMLElement, { target: { value: "abc" } });
    fireEvent.click(screen.getByRole("button", { name: /^(レシピを探す|Find recipes|Buscar recetas|Chercher des recettes)$/ }));
    await screen.findByRole("alert");
    expect(await axeViolations()).toEqual([]);
  });
});
