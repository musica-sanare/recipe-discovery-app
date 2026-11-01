import type { Locale } from "../shared/locales";
import { LoadError } from "./components/LoadError";
import { BOOT_MESSAGES } from "./i18n/bootMessages";

/** Shown instead of the app when the first locale's chunk cannot be loaded; the retry reloads the page (ADR-039 D4). */
export function BootError({ locale, onRetry }: { readonly locale: Locale; readonly onRetry: () => void }) {
  const messages = BOOT_MESSAGES[locale];
  return (
    <main id="main" lang={locale} className="mx-auto w-full max-w-5xl px-4 py-6">
      <LoadError message={messages.error} retryLabel={messages.retry} onRetry={onRetry} />
    </main>
  );
}
