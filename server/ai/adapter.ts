/**
 * Provider adapter interface (ADR-034 D2). An adapter turns a validated request into the
 * provider's raw output text and maps provider failures to `AdapterError`; everything
 * else (input and output validation, timeout, error responses) is in `suggest.ts`, so an
 * adapter stays thin and replaceable. Adapters never log the request text.
 */
import type { SuggestError, SuggestRequest } from "../../shared/suggestion.ts";

export type AdapterErrorCode = Extract<SuggestError, "rate_limited" | "budget_spent" | "timeout" | "refused" | "unavailable">;

export class AdapterError extends Error {
  readonly code: AdapterErrorCode;

  constructor(code: AdapterErrorCode) {
    super(code);
    this.name = "AdapterError";
    this.code = code;
  }
}

export interface SuggestionAdapter {
  /** Resolves with the provider's raw output (JSON text) or rejects with `AdapterError`; stops when `signal` aborts. */
  suggest(request: SuggestRequest, signal: AbortSignal): Promise<string>;
}
