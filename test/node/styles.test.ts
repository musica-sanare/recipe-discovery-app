import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/*
 * jsdom cannot compute contrast, so the axe checks skip it; this test checks the
 * token pairs of src/styles.css instead (WCAG 2.2 AA: 4.5:1 for text, 3:1 for borders and focus rings),
 * including every status and text color on each pastel (ADR-037).
 */
const css = readFileSync(path.join(import.meta.dirname, "..", "..", "src", "styles.css"), "utf8");

function tokens(block: string): Map<string, string> {
  return new Map([...block.matchAll(/--color-([a-z-]+):\s*(#[0-9a-f]{6});/g)].map((match) => [match[1] ?? "", match[2] ?? ""]));
}

function blockAfter(marker: string): string {
  const start = css.indexOf(marker);
  if (start < 0) throw new Error(`Missing ${marker} in styles.css`);
  return css.slice(start, css.indexOf("}", start));
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255);
  const [r = 0, g = 0, b = 0] = channels.map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}

const TEXT = 4.5;
const NON_TEXT = 3;
const PASTELS = ["mint", "butter", "sky", "peach"] as const;
const PAIRS: readonly (readonly [string, string, number])[] = [
  ["text", "bg", TEXT],
  ["text", "surface", TEXT],
  ["text", "surface-muted", TEXT],
  ["muted", "bg", TEXT],
  ["muted", "surface", TEXT],
  ["muted", "surface-muted", TEXT],
  ["primary", "surface", TEXT],
  ["primary", "bg", TEXT],
  ["on-primary", "primary", TEXT],
  ["accent", "surface", TEXT],
  ["on-sun", "sun", TEXT],
  ["met", "surface", TEXT],
  ["near", "surface", TEXT],
  ["not-met", "surface", TEXT],
  ["unknown", "surface", TEXT],
  ["met", "surface-muted", TEXT],
  ["near", "surface-muted", TEXT],
  ["not-met", "surface-muted", TEXT],
  ["met", "bg", TEXT],
  ["near", "bg", TEXT],
  ["not-met", "bg", TEXT],
  ["warning", "warning-surface", TEXT],
  ["text", "warning-surface", TEXT],
  ...PASTELS.flatMap((pastel) => (["text", "muted", "met", "near", "not-met", "unknown"] as const).map((foreground) => [foreground, pastel, TEXT] as const)),
  ["border", "surface", NON_TEXT],
  ["border", "bg", NON_TEXT],
  ["focus", "surface", NON_TEXT],
  ["focus", "bg", NON_TEXT],
  ["focus", "surface-muted", NON_TEXT],
];

describe.each([
  ["light", tokens(blockAfter("@theme"))],
  ["dark", tokens(blockAfter("@media (prefers-color-scheme: dark)"))],
])("%s color tokens", (_scheme, palette) => {
  it("define every token used in the pairs", () => {
    const missing = PAIRS.flatMap(([a, b]) => [a, b]).filter((name) => !palette.has(name));
    expect(missing).toEqual([]);
  });

  it.each(PAIRS)("%s on %s reaches %s:1", (foreground, background, minimum) => {
    expect(contrast(palette.get(foreground) ?? "", palette.get(background) ?? "")).toBeGreaterThanOrEqual(minimum);
  });
});
