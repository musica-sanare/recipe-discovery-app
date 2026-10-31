import { describe, expect, it } from "vitest";
import { detectBrowserLocale, LOCALE_STORAGE_KEY, readStoredLocale, resolveInitialLocale, storeLocale } from "./localePreference";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
}

const throwingStorage = {
  getItem: (): string | null => {
    throw new Error("blocked");
  },
  setItem: (): void => {
    throw new Error("blocked");
  },
};

describe("locale preference", () => {
  it("prefers a valid stored locale", () => {
    expect(resolveInitialLocale(memoryStorage({ [LOCALE_STORAGE_KEY]: "es" }), ["en-US"])).toBe("es");
  });

  it("ignores an invalid stored value and uses the browser language", () => {
    expect(resolveInitialLocale(memoryStorage({ [LOCALE_STORAGE_KEY]: "de" }), ["de-DE", "es-MX"])).toBe("es");
  });

  it("falls back to Japanese", () => {
    expect(resolveInitialLocale(memoryStorage(), ["de-DE"])).toBe("ja");
    expect(resolveInitialLocale(undefined, [])).toBe("ja");
  });

  it("matches the primary language case-insensitively", () => {
    expect(detectBrowserLocale(["EN-gb"])).toBe("en");
    expect(detectBrowserLocale(["fr-CA"])).toBe("fr");
  });

  it("survives unavailable storage", () => {
    expect(readStoredLocale(throwingStorage)).toBeUndefined();
    expect(() => {
      storeLocale("en", throwingStorage);
    }).not.toThrow();
  });

  it("stores the chosen locale", () => {
    const storage = memoryStorage();
    storeLocale("en", storage);
    expect(storage.getItem(LOCALE_STORAGE_KEY)).toBe("en");
  });
});
