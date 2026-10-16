# CI and deployment status

## Production truth: Vercel

The public demo at **https://abrahamic.vercel.app** deploys from `main` via Vercel Git integration. That path is authoritative for recruiters and reviewers:

- Migrations: `npm run db:deploy` (see `scripts/migrate-deploy.sh`)
- Seed: `npm run db:seed` (see `scripts/seed-demo.sh`)
- Env: `NEXTAUTH_URL`, `DATABASE_URL`, `DIRECT_URL` set in Vercel production

## README badges (public repo)

This repository is public. The README emphasizes the live product, while the Actions history provides independently visible CI and security evidence for every default-branch change.

## GitHub Actions CI

The workflow at [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) validates migrations, seed idempotency, TypeScript, ESLint, unit tests, production builds, and the desktop/320px full journey browser flow against Postgres. Failures do **not** block Vercel production deploys.

The separate [production health workflow](../.github/workflows/uptime.yml) checks the public app and database every six hours. A failed workflow is visible in Actions; email alerts depend on the maintainer's GitHub notification settings. For server exceptions, inspect the sanitized `[server-error]` and `[health-check]` markers in Vercel runtime logs.

### What to check

| Signal | Meaning |
|--------|---------|
| Vercel deploy success | Production is updated |
| GitHub CI | Optional signal for maintainers; not shown on README |
| Dependabot | 0 open alerts is the target |

## Local verification (no GitHub Actions)

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run lint
npm run build
```

## Not legal advice

See [`LICENSING.md`](LICENSING.md) for public-demo content policy.
