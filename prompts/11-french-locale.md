# Prompt 11 — Phase 11: French locale

You are the lead engineer for Recipe Discovery. Follow the shared prompt `add-ui-locale.md` of the `claude-shared-rules` repository with `<locale>` = `fr`, together with `CLAUDE.md`. Communicate with the owner in Japanese; write repository files in English.

## Decisions already made (owner, 2026-10-31)
- ADR-033 and `docs/working/DECISIONS.md` "Phase 11 start: French locale": metropolitan French; dish names from the region the dish comes from; no native reviewer (open question 23), so safety texts are back-translated for the owner's review; no partial `fr`: schemas require `fr` from the first change, texts are reviewed in batches (UI catalog and foods, then three recipe batches), and commits are proposed once every text exists; release 8 only after the owner's approval.

## Project specifics
- Locale list: `shared/locales.ts`; content schemas: `shared/content.ts`; forbidden-expression matching: `shared/policy.ts`; glossaries: `content/glossary.ts`, `src/i18n/uiGlossary.ts`; search normalization: `src/views/targets/foodSearch.ts`; entry point: `src/main.tsx`; fixtures: `src/content/bundleFixtures.ts`; E2E locales: `e2e/support.ts`.
- Locale invariance: `test/node/engine.test.ts` and `test/node/recommendation-scenarios.test.ts` iterate over `SUPPORTED_LOCALES`; add explicit checks that the `fr` texts change no calculated or displayed value.
- Tone: the UI and recipe steps address the user with `vous` (imperative "Coupez", "Faites cuire"), the usual register of French apps and recipes; French punctuation uses a no-break space before `:`, `;`, `?`, `!` and inside « »; follow [CONTENT_POLICY.md](../docs/en/CONTENT_POLICY.md).

## Acceptance
As in [IMPLEMENTATION_PLAN.md](../docs/working/IMPLEMENTATION_PLAN.md) "Phase 11 — French locale".
