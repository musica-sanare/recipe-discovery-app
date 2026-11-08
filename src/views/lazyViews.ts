/**
 * The views that load after the first view (ADR-043). The targets view stays in the startup chunk.
 * `lazy` keeps a failed load, so a retry creates the views again and `import()` runs once more.
 */
import { lazy } from "react";

/** A view's chunk could not be loaded; `ViewBoundary` shows the retry only for this error. */
export class ViewLoadError extends Error {
  constructor(cause: unknown) {
    super("A view's chunk could not be loaded", { cause });
    this.name = "ViewLoadError";
  }
}

function asLoadError(cause: unknown): never {
  throw new ViewLoadError(cause);
}

const loadCandidates = () => import("./CandidatesView");

function createViews() {
  return {
    AboutView: lazy(() => import("./AboutView").then((module) => ({ default: module.AboutView }), asLoadError)),
    CandidatesView: lazy(() => loadCandidates().then((module) => ({ default: module.CandidatesView }), asLoadError)),
    ComparisonView: lazy(() => import("./ComparisonView").then((module) => ({ default: module.ComparisonView }), asLoadError)),
    DetailView: lazy(() => import("./DetailView").then((module) => ({ default: module.DetailView }), asLoadError)),
    ShoppingListView: lazy(() => import("./ShoppingListView").then((module) => ({ default: module.ShoppingListView }), asLoadError)),
  };
}

let views = createViews();

export function lazyViews(): ReturnType<typeof createViews> {
  return views;
}

export function retryLazyViews(): void {
  views = createViews();
}

/** Loads the view that follows a search, so that the first search waits for no request. A failure shows when the view opens. */
export function preloadCandidates(): void {
  loadCandidates().catch(() => undefined);
}
