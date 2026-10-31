/**
 * Workers AI REST transport for the on-demand evaluation only (Stage 12.3); the Worker uses
 * its binding instead. The account ID and the API token come from the environment and
 * are never printed. Token usage is collected to measure neurons against the free
 * allocation (docs/working/DECISIONS.md "Provider change: Workers AI free allocation only").
 */
import type { WorkersAiModel, WorkersAiRunner } from "../../server/ai/workers-ai.ts";

export interface RestCredentials {
  readonly accountId: string;
  readonly apiToken: string;
}

export interface Usage {
  promptTokens: number;
  completionTokens: number;
  requests: number;
}

/** Neurons per million tokens, input and output (Workers AI pricing, verified 2026-10-31). */
export const NEURONS_PER_MILLION: Readonly<Record<WorkersAiModel, { readonly input: number; readonly output: number }>> = {
  "@cf/qwen/qwen3-30b-a3b-fp8": { input: 4625, output: 30475 },
  "@cf/google/gemma-4-26b-a4b-it": { input: 9091, output: 27273 },
};

export function neurons(model: WorkersAiModel, usage: Usage): number {
  const rate = NEURONS_PER_MILLION[model];
  return (usage.promptTokens * rate.input + usage.completionTokens * rate.output) / 1_000_000;
}

export function credentialsFromEnv(env: NodeJS.ProcessEnv = process.env): RestCredentials {
  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = env.CLOUDFLARE_API_TOKEN;
  if (accountId === undefined || accountId === "" || apiToken === undefined || apiToken === "") {
    throw new Error("Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN (a token limited to Workers AI).");
  }
  return { accountId, apiToken };
}

/** An error from the REST envelope, with the first Workers AI error code. */
export class RestError extends Error {
  readonly code: number | undefined;
  readonly status: number;

  constructor(status: number, code: number | undefined, message: string) {
    super(code === undefined ? message : `${String(code)}: ${message}`);
    this.name = "RestError";
    this.status = status;
    this.code = code;
  }
}

function firstError(body: unknown): { code: number | undefined; message: string } {
  const errors: unknown = typeof body === "object" && body !== null && "errors" in body ? body.errors : undefined;
  const first: unknown = Array.isArray(errors) ? errors[0] : undefined;
  if (typeof first !== "object" || first === null) return { code: undefined, message: "Workers AI request failed" };
  return {
    code: "code" in first && typeof first.code === "number" ? first.code : undefined,
    message: "message" in first && typeof first.message === "string" ? first.message : "Workers AI request failed",
  };
}

function addUsage(usage: Usage, result: unknown): void {
  usage.requests++;
  const reported: unknown = typeof result === "object" && result !== null && "usage" in result ? result.usage : undefined;
  if (typeof reported !== "object" || reported === null) return;
  if ("prompt_tokens" in reported && typeof reported.prompt_tokens === "number") usage.promptTokens += reported.prompt_tokens;
  if ("completion_tokens" in reported && typeof reported.completion_tokens === "number") usage.completionTokens += reported.completion_tokens;
}

/** A runner over `POST /accounts/{account_id}/ai/run/{model}`; `usage` accumulates the reported tokens. */
export function restRunner(credentials: RestCredentials, usage: Usage, fetchImpl: typeof fetch = fetch): WorkersAiRunner {
  return async (model, inputs, signal) => {
    const url = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(credentials.accountId)}/ai/run/${model}`;
    const response = await fetchImpl(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${credentials.apiToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(inputs),
      signal,
    });
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      throw new RestError(response.status, undefined, `Workers AI returned a non-JSON response (HTTP ${String(response.status)})`);
    }
    const success = typeof body === "object" && body !== null && "success" in body && body.success === true;
    if (!response.ok || !success) {
      const { code, message } = firstError(body);
      throw new RestError(response.status, code, message);
    }
    const result: unknown = typeof body === "object" && body !== null && "result" in body ? body.result : undefined;
    addUsage(usage, result);
    return result;
  };
}
