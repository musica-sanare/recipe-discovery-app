/**
 * Prints the composition coverage report for every recipe
 * (tools/content/composition-report.ts), calculated by the nutrition engine from the
 * in-memory calculation bundle. Fails when a recipe uses a cooked state without a
 * weight change rate.
 *
 *   node tools/report-composition.ts
 */
import { compositionCoverage, formatCompositionReport } from "./content/composition-report.ts";
import { repositoryEngine } from "./content/repository.ts";

try {
  const { calc, data } = repositoryEngine();
  console.log(formatCompositionReport(calc.recipes.map((recipe) => compositionCoverage(recipe, data))));
} catch (error) {
  console.error(`Composition report failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
