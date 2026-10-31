<!-- source: docs/en/DEPLOYMENT.md blob 9eefe0a398269ef7459eb01361f647c323bd4208 -->
[English](../en/DEPLOYMENT.md) | 日本語 · [目次に戻る](README.md)

> この文書は[英語版](../en/DEPLOYMENT.md)の翻訳。内容が異なる場合は英語版が優先する。

# デプロイ手順 — Recipe Discovery

Recipe Discovery をデプロイする手順だ。ビルドの中身、リリース前の確認、Cloudflare での手順と確認とロールバック、同じビルドをほかの静的ホストで配信する方法を扱う。デプロイを準備する人に向けている。

> [!IMPORTANT]
> デプロイ、アカウント、トークン、プロジェクトは、どれもその操作ごとにオーナーの明示的な承認がいる（`CLAUDE.md`）。

状態：**運用中（2026-10-24）**。最初のデプロイ先は https://recipe-discovery.musica-sanare.workers.dev だ（[DECISIONS.md](../working/DECISIONS.md)（英語のみ）"Production deployment"）。リリースごとの記録は [RELEASE_READINESS.md](../working/RELEASE_READINESS.md)（英語のみ）にある。

MVP は静的なシングルページアプリケーションだ。`npm run build` がすべてを `dist/` に書き出し、サーバーのコードは動かない（ADR-001）。最初のホストは Cloudflare だ。レスポンスヘッダーを送れて、未知のパスに `index.html` を返せるなら、ほかの静的ホストでも動く。

## 1. `dist/` の中身

| パス | 用途 | キャッシュ |
|---|---|---|
| `index.html` | すべてのルートで使うアプリの外枠 | 毎回のリクエストで再検証（ホストの既定） |
| `assets/*` | 内容のハッシュ付きの JavaScript、CSS、コンテンツのバンドル | `public, max-age=31536000, immutable` |
| `third-party-licenses.txt` | 同梱した依存パッケージのライセンス（「このアプリについて」のページ） | ホストの既定 |
| `_headers` | `platform/headers.ts` から生成した Cloudflare／Netlify のヘッダーのルール | 配信しない |

アプリが扱うルートは `/`、`/recipes/<id>`、`/about` の 3 つだ。

すべてのレスポンスに `platform/headers.ts` のヘッダーが要る：
- `Content-Security-Policy`（`'self'` のみ、`frame-ancestors 'none'`）
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`

## 2. リリースの前に

1. デプロイするコミットで、`npm ci`、`npm run check`、`npm run test:e2e`、`npm audit` が通る。
2. 履歴全体の秘密情報のスキャンをやり直す（[DECISIONS.md](../working/DECISIONS.md)（英語のみ）"Stage 5.5"）。`gitleaks git --log-opts=--all --redact` と、管理しているファイルに対する `gitleaks dir` が、漏えいを報告しない。
3. [SPEC.md](SPEC.md) §15 を確認する（Stage 5.7）。リリースに向けて挙げた未解決の質問は、解決しているか、制限として受け入れてある。
4. オーナーがデプロイの提案を承認する。提案には、何を（コミット）、どこに（アカウント、プロジェクト名、ドメイン）デプロイし、どう戻すかを書く。

## 3. Cloudflare（Workers の静的アセット）

設定は `platform/cloudflare/wrangler.jsonc` にある。`name`、`compatibility_date`、`directory` と `not_found_handling: "single-page-application"` を持つ `assets` を定め、`main` は持たない（2026-10-18 と 2026-10-24 に Cloudflare のドキュメントで *検証済み*。[DECISIONS.md](../working/DECISIONS.md)（英語のみ）"Stage 5.1 release plan" P9）。静的アセットへのリクエストは無料で無制限だ（2026-10-18 に *検証済み*。デプロイの前に確認し直す）。

Wrangler はリポジトリの依存パッケージではない。デプロイのときに、ADR-016 と ADR-018 に従って今の安定版を確かめ、正確な版を指定して実行する。

> [!WARNING]
> Wrangler は、リポジトリの外のスクラッチ用ディレクトリに `--ignore-scripts` を付けて入れる。リポジトリの `strict-allow-scripts` だと、その依存パッケージが止められるからだ。`esbuild` と `workerd` の `postinstall` スクリプトはプラットフォーム用のバイナリを確かめるか取り直すだけで、それは任意の依存パッケージがすでに入れている。そのディレクトリで `npm audit` を実行し、必要なら脆弱性のある推移的な依存パッケージを修正済みの版に上書きする。

1. `wrangler whoami`（読み取りのみ）でアカウントを確かめる。Wrangler がログインしていなければ、オーナーがブラウザで `wrangler login` を実行する。リポジトリにトークンは保存しない。
2. `platform/cloudflare/wrangler.jsonc` の `compatibility_date` をデプロイの日付にする。
3. `npm ci && npm run build` でビルドする。`dist/_headers` に `/*` と `/assets/*` のルールがあることを確かめる。
4. `WRANGLER_SEND_METRICS=false` を付けてドライランする：

   ```bash
   wrangler deploy --config platform/cloudflare/wrangler.jsonc --dry-run
   ```

   `dist/` を読んでいることを確かめる。`assets.directory` は設定ファイルからの相対パスで解決され（2026-10-24 に Wrangler 4.152.0 で *検証済み*）、`_headers` はアップロードされずに設定として読まれる。
5. オーナーの承認を得たら、同じコマンドを `--dry-run` なしで実行してデプロイする。
6. デプロイした URL で確かめる：
   - `/`、`/recipes/beef_potato_tomato_stew`、`/about` が、セキュリティヘッダー付きで 200 を返す（`curl -I`）。
   - `/recipes/no_such_recipe` で「見つかりません」の状態を示し、未知のパスでは目標の画面を示す。
   - `/assets/` の下のファイルには `Cache-Control: public, max-age=31536000, immutable` があり、`index.html` にはない。
   - `/recipes/<id>`、`/about`、未知のパスに対する SPA のフォールバックのレスポンスに `_headers` の値が付く（最初のデプロイ、2026-10-24 に *検証済み*）。`platform/headers.ts` を変えたら確かめ直す。
   - ページが別のオリジンへリクエストを送らず、コンソールに何も出さない。言語の切り替えが動く。

### ロールバック

主な方法はどのホストでも使える。前のリリースのコミットをチェックアウトし、同じ手順でビルドしてデプロイする。

Cloudflare では、ダッシュボードや `wrangler rollback` で Worker の前の版に戻すこともできる。アセットだけの Worker にも使えるかを含め、デプロイのときに最新のドキュメントで確かめる（要確認）。

## 4. ほかの静的ホスト

| ホスト | ヘッダー | SPA のフォールバック | 備考 |
|---|---|---|---|
| Netlify | `dist/_headers` が同じ形式 | `/* /index.html 200` を書いた `dist/_redirects` を足す | 採用するなら、出力処理を少し変える必要がある |
| nginx | `platform/headers.ts` から作った `add_header` の行（`always` 付き） | `try_files $uri /index.html;` | `Cache-Control` は `/assets/` にだけ付ける |
| GitHub Pages | レスポンスヘッダーを設定できない | 404 ページを使う回避策だけ | 勧めない。CSP などのヘッダーが付かない |

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

## 5. CI

`.github/workflows/ci.yml` は、`dev` と `main` への push とプルリクエストで `npm run check` と `npm run test:e2e` を実行する。権限は読み取りだけで、秘密情報もデプロイの手順もない。

CI からのデプロイは設定していない。加えるには、オーナーの承認、リポジトリの secret に保存する範囲を絞った API トークン、この手順書の更新が要る。
