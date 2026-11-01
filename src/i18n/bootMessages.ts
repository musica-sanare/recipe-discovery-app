import type { Locale } from "../../shared/locales";

/**
 * The only texts shown without a UI catalog: when the first locale's chunk fails to load
 * (ADR-039 D4). Copies of `content.error` and `content.retry`; a test keeps them equal.
 */
export const BOOT_MESSAGES: Readonly<Record<Locale, { readonly error: string; readonly retry: string }>> = {
  ja: { error: "コンテンツを読み込めませんでした。通信状況を確認して、もう一度お試しください。", retry: "再読み込み" },
  en: { error: "The content could not be loaded. Check your connection and try again.", retry: "Try again" },
  es: { error: "No se pudo cargar el contenido. Comprueba tu conexión e inténtalo de nuevo.", retry: "Reintentar" },
  fr: { error: "Impossible de charger le contenu. Vérifiez votre connexion et réessayez.", retry: "Réessayer" },
};
