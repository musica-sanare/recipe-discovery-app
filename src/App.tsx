import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DEFAULT_LOCALE, isLocale } from "../shared/locales";
import { Attribution } from "./components/Attribution";
import { ContentVersions } from "./components/ContentVersions";
import { DocumentMetadata } from "./components/DocumentMetadata";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { useContent, type ContentUrls } from "./content/useContent";
import { useNavigation } from "./navigation/context";
import { NavigationProvider } from "./navigation/Navigation";
import { ViewLink } from "./navigation/ViewLink";
import { useAppState } from "./state/context";
import { AppStateProvider, ContentProvider } from "./state/providers";
import { CandidatesView } from "./views/CandidatesView";
import { ComparisonView } from "./views/ComparisonView";
import { DetailView } from "./views/DetailView";
import { TargetsView } from "./views/TargetsView";

export function App({ contentUrls }: { readonly contentUrls: ContentUrls }) {
  return (
    <NavigationProvider>
      <AppStateProvider>
        <Shell contentUrls={contentUrls} />
      </AppStateProvider>
    </NavigationProvider>
  );
}

function Shell({ contentUrls }: { readonly contentUrls: ContentUrls }) {
  const { t, i18n } = useTranslation();
  const locale = isLocale(i18n.resolvedLanguage) ? i18n.resolvedLanguage : DEFAULT_LOCALE;
  const { state, retry } = useContent(contentUrls, locale);
  const appTitle = t("meta.title");
  const ready = state.status === "ready";

  // Views name the document once content is ready; until then the app title is used.
  useEffect(() => {
    if (!ready) document.title = appTitle;
  }, [ready, appTitle]);

  return (
    <div className="flex min-h-screen flex-col">
      <DocumentMetadata />
      <a className="absolute -top-12 left-4 z-10 bg-surface px-4 py-2 focus:top-4" href="#main">
        {t("common.skipToContent")}
      </a>
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <ViewLink to={{ name: "targets" }} className="font-bold text-text no-underline">
            {t("app.name")}
          </ViewLink>
          <LanguageSwitcher />
        </div>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        {state.status === "loading" && <p role="status">{t("content.loading")}</p>}
        {state.status === "error" && (
          <div role="alert" className="flex flex-col items-start gap-3">
            <p>{t("content.error")}</p>
            <button type="button" onClick={retry} className="rounded bg-accent px-4 py-2 text-on-accent">
              {t("content.retry")}
            </button>
          </div>
        )}
        {state.status === "ready" && (
          <ContentProvider calc={state.calc} text={state.text}>
            <CurrentView />
          </ContentProvider>
        )}
      </main>
      {state.status === "ready" && (
        <footer className="border-t border-border">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-4 text-sm text-muted">
            <Attribution />
            <ContentVersions versions={state.calc} />
          </div>
        </footer>
      )}
    </div>
  );
}

/**
 * The view for the current location. Candidates and comparison need a search in memory;
 * after a reload it is gone, so the targets view opens with a notice (ADR-030 D2).
 */
function CurrentView() {
  const { view, navigate } = useNavigation();
  const { state } = useAppState();
  const lost = (view.name === "candidates" || view.name === "comparison") && state.search === undefined;
  // The notice stays on the targets view after the redirect and goes once the user moves on.
  const [reloadNotice, setReloadNotice] = useState(false);
  if (lost && !reloadNotice) setReloadNotice(true);
  if (!lost && view.name !== "targets" && reloadNotice) setReloadNotice(false);

  useEffect(() => {
    if (lost) navigate({ name: "targets" }, { replace: true });
  }, [lost, navigate]);

  if (lost) return <TargetsView reloaded />;
  switch (view.name) {
    case "targets":
      return <TargetsView reloaded={reloadNotice} />;
    case "candidates":
      return state.search ? <CandidatesView search={state.search} /> : null;
    case "comparison":
      return <ComparisonView />;
    case "detail":
      return <DetailView key={view.recipe} recipe={view.recipe} />;
  }
}
