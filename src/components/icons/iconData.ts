/**
 * Original two-tone icons (ADR-037 D3, docs/en/UI_DESIGN.md §5): 24 px grid, 1.8 px round
 * strokes in the text color, pastel fills. Shapes are data so that tests and the showcase
 * script can read them; no shape contains text.
 */

export type Fill = "mint" | "butter" | "sky" | "peach" | "ink" | "surface" | "primary" | "accent" | "sun";

export interface Shape {
  readonly d: string;
  readonly fill?: Fill;
  /** Defaults to true; a filled dot or blob may leave the outline out. */
  readonly stroke?: boolean;
  readonly dashed?: boolean;
  /** A stroke drawn in the surface color, for marks on a filled shape. */
  readonly knockout?: boolean;
}

/** A circle as a path, so that every shape is one `d` string. */
export function circle(cx: number, cy: number, r: number): string {
  return `M${String(cx - r)} ${String(cy)}a${String(r)} ${String(r)} 0 1 0 ${String(2 * r)} 0a${String(r)} ${String(r)} 0 1 0 ${String(-2 * r)} 0z`;
}

export const ICONS = {
  // Protein groups
  chicken: [
    { d: "M14.5 4c3.4 0 6 2.8 5.5 6.2-.4 2.6-2.7 4.4-5.3 4.2l-3.8 3.8c.4 1.3-.7 2.4-2 2-.5 1-2 1-2.4-.2-1.1-.3-1.3-1.9-.3-2.5-.5-1.2.7-2.3 2-1.9l3.8-3.8C11.7 9.2 12.3 4 14.5 4z", fill: "peach" },
  ],
  pork: [
    { d: "M6.2 8.4 5 4.5l4 2M17.8 8.4 19 4.5l-4 2", fill: "peach" },
    { d: circle(12, 13, 7.5), fill: "peach" },
    { d: "M9 15.5c0-1.4 1.3-2.4 3-2.4s3 1 3 2.4-1.3 2.4-3 2.4-3-1-3-2.4z", fill: "surface" },
    { d: circle(10.9, 15.5, 0.6), fill: "ink", stroke: false },
    { d: circle(13.1, 15.5, 0.6), fill: "ink", stroke: false },
  ],
  beef: [
    { d: "M5 9.5C6 5.6 10.7 4 14.8 5c4.1 1 6 4.2 5 7.6-1 3.8-4.4 6.4-9 6.4-4.2 0-6.9-4.4-5.8-9.5z", fill: "peach" },
    { d: "M8.5 10.5c1.8-1.6 4.4-2 6.6-1 1.5.7 1.9 2.4.8 3.6" },
    { d: circle(10.5, 14.2, 1.3) },
  ],
  fish: [
    { d: "M3 12c3-4.5 9-5.8 13.5-1.3L20.5 8l-.8 4 .8 4-4-2.7C12 17.8 6 16.5 3 12z", fill: "sky" },
    { d: circle(7.8, 11.2, 1), fill: "ink", stroke: false },
    { d: "M11 9.5c.8 1.5.8 3.5 0 5" },
  ],
  egg: [{ d: "M12 3.5c3.6 0 6.3 5.6 6.3 9.6 0 3.9-2.8 6.9-6.3 6.9s-6.3-3-6.3-6.9C5.7 9.1 8.4 3.5 12 3.5z", fill: "butter" }],
  soy: [
    { d: "M4.5 17.5C3 13 6.5 6.8 12.5 5c4.3-1.3 7.5.3 7 3.5-.6 4.4-5.4 9.5-11 10.3-2 .3-3.5-.2-4-1.3z", fill: "mint" },
    { d: circle(9, 14.5, 1.8) },
    { d: circle(12.6, 11.6, 1.8) },
    { d: circle(16, 8.6, 1.8) },
  ],

  // Equipment
  stove: [
    { d: "M3.5 9.5h17v10h-17z", fill: "surface" },
    { d: circle(8.5, 6.5, 2.5), fill: "butter" },
    { d: circle(15.5, 6.5, 2.5), fill: "butter" },
    { d: "M7 13.5h10M8 16.5h.01M12 16.5h.01M16 16.5h.01" },
  ],
  microwave: [
    { d: "M3 5.5h18v13H3z", fill: "sky" },
    { d: "M5.5 8h9.5v8H5.5z", fill: "surface" },
    { d: circle(18, 10, 1.1) },
    { d: "M17 14h2" },
  ],
  oven_toaster: [
    { d: "M3.5 7h17v11h-17z", fill: "butter" },
    { d: "M6 9.5h8.5v6H6z", fill: "surface" },
    { d: "M7.5 12.5h5.5M17.5 10.5h.01M17.5 14.5h.01M5.5 18v1.5M18.5 18v1.5" },
  ],
  pot: [
    { d: "M5 10h14v6.5c0 1.9-1.6 3.5-3.5 3.5h-7C6.6 20 5 18.4 5 16.5z", fill: "peach" },
    { d: "M3 11.5h2M19 11.5h2M4.5 8h15M10.5 5.5h3" },
  ],
  frying_pan: [
    { d: "M3 10.5h13.5c0 4-2.8 7-6.75 7S3 14.5 3 10.5z", fill: "peach" },
    { d: "M16.5 11.5 21 10" },
  ],
  deep_pan: [
    { d: "M3 8.5h13l-1 7.5c-.3 2-1.9 3.5-4 3.5H8c-2.1 0-3.7-1.5-4-3.5z", fill: "sky" },
    { d: "M16 10.5l5-2" },
  ],

  // Conditions
  time: [
    { d: circle(12, 12, 8.5), fill: "butter" },
    { d: "M12 7.5V12l3 2" },
  ],
  effort: [
    { d: "M12 21v-7" },
    { d: "M12 14c-3 0-5-3.4-5-6.5S9.2 3 12 3s5 1.4 5 4.5-2 6.5-5 6.5z", fill: "mint" },
    { d: "M12 14c-1.4 0-2.3-3.4-2.3-6.5S10.6 3 12 3s2.3 1.4 2.3 4.5S13.4 14 12 14z" },
  ],
  servings: [
    { d: "M2.5 11h9c0 3-2 5-4.5 5s-4.5-2-4.5-5z", fill: "mint" },
    { d: "M12.5 13h9c0 3-2 5-4.5 5s-4.5-2-4.5-5z", fill: "butter" },
    { d: "M5 8.5c0-1 1-1.5 1-2.5M9 8.5c0-1 1-1.5 1-2.5M15 10.5c0-1 1-1.5 1-2.5M19 10.5c0-1 1-1.5 1-2.5" },
  ],

  // Actions
  search: [
    { d: circle(10.5, 10.5, 6), fill: "mint" },
    { d: "M15 15l5 5" },
  ],
  save: [{ d: "M7 4h10c.6 0 1 .4 1 1v15l-6-3.8L6 20V5c0-.6.4-1 1-1z", fill: "sky" }],
  delete: [
    { d: "M6 7.5h12l-1 11.5c-.1 1-.9 1.5-1.8 1.5H8.8c-.9 0-1.7-.5-1.8-1.5z", fill: "peach" },
    { d: "M4 7.5h16M9.5 7.5V5h5v2.5M10 11v6M14 11v6" },
  ],
  compare: [
    { d: "M3.5 5h7v14h-7z", fill: "mint" },
    { d: "M13.5 5h7v14h-7z", fill: "butter" },
    { d: "M5.5 9h3M5.5 12h3M15.5 9h3M15.5 12h3" },
  ],
  shopping: [
    { d: "M4 9.5h16l-1.6 9c-.2.9-.9 1.5-1.8 1.5H7.4c-.9 0-1.6-.6-1.8-1.5z", fill: "butter" },
    { d: "M8 9.5 11 4M16 9.5 13 4M9 13v3.5M12 13v3.5M15 13v3.5" },
  ],
  copy: [
    { d: "M8.5 8.5h11v11h-11z", fill: "sky" },
    { d: "M15.5 8.5V4.5h-11v11h4" },
  ],
  print: [
    { d: "M3.5 9h17v7.5h-17z", fill: "sky" },
    { d: "M7 9V4h10v5", fill: "surface" },
    { d: "M7 14h10v6H7z", fill: "surface" },
    { d: "M17.5 11.5h.01" },
  ],
  back: [{ d: "M19 12H5M11 6l-6 6 6 6" }],
  language: [
    { d: circle(12, 12, 8.5), fill: "sky" },
    { d: "M3.5 12h17M12 3.5c2.5 2.3 3.6 5.1 3.6 8.5s-1.1 6.2-3.6 8.5c-2.5-2.3-3.6-5.1-3.6-8.5s1.1-6.2 3.6-8.5z" },
  ],
  close: [{ d: "M6 6l12 12M18 6 6 18" }],

  // Notices
  warning: [
    { d: "M12 3.5 21 19.5H3z", fill: "butter" },
    { d: "M12 9.5v4.5M12 17h.01" },
  ],
  info: [
    { d: circle(12, 12, 8.5), fill: "sky" },
    { d: "M12 11v5.5M12 7.8h.01" },
  ],

  // Status markers (shapes of ADR-030 D3, redrawn)
  status_met: [
    { d: circle(12, 12, 8.5), fill: "ink" },
    { d: "M8 12.3l2.8 2.7L16 9.5", knockout: true },
  ],
  status_near: [
    { d: circle(12, 12, 8.5) },
    { d: "M12 3.5a8.5 8.5 0 0 0 0 17z", fill: "ink" },
  ],
  status_not_met: [
    { d: circle(12, 12, 8.5) },
    { d: "M9 9l6 6M15 9l-6 6" },
  ],
  status_unknown: [
    { d: circle(12, 12, 8.5), dashed: true },
    { d: "M9.6 9.6c.2-1.5 1.3-2.4 2.6-2.4 1.5 0 2.6 1 2.6 2.3 0 1.9-2.6 2-2.6 3.9M12.2 16.6h.01" },
  ],
} as const satisfies Readonly<Record<string, readonly Shape[]>>;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

/**
 * The header logo "discovery bowl" (docs/working/DECISIONS.md "Stage 16.1 decisions",
 * direction A): a bowl with a sprout under a rising sun, on a 32 px grid. Decorative; the
 * product name stays text.
 */
export const LOGO: readonly Shape[] = [
  { d: circle(20.5, 9, 4.2), fill: "sun", stroke: false },
  { d: "M3.5 15.5h25c-.5 7-5.8 12-12.5 12S4 22.5 3.5 15.5z", fill: "mint" },
  { d: "M9 15.5c.6-3.6 3.6-5.6 6.6-4.4", fill: "peach" },
  { d: "M14 15.5c0-4 1.6-7.6 4.5-9.6M14.2 10.5c-2.4-.5-4.2-2.2-4.6-4.6 2.5.1 4.3 1.8 4.6 4.6z", fill: "primary" },
];
