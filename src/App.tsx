import { useTranslation } from "react-i18next";
import { DocumentMetadata } from "./components/DocumentMetadata";
import { LanguageSwitcher } from "./components/LanguageSwitcher";

export function App() {
  const { t } = useTranslation();

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
        <p>{t("home.status")}</p>
      </main>
    </>
  );
}
