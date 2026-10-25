/**
 * Extracts the composition subset used by the app (docs/en/DATA_SOURCES.md "Handling rules").
 *
 *   node tools/extract-composition.ts              write data/composition/foods.json
 *   node tools/extract-composition.ts --search 鶏卵  list matching food codes and names
 *
 * The original workbook is read from data/raw/ (git-ignored) and must match the
 * SHA-256 recorded in data/composition/manifest.json.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import * as z from "zod/mini";
import { compositionSourceSchema, compositionSubsetSchema, type CompositionSubset } from "../shared/composition.ts";
import { extractFoods, listFoods } from "./composition/extract.ts";
import { readWorksheet } from "./xlsx/sheet.ts";

const root = path.join(import.meta.dirname, "..");
const dataDir = path.join(root, "data", "composition");

const manifestSchema = z.object({
  source: compositionSourceSchema,
  rawFile: z.string(),
  requestedCodes: z.array(z.string().check(z.regex(/^\d{5}$/))),
});

const manifest = z.parse(manifestSchema, JSON.parse(readFileSync(path.join(dataDir, "manifest.json"), "utf8")));
const rawPath = path.join(root, manifest.rawFile);

let workbook: Buffer;
try {
  workbook = readFileSync(rawPath);
} catch {
  console.error(`Workbook not found: ${manifest.rawFile}\nDownload it from ${manifest.source.url} (see docs/en/DATA_SOURCES.md).`);
  process.exit(1);
}
const sha256 = createHash("sha256").update(workbook).digest("hex");
if (sha256 !== manifest.source.sha256) {
  console.error(`Checksum mismatch for ${manifest.rawFile}\n  expected ${manifest.source.sha256}\n  actual   ${sha256}`);
  process.exit(1);
}

const rows = readWorksheet(workbook, manifest.source.sheet);
const searchIndex = process.argv.indexOf("--search");

if (searchIndex >= 0) {
  const pattern = new RegExp(process.argv[searchIndex + 1] ?? "", "u");
  for (const food of listFoods(rows)) {
    if (pattern.test(food.nameJa.replace(/\u3000/g, " "))) {
      console.log(`${food.code}\t${food.nameJa.replace(/\u3000/g, " ")}`);
    }
  }
} else {
  const subset: CompositionSubset = { source: manifest.source, foods: extractFoods(rows, manifest.requestedCodes) };
  z.parse(compositionSubsetSchema, subset);
  writeFileSync(path.join(dataDir, "foods.json"), `${JSON.stringify(subset, null, 2)}\n`);
  console.log(`Wrote ${String(subset.foods.length)} foods to data/composition/foods.json`);
}
