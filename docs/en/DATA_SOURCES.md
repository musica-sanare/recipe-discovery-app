English | [日本語](../ja/DATA_SOURCES.md) · [Docs index](README.md)

# Data Sources — Recipe Discovery

This document lists the data Recipe Discovery uses, its terms of use and attribution, and how the data is extracted and kept in the repository. It is for anyone who checks licensing or updates the composition data. The only data source in use is the MEXT food composition tables (§1); §2 lists sources that were considered and not used.

Status: **In use**. The terms and facts below were read from the cited pages on 2026-10-18. Terms can change; re-check them before a release.

## 1. Standard Tables of Food Composition in Japan (MEXT) — primary source

| Item | Value |
|---|---|
| Title | 日本食品標準成分表（八訂）増補2023年 (Standard Tables of Food Composition in Japan 2020, Eighth Revised Edition, Updated and Enlarged Version 2023) |
| Publisher | Ministry of Education, Culture, Sports, Science and Technology (MEXT), Council for Science and Technology, Subdivision on Resources |
| Page | https://www.mext.go.jp/a_menu/syokuhinseibun/mext_00001.html |
| Data file (chapter 2, Excel) | https://www.mext.go.jp/content/20260327-mxt_kagsei-mext-000029402_02.xlsx |
| Workbook update date | 2026-03-27 (shown in the workbook; includes errata) |
| SHA-256 of the file retrieved on 2026-10-18 | `0d5a77077dd6cd91cbc2e6e317b8b218a38728c409eed452f1c10635a0d3099c` (1,973,402 bytes) |
| Explanation (PDF, excluding chapter 2) | https://www.mext.go.jp/content/20260327-mxt_kagsei-mext-000029402_0001.pdf |
| Workbook structure | Sheets: whole table plus 18 food-group sheets; 2,538 foods; 62 columns with component identifiers (for example `ENERC_KCAL`, `PROT-`, `FAT-`); Japanese food names only (no English or Spanish names) |

### Terms of use

- *Verified* (https://www.mext.go.jp/a_menu/syokuhinseibun/index.htm): the food composition data may be used freely. For secondary use in papers, books, applications, and similar works, MEXT asks users to state the source as 「日本食品標準成分表（八訂）増補2023年から引用（又は出典）」.
- *Verified* (https://fooddb.mext.go.jp/): the online database is a trial service; MEXT accepts no liability for damage arising from its use. This project uses the published workbook, not the online database.
- Owner's position (2026-10-18): the data is used as the calculation basis and cited in the app; no separate inquiry is planned. The app also states that the values are its own calculations and not endorsed by MEXT.
- Contact for questions about use (from the MEXT page): kagseis@mext.go.jp.
- Attribution wording and placement: [CONTENT_POLICY.md](CONTENT_POLICY.md) §5.

### License of the extracted data

- The repository is under the [MIT License](../../LICENSE) (ADR-031), except `data/composition/`.
- The values in `data/composition/` come from the MEXT tables: `foods.json` is extracted from the workbook, `cooking.json` is transcribed from Tables 12–14 of the explanation PDF, and `manifest.json` records the source.
- This project claims no rights in the MEXT values. The files are used and shared under the MEXT terms above. Anyone reusing them follows those terms, including the source statement 「日本食品標準成分表（八訂）増補2023年から引用（又は出典）」.

### Handling rules

> [!WARNING]
> Never commit the original workbook. Keep it in `data/raw/` (git-ignored) or outside the repository.

- A script extracts only the food codes referenced by the food dictionary and only the columns used by the app. It keeps the notation flags (`-`, `Tr`, `(0)`, `(Tr)`, `( )`).
- The extracted subset and a manifest are tracked in Git, so builds are reproducible without the original file. The manifest records the source URL, workbook update date, SHA-256, extraction script version, and extraction date.
- Updating the source:
  1. Download the new file.
  2. Update the manifest.
  3. Rerun the extraction.
  4. Review the nutrition snapshot diff.
  5. Record the change in [DECISIONS.md](../working/DECISIONS.md).

### Known limitations

- No official English food names for the eighth edition. *Verified* in the PDF (chapter on future work): an English version or translation features are "under consideration". The 2015 edition was published in Japanese and English; whether its English names and food codes can serve as a reference is 要確認.
- Weight change rates (Table 12) and frying/stir-frying fat data (Tables 13–14) are in the PDF, not in the workbook.
- No household measure table.

### Extraction (implemented in Phase 0 Stage 0.2)

- Place the workbook at the path given by `rawFile` in `data/composition/manifest.json`. It is currently `data/raw/mext/20260327-mxt_kagsei-mext-000029402_02.xlsx` (git-ignored).
- `npm run data:extract` checks the SHA-256 against the manifest and reads the sheet named in the manifest (`表全体`). It writes `data/composition/foods.json` with the codes listed in `requestedCodes`. The output is deterministic (sorted by food code, no timestamps).
- `node tools/extract-composition.ts --search <regex>` lists matching food codes and names, to help choose codes.
- Columns are located by the component identifier row and the Japanese headers, not by position.
  - Extracted identifiers: `REFUSE`, `ENERC_KCAL`, `PROT-`, `PROTCAA`, `FAT-`, `FATNLEA`, `CHOAVLDF-`, `CHOCDF-`, `FIB-`, `NACL_EQ` (`shared/composition.ts`).
  - Each value keeps its notation (`measured`, `zero`, `trace`, `estimated`, `estimated_zero`, `estimated_trace`, `unmeasured`). Unrecognized cell contents stop the extraction.
- Food names are kept in Japanese only, as published. Display names in three locales belong to the food dictionary (Stage 0.4).
- A test validates the tracked subset against the schema and the manifest without needing the workbook.

### Cooking tables (implemented in Phase 0 Stage 0.3)

- Tables 12 (weight change rates), 13 (fried foods), and 14 (stir-fried and sautéed foods) exist only in the explanation PDF.
- The PDF's text layer scrambles table columns. So the needed rows are **transcribed by hand** from rendered page images into `data/composition/cooking.json`. Every entry records its page number, and the file records the PDF's SHA-256 (`d1196cc8…f116`, file `data/raw/mext/20260327-mxt_kagsei-mext-000029402_0001.pdf`, git-ignored).
- `rawCode` (the raw food paired with each cooked food) is assigned by this project. All numbers are MEXT's, transcribed as printed. One inconsistency in the source is known: food 11290 has 82 % in Table 12 and 81 g in Table 13.
- Verification:
  1. `npm run data:verify-cooking` (macOS only; uses PDFKit through `tools/macos/pdf-page-text.swift`) checks that every transcribed number and food code occurs on the cited page of the PDF text layer. Weakness: the text layer is column-ordered, so a number that also appears elsewhere on the page passes.
  2. Tests in `test/node/cooking-data.test.ts` run on every check without the PDF. They check protein retention of non-coated foods (60–115 %), fat change in Tables 13–14 recomputed from the composition values (within 1 g), cooked mass consistent between Table 12 and Tables 13–14, and coated-basis rates below main-food rates. These tests caught injected transcription errors (61 → 16, 4.6 → 6.4) on 2026-10-18.
- Adding a food:
  1. Render the page and transcribe the row with its page number.
  2. Add the raw and cooked codes to the manifest.
  3. Run `npm run data:extract`, `npm run data:verify-cooking`, and the tests.

## 2. Considered, not used in the MVP

| Source | Terms (checked 2026-10-18) | Reason not used |
|---|---|---|
| USDA FoodData Central | CC0 1.0 public domain; attribution requested; API requires an api.data.gov key; default limit 1,000 requests per hour per IP | No official correspondence to the Japanese tables (secondary source); English names would still need mapping; may be useful later as a reference for English naming |
| Open Food Facts | Database under ODbL (attribution and share-alike), contents under DbCL, images under CC BY-SA | Packaged products, not raw ingredients; share-alike obligations when combined with other data |

## 3. Reference for allergen categories

Consumer Affairs Agency, allergen labelling: https://www.caa.go.jp/policies/policy/food_labeling/food_sanitation/allergy/ . It is used only as the category reference; see [CONTENT_POLICY.md](CONTENT_POLICY.md) §2.
