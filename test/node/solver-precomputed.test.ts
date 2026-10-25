import { describe, expect, it } from "vitest";
import { recommendationDataFromBundle } from "../../domain/recommendation/data.ts";
import { precompute, solve, type SolveInput } from "../../domain/recommendation/solver.ts";
import { presetTargets } from "../../domain/recommendation/validate.ts";
import type { Targets } from "../../domain/recommendation/types.ts";
import { repositoryEngine } from "../../tools/content/repository.ts";

// The precomputed solver results (Phase 9 Stage 9.3) change nothing: on every repository
// recipe, the solution with them equals the solution computed entirely in the search,
// also with locked sides and for inputs where they do not apply.
const data = recommendationDataFromBundle(repositoryEngine().calc);
const targetSets: readonly Targets[] = [
  presetTargets("cut"),
  presetTargets("maintain"),
  presetTargets("bulk"),
  { kcal: { min: 400, max: 600 }, proteinMin: 40, fatMax: 12, carbohydrate: { min: 30, max: 60 } },
];

describe("precomputed solver results on the repository recipes", () => {
  it("are built for every recipe from the same engine data", () => {
    expect([...data.precomputed.keys()]).toEqual(data.recipes.map((recipe) => recipe.id));
    const first = data.recipes[0];
    if (!first) throw new Error("No recipe");
    expect(data.precomputed.get(first.id)).toStrictEqual(precompute(first, data.engine));
  });

  it("give the same solution as the search without them", { timeout: 60_000 }, () => {
    for (const recipe of data.recipes) {
      const precomputed = data.precomputed.get(recipe.id);
      const removable = recipe.sides.filter((side) => side.solverMayRemove).map((side) => side.key);
      const variants: Partial<SolveInput>[] = [
        { servings: 1 },
        { servings: 2 },
        ...removable.map((key) => ({ servings: 1, lockedSides: [key] })),
        ...recipe.sides.filter((side) => !side.solverMayRemove).map((side) => ({ servings: 1, forced: { sidesOff: [side.key], substitutions: [] } })),
        ...recipe.substitutions.map((substitution) => ({ servings: 1, forced: { sidesOff: [], substitutions: [substitution.key] } })),
      ];
      for (const targets of targetSets) {
        for (const variant of variants) {
          const input: SolveInput = { recipe, targets, servings: 1, forced: { sidesOff: [], substitutions: [] }, lockedSides: [], ...variant };
          expect(solve({ ...input, ...(precomputed ? { precomputed } : {}) }, data.engine), `${recipe.id} ${JSON.stringify(variant)}`).toStrictEqual(solve(input, data.engine));
        }
      }
    }
  });
});
