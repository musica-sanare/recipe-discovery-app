<!-- source: docs/en/ARCHITECTURE.md blob 39bea456e01aacf18615915a752d61ed0760f26d -->
[English](../en/ARCHITECTURE.md) | 日本語 · [目次に戻る](README.md)

> この文書は[英語版](../en/ARCHITECTURE.md)の翻訳です。内容が異なる場合は英語版が優先されます。

# アーキテクチャ — Recipe Discovery

状態：**草案（2026-10-18）**。以下の構成は目指す方向です（[DECISIONS.md](../working/DECISIONS.md)（英語のみ）ADR-001〜ADR-014）。パッケージの正確な版、ファイル名、データモデルの詳細はフェーズ 0 とフェーズ 1 で確定します。まだ検証していないものには *提案* と付けています。

## 1. 概要

MVP は **静的なシングルページアプリケーション** です。すべてのコンテンツはビルド時に用意し、すべての計算はブラウザで行います。

```
Repository content (recipes, food dictionary, translations)
        │                       MEXT workbook (outside Git)
        │                               │ extraction script
        ▼                               ▼
  Build-time pipeline: validate content ──► extracted composition subset (tracked)
        │  (schemas, locale completeness, food mappings, allergens, policy lint,
        │   nutrition regression snapshots)
        ▼
  Static assets: app bundle + versioned content JSON
        │
        ▼
  Browser: UI ─► recommendation engine ─► nutrition engine (pure, locale-free)
```

（図の訳）リポジトリのコンテンツ（レシピ、食品辞書、翻訳）と、Git の外にある文部科学省のワークブックから抽出スクリプトで作る成分のサブセット（Git で管理）を、ビルド時のパイプラインで検証します（スキーマ、ロケールのそろい、食品の対応、アレルゲン、ポリシーの lint、栄養の回帰スナップショット）。その結果が静的アセット（アプリのバンドルと版つきのコンテンツ JSON）になり、ブラウザでは UI → 推薦エンジン → 栄養エンジン（純粋でロケールに依存しない）の順に呼び出します。

- MVP には、アプリケーションサーバー、データベース、管理画面、AI はありません（ADR-002、ADR-004）。
- ホスティング：Cloudflare の静的アセット。プラットフォーム固有の設定は切り離します（ADR-001）。

## 2. レイヤーと責務

| レイヤー | 責務 | 依存してはならないもの |
|---|---|---|
| `domain/nutrition` | レシピの状態（人数、副菜、連動する材料、選んだ置き換え）に対する分量の決定、材料ごと・レシピごとの栄養、調理の状態の扱い、不確かさの区分、範囲、表示する値の丸め（ADR-028） | UI、i18n、ロケール、プラットフォーム、ネットワーク |
| `domain/recommendation` | ハードな絞り込み、適合の評価、適合の段階、多様化、シードつきの再提案、範囲内での調整ソルバー、置き換えの提案、緩和の提案、矛盾の確認 | UI、i18n、ロケール、プラットフォーム、ネットワーク |
| `shared` | ビルドツール、ドメイン、UI が使うコンテンツのスキーマと型、ID、単位、定数 | UI、プラットフォーム |
| `content/`（データ） | レシピ、食品辞書、アレルゲンの結び付け、置き換え、多言語のテキスト、用語集 | — |
| `tools/`（ビルド時） | 成分の抽出、コンテンツ検証、ポリシーの lint、栄養のスナップショット、ヘッダーの生成 | UI |
| `src/`（UI） | React アプリ、ナビゲーション、i18n、書式、状態、アクセシビリティ（[UI_DESIGN.md](UI_DESIGN.md)） | プラットフォーム固有の API |
| `platform/` | ホスティングの設定（Cloudflare）と生成するセキュリティヘッダー | ドメインのロジック |

境界は、オーナーのほかのプロジェクトと同じく、lint の import 制限と境界のテストで守ります。

*提案* のディレクトリ構成：

```text
src/                    UI (React)
domain/nutrition/       Pure nutrition engine
domain/recommendation/  Pure ranking, diversity, adjustment
shared/                 Schemas (Zod), types, units, constants
content/recipes/        One file per recipe (structured, localized texts)
content/foods.ts        Food dictionary (locale-neutral IDs, mappings, names, aliases, allergens)
content/glossary.ts     Translation glossary and forbidden expressions
data/composition/       Extracted composition subset (generated, tracked) + manifest
data/raw/               MEXT workbook (git-ignored)
tools/                  Extraction, validation, lint, snapshots
platform/cloudflare/    Hosting config and header output
test/, e2e/             Tests
docs/                   Documentation
```

## 3. データモデル（概要）

詳細はフェーズ 1 で確定し、[NUTRITION_CALCULATION.md](NUTRITION_CALCULATION.md) とコンテンツのスキーマに記載します。

- **Food**：ロケールに依存しない `id`（変わらないスラッグ）。`composition` の参照（調理の状態ごとの食品番号とデータの版。たとえば `raw` と `grilled`）。調理方法ごとの重量変化率。廃棄率。確度つきのアレルゲンの結び付け（`contains`、`may_contain`、`unknown`）。`ja`、`en`、`es` の多言語の `names` と検索用の `aliases`。
- **Recipe**：`id`、時間、手間、料理の種類、目標、主なたんぱく源のグループ、タグ、器具、人数、材料、副菜、キーつきの手順と食品安全の注記、置き換え、多言語のテキスト。「手早い」と「揚げ物」は導出します。
- **RecipeIngredient**：食品 ID、生の可食部のグラム数、調理の状態と方法、家庭での計量（単位と数量）、役割、調整の範囲（グラムまたは個数）、基準となる材料を示す `linkedTo`、推定困難の印。
- **Side**：多言語のラベル、材料、「目標に合わせる」でオフにしてよいかどうか。
- **Substitution**：比率、任意の範囲、置き換わる手順のテキストと安全の注記を持つ、食品から食品への置き換え。
- スキーマ：`shared/content.ts`（ADR-026）。
- **成分のサブセット**：食品番号ごとに、選んだ栄養素の値と記号の印（`measured`、`estimated`、`trace`、`zero`、`unmeasured`）、元データの版、チェックサムのマニフェスト。

## 4. 多言語対応

- ライブラリ：オーナーの確立した方法（型付きの TypeScript メッセージカタログを使う i18next）が候補で、フェーズ 0 で確定します（ADR-005）。
- UI のカタログ：`ja` がメッセージの型を定め、`en` と `es` はコンパイル時にそれと一致する必要があります。
- コンテンツ：すべてのレシピと食品が `ja`、`en`、`es` のテキストを持ちます。欠けていたり空だったりする項目があると、ビルドが失敗します。
- **食品の同一性は翻訳と切り離します**（ADR-006）。材料はロケールに依存しない食品 ID を参照し、名前と別名は表示と検索のためのデータにすぎません。栄養の関数はロケールの引数を受け付けず、これは型で強制します。
- ロケールごとの検索の正規化：`ja` は Unicode NFKC とひらがな／カタカナの同一視（検索語の長音記号は、それが伸ばす母音にも一致し、オ段とエ段のかなの後では う や い にも一致する）。`en` は大文字・小文字の同一視。`es` は大文字・小文字とアクセントの同一視。別名で地域ごとの言い方を補います（たとえば `patata` / `papa`）。
- 家庭での単位はロケールごとの表示ラベルです（大さじ / tbsp / cucharada）。分量はグラムで保存し、大さじは 15 mL と定めます。
- 書式には `Intl` の API を使います。値の書式化は表示の層でだけ行います。
- ロケールの判定と保存（*提案*。オーナーのほかのアプリと同じ方式）：保存されたロケールの設定が有効ならそれを使い、なければ `navigator.languages` のうち最初の対応言語、それもなければ `ja` にします。保存するのはロケールの設定だけです。

## 5. ビルド時のパイプライン

1. **抽出**：スクリプトが `data/raw/`（git で無視）から文部科学省のワークブックを読み、SHA-256 をマニフェストと照合し、食品辞書が参照する食品番号と選んだ列だけを記号の印つきで書き出します。出力とマニフェストは Git で管理します（[DATA_SOURCES.md](DATA_SOURCES.md)）。
2. **コンテンツ検証**：スキーマ。ID が重複しないこと。すべての材料が食品に、すべての食品が成分データに対応すること。ロケールのそろい。調整の範囲が正しいこと。置き換えが正しいこと。アレルゲンの結び付けがあること（または明示的に `unknown`）。
3. **ポリシーの lint**：すべてのロケールで、健康や効能についての禁止表現がないこと（[CONTENT_POLICY.md](CONTENT_POLICY.md)）。
4. **栄養のスナップショット**：レシピごとの計算値をテストのスナップショットとして保存し、データや式を変えたときに確認できる差分が出るようにします。
5. **コンテンツのバンドル**（ADR-027）：`tools/build-content.ts` が、ロケールに依存しない計算用のバンドルと、ロケールごとに 1 つのテキスト用のバンドルを `generated/content/`（git で無視）に書き出します。Vite が各ファイル名にコンテンツのハッシュを付けます。
6. **ヘッダーの生成**：セキュリティヘッダーを 1 か所で定め、ホスティングのプラットフォームの形式で書き出します。

## 6. 推薦の流れ（ブラウザ）

1. 計算用のバンドルと、有効なロケールのテキスト用のバンドルを読み込み（静的、コンテンツのハッシュつき）、`zod/mini` で、また互いに照らして検証します。バンドルに届かないか正しくないときは、再試行の操作つきのエラー状態を示します（`src/content/`）。ロケールを切り替えると、言語が変わる前にそのテキスト用のバンドルだけを読み込むので、画面はマウントされたままです。
2. 利用者の入力を検証し、矛盾する目標を見つけます（`src/views/TargetsView.tsx` と `domain/recommendation`）。
3. ハードな絞り込み → 適合の評価（既定の分量、次に範囲内での調整） → 適合の段階 → 多様化 → 安定した並べ替えを、メインスレッドで行います（ADR-030 D10）。
4. 型付きのカタログから、候補と決定論的な理由のテキストを描画します（`src/views/candidates/`）。
5. 詳細画面では、調整のたびに再計算します（`src/views/DetailView.tsx`）。ブラウザでの測定（Stage 4.7）：デスクトップで、UI の中での推薦全体が約 25 ms、クリックからレイアウトまでで再提案が約 2 ms、再計算が約 3 ms。CPU を 4 倍遅くすると推薦全体は約 66 ms（Stage 6.2。Stage 5.4 では約 80 ms）で、ADR-030 D10（改訂）の 100 ms のしきい値に収まります。
6. 状態はメモリに保ちます（`src/state/`、ADR-015、ADR-030 D9）。独自の URL を持つのは、レシピの詳細と「このアプリについて」のページだけです（`src/navigation/`、ADR-030 D2）。

## 7. プラットフォームからの独立

- 本番の出力は、普通の静的なビルド（`dist/`）です。Cloudflare に固有なのは `platform/cloudflare/` と生成するヘッダーのファイルだけです。
- ドメイン、コンテンツ、UI のコードは Cloudflare の実行時 API を使いません。テストは Node で実行します。
- MVP には Worker は不要です。将来のサーバー機能（たとえば任意の AI）は、HTTP の約束事を `shared/` に定め、提供元に固有の実装は薄いアダプターにとどめなければなりません。
- デプロイ手順書（[DEPLOYMENT.md](DEPLOYMENT.md)）には、Cloudflare（`platform/cloudflare/wrangler.jsonc`）と、同じ `dist/` をほかの静的ホストから配信する方法を書いています。`/assets/` の下のハッシュつきファイルには、生成した `_headers` で 1 年間の immutable なキャッシュのルールを付けます。

## 8. セキュリティとプライバシー

- 厳格な Content-Security-Policy（`'self'` のみ）、`X-Content-Type-Options: nosniff`、`Referrer-Policy`、制限的な `Permissions-Policy`、`frame-ancestors 'none'`。
- 実行時にサードパーティのスクリプト、フォント、画像を使いません。
- MVP では、利用者のデータはブラウザの外に出ません。目標と条件は決して URL に入れません。
- 依存パッケージのインストールスクリプトは、許可リストの方針で管理します（フェーズ 0）。

## 9. テストの方針

- 栄養エンジンと推薦エンジンの単体テスト（決定論性、丸め、不確かさ、調整の範囲、多様性、緩和の提案、矛盾）。
- **ロケールに依存しないことのテスト**：各ロケールの文脈で計算したすべてのレシピが、同じ内部の値になること。
- コンテンツ検証とポリシーの lint は、CI とビルドで実行します。
- 栄養のスナップショットテスト。
- jsdom による UI テスト（フィクスチャを使う `src/**/*.test.tsx`、リポジトリのコンテンツを使う `test/ui/`）。すべての画面と例外的な状態について、`ja`、`en`、`es` でアクセシビリティを確認し（axe-core、コントラストのルールを除く）、色のトークンについてコントラストのテストを行います（`test/node/styles.test.ts`）。
- 本番ビルドとそのヘッダーに対する E2E テスト（`e2e/`、Playwright）：デスクトップの Chromium と、375 px の Chromium と WebKit で、`ja`、`en`、`es` について。フロー全体、例外的な状態、ロケールの切り替え、ディープリンク、「このアプリについて」のページ、キーボード操作、ライトとダークでのコントラストを含む axe-core、セキュリティヘッダー、別のオリジンへのリクエストがないこと、CSP 違反がないこと。スマートフォン相当の速度の測定は必要なときに実行します（`npm run test:e2e:timing`）。

## 10. MVP に含めないもの

D1 などのデータベース、管理画面と認証、アプリケーションサーバー、AI の提供元、アクセス解析。これらがないのは意図したものです（ADR-002、ADR-004、ADR-015）。
