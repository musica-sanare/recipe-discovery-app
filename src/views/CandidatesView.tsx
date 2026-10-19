import { useTranslation } from "react-i18next";
import type { SearchState } from "../state/reducer";
import { ViewHeading } from "../components/ViewHeading";
import { useNavigation } from "../navigation/context";
import { ViewLink } from "../navigation/ViewLink";
import { useLoadedContent } from "../state/context";

/** Candidates (docs/UI_DESIGN.md §3.2). Cards and re-suggestion arrive in Stage 4.4. */
export function CandidatesView({ search }: { readonly search: SearchState }) {
  const { t } = useTranslation();
  const { navigated } = useNavigation();
  const { text } = useLoadedContent();

  return (
    <div className="flex flex-col gap-4">
      <ViewHeading title={t("nav.views.candidates")} focusOnMount={navigated} />
      <ul className="flex flex-col gap-2">
        {search.selection.candidates.map((entry) => (
          <li key={entry.recipe}>
            <ViewLink to={{ name: "detail", recipe: entry.recipe }} className="text-accent underline">
              {text.recipes[entry.recipe]?.name ?? entry.recipe}
            </ViewLink>
          </li>
        ))}
      </ul>
      <ViewLink to={{ name: "targets" }} className="text-accent underline">
        {t("nav.toTargets")}
      </ViewLink>
    </div>
  );
}
