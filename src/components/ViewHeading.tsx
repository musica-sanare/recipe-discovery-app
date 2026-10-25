import { useLayoutEffect, useRef, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

/**
 * The view's `h1`. It receives focus when the view opens (docs/en/UI_DESIGN.md §2) and
 * names the document title; the first render after a page load keeps the focus where it is.
 */
export function ViewHeading({ title, focusOnMount, children }: { readonly title: string; readonly focusOnMount: boolean; readonly children?: ReactNode }) {
  const { t } = useTranslation();
  const heading = useRef<HTMLHeadingElement>(null);
  const documentTitle = t("meta.viewTitle", { view: title });

  // Layout effects name the document and move focus in the same commit as the heading, so
  // neither lags behind the view (passive effects did on slow machines).
  useLayoutEffect(() => {
    document.title = documentTitle;
  }, [documentTitle]);

  useLayoutEffect(() => {
    if (focusOnMount) heading.current?.focus();
  }, [focusOnMount]);

  return (
    <h1 id="view-heading" ref={heading} tabIndex={-1} className="text-2xl font-bold leading-snug">
      {children ?? title}
    </h1>
  );
}
