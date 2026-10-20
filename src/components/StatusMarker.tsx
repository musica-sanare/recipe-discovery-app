import { useTranslation } from "react-i18next";
import type { NutrientStatus } from "../../domain/recommendation/fit";

const MARKERS: Readonly<Record<NutrientStatus, { readonly symbol: string; readonly color: string }>> = {
  met: { symbol: "✓", color: "text-met" },
  near: { symbol: "◐", color: "text-near" },
  not_met: { symbol: "✕", color: "text-not-met" },
  unknown: { symbol: "?", color: "text-unknown" },
};

/** A status as a shape and a text, never by color alone (docs/UI_DESIGN.md §5). */
export function StatusMarker({ status, label }: { readonly status: NutrientStatus; readonly label?: string | undefined }) {
  const { t } = useTranslation();
  const marker = MARKERS[status];
  return (
    <span className={`inline-flex items-center gap-1 font-medium ${marker.color}`}>
      <span aria-hidden="true">{marker.symbol}</span>
      <span>{label ?? t(`status.${status}`)}</span>
    </span>
  );
}
