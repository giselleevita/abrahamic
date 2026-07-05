# Abrahamic — Reviewer Guide

**Private repository — public demo available.** Use the live site for a quick product read; use this guide for a 15-minute engineering review.

**Live demo:** [abrahamic.vercel.app](https://abrahamic.vercel.app)  
**Content policy:** [/licensing](https://abrahamic.vercel.app/licensing)

## What problem it demonstrates

Abrahamic is a **cross-tradition scripture comparison platform** — side-by-side reading, thematic alignment, editorial claims, and admin workflows over a structured PostgreSQL/Prisma data model. The public demo is deliberately **license-free**: original Hebrew/Arabic text plus project-authored reader notes, not publisher translations.

## Architecture (60 seconds)

- **App:** Next.js 16 App Router (`src/app/`) — browse, search, comparisons, timeline, figures, themes
- **Data:** Prisma + PostgreSQL (`prisma/`) — sources, verses, translations, claims, comparisons
- **Admin:** NextAuth-gated editorial flows under `src/app/admin/`
- **Public demo policy:** `src/lib/public-demo-policy.ts` + `src/lib/filter-public-translations.ts` enforce allowed translation names at seed and API layers
- **Deploy:** Vercel with runtime DB URL mapping (`src/lib/prisma-env.ts`); migrations via `scripts/migrate-deploy.sh`; seed via `npx prisma db seed` (Prisma 7)

See [`docs/LICENSING.md`](LICENSING.md) for the conservative content posture.

## Fastest review path (no clone)

| Step | URL / file | What to verify |
|------|------------|----------------|
| 1 | [Genesis 1](https://abrahamic.vercel.app/sources/torah/read?book=Genesis&chapter=1) | Hebrew (MT) + Reader note only |
| 2 | [/licensing](https://abrahamic.vercel.app/licensing) | No licensed English translations served |
| 3 | [/comparisons](https://abrahamic.vercel.app/comparisons) | Cross-tradition editorial comparisons |
| 4 | [/themes](https://abrahamic.vercel.app/themes) | Thematic browse and alignment |

## Local setup (optional)

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
# http://localhost:3000
```

Set `DATABASE_URL` in `.env`. Seed uses `buildPublicDemoTranslations()` — same license-free content as production.

## 15-minute code review checklist

| Step | Where to look | What to verify |
|------|---------------|----------------|
| 1 | `README.md` | Stack, deployment, licensing summary |
| 2 | `prisma/schema.prisma` | Domain model (sources, verses, claims, comparisons) |
| 3 | `src/lib/public-demo-policy.ts` | Allowed translation names and reader-note generation |
| 4 | `prisma/seed/verses.ts` | Seed strips removed translations (JPS, KJV, ESV, etc.) |
| 5 | `src/app/api/sources/[sourceKey]/verses/route.ts` | API filters public translations |
| 6 | `src/app/admin/` | Editorial CRUD boundaries |
| 7 | `.github/workflows/ci.yml` | Migrations, TypeScript, ESLint, build |

**Tests to skim:** `npm run lint` and CI workflow (GitHub Actions may be blocked by billing; Vercel deploys independently).

## What this is / is not

- **Is:** Full-stack comparison platform with editorial workflows, structured scripture storage, and a conservative public-demo content policy
- **Is not:** A licensed scripture publisher product, or legal advice on translation rights

## Request access

Contact via GitHub profile or portfolio site. Reviewers typically receive read access to the private repo plus this guide; the public demo needs no credentials.
