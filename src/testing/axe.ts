import axe from "axe-core";

/**
 * Runs axe-core on a rendered tree in jsdom (ADR-030 D11). Color contrast cannot be
 * computed in jsdom; test/node/styles.test.ts checks the color tokens instead.
 */
export async function axeViolations(root: Element = document.body): Promise<string[]> {
  const results = await axe.run(root, { rules: { "color-contrast": { enabled: false } } });
  return results.violations.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`);
}
