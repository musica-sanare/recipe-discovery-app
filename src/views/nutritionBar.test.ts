import { describe, expect, it } from "vitest";
import { barGeometry } from "./nutritionBar";

describe("barGeometry", () => {
  it("places a range target, the estimate range, and the value on one scale", () => {
    // Largest number 750 → scale 937.5.
    expect(barGeometry({ value: 660, range: { low: 600, high: 670 }, target: { min: 550, max: 750 } })).toEqual({
      band: { from: 58.7, to: 80 },
      bandEdges: { start: true, end: true },
      range: { from: 64, to: 71.5 },
      value: 70.4,
    });
  });

  it("runs a minimum-only band to the end and a maximum-only band from the start", () => {
    expect(barGeometry({ value: 38, target: { min: 30 } })).toMatchObject({ band: { from: 63.2, to: 100 }, bandEdges: { start: true, end: false }, range: undefined });
    expect(barGeometry({ value: 16, target: { max: 20 } })).toMatchObject({ band: { from: 0, to: 80 }, bandEdges: { start: false, end: true } });
  });

  it("keeps a value above the target inside the track", () => {
    expect(barGeometry({ value: 30, range: { low: 26, high: 32 }, target: { max: 20 } })).toMatchObject({ value: 75, range: { from: 65, to: 80 } });
  });

  it("puts a value just below a minimum left of the band edge", () => {
    const geometry = barGeometry({ value: 34.6, target: { min: 35 } });
    expect(geometry.value).toBeLessThan(geometry.band.from);
  });

  it("draws zero at the start of the track", () => {
    expect(barGeometry({ value: 0, target: { max: 0 } })).toMatchObject({ value: 0, band: { from: 0, to: 0 } });
  });
});
