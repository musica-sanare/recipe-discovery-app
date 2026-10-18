/**
 * Validates all content (tools/content/validate.ts) and fails with one line per
 * problem. Run by `npm run build` and therefore by `npm run check`.
 *
 *   node tools/validate-content.ts
 */
import { loadContentInput } from "./content/load.ts";
import { formatIssue, validateContent } from "./content/validate.ts";

const input = await loadContentInput();
const issues = validateContent(input);

if (issues.length > 0) {
  console.error(`Content validation failed with ${String(issues.length)} problem(s):`);
  for (const issue of issues) console.error(`  ${formatIssue(issue)}`);
  process.exit(1);
}
console.log(`Content valid: ${String(input.foods.length)} foods, ${String(input.recipes.length)} recipes, version ${input.contentVersion}.`);
