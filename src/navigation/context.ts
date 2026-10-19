import { createContext, use } from "react";
import type { View } from "./views";

export interface NavigationValue {
  readonly view: View;
  readonly navigate: (view: View, options?: { readonly replace?: boolean }) => void;
  /** False until the first navigation in this page load, so the initial view does not steal focus. */
  readonly navigated: boolean;
}

export const NavigationContext = createContext<NavigationValue | undefined>(undefined);

export function useNavigation(): NavigationValue {
  const value = use(NavigationContext);
  if (value === undefined) throw new Error("useNavigation must be used inside NavigationProvider");
  return value;
}
