import { createHash, randomUUID } from 'node:crypto'
import { cpSync, mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { Client } from 'pg'

const root = process.cwd()
const migrationRoot = join(root, 'prisma', 'migrations')
const oldReportMigration = '20261022170000_add_reports_and_proposals'
const migrations = readdirSync(migrationRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()

function connectionUrl(database) {
  const configured = process.env.DIRECT_URL || process.env.DATABASE_URL
  if (!configured) throw new Error('Set DIRECT_URL or DATABASE_URL to the disposable local PostgreSQL service.')
  const url = new URL(configured)
  url.pathname = `/${database}`
  return url.toString()
}

function run(args, env) {
  const result = spawnSync('npx', args, { cwd: root, env, stdio: 'inherit' })
  if (result.status !== 0) throw new Error(`Command failed: npx ${args.join(' ')}`)
}

async function withClient(url, fn) {
  const client = new Client({ connectionString: url })
  await client.connect()
  try { return await fn(client) } finally { await client.end() }
}

async function createDatabase(adminUrl, name) {
  await withClient(adminUrl, (client) => client.query(`CREATE DATABASE "${name}"`))
}

async function dropDatabase(adminUrl, name) {
  await withClient(adminUrl, async (client) => {
    await client.query('SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()', [name])
    await client.query(`DROP DATABASE IF EXISTS "${name}"`)
  })
}

async function main() {
  const baseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL
  if (!baseUrl) throw new Error('Set DIRECT_URL or DATABASE_URL to the disposable local PostgreSQL service.')
  const admin = new URL(baseUrl)
  admin.pathname = '/postgres'
  const adminUrl = admin.toString()
  const suffix = `${process.pid}_${Date.now()}`
  const legacyDatabase = `abrahamic_legacy_reports_${suffix}`
  const freshDatabase = `abrahamic_fresh_reports_${suffix}`
  const scratch = mkdtempSync(join(tmpdir(), 'abrahamic-report-migration-'))
  const configPath = join(root, `scripts/.report-migration-${process.pid}.config.ts`)
  const migrationPath = join(scratch, 'migrations')
  mkdirSync(migrationPath, { recursive: true })
  cpSync(join(migrationRoot, 'migration_lock.toml'), join(migrationPath, 'migration_lock.toml'))
  const config = `import { defineConfig } from 'prisma/config'\nexport default defineConfig({ schema: '${join(root, 'prisma/schema.prisma')}', migrations: { path: '${migrationPath}' }, datasource: { url: process.env.DIRECT_URL || process.env.DATABASE_URL || '' } })\n`
  writeFileSync(configPath, config)

  try {
    await createDatabase(adminUrl, legacyDatabase)
    await createDatabase(adminUrl, freshDatabase)
    const legacyUrl = connectionUrl(legacyDatabase)
    const baseEnv = { ...process.env, DATABASE_URL: legacyUrl, DIRECT_URL: legacyUrl }
    for (const name of migrations.filter((migration) => migration < oldReportMigration)) {
      cpSync(join(migrationRoot, name), join(migrationPath, name), { recursive: true })
    }
    run(['prisma', 'migrate', 'deploy', '--config', configPath], baseEnv)

    const migrationFile = join(migrationRoot, oldReportMigration, 'migration.sql')
    const checksum = createHash('sha256').update(readFileSync(migrationFile)).digest('hex')
    await withClient(legacyUrl, async (client) => {
      await client.query(`
        CREATE TYPE "CorrectionStatus" AS ENUM ('NEW', 'IN_REVIEW', 'RESOLVED', 'DISMISSED');
        CREATE TYPE "CorrectionCategory" AS ENUM ('SOURCE', 'INTERPRETATION', 'LABEL', 'OTHER');
        CREATE TABLE "correction_reports" (
          "id" SERIAL PRIMARY KEY, "pagePath" VARCHAR(2000) NOT NULL, "reference" VARCHAR(300),
          "category" "CorrectionCategory" NOT NULL, "description" VARCHAR(3000) NOT NULL,
          "status" "CorrectionStatus" NOT NULL DEFAULT 'NEW', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "correction_description_length" CHECK (char_length("description") BETWEEN 20 AND 3000)
        );
        CREATE INDEX "correction_reports_status_createdAt_idx" ON "correction_reports"("status", "createdAt");
      `)
      await client.query(
        'INSERT INTO "correction_reports" ("id", "pagePath", "reference", "category", "description", "status", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4::"CorrectionCategory", $5, $6::"CorrectionStatus", $7, $8)',
        [9001, '/comparisons/1', 'Genesis 22:2', 'SOURCE', 'The historical source report must remain available to the editor.', 'IN_REVIEW', new Date('2026-10-01T12:00:00Z'), new Date('2026-10-02T12:00:00Z')],
      )
      await client.query(
        'INSERT INTO "_prisma_migrations" (id, checksum, migration_name, logs, started_at, applied_steps_count) VALUES ($1, $2, $3, $4, now(), 0)',
        [randomUUID(), checksum, oldReportMigration, 'Synthetic failed migration for upgrade test'],
      )
    })

    run(['node', 'scripts/reconcile-legacy-corrections.mjs'], baseEnv)

    for (const name of migrations.filter((migration) => migration >= oldReportMigration)) {
      cpSync(join(migrationRoot, name), join(migrationPath, name), { recursive: true })
    }
    run(['prisma', 'migrate', 'deploy', '--config', configPath], baseEnv)

    const restored = await withClient(legacyUrl, async (client) => {
      const report = await client.query('SELECT id, kind::text, status::text, "pagePath", reference, message, "legacyCategory", "handledBy", "createdAt", "updatedAt" FROM correction_reports WHERE id = 9001')
      const legacyTable = await client.query("SELECT to_regclass('public.correction_reports_legacy_migration') IS NOT NULL AS present")
      const sequence = await client.query("SELECT nextval(pg_get_serial_sequence('correction_reports', 'id')) AS id")
      return { report: report.rows[0], legacyTable: legacyTable.rows[0].present, nextId: sequence.rows[0].id }
    })
    const report = restored.report
    if (!report || report.kind !== 'SOURCE_ERROR' || report.status !== 'SEEN' || report.pagePath !== '/comparisons/1' || report.reference !== 'Genesis 22:2' || report.message !== 'The historical source report must remain available to the editor.' || report.legacyCategory !== 'SOURCE' || report.handledBy !== 'legacy-unrecorded' || restored.legacyTable || Number(restored.nextId) <= 9001) {
      throw new Error(`Legacy report migration verification failed: ${JSON.stringify({ ...restored, nextId: String(restored.nextId) })}`)
    }

    const freshUrl = connectionUrl(freshDatabase)
    run(['prisma', 'migrate', 'deploy'], { ...process.env, DATABASE_URL: freshUrl, DIRECT_URL: freshUrl })
    await withClient(freshUrl, async (client) => {
      const reports = await client.query('SELECT count(*)::integer AS count FROM correction_reports')
      const legacy = await client.query("SELECT to_regclass('public.correction_reports_legacy_migration') IS NOT NULL AS present")
      if (reports.rows[0].count !== 0 || legacy.rows[0].present) throw new Error('Fresh migration unexpectedly contains legacy reports.')
    })
    console.log('Fresh and legacy correction-report migrations passed on disposable databases.')
  } finally {
    rmSync(configPath, { force: true })
    rmSync(scratch, { recursive: true, force: true })
    await dropDatabase(adminUrl, legacyDatabase).catch(() => {})
    await dropDatabase(adminUrl, freshDatabase).catch(() => {})
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
