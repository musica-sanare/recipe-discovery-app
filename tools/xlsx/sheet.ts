/**
 * Reads cell text from SpreadsheetML (.xlsx) parts. Handles shared strings
 * (ignoring phonetic `rPh` runs), inline strings, and plain values; formatting
 * and formulas are ignored. Sufficient for the MEXT workbook, not a general parser.
 */
import { readZipEntries } from "./zip.ts";

const ENTITIES: Readonly<Record<string, string>> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };

export function decodeXml(text: string): string {
  return text.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-z]+);/g, (match, entity: string) => {
    if (entity.startsWith("#x")) {
      return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
    }
    if (entity.startsWith("#")) {
      return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
    }
    return ENTITIES[entity] ?? match;
  });
}

function textRuns(xml: string): string {
  const withoutPhonetics = xml.replace(/<rPh\b[\s\S]*?<\/rPh>/g, "");
  return [...withoutPhonetics.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map((m) => decodeXml(m[1] ?? "")).join("");
}

export function parseSharedStrings(xml: string): string[] {
  return [...xml.matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)].map((m) => textRuns(m[1] ?? ""));
}

function attribute(attributes: string, name: string): string | undefined {
  return new RegExp(`\\b${name}="([^"]*)"`).exec(attributes)?.[1];
}

export function columnIndex(reference: string): number {
  const letters = /^[A-Z]+/.exec(reference)?.[0];
  if (!letters) {
    throw new Error(`Invalid cell reference: ${reference}`);
  }
  let index = 0;
  for (const letter of letters) {
    index = index * 26 + letter.charCodeAt(0) - 64;
  }
  return index - 1;
}

/** Returns rows as dense string arrays; empty cells are "". */
export function parseSheetRows(xml: string, sharedStrings: readonly string[]): string[][] {
  const rows: string[][] = [];
  for (const rowMatch of xml.matchAll(/<row\b[^>]*?(?:\/>|>([\s\S]*?)<\/row>)/g)) {
    const row: string[] = [];
    for (const cell of (rowMatch[1] ?? "").matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const attributes = cell[1] ?? "";
      const body = cell[2] ?? "";
      const reference = attribute(attributes, "r");
      if (!reference) {
        throw new Error("Cell without a reference is not supported");
      }
      const type = attribute(attributes, "t");
      const value = /<v>([\s\S]*?)<\/v>/.exec(body)?.[1];
      let text = "";
      if (type === "s" && value !== undefined) {
        const shared = sharedStrings[Number(value)];
        if (shared === undefined) {
          throw new Error(`Missing shared string ${value}`);
        }
        text = shared;
      } else if (type === "inlineStr") {
        text = textRuns(body);
      } else if (value !== undefined) {
        text = decodeXml(value);
      }
      const index = columnIndex(reference);
      while (row.length < index) {
        row.push("");
      }
      row[index] = text;
    }
    rows.push(row);
  }
  return rows;
}

function readPart(entries: ReadonlyMap<string, Buffer>, name: string): string {
  const part = entries.get(name);
  if (!part) {
    throw new Error(`Workbook part not found: ${name}`);
  }
  return part.toString("utf8");
}

/** Reads one worksheet, selected by its tab name, from an .xlsx buffer. */
export function readWorksheet(xlsx: Buffer, sheetName: string): string[][] {
  const entries = readZipEntries(xlsx);
  const workbook = readPart(entries, "xl/workbook.xml");
  const sheet = [...workbook.matchAll(/<sheet\b([^>]*)\/>/g)]
    .map((m) => m[1] ?? "")
    .find((attributes) => decodeXml(attribute(attributes, "name") ?? "") === sheetName);
  const relationId = sheet && /\br:id="([^"]*)"/.exec(sheet)?.[1];
  if (!relationId) {
    throw new Error(`Worksheet not found: ${sheetName}`);
  }
  const relations = readPart(entries, "xl/_rels/workbook.xml.rels");
  const target = [...relations.matchAll(/<Relationship\b([^>]*)\/>/g)]
    .map((m) => m[1] ?? "")
    .find((attributes) => attribute(attributes, "Id") === relationId);
  const targetPath = target && attribute(target, "Target");
  if (!targetPath) {
    throw new Error(`Worksheet relation not found: ${relationId}`);
  }
  const path = targetPath.startsWith("/") ? targetPath.slice(1) : `xl/${targetPath}`;
  const shared = entries.has("xl/sharedStrings.xml") ? parseSharedStrings(readPart(entries, "xl/sharedStrings.xml")) : [];
  return parseSheetRows(readPart(entries, path), shared);
}
