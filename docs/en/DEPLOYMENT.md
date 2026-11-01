English | [日本語](../ja/DEPLOYMENT.md) · [Docs index](README.md)

# Deployment Runbook — Recipe Discovery

This runbook explains how to deploy Recipe Discovery: what the build contains, the checks before a release, the Cloudflare steps with verification and rollback, and how to serve the same build from other static hosts. It is for whoever prepares a deployment.

> [!IMPORTANT]
> Every push to `main` is a production deploy. Only the owner pushes `main`. Cloudflare Workers Builds builds and deploys it; nobody deploys from a local machine (ADR-035).

Status: **In use (2026-10-24)**. First deployment: https://recipe-discovery.musica-sanare.workers.dev ([DECISIONS.md](../working/DECISIONS.md) "Production deployment"). Deployed by Workers Builds since the migration of ADR-035 (first build 2026-10-31). The record of each release is in [RELEASE_READINESS.md](../working/RELEASE_READINESS.md).

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

1. On the commit to deploy, `npm ci`, `npm run check`, `npm run test:e2e`, and `npm audit` pass. CI on `dev` runs the first three for that exact commit.
2. The secret scan of the whole history is repeated ([DECISIONS.md](../working/DECISIONS.md) "Stage 5.5"): `gitleaks git --log-opts=--all --redact` and `gitleaks dir` on the tracked files report no leaks.
3. [SPEC.md](SPEC.md) §15 is checked (Stage 5.7). The open questions listed for release are closed or accepted as limitations.
4. The owner approves the release: which `dev` commit becomes `main`, and how it is rolled back.

## 3. Cloudflare (Workers Builds)

Cloudflare Workers Builds deploys the site: every push to `main` builds the pushed commit in Cloudflare and deploys it to production. Nobody deploys from a local machine, and no machine keeps a Wrangler login (ADR-035).

The Worker is assets-only. `platform/cloudflare/wrangler.jsonc` sets `name`, `compatibility_date`, and `assets` with `directory` and `not_found_handling: "single-page-application"`, without `main` (*Verified* 2026-10-18 and 2026-10-24; [DECISIONS.md](../working/DECISIONS.md) "Stage 5.1 release plan" P9). Requests to static assets are free and unlimited (*Verified* 2026-10-31).

### Release to production

1. The release commit is on `dev`, and CI passed on it.
2. The owner merges `dev` into `main` by hand, in one of two ways. The update of `main` deploys.
   - Locally, then push:

     ```bash
     git switch main
     ```

     ```bash
     git merge dev
     ```

     ```bash
     git push origin main
     ```

   - Through a GitHub pull request from `dev` to `main`, merged with a merge commit. Do not squash or rebase: that would put commits on `main` that are not on `dev`.

   Either way, `main` gets a merge commit with the same files as the `dev` commit. Nothing else is committed to `main`.

3. Workers Builds runs the build command, then the deploy command (see "Build settings"). The build log is under the Worker's **Deployments** in the dashboard, and the GitHub commit gets a check run.
4. Verify the deployed site (see "Verify after a deploy").

A failed build changes nothing in production.

### Build settings

The owner sets these once in the dashboard: **Workers & Pages** → `recipe-discovery` → **Settings** → **Builds**.

| Setting | Value | Why |
|---|---|---|
| Git repository | `musica-sanare/recipe-discovery-app` | The GitHub app gets access to this repository only |
| Production branch | `main` | A push to `main` is a production deploy |
| Builds for non-production branches | Off | CI checks `dev`; previews would publish unreleased code and use build minutes |
| Root directory | `/` (repository root) | `npm ci` and the build need the whole repository |
| Build command | `npm ci && npm run check` | Same install and checks as CI, under `.npmrc` (ADR-018) |
| Deploy command | `node platform/cloudflare/deploy.ts` | Installs the pinned Wrangler outside the repository and deploys with `--config` |
| Build variable | `SKIP_DEPENDENCY_INSTALL` = `1` | The build command runs `npm ci` itself |
| API token | Created by Workers Builds | Never stored in the repository or in GitHub |

Node.js comes from `.nvmrc` (24). npm comes from `packageManager` in `package.json`, so the build uses the npm version that wrote the lockfile and enforces `strict-allow-scripts`.

### Wrangler version

Wrangler is not a repository dependency. `platform/cloudflare/deploy.ts` installs one exact version into a temporary directory with `--ignore-scripts`, where the repository's `.npmrc` does not apply. The `postinstall` scripts of `esbuild` and `workerd` only check or re-fetch the platform binaries, which the optional packages already provide.

To change the version, edit `WRANGLER_VERSION` in `platform/cloudflare/deploy.ts` in a reviewed commit (ADR-016). A local dry run checks the change without a Cloudflare login. It downloads Wrangler, so it needs the owner's approval:

```bash
npm run build
```

```bash
node platform/cloudflare/deploy.ts --dry-run
```

Confirm that it reads `dist/` and uploads assets only. `assets.directory` resolves relative to the config file (*Verified* with Wrangler 4.152.0 on 2026-10-24), and `_headers` is read as configuration, not uploaded.

### `compatibility_date`

`compatibility_date` changes only in a reviewed commit, never automatically and never to a future date. It no longer follows the deployment date, because a push deploys without a separate step. Update it when a Worker script needs newer runtime behavior, after reading the compatibility flags between the old and new dates. While the Worker is assets-only, an old date is fine: the runtime supports old dates indefinitely (*Verified* 2026-10-31).

### Verify after a deploy

On https://recipe-discovery.musica-sanare.workers.dev:

- `/`, `/recipes/beef_potato_tomato_stew`, and `/about` return 200 with the security headers (`curl -I`).
- `/recipes/no_such_recipe` shows the "not found" state; an unknown path shows the targets view.
- A file under `/assets/` has `Cache-Control: public, max-age=31536000, immutable`; `index.html` does not.
- The SPA fallback responses for `/recipes/<id>`, `/about`, and unknown paths carry the `_headers` values (*Verified* on the first deployment, 2026-10-24). Check again after a change of `platform/headers.ts`.
- The page makes no request to another origin and logs nothing in the console; the language switch works.

### Rollback

The primary rollback goes through Git: revert the change on `dev`, wait for CI, then merge `dev` into `main` as in "Release to production". Workers Builds deploys the result.

For an urgent rollback, the owner can pick an earlier version in the dashboard under **Deployments** → **Rollback** (the 100 most recent versions). The next push to `main` deploys `main` again, so follow up with the Git revert. Whether a dashboard rollback also restores that version's static assets is 要確認.

### Limits and billing

The account stays on Workers Free. Nobody adds a payment method, upgrades the plan, or buys build minutes.

| Limit (Workers Free) | Value |
|---|---|
| Build minutes | 3,000 per month |
| Concurrent builds | 1 |
| Build timeout | 20 minutes |

*Verified* on 2026-10-31 (limits page updated 2026-10-28). The page lists an overage price only for paid plans and does not say what happens when the free minutes run out (要確認). A release uses one build of a few minutes, so normal use stays far below the limit.

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

GitHub Actions never deploys and holds no Cloudflare credentials. Only Workers Builds has deploy access (§3). Workers Builds does not wait for GitHub CI, so `main` only receives commits that already passed CI on `dev`.
