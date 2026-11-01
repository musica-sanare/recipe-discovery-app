// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Icon, Illustration } from "../../src/components/icons/Icon.tsx";
import { ICON_NAMES, ICONS } from "../../src/components/icons/iconData.ts";
import { ILLUSTRATION_NAMES, ILLUSTRATIONS } from "../../src/components/icons/illustrationData.ts";
import { axeViolations } from "../../src/testing/axe.ts";

// Original SVG icons and illustrations (ADR-037 D3, D4).

afterEach(() => {
  cleanup();
});

/** Path data only: numbers, commands, separators. Text would need a <text> element anyway. */
const PATH_DATA = /^[MmLlHhVvCcSsQqTtAaZz0-9.,\s-]+$/;

describe("icons", () => {
  it.each(ICON_NAMES)("%s is valid path data on the 24 px grid", (name) => {
    for (const shape of ICONS[name]) {
      expect(shape.d).toMatch(PATH_DATA);
    }
    const { container } = render(<Icon name={name} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
    expect(svg?.querySelectorAll("path").length).toBe(ICONS[name].length);
    expect(svg?.querySelector("text, foreignObject, image")).toBeNull();
  });

  it("is hidden from assistive technology without a label", () => {
    const { container } = render(<Icon name="time" />);
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("is an image with its label when it carries meaning", async () => {
    const { container } = render(<Icon name="status_met" label="目標の範囲内" />);
    expect(screen.getByRole("img", { name: "目標の範囲内" })).toBeDefined();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("draws the status markers with distinct shapes", () => {
    const shapes = ["status_met", "status_near", "status_not_met", "status_unknown"] as const;
    const signatures = shapes.map((name) => JSON.stringify(ICONS[name]));
    expect(new Set(signatures).size).toBe(shapes.length);
    expect(ICONS.status_unknown.some((shape) => "dashed" in shape)).toBe(true);
  });
});

describe("illustrations", () => {
  it.each(ILLUSTRATION_NAMES)("%s is decorative path data without text", (name) => {
    for (const shape of ILLUSTRATIONS[name]) {
      expect(shape.d).toMatch(PATH_DATA);
    }
    const { container } = render(<Illustration name={name} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.querySelector("text, foreignObject, image")).toBeNull();
  });
});
