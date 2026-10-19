# Public experience rollout

The public design uses parchment surfaces, navy actions, gold focus rings, and the established sapphire/garnet/amethyst tradition palette. Shared components own cards, introductions, citations, motion scenes, and saved-item actions. Existing landscape artwork retains project credit at `/licensing`.

## Release operations

See [release readiness](release/RELEASE_READINESS.md) for the current migration, configuration, preview-isolation and recovery procedure. The premium implementation is retained as the comparison baseline at commit `645c6bb`.

Do not backfill Shared ground or Key differences automatically. Editors author those fields after human review; the draft review packet is not published content.

## Device data and access

Reading preferences, motion preferences, and saved identifiers/links/labels use separate versioned localStorage keys. Saves store no scripture text and require no account. When persistence fails, reading preferences apply for the current visit; saved-item controls explicitly report failure. Existing journey and kids progress keys are unchanged. The kids area has no correction form or effects-preference storage.

`POST /api/corrections` accepts anonymous reports only for existing comparison/reader contexts. Reports have a category, 20–3,000-character description, optional reference, and New/In review/Resolved/Dismissed status. The public endpoint is write-only. Authenticated `/api/admin/corrections` endpoints list the most recent 100 reports per status and change status; reports never automatically modify published content. The honeypot, same-origin check, and PostgreSQL-backed five-per-ten-minute quota reduce spam across deployment instances. No contact details or personal replies are requested.

## Verification

Run the normal unit tests, lint, type check, production build, and Playwright suite against a migrated, seeded local database. Browser coverage includes desktop, 768px tablet, and 320px reduced-motion views; RTL scripture, blocked storage, citations, saving, reading preferences, keyboard entry, and motion preference persistence are covered.

The editorial-inbox browser check requires synthetic credentials in CI and fails configuration validation when they are missing. Local runs may supply matching application and test credentials. Never use production credentials.

Use existing page views and anonymous journey-completion totals after release. Saved items, reading preferences, correction descriptions, and search queries are not added to analytics events.

## Premium design follow-up

The discovery experience now uses a cinematic navy-and-gold hero, editorial typography, three published-comparison topic switches, keyboard-operable tradition tabs, a selectable journey preview, and an illustrated narrative-era explorer. Comparison detail pages also offer a tradition-focus control. Search & explore opens a native modal with Cmd/Ctrl K, restores focus when closed, and retains normal search URLs.

The interactive discovery panels load as they approach the viewport. Their server-rendered fallbacks retain real comparison, chapter, and timeline links if JavaScript or a module request is unavailable. A focused fallback link is not replaced while a keyboard reader is using it. Homepage-specific visual styles are separated from the shared search overlay. Existing reduced-motion settings apply to the added transitions.

See the current release evidence for test counts and transfer comparisons. Historical premium-versus-original transfer changes were +8.05% on `/`, +2.33% on the journey introduction, −1.61% on `/timeline`, and +0.98% on `/comparisons`, with zero measured layout shift. Release-readiness comparisons use the premium build itself as the new baseline.
