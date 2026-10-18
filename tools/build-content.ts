/**
 * Writes the content bundles (ADR-027) to generated/content/ and prints their
 * sizes. Run by `npm run build` and `npm run dev` after content validation. The
 * app imports the files with Vite's `?url`, which adds a content hash to each name.
 *
 *   node tools/build-content.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";
import * as z from "zod/mini";
import { calcBundleSchema, textBundleSchema } from "../shared/bundle.ts";
import { SUPPORTED_LOCALES } from "../shared/locales.ts";
import { buildCalcBundle, buildTextBundle, serializeBundle } from "./content/bundle.ts";
import { repositoryBundleInput } from "./content/repository.ts";

const outDir = path.join(import.meta.dirname, "..", "generated", "content");
const input = repositoryBundleInput();

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
