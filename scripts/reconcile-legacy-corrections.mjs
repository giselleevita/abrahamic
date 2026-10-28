import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Client } from 'pg'
import 'dotenv/config'

const FAILED_REPORT_MIGRATION = '20261022170000_add_reports_and_proposals'

function databaseUrl(env) {
  if (env.VERCEL_ENV === 'preview') {
    if (env.PREVIEW_DATABASE_ISOLATED !== 'true') throw new Error('Preview database isolation is required before migration repair.')
    return env.PREVIEW_DIRECT_URL || env.PREVIEW_DATABASE_URL_UNPOOLED
  }
  return env.NEON_DATABASE_URL_UNPOOLED || env.DIRECT_URL || env.POSTGRES_URL || env.DATABASE_URL || env.PRISMA_DATABASE_URL
}

async function tableExists(client, table) {
  const result = await client.query('SELECT to_regclass($1) IS NOT NULL AS present', [`public.${table}`])
  return result.rows[0].present
}

async function renameIfPresent(client, from, to) {
  const result = await client.query('SELECT to_regclass($1) IS NOT NULL AS present', [`public.${from}`])
  if (result.rows[0].present) await client.query(`ALTER INDEX "${from}" RENAME TO "${to}"`)
}

/** Quarantine the pre-merge report table so its data can be copied by the forward migration. */
export async function reconcileLegacyCorrections(url, env = process.env) {
  if (!url) throw new Error('A direct PostgreSQL connection is required for migrations.')
  const client = new Client({ connectionString: url })
  await client.connect()
  let quarantined = false
  try {
    await client.query('BEGIN')
    const currentExists = await tableExists(client, 'correction_reports')
    const quarantineExists = await tableExists(client, 'correction_reports_legacy_migration')
    if (currentExists && !quarantineExists) {
      const columns = await client.query(
        "SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'correction_reports'",
      )
      const names = new Set(columns.rows.map((row) => row.column_name))
      const isLegacy = names.has('category') && names.has('description') && !names.has('kind') && !names.has('message')
      if (isLegacy) {
        await client.query('ALTER TABLE "correction_reports" RENAME TO "correction_reports_legacy_migration"')
        await renameIfPresent(client, 'correction_reports_pkey', 'correction_reports_legacy_pkey')
        const legacyIndex = await client.query("SELECT to_regclass('public.\"correction_reports_status_createdAt_idx\"') IS NOT NULL AS present")
        if (legacyIndex.rows[0].present) await client.query('ALTER INDEX "correction_reports_status_createdAt_idx" RENAME TO "correction_reports_legacy_status_createdAt_idx"')
        const sequence = await client.query("SELECT to_regclass('public.correction_reports_id_seq') IS NOT NULL AS present")
        if (sequence.rows[0].present) await client.query('ALTER SEQUENCE "correction_reports_id_seq" RENAME TO "correction_reports_legacy_id_seq"')
        quarantined = true
      }
    }
    await client.query('COMMIT')

    const migrationTable = await tableExists(client, '_prisma_migrations')
    let failed = false
    if (migrationTable) {
      const row = await client.query(
        'SELECT 1 FROM "_prisma_migrations" WHERE migration_name = $1 AND finished_at IS NULL AND rolled_back_at IS NULL LIMIT 1',
        [FAILED_REPORT_MIGRATION],
      )
      failed = row.rowCount > 0
    }
    if (failed && (quarantined || await tableExists(client, 'correction_reports_legacy_migration'))) {
      execFileSync('npx', ['prisma', 'migrate', 'resolve', '--rolled-back', FAILED_REPORT_MIGRATION], { stdio: 'inherit', env })
    }
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {})
    throw error
  } finally {
    await client.end()
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  await reconcileLegacyCorrections(databaseUrl(process.env))
}
