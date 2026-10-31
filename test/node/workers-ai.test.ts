import { describe, expect, it } from "vitest";
import { buildMessages } from "../../server/ai/prompt.ts";
import { handleSuggest } from "../../server/ai/suggest.ts";
import { MAX_OUTPUT_TOKENS, outputText, workersAiAdapter, workersAiErrorCode, type WorkersAiRunner } from "../../server/ai/workers-ai.ts";
import { CUISINES, EQUIPMENT } from "../../shared/content.ts";
import { SUPPORTED_LOCALES } from "../../shared/locales.ts";
import { promptDictionary, repositoryContext } from "../../tools/ai-evaluation/run.ts";

// Workers AI adapter and prompt with a fake transport; no network (ADR-034 D2 revised).
const conditions = { kind: "conditions", conditions: { requiredFoods: [["chicken_breast"]], excludedFoods: [], maxMinutes: 20, cuisines: [] } };
const request = { text: "鶏むね肉で20分以内、辛くないもの", locale: "ja" } as const;

function adapterWith(run: WorkersAiRunner) {
  return workersAiAdapter({ model: "@cf/qwen/qwen3-30b-a3b-fp8", run, dictionary: promptDictionary });
}

describe("Workers AI prompt", () => {
  it.each(SUPPORTED_LOCALES)("lists every dictionary food with its %s names and passes the text as delimited data", (locale) => {
    const [system, user] = buildMessages({ text: "chickpeas, no fish", locale }, promptDictionary(locale));
    for (const food of promptDictionary(locale)) expect(system?.content).toContain(`${food.id}: ${food.name}`);
    for (const value of [...EQUIPMENT, ...CUISINES]) expect(system?.content).toContain(value);
    expect(user).toEqual({ role: "user", content: expect.stringContaining(`(language: ${locale})`) as unknown });
    expect(user?.content).toContain("<<<\nchickpeas, no fish\n>>>");
  });

  it("uses the names of the request locale only", () => {
    const [system] = buildMessages(request, promptDictionary("ja"));
    expect(system?.content).toContain("chicken_breast: 鶏むね肉（皮なし）");
    expect(system?.content).not.toContain("Pechuga de pollo");
  });
});

describe("Workers AI adapter", () => {
  it("sends the messages, the output schema with the dictionary IDs, and the limits", async () => {
    const calls: { model: string; inputs: Readonly<Record<string, unknown>> }[] = [];
    const adapter = adapterWith((model, inputs) => {
      calls.push({ model, inputs });
      return Promise.resolve({ response: conditions });
    });
    expect(await adapter.suggest(request, new AbortController().signal)).toBe(JSON.stringify(conditions));
    const inputs = calls[0]?.inputs;
    expect(calls[0]?.model).toBe("@cf/qwen/qwen3-30b-a3b-fp8");
    expect(inputs).toMatchObject({ messages: buildMessages(request, promptDictionary("ja")), max_tokens: MAX_OUTPUT_TOKENS, temperature: 0, response_format: { type: "json_schema" } });
    expect(JSON.stringify(inputs?.response_format)).toContain(JSON.stringify([...repositoryContext.foodIds]));
  });

  it("returns a validated suggestion through the endpoint core", async () => {
    const adapter = adapterWith(() => Promise.resolve({ choices: [{ message: { role: "assistant", content: JSON.stringify(conditions) } }] }));
    expect(await handleSuggest(request, { adapter, context: repositoryContext, enabled: true })).toEqual({ status: 200, body: conditions });
  });

  it.each([
    ["a JSON-mode object", { response: conditions }, JSON.stringify(conditions)],
    ["a response string", { response: ` ${JSON.stringify(conditions)} ` }, JSON.stringify(conditions)],
    ["a chat completion", { choices: [{ message: { content: JSON.stringify(conditions) } }] }, JSON.stringify(conditions)],
    ["a reasoning block", { response: `<think>\nThe user wants chicken.\n</think>\n${JSON.stringify(conditions)}` }, JSON.stringify(conditions)],
    ["a code fence", { response: `\`\`\`json\n${JSON.stringify(conditions)}\n\`\`\`` }, JSON.stringify(conditions)],
    ["no text", { choices: [] }, ""],
    ["a non-object", "text", ""],
  ])("extracts the output text from %s", (_, result, text) => {
    expect(outputText(result)).toBe(text);
  });

  it.each([
    ["the spent daily allocation", Object.assign(new Error("Account limited"), { code: 3036 }), "budget_spent"],
    ["a capacity limit", new Error("3040: Capacity temporarily exceeded, please try again."), "rate_limited"],
    ["a provider timeout", new Error("AiError: 3007: Request timeout"), "timeout"],
    ["a model that needs Workers Paid", new Error("5035: Model requires Workers Paid plan"), "unavailable"],
    ["an unknown failure", new Error("network down"), "unavailable"],
  ])("maps %s to an adapter error", async (_, error, code) => {
    const result = await handleSuggest(request, { adapter: adapterWith(() => Promise.reject(error)), context: repositoryContext, enabled: true });
    expect(result.body).toEqual({ kind: "error", error: code });
  });

  it("treats a JSON mode failure as an invalid output", async () => {
    const result = await handleSuggest(request, { adapter: adapterWith(() => Promise.reject(new Error("JSON Mode couldn't be met"))), context: repositoryContext, enabled: true });
    expect(result).toEqual({ status: 502, body: { kind: "error", error: "invalid_output" }, rejection: "not_json" });
  });

  it("rejects an output with a food outside the dictionary", async () => {
    const output = { kind: "conditions", conditions: { requiredFoods: [["tilapia"]], excludedFoods: [], cuisines: [] } };
    const result = await handleSuggest(request, { adapter: adapterWith(() => Promise.resolve({ response: output })), context: repositoryContext, enabled: true });
    expect(result.rejection).toBe("unknown_food");
  });

  it("reads error codes from a property or the message", () => {
    expect(workersAiErrorCode({ code: 3036 })).toBe(3036);
    expect(workersAiErrorCode(new Error("InferenceUpstreamError: 3040"))).toBe(3040);
    expect(workersAiErrorCode(new Error("no code here 12"))).toBeUndefined();
    expect(workersAiErrorCode("3036")).toBeUndefined();
  });
});
