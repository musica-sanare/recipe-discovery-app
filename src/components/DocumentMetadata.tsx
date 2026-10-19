import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/** Keeps `<html lang>` in sync with the active locale. Views set the document title (`ViewHeading`). */
export function DocumentMetadata() {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage;

  useEffect(() => {
    if (language) {
      document.documentElement.lang = language;
    }
  }, [language]);

  return null;
}
