# Backup and restore

The `Database backup` workflow (`.github/workflows/backup.yml`) dumps the production database weekly,
encrypts it, and keeps it as a workflow artifact for 30 days. It costs nothing on the free tiers.

## One-time setup

1. In the Neon dashboard, copy the **direct** (non-pooled) connection string.
2. In the GitHub repository: Settings → Secrets and variables → Actions → New repository secret.
   - `BACKUP_DATABASE_URL`: the Neon direct connection string.
   - `BACKUP_PASSPHRASE`: a long random passphrase. Store a copy in your password manager.
     **Without it a backup cannot be opened.**
3. Check that `PG_MAJOR` in the workflow matches your Neon project's Postgres version.
4. Run the workflow once from the Actions tab (`workflow_dispatch`) and confirm it succeeds.

The repository is public, and artifacts on public repositories can be downloaded by any GitHub user.
That is why the dump is encrypted before upload. Never remove the encryption step.

## Restore

Practise this once before you need it, into a scratch database (a second free Neon project works).

```bash
gpg --batch --pinentry-mode loopback --passphrase "$BACKUP_PASSPHRASE" \
  --decrypt --output restore.dump backup-YYYYMMDD.dump.gpg
pg_restore --no-owner --no-privileges --clean --if-exists \
  --dbname "$SCRATCH_DATABASE_URL" restore.dump
```

Then point a local `.env` at the scratch database and open the app to confirm content is present.
Use a `pg_restore` at least as new as the server's major version.

## What this does not cover

Weekly means up to a week of edits can be lost. Neon's free tier also keeps a short point-in-time
restore window of its own; check the current limit in the Neon dashboard.
