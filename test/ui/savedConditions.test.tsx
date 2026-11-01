// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Locale } from "../../shared/locales.ts";
import { App } from "../../src/App.tsx";
import { fixtureFetch, fixtureUrls } from "../../src/content/bundleFixtures.ts";
import { createI18n } from "../../src/i18n/createI18n.ts";
import { search } from "../../src/state/recommendation.ts";
import { SAVED_CONDITIONS_STORAGE_KEY } from "../../src/state/savedConditions.ts";
import { axeViolations } from "../../src/testing/axe.ts";

// Opt-in saved conditions (ADR-036) in every locale: switch, restore, notices, delete.

vi.mock("../../src/state/recommendation.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../src/state/recommendation.ts")>();
  return { ...actual, search: vi.fn(actual.search) };
});

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(fixtureFetch));
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
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.mocked(search).mockClear();
});

const LOCALES = ["ja", "en", "es", "fr"] as const;

async function open(locale: Locale) {
  const i18n = createI18n(locale);
  render(
    <I18nextProvider i18n={i18n}>
      <App contentUrls={fixtureUrls} />
    </I18nextProvider>,
  );
  await screen.findByRole("heading", { level: 1 });
  const details = document.querySelector<HTMLDetailsElement>("#targets-advanced");
  if (details) details.open = true;
  return i18n.t.bind(i18n);
}

/** A new page load: the app state is gone, the storage stays. */
async function reload(locale: Locale) {
  cleanup();
  return open(locale);
}

const field = (name: string) => document.getElementById(`targets-${name}`) as HTMLInputElement;
const checkbox = (name: string) => screen.getByRole("checkbox", { name });
const stored = () => localStorage.getItem(SAVED_CONDITIONS_STORAGE_KEY);
const submit = () => {
  fireEvent.click(document.querySelector("button[type=submit]") as HTMLElement);
};

describe.each(LOCALES)("saved conditions (%s)", (locale) => {
  it("stores nothing new while saving is off", async () => {
    const t = await open(locale);
    fireEvent.change(field("maxMinutes"), { target: { value: "25" } });
    submit();
    await screen.findByRole("heading", { level: 1, name: t("nav.views.candidates") });
    expect(stored()).toBeNull();
    expect(Object.keys(localStorage).filter((key) => key !== "recipe-discovery.locale")).toEqual([]);
  });

  it("saves on opt-in and on search, restores after a reload without searching, and passes axe", async () => {
    let t = await open(locale);
    expect(checkbox(t("saved.save"))).toHaveProperty("checked", false);
    expect(screen.queryByRole("checkbox", { name: t("saved.allergens") })).toBeNull();
    fireEvent.click(checkbox(t("saved.save")));
    expect(stored()).not.toBeNull();

    fireEvent.change(field("maxMinutes"), { target: { value: "25" } });
    fireEvent.click(screen.getByRole("radio", { name: new RegExp(t("preset.cut")) }));
    fireEvent.click(checkbox(t("allergen.names.egg")));
    submit();
    await screen.findByRole("heading", { level: 1, name: t("nav.views.candidates") });
    const typed = vi.mocked(search).mock.calls[0]?.[0];
    expect(JSON.parse(stored() ?? "{}")).not.toHaveProperty("allergens");

    t = await reload(locale);
    expect(screen.getByText(t("saved.restored"))).toBeDefined();
    expect(field("maxMinutes").value).toBe("25");
    expect(checkbox(t("saved.save"))).toHaveProperty("checked", true);
    expect(checkbox(t("allergen.names.egg"))).toHaveProperty("checked", false);
    expect(vi.mocked(search)).toHaveBeenCalledTimes(1);
    expect(await axeViolations(document.body)).toEqual([]);

    fireEvent.click(checkbox(t("allergen.names.egg")));
    submit();
    await screen.findByRole("heading", { level: 1, name: t("nav.views.candidates") });
    // The same request as the first search: the egg allergen was not saved, so it was ticked again.
    expect(vi.mocked(search).mock.calls[1]?.[0]).toEqual(typed);
  });

  it("saves allergens only with their own checkbox", async () => {
    let t = await open(locale);
    fireEvent.click(checkbox(t("saved.save")));
    fireEvent.click(checkbox(t("allergen.names.wheat")));
    fireEvent.click(checkbox(t("saved.allergens")));
    expect(JSON.parse(stored() ?? "{}")).toHaveProperty("allergens", ["wheat"]);

    t = await reload(locale);
    expect(checkbox(t("allergen.names.wheat"))).toHaveProperty("checked", true);
    expect(checkbox(t("saved.allergens"))).toHaveProperty("checked", true);

    fireEvent.click(checkbox(t("saved.allergens")));
    expect(JSON.parse(stored() ?? "{}")).not.toHaveProperty("allergens");
  });

  it("deletes the record when saving is turned off or deleted", async () => {
    let t = await open(locale);
    fireEvent.click(checkbox(t("saved.save")));
    fireEvent.click(checkbox(t("saved.save")));
    expect(stored()).toBeNull();
    expect(screen.getByText(t("saved.deleted"))).toBeDefined();

    fireEvent.click(checkbox(t("saved.save")));
    t = await reload(locale);
    const [notice] = screen.getAllByRole("button", { name: t("saved.delete") });
    fireEvent.click(notice as HTMLElement);
    expect(stored()).toBeNull();
    expect(screen.queryByText(t("saved.restored"))).toBeNull();
    expect(checkbox(t("saved.save"))).toHaveProperty("checked", false);

    t = await reload(locale);
    expect(field("maxMinutes").value).toBe("");
    expect(screen.queryByText(t("saved.restored"))).toBeNull();
  });

  it("drops items that no longer exist with a notice", async () => {
    localStorage.setItem(
      SAVED_CONDITIONS_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        preset: "maintain",
        numbers: { kcalMin: "550", kcalMax: "750", proteinMin: "30", fatMax: "20", carbohydrateMin: "", carbohydrateMax: "", maxMinutes: "30", servings: "1" },
        cuisines: ["atlantean"],
        equipmentMode: "no_limit",
        equipment: [],
        required: ["unicorn_fillet"],
        excluded: ["potato"],
      }),
    );
    const t = await open(locale);
    expect(screen.getByText(t("saved.dropped", { count: 2 }))).toBeDefined();
    expect(field("maxMinutes").value).toBe("30");
    expect(await axeViolations(document.body)).toEqual([]);
  });

  it("opens More conditions only when restored values are inside it (ADR-037 D6)", async () => {
    const record = (extra: object) =>
      JSON.stringify({
        version: 1,
        preset: "maintain",
        numbers: { kcalMin: "550", kcalMax: "750", proteinMin: "30", fatMax: "20", carbohydrateMin: "", carbohydrateMax: "", maxMinutes: "30", servings: "1" },
        cuisines: [],
        equipmentMode: "no_limit",
        equipment: [],
        required: [],
        excluded: [],
        ...extra,
      });
    // Rendered without the `open` helper, which opens the section itself.
    const i18n = createI18n(locale);
    const show = async () => {
      render(
        <I18nextProvider i18n={i18n}>
          <App contentUrls={fixtureUrls} />
        </I18nextProvider>,
      );
      await screen.findByRole("heading", { level: 1 });
      return document.querySelector<HTMLDetailsElement>("#targets-advanced")?.open;
    };
    localStorage.setItem(SAVED_CONDITIONS_STORAGE_KEY, record({}));
    expect(await show()).toBe(false);

    cleanup();
    localStorage.setItem(SAVED_CONDITIONS_STORAGE_KEY, record({ excluded: ["potato"] }));
    expect(await show()).toBe(true);
    const t = i18n.t.bind(i18n);
    for (const group of ["targets", "cooking", "foods", "allergens"]) {
      expect(screen.getByRole("heading", { level: 2, name: t(`targets.groups.${group}`) })).toBeDefined();
    }
  });

  it("deletes an invalid record silently", async () => {
    localStorage.setItem(SAVED_CONDITIONS_STORAGE_KEY, "{broken");
    const t = await open(locale);
    expect(stored()).toBeNull();
    expect(screen.queryByText(t("saved.restored"))).toBeNull();
    expect(checkbox(t("saved.save"))).toHaveProperty("checked", false);
  });

  it("says when the browser refuses to save and keeps working", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("full", "QuotaExceededError");
    });
    const t = await open(locale);
    fireEvent.click(checkbox(t("saved.save")));
    expect(screen.getByText(t("saved.writeFailed"))).toBeDefined();
    expect(checkbox(t("saved.save"))).toHaveProperty("checked", false);
    expect(await axeViolations(document.body)).toEqual([]);
    submit();
    await screen.findByRole("heading", { level: 1, name: t("nav.views.candidates") });
  });
});
