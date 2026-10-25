import type { MouseEvent, ReactNode } from "react";
import { useNavigation } from "./context";
import { pathFor, type View } from "./views";

/** A real link (so it works with modifier keys and without script) that navigates in place. */
export function ViewLink({ to, className, onNavigate, children }: { readonly to: View; readonly className?: string; readonly onNavigate?: () => void; readonly children: ReactNode }) {
  const { navigate } = useNavigation();
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onNavigate?.();
    navigate(to);
  };
  return (
    <a href={pathFor(to)} onClick={onClick} className={className}>
      {children}
    </a>
  );
}
