/**
 * Views and their URLs (ADR-030 D2, docs/en/UI_DESIGN.md §4). Only the recipe detail and the
 * about page have their own paths. History entries carry the view name and, for the detail, the recipe ID;
 * targets and conditions never enter the URL or `history.state` (ADR-015).
 */
export type View =
  | { readonly name: "targets" }
  | { readonly name: "candidates" }
  | { readonly name: "comparison" }
  | { readonly name: "detail"; readonly recipe: string }
  | { readonly name: "about" };

export type ViewName = View["name"];

const DETAIL_PATH = /^\/recipes\/([a-z0-9_]+)\/?$/;
const ABOUT_PATH = /^\/about\/?$/;

export function pathFor(view: View): string {
  if (view.name === "detail") return `/recipes/${view.recipe}`;
  return view.name === "about" ? "/about" : "/";
}

/** The view for a location; `state` is the `history.state` of the entry. */
export function viewFromLocation(pathname: string, state: unknown): View {
  const detail = DETAIL_PATH.exec(pathname);
  if (detail?.[1] !== undefined) return { name: "detail", recipe: detail[1] };
  if (ABOUT_PATH.test(pathname)) return { name: "about" };
  if (typeof state === "object" && state !== null && "view" in state) {
    const name = state.view;
    if (name === "candidates" || name === "comparison") return { name };
  }
  return { name: "targets" };
}

/** What a history entry stores: the view name only. */
export function historyState(view: View): { readonly view: ViewName } {
  return { view: view.name };
}
