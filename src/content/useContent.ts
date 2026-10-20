import { useCallback, useEffect, useState } from "react";
import type { CalcBundle, TextBundle } from "../../shared/bundle";
import type { Locale } from "../../shared/locales";
import { loadCalcBundle, loadTextBundle, type LoadErrorKind, type LoadResult } from "./loadContent";

/** URLs of the generated bundles (hashed by the build). */
export interface ContentUrls {
  readonly calc: string;
  readonly text: Readonly<Record<Locale, string>>;
}

export type ContentState =
  | { readonly status: "loading" }
  | { readonly status: "error"; readonly kind: LoadErrorKind }
  | { readonly status: "ready"; readonly calc: CalcBundle; readonly text: TextBundle };

/**
 * Loads the calculation bundle once and the text bundle of each locale on first
 * use or ahead of a language switch (`prepare`). A failed load leads to the error state;
 * `retry` repeats only the failed loads.
 */
export function useContent(urls: ContentUrls, locale: Locale): { readonly state: ContentState; readonly retry: () => void; readonly prepare: (next: Locale) => Promise<void> } {
  const [calc, setCalc] = useState<LoadResult<CalcBundle>>();
  const [texts, setTexts] = useState<Partial<Record<Locale, LoadResult<TextBundle>>>>({});
  const text = texts[locale];

  useEffect(() => {
    if (calc !== undefined) return;
    let cancelled = false;
    void loadCalcBundle(urls.calc).then((result) => {
      if (!cancelled) setCalc(result);
    });
    return () => {
      cancelled = true;
    };
  }, [calc, urls.calc]);

  useEffect(() => {
    if (!calc?.ok || text !== undefined) return;
    let cancelled = false;
    void loadTextBundle(urls.text[locale], locale, calc.value).then((result) => {
      if (!cancelled) setTexts((previous) => ({ ...previous, [locale]: result }));
    });
    return () => {
      cancelled = true;
    };
  }, [calc, text, locale, urls.text]);

  const retry = useCallback(() => {
    setCalc((previous) => (previous?.ok === false ? undefined : previous));
    setTexts((previous) => Object.fromEntries(Object.entries(previous).filter(([, result]) => result.ok)));
  }, []);

  /**
   * Loads another locale's text bundle before the UI switches to it, so the views stay
   * mounted (with their open sections and focus) instead of passing through loading.
   */
  const prepare = useCallback(
    async (next: Locale) => {
      if (!calc?.ok || texts[next] !== undefined) return;
      const result = await loadTextBundle(urls.text[next], next, calc.value);
      setTexts((previous) => ({ ...previous, [next]: result }));
    },
    [calc, texts, urls.text],
  );

  let state: ContentState;
  if (calc?.ok === false) state = { status: "error", kind: calc.kind };
  else if (text?.ok === false) state = { status: "error", kind: text.kind };
  else if (calc?.ok && text?.ok) state = { status: "ready", calc: calc.value, text: text.value };
  else state = { status: "loading" };
  return { state, retry, prepare };
}
