import { useTranslation } from "react-i18next";
import { DEFAULT_LOCALE, isLocale } from "../shared/locales";
import { ContentVersions } from "./components/ContentVersions";
import { DocumentMetadata } from "./components/DocumentMetadata";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { useContent, type ContentUrls } from "./content/useContent";

export function App({ contentUrls }: { readonly contentUrls: ContentUrls }) {
  const { t, i18n } = useTranslation();
  const locale = isLocale(i18n.resolvedLanguage) ? i18n.resolvedLanguage : DEFAULT_LOCALE;
  const { state, retry } = useContent(contentUrls, locale);

  return (
    <>
      <DocumentMetadata />
      <a className="skip-link" href="#main">
        {t("common.skipToContent")}
      </a>
      <header className="site-header">
        <p className="site-name">{t("app.name")}</p>
        <LanguageSwitcher />
      </header>
      <main id="main" tabIndex={-1}>
        <h1>{t("app.tagline")}</h1>
        {state.status === "loading" && <p role="status">{t("content.loading")}</p>}
        {state.status === "error" && (
          <div role="alert" className="content-error">
            <p>{t("content.error")}</p>
            <button type="button" onClick={retry}>
              {t("content.retry")}
            </button>
          </div>
        )}
        {state.status === "ready" && <p>{t("home.status")}</p>}
      </main>
      {state.status === "ready" && (
        <footer className="site-footer">
          <ContentVersions versions={state.calc} />
        </footer>
      )}
    </>
  );
}
