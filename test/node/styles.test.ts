import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/*
 * jsdom cannot compute contrast, so the axe checks skip it; this test checks the
 * token pairs of src/styles.css instead (WCAG 2.2 AA: 4.5:1 for text, 3:1 for borders and focus rings),
 * including every status and text color on each pastel (ADR-037) and the warning colors,
 * which must differ from every pastel (ADR-041 D2).
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

function oklab(hex: string): readonly [number, number, number] {
  const [r = 0, g = 0, b = 0] = [1, 3, 5].map((index) => {
    const value = Number.parseInt(hex.slice(index, index + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}

/** Euclidean distance in OKLab; the light pastels are about 0.06 apart from each other. */
function oklabDistance(a: string, b: string): number {
  const [x, y] = [oklab(a), oklab(b)];
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
}

/** Fills of nutrient tiles: the four pastels and salt equivalent on `surface-muted`. */
const NUTRIENT_FILLS = ["mint", "butter", "sky", "lilac", "surface-muted"] as const;
const MIN_WARNING_DISTANCE = 0.04;

const TEXT = 4.5;
const NON_TEXT = 3;
const PASTELS = ["mint", "butter", "sky", "peach", "lilac"] as const;
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
  ["muted", "warning-surface", TEXT],
  ["warning-edge", "warning-surface", NON_TEXT],
  ["warning-edge", "surface", NON_TEXT],
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

  it("keep the warning surface visibly apart from every nutrient fill", () => {
    const surface = palette.get("warning-surface") ?? "";
    const close = NUTRIENT_FILLS.filter((fill) => oklabDistance(palette.get(fill) ?? "", surface) < MIN_WARNING_DISTANCE);
    expect(close).toEqual([]);
  });

  it.each(PAIRS)("%s on %s reaches %s:1", (foreground, background, minimum) => {
    expect(contrast(palette.get(foreground) ?? "", palette.get(background) ?? "")).toBeGreaterThanOrEqual(minimum);
  });
});
