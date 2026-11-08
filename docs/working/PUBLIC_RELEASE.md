[Docs index](../en/README.md)

# Public release checklist

The repository was made public by the owner on 2026-11-03. Every item below covers all refs that will be visible on GitHub, not only the current tree. The procedure behind each item is the shared `claude-shared-rules` doc `docs/en/PUBLIC_RELEASE.md`; this list is Stage 17.3 of Phase 17 (`prompts/17-custom-domain-and-publication.md`). Details of each check are in [DECISIONS.md](DECISIONS.md) "Stage 17.3 public-release check".

## 1. Scope

- [x] `git ls-remote origin` listed (2026-11-03): `refs/heads/main` (`4768cad`), `refs/heads/dev` (`84c2e41`), `refs/pull/1/head` (`75f58c9`); no tags. The owner decided to publish `main` and `dev` (2026-11-03). No ref needs deleting.
- [x] `refs/pull/*` reviewed: `75f58c9` is contained in `dev`, so the scan below covers it.
- [x] Local branches to publish are pushed: the owner pushed `dev` (`1cecbda`, 2026-11-03); `main` is `4768cad`.

## 2. History

- [x] Secret scan over all history (2026-11-03 01:41 UTC): gitleaks 8.30.1 (Homebrew, MIT; the latest GitHub release, 2026-03-21), default rules, no `.gitleaks.toml` or `.gitleaksignore`. `gitleaks git --log-opts="--all" --redact .`: 191 commits, 5.05 MB, no leaks. `gitleaks dir --redact` on `git archive HEAD` (3.82 MB) and on `dist/` (1.78 MB): no leaks.
- [x] Every finding reviewed and resolved: none.
- [x] Commit identities: 199 commits by `musica-sanare` with the GitHub `noreply` address; the merge of pull request #1 (`42f7d77`) has the author name `MusicaSanare` with the same `noreply` address and the committer `GitHub <noreply@github.com>`.
- [x] No AI co-author lines (none in any commit message).
- [x] No `.env*`, local settings, build output, or logs ever committed: the only `.env*` path is the removed `.env.example` with placeholders; no `dist/`, test output, images, `*.xlsx`, or `*.pdf` in any commit.
- [x] No local absolute paths, personal email addresses, or other personal data: paths appear only elided (`/Users/…/`); the only email addresses are the owner's `noreply` address and the public MEXT contact in [DATA_SOURCES.md](../en/DATA_SOURCES.md).

## 3. Content

- [x] Identifiers, kept by owner decision (2026-10-25, re-confirmed 2026-11-03): nine Cloudflare Worker version IDs in DECISIONS, RELEASE_READINESS, and `prompts/06`–`10`, `12`, `13` (not secrets, unusable without account access); the hostnames `recipe-discovery.musica-sanare.workers.dev` and `recipe-discovery.apps.musica-sanare.com`. The Cloudflare account name and ID appear only as placeholders.
- [x] References to the owner's other repositories (`claude-shared-rules`, `musica-sanare-home`, `travel-discovery-app` with `~/repos/...` paths in `prompts/11`, `prompts/17`, DECISIONS, and IMPLEMENTATION_PLAN): kept by owner decision (2026-11-03). They hold no secrets.
- [x] Third-party material and licenses: the MEXT-derived subset in `data/composition/` with attribution ([DATA_SOURCES.md](../en/DATA_SOURCES.md)); no images, fonts, or copied recipe text; dependency licenses checked by `npm run check:licenses` in every `npm run check`.
- [x] Internal notes: `CLAUDE.md`, `prompts/`, and `.claude/launch.json` stay public (owner, 2026-10-25, re-confirmed 2026-11-03); they hold instructions and plans, not conversation logs.
- [x] GitHub-side data reviewed by the owner (2026-11-03, no problem): pull request #1 text and comments, issues, CI run logs and failure artifacts (`playwright-report/` and `test-results/`, kept 7 days), releases, wiki.

## 4. Presentation

- [x] `LICENSE`: MIT (ADR-031), except the MEXT-derived data; dependency licenses checked by `npm run check:licenses`.
- [x] README status and quick start accurate (English and Japanese): status updated to release 13 (2026-11-03) and to release 14 with the custom domain (2026-11-03); the quick start needs no private resource.
- [x] `SECURITY.md`: added (2026-11-03), pointing to private vulnerability reporting.
- [x] `CONTRIBUTING.md` and templates: not wanted (owner, 2026-11-03).

## 5. Final checks

- [x] Tests, lint, and build pass on the commit to publish (`1cecbda`, 2026-11-03 05:35–05:38 UTC): `npm ci`, `npm run check` (64 test files with 1,023 tests, content validation, production build), `npm run test:e2e` (194 passed, 1 skipped by design); CI green after the owner's push (owner's report).
- [x] Dependency audit clean for production dependencies: `npm audit --omit=dev` found 0 vulnerabilities (2026-11-03).
- [x] Secret scan repeated on the final commit: `gitleaks git --log-opts="--all" --redact .` on `1cecbda`, 192 commits, 5.06 MB, no leaks (2026-11-03 05:35 UTC). Repeated after the switch on `cf4ef7e` (release 14, the custom domain): 195 commits, 5.08 MB, no leaks (2026-11-03 09:46 UTC).

## 6. Switch (owner)

- [x] Visibility changed to public on 2026-11-03 (owner); confirmed without credentials through the GitHub API (`"visibility": "public"`).

## 7. GitHub settings right after (owner)

- [x] Private vulnerability reporting. Enabled by the owner (2026-11-03).
- [x] Secret scanning push protection. Enabled by the owner (2026-11-03).
- [x] Dependabot alerts (npm dependencies). Enabled by the owner (2026-11-03).
- [x] Ruleset on `main` (owner, 2026-11-03): **Restrict deletions** and **Block force pushes**, enforcement **Active**, empty bypass list. **Require status checks to pass** is left out: the owner's local merge creates a new merge commit without checks, so a required check would reject that push (要確認), and CI on `dev` already gates every release (ADR-035). A ruleset does not stop Workers Builds.
- [x] Actions (owner, 2026-11-03): allow only the actions the workflow uses (`actions/checkout`, `actions/setup-node`, `actions/upload-artifact`), keep the default `GITHUB_TOKEN` read-only, and require approval for workflow runs from outside contributors' pull requests (`ci.yml` runs on every `pull_request`).
- [x] Unused features turned off: the GitHub API reports Issues, Projects, Wiki, and Discussions disabled (2026-11-03).
- [x] Setting names checked against GitHub Docs on 2026-11-03 (private vulnerability reporting, push protection, rulesets, Actions settings). Dependabot alerts and the exact rule labels of rulesets were not on the pages read (要確認 on screen).

## 8. Verification

- [x] Signed out (GitHub API without credentials, 2026-11-03): branches `main` and `dev` only, no tags, no releases, pull request #1 closed, license MIT.
- [x] HTTPS clone without credentials into an empty directory (2026-11-03): `npm ci` and `npm run check` (1,023 tests, production build) pass.
- [x] No secret scanning alerts (owner's report, 2026-11-03).
- [x] README status updated (release 13, 2026-11-03; release 14 with the custom domain, 2026-11-03).
