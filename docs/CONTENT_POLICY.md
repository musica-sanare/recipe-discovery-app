# Content Policy — Recipe Discovery

Status: **Draft (2026-10-18)**. Applies to all recipes, food dictionary entries, UI copy, and any future generated text. Legal applicability statements are marked 要確認 where they have not been confirmed by a qualified person; the policy is intentionally stricter than the minimum where applicability is unclear.

## 1. Recipe authoring

- Recipes are original works created for this project. Do not copy recipe text, descriptions, or photos from books, websites, or apps. (General commentary holds that ingredient lists and procedures themselves are hard to protect by copyright, while descriptive text and photos are protected; primary legal sources were not checked, 要確認.)
- Each recipe states ingredients in raw edible grams with an authored household measure, cooking states and methods, steps, time, effort, equipment, servings, food safety notes, adjustment rules, and substitutions (`docs/NUTRITION_CALCULATION.md`).
- Adjustment bounds are chosen so the dish still works at both ends (taste, texture, cooking time, pan size). Notes for larger amounts are authored where needed.
- Every recipe is reviewed for: correct food mappings (each ingredient's contribution looks plausible), allergen links, food safety notes, and complete translations.

## 2. Allergens (best effort, ADR-008)

- Allergen categories follow the Japanese labelling system: the mandatory specified raw materials (特定原材料) and the recommended items (特定原材料に準ずるもの). *Verified* (Consumer Affairs Agency and municipal notices, checked 2026-10-18): since April 2026 there are 9 mandatory items (cashew nut added, with a two-year transition period) and 20 recommended items (pistachio added).
- These rules target packaged processed foods. Whether any labelling obligation applies to a recipe app is 要確認; the app follows the categories as a reference only.
- Each food has allergen links with a confidence: `contains`, `may_contain`, or `unknown`. Seasonings and processed ingredients are linked by their typical ingredients (for example soy sauce: wheat, soybean) and marked `may_contain` where products vary.
- When the user selects an allergen to exclude, recipes with `contains`, `may_contain`, or `unknown` for that allergen are excluded, and the reason is shown.
- Required wording, always visible with allergen features: allergen information is best effort and may be incomplete; actual products differ; check product labels; this app does not guarantee that any recipe is safe for people with allergies.
- Forbidden: "allergen-free", "safe for allergies", "contains no X", or any equivalent in any locale.
- Allergen names and warnings are translated with the glossary (section 6) and reviewed with priority.

## 3. Food safety

- Meat and poultry are cooked through; recipes state a visible doneness check (for example no pink juices) rather than relying on time alone. No recipes with raw or undercooked poultry or pork.
- Eggs: raw-egg dishes are not included in the MVP (*Provisional*; regional norms differ across the three locales).
- Frying: notes on oil temperature, fire risk, and never leaving hot oil unattended.
- Batch cooking: general cooling and refrigeration guidance only; no specific storage durations are promised.
- Microwave recipes: note on even heating and covering.

## 4. Health expressions

- No health, medical, or efficacy claims, explicit or implied (for example "burns fat", "builds muscle fast", "detox", "good for blood pressure", "cures", "prevents").
- Describe facts the app calculates (for example "about 40 g protein per serving") and user-set targets ("meets your protein target").
- Presets are labelled as examples, not recommendations or advice.
- The target settings include a notice that people under medical or dietitian guidance should follow it.
- *Verified* (municipal and Ministry guidance, checked 2026-10-18): Japan's Health Promotion Act, Article 65(1), prohibits anyone from making representations about the health effects of foods that are significantly different from fact or significantly misleading. Its scope is advertising of foods offered for sale; whether it applies to this app is 要確認. This policy applies the stricter rule regardless. The relation to the Pharmaceutical and Medical Device Act (unapproved drug advertising) was not checked (要確認).
- A build-time policy lint checks all locales for forbidden expressions; the word list is maintained alongside the glossary.

## 5. Nutrition statements

- All nutrition values are called estimates.
- Attribution, always shown in the detail view and on the about page: 「日本食品標準成分表（八訂）増補2023年から引用」 (the wording requested by MEXT, followed by the localized equivalent), the data version, and a statement that the values are this app's own calculations and are not endorsed or guaranteed by MEXT.
- Uncertainty is shown as defined in `docs/NUTRITION_CALCULATION.md`.

## 6. Translations (ADR-007)

- Translations are canonical content stored in the repository; nothing is machine-translated at runtime.
- Workflow: content is authored, Claude drafts `en` and `es` at authoring time, the owner reviews the diff and reports problems, Claude fixes them. The owner's approval of the commit is the review record.
- Spanish uses neutral wording; regional variants are added as search aliases (for example `patata` / `papa`, `gamba` / `camarón`).
- A glossary (`content/glossary/`) fixes cooking terms, heat levels, units, allergen names, disclaimer texts, and forbidden expressions in all three locales.
- Safety-relevant texts (allergen warnings, doneness checks, frying cautions, disclaimers) use short, plain sentences and are back-translated during review to detect meaning drift.
- Japanese-specific ingredients that may be hard to find abroad get a note; regional availability is otherwise out of scope.

## 7. Future AI-generated text

Not used in the MVP. If introduced later (ADR-004), generated text must follow sections 2–5, may not contain nutrition values, allergen judgments, health claims, or cooking temperatures and times, must be labelled as generated, and must be validated at runtime with a deterministic fallback.
