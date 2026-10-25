<!-- source: docs/en/DEPLOYMENT.md blob ffea3f4847e99d9dd8ac1460546d3ee84da55e58 -->
[English](../en/DEPLOYMENT.md) | 日本語 · [目次に戻る](README.md)

> この文書は[英語版](../en/DEPLOYMENT.md)の翻訳です。内容が異なる場合は英語版が優先されます。

# デプロイ手順書 — Recipe Discovery

状態：**運用中（2026-10-24）**。最初のデプロイ：https://recipe-discovery.musica-sanare.workers.dev （[DECISIONS.md](../working/DECISIONS.md)（英語のみ）"Production deployment"）。デプロイ、アカウント、トークン、プロジェクトは、どれもその操作ごとにオーナーの明示的な承認が必要です（`CLAUDE.md`）。

MVP は静的なシングルページアプリケーションです。`npm run build` がすべてを `dist/` に書き出し、サーバーのコードは動きません（ADR-001）。最初のホストは Cloudflare です。レスポンスヘッダーを送れて、未知のパスに `index.html` を返せるなら、ほかの静的ホストでも動きます。

## 1. `dist/` の中身

| パス | 用途 | キャッシュ |
|---|---|---|
| `index.html` | すべてのルートで使うアプリの外枠 | 毎回のリクエストで再検証（ホストの既定） |
| `assets/*` | コンテンツのハッシュ付きの JavaScript、CSS、コンテンツのバンドル | `public, max-age=31536000, immutable` |
| `third-party-licenses.txt` | 同梱した依存パッケージのライセンス（「このアプリについて」のページ） | ホストの既定 |
| `_headers` | `platform/headers.ts` から生成した Cloudflare／Netlify のヘッダーのルール | 配信しない |

アプリが扱うルート：`/`、`/recipes/<id>`、`/about`。すべてのレスポンスに `platform/headers.ts` のヘッダーが必要です：`Content-Security-Policy`（`'self'` のみ、`frame-ancestors 'none'`）、`X-Content-Type-Options: nosniff`、`Referrer-Policy: strict-origin-when-cross-origin`、`Permissions-Policy`。

## 2. リリースの前に

1. デプロイするコミットで、`npm ci`、`npm run check`、`npm run test:e2e`、`npm audit` が通ること。
2. 履歴全体の秘密情報のスキャンをやり直すこと（[DECISIONS.md](../working/DECISIONS.md)（英語のみ）"Stage 5.5"）：`gitleaks git --log-opts=--all --redact` と、管理しているファイルに対する `gitleaks dir` が、漏えいを報告しないこと。
3. [SPEC.md](SPEC.md) §15 を確認し（Stage 5.7）、リリースに向けて挙げた未解決の質問が解決しているか、制限として受け入れられていること。
4. オーナーがデプロイの提案を承認すること：何を（コミット）、どこに（アカウント、プロジェクト名、ドメイン）デプロイし、どう戻すか。

## 3. Cloudflare（Workers の静的アセット）

設定：`platform/cloudflare/wrangler.jsonc` — `name`、`compatibility_date`、`directory` と `not_found_handling: "single-page-application"` を持つ `assets`。`main` はありません（2026-10-18 と 2026-10-24 に Cloudflare のドキュメントで *検証済み*。[DECISIONS.md](../working/DECISIONS.md)（英語のみ）"Stage 5.1 release plan" P9）。静的アセットへのリクエストは無料で無制限です（2026-10-18 に *検証済み*。デプロイの前に確認し直すこと）。

Wrangler はリポジトリの依存パッケージではありません。デプロイのときに、ADR-016 と ADR-018 に従って現在の安定版を確かめ、正確な版を指定して実行します。

1. アカウントを確認します：`wrangler whoami`（読み取りのみ）。Wrangler がログインしていなければ、オーナーがブラウザで `wrangler login` を実行します。リポジトリにトークンは保存しません。
2. `platform/cloudflare/wrangler.jsonc` の `compatibility_date` をデプロイの日付にします。
3. ビルド：`npm ci && npm run build`。`dist/_headers` に `/*` と `/assets/*` のルールがあることを確かめます。
4. ドライラン：`WRANGLER_SEND_METRICS=false` を付けて `wrangler deploy --config platform/cloudflare/wrangler.jsonc --dry-run`。`dist/` を読んでいることを確かめます：`assets.directory` は設定ファイルからの相対パスで解決され（2026-10-24 に Wrangler 4.152.0 で *検証済み*）、`_headers` はアップロードされず設定として読まれます。Wrangler はリポジトリの外のスクラッチ用ディレクトリに `--ignore-scripts` を付けてインストールします（リポジトリの `strict-allow-scripts` だと、その依存パッケージが止められるため）。`esbuild` と `workerd` の `postinstall` スクリプトは、プラットフォーム用のバイナリを確認または取得し直すだけで、それは任意の依存パッケージがすでに提供しています。そこで `npm audit` を実行し、必要なら脆弱性のある推移的な依存パッケージを修正済みの版に上書きします。
5. デプロイ：オーナーの承認後に、同じコマンドを `--dry-run` なしで実行します。
6. デプロイした URL で確かめます：
   - `/`、`/recipes/beef_potato_tomato_stew`、`/about` が、セキュリティヘッダー付きで 200 を返すこと（`curl -I`）。
   - `/recipes/no_such_recipe` で「見つかりません」の状態を示し、未知のパスでは目標の画面を示すこと。
   - `/assets/` の下のファイルに `Cache-Control: public, max-age=31536000, immutable` があり、`index.html` にはないこと。
   - `/recipes/<id>`、`/about`、未知のパスに対する SPA のフォールバックのレスポンスに `_headers` の値が付いていること（最初のデプロイ、2026-10-24 に *検証済み*）。`platform/headers.ts` を変えたら確認し直します。
   - ページが別のオリジンへリクエストを送らず、コンソールに何も出さないこと。言語の切り替えが動くこと。

### ロールバック

主な方法：前のリリースのコミットをチェックアウトし、同じ手順でビルドしてデプロイします。これはどのホストでも使えます。Cloudflare では、ダッシュボードや `wrangler rollback` で Worker の前の版に戻すこともできます（アセットだけの Worker にも使えるかを含め、デプロイのときに最新のドキュメントで 要確認）。

## 4. ほかの静的ホスト

| ホスト | ヘッダー | SPA のフォールバック | 注記 |
|---|---|---|---|
| Netlify | `dist/_headers` は同じ形式 | `/* /index.html 200` を書いた `dist/_redirects` を追加 | 採用するならレンダラーの小さな変更が必要 |
| nginx | `platform/headers.ts` から作った `add_header` の行（`always` 付き） | `try_files $uri /index.html;` | `Cache-Control` は `/assets/` にだけ追加 |
| GitHub Pages | レスポンスヘッダーを設定できない | 404 ページによる回避策だけ | 推奨しない：CSP などのヘッダーが付かない |

nginx の server ブロックの例（値は `platform/headers.ts` から）：

```nginx
root /srv/recipe-discovery/dist;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;
location /assets/ {
  add_header Cache-Control "public, max-age=31536000, immutable" always;
  # add_header in a location replaces the server-level headers, so repeat them here.
  add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;
}
location / {
  try_files $uri /index.html;
}
```

（設定の中のコメントの訳）location の中の add_header は server レベルのヘッダーを置き換えるので、ここで繰り返します。

## 5. CI

`.github/workflows/ci.yml` は、`dev` と `main` への push とプルリクエストで `npm run check` と `npm run test:e2e` を実行します。権限は読み取りだけで、秘密情報もデプロイの手順もありません。CI からのデプロイは設定していません。追加するには、オーナーの承認、範囲を絞った API トークンをリポジトリの secret として保存すること、そしてこの手順書の更新が必要です。
