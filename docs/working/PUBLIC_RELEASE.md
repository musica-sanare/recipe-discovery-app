[Docs index](../en/README.md)

# Public release checklist

The repository is private. Making it public is the owner's decision and action. Every item below covers all refs that will be visible on GitHub, not only the current tree. The procedure behind each item is the shared `claude-shared-rules` doc `docs/en/PUBLIC_RELEASE.md`; this list is Stage 17.3 of Phase 17 (`prompts/17-custom-domain-and-publication.md`). Details of each check are in [DECISIONS.md](DECISIONS.md) "Stage 17.3 public-release check".

## 1. Scope

- [x] `git ls-remote origin` listed (2026-11-03): `refs/heads/main` (`4768cad`), `refs/heads/dev` (`84c2e41`), `refs/pull/1/head` (`75f58c9`); no tags. The owner decided to publish `main` and `dev` (2026-11-03). No ref needs deleting.
- [x] `refs/pull/*` reviewed: `75f58c9` is contained in `dev`, so the scan below covers it.
- [ ] Local branches to publish are pushed: `dev` is ahead of `origin/dev` by the Phase 17 documentation commits (owner push; a push to `dev` does not deploy).

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
- [ ] GitHub-side data reviewed by the owner: pull request #1 text and comments, issues, CI run logs and failure artifacts (`playwright-report/` and `test-results/`, kept 7 days), releases, wiki. Claude cannot see them (no GitHub CLI on this machine).

## 4. Presentation

- [x] `LICENSE`: MIT (ADR-031), except the MEXT-derived data; dependency licenses checked by `npm run check:licenses`.
- [x] README status and quick start accurate (English and Japanese): status updated to release 13 (2026-11-03); the quick start needs no private resource. The URL changes again with the custom domain (Stage 17.2).
- [x] `SECURITY.md`: added (2026-11-03), pointing to private vulnerability reporting.
- [x] `CONTRIBUTING.md` and templates: not wanted (owner, 2026-11-03).

## 5. Final checks

- [ ] Tests, lint, and build pass on the commit to publish; CI green after the owner's push.
- [ ] Dependency audit clean for production dependencies (`npm audit --omit=dev`).
- [ ] Secret scan repeated on the final commit.

## 6. Switch (owner)

- [ ] Visibility changed to public on: date.

## 7. GitHub settings right after (owner)

- [ ] Private vulnerability reporting.
- [ ] Secret scanning push protection.
- [ ] Dependabot alerts (npm dependencies).
- [ ] Ruleset on `main`: no force push, no deletion, the CI checks required; it must not block the owner's merge or Workers Builds.
- [ ] Actions: allow only the actions the workflow uses (`actions/checkout`, `actions/setup-node`, `actions/upload-artifact`), keep the default `GITHUB_TOKEN` read-only, and require approval for workflow runs from outside contributors' pull requests (`ci.yml` runs on every `pull_request`).
- [ ] Unused features (Wiki, Projects, Discussions, Issues) turned off unless the owner wants them.
- [ ] Setting names checked against GitHub Docs on: date.

## 8. Verification

- [ ] Signed-out browser shows only `main`, `dev`, and the intended files.
- [ ] README quick start works from a clean directory after an HTTPS clone without credentials.
- [ ] No secret scanning alerts (owner's report).
- [ ] README status updated.
