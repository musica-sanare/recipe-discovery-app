import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { NavigationContext } from "./context";
import { historyState, pathFor, viewFromLocation, type View } from "./views";

function currentView(): View {
  return viewFromLocation(window.location.pathname, window.history.state);
}

/** A small History API wrapper instead of a router library (ADR-030 D2). */
export function NavigationProvider({ children }: { readonly children: ReactNode }) {
  const [view, setView] = useState<View>(currentView);
  const [navigated, setNavigated] = useState(false);

  useEffect(() => {
    const onPopState = () => {
      setView(currentView());
      setNavigated(true);
    };
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  const navigate = useCallback((next: View, options?: { readonly replace?: boolean }) => {
    if (options?.replace) window.history.replaceState(historyState(next), "", pathFor(next));
    else window.history.pushState(historyState(next), "", pathFor(next));
    setView(next);
    setNavigated(true);
  }, []);

  const value = useMemo(() => ({ view, navigate, navigated }), [view, navigate, navigated]);
  return <NavigationContext value={value}>{children}</NavigationContext>;
}
