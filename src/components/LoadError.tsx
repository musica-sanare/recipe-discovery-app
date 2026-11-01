import { Illustration } from "./icons/Icon";

/** The retry state for content or a locale's data that could not be loaded (docs/en/UI_DESIGN.md §3.5). */
export function LoadError({ message, retryLabel, onRetry }: { readonly message: string; readonly retryLabel: string; readonly onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-start gap-3">
      <Illustration name="content_error" className="w-48" />
      <p>{message}</p>
      <button type="button" onClick={onRetry} className="btn-primary">
        {retryLabel}
      </button>
    </div>
  );
}
