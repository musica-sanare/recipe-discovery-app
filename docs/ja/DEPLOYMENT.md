<!-- source: docs/en/DEPLOYMENT.md blob 6f46270a5b0af1dfffba2eac43243546a3615d31 -->
[English](../en/DEPLOYMENT.md) | 日本語 · [目次に戻る](README.md)

> この文書は[英語版](../en/DEPLOYMENT.md)の翻訳。内容が異なる場合は英語版が優先する。

# デプロイ手順 — Recipe Discovery

Recipe Discovery をデプロイする手順だ。ビルドの中身、リリース前の確認、Cloudflare での手順と確認とロールバック、同じビルドをほかの静的ホストで配信する方法を扱う。デプロイを準備する人に向けている。

> [!IMPORTANT]
> `main` への push はすべて本番のデプロイになる。`main` に push するのはオーナーだけだ。ビルドとデプロイは Cloudflare Workers Builds が行い、ローカルのマシンからはデプロイしない（ADR-035）。

状態：**運用中（2026-10-24）**。最初のデプロイ先は https://recipe-discovery.musica-sanare.workers.dev だ（[DECISIONS.md](../working/DECISIONS.md)（英語のみ）"Production deployment"）。ADR-035 の移行後は Workers Builds がデプロイする（最初のビルドは 2026-10-31）。リリース 14（2026-11-03）からの公開 URL は https://recipe-discovery.apps.musica-sanare.com だ（ADR-040）。`workers.dev` もそのまま使える。リリースごとの記録は [RELEASE_READINESS.md](../working/RELEASE_READINESS.md)（英語のみ）にある。

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

1. デプロイするコミットで、`npm ci`、`npm run check`、`npm run test:e2e`、`npm audit` が通る。最初の 3 つは、`dev` の CI がそのコミットで実行する。
2. 履歴全体の秘密情報のスキャンをやり直す（[DECISIONS.md](../working/DECISIONS.md)（英語のみ）"Stage 5.5"）。`gitleaks git --log-opts=--all --redact` と、管理しているファイルに対する `gitleaks dir` が、漏えいを報告しない。
3. [SPEC.md](SPEC.md) §15 を確認する（Stage 5.7）。リリースに向けて挙げた未解決の質問は、解決しているか、制限として受け入れてある。
4. オーナーがリリースを承認する。`dev` のどのコミットを `main` にするか、どう戻すかを決める。

## 3. Cloudflare（Workers Builds）

サイトは Cloudflare Workers Builds がデプロイする。`main` に push するたびに、Cloudflare がそのコミットをビルドして本番にデプロイする。ローカルのマシンからはデプロイせず、Wrangler にログインしたままのマシンも置かない（ADR-035）。

Worker はアセットだけで、スクリプトを持たない。`platform/cloudflare/wrangler.jsonc` は `name`、`compatibility_date`、`directory` と `not_found_handling: "single-page-application"` を持つ `assets` を定め、`main` は持たない。URL は `routes`、`workers_dev`、`preview_urls` で決まる（「公開用のホスト名」を参照）（2026-10-18 と 2026-10-24 に *検証済み*。[DECISIONS.md](../working/DECISIONS.md)（英語のみ）"Stage 5.1 release plan" P9）。静的アセットへのリクエストは無料で無制限だ（2026-10-31 に *検証済み*）。

### 本番へのリリース

1. リリースするコミットが `dev` にあり、そのコミットで CI が通っている。
2. オーナーが手作業で `dev` を `main` にマージする。方法は次の 2 つのどちらかだ。`main` が更新されるとデプロイになる。
   - ローカルでマージして push する：

     ```bash
     git switch main
     ```

     ```bash
     git merge dev
     ```

     ```bash
     git push origin main
     ```

   - GitHub で `dev` から `main` への pull request を作り、マージコミットでマージする。squash や rebase は使わない。`dev` にないコミットが `main` にできてしまうからだ。

   どちらでも、`main` には `dev` のコミットと同じファイルを持つマージコミットができる。それ以外のコミットは `main` に入れない。

3. Workers Builds がビルドコマンドを実行し、続けてデプロイコマンドを実行する（「ビルドの設定」を参照）。ビルドのログはダッシュボードの Worker の **Deployments** にあり、GitHub のコミットにはチェックが付く。
4. デプロイしたサイトを確かめる（「デプロイ後の確認」を参照）。

ビルドが失敗しても、本番は何も変わらない。

### ビルドの設定

オーナーがダッシュボードで一度だけ設定する。場所は **Workers & Pages** → `recipe-discovery` → **Settings** → **Builds** だ。

| 設定 | 値 | 理由 |
|---|---|---|
| Git リポジトリ | `musica-sanare/recipe-discovery-app` | GitHub アプリにはこのリポジトリだけを許可する |
| 本番ブランチ | `main` | `main` への push が本番のデプロイになる |
| 本番以外のブランチのビルド | オフ | `dev` は CI が確かめる。プレビューを作ると未リリースのコードが公開され、ビルド時間も使う |
| ルートディレクトリ | `/`（リポジトリのルート） | `npm ci` とビルドにリポジトリ全体が要る |
| ビルドコマンド | `npm ci && npm run check` | CI と同じインストールと確認を、`.npmrc`（ADR-018）の下で行う |
| デプロイコマンド | `node platform/cloudflare/deploy.ts` | 版を固定した Wrangler をリポジトリの外に入れ、`--config` を付けてデプロイする |
| ビルド変数 | `SKIP_DEPENDENCY_INSTALL` = `1` | `npm ci` はビルドコマンドが自分で実行する |
| API トークン | Workers Builds が作るもの | リポジトリにも GitHub にも保存しない |

Node.js の版は `.nvmrc`（24）で決まる。npm の版は `package.json` の `packageManager` で決まる。そのため、ビルドはロックファイルを書いたのと同じ npm を使い、`strict-allow-scripts` も効く。

### Wrangler の版

Wrangler はリポジトリの依存パッケージではない。`platform/cloudflare/deploy.ts` が、決めた 1 つの版を一時ディレクトリに `--ignore-scripts` 付きで入れる。そこにはリポジトリの `.npmrc` が効かない。`esbuild` と `workerd` の `postinstall` スクリプトはプラットフォーム用のバイナリを確かめるか取り直すだけで、それは任意の依存パッケージがすでに入れている。

版を変えるときは、`platform/cloudflare/deploy.ts` の `WRANGLER_VERSION` をレビューを通すコミットで変える（ADR-016）。変更はローカルのドライランで確かめられ、Cloudflare へのログインは要らない。ただし Wrangler をダウンロードするので、オーナーの承認が要る：

```bash
npm run build
```

```bash
node platform/cloudflare/deploy.ts --dry-run
```

`dist/` を読み、アセットだけをアップロードすることを確かめる。`assets.directory` は設定ファイルからの相対パスで解決され（2026-10-24 に Wrangler 4.152.0 で *検証済み*）、`_headers` はアップロードされずに設定として読まれる。

### `compatibility_date`

`compatibility_date` は、レビューを通すコミットでだけ変える。自動では変えず、未来の日付にもしない。push だけでデプロイされ、デプロイ用の別の手順がないので、デプロイの日付にはもう合わせない。Worker のスクリプトが新しいランタイムの動作を必要としたときに、古い日付と新しい日付の間の互換性フラグを読んでから更新する。Worker がアセットだけのうちは、古い日付のままでかまわない。ランタイムは古い日付をずっとサポートする（2026-10-31 に *検証済み*）。

### 公開用のホスト名

Worker は `recipe-discovery.apps.musica-sanare.com` を Workers Custom Domain として配信する。設定元は `platform/cloudflare/wrangler.jsonc` の `routes` だ（ADR-040）。ホスト名はオーナーの `musica-sanare-home` リポジトリのドメイン計画に従い、その登録簿に載っている。設定は Workers Builds のデプロイのたびに反映される。

| 設定 | 値 | 理由 |
|---|---|---|
| `routes` | `{ "pattern": "recipe-discovery.apps.musica-sanare.com", "custom_domain": true }` | DNS レコードと証明書は Cloudflare が作る |
| `workers_dev` | `true` | 以前のリンクを使い続けられる。`routes` を書くと既定ではオフになる |
| `preview_urls` | `false` | サイトの公開コピーを増やさない。本番以外のビルドもない（ADR-035） |

> [!WARNING]
> `recipe-discovery.apps.musica-sanare.com` の DNS レコードを手で作らない。2 階層目のホスト名は Universal SSL の対象外で、既存のレコードがあるとカスタムドメインを付けられない。

`localStorage` はオリジンごとに分かれる。片方の URL で保存した言語の設定と条件（ADR-036）は、もう片方では使えない。

ゾーンの Cloudflare Web Analytics は無効のままにする。自動設定が有効だと、プロキシを通るホスト名の HTML にビーコンのスクリプトが差し込まれる。カスタムドメインはこれに当たり、`workers.dev` は当たらない。オーナーが 2026-11-03 にゾーン全体で無効にした（ADR-040）。スクリプトは CSP が止めるが、コンソールにエラーが出る。

ドメインを付ける手順（オーナー）：

2026-11-03 にリリース 14 で済んだ（[DECISIONS.md](../working/DECISIONS.md)（英語のみ）"Release 14 and fourteenth production deployment"）。ロールバックのあとなどでもう一度付けるときは次のとおり：

1. マージの前に、ゾーンの DNS レコードに `recipe-discovery.apps.musica-sanare.com` のレコードがないことを確かめる。
2. 「本番へのリリース」と同じ手順で `dev` を `main` にマージする。このデプロイでカスタムドメインが付く。
3. ビルドのあとで次を確かめる：
   - `https://recipe-discovery.apps.musica-sanare.com/` が有効な証明書でアプリを表示する。
   - Worker の **Settings** → **Domains & Routes** にこのホスト名がカスタムドメインとして載り、`workers.dev` も有効のままだ。
   - ほかの Worker にカスタムドメインが増えていない。
   - 両方の URL で「デプロイ後の確認」が通る。
4. 翌日、Billing を開いて新しい請求がないことを確かめる。請求があれば、`dev` で `routes` を revert して同じ手順でマージする。カスタムドメインが **Domains & Routes** に残っていれば外し（要確認：設定から消したデプロイで外れるかどうか）、[DECISIONS.md](../working/DECISIONS.md)（英語のみ）に記録する。
5. 結果を `musica-sanare-home` に伝える（その `prompts/publish-app-on-domain.md` の Phase B）。そこでホスト名が `live` になる。

### デプロイ後の確認

https://recipe-discovery.apps.musica-sanare.com と、https://recipe-discovery.musica-sanare.workers.dev で次を確かめる：

- `/`、`/recipes/beef_potato_tomato_stew`、`/about` が、セキュリティヘッダー付きで 200 を返す（`curl -I`）。
- `/recipes/no_such_recipe` で「見つかりません」の状態を示し、未知のパスでは目標の画面を示す。
- `/assets/` の下のファイルには `Cache-Control: public, max-age=31536000, immutable` があり、`index.html` にはない。
- `/recipes/<id>`、`/about`、未知のパスに対する SPA のフォールバックのレスポンスに `_headers` の値が付く（最初のデプロイ、2026-10-24 に *検証済み*）。`platform/headers.ts` を変えたら確かめ直す。
- ページが別のオリジンへリクエストを送らず、コンソールに何も出さない。言語の切り替えが動く。
- HTML に、ビルドが書いていないスクリプト（Cloudflare Web Analytics のビーコンなど）がない。ビーコンはブラウザにだけ差し込まれるので、ブラウザの `User-Agent` と `Accept: text/html` を付けて取得する：`curl -s -A 'Mozilla/5.0 (Macintosh) AppleWebKit/605.1.15 Safari/605.1.15' -H 'Accept: text/html' <URL> | grep -c cloudflareinsights` が `0` を出す。

### ロールバック

主な方法は Git を通す。`dev` で変更を revert し、CI を待ってから「本番へのリリース」と同じ手順で `dev` を `main` にマージする。その結果を Workers Builds がデプロイする。

急ぐときは、オーナーがダッシュボードの **Deployments** → **Rollback** で前の版を選べる（直近 100 版まで）。次に `main` へ push すると `main` の内容がまたデプロイされるので、あとで Git の revert も行う。ダッシュボードのロールバックでその版の静的アセットまで戻るかは要確認。

### 上限と課金

アカウントは Workers Free のままにする。支払い方法の登録、プランのアップグレード、ビルド時間の購入は、誰もしない。

| 上限（Workers Free） | 値 |
|---|---|
| ビルド時間 | 月 3,000 分 |
| 同時に動くビルド | 1 |
| ビルドのタイムアウト | 20 分 |

2026-10-31 に *検証済み*（上限のページは 2026-10-28 更新）。超過料金は有料プランにだけ書かれていて、無料の分数を使い切ったときにどうなるかは書かれていない（要確認）。リリース 1 回で数分のビルドが 1 回動くだけなので、普段の使い方なら上限よりずっと少ない。

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

GitHub Actions はデプロイせず、Cloudflare の認証情報も持たない。デプロイの権限を持つのは Workers Builds だけだ（§3）。Workers Builds は GitHub の CI を待たないので、`main` には `dev` で CI を通ったコミットだけを入れる。
