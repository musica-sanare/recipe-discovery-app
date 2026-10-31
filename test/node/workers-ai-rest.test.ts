import { describe, expect, it } from "vitest";
import { handleSuggest } from "../../server/ai/suggest.ts";
import { workersAiAdapter } from "../../server/ai/workers-ai.ts";
import { loadEvaluationSet } from "../../tools/ai-evaluation/cases.ts";
import { promptDictionary, repositoryContext, runEvaluation } from "../../tools/ai-evaluation/run.ts";
import { credentialsFromEnv, neurons, restRunner, type Usage } from "../../tools/ai-evaluation/workers-ai-rest.ts";

// Workers AI REST transport of the evaluation with a fake fetch; no network.
const credentials = { accountId: "account-id", apiToken: "test-token" };
const conditions = { kind: "conditions", conditions: { requiredFoods: [["chickpeas"]], excludedFoods: [], cuisines: [] } };
const request = { text: "something with chickpeas", locale: "en" } as const;

function fakeFetch(status: number, body: unknown, calls: { url: string; init: RequestInit | undefined }[] = []): typeof fetch {
  return (input, init) => {
    calls.push({ url: input instanceof Request ? input.url : String(input), init });
    return Promise.resolve(new Response(typeof body === "string" ? body : JSON.stringify(body), { status }));
  };
}

const emptyUsage = (): Usage => ({ promptTokens: 0, completionTokens: 0, requests: 0 });

function suggestWith(fetchImpl: typeof fetch, usage: Usage = emptyUsage()) {
  const adapter = workersAiAdapter({ model: "@cf/qwen/qwen3-30b-a3b-fp8", run: restRunner(credentials, usage, fetchImpl), dictionary: promptDictionary });
  return handleSuggest(request, { adapter, context: repositoryContext, enabled: true });
}

describe("Workers AI REST transport", () => {
  it("posts the inputs to the run endpoint with the bearer token and counts the reported tokens", async () => {
    const calls: { url: string; init: RequestInit | undefined }[] = [];
    const usage = emptyUsage();
    const fetchImpl = fakeFetch(200, { success: true, errors: [], messages: [], result: { response: conditions, usage: { prompt_tokens: 2400, completion_tokens: 60 } } }, calls);
    expect(await suggestWith(fetchImpl, usage)).toEqual({ status: 200, body: conditions });
    expect(calls[0]?.url).toBe("https://api.cloudflare.com/client/v4/accounts/account-id/ai/run/@cf/qwen/qwen3-30b-a3b-fp8");
    expect(calls[0]?.init?.method).toBe("POST");
    expect(calls[0]?.init?.headers).toEqual({ Authorization: "Bearer test-token", "Content-Type": "application/json" });
    const body = calls[0]?.init?.body;
    expect(typeof body === "string" ? JSON.parse(body) : undefined).toMatchObject({ max_tokens: 400, temperature: 0 });
    expect(usage).toEqual({ promptTokens: 2400, completionTokens: 60, requests: 1 });
  });

  it.each([
    ["the spent daily allocation", 429, { success: false, errors: [{ code: 3036, message: "Account limited" }] }, "budget_spent"],
    ["a capacity limit", 429, { success: false, errors: [{ code: 3040, message: "Capacity temporarily exceeded" }] }, "rate_limited"],
    ["a model that needs Workers Paid", 403, { success: false, errors: [{ code: 5035, message: "Model requires Workers Paid plan" }] }, "unavailable"],
    ["an authentication failure", 401, { success: false, errors: [{ code: 10000, message: "Authentication error" }] }, "unavailable"],
    ["a non-JSON response", 502, "<html>Bad gateway</html>", "unavailable"],
    ["a failure reported with status 200", 200, { success: false, errors: [] }, "unavailable"],
  ])("maps %s to an endpoint error", async (_, status, body, error) => {
    expect((await suggestWith(fakeFetch(status, body))).body).toEqual({ kind: "error", error });
  });

  it("stops an evaluation run at the first spent allocation", async () => {
    const set = loadEvaluationSet();
    const fetchImpl = fakeFetch(429, { success: false, errors: [{ code: 3036, message: "Account limited" }] });
    const adapter = workersAiAdapter({ model: "@cf/qwen/qwen3-30b-a3b-fp8", run: restRunner(credentials, emptyUsage(), fetchImpl), dictionary: promptDictionary });
    expect(await runEvaluation(set, adapter, ["ja", "en"])).toHaveLength(1);
  });

  it("reads the credentials from the environment and refuses missing ones", () => {
    expect(credentialsFromEnv({ CLOUDFLARE_ACCOUNT_ID: "a", CLOUDFLARE_API_TOKEN: "t" })).toEqual({ accountId: "a", apiToken: "t" });
    expect(() => credentialsFromEnv({ CLOUDFLARE_ACCOUNT_ID: "a" })).toThrow("CLOUDFLARE_API_TOKEN");
    expect(() => credentialsFromEnv({ CLOUDFLARE_ACCOUNT_ID: "", CLOUDFLARE_API_TOKEN: "t" })).toThrow("CLOUDFLARE_ACCOUNT_ID");
  });

  it("converts tokens to neurons with the verified rates", () => {
    expect(neurons("@cf/qwen/qwen3-30b-a3b-fp8", { promptTokens: 1_000_000, completionTokens: 1_000_000, requests: 1 })).toBe(4625 + 30475);
    expect(neurons("@cf/google/gemma-4-26b-a4b-it", { promptTokens: 5000, completionTokens: 150, requests: 1 })).toBeCloseTo(49.5, 1);
  });
});
