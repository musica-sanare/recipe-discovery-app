/**
 * Deploy command of Workers Builds (ADR-035, docs/en/DEPLOYMENT.md §3). Never run it with a
 * Cloudflare login on a developer machine; locally, only `--dry-run` is used.
 *
 *   node platform/cloudflare/deploy.ts [--dry-run]
 *
 * Wrangler is not a repository dependency. It is installed at an exact version into a
 * temporary directory outside the repository, without install scripts, so the repository's
 * `.npmrc` (strict-allow-scripts, ADR-018) does not apply to it. Change the version only in a
 * reviewed commit (ADR-016).
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const WRANGLER_VERSION = "4.156.0";
const CONFIG = path.join(import.meta.dirname, "wrangler.jsonc");

const toolDir = mkdtempSync(path.join(tmpdir(), "wrangler-"));
const env = { ...process.env, WRANGLER_SEND_METRICS: "false" };

execFileSync("npm", ["install", "--prefix", toolDir, "--ignore-scripts", "--no-audit", "--no-fund", `wrangler@${WRANGLER_VERSION}`], { stdio: "inherit", env });
execFileSync(path.join(toolDir, "node_modules", ".bin", "wrangler"), ["deploy", "--config", CONFIG, ...process.argv.slice(2)], { stdio: "inherit", env });
