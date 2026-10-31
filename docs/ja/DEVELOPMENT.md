<!-- source: docs/en/DEVELOPMENT.md blob e8e4e47d1772b432decfa28927b7d5911e4f6a42 -->
[English](../en/DEVELOPMENT.md) | 日本語 · [目次に戻る](README.md)

> この文書は[英語版](../en/DEVELOPMENT.md)の翻訳。内容が異なる場合は英語版が優先する。

# ローカル開発

自分のマシンで Recipe Discovery を開発する人向けのガイドだ。環境の準備、npm のコマンド、CI、リポジトリの構成、レシピと UI テキストの追加手順を扱う。アカウント、API キー、秘密情報はいらない。このガイドの手順でリモートのリソースが作られることもない。

## 前提

- Node.js `>=24.15.0`（`.nvmrc` で 24 を指定）
- npm（Node に同梱。コミットしてある `package-lock.json` が正）

## セットアップ

> [!WARNING]
> `--omit=optional` を付けてインストールしない。プラットフォーム用のバイナリは任意の依存パッケージから入る。

```bash
npm ci
```

`.npmrc` で `engine-strict` と `strict-allow-scripts` を有効にしている（[DECISIONS.md](../working/DECISIONS.md)（英語のみ）ADR-018）。インストールが `ESTRICTALLOWSCRIPTS` で失敗したら、依存パッケージがインストールスクリプトを持ち込んでいる。その内容を確かめてから、判断を `package.json` の `allowScripts` と ADR-018 に記録する。

## コマンド

### 日々の作業

| コマンド | 用途 |
|---|---|
| `npm run dev` | コンテンツのバンドルを生成してから、Vite の開発サーバーを http://localhost:5173 で起動する（CSP なし。ADR-018 を参照）。コンテンツを変えたら `npm run content:build` を実行し直す |
| `npm run check` | lint、型チェック、ライセンスチェック、テスト、ビルドを順に実行する |
| `npm test` | Vitest（既定は Node。UI テストはファイルごとに jsdom を使う。`test/ui/` はリポジトリのコンテンツでアプリを動かす） |
| `npm run lint` | 型情報を使うルールとモジュール境界を含む ESLint |
| `npm run typecheck` | 出力なしの TypeScript プロジェクトビルド |
| `npm run validate:content` | コンテンツ検証だけを行う（`tools/content/validate.ts`）。問題ごとに 1 行で、ファイル、レシピか食品、欄、ルールを表示する |

### ビルドとプレビュー

| コマンド | 用途 |
|---|---|
| `npm run build` | コンテンツを検証し、コンテンツのバンドルを生成し、型チェックしてから `dist/` にビルドする（詳しくは下） |
| `npm run content:build` | コンテンツのバンドルを `generated/content/` に書き出し、そのサイズを表示する（ADR-027） |
| `npm run preview` | 本番のセキュリティヘッダー付きで `dist/` を配信する（http://localhost:4173） |
| `npm run check:licenses` | `package-lock.json` のすべてのパッケージのライセンスを `tools/licenses.ts` と照らし合わせる（詳しくは下） |

- `npm run build` は、生成した `_headers` と `third-party-licenses.txt` も `dist/` に書き出す。ライセンスのファイルは Vite の `build.license` で作り、「このアプリについて」のページからリンクする。
- `npm run check:licenses` は、本番では MIT、ISC、Apache-2.0、BSD、0BSD を認める。開発用の依存パッケージでは、さらに MPL-2.0、BlueOak-1.0.0、MIT-0、CC0-1.0、CC-BY-4.0 も認める。

### E2E テストと時間の計測

| コマンド | 用途 |
|---|---|
| `npm run test:e2e` | ヘッダー付きの本番ビルドに対する Playwright（詳しくは下） |
| `npm run test:e2e:timing` | CPU を絞ったスマートフォン相当の時間の計測（プロジェクト `timing`、Chromium）。`test-results/timing.json` に書き出す |
| `npm run bench:recommendation` | リポジトリのレシピと、メモリ上の 180 件の合成ライブラリに対する、検索全体の Node での所要時間（詳しくは下） |

- `npm run test:e2e` は、ポート 4174 で `npm run build && npm run preview` を動かす。プロジェクトは `desktop-chromium`、`mobile-chromium`、`mobile-webkit` で、すべての spec をすべてのロケールで実行する（`e2e/`）。
- ブラウザは一度だけ、リポジトリの外のユーザーのキャッシュに入れる：

  ```bash
  npx playwright install --only-shell chromium webkit
  ```

- `TIMING_LIBRARY=synthetic` を付けると、`npm run test:e2e:timing` ではネットワークのスタブが、コンテンツのバンドルの代わりに `tools/synthetic-library.ts` の合成ライブラリを返す。結果は `test-results/timing-synthetic.json` に書き出す。
- `npm run bench:recommendation` の合成ライブラリ（`tools/synthetic-library.ts`）は、ライブラリ全体から均等な間隔で選んだレシピを、別の ID で足し直したものだ。公開はしない。経緯は [DECISIONS.md](../working/DECISIONS.md)（英語のみ）"Stage 6.2"、"Stage 9.2"、"Stage 10.1 expansion plan" にある。

### データと評価

| コマンド | 用途 |
|---|---|
| `npm run data:extract` | `data/raw/` にある文部科学省のワークブックから `data/composition/foods.json` を作り直す（[DATA_SOURCES.md](DATA_SOURCES.md)「抽出」） |
| `npm run data:verify-cooking` | macOS のみ：`data/composition/cooking.json` を文部科学省の説明 PDF のテキストと照らし合わせる（[DATA_SOURCES.md](DATA_SOURCES.md)「調理の表」） |
| `npm run report:composition` | 栄養エンジンによる、レシピと材料ごとの集計：完全一致、近似（ADR-028 の理由つき）、推定困難、数えない、揚げ物。調理後の状態に重量変化率がないと失敗する |
| `npm run eval:coverage` | 検証用レシピのうち、代表的な目標を既定の分量と調整後の分量で満たすものの数を、推薦エンジンで数える（[DECISIONS.md](../working/DECISIONS.md)（英語のみ）"Stage 0.6"、"Stage 3.7"） |

### ブラウザでのプレビュー

`.claude/launch.json` には 2 つの設定がある：
- `preview`：ヘッダー付きの本番ビルド、ポート 4173。
- `dev`：Vite の開発サーバー、ポート 5173。計測のために、ページの中でエンジンのモジュールを import できる。

隠れたタブやバックグラウンドのタブで測った時間は当てにならない。

## デプロイと CI

デプロイのスクリプトは意図して置いていない。デプロイは、オーナーの承認を得てから [DEPLOYMENT.md](DEPLOYMENT.md) に従って行う。

CI（`.github/workflows/ci.yml`、`ubuntu-24.04` 上の GitHub Actions）は、`dev` と `main` への push とプルリクエストで動く：
- 1 つのジョブで `npm ci` と `npm run check` を実行する。
- もう 1 つのジョブで、`npx playwright install --with-deps --only-shell chromium webkit` のあと `npm run test:e2e` を実行する。
- 権限は読み取りだけで、秘密情報もデプロイもない。Playwright のレポートは E2E が失敗したときだけアップロードし、7 日間残す。Actions はコミットの SHA で固定している。

## 構成（現在）

桁をそろえるため、構成図は英語のまま残している。

```text
index.html, src/        UI (React, Tailwind CSS; docs/en/UI_DESIGN.md): i18n/ typed ja/en/es/fr catalogs and engine code lists,
                        format/ locale formatting, navigation/ History API views, state/ reducer and engine calls,
                        views/ screens, testing/ axe-core helper
shared/                 Schemas (Zod), constants, and types shared by UI, domain, content, and tools; the AI endpoint
                        contract (suggestion.ts, ADR-034)
server/ai/              Platform-neutral core of the optional AI endpoint, provider adapter interface, fake adapter
domain/nutrition/       Pure, locale-free nutrition engine (ADR-028); tests next to the code
domain/recommendation/  Pure, locale-free recommendation engine (ADR-029); tests next to the code
domain/shopping/        Pure, locale-free shopping list aggregation (ADR-032); tests next to the code
content/                Food dictionary (foods.ts), recipes (recipes/, one file per recipe), glossary (glossary.ts),
                        content version (version.ts); TypeScript, validated at build time
platform/               Hosting-specific output: security headers (headers.ts), Cloudflare config (cloudflare/)
tools/                  Build-time tools run directly by Node (TypeScript type stripping)
generated/content/      Content bundles written by tools/build-content.ts (git-ignored)
data/composition/       Extraction manifest and the tracked composition subset
data/raw/               Original source files, such as the MEXT workbook (git-ignored)
test/node/              Node-side tests
test/ui/                jsdom tests of the app on the repository content (tsconfig.ui.json)
docs/, prompts/         Documentation and phase prompts
```

- `domain/` が import してよいのは `shared/` だけだ（テストではコンテンツも可）。`eslint.config.js` がこれを強制する。
- ツールとリポジトリのテストは、エンジンへの入力をメモリ上の計算用バンドル（`tools/content/repository.ts`）から受け取る。
- `tools/` の下のファイルは、Node 組み込みの TypeScript の型除去で動く。そのため、消去できる構文（`erasableSyntaxOnly`）だけを使い、ローカルのモジュールは `.ts` の拡張子付きで import する。

## コンテンツの追加

1. `node tools/extract-composition.ts --search <regex>` で調べた食品番号で、`content/foods.ts` に食品を足す。その番号（と、書き写した変化率を持つ調理後と生の組）を、[DATA_SOURCES.md](DATA_SOURCES.md) のとおり `data/composition/` に足す。
2. `content/recipes/` の下にレシピのファイルを置き、`content/recipes/index.ts` の `recipes` に登録する。`validationRecipes` には登録しない。これは確認済みの件数を使うテストのための固定の組だ。スキーマは `shared/content.ts` にある（ADR-026）：
   - 手順と安全の注記にキーを付ける。
   - 料理に添えるものを `sides` に挙げる。
   - 調味料は、それに合わせて増減する材料に結び付ける（`linkedTo`）。
   - どのレシピにも、調整できる材料か、ソルバーが外せる副菜を少なくとも 1 つ持たせる。
3. `ja`、`en`、`es`、`fr` のテキストを書く。`content/glossary.ts` と [CONTENT_POLICY.md](CONTENT_POLICY.md) に従う。盛り付けの手順では副菜の名前を出さない。オンの副菜は UI が一覧にする。
4. `content/version.ts` の `CONTENT_VERSION` を更新する。
5. `npm run validate:content`（`npm run build` にも含まれる）を実行する。スキーマ、ロケール、ID、参照、調理の状態、調整の範囲、結び付け、副菜、置き換え、アレルゲン、安全の注記、たんぱく源の群、タグ、用語集の使い方、禁止表現、版を確かめる。ルールを足すときは、失敗するフィクスチャを `tools/content/validate.test.ts` に足す。

## UI テキストの追加

1. キーと日本語のテキストを `src/i18n/messages/ja.ts` に足す。
2. 同じキーを `en.ts`、`es.ts`、`fr.ts` に足す。4 つがそろうまで型チェックは失敗し、空の文字列はテストが拒む。
3. `t("your.key")` を使う。コンポーネントに UI の文字列を直接書かない。
4. エンジンのコードのテキストは、コードをキーにする。対象は入力エラー、矛盾、判定、理由、除外、緩和、不確かさ、仮定、単位、アレルゲン、料理の種類、器具だ。`src/i18n/engineCodes.ts` がすべてのコードを挙げ、`src/i18n/engineCodes.test.ts` が各ロケールに項目があることを求める。エンジンの union に新しいコードを足すと、一覧に加えるまで型チェックが失敗する。
5. 件数には、すべてのロケールで `_one` と `_other` のキーを使う。`src/i18n/policy.test.ts` は、`content/glossary.ts` の禁止表現をカタログにも当てる。
6. 数値は `src/format/format.ts` で書式化する（値は `roundForDisplay` から、区切り記号は `Intl` から）。
