import { describe, expect, it } from "vitest";
import { loadContentInput } from "../../tools/content/load.ts";
import { formatIssue, validateContent } from "../../tools/content/validate.ts";

// The rules and their failing fixtures live in tools/content/validate.test.ts.
describe("repository content", () => {
  it("passes content validation", async () => {
    const input = await loadContentInput();
    expect(input.recipes.length).toBeGreaterThan(0);
    expect(validateContent(input).map(formatIssue)).toEqual([]);
  });
});
