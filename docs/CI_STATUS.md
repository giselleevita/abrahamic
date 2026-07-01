# CI and deployment status

## Production truth: Vercel

The public demo at **https://abrahamic.vercel.app** deploys from `main` via Vercel Git integration. That path is authoritative for recruiters and reviewers:

- Migrations: `npm run db:deploy` (see `scripts/migrate-deploy.sh`)
- Seed: `npm run db:seed` (see `scripts/seed-demo.sh`)
- Env: `NEXTAUTH_URL`, `DATABASE_URL`, `DIRECT_URL` set in Vercel production

## GitHub Actions CI

The workflow at [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) validates migrations, TypeScript, ESLint, and production builds against Postgres.

**Current limitation:** CI may show **failing** when GitHub account billing or Actions spending limits block workflow runs. This does **not** block Vercel production deploys.

### What to check

| Signal | Meaning |
|--------|---------|
| Vercel deploy success | Production is updated |
| GitHub CI red | Fix billing under GitHub account settings, or rely on Vercel + local `npm run build` for review |
| Dependabot | Security alerts are triaged separately; 0 open alerts is the target |

## Local verification (no GitHub Actions)

```bash
npm install
npx prisma migrate dev
npm run lint
npm run build
```

## Not legal advice

See [`LICENSING.md`](LICENSING.md) for public-demo content policy.
