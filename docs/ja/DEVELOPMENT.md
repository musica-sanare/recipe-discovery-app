<!-- source: docs/en/DEVELOPMENT.md blob e507454ee25819dee7aca715752b2ddddb8fde2f -->
[English](../en/DEVELOPMENT.md) | 日本語 · [目次に戻る](README.md)

> この文書は[英語版](../en/DEVELOPMENT.md)の翻訳です。内容が異なる場合は英語版が優先されます。

# ローカル開発

## 前提
- Node.js `>=24.15.0`（`.nvmrc` で 24 を指定）
- npm（Node に同梱。コミットされている `package-lock.json` が正です）

アカウント、API キー、秘密情報は不要です。このガイドの手順でリモートのリソースが作られることはありません。

## セットアップ

```bash
npm ci
```

`.npmrc` で `engine-strict` と `strict-allow-scripts` を有効にしています（[DECISIONS.md](../working/DECISIONS.md)（英語のみ）ADR-018）。インストールが `ESTRICTALLOWSCRIPTS` で失敗した場合は、依存パッケージがインストールスクリプトを持ち込んでいます。その内容を確認し、判断を `package.json` の `allowScripts` と ADR-018 に記録してください。`--omit=optional` を付けてインストールしないでください（プラットフォーム用のバイナリは任意の依存パッケージから来ます）。

## コマンド

| コマンド | 用途 |
|---|---|
| `npm run dev` | コンテンツのバンドルを生成してから、Vite の開発サーバーを http://localhost:5173 で起動する（CSP なし。ADR-018 を参照）。コンテンツを変えたら `npm run content:build` を実行し直す |
| `npm run content:build` | コンテンツのバンドルを `generated/content/` に書き出し、そのサイズを表示する（ADR-027） |
| `npm run build` | コンテンツを検証し、コンテンツのバンドルを生成し、型チェックしてから、生成した `_headers` と `third-party-licenses.txt`（Vite の `build.license`。「このアプリについて」のページからリンク）を含めて `dist/` にビルドする |
| `npm run report:composition` | 栄養エンジンによる、レシピと材料ごとの集計：完全一致、近似（ADR-028 の理由つき）、推定困難、数えない、揚げ物。調理後の状態に重量変化率がないと失敗する |
| `npm run validate:content` | コンテンツ検証だけを行う（`tools/content/validate.ts`）。問題ごとに 1 行で、ファイル、レシピまたは食品、欄、ルールを表示する |
| `npm run preview` | 本番のセキュリティヘッダー付きで `dist/` を配信する（http://localhost:4173） |
| `npm run lint` | 型情報を使うルールとモジュール境界を含む ESLint |
| `npm run typecheck` | 出力なしの TypeScript プロジェクトビルド |
| `npm test` | Vitest（既定は Node。UI テストはファイルごとに jsdom を使う。`test/ui/` はリポジトリのコンテンツでアプリを動かす） |
| `npm run check` | lint、型チェック、ライセンスチェック、テスト、ビルドを順に実行する |
| `npm run check:licenses` | `package-lock.json` のすべてのパッケージのライセンスを `tools/licenses.ts` と照合する（本番：MIT、ISC、Apache-2.0、BSD、0BSD。開発用はさらに MPL-2.0、BlueOak-1.0.0、MIT-0、CC0-1.0、CC-BY-4.0） |
| `npm run test:e2e` | ヘッダー付きの本番ビルドに対する Playwright（ポート 4174 で `npm run build && npm run preview`）：プロジェクトは `desktop-chromium`、`mobile-chromium`、`mobile-webkit`。すべての spec を `ja`、`en`、`es` で実行する（`e2e/`）。ブラウザ：`npx playwright install --only-shell chromium webkit`（ユーザーのキャッシュ。リポジトリの外） |
| `npm run test:e2e:timing` | CPU を絞ったスマートフォン相当の速度の測定（プロジェクト `timing`、Chromium）。`test-results/timing.json` に書き出す。`TIMING_LIBRARY=synthetic` を付けると、ネットワークのスタブがコンテンツバンドルの代わりに `tools/synthetic-library.ts` の合成ライブラリを返し、結果は `test-results/timing-synthetic.json` に書き出される |
| `npm run data:extract` | `data/raw/` にある文部科学省のワークブックから `data/composition/foods.json` を作り直す（[DATA_SOURCES.md](DATA_SOURCES.md)「抽出」） |
| `npm run eval:coverage` | 検証用レシピのうち、代表的な目標を既定の分量と調整後の分量で満たすものの数を、推薦エンジンで計算する（[DECISIONS.md](../working/DECISIONS.md)（英語のみ）"Stage 0.6"、"Stage 3.7"） |
| `npm run bench:recommendation` | リポジトリのレシピと、メモリ上に作った 130 件の合成ライブラリ（`tools/synthetic-library.ts`：ライブラリ全体から均等な間隔で選んだレシピを別の ID で追加したもの。公開しない）に対する、検索全体の Node での所要時間（[DECISIONS.md](../working/DECISIONS.md)（英語のみ）"Stage 6.2"、"Stage 9.2"） |
| `npm run data:verify-cooking` | macOS のみ：`data/composition/cooking.json` を文部科学省の説明 PDF のテキストと照合する（[DATA_SOURCES.md](DATA_SOURCES.md)「調理の表」） |

ブラウザでのプレビュー：`.claude/launch.json` には `preview`（ヘッダー付きの本番ビルド、ポート 4173）と `dev`（Vite の開発サーバー、ポート 5173。測定のためにページの中でエンジンのモジュールを import できる）があります。隠れたタブやバックグラウンドのタブで測った時間は当てになりません。

デプロイのスクリプトは意図的に用意していません。デプロイは、オーナーの承認を得たうえで [DEPLOYMENT.md](DEPLOYMENT.md) に従って行います。

CI（`.github/workflows/ci.yml`、`ubuntu-24.04` 上の GitHub Actions）は、`dev` と `main` への push とプルリクエストで、1 つのジョブで `npm ci` と `npm run check` を、もう 1 つのジョブで `npx playwright install --with-deps --only-shell chromium webkit` のあと `npm run test:e2e` を実行します。権限は読み取りだけで、秘密情報もデプロイもありません。Playwright のレポートは E2E が失敗したときだけアップロードします（7 日間保持）。Actions はコミットの SHA で固定しています。

## 構成（現在）

この翻訳では、桁をそろえるため構成図を英語のまま残しています。

```text
index.html, src/        UI (React, Tailwind CSS; docs/en/UI_DESIGN.md): i18n/ typed ja/en/es catalogs and engine code lists,
                        format/ locale formatting, navigation/ History API views, state/ reducer and engine calls,
                        views/ screens, testing/ axe-core helper
shared/                 Schemas, constants, and types shared by UI, domain, content, and tools
domain/nutrition/       Pure, locale-free nutrition engine (ADR-028); tests next to the code
domain/recommendation/  Pure, locale-free recommendation engine (ADR-029); tests next to the code
domain/shopping/        Pure, locale-free shopping list aggregation (ADR-032); tests next to the code
content/                Food dictionary, recipes, glossary, content version (TypeScript, validated at build time)
platform/               Hosting-specific output (security headers)
tools/                  Build-time tools run directly by Node (TypeScript type stripping)
generated/content/      Content bundles written by tools/build-content.ts (git-ignored)
data/composition/       Extraction manifest and the tracked composition subset
data/raw/               Original source files (git-ignored)
test/node/              Node-side tests
test/ui/                jsdom tests of the app on the repository content (tsconfig.ui.json)
docs/, prompts/         Documentation and phase prompts
```

`domain/` が import してよいのは `shared/` だけです（テストではコンテンツも可）。これは `eslint.config.js` で強制しています。ツールとリポジトリのテストは、エンジンへの入力をメモリ上の計算用バンドル（`tools/content/repository.ts`）から得ます。`tools/` の下のファイルは Node 組み込みの TypeScript の型除去で実行するので、消去できる構文（`erasableSyntaxOnly`）だけを使い、ローカルのモジュールは `.ts` の拡張子付きで import します。

## コンテンツの追加
1. `node tools/extract-composition.ts --search <regex>` で調べた食品番号で、`content/foods.ts` に食品を追加します。その番号（と、書き写した変化率を持つ調理後と生の組）を、[DATA_SOURCES.md](DATA_SOURCES.md) の説明どおり `data/composition/` に追加します。
2. `content/recipes/` の下にレシピのファイルを追加し、`content/recipes/index.ts` の `recipes` に登録します（`validationRecipes` には入れません。これは確認済みの件数を使うテストのための固定の組です）。スキーマは `shared/content.ts` です（ADR-026）：手順と安全の注記にキーを付け、料理に添えるものを `sides` に挙げ、調味料はそれに合わせて増減する材料に結び付け（`linkedTo`）、どのレシピにも調整できる材料か、ソルバーが外せる副菜を少なくとも 1 つ持たせます。
3. `ja`、`en`、`es` のテキストを書きます。`content/glossary.ts` と [CONTENT_POLICY.md](CONTENT_POLICY.md) に従います。盛り付けの手順では副菜の名前を出しません。UI がオンの副菜を一覧にします。
4. `content/version.ts` の `CONTENT_VERSION` を更新します。
5. `npm run validate:content`（`npm run build` にも含まれる）は、スキーマ、ロケール、ID、参照、調理の状態、調整の範囲、結び付け、副菜、置き換え、アレルゲン、安全の注記、たんぱく源のグループ、タグ、用語集の使い方、禁止表現、版を確認します。ルールを追加するときは、失敗するフィクスチャを `tools/content/validate.test.ts` に追加します。

## UI テキストの追加
1. キーと日本語のテキストを `src/i18n/messages/ja.ts` に追加します。
2. 同じキーを `en.ts` と `es.ts` に追加します。3 つがそろうまで型チェックは失敗し、空の文字列はテストが拒否します。
3. `t("your.key")` を使います。コンポーネントに UI の文字列を直接書かないでください。
4. エンジンのコード（入力エラー、矛盾、判定、理由、除外、緩和、不確かさ、仮定、単位、アレルゲン、料理の種類、器具）のテキストは、コードをキーにします。`src/i18n/engineCodes.ts` がすべてのコードを挙げ、`src/i18n/engineCodes.test.ts` が各ロケールに項目があることを求めます。エンジンの union に新しいコードを足すと、それを一覧に加えるまで型チェックが失敗します。
5. 件数には、すべてのロケールで `_one` と `_other` のキーを使います。`src/i18n/policy.test.ts` は、`content/glossary.ts` の禁止表現をカタログに適用します。
6. 数値は `src/format/format.ts` で書式化します（値は `roundForDisplay` から、区切り記号は `Intl` から）。
