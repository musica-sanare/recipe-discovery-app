import * as z from "zod/mini";
import { bundleMismatches, calcBundleSchema, textBundleSchema, type CalcBundle, type TextBundle } from "../../shared/bundle";
import type { Locale } from "../../shared/locales";

/** `network`: unreachable; `http`: error status; `invalid`: not JSON, wrong shape, or not matching. */
export type LoadErrorKind = "network" | "http" | "invalid";

export type LoadResult<T> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly kind: LoadErrorKind; readonly detail: string };

export type Fetch = (url: string) => Promise<Response>;

// Wrapped so that `fetch` is never called detached from `window`.
const defaultFetch: Fetch = (url) => fetch(url);

const failure = (kind: LoadErrorKind, detail: string): LoadResult<never> => ({ ok: false, kind, detail });

async function fetchJson(url: string, fetchFn: Fetch): Promise<LoadResult<unknown>> {
  let response: Response;
  try {
    response = await fetchFn(url);
  } catch (error) {
    return failure("network", `${url}: ${String(error)}`);
  }
  if (!response.ok) return failure("http", `${url}: HTTP ${String(response.status)}`);
  try {
    return { ok: true, value: (await response.json()) as unknown };
  } catch {
    return failure("invalid", `${url}: not JSON`);
  }
}

function parse<T>(schema: z.ZodMiniType<T>, url: string, value: unknown): LoadResult<T> {
  const result = z.safeParse(schema, value);
  return result.success ? { ok: true, value: result.data } : failure("invalid", `${url}: ${result.error.issues.map((issue) => `${issue.path.join(".")} ${issue.message}`).join("; ")}`);
}

/** Loads and validates the locale-neutral calculation bundle. Never throws. */
export async function loadCalcBundle(url: string, fetchFn: Fetch = defaultFetch): Promise<LoadResult<CalcBundle>> {
  const json = await fetchJson(url, fetchFn);
  return json.ok ? parse(calcBundleSchema, url, json.value) : json;
}

/** Loads a text bundle and checks that it matches the calculation bundle. Never throws. */
export async function loadTextBundle(url: string, locale: Locale, calc: CalcBundle, fetchFn: Fetch = defaultFetch): Promise<LoadResult<TextBundle>> {
  const json = await fetchJson(url, fetchFn);
  if (!json.ok) return json;
  const text = parse(textBundleSchema, url, json.value);
  if (!text.ok) return text;
  if (text.value.locale !== locale) return failure("invalid", `${url}: locale ${text.value.locale}, expected ${locale}`);
  const mismatches = bundleMismatches(calc, text.value);
  return mismatches.length === 0 ? text : failure("invalid", `${url}: ${mismatches.join(", ")}`);
}
