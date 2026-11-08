import { useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DEFAULT_LOCALE, isLocale } from "../shared/locales";
import { Attribution } from "./components/Attribution";
import { ContentVersions } from "./components/ContentVersions";
import { DocumentMetadata } from "./components/DocumentMetadata";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { LoadError } from "./components/LoadError";
import { Illustration, Logo } from "./components/icons/Icon";
import { useContent, type ContentUrls } from "./content/useContent";
import { loadLocaleData, type LoadLocaleData } from "./i18n/localeData";
import { useLocaleSwitch } from "./i18n/useLocaleSwitch";
import { useNavigation } from "./navigation/context";
import { NavigationProvider } from "./navigation/Navigation";
import { ViewLink } from "./navigation/ViewLink";
import { useAppState } from "./state/context";
import { AboutView } from "./views/AboutView";
import { AppStateProvider, ContentProvider } from "./state/providers";
import { useRestoreSavedConditions } from "./state/useRestoreSavedConditions";
import { CandidatesView } from "./views/CandidatesView";
import { ComparisonView } from "./views/ComparisonView";
import { DetailView } from "./views/DetailView";
import { ShoppingListView } from "./views/ShoppingListView";
import { TargetsView } from "./views/TargetsView";

export interface AppProps {
  readonly contentUrls: ContentUrls;
  /** Loads another locale's UI data before a switch (ADR-039); tests replace it. */
  readonly loadLocale?: LoadLocaleData;
}

export function App({ contentUrls, loadLocale = loadLocaleData }: AppProps) {
  return (
    <NavigationProvider>
      <AppStateProvider>
        <Shell contentUrls={contentUrls} loadLocale={loadLocale} />
      </AppStateProvider>
    </NavigationProvider>
  );
}

function Shell({ contentUrls, loadLocale }: { readonly contentUrls: ContentUrls; readonly loadLocale: LoadLocaleData }) {
  const { t, i18n } = useTranslation();
  const locale = isLocale(i18n.resolvedLanguage) ? i18n.resolvedLanguage : DEFAULT_LOCALE;
  const { state, retry, prepare } = useContent(contentUrls, locale);
  const localeSwitch = useLocaleSwitch(prepare, loadLocale);
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
      <header className="glass z-20 border-b border-border print:hidden md:sticky md:top-0">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <ViewLink to={{ name: "targets" }} className="inline-flex items-center gap-2 font-bold text-text no-underline">
            <Logo />
            {t("app.name")}
          </ViewLink>
          <div className="flex flex-wrap items-center gap-3">
            <ShoppingListLink />
            <LanguageSwitcher
              state={localeSwitch.state}
              onSelect={(next) => {
                void localeSwitch.switchTo(next);
              }}
            />
          </div>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        {/* A failed language switch keeps the current view and language below the retry. */}
        {localeSwitch.state.status === "error" && (
          <div className="mb-6">
            <LoadError message={t("content.error")} retryLabel={t("content.retry")} onRetry={localeSwitch.retry} />
          </div>
        )}
        {state.status === "loading" && <Loading message={t("content.loading")} />}
        {state.status === "error" && <LoadError message={t("content.error")} retryLabel={t("content.retry")} onRetry={retry} />}
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
            <p className="m-0">
              <ViewLink to={{ name: "about" }} className="text-primary underline">
                {t("nav.views.about")}
              </ViewLink>
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}

/**
 * The loading state (ADR-041 D4): the illustration and the status text, then a skeleton of
 * a card that is hidden from assistive technology.
 */
function Loading({ message }: { readonly message: string }) {
  const block = "rounded-2xl bg-surface-muted";
  return (
    <div className="flex flex-col gap-4">
      <div className="panel flex flex-col items-center gap-3 p-6 text-center">
        <Illustration name="hero" className="w-40" />
        <p role="status" className="m-0 font-bold">
          {message}
        </p>
      </div>
      <div aria-hidden="true" className="panel flex flex-col gap-3 p-4">
        <div className={`${block} h-5 w-3/5`} />
        <div className={`${block} h-3 w-2/5`} />
        <div className={`${block} h-14`} />
        <div className={`${block} h-14`} />
      </div>
    </div>
  );
}

/** The header link to the shopping list, shown while the list has a recipe (ADR-032 D7). */
function ShoppingListLink() {
  const { t } = useTranslation();
  const { state } = useAppState();
  const count = state.shoppingList.entries.length;
  if (count === 0) return null;
  return (
    <ViewLink to={{ name: "shoppingList" }} className="text-primary underline">
      {t("shopping.headerLink", { count })}
    </ViewLink>
  );
}

/**
 * The view for the current location. Candidates and comparison need a search in memory;
 * after a reload it is gone, so the targets view opens with a notice (ADR-030 D2). The
 * shopping list is empty after a reload too; emptied by the user, it shows its empty state.
 */
function CurrentView() {
  const { view, navigate, navigated } = useNavigation();
  const { state } = useAppState();
  useRestoreSavedConditions();
  const lost =
    ((view.name === "candidates" || view.name === "comparison") && state.search === undefined) ||
    (view.name === "shoppingList" && !navigated && state.shoppingList.entries.length === 0);
  // The notice stays on the targets view after the redirect and goes once the user moves on.
  const [reloadNotice, setReloadNotice] = useState(false);
  if (lost && !reloadNotice) setReloadNotice(true);
  if (!lost && view.name !== "targets" && reloadNotice) setReloadNotice(false);

  // A layout effect replaces the history entry in the same commit that shows the notice; a
  // passive effect left the old entry in place for a moment (docs/working/DECISIONS.md "CI first run").
  useLayoutEffect(() => {
    if (lost) navigate({ name: "targets" }, { replace: true });
  }, [lost, navigate]);

  if (lost) return <TargetsView reloaded />;
  switch (view.name) {
    case "targets":
      return <TargetsView reloaded={reloadNotice} />;
    case "candidates":
      return state.search ? <CandidatesView search={state.search} /> : null;
    case "comparison":
      return state.search ? <ComparisonView search={state.search} /> : null;
    case "detail":
      return <DetailView key={view.recipe} recipe={view.recipe} />;
    case "about":
      return <AboutView />;
    case "shoppingList":
      return <ShoppingListView />;
  }
}
