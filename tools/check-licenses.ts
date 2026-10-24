/**
 * Checks the licenses of every package in package-lock.json against tools/licenses.ts and
 * fails with one line per problem. Run by `npm run check`.
 *
 *   node tools/check-licenses.ts
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { licenseProblems, licenseSummary, type LockEntry } from "./licenses.ts";

const lockfile = JSON.parse(readFileSync(path.join(import.meta.dirname, "..", "package-lock.json"), "utf8")) as { packages: Record<string, LockEntry> };
const problems = licenseProblems(lockfile.packages);

if (problems.length > 0) {
  console.error(`License check failed with ${String(problems.length)} package(s):`);
  for (const problem of problems) console.error(`  ${problem.name}: ${problem.license} (${problem.scope})`);
  process.exit(1);
}
const summary = Object.entries(licenseSummary(lockfile.packages))
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([key, count]) => `${key} ${String(count)}`)
  .join(", ");
console.log(`Licenses allowed: ${summary}.`);
