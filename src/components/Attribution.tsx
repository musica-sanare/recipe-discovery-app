import { useTranslation } from "react-i18next";

/** MEXT attribution in its requested Japanese wording, then the localized equivalent (docs/CONTENT_POLICY.md §5). */
export function Attribution() {
  const { t } = useTranslation();
  return (
    <p className="m-0">
      <span lang="ja">{t("attribution.source")}</span> {t("attribution.sourceTranslation")} {t("attribution.ownCalculation")}
    </p>
  );
}
