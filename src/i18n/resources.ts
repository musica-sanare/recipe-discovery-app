/**
 * Every locale's UI catalog, for tests. The app loads only the active locale's catalog
 * (`localeData.ts`, ADR-039), so app code must not import this module (ESLint rule).
 */
import type { Locale } from "../../shared/locales";
import { en } from "./messages/en";
import { es } from "./messages/es";
import { fr } from "./messages/fr";
import { ja, type Messages } from "./messages/ja";

export const resources = {
  ja: { translation: ja },
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
} as const satisfies Record<Locale, { translation: Messages }>;
