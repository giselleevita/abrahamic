# CI and deployment status

## Production truth: Vercel

The public demo at **https://abrahamic.vercel.app** deploys from `main` via Vercel Git integration. That path is authoritative for recruiters and reviewers:

- Migrations: `npm run db:deploy` (see `scripts/migrate-deploy.sh`)
- Seed: `npm run db:seed` (see `scripts/seed-demo.sh`)
- Env: `NEXTAUTH_URL`, `DATABASE_URL`, `DIRECT_URL` set in Vercel production

## README badges (private repo)

This repository is public. The README emphasizes the live product, while the Actions history provides independently visible CI and security evidence for every default-branch change.

## GitHub Actions CI

The workflow at [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) validates migrations, TypeScript, ESLint, and production builds against Postgres. It runs on the free private-repo allowance (2,000 minutes/month); failures do **not** block Vercel production deploys.

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
