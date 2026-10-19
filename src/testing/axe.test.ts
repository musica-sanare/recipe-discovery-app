// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { axeViolations } from "./axe";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("axeViolations", () => {
  it("reports real violations in jsdom", async () => {
    document.body.innerHTML = '<main><img src="x.png"><button></button></main>';
    const violations = await axeViolations();
    expect(violations.map((violation) => violation.split(":")[0])).toEqual(expect.arrayContaining(["image-alt", "button-name"]));
  });
});
