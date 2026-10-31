import { describe, expect, it } from "vitest";
import { foods } from "../../content/foods.ts";
import { forbiddenExpressions } from "../../content/glossary.ts";
import { fakeAdapter, type FakeBehavior } from "../../server/ai/fake.ts";
import { handleSuggest, type SuggestOptions } from "../../server/ai/suggest.ts";
import { interpretResponse, type ValidationContext } from "../../shared/suggestion.ts";

// Endpoint core of the AI free-text conditions with the fake adapter; no network (ADR-034).
const context: ValidationContext = { foodIds: new Set(foods.map((food) => food.id)), forbiddenExpressions };
const conditions = { requiredFoods: [["chickpeas"]], excludedFoods: ["cod", "salmon"], cuisines: [] };
const request = { text: "  something with chickpeas, no fish  ", locale: "en" };

function run(behavior: FakeBehavior, body: unknown = request, options: Partial<SuggestOptions> = {}) {
  const adapter = fakeAdapter(() => behavior);
  return { adapter, result: handleSuggest(body, { adapter, context, enabled: true, ...options }) };
}

describe("suggestion endpoint core", () => {
  it("sends only the trimmed text and the locale, and returns the validated output", async () => {
    const { adapter, result } = run({ output: JSON.stringify({ kind: "conditions", conditions }) });
    expect(await result).toEqual({ status: 200, body: { kind: "conditions", conditions } });
    expect(adapter.calls).toEqual([{ text: "something with chickpeas, no fish", locale: "en" }]);
  });

  it("does nothing when the feature is disabled", async () => {
    const { adapter, result } = run({ output: "{}" }, request, { enabled: false });
    expect(await result).toEqual({ status: 503, body: { kind: "error", error: "disabled" } });
    expect(adapter.calls).toEqual([]);
  });

  it.each([
    ["a null body", null],
    ["blank text", { text: " ", locale: "ja" }],
    ["too long text", { text: "x".repeat(201), locale: "en" }],
    ["an unknown locale", { text: "tofu", locale: "it" }],
    ["user targets", { ...request, targets: { kcal: { min: 400, max: 600 } } }],
  ])("rejects %s without calling the provider", async (_, body) => {
    const { adapter, result } = run({ output: "{}" }, body);
    expect(await result).toEqual({ status: 400, body: { kind: "error", error: "invalid_request" } });
    expect(adapter.calls).toEqual([]);
  });

  it.each([
    ["rate_limited", 429],
    ["budget_spent", 503],
    ["refused", 502],
    ["unavailable", 502],
    ["timeout", 504],
  ] as const)("maps the adapter error %s to its status", async (error, status) => {
    expect(await run({ error }).result).toEqual({ status, body: { kind: "error", error } });
  });

  it("times out when the provider does not answer", async () => {
    expect(await run({ hang: true }, request, { timeoutMs: 5 }).result).toEqual({ status: 504, body: { kind: "error", error: "timeout" } });
  });

  it("times out even when an adapter ignores the abort signal", async () => {
    const adapter = { suggest: () => new Promise<string>(() => undefined) };
    expect(await handleSuggest(request, { adapter, context, enabled: true, timeoutMs: 5 })).toEqual({ status: 504, body: { kind: "error", error: "timeout" } });
  });

  it("maps an unexpected adapter failure to unavailable", async () => {
    const adapter = { suggest: () => Promise.reject(new Error("socket hang up")) };
    expect(await handleSuggest(request, { adapter, context, enabled: true })).toEqual({ status: 502, body: { kind: "error", error: "unavailable" } });
  });

  it.each([
    ["not_json", "Sure! Chickpeas without fish."],
    ["unknown_food", JSON.stringify({ kind: "conditions", conditions: { ...conditions, excludedFoods: ["tilapia"] } })],
    ["forbidden_field", JSON.stringify({ kind: "conditions", conditions: { ...conditions, targets: { proteinMin: 30 } } })],
    ["forbidden_expression", JSON.stringify({ kind: "out_of_scope", topic: "other", note: "detox" })],
    ["schema", JSON.stringify({ kind: "conditions", conditions: { ...conditions, servings: 2 } })],
  ])("returns invalid_output with the rejection reason %s", async (reason, output) => {
    expect(await run({ output }).result).toEqual({ status: 502, body: { kind: "error", error: "invalid_output" }, rejection: reason });
  });

  it("produces responses that the browser interprets as the matching outcome", async () => {
    const ok = await run({ output: JSON.stringify({ kind: "conditions", conditions }) }).result;
    expect(interpretResponse(ok.status, ok.body, context)).toEqual({ kind: "suggestion", suggestion: conditions });
    const outOfScope = await run({ output: JSON.stringify({ kind: "out_of_scope", topic: "allergens" }) }).result;
    expect(interpretResponse(outOfScope.status, outOfScope.body, context)).toMatchObject({ kind: "out_of_scope", messageKey: "ai.outOfScope.allergens" });
    const failed = await run({ error: "budget_spent" }).result;
    expect(interpretResponse(failed.status, failed.body, context)).toEqual({ kind: "fallback", failure: "budget_spent", messageKey: "ai.error.budget_spent" });
  });
});
