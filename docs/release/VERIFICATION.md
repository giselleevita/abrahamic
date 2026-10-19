# Release verification — 19 October 2026

Premium baseline: `645c6bb` (preserved before release-readiness implementation). Local verification used PostgreSQL 16, Node 24 and production Next.js builds. This is project verification, not human usability feedback or independent theological approval.

| Check | Result |
| --- | --- |
| Unit/integration suite | 359 tests passed across 41 files. Includes real PostgreSQL search policy/filter/reference checks and concurrent quota/rollover/expiry checks. |
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

**Hosted preview verification is blocked:** this workspace has no configured Neon/Vercel API credentials or CLI authentication and no dedicated hosted preview database. The deployment guard requires `PREVIEW_DATABASE_URL`, `PREVIEW_DIRECT_URL`, and `PREVIEW_DATABASE_ISOLATED=true` before any preview migration/seed. Provision a fresh empty isolated database, configure its scoped credentials and preview auth/quota secrets, then verify the hosted discovery → comparison → exact source → save flow and inbox. Do not reuse production database credentials or copy production reports into a public preview. No production migrations or seeding were run for this work.

CI and preview status links will be recorded in the PR after the remote checks run. CI evidence is distinct from local evidence above; a blocked Vercel preview must not be presented as a successful hosted test.
