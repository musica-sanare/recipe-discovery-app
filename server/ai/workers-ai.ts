/**
 * Cloudflare Workers AI adapter (ADR-034 D2, revised): free allocation only. The transport
 * is injected: the Worker binding (`env.AI.run`, Stage 12.5) or the REST API in the
 * evaluation, so this module makes no network call itself. Formats verified 2026-10-31
 * (docs/working/DECISIONS.md "Stage 12.3 Workers AI adapter and prompt").
 */
import type { SuggestRequest } from "../../shared/suggestion.ts";
import { AdapterError, type AdapterErrorCode, type SuggestionAdapter } from "./adapter.ts";
import { buildMessages, outputJsonSchema, type PromptFood } from "./prompt.ts";

/** Candidate models; models that need a paid billing method are never used. */
export const WORKERS_AI_MODELS = ["@cf/qwen/qwen3-30b-a3b-fp8", "@cf/google/gemma-4-26b-a4b-it"] as const;
export type WorkersAiModel = (typeof WORKERS_AI_MODELS)[number];

/** Output token limit per request (ADR-034 D3). */
export const MAX_OUTPUT_TOKENS = 400;

/** Runs a model; resolves with the result object or throws the provider's error. */
export type WorkersAiRunner = (model: WorkersAiModel, inputs: Readonly<Record<string, unknown>>, signal: AbortSignal) => Promise<unknown>;

export interface WorkersAiOptions {
  readonly model: WorkersAiModel;
  readonly run: WorkersAiRunner;
  /** Dictionary foods per request locale. */
  readonly dictionary: (locale: SuggestRequest["locale"]) => readonly PromptFood[];
}

/** Workers AI error codes (https://developers.cloudflare.com/workers-ai/platform/errors/) mapped to adapter errors. */
const ERROR_CODES: Readonly<Record<number, AdapterErrorCode>> = {
  3036: "budget_spent",
  3040: "rate_limited",
  3007: "timeout",
  3008: "timeout",
};
const JSON_MODE_FAILURE = "JSON Mode couldn't be met";

/** The error code from a thrown error: a numeric `code` property, or a 4-digit code in the message. */
export function workersAiErrorCode(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  if ("code" in error && typeof error.code === "number") return error.code;
  const message = "message" in error && typeof error.message === "string" ? error.message : "";
  const match = /\b([35]\d{3})\b/.exec(message);
  return match?.[1] === undefined ? undefined : Number(match[1]);
}

function isJsonModeFailure(error: unknown): boolean {
  return typeof error === "object" && error !== null && "message" in error && typeof error.message === "string" && error.message.includes(JSON_MODE_FAILURE);
}

/**
 * The output text: `response` (a string, or an object in JSON mode) or the first chat
 * completion's content. A leading reasoning block and a Markdown code fence are removed;
 * anything unexpected becomes "" and fails the output validation.
 */
export function outputText(result: unknown): string {
  if (typeof result !== "object" || result === null) return "";
  let text: unknown;
  if ("response" in result) {
    text = typeof result.response === "string" ? result.response : JSON.stringify(result.response);
  } else if ("choices" in result && Array.isArray(result.choices)) {
    const first: unknown = result.choices[0];
    const message: unknown = typeof first === "object" && first !== null && "message" in first ? first.message : undefined;
    text = typeof message === "object" && message !== null && "content" in message ? message.content : undefined;
  }
  if (typeof text !== "string") return "";
  return text
    .replace(/^\s*<think>[\s\S]*?<\/think>/, "")
    .replace(/^\s*```(?:json)?\s*([\s\S]*?)\s*```\s*$/, "$1")
    .trim();
}

export function workersAiAdapter(options: WorkersAiOptions): SuggestionAdapter {
  return {
    async suggest(request, signal) {
      const dictionary = options.dictionary(request.locale);
      const inputs = {
        messages: buildMessages(request, dictionary),
        response_format: { type: "json_schema", json_schema: outputJsonSchema(dictionary.map((food) => food.id)) },
        max_tokens: MAX_OUTPUT_TOKENS,
        temperature: 0,
      };
      let result: unknown;
      try {
        result = await options.run(options.model, inputs, signal);
      } catch (error) {
        if (isJsonModeFailure(error)) return "";
        const code = workersAiErrorCode(error);
        throw new AdapterError((code === undefined ? undefined : ERROR_CODES[code]) ?? "unavailable");
      }
      return outputText(result);
    },
  };
}
