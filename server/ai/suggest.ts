/**
 * Platform-neutral core of the free-text conditions endpoint (ADR-034 D3). The platform
 * wrapper (Stage 12.5) parses the JSON body, applies the rate limit, and sends `status`
 * and `body`; it may count `rejection`, but neither it nor this module logs the request.
 */
import {
  ERROR_STATUS,
  PROVIDER_TIMEOUT_MS,
  suggestRequestSchema,
  validateProviderOutput,
  type RejectionReason,
  type SuggestError,
  type SuggestResponse,
  type ValidationContext,
} from "../../shared/suggestion.ts";
import * as z from "zod/mini";
import { AdapterError, type SuggestionAdapter } from "./adapter.ts";

export interface SuggestOptions {
  readonly adapter: SuggestionAdapter;
  readonly context: ValidationContext;
  /** The environment switch (ADR-034 D5); when false, nothing is read or sent. */
  readonly enabled: boolean;
  readonly timeoutMs?: number;
}

export interface SuggestResult {
  readonly status: number;
  readonly body: SuggestResponse;
  /** Why the provider output was rejected, when it was. */
  readonly rejection?: RejectionReason;
}

export function errorResult(error: SuggestError, rejection?: RejectionReason): SuggestResult {
  return { status: ERROR_STATUS[error], body: { kind: "error", error }, ...(rejection === undefined ? {} : { rejection }) };
}

async function callAdapter(adapter: SuggestionAdapter, request: z.infer<typeof suggestRequestSchema>, timeoutMs: number): Promise<string> {
  const controller = new AbortController();
  const timedOut = new Promise<never>((_, reject) => {
    controller.signal.addEventListener("abort", () => {
      reject(new AdapterError("timeout"));
    }, { once: true });
  });
  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);
  try {
    return await Promise.race([adapter.suggest(request, controller.signal), timedOut]);
  } finally {
    clearTimeout(timer);
  }
}

export async function handleSuggest(body: unknown, options: SuggestOptions): Promise<SuggestResult> {
  if (!options.enabled) return errorResult("disabled");
  const parsed = z.safeParse(suggestRequestSchema, body);
  if (!parsed.success) return errorResult("invalid_request");
  const request = { ...parsed.data, text: parsed.data.text.trim() };
  let output: string;
  try {
    output = await callAdapter(options.adapter, request, options.timeoutMs ?? PROVIDER_TIMEOUT_MS);
  } catch (error) {
    return errorResult(error instanceof AdapterError ? error.code : "unavailable");
  }
  const validated = validateProviderOutput(output, options.context);
  return validated.ok ? { status: 200, body: validated.value } : errorResult("invalid_output", validated.reason);
}
