/**
 * Recommendation timing in Node (Phase 6 Stage 6.2, ADR-030 D10): a full search
 * (`evaluatePool` and `selectCandidates`, as the UI's `search`) on the repository
 * recipes and on a synthetic library of about 100 recipes, where the first 40
 * recipes are added again under new IDs. The synthetic library exists only in memory
 * for this measurement and is never published.
 *
 *   node tools/benchmark-recommendation.ts
 */
import type { BundleRecipe, CalcBundle } from "../shared/bundle.ts";
import { recommendationDataFromBundle, type RecommendationData } from "../domain/recommendation/data.ts";
import { evaluatePool, selectCandidates } from "../domain/recommendation/recommend.ts";
import type { Conditions, PoolRequest, Session } from "../domain/recommendation/types.ts";
import { presetTargets } from "../domain/recommendation/validate.ts";
import { repositoryEngine } from "./content/repository.ts";

const WARM_UP = 3;
const RUNS = 15;
const SYNTHETIC_EXTRA = 40;

const none: Conditions = { excludedFoods: [], excludedAllergens: [], requiredFoods: [], cuisines: [] };
const emptySession: Session = { shown: [], excluded: [], previous: [], keep: [] };

// The scenarios of the browser timing (e2e/timing.spec.ts).
const scenarios: Readonly<Record<string, PoolRequest>> = {
  "cut": { targets: presetTargets("cut"), servings: 1, conditions: none },
  "bulk": { targets: presetTargets("bulk"), servings: 1, conditions: none },
  "maintain, tofu required": { targets: presetTargets("maintain"), servings: 1, conditions: { ...none, requiredFoods: [["tofu_firm", "tofu_silken"]] } },
  "bulk, <= 15 min": { targets: presetTargets("bulk"), servings: 1, conditions: { ...none, maxMinutes: 15 } },
};

function synthetic(calc: CalcBundle): CalcBundle {
  const copies = calc.recipes.slice(0, SYNTHETIC_EXTRA).map((recipe): BundleRecipe => ({ ...recipe, id: `${recipe.id}__copy` }));
  return { ...calc, recipes: [...calc.recipes, ...copies] };
}

/** Grid states the solver scores: adjustable grid sizes times the subsets of removable sides. */
function gridPoints(recipes: readonly BundleRecipe[]): number {
  return recipes.reduce((sum, recipe) => {
    const grid = recipe.ingredients.reduce((product, ingredient) => {
      const adjust = ingredient.adjust;
      if (!adjust) return product;
      return product * (adjust.kind === "count" ? adjust.max - adjust.min + 1 : Math.floor((adjust.max - adjust.min) / adjust.step + 1e-9) + 1);
    }, 1);
    return sum + grid * 2 ** recipe.sides.filter((side) => side.solverMayRemove).length;
  }, 0);
}

function search(request: PoolRequest, data: RecommendationData): void {
  const pool = evaluatePool(request, data);
  if (!pool.ok) throw new Error(JSON.stringify(pool.errors));
  const selection = selectCandidates(pool.value, emptySession, 0);
  if (!selection.ok) throw new Error(JSON.stringify(selection.errors));
}

function measure(request: PoolRequest, data: RecommendationData): { median: number; p90: number } {
  for (let run = 0; run < WARM_UP; run++) search(request, data);
  const samples: number[] = [];
  for (let run = 0; run < RUNS; run++) {
    const start = performance.now();
    search(request, data);
    samples.push(performance.now() - start);
  }
  const sorted = samples.sort((a, b) => a - b);
  const at = (q: number) => sorted[Math.min(sorted.length - 1, Math.ceil(q * sorted.length) - 1)] ?? Number.NaN;
  return { median: at(0.5), p90: at(0.9) };
}

const { calc } = repositoryEngine();
const libraries: Readonly<Record<string, CalcBundle>> = { repository: calc, synthetic: synthetic(calc) };

console.log(`Node ${process.version}; median / p90 of ${String(RUNS)} runs after ${String(WARM_UP)} warm-up runs, ms.\n`);
for (const [name, bundle] of Object.entries(libraries)) {
  const data = recommendationDataFromBundle(bundle);
  console.log(`${name}: ${String(bundle.recipes.length)} recipes, ${String(gridPoints(bundle.recipes))} grid states`);
  for (const [scenario, request] of Object.entries(scenarios)) {
    const { median, p90 } = measure(request, data);
    console.log(`  ${scenario.padEnd(24)} ${median.toFixed(1).padStart(6)} / ${p90.toFixed(1)}`);
  }
}
