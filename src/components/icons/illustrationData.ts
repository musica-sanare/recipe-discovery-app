/**
 * Original decorative illustrations (ADR-037 D4) on a 240 × 150 grid, drawn with the same
 * shape data as the icons: outlines in the text color, fills from the tokens, no text.
 */
import { circle, type Shape } from "./iconData";

const STEAM = "M60 36c5-9 5-15 0-22M82 36c5-9 5-15 0-22M104 36c5-9 5-15 0-22";
const SUN: readonly Shape[] = [
  { d: circle(196, 34, 18), fill: "sun", stroke: false },
  { d: "M196 6v6M196 56v6M168 34h6M218 34h6M176 14l4 4M212 50l4 4M216 14l-4 4M180 50l-4 4" },
];

export const ILLUSTRATIONS = {
  /** A bowl of food under the sun, next to the targets heading. */
  hero: [
    ...SUN,
    { d: "M24 86c3 34 42 54 94 54s91-20 94-54z", fill: "mint" },
    { d: "M48 84c6-18 24-24 37-15 9-13 29-13 35 2 13-9 33-2 35 13", fill: "peach" },
    { d: circle(74, 72, 10), fill: "accent", stroke: false },
    { d: circle(160, 70, 8), fill: "accent", stroke: false },
    { d: "M104 66c-4-15 7-28 22-30-1 15-9 26-22 30z", fill: "primary", stroke: false },
    { d: "M119 78c0-3.3 4-6 9-6s9 2.7 9 6-4 6-9 6-9-2.7-9-6z", fill: "butter" },
    { d: STEAM },
    { d: "M30 128c10 6 20 6 30 0s20-6 30 0" },
  ],
  /** An empty plate with a fork and a leaf: no candidates. */
  no_results: [
    { d: "M40 100c0-22 36-40 80-40s80 18 80 40-36 40-80 40-80-18-80-40z", fill: "surface" },
    { d: "M68 100c0-12 23-22 52-22s52 10 52 22-23 22-52 22-52-10-52-22z", fill: "butter" },
    { d: "M212 50v40M206 50v14c0 4 3 6 6 6s6-2 6-6V50M212 90v46" },
    { d: "M24 74c4-20 22-30 40-26-2 18-20 30-40 26z", fill: "mint" },
    { d: "M24 74c12-8 22-14 34-22" },
  ],
  /** An empty basket: the shopping list is empty. */
  empty_list: [
    { d: "M50 70h140l-14 62c-1 5-6 8-11 8H75c-5 0-10-3-11-8z", fill: "butter" },
    { d: "M84 70l26-46M156 70l-26-46M92 90v32M120 90v32M148 90v32" },
    { d: "M176 40c4-16 20-24 34-20-2 14-18 24-34 20z", fill: "mint" },
    { d: "M176 40c10-6 18-12 28-18" },
  ],
  /** A magnifier over a bare plate: the recipe was not found. */
  not_found: [
    { d: "M30 112c0-14 30-26 70-26s70 12 70 26-30 26-70 26-70-12-70-26z", fill: "surface" },
    { d: circle(150, 60, 30), fill: "sky" },
    { d: "M171 81l30 30" },
    { d: "M140 50c4-6 12-8 18-4" },
  ],
  /** A tipped pot with a spill: the content could not be loaded. */
  content_error: [
    { d: "M60 60l70-30 22 50c3 8-1 16-9 19l-36 16c-8 3-16-1-19-9z", fill: "peach" },
    { d: "M52 64l12-5M128 32l12-5" },
    { d: "M110 118c20-6 50-4 80 4 10 3 12 10 0 12-30 4-60 4-84-2-8-2-6-11 4-14z", fill: "butter" },
    { d: circle(168, 112, 4), fill: "accent", stroke: false },
  ],
  /** A cutting board with a tomato, a leaf, and an egg: the about page. */
  about: [
    { d: "M30 96h170c6 0 10 4 10 10v14c0 6-4 10-10 10H30c-6 0-10-4-10-10v-14c0-6 4-10 10-10z", fill: "peach" },
    { d: "M210 104h14c4 0 6 3 6 7s-2 7-6 7h-14" },
    { d: circle(76, 74, 22), fill: "accent" },
    { d: "M68 52c4 2 8 2 12-2 2 4 6 4 10 2" },
    { d: "M150 94c-2-16 4-34 16-42 4 16-2 34-16 42z", fill: "primary" },
    { d: "M118 76c0-10 6-22 13-22s13 12 13 22-6 18-13 18-13-8-13-18z", fill: "butter" },
    ...SUN,
  ],
} as const satisfies Readonly<Record<string, readonly Shape[]>>;

export type IllustrationName = keyof typeof ILLUSTRATIONS;
export const ILLUSTRATION_NAMES = Object.keys(ILLUSTRATIONS) as IllustrationName[];
