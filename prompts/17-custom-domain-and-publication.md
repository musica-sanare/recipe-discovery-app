# Prompt 17 — Phase 17: Custom domain and repository publication

You are the lead engineer for Recipe Discovery. Read `CLAUDE.md` and every document under `docs/en/` and `docs/working/` before making changes. Phase 0 to Phase 16 results are in `docs/working/DECISIONS.md` (in particular ADR-001, ADR-015, ADR-031, ADR-035, ADR-036; "History rewrite"; "Pre-publication check"; "Next phases after Phase 15"; "Release 13 and thirteenth production deployment"; "Phase 16 acceptance"; "Open questions"). Communicate with the owner in Japanese; write repository files in English.

Two procedures outside this repository apply. Read them; never edit those repositories from here.
- The domain plan of the owner's `musica-sanare-home` repository: `~/repos/musica-sanare-home/docs/en/DOMAINS.md` (hostname rules, attachment rule, cost checks, registry) and `~/repos/musica-sanare-home/prompts/publish-app-on-domain.md` (Phase A reserves the hostname and writes the hand-over; Phase B marks it `live` after the owner's report). Both phases run in a session in that repository, started by the owner.
- The shared public-release procedure: `~/repos/claude-shared-rules/docs/en/PUBLIC_RELEASE.md`, its checklist template `~/repos/claude-shared-rules/templates/PUBLIC_RELEASE.md`, and its preparation prompt `~/repos/claude-shared-rules/prompts/prepare-public-release.md`.

The owner's Travel Discovery app already took the same path (`~/repos/travel-discovery-app`, ADR-034 and `docs/en/DEPLOYMENT.md` "5.1 Public hostname"); read it as a reference only.

## Starting point
- Branch `dev`; release 13 (Phase 16) was deployed on 2026-11-01 by Workers Builds from `84c2e41`, merged into `main` as `4768cad`; `4a265dd` (release 12) is the rollback target. The owner pushes, merges `dev` into `main` by hand, and a merge into `main` deploys ([DEPLOYMENT.md](../docs/en/DEPLOYMENT.md) §3). Claude never deploys and never runs Wrangler with a login.
- Production URL: https://recipe-discovery.musica-sanare.workers.dev. The Worker `recipe-discovery` is assets-only; `platform/cloudflare/wrangler.jsonc` has `name`, `compatibility_date`, and `assets`, and no `routes`, `workers_dev`, or `preview_urls`. The account stays on Workers Free.
- Domain: the owner already owns `musica-sanare.com`; its zone is on Cloudflare on the Free plan (owner, 2026-11-01, recorded in `musica-sanare-home`). No registration, purchase, transfer, or zone change is needed. The hub's rule gives this app **`recipe-discovery.apps.musica-sanare.com`**; it is not yet in the hub's registry.
- Every URL inside the app is relative, the CSP uses `'self'`, and the app sets no canonical URL, `og:url`, CORS origin, or callback URL (re-check in 17.1). `localStorage` is per origin: the locale preference and the opt-in saved conditions (ADR-036) on `workers.dev` do not carry over to the new hostname.
- GitHub refs on 2026-11-01 (`git ls-remote origin`): `refs/heads/main` (`4768cad`), `refs/heads/dev` (`84c2e41`), `refs/pull/1/head` (`75f58c9`, contained in `dev`). No tags. One workflow (`.github/workflows/ci.yml`). The open item of "Pre-publication check" (`main` held only the initial commit) is resolved: `main` holds the released history.
- Cloudflare facts checked on 2026-11-01 (re-check at the start of the phase):
  - Custom Domains on Workers: Cloudflare creates the DNS record and a certificate, also for multi-level subdomains, without Advanced Certificate Manager; a hostname with an existing CNAME record cannot be used ([Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), updated 2026-09-29). Universal SSL covers only the apex and first-level subdomains, so no DNS record is ever created by hand for `*.apps.musica-sanare.com` ([Universal SSL limitations](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/limitations/)).
  - Wrangler: `routes` entries take `custom_domain: true`; `workers_dev` defaults to `true` without `routes` and to **`false` with them**; `preview_urls` keeps an existing setting when omitted; the configuration file is the recommended source of truth ([Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/), updated 2026-10-29; [workers.dev](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/), updated 2026-09-22).
  - The documented Workers Builds token includes Workers Routes edit on all zones ([Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/), as recorded in Travel Discovery ADR-034).
  - 要確認: no Cloudflare page lists a fee for Workers Custom Domains, but none says they are free; whether a deployment without the `routes` entry detaches the domain; the exact build-log wording for the attached domain.

## Goal
Serve the production site on `recipe-discovery.apps.musica-sanare.com` as a Workers Custom Domain declared in the production Wrangler config, keep the `workers.dev` URL working, and make the GitHub repository public, with every account, billing, and visibility step done by the owner and the docs pointing at the new URL. No calculation, ranking, content, UI, or stored-data change.

## Fixed constraints
- The hostname follows the hub's domain plan; the hub's registry is changed only by the owner's session in `musica-sanare-home`.
- The domain is attached only through `routes` with `custom_domain: true` in `platform/cloudflare/wrangler.jsonc`. Nobody creates a DNS record for the hostname by hand.
- The domain change reaches production only through the owner's merge into `main`, and only after the owner has confirmed the Billing check of the first `*.apps.` Workers Custom Domain (Travel Discovery) the day after it was attached. Claude never opens Billing, plan, payment, or registrar pages (shared `paid-services.md`).
- Claude never changes Cloudflare or GitHub settings, DNS records, or repository visibility, and never pushes, branches, or merges (shared `deployment.md`, `github-workflow.md`, `git.md`). Claude prepares owner steps with the expected result and the checks afterwards.
- A local `node platform/cloudflare/deploy.ts --dry-run` downloads Wrangler and needs the owner's approval.
- The CSP, security headers, and cache rules stay as they are; no analytics, cookies, or new external service.
- Publication covers every ref that will be visible on GitHub, including `refs/pull/*`. A real secret is reported at once and treated as compromised; history is rewritten only on the owner's explicit instruction.

## Working rules
- Work in stages. Each stage starts with the intended changes and affected files, and ends with checks, a Japanese summary (changed files, decisions, commands and results, 要確認, next stage), and a commit proposal with the full message and file list written in the message itself. Commit only after the owner approves that specific commit; check the current branch before every commit.
- Verify current official documentation (Cloudflare Workers Custom Domains, `workers.dev`, Wrangler configuration; GitHub Docs for visibility, rulesets, Advanced Security, and Actions settings) before relying on it; record the source and the date checked in `docs/working/DECISIONS.md`; mark anything unverified as 要確認.
- Installing a tool (for example a newer gitleaks) needs the owner's approval with name, version, source, and license; it is never a project dependency.
- Every change to `docs/en/` updates `docs/ja/` and its source line (`git hash-object`) in the same commit; `README.md` and `README.ja.md` change together.
- 17.2 and 17.3 are independent: the publication preparation runs while the domain waits for the Billing check.

## Stages

### 17.1 Plan (owner review before any change)
Present the following as recommended, with what is still open, and wait for the owner's decisions:
1. **Hostname**: `recipe-discovery.apps.musica-sanare.com` (hub rule, full product name). The owner runs Phase A of `publish-app-on-domain.md` in `musica-sanare-home` to reserve it as `planned`; its hand-over is checked against this prompt.
2. **Config**: in `wrangler.jsonc`, `routes: [{ "pattern": "recipe-discovery.apps.musica-sanare.com", "custom_domain": true }]`, `"workers_dev": true` (old links and per-origin saved data keep working; without it the `routes` entry turns `workers.dev` off), and `"preview_urls": false` (Workers Builds has no non-production builds; as in Travel Discovery). Explain the trade-off of turning `workers.dev` off instead.
3. **Order**: the Billing check of Travel Discovery's custom domain first (要確認: whether it is already attached, since the hub registry still lists it as `planned`), then the merge that attaches this one; the publication in parallel or after, as the owner prefers.
4. **No app change**: re-check that nothing in the app or tests assumes the `workers.dev` hostname.
Record the decisions as an ADR (hostname, Custom Domain through the config, `workers_dev` kept, cost check), revising ADR-035 where it describes the URL.

### 17.2 Custom domain
1. Change `platform/cloudflare/wrangler.jsonc` and document the hostname in [DEPLOYMENT.md](../docs/en/DEPLOYMENT.md) (status, §3, a "Public hostname" section with the owner steps below, "Verify after a deploy" on both URLs) with its Japanese twin; the dry run after the owner's approval; propose the commit.
2. Owner steps, in Japanese in the conversation and in English in DEPLOYMENT:
   1. Phase A in `musica-sanare-home` is done (hostname `planned`).
   2. The Billing check of the first `*.apps.` custom domain passed the day after its attachment.
   3. In the zone's DNS records, no record exists for `recipe-discovery.apps.musica-sanare.com`.
   4. Push `dev`, wait for CI, merge `dev` into `main` (this deploys and attaches the domain).
   5. The next day, open Billing and confirm that no new charge appears. If one appears: revert the `routes` entry on `dev`, merge it the same way, remove the domain in **Domains & Routes** if it stays, and tell Claude.
   6. Phase B in `musica-sanare-home` (registry `live`, apps pages).
3. Checks after the owner reports the merge (Claude, read-only): the Workers Builds build succeeded (owner's report); `https://recipe-discovery.apps.musica-sanare.com/` loads with a valid certificate; the post-deployment checks of DEPLOYMENT §3 on the new hostname (status codes, security headers, cache rules, SPA fallback, no other origin, language switch); the same quick checks on `workers.dev`; **Domains & Routes** lists the custom domain with `workers.dev` enabled (owner's report).
4. Docs for the new URL: `README.md` and `README.ja.md` (the status line is stale: it still says Phase 10 and release 7), [RELEASE_READINESS.md](../docs/working/RELEASE_READINESS.md), [IMPLEMENTATION_PLAN.md](../docs/working/IMPLEMENTATION_PLAN.md), and DECISIONS. Older records keep the URL they used. This commit can ride with the release record.

### 17.3 Public release
1. Create `docs/working/PUBLIC_RELEASE.md` from the shared template, remove items that cannot apply with the reason, and link it from `docs/en/README.md` and `docs/ja/README.md` ("English only").
2. Scope: list `git ls-remote origin`; the owner decides which branches and tags are published; `refs/pull/*` commits are covered by the scan; the owner pushes the local commits to publish.
3. History: `gitleaks git --log-opts="--all" --redact .` on every ref to publish, plus `gitleaks dir --redact` on the tracked files and on `dist/`; the manual checks of the shared procedure (identities, AI co-author lines, every file ever committed, local paths, email addresses). Record tool, version, command, date, and result.
4. Content: re-confirm the owner's decisions of "Pre-publication check" (Worker version IDs, production URL, Claude-only files) and cover what was added since (the hostname, `prompts/09`–`17` including the references to the owner's other repositories, release records). List the GitHub-side data the owner reviews on GitHub: pull request #1 text and comments, issues, workflow run logs and artifacts, releases, wiki.
5. Presentation: `LICENSE` (ADR-031) against the dependencies' licenses; README status and quick start in both languages; `SECURITY.md` (private vulnerability reporting) or not, and `CONTRIBUTING.md` or not, by the owner's choice.
6. Final checks on the commit to publish: `npm ci`, `npm run check`, `npm run test:e2e`, `npm audit --omit=dev`, the secret scan again; CI green after the owner's push.
7. Owner steps: the visibility switch, then the GitHub settings right after it (private vulnerability reporting, push protection, Dependabot alerts, a ruleset on `main` without force push or deletion and with the CI check required, Actions restricted to the used actions with a read-only `GITHUB_TOKEN` and approval for outside pull requests, unused features off), with setting names checked against GitHub Docs and the date. A ruleset on `main` must not block the owner's merge or Workers Builds.
8. After the owner reports the switch: a signed-out check of the visible refs and files, an HTTPS clone and the README quick start from a clean directory, and the owner's report of secret scanning alerts; record everything in the checklist and DECISIONS.

### 17.4 Release and acceptance record
The `wrangler.jsonc` change ships as release 14, following [RELEASE_READINESS.md](../docs/working/RELEASE_READINESS.md) as for release 13 (`npm ci`, `npm run check`, `npm run test:e2e`, `npm audit`, the secret scan; timing only if something besides the config changed). Record the release, "Phase 17 acceptance" in DECISIONS, the status in IMPLEMENTATION_PLAN, and the README status.

## Out of scope
- New features, recipes, or foods; engine, UI, or content changes.
- The Phase 16 open items: the es and fr review of `detail.missingFoods`, the dynamic-import retry in Firefox, and UI_DESIGN §3.4's unbuilt sticky column.
- Edits to `musica-sanare-home` or `travel-discovery-app`; the hub's registry and apps pages are the owner's session there.
- Disabling `workers.dev`, redirects between the two hostnames, email on the domain, analytics, a host change, any paid plan or add-on, and any Cloudflare change beyond the owner's steps above.
- Moving existing `localStorage` data between origins.

## Acceptance
- The ADR of 17.1 is recorded; the production site answers on `recipe-discovery.apps.musica-sanare.com` over HTTPS with the same headers, cache rules, and behavior as on `workers.dev`, which still works; the owner reported no new charge the day after.
- DEPLOYMENT, README, RELEASE_READINESS, IMPLEMENTATION_PLAN, and DECISIONS name the new URL; every changed English stable doc has an up-to-date Japanese twin with its source hash.
- `docs/working/PUBLIC_RELEASE.md` has every item done, deferred with a reason, or not applicable; the secret scan covers every published ref including `refs/pull/*`, with tool, command, and result recorded; every finding and every identifier or internal note has an owner decision.
- The owner has switched the visibility and applied the GitHub settings, or has deferred the switch with a reason; the signed-out check and the clean clone passed.
- `npm run check`, `npm run test:e2e`, and CI pass on the final commit; nothing was deployed except by the owner's merge into `main`.
