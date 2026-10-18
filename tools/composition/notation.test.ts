import { describe, expect, it } from "vitest";
import { parseCompositionValue } from "./notation.ts";

describe("parseCompositionValue", () => {
  it.each([
    ["23.3", { value: 23.3, notation: "measured" }],
    ["64.900000000000006", { value: 64.9, notation: "measured" }],
    ["0", { value: 0, notation: "zero" }],
    ["Tr", { value: 0, notation: "trace" }],
    ["(Tr)", { value: 0, notation: "estimated_trace" }],
    ["(0)", { value: 0, notation: "estimated_zero" }],
    ["(11.3)", { value: 11.3, notation: "estimated" }],
    [" 105 ", { value: 105, notation: "measured" }],
  ] as const)("parses %j", (raw, expected) => {
    expect(parseCompositionValue(raw)).toEqual(expected);
  });

  it("treats unmeasured values as unknown, never zero", () => {
    expect(parseCompositionValue("-")).toEqual({ value: null, notation: "unmeasured" });
  });

  it.each(["", "*", "abc", "(x)", "-1", "1,5"])("rejects %j", (raw) => {
    expect(() => parseCompositionValue(raw)).toThrow(/Unrecognized/);
  });
});
