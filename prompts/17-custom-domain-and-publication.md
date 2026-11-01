# Prompt 17 — Phase 17: Custom domain and repository publication

You are the lead engineer for Recipe Discovery. Read `CLAUDE.md` and every document under `docs/en/` and `docs/working/` before making changes. Phase 0 to Phase 16 results are in `docs/working/DECISIONS.md` (in particular ADR-001, ADR-015, ADR-031, ADR-035, ADR-036; "History rewrite"; "Pre-publication check"; "Next phases after Phase 15"; "Release 13 and thirteenth production deployment"; "Phase 16 acceptance"; "Open questions"). The public release follows the shared procedure `~/repos/claude-shared-rules/docs/en/PUBLIC_RELEASE.md`, its checklist template `~/repos/claude-shared-rules/templates/PUBLIC_RELEASE.md`, and its preparation prompt `~/repos/claude-shared-rules/prompts/prepare-public-release.md`. Communicate with the owner in Japanese; write repository files in English.

## Starting point
- Branch `dev`; release 13 (Phase 16) was deployed on 2026-11-01 by Workers Builds from `84c2e41`, merged into `main` as `4768cad`; `4a265dd` (release 12) is the rollback target. `7490452` (release 13 record, documentation only) is on `dev` and not pushed. The owner pushes, merges `dev` into `main` by hand, and a merge into `main` deploys ([DEPLOYMENT.md](../docs/en/DEPLOYMENT.md) §3). Claude never deploys and never runs Wrangler with a login.
- Production URL: https://recipe-discovery.musica-sanare.workers.dev. The Worker `recipe-discovery` is assets-only; `platform/cloudflare/wrangler.jsonc` has `name`, `compatibility_date`, and `assets`, and no `routes` or `workers_dev`. The account stays on Workers Free.
- Every URL inside the app is relative and the CSP uses `'self'`, so no code change is expected for a new hostname. `localStorage` is per origin: the locale preference and the opt-in saved conditions (ADR-036) on `workers.dev` do not carry over to a new hostname.
- GitHub refs on 2026-11-01 (`git ls-remote origin`): `refs/heads/main` (`4768cad`), `refs/heads/dev` (`84c2e41`), `refs/pull/1/head` (`75f58c9`, contained in `dev`). No tags. One workflow (`.github/workflows/ci.yml`). The open item of "Pre-publication check" (`main` held only the initial commit) is resolved: `main` holds the released history.
- Cloudflare facts checked on 2026-11-01 (re-check at the start of the phase):
  - Custom Domains on Workers need an active Cloudflare zone for the domain; apex and subdomains are supported; Cloudflare creates the DNS record and an Advanced Certificate automatically; a hostname with an existing CNAME record cannot be used ([Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), updated 2026-09-29).
  - A CNAME (partial) zone setup is Business and Enterprise only, so on the free plans the domain's nameservers move to Cloudflare (full setup) ([Partial setup](https://developers.cloudflare.com/dns/zone-setups/partial-setup/)).
  - Wrangler: `routes` entries take `custom_domain: true`; `workers_dev` defaults to `true` without `routes` and to `false` with them; a `workers.dev` route disabled only in the dashboard is re-enabled by the next Wrangler deploy; the configuration file is the recommended source of truth ([Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/), updated 2026-10-29; [workers.dev](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/), updated 2026-09-22).
  - 要確認: whether a zone on the Cloudflare Free plan stays free with no payment method; what a deploy without `routes` does to a Custom Domain added in the dashboard; whether the Workers Builds API token may create Custom Domains and DNS records; how long certificate issuance takes.

## Goal
Serve the production site on a custom domain the owner controls and make the GitHub repository public, with every step that costs money, changes an account, or changes visibility done by the owner, and with the docs pointing at the new URL. No calculation, ranking, content, UI, or stored-data change.

## Fixed constraints
- Registering, transferring, or renewing a domain, adding a zone, and every plan or billing setting are the owner's decisions and actions (shared `paid-services.md`). Claude never opens registrar, billing, plan, or payment pages, never proposes a paid service, and never recommends a registrar.
- Claude never changes Cloudflare or GitHub settings, DNS records, or repository visibility, and never pushes, branches, or merges (shared `deployment.md`, `github-workflow.md`, `git.md`). Claude prepares owner steps with the expected result and the checks afterwards.
- A change to `platform/cloudflare/wrangler.jsonc` deploys only through the owner's merge into `main`. A local `node platform/cloudflare/deploy.ts --dry-run` downloads Wrangler and needs the owner's approval.
- The CSP, security headers, and cache rules stay as they are; no analytics, cookies, or new external service.
- Publication covers every ref that will be visible on GitHub, including `refs/pull/*`. A real secret is reported at once and treated as compromised; history is rewritten only on the owner's explicit instruction.

## Working rules
- Work in stages. Each stage starts with the intended changes and affected files, and ends with checks, a Japanese summary (changed files, decisions, commands and results, 要確認, next stage), and a commit proposal with the full message and file list written in the message itself. Commit only after the owner approves that specific commit; check the current branch before every commit.
- Verify current official documentation (Cloudflare Workers Custom Domains, `workers.dev`, Wrangler configuration; GitHub Docs for visibility, rulesets, Advanced Security, and Actions settings) before relying on it; record the source and the date checked in `docs/working/DECISIONS.md`; mark anything unverified as 要確認.
- Installing a tool (for example a newer gitleaks) needs the owner's approval with name, version, source, and license; it is never a project dependency.
- Every change to `docs/en/` updates `docs/ja/` and its source line (`git hash-object`) in the same commit; `README.md` and `README.ja.md` change together.

## Stages

### 17.1 Plan (owner review before any change)
Propose options with trade-offs and a recommendation, and wait for the owner's decisions:
1. **Domain**: which domain the owner provides and whether it is already registered (要確認). If it is not, the owner chooses and buys it; Claude only lists what the setup needs (nameservers changeable to Cloudflare; no CNAME on the chosen hostname).
2. **Hostname**: apex or a subdomain, and whether `www` redirects.
3. **Where the domain is declared**: in `wrangler.jsonc` (`routes` with `custom_domain: true` and an explicit `workers_dev`) versus only in the dashboard.
4. **`workers.dev`**: keep it reachable or disable it, given old links and the per-origin `localStorage`.
5. **Order**: custom domain before or after the publication, and which parts can run in parallel.
Record the decisions in `docs/working/DECISIONS.md` ("Stage 17.1 decisions") and an ADR if the hosting setup changes (revising ADR-035 if needed).

### 17.2 Custom domain
1. Owner steps, written in Japanese in the conversation and in English in [DEPLOYMENT.md](../docs/en/DEPLOYMENT.md): add the zone and change the nameservers if needed, wait until the zone is active, and attach the domain as decided in 17.1.
2. If 17.1 chose the config: change `platform/cloudflare/wrangler.jsonc`, run the dry run after the owner's approval, and propose the commit; the owner's merge into `main` deploys it.
3. Checks after the owner reports the domain active: DNS resolution and HTTPS with a valid certificate on the new hostname; the post-deployment checks of DEPLOYMENT §3 on the new hostname (status codes, security headers, cache rules, SPA fallback, no other origin, language switch); `workers.dev` behaves as decided.
4. Docs for the new URL: [DEPLOYMENT.md](../docs/en/DEPLOYMENT.md) (status, §3 "Verify after a deploy", the domain setup), `README.md` and `README.ja.md` (the status line is stale: it still says Phase 10 and release 7), [RELEASE_READINESS.md](../docs/working/RELEASE_READINESS.md), [IMPLEMENTATION_PLAN.md](../docs/working/IMPLEMENTATION_PLAN.md), and DECISIONS; `docs/ja/DEPLOYMENT.md` with its source hash. Older records keep the URL they used.

### 17.3 Public release
1. Create `docs/working/PUBLIC_RELEASE.md` from the shared template, remove items that cannot apply with the reason, and link it from `docs/en/README.md` and `docs/ja/README.md` ("English only").
2. Scope: list `git ls-remote origin`; the owner decides which branches and tags are published; `refs/pull/*` commits are covered by the scan; the owner pushes the local commits to publish.
3. History: `gitleaks git --log-opts="--all" --redact .` on every ref to publish, plus `gitleaks dir --redact` on the tracked files and on `dist/`; the manual checks of the shared procedure (identities, AI co-author lines, every file ever committed, local paths, email addresses). Record tool, version, command, date, and result.
4. Content: re-confirm the owner's decisions of "Pre-publication check" (Worker version IDs, production URL, Claude-only files) and cover what was added since (the new domain, `prompts/09`–`17`, release records). List the GitHub-side data the owner reviews on GitHub: pull request #1 text and comments, issues, workflow run logs and artifacts, releases, wiki.
5. Presentation: `LICENSE` (ADR-031) against the dependencies' licenses; README status and quick start in both languages; `SECURITY.md` (private vulnerability reporting) or not, and `CONTRIBUTING.md` or not, by the owner's choice.
6. Final checks on the commit to publish: `npm ci`, `npm run check`, `npm run test:e2e`, `npm audit --omit=dev`, the secret scan again; CI green after the owner's push.
7. Owner steps: the visibility switch, then the GitHub settings right after it (private vulnerability reporting, push protection, Dependabot alerts, a ruleset on `main` without force push or deletion and with the CI check required, Actions restricted to the used actions with a read-only `GITHUB_TOKEN` and approval for outside pull requests, unused features off), with setting names checked against GitHub Docs and the date. A ruleset on `main` must not block the owner's merge or Workers Builds.
8. After the owner reports the switch: a signed-out check of the visible refs and files, an HTTPS clone and the README quick start from a clean directory, and the owner's report of secret scanning alerts; record everything in the checklist and DECISIONS.

### 17.4 Acceptance record
Record "Phase 17 acceptance" in DECISIONS, the status in IMPLEMENTATION_PLAN, and the README status. A release is needed only if 17.2 changed `wrangler.jsonc`; it follows [RELEASE_READINESS.md](../docs/working/RELEASE_READINESS.md) as for release 13.

## Out of scope
- New features, recipes, or foods; engine, UI, or content changes.
- The Phase 16 open items: the es and fr review of `detail.missingFoods`, the dynamic-import retry in Firefox, and UI_DESIGN §3.4's unbuilt sticky column.
- Email on the domain, analytics, a CDN or host change, a paid plan or add-on, and any change to the Cloudflare account beyond the owner's domain steps.
- Moving existing `localStorage` data between origins.

## Acceptance
- The owner's decisions of 17.1 are recorded; the production site answers on the custom domain over HTTPS with the same headers, cache rules, and behavior as on `workers.dev`, and `workers.dev` behaves as decided.
- DEPLOYMENT, README, RELEASE_READINESS, IMPLEMENTATION_PLAN, and DECISIONS name the new URL; every changed English stable doc has an up-to-date Japanese twin with its source hash.
- `docs/working/PUBLIC_RELEASE.md` has every item done, deferred with a reason, or not applicable; the secret scan covers every published ref including `refs/pull/*`, with tool, command, and result recorded; every finding and every identifier or internal note has an owner decision.
- The owner has switched the visibility and applied the GitHub settings, or has deferred the switch with a reason; the signed-out check and the clean clone passed.
- `npm run check`, `npm run test:e2e`, and CI pass on the final commit; nothing was deployed except by the owner's merge into `main`.
