# Public experience rollout

The public design uses parchment surfaces, navy actions, gold focus rings, and the established sapphire/garnet/amethyst tradition palette. Shared components own cards, introductions, citations, motion scenes, and saved-item actions. Existing landscape artwork retains project credit at `/licensing`.

## Release order

1. Apply checked-in migrations with the existing direct database connection workflow. `20261016150000_immersive_experience` adds nullable comparison fields and the private correction table; existing published comparisons remain valid without the new fields.
2. Generate Prisma and deploy the application with the normal build pipeline. The current Vercel deployment already applies migrations before building.
3. Smoke-test a published comparison, a source-reader citation, `/saved`, and correction submission. Verify an authenticated editor can resolve the report at `/admin/corrections`.

Do not backfill Shared ground or Key differences automatically. Editors author those fields in the existing comparison form. Update timestamps are labelled “Last updated,” not represented as independent review dates.

## Device data and access

Reading preferences, motion preferences, and saved identifiers/links/labels use separate versioned localStorage keys. Saves store no scripture text and require no account. When persistence fails, reading preferences apply for the current visit; saved-item controls explicitly report failure. Existing journey and kids progress keys are unchanged. The kids area has no correction form or effects-preference storage.

`POST /api/corrections` accepts anonymous reports only for existing comparison/reader contexts. Reports have a category, 20–3,000-character description, optional reference, and New/In review/Resolved/Dismissed status. The public endpoint is write-only. Authenticated `/api/admin/corrections` endpoints list the most recent 100 reports per status and change status; reports never automatically modify published content. The honeypot, same-origin check, and existing five-per-ten-minute process-local rate limit reduce spam; that limit is not shared between deployment instances. No contact details or personal replies are requested.

## Verification

Run the normal unit tests, lint, type check, production build, and Playwright suite against a migrated, seeded local database. Browser coverage includes desktop, 768px tablet, and 320px reduced-motion views; RTL scripture, blocked storage, citations, saving, reading preferences, keyboard entry, and motion preference persistence are covered.

For the optional end-to-end editorial inbox check, start a local server with synthetic editorial credentials and provide matching `E2E_ADMIN_EMAIL` and `E2E_ADMIN_PASSWORD` to Playwright. Never use production credentials. Next's dotenv expansion requires dollar signs in an injected bcrypt hash to be escaped when a matching variable is present in `.env`.

Use existing page views and anonymous journey-completion totals after release. Saved items, reading preferences, correction descriptions, and search queries are not added to analytics events.

## Measured release check

Compared production builds of the original checkout and this implementation against the same local corpus at 1440×900. Initial document, script, and stylesheet encoded transfer grew by 5.37% on `/`, 3.52% on the Abraham journey introduction, 3.15% on `/timeline`, and 3.94% on `/comparisons`. All four remained below 10%; measured cumulative layout shift was zero. Artwork transfer is excluded. These local results are not a substitute for production field measurements.

Repeat with `node scripts/check-experience-performance.mjs <baseline-origin> <updated-origin>`. It exits unsuccessfully when a measured route exceeds the transfer budget. Review screenshots under the ignored `output/playwright/` directory after the browser suite.

## Premium design follow-up

The discovery experience now uses a cinematic navy-and-gold hero, editorial typography, three published-comparison topic switches, keyboard-operable tradition tabs, a selectable journey preview, and an illustrated narrative-era explorer. Comparison detail pages also offer a tradition-focus control. Search & explore opens a native modal with Cmd/Ctrl K, restores focus when closed, and retains normal search URLs.

The interactive discovery panels load as they approach the viewport. Their server-rendered fallbacks retain real comparison, chapter, and timeline links if JavaScript or a module request is unavailable. A focused fallback link is not replaced while a keyboard reader is using it. Homepage-specific visual styles are separated from the shared search overlay. Existing reduced-motion settings apply to the added transitions.

The follow-up is covered by 345 unit/integration tests and 30 browser scenarios, including the complete original journey and editorial-inbox flows at all three viewports. The design remains local until the normal deployment workflow is run.

Final premium-build measurements supersede the earlier release-check figures: initial document/script/style transfer is +8.05% on `/`, +2.33% on the journey introduction, −1.61% on `/timeline`, and +0.98% on `/comparisons`, compared with the same original production build and corpus. All are within the 10% budget, with zero measured layout shift. Navigation and home breadcrumbs no longer speculatively preload entire discovery destinations; links still navigate normally. Existing page-level caching remains unchanged.
