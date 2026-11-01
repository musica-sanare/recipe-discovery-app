import { useLayoutEffect } from "react";
import { useAppState, useLoadedContent } from "./context";
import { draftFromRecord, readSavedConditions } from "./savedConditions";

/**
 * Reads the saved conditions once, as soon as the content is there to check them against
 * (ADR-036 D4, D5). A layout effect fills the form before the first view is painted.
 */
export function useRestoreSavedConditions() {
  const { calc } = useLoadedContent();
  const { state, dispatch } = useAppState();
  const checked = state.saved.checked;
  useLayoutEffect(() => {
    if (checked) return;
    const read = readSavedConditions();
    if (read.kind !== "saved") {
      dispatch({ type: "savedChecked", draft: undefined, allergens: false, dropped: 0 });
      return;
    }
    const { draft, dropped } = draftFromRecord(read.record, calc);
    dispatch({ type: "savedChecked", draft, allergens: read.record.allergens !== undefined, dropped: dropped.length });
  }, [checked, calc, dispatch]);
}
