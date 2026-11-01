// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { foods } from "../../content/foods.ts";
import type { Locale } from "../../shared/locales.ts";
import { App } from "../../src/App.tsx";
import { createTestI18n } from "../../src/testing/i18n.ts";
import { axeViolations } from "../../src/testing/axe.ts";
import { repositoryFetch, repositoryUrls } from "./repositoryContent.ts";

// Free-text conditions on the repository content (ADR-034 D6, revised again). The texts
// are written for this test, not taken from the evaluation set.
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

const REQUESTS: Readonly<Record<Locale, { readonly conditions: string; readonly allergy: string }>> = {
  ja: { conditions: "キャベツと人参で、にんにくなし、25分以内の韓国風", allergy: "そばアレルギーです" },
  en: { conditions: "Cabbage and carrots, no garlic, under 25 minutes, Korean style", allergy: "I am allergic to buckwheat" },
  es: { conditions: "Repollo y zanahorias, sin ajo, en menos de 25 minutos, estilo coreano", allergy: "Tengo alergia al trigo sarraceno" },
  fr: { conditions: "Chou et carottes, sans ail, en moins de 25 minutes, à la coréenne", allergy: "Je suis allergique au sarrasin" },
};

async function openForm(locale: Locale) {
  const i18n = createTestI18n(locale);
  render(
    <I18nextProvider i18n={i18n}>
      <App contentUrls={repositoryUrls} />
    </I18nextProvider>,
  );
  await screen.findByRole("heading", { level: 1 });
  fireEvent.click(screen.getByText(i18n.t("freeText.summary")));
  return i18n;
}

function read(i18n: Awaited<ReturnType<typeof openForm>>, text: string) {
  fireEvent.change(screen.getByLabelText(i18n.t("freeText.label")), { target: { value: text } });
  fireEvent.click(screen.getByRole("button", { name: i18n.t("freeText.read") }));
}

describe.each(["ja", "en", "es", "fr"] as const)("free-text conditions in %s", (locale) => {
  it("shows the conditions read from the text and applies them only on request", async () => {
    const i18n = await openForm(locale);
    read(i18n, REQUESTS[locale].conditions);
    expect(await screen.findByText(i18n.t("freeText.resultHeading"))).toBeTruthy();
    const minutes = document.getElementById("targets-maxMinutes") as HTMLInputElement;
    expect(minutes.value).toBe("");
    expect(await axeViolations()).toEqual([]);

    fireEvent.click(screen.getByRole("button", { name: i18n.t("freeText.apply") }));
    expect(screen.getByText(i18n.t("freeText.applied"))).toBeTruthy();
    expect(minutes.value).toBe("25");
    const korean = screen.getByLabelText<HTMLInputElement>(i18n.t("cuisine.korean"));
    expect(korean.checked).toBe(true);
    const name = (id: string) => foods.find((food) => food.id === id)?.names[locale] ?? id;
    expect(screen.getByRole("button", { name: i18n.t("conditions.foodSearch.remove", { food: name("garlic") }) })).toBeTruthy();
    expect(screen.getByRole("button", { name: i18n.t("conditions.foodSearch.remove", { food: name("carrot") }) })).toBeTruthy();
  });

  it("leaves the form unchanged when the result is discarded", async () => {
    const i18n = await openForm(locale);
    read(i18n, REQUESTS[locale].conditions);
    fireEvent.click(await screen.findByRole("button", { name: i18n.t("freeText.discard") }));
    expect(screen.getByText(i18n.t("freeText.discarded"))).toBeTruthy();
    expect((document.getElementById("targets-maxMinutes") as HTMLInputElement).value).toBe("");
  });

  it("points an allergy request to the allergen choices and reads nothing", async () => {
    const i18n = await openForm(locale);
    read(i18n, REQUESTS[locale].allergy);
    expect(await screen.findByText(i18n.t("freeText.outOfScope.allergens"))).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: i18n.t("freeText.goToAllergens") }));
    await vi.waitFor(() => {
      expect(document.activeElement?.getAttribute("name")).toBe("allergen");
    });
    expect(document.querySelectorAll("input[name=allergen]:checked")).toHaveLength(0);
  });

  it("says when nothing was found", async () => {
    const i18n = await openForm(locale);
    read(i18n, "???");
    expect(await screen.findByText(i18n.t("freeText.empty"))).toBeTruthy();
  });
});
