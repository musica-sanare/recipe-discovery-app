/**
 * Parses a cell of the MEXT tables into a value and its notation
 * (docs/NUTRITION_CALCULATION.md §3). Unknown notations fail loudly.
 */
import type { CompositionValue } from "../../shared/composition.ts";

const NUMBER = /^\d+(?:\.\d+)?(?:[eE][-+]?\d+)?$/;

/** Excel stores binary floats (e.g. 64.900000000000006); restore the published decimal. */
function normalize(text: string): number {
  return Number(Number(text).toPrecision(12));
}

export function parseCompositionValue(raw: string): CompositionValue {
  const text = raw.trim();
  switch (text) {
    case "-":
      return { value: null, notation: "unmeasured" };
    case "Tr":
      return { value: 0, notation: "trace" };
    case "(Tr)":
      return { value: 0, notation: "estimated_trace" };
    case "(0)":
      return { value: 0, notation: "estimated_zero" };
  }
  const estimated = /^\((.+)\)$/.exec(text)?.[1];
  if (estimated !== undefined && NUMBER.test(estimated)) {
    return { value: normalize(estimated), notation: "estimated" };
  }
  if (NUMBER.test(text)) {
    const value = normalize(text);
    return value === 0 ? { value, notation: "zero" } : { value, notation: "measured" };
  }
  throw new Error(`Unrecognized composition value: "${raw}"`);
}
