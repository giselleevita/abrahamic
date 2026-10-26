# Release verification — 19 October 2026

Premium baseline: `645c6bb` (preserved before release-readiness implementation). Local verification used PostgreSQL 16, Node 24 and production Next.js builds. This is project verification, not human usability feedback or independent theological approval.

| Check | Result |
| --- | --- |
| Unit/integration suite | 360 tests passed across 41 files. Includes real PostgreSQL search policy/filter/reference checks and concurrent quota/rollover/expiry checks. |
| Browser suite | 39 passed, zero skipped, across desktop, 768px tablet and 320px. Synthetic editorial inbox submission/resolution ran at all widths. |
| Type checking | Passed. |
| Lint | Passed with zero warnings. |
| Production build | Passed. |
| Repeated demo seed | Two passes succeeded without database errors. |
| Preview isolation guard | Passed missing-config, inherited-production-identity and mismatched-direct-URL checks. |
| Local dump/restore | Passed seeded content/count/constraint checks. See [recovery evidence](RECOVERY_EVIDENCE.json). Production backups were not accessed or verified. |
| Visual review | Inspected desktop and 320px search, family and glossary captures; complete discovery/comparison/reader/save flow exercised at all three widths. Keyboard navigation, RTL, blocked storage, system reduced motion and manual effects reduction covered. |

## Performance

See [encoded transfer measurements](PERFORMANCE_EVIDENCE.json): initial document, Next script and stylesheet bytes for the premium baseline versus this release on the same local corpus, at 1440×900. Artwork is excluded. All measured routes remain within 10% growth; measured layout shift is zero. These local measurements do not establish field performance under production traffic.

## Review and deployment state

The branch targets `main`; production publication is a separate decision. Human usability sessions and theological review have **not** been performed. Share the two review kits and record real findings separately. Draft Shared ground/Key differences wording is documentation only.

## Hosted preview isolation

An authenticated browser session allowed creation of a fresh **Free** Neon project, `abrahamic-release-preview` (`frosty-glitter-94868772`), in Frankfurt (`fra1`). Auth and Realtime are disabled. It is connected to this Vercel project's **Preview environment only**, using the `PREVIEW_` prefix. Existing production storage/connections were not changed. The integration supplies `PREVIEW_DATABASE_URL` and `PREVIEW_DATABASE_URL_UNPOOLED`; the latter is accepted as the direct-connection alias. The isolation marker and a stable random quota secret are saved only in Preview.

The initial unconfigured Vercel attempt failed before migrations with “An isolated preview database is required.” After configuration, the first isolated build applied all migrations to the new database and began the curated seed. No production data was copied and no production migrations or seeding were run.

## Hosted verification and remote evidence

The [first isolated deployment](https://vercel.com/giselleevitas-projects/abrahamic/9pMMqEjUnpcWu4PuNE2qNtAbzUHf) reached Ready after applying all migrations and completing the fresh demo seed. The [branch preview](https://abrahamic-git-codex-release-readiness-giselleevitas-projects.vercel.app) uses Vercel's existing deployment protection; open it while signed in to Vercel. No public-access bypass was introduced.

Verified in the hosted browser: homepage → Abraham's Covenant with God → supporting Genesis 17:7 citation → exact `#v-7` Hebrew passage; saved the comparison and passage; set 24px reading size; reloaded and confirmed the preference and save persisted; opened Saved and found both items. Submitted a clearly labelled synthetic correction successfully to this isolated database. Authenticated inbox resolution and anonymous read restrictions are verified by CI at all three widths; no independent human editorial approval is claimed.

[CI after the tablet correction](https://github.com/giselleevita/abrahamic/actions/runs/39256181116) passed 359 tests and 39 browser scenarios with zero skips. [Security checks](https://github.com/giselleevita/abrahamic/actions/runs/39256181156) also passed. The final reader comfort fix adds one regression test, bringing local unit/integration coverage to 360; the complete 39-scenario local suite passed again. Current checks and the final hosted smoke result are linked from [PR #60](https://github.com/giselleevita/abrahamic/pull/60).

Human review and production publication remain separate decisions.

## Source-checked follow-up

See [content corrections](CONTENT_CORRECTIONS.md) for corrected glossary wording, targeted legacy family-data migrations, reference-only destinations and public hold filtering. Regression coverage includes migration preservation of editor-authored notes, parent classification, withheld identities, idempotent reference creation and inspectable glossary citations. This follow-up does not replace the outstanding five-person sessions or theological review.

Follow-up local verification: **370 unit/integration tests and 42 browser scenarios passed**, zero skipped; types, zero-warning lint and production build passed. Disposable seeded restore passed with 100 verses, 156 translations, 22 migrations and 116 constraints. Eleven-route transfer comparison remains within the 10% budget; maximum measured growth 5.18%, with zero measured layout shift.

## 26 October 2026 release-experience follow-up

| Check | Result |
| --- | --- |
| Unit/integration suite | 702 passed across 74 files against disposable PostgreSQL. |
| Browser suite | 78 passed, zero skipped, across desktop, tablet and 320px, including the authenticated correction inbox. |
| Type checking and lint | Passed; lint had zero warnings. |
| Production build | Passed on Node 24 with the disposable seeded database. |
| Dependency audit | `npm audit` found zero vulnerabilities after compatible Zod and transitive patch updates. The high-severity threshold and reviewed dev-advisory policy passed. |
| Legacy and fresh database migrations | Both passed. The legacy rehearsal preserved the synthetic report, category, reference and status; the fresh database migrated cleanly. |
| Encrypted local restore | GPG AES256 dump/restore passed with matching rows, content fingerprints and 127 constraints. Only generated synthetic data was used. |
| Preview isolation | Both isolation guard tests passed. |
| Performance | [11-route encoded transfer comparison](PERFORMANCE_EVIDENCE.json), measured against pre-change `main` at `d0f1c63` on the same local seeded database. Maximum growth was 0.85%; measured layout shift peaked at 0.0031 and was identical in baseline and updated builds. |
| Visual inspection | Captured desktop and 320px homepage and comparison screens in `.impeccable/review/`; keyboard flow, Arabic right-to-left reading, device-storage failure, reduced motion, saved passages and report resolution passed in browser coverage. |

GitHub `main` now requires the `build`, `audit-and-container` and `codeql` checks, requires branches to be up to date, enforces protection for administrators and blocks force pushes and deletion. The backup workflow cannot run against production until repository secrets `BACKUP_DATABASE_URL` and `BACKUP_PASSPHRASE` are configured by the database owner. No production backup or restore was accessed or verified. Vercel's Production branch and manual-promotion settings still need confirmation in the Vercel project dashboard.

Hosted preview for PR #69 reached Ready at [the protected preview](https://abrahamic-git-codex-experience-re-549cc6-giselleevitas-projects.vercel.app), and its [Vercel deployment record](https://vercel.com/giselleevitas-projects/abrahamic/ERUbFfpG3ihMaBaZd2Svb8mnxCL3) is green. The guarded build ran only against the configured isolated Preview database and completed its migration/seed steps. Vercel access protection redirected this workspace's browser to sign-in, so the hosted page itself still needs a visual smoke review by an authenticated project member; local production-build screenshots and browser flows are included in this PR. The deployment was not made public and no protection bypass was introduced.

For this PR, [CI](https://github.com/giselleevita/abrahamic/actions/runs/40299735488) passed all 78 browser scenarios and the 702-test suite. [Security and container checks](https://github.com/giselleevita/abrahamic/actions/runs/40299735477) passed, as did CodeQL. GitHub `main` protection is verified with required `build`, `audit-and-container`, and `codeql` checks.

The production backup workflow remains gated on the database owner adding repository secrets `BACKUP_DATABASE_URL` and `BACKUP_PASSPHRASE`, then running the workflow and verifying an isolated production-backup restore. Human usability sessions and qualified Jewish, Christian and Muslim review remain outstanding. No production backup verification, theological sign-off or production publication is claimed.
