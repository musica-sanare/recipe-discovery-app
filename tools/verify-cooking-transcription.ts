/**
 * Verifies data/composition/cooking.json against the text layer of the MEXT
 * explanation PDF (docs/DATA_SOURCES.md "Cooking tables"). macOS only: the PDF
 * text is read with PDFKit through tools/macos/pdf-page-text.swift.
 *
 *   node tools/verify-cooking-transcription.ts
 *
 * The text layer scrambles table columns, so the check is per page: the food
 * code and every transcribed number must occur on the page the entry cites.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import * as z from "zod/mini";
import { cookingDataSchema } from "../shared/cooking.ts";

const root = path.join(import.meta.dirname, "..");
const pdfPath = path.join(root, "data", "raw", "mext", "20260327-mxt_kagsei-mext-000029402_0001.pdf");
const cooking = z.parse(cookingDataSchema, JSON.parse(readFileSync(path.join(root, "data", "composition", "cooking.json"), "utf8")));

const sha256 = createHash("sha256").update(readFileSync(pdfPath)).digest("hex");
if (sha256 !== cooking.source.sha256) {
  console.error(`Checksum mismatch for the explanation PDF\n  expected ${cooking.source.sha256}\n  actual   ${sha256}`);
  process.exit(1);
}

interface Claim {
  readonly code: string;
  readonly page: number;
  readonly numbers: readonly (number | null | undefined)[];
}

const claims: Claim[] = [
  ...cooking.weightChangeRates.map((r) => ({ code: r.code, page: r.page, numbers: [r.ratePercent, r.coatedBasisPercent] })),
  ...cooking.fryingFat.map((r) => ({
    code: r.code,
    page: r.page,
    numbers: [r.cookedMass, r.coatedMass, r.coating?.flour, r.coating?.breadcrumbs, r.coating?.egg, r.fatChangeFromMain, r.fatChangeFromCoated, r.fatChangePer100gCooked],
  })),
  ...cooking.stirFryFat.map((r) => ({
    code: r.code,
    page: r.page,
    numbers: [r.cookedMass, r.oilUsed, r.fatChangeFromMain, r.fatChangeFromMainAndOil, r.fatChangePer100gCooked],
  })),
];

const pages = [...new Set(claims.map((claim) => claim.page))].sort((a, b) => a - b);
const output = execFileSync("swift", [path.join(root, "tools", "macos", "pdf-page-text.swift"), pdfPath, ...pages.map(String)], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "ignore"],
});
const textByPage = new Map<number, Set<string>>();
for (const block of output.split(/=====PAGE (\d+)=====\n/).slice(1).reduce<[number, string][]>((acc, part, i, all) => {
  if (i % 2 === 0) acc.push([Number(part), all[i + 1] ?? ""]);
  return acc;
}, [])) {
  // Tokens: numbers with optional sign/decimals, with or without parentheses.
  textByPage.set(block[0], new Set(block[1].match(/-?\d+(?:\.\d+)?/g) ?? []));
}

/** The PDF prints integers as "100" and decimals with one digit ("5.0", "-0.4", "99.7"). */
function formats(value: number): string[] {
  return Number.isInteger(value) ? [String(value), value.toFixed(1)] : [String(value), value.toFixed(1)];
}

let failures = 0;
for (const claim of claims) {
  const tokens = textByPage.get(claim.page);
  const missing = [claim.code, ...claim.numbers.filter((n): n is number => typeof n === "number").flatMap((n) => [formats(n)])]
    .filter((candidate) => (typeof candidate === "string" ? !tokens?.has(candidate) : !candidate.some((f) => tokens?.has(f))))
    .map((candidate) => (typeof candidate === "string" ? candidate : candidate[0]));
  if (missing.length > 0) {
    failures++;
    console.error(`page ${String(claim.page)} food ${claim.code}: not found in the text layer: ${missing.join(", ")}`);
  }
}
console.log(`${String(claims.length - failures)}/${String(claims.length)} entries verified against the PDF text layer`);
process.exit(failures > 0 ? 1 : 0);
