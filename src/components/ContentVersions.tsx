import { useTranslation } from "react-i18next";
import type { BundleVersions } from "../../shared/bundle";

/** Content and composition data versions, with the date formatted for the active locale. */
export function ContentVersions({ versions }: { readonly versions: BundleVersions }) {
  const { t, i18n } = useTranslation();
  const updated = new Intl.DateTimeFormat(i18n.resolvedLanguage, { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${versions.composition.workbookUpdated}T00:00:00Z`));

  return <p className="content-versions">{t("content.versions", { content: versions.contentVersion, composition: updated })}</p>;
}
