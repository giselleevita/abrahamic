# Go-live checklist

Tracks the work from "engineering demo" to an open, verified, multi-tradition product.
Everything here runs on free tiers (Vercel Hobby, Neon free, GitHub Actions). See the
plan phases in the PR descriptions. Tick items as they land.

## Content
- [x] Scripture corpus imported in production (60,540 verses; see `CI_STATUS.md`)
- [ ] `npm run import:verify` run against production and result recorded
- [ ] Qur'an English decision recorded on `/licensing` (Arabic only unless a clearly public-domain English text is chosen)
- [ ] Licence terms for AlQuran Cloud, Sefaria and eBible re-read; date recorded in `LICENSING.md`
- [ ] At least one Jewish, one Christian and one Muslim reviewer have read the published comparisons

## Security
- [x] Admin routes gated in `src/proxy.ts`, layout and every mutating route
- [ ] Login attempts throttled in the database (the in-memory limiter does not hold across serverless instances)
- [ ] Contributor accounts and roles (Phase 2)
- [ ] Dev-audit exception (`scripts/check-dev-audit.mjs`) reviewed before 2026-11-16
- [ ] Secrets rotated if ever shared (`NEXTAUTH_SECRET`, admin hash)

## Legal and privacy
- [x] Privacy policy, terms and about pages published and linked from the footer (live after deploy)
- [x] Report / takedown contact published (on /about)
- [ ] Child-safety statement on `/kids`
- [ ] Vercel Hobby is non-commercial only: no ads or paid features while on it

## Operations
- [x] Health check workflow (`.github/workflows/uptime.yml`)
- [ ] Backup workflow added (`docs/BACKUP_AND_RESTORE.md`): set the two secrets, run it once, practise a restore
- [ ] Optional: custom domain (about $10/year; not required)

## Collaboration
- [ ] Tri-tradition sign-off enforced in the database (Phase 3)
- [ ] Contribution flow, report button and contributor guide (Phase 4)
- [ ] One approved reviewer per tradition recruited (people, not code)
