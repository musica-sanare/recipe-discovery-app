/**
 * Dependency license policy (docs/working/DECISIONS.md "Stage 5.1 release plan" P6, "Stage 5.5").
 * Production dependencies end up in the browser bundle; development dependencies only
 * run at build and test time and may also use the licenses listed for them.
 */
export const PRODUCTION_LICENSES: ReadonlySet<string> = new Set(["MIT", "ISC", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "0BSD"]);
export const DEVELOPMENT_LICENSES: ReadonlySet<string> = new Set([...PRODUCTION_LICENSES, "MPL-2.0", "BlueOak-1.0.0", "MIT-0", "CC0-1.0", "CC-BY-4.0"]);

/** One `packages` entry of package-lock.json (lockfile version 3). */
export interface LockEntry {
  readonly license?: string;
  readonly dev?: boolean;
  readonly link?: boolean;
}

export interface LicenseProblem {
  readonly name: string;
  readonly license: string;
  readonly scope: "production" | "development";
}

/** An SPDX expression is allowed when every `AND` part has an allowed `OR` alternative. */
export function licenseAllowed(expression: string, allowed: ReadonlySet<string>): boolean {
  const normalized = expression.replace(/[()]/g, " ").trim();
  if (normalized === "") return false;
  return normalized.split(/\s+AND\s+/).every((part) => part.split(/\s+OR\s+/).some((license) => allowed.has(license.trim())));
}

/** The packages whose license is missing or not allowed for their scope, sorted by name. */
export function licenseProblems(packages: Readonly<Record<string, LockEntry>>): LicenseProblem[] {
  return Object.entries(packages)
    .flatMap(([path, entry]): LicenseProblem[] => {
      if (path === "" || entry.link === true) return [];
      const name = path.replace(/^.*node_modules\//, "");
      const scope = entry.dev === true ? "development" : "production";
      const license = entry.license ?? "";
      return licenseAllowed(license, scope === "production" ? PRODUCTION_LICENSES : DEVELOPMENT_LICENSES) ? [] : [{ name, license: license || "(none)", scope }];
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Package count per license and scope, for the summary line. */
export function licenseSummary(packages: Readonly<Record<string, LockEntry>>): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const [path, entry] of Object.entries(packages)) {
    if (path === "" || entry.link === true) continue;
    const key = `${entry.dev === true ? "dev" : "prod"} ${entry.license ?? "(none)"}`;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}
