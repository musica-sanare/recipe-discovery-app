import { useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import { recommendationDataFromBundle, withPrecomputed, type RecommendationData } from "../../domain/recommendation/data";
import type { CalcBundle, TextBundle } from "../../shared/bundle";
import { ContentContext, StateContext } from "./context";
import { appReducer, INITIAL_STATE } from "./reducer";

/** Holds the session state for the whole app, so it survives view changes but not reloads. */
export function AppStateProvider({ children }: { readonly children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, INITIAL_STATE);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StateContext value={value}>{children}</StateContext>;
}

/**
 * Provides the loaded bundles and the engine data derived once from the calculation bundle.
 * The precomputed solver results are added after the first view is shown (docs/working/DECISIONS.md
 * "Stage 9.3"): computing them first delayed it by about 0.04–0.1 s at a 4× CPU slowdown. A search
 * before they are ready gives the same result, only without their speed-up.
 */
export function ContentProvider({ calc, text, children }: { readonly calc: CalcBundle; readonly text: TextBundle; readonly children: ReactNode }) {
  const base = useMemo(() => recommendationDataFromBundle(calc, { precompute: false }), [calc]);
  const [full, setFull] = useState<RecommendationData | undefined>(undefined);
  useEffect(() => {
    const timer = setTimeout(() => {
      setFull(withPrecomputed(base));
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  }, [base]);
  const data = full?.engine === base.engine ? full : base;
  const value = useMemo(() => ({ calc, text, data }), [calc, text, data]);
  return <ContentContext value={value}>{children}</ContentContext>;
}
