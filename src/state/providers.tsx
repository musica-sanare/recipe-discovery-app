import { useMemo, useReducer, type ReactNode } from "react";
import { recommendationDataFromBundle } from "../../domain/recommendation/data";
import type { CalcBundle, TextBundle } from "../../shared/bundle";
import { ContentContext, StateContext } from "./context";
import { appReducer, INITIAL_STATE } from "./reducer";

/** Holds the session state for the whole app, so it survives view changes but not reloads. */
export function AppStateProvider({ children }: { readonly children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, INITIAL_STATE);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StateContext value={value}>{children}</StateContext>;
}

/** Provides the loaded bundles and the engine data derived once from the calculation bundle. */
export function ContentProvider({ calc, text, children }: { readonly calc: CalcBundle; readonly text: TextBundle; readonly children: ReactNode }) {
  const data = useMemo(() => recommendationDataFromBundle(calc), [calc]);
  const value = useMemo(() => ({ calc, text, data }), [calc, text, data]);
  return <ContentContext value={value}>{children}</ContentContext>;
}
