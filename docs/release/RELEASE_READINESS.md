# Release readiness and recovery

This branch prepares a reviewable preview; it does not authorize a production release or claim completed human review. The premium baseline is commit `645c6bb`; unrelated local skill files are excluded from the release.

## Configuration and deployment order

Apply migrations through `20261026120000_reconcile_legacy_reports` before generating Prisma and building. It widens the page path without truncation and transfers old report references, descriptions, timestamps, categories, and statuses. Historical categories remain visible in the restricted editor inbox; `IN_REVIEW`/`RESOLVED` retain their meaning as `SEEN`/`ACTIONED`. Where the former schema did not record a handler, imported handled rows use the explicit `legacy-unrecorded` marker rather than inventing a reviewer.

Before migration deploy, `scripts/migrate-deploy.sh` checks for the pre-merge `correction_reports` shape. It renames that table, its colliding index/sequence, and resolves the failed report migration as rolled back only after preserving the table under its legacy name. The forward migration then creates the current table and copies the reports. If the repair is interrupted, rerun the deploy script; it recognizes the preserved table and resumes. Do not manually drop the legacy table or mark the migration applied. CI rehearses the repair against a disposable copy with a synthetic in-review report and separately migrates a fresh database.

Only correction submissions use the shared quota; other endpoint limits are unchanged. Existing URLs, published content, and device-local progress remain compatible.

Set `RATE_LIMIT_SECRET` to a stable, randomly generated value of at least 32 characters on every application instance. Store it in the deployment secret manager, never the repository. Rotating it resets keyed quota identities. Missing/short configuration, SQL errors or cleanup errors produce the existing retryable 503 response and accept no unprotected report. Ordinary validation and success responses are unchanged; a full bucket returns 429 and `Retry-After` in seconds.

The database uses its own clock and fixed UTC ten-minute windows. Each keyed HMAC-SHA256 digest/window pair has a single atomic upsert capped at five admissions. Only digest, window start and count persist. Request keys and raw addresses are not stored in this table. At each attempt, at most 100 rows older than ten minutes are deleted with locked rows skipped. Expired rows can remain while there is no traffic; they cannot consume a current quota. Reports themselves retain their existing private editorial lifecycle. Do not log request bodies or limiter keys while troubleshooting.

`vercel.json` runs `scripts/build-deployment.mjs` **before any migrations or seeding**. A Vercel preview must supply `PREVIEW_DATABASE_URL` (pooled runtime), `PREVIEW_DIRECT_URL` (direct migration connection, or the integration-provided `PREVIEW_DATABASE_URL_UNPOOLED`), and `PREVIEW_DATABASE_ISOLATED=true`. Pooled/direct identities must match, and must differ from inherited production connection identities. Runtime and Prisma config select only the dedicated preview connections. Missing isolation config blocks the build before writes. This guard is a configuration check, not an independent audit of account ownership: provision the database from a fresh empty Neon branch/database, inspect its destination, and supply credentials scoped to that database only.

Create an empty isolated database with the curated demo seed; do not branch production data into a public preview. Never use production credentials to satisfy this guard. Existing deployment seed initializes a fresh database; subsequent deployments update deployment-owned journeys. Configure synthetic editorial credentials and a preview-specific `NEXTAUTH_URL`/secret for testing. Keep preview authentication credentials out of the PR.

## Verification and CI

CI provisions disposable PostgreSQL, applies migrations, verifies the repeatable seed, and runs types, zero-warning lint, unit/integration checks, production build and Playwright at desktop, tablet and 320px. It creates one synthetic bcrypt credential shared with the build/server and inbox test. Missing credentials fail CI configuration rather than skipping the inbox. Failure traces/screenshots are retained as artifacts for 14 days. No production credentials are needed.

The `Database backup` workflow requires repository secrets named `BACKUP_DATABASE_URL` and `BACKUP_PASSPHRASE`. The first must be a direct connection to the intended production database; the second must be a strong backup-only passphrase stored in the repository secret manager. Values must not be posted in issues, PRs, or local logs. Without those secrets the scheduled/manual workflow intentionally fails before reading the database. An operator must add both secrets through GitHub Settings → Secrets and variables → Actions, run the workflow, confirm the encrypted artifact was created, and complete an isolated restore before claiming production backup coverage. The local drill below uses generated synthetic data and does not satisfy this production gate.

GitHub `main` is protected by the passing `build`, `audit-and-container`, and `codeql` checks; branches must be up to date, protection applies to administrators, and force pushes/deletion are blocked. This gates merges that trigger production deployment. In Vercel, an owner must confirm `main` is the Production Branch and restrict manual production promotion to maintainers. The Vercel control panel is not available in this workspace, so those project settings remain unverified.

Run `node scripts/check-experience-performance.mjs <premium-baseline-origin> <updated-origin>` against production builds on the same demo database. It measures encoded document/script/style bytes, excludes artwork, records layout shift, and fails above 10% growth. Review desktop/mobile screenshots and keyboard paths in addition to machine assertions. Baseline and measured evidence are recorded alongside this runbook.

## Disposable dump-and-restore drill

With the repo's local Postgres Docker service running, run `node scripts/verify-recovery.mjs`. It creates two uniquely named scratch databases, migrates and seeds one, adds synthetic correction/quota rows, encrypts a custom-format dump with GPG AES256 using a generated one-run passphrase, decrypts it into the isolated restore database, checks counts/content fingerprints/constraints, and deletes both databases and dump files. It cannot target the normal local or production database. Evidence is written to ignored `output/release/recovery.json`. Only curated synthetic data is used. This demonstrates **local encrypted recovery**, not verification of production backups.

## Production recovery procedure — operator checklist, not performed here

1. Authorize an incident window and identify the exact project, region, database, backup timestamp and intended recovery point. Check backup coverage and credentials through the production operator's normal process; do not copy secrets into issues.
2. Restore the selected backup to an isolated restricted database first. Match PostgreSQL versions/extensions; use direct connections for dump/restore, not a transaction pooler. Keep the application version compatible with the restored schema and record any missing transactions since the backup.
3. Verify migrations, critical row counts, source/reference relationships, publication/approval boundaries, licensed-content exclusions, correction privacy and constraints. Run smoke tests against that isolated restore. Backups containing private reports must remain restricted.
4. Obtain the separate production recovery decision. Freeze writes as appropriate, preserve the incident database, switch scoped runtime/direct credentials to the verified restore, and deploy the compatible application. Recheck auth, reading/citations, corrections and monitoring before reopening writes.
5. Retain a rollback destination and document measured recovery time and actual data loss. Do not claim a production recovery point objective or successful backup verification based on the local drill.

On quota failure, restore database connectivity/configuration and retry; never bypass the quota to reopen submissions. The additive table can be recreated from its migration if it alone is lost, with the explicit consequence that active quotas restart. Restore correction reports through the normal restricted backup process, not by reconstructing them from logs.

## Human review handoff

Share [the usability kit](USABILITY_KIT.md) with a facilitator and [the editorial packet](EDITORIAL_PACKET.md) with qualified reviewers. Neither contains fabricated feedback or sign-off. The optional theological field drafts remain documentation only. Production publication is a separate decision after preview review.
