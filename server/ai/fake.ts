/**
 * Fake provider adapter for tests (no network). Each call answers with the behavior the
 * test chooses for the request: an output text, an adapter error, or no answer until
 * the call is aborted.
 */
import type { SuggestRequest } from "../../shared/suggestion.ts";
import { AdapterError, type AdapterErrorCode, type SuggestionAdapter } from "./adapter.ts";

export type FakeBehavior = { readonly output: string } | { readonly error: AdapterErrorCode } | { readonly hang: true };

export interface FakeAdapter extends SuggestionAdapter {
  /** Requests received, in order. */
  readonly calls: readonly SuggestRequest[];
}

export function fakeAdapter(respond: (request: SuggestRequest) => FakeBehavior): FakeAdapter {
  const calls: SuggestRequest[] = [];
  return {
    calls,
    suggest(request, signal) {
      calls.push(request);
      const behavior = respond(request);
      if ("output" in behavior) return Promise.resolve(behavior.output);
      if ("error" in behavior) return Promise.reject(new AdapterError(behavior.error));
      return new Promise((_, reject) => {
        signal.addEventListener("abort", () => {
          reject(new AdapterError("timeout"));
        }, { once: true });
      });
    },
  };
}
