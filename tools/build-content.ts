/**
 * Writes the content bundles (ADR-027) to generated/content/ and prints their
 * sizes. Run by `npm run build` and `npm run dev` after content validation. The
 * app imports the files with Vite's `?url`, which adds a content hash to each name.
 *
 *   node tools/build-content.ts
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";
import * as z from "zod/mini";
import { foods } from "../content/foods.ts";
import { recipes } from "../content/recipes/index.ts";
import { CONTENT_VERSION } from "../content/version.ts";
import { calcBundleSchema, textBundleSchema } from "../shared/bundle.ts";
import { compositionSubsetSchema } from "../shared/composition.ts";
import { cookingDataSchema } from "../shared/cooking.ts";
import { SUPPORTED_LOCALES } from "../shared/locales.ts";
import { buildCalcBundle, buildTextBundle, serializeBundle, type BundleInput } from "./content/bundle.ts";

const root = path.join(import.meta.dirname, "..");
const readJson = (name: string): unknown => JSON.parse(readFileSync(path.join(root, "data", "composition", name), "utf8"));
const outDir = path.join(root, "generated", "content");

const input: BundleInput = {
  foods,
  recipes,
  composition: z.parse(compositionSubsetSchema, readJson("foods.json")),
  cooking: z.parse(cookingDataSchema, readJson("cooking.json")),
  contentVersion: CONTENT_VERSION,
};

const files: [string, string][] = [["calc.json", serializeBundle(z.parse(calcBundleSchema, buildCalcBundle(input)))]];
for (const locale of SUPPORTED_LOCALES) {
  files.push([`text-${locale}.json`, serializeBundle(z.parse(textBundleSchema, buildTextBundle(input, locale)))]);
}

mkdirSync(outDir, { recursive: true });
for (const [name, json] of files) {
  writeFileSync(path.join(outDir, name), json);
  const bytes = Buffer.byteLength(json);
  console.log(`generated/content/${name.padEnd(13)} ${(bytes / 1024).toFixed(1).padStart(6)} KiB, gzip ${(gzipSync(json).length / 1024).toFixed(1).padStart(5)} KiB`);
}
