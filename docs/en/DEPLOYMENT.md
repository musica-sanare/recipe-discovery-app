English | [日本語](../ja/DEPLOYMENT.md) · [Docs index](README.md)

# Deployment Runbook — Recipe Discovery

This runbook explains how to deploy Recipe Discovery: what the build contains, the checks before a release, the Cloudflare steps with verification and rollback, and how to serve the same build from other static hosts. It is for whoever prepares a deployment.

> [!IMPORTANT]
> Every deployment, account, token, and project needs the owner's explicit approval of that specific action (`CLAUDE.md`).

Status: **In use (2026-10-24)**. First deployment: https://recipe-discovery.musica-sanare.workers.dev ([DECISIONS.md](../working/DECISIONS.md) "Production deployment"). The record of each release is in [RELEASE_READINESS.md](../working/RELEASE_READINESS.md).

The MVP is a static single-page application. `npm run build` writes everything to `dist/`, and no server code runs (ADR-001). Cloudflare is the first host. Other static hosts work if they can send response headers and serve `index.html` for unknown paths.

## 1. What `dist/` contains

| Path | Purpose | Caching |
|---|---|---|
| `index.html` | The app shell for every route | Revalidate on every request (host default) |
| `assets/*` | Content-hashed JavaScript, CSS, and content bundles | `public, max-age=31536000, immutable` |
| `third-party-licenses.txt` | Licenses of the bundled dependencies (about page) | Host default |
| `_headers` | Cloudflare/Netlify header rules generated from `platform/headers.ts` | Not served |

The app handles three routes: `/`, `/recipes/<id>`, and `/about`.

Every response needs the headers of `platform/headers.ts`:
- `Content-Security-Policy` (`'self'` only, `frame-ancestors 'none'`)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`

## 2. Before a release

1. On the commit to deploy, `npm ci`, `npm run check`, `npm run test:e2e`, and `npm audit` pass.
2. The secret scan of the whole history is repeated ([DECISIONS.md](../working/DECISIONS.md) "Stage 5.5"): `gitleaks git --log-opts=--all --redact` and `gitleaks dir` on the tracked files report no leaks.
3. [SPEC.md](SPEC.md) §15 is checked (Stage 5.7). The open questions listed for release are closed or accepted as limitations.
4. The owner approves the deployment proposal: what is deployed (commit), where (account, project name, domain), and how it is rolled back.

## 3. Cloudflare (Workers static assets)

Configuration: `platform/cloudflare/wrangler.jsonc`. It sets `name`, `compatibility_date`, and `assets` with `directory` and `not_found_handling: "single-page-application"`, without `main` (*Verified* in the Cloudflare documentation on 2026-10-18 and 2026-10-24; [DECISIONS.md](../working/DECISIONS.md) "Stage 5.1 release plan" P9). Requests to static assets are free and unlimited (*Verified* 2026-10-18; re-check before deploying).

Wrangler is not a dependency of the repository. At deployment time, check its current stable version under ADR-016 and ADR-018 and run it with an exact version.

> [!WARNING]
> Install Wrangler in a scratch directory outside the repository, with `--ignore-scripts`. The repository's `strict-allow-scripts` would block its dependencies. The `postinstall` scripts of `esbuild` and `workerd` only check or re-fetch the platform binaries, which the optional packages already provide. Run `npm audit` in that directory and override vulnerable transitive packages to their patched versions if needed.

1. Confirm the account with `wrangler whoami` (read-only). If Wrangler is not logged in, the owner runs `wrangler login` in a browser. No token is stored in the repository.
2. Set `compatibility_date` in `platform/cloudflare/wrangler.jsonc` to the deployment date.
3. Build with `npm ci && npm run build`. Check that `dist/_headers` contains the `/*` and `/assets/*` rules.
4. Run a dry run with `WRANGLER_SEND_METRICS=false`:

   ```bash
   wrangler deploy --config platform/cloudflare/wrangler.jsonc --dry-run
   ```

   Confirm that it reads `dist/`. `assets.directory` resolves relative to the config file (*Verified* with Wrangler 4.152.0 on 2026-10-24), and `_headers` is read as configuration, not uploaded.
5. After the owner's approval, deploy with the same command without `--dry-run`.
6. Verify on the deployed URL:
   - `/`, `/recipes/beef_potato_tomato_stew`, and `/about` return 200 with the security headers (`curl -I`).
   - `/recipes/no_such_recipe` shows the "not found" state; an unknown path shows the targets view.
   - A file under `/assets/` has `Cache-Control: public, max-age=31536000, immutable`; `index.html` does not.
   - The SPA fallback responses for `/recipes/<id>`, `/about`, and unknown paths carry the `_headers` values (*Verified* on the first deployment, 2026-10-24). Check again after a change of `platform/headers.ts`.
   - The page makes no request to another origin and logs nothing in the console; the language switch works.

### Rollback

The primary rollback works on any host: check out the previous release commit, build it, and deploy it with the same steps.

Cloudflare also offers rolling back to an earlier version of a Worker from the dashboard or with `wrangler rollback`. Check this in the current documentation at deployment time, including whether it applies to an assets-only Worker (要確認).

## 4. Other static hosts

| Host | Headers | SPA fallback | Notes |
|---|---|---|---|
| Netlify | `dist/_headers` uses the same format | Add `dist/_redirects` with `/* /index.html 200` | Requires a small renderer change if adopted |
| nginx | `add_header` lines from `platform/headers.ts` (with `always`) | `try_files $uri /index.html;` | Add `Cache-Control` for `/assets/` only |
| GitHub Pages | Response headers cannot be set | 404 page workaround only | Not recommended: the CSP and other headers would be missing |

Example nginx server block (values from `platform/headers.ts`):

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

`.github/workflows/ci.yml` runs `npm run check` and `npm run test:e2e` on pushes to `dev` and `main` and on pull requests. It has read-only permissions, no secrets, and no deployment step.

Deployment from CI is not set up. Adding it needs the owner's approval, a scoped API token stored as a repository secret, and an update of this runbook.
