import { useTranslation } from "react-i18next";
import { ViewHeading } from "../components/ViewHeading";
import { useNavigation } from "../navigation/context";
import { ViewLink } from "../navigation/ViewLink";

/** Comparison (docs/UI_DESIGN.md §3.3). The table arrives in Stage 4.4. */
export function ComparisonView() {
  const { t } = useTranslation();
  const { navigated } = useNavigation();

  return (
    <div className="flex flex-col gap-4">
      <ViewHeading title={t("nav.views.comparison")} focusOnMount={navigated} />
      <ViewLink to={{ name: "candidates" }} className="text-accent underline">
        {t("nav.backToCandidates")}
      </ViewLink>
    </div>
  );
}
