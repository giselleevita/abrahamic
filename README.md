# Abrahamic Scripture Comparison

[![CI](https://github.com/giselleevita/abrahamic/actions/workflows/ci.yml/badge.svg)](https://github.com/giselleevita/abrahamic/actions/workflows/ci.yml)

A web application for side-by-side comparison of texts across the Abrahamic scriptures — Torah, Bible, and Quran — with thematic search, verse alignment, and commentary layers.

## What It Does

- Browse and search across Torah, Bible, and Quran in parallel
- Thematic and keyword-based verse alignment across traditions
- Clean reading interface with side-by-side scripture views
- Prisma-backed data layer for structured scripture storage

## Status

> **In development.** The application includes browsing, search, comparison, timeline, genealogy, and editorial administration flows. Content licensing and production deployment hardening remain open before a public release.

## Engineering Scope

- Next.js App Router frontend with responsive comparison and editorial workflows
- PostgreSQL/Prisma data model with checked-in migrations
- NextAuth-based administration boundary
- CI validation for migrations, TypeScript, ESLint, and production builds
- Explicit content-licensing limitation before public deployment

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

1. Set `DATABASE_URL` (and `DIRECT_URL` if using connection pooling) in the Vercel project.
2. Run `npx prisma migrate deploy` against that database before or after the first deploy (one-off or via release hook).
3. Redeploy after migrations are applied.

## License

Source code is proprietary and currently provided for review only. Scripture translation excerpts require a separate licensing review before redistribution or public deployment.
