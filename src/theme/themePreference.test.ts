import { describe, expect, it } from "vitest";
import { applyTheme, isThemeChoice, readStoredTheme, storeTheme, THEME_STORAGE_KEY } from "./themePreference";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
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
  removeItem: (): void => {
    throw new Error("blocked");
  },
};

describe("theme preference", () => {
  it.each(["light", "dark"] as const)("reads and stores %s", (choice) => {
    const storage = memoryStorage();
    storeTheme(choice, storage);
    expect(storage.data.get(THEME_STORAGE_KEY)).toBe(choice);
    expect(readStoredTheme(storage)).toBe(choice);
  });

  it("stores nothing for system and removes an earlier choice", () => {
    const storage = memoryStorage({ [THEME_STORAGE_KEY]: "dark" });
    storeTheme("system", storage);
    expect(storage.data.size).toBe(0);
    expect(readStoredTheme(storage)).toBe("system");
  });

  it.each(["system", "purple", ""])("treats a stored %j as system", (value) => {
    expect(readStoredTheme(memoryStorage({ [THEME_STORAGE_KEY]: value }))).toBe("system");
  });

  it("survives failing or missing storage", () => {
    expect(readStoredTheme(throwingStorage)).toBe("system");
    expect(readStoredTheme(undefined)).toBe("system");
    expect(() => {
      storeTheme("dark", throwingStorage);
      storeTheme("system", throwingStorage);
      storeTheme("dark", undefined);
    }).not.toThrow();
  });

  it("recognizes the three choices only", () => {
    expect(["system", "light", "dark", "purple", undefined].map(isThemeChoice)).toEqual([true, true, true, false, false]);
  });

  it("sets data-theme for a choice and removes it for system", () => {
    const root: { dataset: Record<string, string | undefined> } = { dataset: {} };
    applyTheme("dark", root);
    expect(root.dataset.theme).toBe("dark");
    applyTheme("light", root);
    expect(root.dataset.theme).toBe("light");
    applyTheme("system", root);
    expect(root.dataset.theme).toBeUndefined();
  });
});
