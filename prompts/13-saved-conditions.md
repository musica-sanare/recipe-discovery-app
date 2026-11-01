# Prompt 13 — Phase 13: Saved targets and conditions

You are the lead engineer for Recipe Discovery. Read `CLAUDE.md` and every document under `docs/en/` and `docs/working/` before making changes. Phase 0 to Phase 12 results are in `docs/working/DECISIONS.md` (in particular ADR-015, ADR-030 D9, ADR-032 D5, ADR-033, ADR-034, ADR-035; "Phase 12 acceptance"; "Release 9 and ninth production deployment"; "Open questions"). Every locale requirement means four locales: `ja`, `en`, `es`, and `fr`. Communicate with the owner in Japanese; write repository files in English.

## Starting point
- Branch `dev`; release 9 (Phase 12, free-text conditions) was deployed on 2026-11-01 by Workers Builds from `9a5120c`, merged into `main` as `f296aaf` (version `9f5b65ef-b9f8-44d7-8f19-b55c79b2893d`); `36e5e3e` (version `4f323282…`, the same app as release 8) is the rollback target. The owner pushes, merges `dev` into `main` by hand, and a merge into `main` deploys ([DEPLOYMENT.md](../docs/en/DEPLOYMENT.md) §3).
- Content version `2026-10-31.8`: 130 recipes and 117 foods in four locales. `npm run check` (838 tests), `npm run test:e2e` (152 passed, 1 skipped), and CI pass.
- Today the browser stores one key, the locale preference (`recipe-discovery.locale`, `src/i18n/localePreference.ts`). The targets form (`TargetsDraft` in `src/views/targets/draft.ts`) lives in memory and is lost on reload; so are the search, the comparison, the adjustments, and the shopping list (ADR-030 D9, ADR-032 D5). No cookies, no analytics, and no request to another origin.
- Maintenance: open question 22 (`minimatch`) and ADR-017 (TypeScript 7 support in `typescript-eslint`) are re-checked at the start of the phase.
- Later phases already named by the owner (2026-11-01): Phase 14, a UI/UX redesign with original icons and illustrations, and Phase 15, French and French-speaking cuisines. Keep this phase's UI consistent with the current styles; Phase 14 restyles it.

## Fixed constraints
- Principle 20: no accounts and no server-side storage of targets, conditions, or history. What is saved stays in the browser of the device; nothing is sent anywhere, put in a URL, or stored in a cookie.
- Principles 2 and 8: saved values are locale-free (food IDs, codes, numbers as entered); restoring them gives the same search request and the same results as typing them again; the locale is not part of the saved conditions.
- Saving is opt-in. With saving off, the app behaves exactly as release 9 and writes nothing new to storage.
- The CSP and the security headers stay as they are; no new dependency unless the owner approves it under ADR-016.
- Storage can fail or be cleared at any time (private browsing, full or disabled storage, the user clearing site data). The app never fails because of it.
- Allergen choices are personal and health-related. Whether they are saved is the owner's decision (13.1); if they are, the UI says so before saving.

## Goal
Let a user keep their targets and conditions on their own device, by their own choice, and find them again on the next visit, without any server, account, or tracking.

## Working rules
- Work in stages. Each stage starts with the intended changes and affected files, and ends with checks, a Japanese summary (changed files, decisions, commands and results, 要確認, next stage), and a commit proposal with the full message and file list written in the message itself. Commit only after the owner approves that specific commit.
- Verify current official documentation (MDN for Web Storage behavior and limits; the relevant legal guidance on device storage if a consent question arises) before relying on it; record the source and the date checked in `docs/working/DECISIONS.md`; mark anything unverified as 要確認.
- Every change to `docs/en/` updates `docs/ja/` and its source line in the same commit.

## Stages

### 13.1 Decisions (owner review)
Propose options with trade-offs and a recommendation for each, and wait for the owner's decisions:
1. **What is saved**: targets (preset, edited values), time limit, effort, cuisines, equipment, required and excluded foods, allergens (yes or no, see the constraint above). Not saved in any option: the free text of Phase 12, search results, the comparison, the adjustments, and the shopping list, unless the owner adds one of them here.
2. **Mechanism**: `localStorage` (recommended: small, synchronous, already used for the locale) against IndexedDB and `sessionStorage`; one key with a versioned record; size and quota.
3. **Opt-in and control**: where the switch lives (the targets view), its wording in four locales, what happens when it is turned on (save the current form) and off (delete the record), a "delete saved conditions" action, and a short note that anyone using the same browser can see them.
4. **When to save and restore**: on each change or on "Find recipes"; restore into the form on load without starting a search; what the user sees when a saved record was restored.
5. **Validation and versioning**: a runtime schema for the record; unknown or removed food IDs, cuisines, or equipment after a content update are dropped with a notice; an invalid record is deleted silently; a schema version for later changes.
6. **Documentation and privacy**: revisions of ADR-030 D9 and ADR-015, [SPEC.md](../docs/en/SPEC.md) §3 and §13, the about page's privacy text in four locales, and whether storage the user turns on needs any further consent (要確認 until checked).

Record the decisions as a new ADR (or revisions of ADR-030 D9 and ADR-015) and update [SPEC.md](../docs/en/SPEC.md) with its translation.

### 13.2 Storage module and tests
1. A small module next to `src/i18n/localePreference.ts` (for example `src/state/savedConditions.ts`): read, write, and delete one versioned record; a runtime schema; storage access wrapped so that every failure is ignored.
2. Conversion between the record and `TargetsDraft` that drops unknown IDs and reports what was dropped.
3. Unit tests: round trip, every field, unknown IDs, an invalid or foreign record, an older version, storage that throws, and that restoring gives the same search request as typing the same values.

### 13.3 UI and localization
1. The opt-in switch, the delete action, the restored and dropped notices, and the privacy note in `ja`, `en`, `es`, and `fr`; the about page text.
2. UI tests in four locales with axe-core; E2E per locale: save, reload, see the form restored, search, turn saving off, reload, see the defaults; no new storage keys with saving off.
3. Browser checks at desktop width and 375 px; [UI_DESIGN.md](../docs/en/UI_DESIGN.md) and [ARCHITECTURE.md](../docs/en/ARCHITECTURE.md) updated with their translations.

### 13.4 Release 10
1. Release readiness as for release 9 ([RELEASE_READINESS.md](../docs/working/RELEASE_READINESS.md)): checks, `npm audit`, the secret scan, and the storage keys and values after each flow.
2. The owner approves and merges `dev` into `main`, which deploys; Claude runs the post-deployment checks of [DEPLOYMENT.md](../docs/en/DEPLOYMENT.md) §3 plus the saved-conditions flow in production, and records release 10.

## Out of scope
- Accounts, sync between devices, server-side storage, cookies, analytics, and trackers.
- Several named profiles, history of viewed recipes, and saved shopping lists, unless the owner adds them in 13.1.
- The visual redesign (Phase 14) and new recipes (Phase 15).

## Acceptance
- The owner's decisions of 13.1 are recorded, and [SPEC.md](../docs/en/SPEC.md) and the affected docs are updated with their translations.
- With saving off, nothing new is stored and the app behaves as release 9 (tested); with saving on, the form is restored after a reload and gives the same results.
- Storage failures and invalid or outdated records never break the app (tested).
- The UI is complete in four locales and passes the accessibility checks.
- `npm run check`, `npm run test:e2e`, and CI pass; release 10 is deployed only by the owner's merge into `main`.
