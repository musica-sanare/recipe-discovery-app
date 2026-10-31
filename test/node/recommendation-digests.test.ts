import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { recommendationDataFromBundle } from "../../domain/recommendation/data.ts";
import { evaluatePool, selectCandidates } from "../../domain/recommendation/recommend.ts";
import type { Conditions, PoolRequest, Targets } from "../../domain/recommendation/types.ts";
import { repositoryEngine } from "../../tools/content/repository.ts";

// Complete recommendation results for 240 requests on the repository recipes, as digests,
// so that performance work (Phase 9 Stage 9.3) can show that nothing moved: the pool with
// every solver result at full precision, the first selection (seed 0), and the next set
// (seed 1 with the first set shown). Any changed digest is a behavior change (ADR-029).
const data = recommendationDataFromBundle(repositoryEngine().calc);
const none: Conditions = { excludedFoods: [], excludedAllergens: [], requiredFoods: [], cuisines: [] };

const conditionSets: Readonly<Record<string, Conditions>> = {
  "none": none,
  "tofu required": { ...none, requiredFoods: [["tofu_firm", "tofu_silken"]] },
  "<= 15 min": { ...none, maxMinutes: 15 },
  "egg and cooked rice left out": { ...none, excludedAllergens: ["egg"], excludedFoods: ["rice_cooked"] },
  "microwave only": { ...none, equipment: ["microwave"] },
  "preferences": { ...none, effort: 1, cuisines: ["japanese", "korean"] },
};
const energies = [
  { min: 400, max: 550 },
  { min: 450, max: 650 },
  { min: 550, max: 750 },
  { min: 750, max: 950 },
  { min: 650, max: 1000 },
];
const variants: readonly Omit<Targets, "kcal">[] = [{}, { proteinMin: 40, fatMax: 15 }, { proteinMin: 30, carbohydrate: { min: 40, max: 100 } }, { fatMax: 25 }];

const requests: [string, PoolRequest][] = Object.entries(conditionSets).flatMap(([name, conditions]) =>
  energies.flatMap((kcal) =>
    variants.flatMap((variant) =>
      [1, 2].map((servings): [string, PoolRequest] => {
        const targets: Targets = { kcal, ...variant };
        return [`${name} ${JSON.stringify(targets)} x${String(servings)}`, { targets, servings, conditions }];
      }),
    ),
  ),
);

// Maps and Sets as arrays; the engine data and the memo are inputs, not results.
const replacer = (key: string, value: unknown): unknown =>
  key === "data" || key === "cache" ? undefined : value instanceof Map ? [...value] : value instanceof Set ? [...value] : value;

function digest(request: PoolRequest): string {
  const pool = evaluatePool(request, data);
  const parts = [JSON.stringify(pool, replacer)];
  if (pool.ok) {
    const first = selectCandidates(pool.value, { shown: [], excluded: [], previous: [], keep: [] }, 0);
    parts.push(JSON.stringify(first, replacer));
    if (first.ok) {
      const shown = first.value.candidates.map((candidate) => candidate.recipe);
      parts.push(JSON.stringify(selectCandidates(pool.value, { shown, excluded: [], previous: shown, keep: [] }, 1), replacer));
    }
  }
  return createHash("sha256").update(parts.join("\n")).digest("hex").slice(0, 16);
}

describe("recommendation digests on the repository recipes", () => {
  it("keeps the pool, the first selection, and the next set of 240 requests", { timeout: 60_000 }, () => {
    expect(requests).toHaveLength(240);
    expect(Object.fromEntries(requests.map(([name, request]) => [name, digest(request)]))).toMatchSnapshot();
  });
});
