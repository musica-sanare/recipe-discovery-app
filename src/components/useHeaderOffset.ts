import { useLayoutEffect, type RefObject } from "react";

/**
 * Publishes the header's height as `--header-height` on the root element, so that
 * `scroll-padding-top` in `src/styles.css` keeps focused and linked elements below the sticky
 * header however many rows it wraps to (WCAG 2.4.11). A fixed padding failed when long labels
 * or wider fonts wrapped the header ("Release 17 and seventeenth production deployment").
 */
export function useHeaderOffset(ref: RefObject<HTMLElement | null>): void {
  useLayoutEffect(() => {
    const header = ref.current;
    if (header === null) return undefined;
    const root = document.documentElement;
    const apply = () => {
      root.style.setProperty("--header-height", `${String(Math.ceil(header.getBoundingClientRect().height))}px`);
    };
    apply();
    if (!("ResizeObserver" in window)) return undefined;
    const observer = new ResizeObserver(apply);
    observer.observe(header);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--header-height");
    };
  }, [ref]);
}
