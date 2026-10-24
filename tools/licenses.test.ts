import { describe, expect, it } from "vitest";
import { DEVELOPMENT_LICENSES, PRODUCTION_LICENSES, licenseAllowed, licenseProblems } from "./licenses.ts";

describe("license policy", () => {
  it("evaluates SPDX OR and AND expressions", () => {
    expect(licenseAllowed("MIT", PRODUCTION_LICENSES)).toBe(true);
    expect(licenseAllowed("(MIT OR GPL-3.0)", PRODUCTION_LICENSES)).toBe(true);
    expect(licenseAllowed("(MIT AND GPL-3.0)", PRODUCTION_LICENSES)).toBe(false);
    expect(licenseAllowed("", PRODUCTION_LICENSES)).toBe(false);
  });

  it("allows the development-only licenses only for development dependencies", () => {
    const packages = {
      "": {},
      "node_modules/react": { license: "MIT" },
      "node_modules/axe-core": { license: "MPL-2.0", dev: true },
      "node_modules/shipped-mpl": { license: "MPL-2.0" },
      "node_modules/no-license": { dev: true },
      "node_modules/copyleft": { license: "GPL-3.0", dev: true },
      "node_modules/local": { link: true },
    };
    expect(licenseProblems(packages)).toEqual([
      { name: "copyleft", license: "GPL-3.0", scope: "development" },
      { name: "no-license", license: "(none)", scope: "development" },
      { name: "shipped-mpl", license: "MPL-2.0", scope: "production" },
    ]);
    expect(DEVELOPMENT_LICENSES.has("CC-BY-4.0")).toBe(true);
    expect(PRODUCTION_LICENSES.has("CC-BY-4.0")).toBe(false);
  });
});
