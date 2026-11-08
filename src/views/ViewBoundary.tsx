import { Component, type ReactNode } from "react";
import { retryLazyViews, ViewLoadError } from "./lazyViews";

interface ViewBoundaryProps {
  readonly renderFailure: (retry: () => void) => ReactNode;
  readonly children: ReactNode;
}

interface ViewBoundaryState {
  readonly failed: Error | undefined;
}

/**
 * Shows the retry state when a view's chunk cannot be loaded (ADR-043). The session state lives
 * above this boundary, so the search and the shopping list survive. Any other error is a bug
 * and passes through, instead of looking like a network problem.
 */
export class ViewBoundary extends Component<ViewBoundaryProps, ViewBoundaryState> {
  override state: ViewBoundaryState = { failed: undefined };

  static getDerivedStateFromError(error: unknown): ViewBoundaryState {
    return { failed: error instanceof Error ? error : new Error(String(error)) };
  }

  private readonly retry = () => {
    retryLazyViews();
    this.setState({ failed: undefined });
  };

  override render() {
    const { failed } = this.state;
    if (failed === undefined) return this.props.children;
    if (failed instanceof ViewLoadError) return this.props.renderFailure(this.retry);
    throw failed;
  }
}
