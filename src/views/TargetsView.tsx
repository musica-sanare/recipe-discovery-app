import { useTranslation } from "react-i18next";
import { ViewHeading } from "../components/ViewHeading";
import { useNavigation } from "../navigation/context";

/** Targets and conditions (docs/UI_DESIGN.md §3.1). The form arrives in Stage 4.3. */
export function TargetsView({ reloaded }: { readonly reloaded: boolean }) {
  const { t } = useTranslation();
  const { navigated } = useNavigation();

  return (
    <div className="flex flex-col gap-4">
      <ViewHeading title={t("nav.views.targets")} focusOnMount={navigated} />
      <p>{t("app.tagline")}</p>
      {reloaded && (
        <p role="status" className="rounded border border-border bg-surface-muted p-3">
          {t("nav.reloadNotice")}
        </p>
      )}
      <p className="rounded border-l-4 border-warning bg-warning-surface p-3">{t("disclaimer.medicalGuidance")}</p>
      <p className="text-muted">{t("home.status")}</p>
    </div>
  );
}
