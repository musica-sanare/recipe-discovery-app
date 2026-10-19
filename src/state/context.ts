import { createContext, use, type Dispatch } from "react";
import type { RecommendationData } from "../../domain/recommendation/data";
import type { CalcBundle, TextBundle } from "../../shared/bundle";
import type { AppAction, AppState } from "./reducer";

export interface LoadedContent {
  readonly calc: CalcBundle;
  readonly text: TextBundle;
  readonly data: RecommendationData;
}

export interface StateValue {
  readonly state: AppState;
  readonly dispatch: Dispatch<AppAction>;
}

export const ContentContext = createContext<LoadedContent | undefined>(undefined);
export const StateContext = createContext<StateValue | undefined>(undefined);

export function useAppState(): StateValue {
  const value = use(StateContext);
  if (value === undefined) throw new Error("useAppState must be used inside AppStateProvider");
  return value;
}

export function useLoadedContent(): LoadedContent {
  const value = use(ContentContext);
  if (value === undefined) throw new Error("useLoadedContent must be used inside ContentProvider");
  return value;
}
