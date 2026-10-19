// Disposable local demonstration only. Requires the repository's Postgres Docker service.
import { spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
const container = process.env.RECOVERY_CONTAINER || 'abrahamiccomparison-postgres-1'
const suffix = randomBytes(6).toString('hex')
const original = `release_recovery_${suffix}`
const restored = `${original}_restored`
const dump = `/tmp/${original}.dump`
function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, ...options })
  if (result.status !== 0) throw new Error(`${command} failed: ${result.stderr?.slice(-2000) ?? ''}`)
  return result.stdout
}
const pg = (...args) => run('docker', ['exec', container, ...args])
const sql = (database, statement) => pg('psql', '-U', 'postgres', '-d', database, '-At', '-v', 'ON_ERROR_STOP=1', '-c', statement).trim()
const env = { ...process.env, VERCEL_ENV: 'development', DATABASE_URL: `postgresql://postgres:postgres@127.0.0.1:5434/${original}`, DIRECT_URL: `postgresql://postgres:postgres@127.0.0.1:5434/${original}` }
for (const key of Object.keys(env)) if (/NEON|PRISMA_DATABASE_URL|POSTGRES_URL|storage_/.test(key)) delete env[key]
const tables = ['sources', 'verses', 'verse_translations', 'comparisons', 'claims', 'courses', 'chapters', 'questions', 'kids_stories', 'correction_reports', 'correction_rate_buckets', '_prisma_migrations']
let report
try {
  pg('createdb', '-U', 'postgres', original)
  pg('createdb', '-U', 'postgres', restored)
  run('npx', ['prisma', 'migrate', 'deploy'], { env })
  run('npx', ['prisma', 'db', 'seed'], { env })
  sql(original, `INSERT INTO correction_reports ("pagePath", category, description, status, "updatedAt") VALUES ('/comparisons/1', 'SOURCE', 'Synthetic recovery exercise: verify the source reference.', 'NEW', NOW());`)
  sql(original, `INSERT INTO correction_rate_buckets ("keyDigest", "windowStart", count) VALUES (repeat('a',64), NOW(), 2);`)
  pg('pg_dump', '-U', 'postgres', '-d', original, '--format=custom', '--file', dump)
  pg('pg_restore', '-U', 'postgres', '-d', restored, '--exit-on-error', '--no-owner', dump)
  const counts = tables.map((table) => ({ table, before: Number(sql(original, `SELECT count(*) FROM "${table}"`)), after: Number(sql(restored, `SELECT count(*) FROM "${table}"`)) }))
  if (counts.some((row) => row.before !== row.after)) throw new Error('Restored row counts differ')
  const fingerprintSql = `SELECT md5(string_agg(row_hash, '' ORDER BY row_hash)) FROM (SELECT md5(row_to_json(t)::text) AS row_hash FROM comparisons t UNION ALL SELECT md5(row_to_json(t)::text) FROM correction_reports t UNION ALL SELECT md5(row_to_json(t)::text) FROM questions t) rows`
  if (sql(original, fingerprintSql) !== sql(restored, fingerprintSql)) throw new Error('Restored content differs')
  const constraintSql = `SELECT count(*) FROM pg_constraint WHERE connamespace = 'public'::regnamespace`
  if (sql(original, constraintSql) !== sql(restored, constraintSql)) throw new Error('Restored constraints differ')
  report = { timestamp: new Date().toISOString(), scope: 'Disposable local seeded databases only. No production backup was accessed or verified.', counts, contentFingerprintMatches: true, constraints: Number(sql(restored, constraintSql)), restoreVerified: true }
  mkdirSync('output/release', { recursive: true })
  writeFileSync('output/release/recovery.json', JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify(report, null, 2))
} finally {
  // The generated names are the only databases this script can delete.
  pg('dropdb', '-U', 'postgres', '--if-exists', original)
  pg('dropdb', '-U', 'postgres', '--if-exists', restored)
  pg('rm', '-f', dump)
}
