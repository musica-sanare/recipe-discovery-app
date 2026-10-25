// @vitest-environment jsdom
import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { RecommendationData } from "../../domain/recommendation/data.ts";
import { useLoadedContent } from "../../src/state/context.ts";
import { ContentProvider } from "../../src/state/providers.tsx";
import { buildCalcBundle, buildTextBundle } from "../../tools/content/bundle.ts";
import { validationBundleInput } from "../../tools/content/repository.ts";

// The precomputed solver results are added after the first view (docs/working/DECISIONS.md "Stage 9.3").
const input = validationBundleInput();
const calc = buildCalcBundle(input);
const text = buildTextBundle(input, "ja");

afterEach(() => {
  cleanup();
});

describe("ContentProvider", () => {
  it("renders first with the data without precomputed solver results, then adds them", async () => {
    const seen: RecommendationData[] = [];
    function Probe() {
      seen.push(useLoadedContent().data);
      return null;
    }
    render(
      <ContentProvider calc={calc} text={text}>
        <Probe />
      </ContentProvider>,
    );
    expect(seen.map((data) => data.precomputed.size)).toEqual([0]);
    expect(calc.recipes.length).toBeGreaterThan(0);
    await waitFor(() => {
      expect(seen.at(-1)?.precomputed.size).toBe(calc.recipes.length);
    });
    const last = seen.at(-1);
    // Only the precomputed results are added; the engine data and the recipes stay the same objects.
    expect(last?.engine).toBe(seen[0]?.engine);
    expect(last?.recipes).toBe(seen[0]?.recipes);
  });
});
