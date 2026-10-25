/**
 * Coverage evaluation (Phase 0 Stage 0.6, docs/working/IMPLEMENTATION_PLAN.md "Phase 0", item
 * 6): how many validation recipes meet representative targets with default amounts
 * and with bounded amount adjustment. Since Stage 3.7 it runs the recommendation
 * engine (ADR-029): hard filters, fit with shown ranges, and the solver, on the
 * in-memory calculation bundle (ADR-028 decision E).
 *
 *   node tools/evaluate-coverage.ts
 */
import { recommendationDataFromBundle } from "../domain/recommendation/data.ts";
import { evaluatePool } from "../domain/recommendation/recommend.ts";
import type { Conditions, Preset } from "../domain/recommendation/types.ts";
import { PROTEIN_SHORTFALL, TOLERANCE, presetTargets } from "../domain/recommendation/validate.ts";
import { repositoryEngine } from "./content/repository.ts";

const { calc } = repositoryEngine();
const data = recommendationDataFromBundle(calc);
const none: Conditions = { excludedFoods: [], excludedAllergens: [], requiredFoods: [], cuisines: [] };

interface Scenario {
  readonly name: string;
  readonly preset: Preset;
  readonly conditions: Partial<Conditions>;
}

const scenarios: readonly Scenario[] = [
  { name: "S1 cut", preset: "cut", conditions: {} },
  { name: "S2 cut, <=20 min", preset: "cut", conditions: { maxMinutes: 20 } },
  { name: "S3 maintain", preset: "maintain", conditions: {} },
  { name: "S4 bulk", preset: "bulk", conditions: {} },
  { name: "S5 cut, no egg", preset: "cut", conditions: { excludedAllergens: ["egg"] } },
  { name: "S6 maintain, chicken required", preset: "maintain", conditions: { requiredFoods: [["chicken_breast", "chicken_thigh", "chicken_mince"]] } },
  { name: "S7 maintain, tofu required", preset: "maintain", conditions: { requiredFoods: [["tofu_firm", "tofu_silken"]] } },
  { name: "S8 bulk, <=25 min", preset: "bulk", conditions: { maxMinutes: 25 } },
];

/** Smallest library size N with P(X >= 3) >= 0.9 for X ~ Binomial(N, p). */
function neededFor90(p: number): number | null {
  if (p <= 0) return null;
  for (let n = 3; n <= 2000; n++) {
    let below = 0;
    for (let k = 0; k < 3; k++) {
      let comb = 1;
      for (let i = 0; i < k; i++) comb = (comb * (n - i)) / (i + 1);
      below += comb * p ** k * (1 - p) ** (n - k);
    }
    if (1 - below >= 0.9) return n;
  }
  return null;
}

const format = (value: number | null, digits: number) => (value === null ? "?" : value.toFixed(digits));

console.log(`Validation recipes: ${String(calc.recipes.length)}. Tolerance ±${String(TOLERANCE * 100)} %, protein −${String(PROTEIN_SHORTFALL)} g; shown ranges count (ADR-029 D1).\n`);
for (const scenario of scenarios) {
  const result = evaluatePool({ targets: presetTargets(scenario.preset), servings: 1, conditions: { ...none, ...scenario.conditions } }, data);
  if (!result.ok) throw new Error(JSON.stringify(result.errors));
  const { entries } = result.value;
  const metFixed = entries.filter((entry) => entry.solution.defaultFit.tier === "met");
  const metAdjusted = entries.filter((entry) => entry.solution.fit.tier === "met");
  const nearAdjusted = entries.filter((entry) => entry.solution.fit.tier === "near");
  const distinct = new Set(metAdjusted.map((entry) => entry.attributes.proteinGroup)).size;
  const p = metAdjusted.length / calc.recipes.length;
  console.log(scenario.name);
  console.log(
    `  eligible ${String(entries.length)}/${String(calc.recipes.length)}; met fixed ${String(metFixed.length)}; met adjusted ${String(metAdjusted.length)} (near ${String(nearAdjusted.length)}); distinct main protein groups among met ${String(distinct)}`,
  );
  console.log(`  share of library met with adjustment ${(p * 100).toFixed(0)} %; library size for >=3 met with 90 % probability ≈ ${String(neededFor90(p) ?? "n/a")}`);
  for (const entry of metAdjusted) {
    const { perServing } = entry.solution.nutrition;
    const changes = [
      ...entry.solution.changes.map((change) => `${change.ingredient} ${String(change.from)}→${String(change.to)}`),
      ...entry.solution.sidesOff.map((side) => `${side} off`),
    ];
    console.log(
      `    ${entry.recipe.padEnd(28)} ${format(perServing.ENERC_KCAL, 0).padStart(4)} kcal P ${format(perServing["PROT-"], 1).padStart(5)} F ${format(perServing["FAT-"], 1).padStart(5)}  ${changes.join(", ") || "(default amounts)"}`,
    );
  }
}
