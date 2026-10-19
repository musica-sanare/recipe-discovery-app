import { useTranslation } from "react-i18next";
import { ViewHeading } from "../components/ViewHeading";
import { useNavigation } from "../navigation/context";
import { ViewLink } from "../navigation/ViewLink";
import { useAppState, useLoadedContent } from "../state/context";

/** Recipe detail (docs/UI_DESIGN.md §3.4). Nutrition and adjustment arrive in Stage 4.5. */
export function DetailView({ recipe }: { readonly recipe: string }) {
  const { t } = useTranslation();
  const { navigated } = useNavigation();
  const { text } = useLoadedContent();
  const { state } = useAppState();
  const texts = text.recipes[recipe];
  const back = state.search === undefined ? (
    <ViewLink to={{ name: "targets" }} className="text-accent underline">
      {t("nav.toTargets")}
    </ViewLink>
  ) : (
    <ViewLink to={{ name: "candidates" }} className="text-accent underline">
      {t("nav.backToCandidates")}
    </ViewLink>
  );

  if (texts === undefined) {
    return (
      <div className="flex flex-col gap-4">
        <ViewHeading title={t("nav.notFound")} focusOnMount={navigated} />
        {back}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <ViewHeading title={texts.name} focusOnMount={navigated} />
      <p>{texts.summary}</p>
      <p className="text-muted">{t("disclaimer.estimates")}</p>
      {back}
    </div>
  );
}
