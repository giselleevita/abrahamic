# Abrahamic Scripture Comparison

[![Live demo](https://img.shields.io/badge/demo-abrahamic.vercel.app-000?style=flat&logo=vercel&logoColor=white)](https://abrahamic.vercel.app)

**Live demo:** https://abrahamic.vercel.app — production deploys on merge to `main` via Vercel. See [`docs/CI_STATUS.md`](docs/CI_STATUS.md) and [`docs/REVIEWER_GUIDE.md`](docs/REVIEWER_GUIDE.md). README badge policy: [portfolio `BADGE_POLICY.md`](https://github.com/giselleevita/portfolio/blob/main/docs/BADGE_POLICY.md) (private repo → demo badge, not CI).

A web application for side-by-side comparison of texts across the Abrahamic scriptures — Torah, Bible, and Quran — with thematic search, verse alignment, and commentary layers.

## What It Does

- Browse and search across Torah, Bible, and Quran in parallel
- Thematic and keyword-based verse alignment across traditions
- Clean reading interface with side-by-side scripture views
- Prisma-backed data layer for structured scripture storage

## Status

> **Public engineering demo** at https://abrahamic.vercel.app — showcases the full platform (figures, themes, comparisons, timeline, search, admin) with **original Hebrew/Arabic text and project-authored reader notes only** — no licensed English translations. See [`docs/LICENSING.md`](docs/LICENSING.md).

This is a structured editorial and software-engineering case study. It does not claim theological authority, and AI-generated suggestions are never published without an explicit editorial approval step.

## Public demo policy (no publisher licenses)

| On public deploy | Not shown |
|------------------|-----------|
| Full platform: figures, themes, comparisons, claims, search | Any third-party English translation |
| Original Hebrew / Arabic text | JPS, KJV, ESV, Yusuf Ali, Sahih International |
| **Reader note (original)** — English context written for this demo | |

Enforced in `src/lib/public-demo-policy.ts` at seed and API time. See [`docs/LICENSING.md`](docs/LICENSING.md).

## Screenshots

The live demo is the fastest way to see the app — a home page, side-by-side comparison view, timeline, and family tree. See it at [abrahamic.vercel.app](https://abrahamic.vercel.app), or the [`docs/REVIEWER_GUIDE.md`](docs/REVIEWER_GUIDE.md) for a guided tour.

## Architecture

```mermaid
flowchart LR
    subgraph Client
        UI[Next.js App Router\nReact Server Components]
    end

    subgraph Server["Vercel / Next.js server"]
        MW[middleware.ts\nroute gating]
        API[API routes\nsrc/app/api/**]
        Auth[NextAuth\nsrc/lib/auth.ts]
        Policy[Public-demo policy\nsrc/lib/public-demo-policy.ts]
        AI[Anthropic client\nsrc/lib/ai.ts]
        RL[Rate limiter\nsrc/lib/rate-limit.ts]
    end

    DB[(PostgreSQL\nvia Prisma)]
    Claude[[Anthropic API]]

    UI --> MW --> API
    API --> Auth
    API --> Policy
    API --> RL
    API --> Prisma[Prisma Client] --> DB
    API -.optional.-> AI --> Claude
    Policy -. filters .-> Prisma
```

- **Data model**: Figures, sources, verses, translations, claims, comparisons, themes, and timeline events, all Prisma-modeled with checked-in migrations (`prisma/migrations`).
- **Public-demo boundary**: `src/lib/public-demo-policy.ts` filters every translation the API returns so the public deployment never serves licensed English text — enforced in code and covered by tests, not just documentation.
- **AI layer is optional and additive**: search ranking and comparison summaries call the Anthropic API only when `ANTHROPIC_API_KEY` is set; the app works without it.

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
| Runtime | Node.js 24 |

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

For a no-cost setup, use Vercel's Hobby plan with a free Neon Postgres project. The app also supports legacy `PRISMA_DATABASE_URL` / `POSTGRES_URL` variables and maps them to Prisma's `DATABASE_URL` at runtime (see `src/lib/prisma-env.ts`).

1. Create a free Neon Postgres database and set its pooled URL as `DATABASE_URL` and direct URL as `DIRECT_URL` in the Vercel project.
2. Set `NEXTAUTH_URL` to your production URL (e.g. `https://abrahamic.vercel.app`) for auth callbacks and Open Graph metadata.
3. Run `npm run db:deploy` against that database.
4. Run `npm run db:seed` to load license-free demo content.
5. Redeploy if needed.

```bash
vercel env run --environment production -- npm run db:deploy
vercel env run --environment production -- npm run db:seed
```

## License

Project source code is [MIT licensed](LICENSE). The **public demo** uses original-language text and **original reader notes** only — no licensed translations, and the MIT license does not extend to any third-party scripture translation text. See [`docs/LICENSING.md`](docs/LICENSING.md).

**15-minute review:** [`docs/REVIEWER_GUIDE.md`](docs/REVIEWER_GUIDE.md) · **Live demo:** [abrahamic.vercel.app](https://abrahamic.vercel.app)
