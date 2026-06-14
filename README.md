# Abrahamic Scripture Comparison

[![CI](https://github.com/giselleevita/abrahamic/actions/workflows/ci.yml/badge.svg)](https://github.com/giselleevita/abrahamic/actions/workflows/ci.yml)

**Live (Vercel):** https://abrahamic.vercel.app

A web application for side-by-side comparison of texts across the Abrahamic scriptures — Torah, Bible, and Quran — with thematic search, verse alignment, and commentary layers.

## What It Does

- Browse and search across Torah, Bible, and Quran in parallel
- Thematic and keyword-based verse alignment across traditions
- Clean reading interface with side-by-side scripture views
- Prisma-backed data layer for structured scripture storage

## Status

> **Public engineering demo** at https://abrahamic.vercel.app — showcases the full platform (figures, themes, comparisons, timeline, search, admin) with **public-domain verse text only** (JPS 1917, KJV, Hebrew/Arabic originals). See [`docs/LICENSING.md`](docs/LICENSING.md).

## Public demo policy (max content, minimal licensing risk)

| Included on public deploy | Excluded from public deploy |
|---------------------------|----------------------------|
| Figures, themes, concepts, timeline, comparisons, claims, verse links | JPS 1985, ESV, Yusuf Ali, Sahih International |
| Editorial claim summaries (original paraphrases) | Full modern translation libraries |
| JPS 1917, KJV, Hebrew (MT), Arabic verse text | |

Seed logic in `prisma/seed/translation-policy.ts` filters translations before insert and deletes any previously seeded copyrighted names.

## Engineering Scope

- Next.js App Router frontend with responsive comparison and editorial workflows
- PostgreSQL/Prisma data model with checked-in migrations
- NextAuth-based administration boundary
- CI validation for migrations, TypeScript, ESLint, and production builds
- Public-demo translation policy enforced at seed time

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL via Prisma ORM |
| Styling | Tailwind CSS |
| Runtime | Node.js 20+ |

## Project Structure

```
.
├── src/
│   ├── app/        # Next.js App Router pages
│   ├── components/ # UI components
│   └── lib/        # Data access and utilities
├── prisma/         # Schema and migrations
├── public/         # Static assets
```

## Getting Started

```bash
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/abrahamic"
```

## Deployment (Vercel)

GitHub CI validates migrations and production builds against Postgres. Vercel builds use `prisma generate && next build` (see `vercel.json`) so deploys do not require database connectivity at build time.

Vercel Postgres injects `PRISMA_DATABASE_URL` / `POSTGRES_URL`. The app maps those to Prisma's `DATABASE_URL` at runtime (see `src/lib/prisma.ts`).

1. Connect Vercel Postgres (or set `DATABASE_URL` and `DIRECT_URL`) in the Vercel project.
2. Run `npm run db:deploy` against that database.
3. Run `npm run db:seed` to load demo content (public-domain translations only).
4. Redeploy if needed.

```bash
vercel env run --environment production -- npm run db:deploy
vercel env run --environment production -- npm run db:seed
```

## License

Source code is proprietary and provided for technical review. The **public demo** serves public-domain translation excerpts (JPS 1917, KJV) and original-language text plus original editorial summaries — not a licensed scripture publication. See [`docs/LICENSING.md`](docs/LICENSING.md).
