# Changelog

## 0.9.1 - 2026-09-03

- Added mandatory, database-enforced license and attribution metadata to every corpus source.
- Made the idempotent seed repair licensing metadata and added a DB-backed CI invariant test.

## 0.9.0 — 2026-09-03

- Reconciled Next.js, Prisma, authentication, validation, and transitive security dependencies.
- Standardized on Node.js 24 for local, CI, and deployment builds.
- Added an explicit engineering-case-study and editorial-integrity boundary.

All notable changes to this project are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2026-08-31

First tagged release. The app itself predates this tag; this marks the point where the repo's engineering hygiene (license, tests, CI, security/contribution policy) caught up to the live product.

### Added
- MIT `LICENSE` for the project's source code.
- Vitest test suite covering the public-demo translation policy, `slugify`, `claimHash`, and the new AI-search rate limiter; `npm test` wired into CI.
- Rate limiting and request caps on the unauthenticated `/api/ai/search` endpoint (10 req/min per IP, 200-char query cap, 500-candidate cap) to bound cost and abuse on an endpoint that calls the Anthropic API.
- `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, PR template, and issue templates (bug report, content-accuracy, feature request).
- Architecture diagram and screenshots pointer in the README.

### Fixed
- `slugify()` failed to strip curly apostrophes (`'`, U+2019) — only the straight apostrophe was matched (duplicated by a typo in the regex), so names like "Ishmael's Covenant" pasted with a curly quote produced a stray hyphen in the slug (`ishmael-s-covenant` instead of `ishmaels-covenant`).

### Removed
- Leftover `/test-route` debug page from production.

### Changed
- README license section updated to reference the new MIT `LICENSE` (previously stated the code was proprietary, which predates this release and was inconsistent with adding an OSI license).

---

Earlier history (redesigned navigation, Prisma 7 migration, public-demo translation policy, dependency upgrades) predates this changelog — see `git log`.
