import { readFileSync } from "node:fs";
import path from "node:path";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";
import { THEME_STORAGE_KEY } from "../../src/theme/themePreference.ts";

/* The early script cannot import the app's module, so this runs the real file against the app's key and values (ADR-042). */
const code = readFileSync(path.join(import.meta.dirname, "..", "..", "public", "theme-init.js"), "utf8");

function run(getItem: (key: string) => string | null): string | undefined {
  const dataset: { theme?: string } = {};
  runInNewContext(code, { localStorage: { getItem }, document: { documentElement: { dataset } } });
  return dataset.theme;
}

describe("public/theme-init.js", () => {
  it.each(["light", "dark"])("applies a stored %s", (value) => {
    expect(run((key) => (key === THEME_STORAGE_KEY ? value : null))).toBe(value);
  });

  it.each([null, "system", "purple", ""])("leaves the page to the OS setting for %j", (value) => {
    expect(run(() => value)).toBeUndefined();
  });

  it("survives failing storage", () => {
    expect(
      run(() => {
        throw new Error("blocked");
      }),
    ).toBeUndefined();
  });

  it("stays out of the global scope of the page", () => {
    const sandbox: Record<string, unknown> = { localStorage: { getItem: () => "dark" }, document: { documentElement: { dataset: {} } } };
    runInNewContext(code, sandbox);
    expect(Object.keys(sandbox).sort()).toEqual(["document", "localStorage"]);
  });
});
