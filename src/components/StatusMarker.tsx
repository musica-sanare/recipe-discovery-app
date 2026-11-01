import { useTranslation } from "react-i18next";
import type { NutrientStatus } from "../../domain/recommendation/fit";
import { Icon } from "./icons/Icon";
import type { IconName } from "./icons/iconData";

const MARKERS: Readonly<Record<NutrientStatus, { readonly icon: IconName; readonly color: string }>> = {
  met: { icon: "status_met", color: "text-met" },
  near: { icon: "status_near", color: "text-near" },
  not_met: { icon: "status_not_met", color: "text-not-met" },
  unknown: { icon: "status_unknown", color: "text-unknown" },
};

/** A status as a shape and a text, never by color alone (docs/en/UI_DESIGN.md §5, ADR-037 D3). */
export function StatusMarker({ status, label }: { readonly status: NutrientStatus; readonly label?: string | undefined }) {
  const { t } = useTranslation();
  const marker = MARKERS[status];
  return (
    <span className={`inline-flex items-center gap-1 font-semibold ${marker.color}`}>
      <Icon name={marker.icon} size={18} />
      <span>{label ?? t(`status.${status}`)}</span>
    </span>
  );
}
