English | [日本語](../ja/CONTENT_POLICY.md) · [Docs index](README.md)

# Content Policy — Recipe Discovery

This policy sets the rules for every recipe, food dictionary entry, UI text, and any future generated text in Recipe Discovery. It covers recipe authoring, allergens, food safety, health expressions, nutrition statements, translations, and future AI-generated text. Authors and reviewers check content against it.

Status: **In use** (drafted 2026-10-18). Legal applicability statements are marked 要確認 where a qualified person has not confirmed them. Where applicability is unclear, the policy is intentionally stricter than the minimum.

## 1. Recipe authoring

- Recipes are original works created for this project. Do not copy recipe text, descriptions, or photos from books, websites, or apps.
  - General commentary holds that ingredient lists and procedures themselves are hard to protect by copyright, while descriptive text and photos are protected. Primary legal sources were not checked (要確認).
- Each recipe states ingredients in raw edible grams with an authored household measure, cooking states and methods, steps, time, effort, equipment, servings, food safety notes, adjustment rules, and substitutions ([NUTRITION_CALCULATION.md](NUTRITION_CALCULATION.md)).
- Adjustment bounds are chosen so the dish still works at both ends (taste, texture, cooking time, pan size). Notes for larger amounts are authored where needed.
- Every recipe is reviewed for: correct food mappings (each ingredient's contribution looks plausible), allergen links, food safety notes, and complete translations.

## 2. Allergens (best effort, ADR-008)

- Allergen categories follow the Japanese labelling system: the mandatory specified raw materials (特定原材料) and the recommended items (特定原材料に準ずるもの).
  - *Verified* (Consumer Affairs Agency and municipal notices, checked 2026-10-18): since April 2026 there are 9 mandatory items (cashew nut added, with a two-year transition period) and 20 recommended items (pistachio added).
- These rules target packaged processed foods. Whether any labelling obligation applies to a recipe app is 要確認. The app follows the categories as a reference only.
- Each food has allergen links with a confidence: `contains`, `may_contain`, or `unknown`. Seasonings and processed ingredients are linked by their typical ingredients (for example soy sauce: wheat, soybean) and marked `may_contain` where products vary.
- When the user selects an allergen to exclude, recipes with `contains`, `may_contain`, or `unknown` for that allergen are excluded, and the reason is shown.
- Required wording, always visible with allergen features: allergen information is best effort and may be incomplete; actual products differ; check product labels; this app does not guarantee that any recipe is safe for people with allergies.
- Forbidden: "allergen-free", "safe for allergies", "contains no X", or any equivalent in any locale.
- Allergen names and warnings are translated with the glossary (section 6) and reviewed with priority.

## 3. Food safety

- Meat and poultry are cooked through. Recipes state a visible doneness check (for example no pink juices) rather than relying on time alone. No recipes with raw or undercooked poultry or pork.
- Fish, shellfish, and beef are cooked through as well. Regional raw dishes (for example ceviche, or rare beef in pho) are not included. Herbs and vegetables eaten raw are washed (owner, 2026-10-24, Phase 7 Stage 7.1).
- Eggs: raw-egg dishes are not included in the MVP. Eggs with soft or runny yolks are allowed and always carry the `soft_yolk` safety note (owner, 2026-10-23; [DECISIONS.md](../working/DECISIONS.md) "Stage 5.1 release plan" P3).
- Frying: notes on oil temperature, fire risk, and never leaving hot oil unattended.
- Batch cooking: general cooling and refrigeration guidance only; no specific storage durations are promised.
- Microwave recipes: note on even heating and covering.
- Marinades: raw meat, poultry, or fish marinates in the refrigerator. A marinade or vegetables that held them are cooked through before eating, or discarded (owner, 2026-11-01, [DECISIONS.md](../working/DECISIONS.md) "Stage 15.1 decisions" P4).
- Wine and beer: allowed in cooked dishes. Such recipes carry a neutral note that some alcohol may remain after cooking, and never state that it evaporates. Recipes with cooking sake or mirin carry no such note (owner, 2026-11-01, "Stage 15.1 decisions" P1).

## 4. Health expressions

- No health, medical, or efficacy claims, explicit or implied (for example "burns fat", "builds muscle fast", "detox", "good for blood pressure", "cures", "prevents").
- Describe facts the app calculates (for example "about 40 g protein per serving") and user-set targets ("meets your protein target").
- Presets are labelled as examples, not recommendations or advice.
- The target settings include a notice that people under medical or dietitian guidance should follow it.
- Legal background:
  - *Verified* (municipal and Ministry guidance, checked 2026-10-18): Japan's Health Promotion Act, Article 65(1), prohibits anyone from making representations about the health effects of foods that are significantly different from fact or significantly misleading.
  - Its scope is advertising of foods offered for sale. Whether it applies to this app is 要確認; this policy applies the stricter rule regardless.
  - The relation to the Pharmaceutical and Medical Device Act (unapproved drug advertising) was not checked (要確認).
- Content validation (`tools/content/validate.ts`, rule `forbidden-expression`) checks all locales for forbidden expressions. The word list is in `content/glossary.ts`.

## 5. Nutrition statements

- All nutrition values are called estimates.
- Attribution is always shown in the detail view and on the about page. It consists of:
  - 「日本食品標準成分表（八訂）増補2023年から引用」 (the wording requested by MEXT), followed by the localized equivalent;
  - the data version;
  - a statement that the values are this app's own calculations and are not endorsed or guaranteed by MEXT.
- Uncertainty is shown as defined in [NUTRITION_CALCULATION.md](NUTRITION_CALCULATION.md).

## 6. Translations (ADR-007)

- Translations are canonical content stored in the repository; nothing is machine-translated at runtime.
- Workflow: content is authored, Claude drafts `en`, `es`, and `fr` at authoring time, the owner reviews the diff and reports problems, and Claude fixes them. The owner's approval of the commit is the review record.
- Spanish food names (owner decision V1, 2026-10-24; [DECISIONS.md](../working/DECISIONS.md) "Stage 6.3 R1" and "Stage 6.3 R4"):
  - Use peninsular vocabulary (`patata`, `zumo`, `ternera`), with Latin American words as search aliases (for example `patata` / `papa`, `gamba` / `camarón`).
  - Avoid words that mean something else in Latin America (for example "frigorífico", "tostada").
  - Allergen names show both regional names.
- Spanish dish names follow the region the dish comes from (for example "Chili con carne", "Arroz con pollo y frijoles"), while food names keep the rule above (owner, 2026-10-24, [DECISIONS.md](../working/DECISIONS.md) "Stage 7.1 expansion plan").
- French texts (ADR-033):
  - Use metropolitan French (fr-FR) vocabulary. Japanese and other regional foods keep their established name with a French description (for example "Poireau japonais (naganegi)"), and other names are search aliases.
  - Dish names follow the region the dish comes from (for example "Arroz con pollo", "Pulpo a la gallega"), as for Spanish.
  - Address the reader with `vous` and the imperative ("Coupez", "Faites cuire").
  - Follow French typography: a no-break space (U+00A0) before `:`, `;`, `?`, and `!`, and inside « ». Numbers get their separators from `Intl`.
  - No native French reviewer is available yet. The owner reviews French texts through Japanese back-translations ([DECISIONS.md](../working/DECISIONS.md) open question 23).
- A glossary (`content/glossary.ts`) fixes cooking terms, heat levels, units, allergen names, disclaimer texts, and forbidden expressions in every locale.
- Safety-relevant texts (allergen warnings, doneness checks, frying cautions, disclaimers) use short, plain sentences. They are back-translated during review to detect meaning drift.
- Japanese-specific ingredients that may be hard to find abroad get a note; regional availability is otherwise out of scope.

## 7. Future AI-generated text

AI-generated text is not used in the MVP. If it is introduced later (ADR-004), generated text must:
- follow sections 2–5;
- not contain nutrition values, allergen judgments, health claims, or cooking temperatures and times;
- be labelled as generated;
- be validated at runtime, with a deterministic fallback.
