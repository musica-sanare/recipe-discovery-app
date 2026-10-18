# Prompt 00 — Phase 0: validation and foundation

You are the lead engineer for Recipe Discovery. Read `CLAUDE.md` and every document under `docs/` before making changes. They are the current baseline. Communicate with the owner in Japanese; write repository files in English.

## Goal
Confirm the technical hypotheses the specification depends on (`docs/IMPLEMENTATION_PLAN.md` "Phase 0") and set up a minimal, reproducible toolchain. Do not build product features beyond what the validation needs.

## Working rules for this phase
- Work in stages. Each stage ends with checks, a Japanese summary (changed files, decisions, commands and results, 要確認, next stage), and a commit proposal. Commit only after the owner approves that specific commit (CLAUDE.md "Git and commit conventions").
- Before each stage, state the intended changes and files.
- Record verified facts, sources, and dates in `docs/DECISIONS.md`. Mark anything unverified 要確認.
- Never commit original source files (MEXT workbook or PDF). Keep them in `data/raw/` (git-ignored). Downloads need the owner's approval per file (name, source, size).
- Stop and ask before any decision that changes cost, security, privacy, the data model, or nutrition accuracy.

## Stages

### 0.1 Toolchain
1. Verify current stable versions and mutual compatibility of: Node.js, npm, TypeScript, React, Vite, i18next/react-i18next, Tailwind CSS, Zod, Vitest, jsdom, Testing Library, Playwright, axe-core, ESLint and typescript-eslint. Check Cloudflare's current documentation for serving a static Vite build from static assets without a Worker, and for security headers.
2. Propose the package scripts, TypeScript configuration, lint boundaries (`domain/` must not import UI, i18n, or platform code), and the install-script allowlist policy. Wait for approval, then implement.
3. Minimal app shell: `ja`/`en`/`es` typed message catalogs (missing keys fail type-checking), language switcher, `<html lang>` sync, strict CSP headers generated from one definition.
4. Acceptance: `npm ci` from the lockfile; lint, type-check, tests, and build pass; no deploy script.

### 0.2 Composition extraction
1. Write `tools/` extraction that reads the workbook from `data/raw/`, verifies the SHA-256 in the manifest, and writes only requested food codes and columns with notation flags (`docs/NUTRITION_CALCULATION.md` §3).
2. Tests with a small synthetic fixture (not the real workbook) for parsing and notation handling.
3. Acceptance: subset and manifest generated reproducibly; unmeasured values are never zero.

### 0.3 Cooking data
1. Determine how to obtain Table 12 (weight change rates) and Tables 13–14 from the explanation PDF reliably (text extraction, manual transcription with double-checking, or another method). Report the options and trade-offs before choosing.
2. For representative foods and methods (chicken breast, chicken thigh, pork loin, beef, salmon, white fish, eggs, tofu, rice, pasta, potatoes, broccoli, leafy greens, onions, mushrooms; boiling, grilling, stir-frying, steaming, microwaving, deep-frying), list which pairs are exact, approximate, or hard to estimate.

### 0.4 Validation recipes and food dictionary
1. Define a minimal provisional content format (to be refined in Phase 1) and author about 20 original recipes that represent cutting, maintenance, bulking, quick, low-effort, batch-cooking, and fried dishes across several cuisines.
2. Build the food dictionary entries they need: locale-neutral IDs, food codes and cooking states, names and aliases in `ja`/`en`/`es`, allergen links with confidence, household measures.
3. Follow `docs/CONTENT_POLICY.md` (original content, food safety notes, no health claims). Present the recipe list for the owner's review before writing all translations.

### 0.5 Calculation checks
1. Implement a minimal pure calculation (formulas c4/c5, notation handling, uncertainty classes) sufficient for the validation recipes.
2. Compare `PROT-` vs `PROTCAA` and `FAT-` vs `FATNLEA` on these recipes; propose the carbohydrate column (ADR-011).
3. Cross-check several recipes with an independent hand calculation from the source values.
4. Add the locale invariance test.

### 0.6 Coverage and adjustment
1. Using the validation recipes, evaluate how many recipes meet representative targets with fixed amounts and with bounded adjustment, including diversity and required-ingredient scenarios.
2. Propose the initial recipe count and the MVP scope of automatic adjustment, with the evidence.

### 0.7 Proposals for provisional values
Propose tolerance, display rounding, range threshold, and preset values (`docs/SPEC.md` §16) with reasoning from the validation results. Update the documents only after the owner decides.

## Constraints
- No deployment, external accounts, API keys, or paid resources.
- No AI calls.
- Keep dependencies minimal and justified in `docs/DECISIONS.md`.
- Do not change the accepted ADRs without the owner's approval.

## Phase acceptance
- All stage acceptance checks pass and are reported with actual command results.
- Each validation item has a recorded result in `docs/DECISIONS.md`; open items are listed as 要確認.
- The owner has decided the Phase 0 items in `docs/SPEC.md` §16.
