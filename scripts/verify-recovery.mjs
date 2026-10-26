// Disposable local demonstration only. Requires the repository's Postgres Docker service.
import { spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { mkdirSync, writeFileSync, unlinkSync } from 'node:fs'

const container = process.env.RECOVERY_CONTAINER || 'abrahamiccomparison-postgres-1'
const suffix = randomBytes(6).toString('hex')
const original = `release_recovery_${suffix}`
const restored = `${original}_restored`
const dumpPath = `/tmp/${original}.dump`
const encryptedDump = `/tmp/${original}.dump.gpg`
const syntheticPassphrase = randomBytes(32).toString('base64url')

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, ...options })
  if (result.status !== 0) throw new Error(`${command} failed: ${result.stderr?.toString().slice(-2000) ?? ''}`)
  return result.stdout
}

function runBuffer(command, args, options = {}) {
  const result = spawnSync(command, args, { maxBuffer: 128 * 1024 * 1024, ...options })
  if (result.status !== 0) throw new Error(`${command} failed: ${result.stderr?.toString().slice(-2000) ?? ''}`)
  return result.stdout
}

const pg = (...args) => run('docker', ['exec', container, ...args])
const sql = (database, statement) => pg('psql', '-U', 'postgres', '-d', database, '-At', '-v', 'ON_ERROR_STOP=1', '-c', statement).trim()
const env = {
  ...process.env,
  VERCEL_ENV: 'development',
  DATABASE_URL: `postgresql://postgres:postgres@127.0.0.1:5434/${original}`,
  DIRECT_URL: `postgresql://postgres:postgres@127.0.0.1:5434/${original}`,
}
for (const key of Object.keys(env)) if (/NEON|PRISMA_DATABASE_URL|POSTGRES_URL|storage_/.test(key)) delete env[key]

const tables = ['sources', 'verses', 'verse_translations', 'comparisons', 'claims', 'courses', 'chapters', 'questions', 'kids_stories', 'correction_reports', 'correction_rate_buckets', '_prisma_migrations']
let report

try {
  pg('createdb', '-U', 'postgres', original)
  pg('createdb', '-U', 'postgres', restored)
  run('npx', ['prisma', 'migrate', 'deploy'], { env })
  run('npx', ['prisma', 'db', 'seed'], { env })
  sql(original, `INSERT INTO correction_reports (kind, message, "ipHash", "pagePath", reference, "legacyCategory", status, "updatedAt") VALUES ('CORRECTION', 'Synthetic recovery exercise: verify the source reference.', repeat('a',64), '/comparisons/1', 'Genesis 22:2', 'SOURCE', 'NEW', NOW());`)
  sql(original, `INSERT INTO correction_rate_buckets ("keyDigest", "windowStart", count) VALUES (repeat('a',64), NOW(), 2);`)

  const dump = runBuffer('docker', ['exec', container, 'pg_dump', '-U', 'postgres', '-d', original, '--no-owner', '--no-privileges', '--format=custom'])
  // GPG consumes a passphrase on stdin and encrypts this one-run local dump file.
  writeFileSync(dumpPath, dump)
  run('gpg', ['--batch', '--yes', '--pinentry-mode', 'loopback', '--passphrase-fd', '0', '--symmetric', '--cipher-algo', 'AES256', '--output', encryptedDump, dumpPath], { input: `${syntheticPassphrase}\n` })
  const restoredDump = runBuffer('gpg', ['--batch', '--yes', '--pinentry-mode', 'loopback', '--passphrase-fd', '0', '--decrypt', encryptedDump], { input: `${syntheticPassphrase}\n` })
  if (restoredDump.length === 0) throw new Error('Encrypted backup could not be decrypted')
  runBuffer('docker', ['exec', '-i', container, 'pg_restore', '-U', 'postgres', '-d', restored, '--exit-on-error', '--no-owner', '--no-privileges'], { input: restoredDump })
  unlinkSync(dumpPath)

  const counts = tables.map((table) => ({ table, before: Number(sql(original, `SELECT count(*) FROM "${table}"`)), after: Number(sql(restored, `SELECT count(*) FROM "${table}"`)) }))
  if (counts.some((row) => row.before !== row.after)) throw new Error('Restored row counts differ')
  const fingerprintSql = `SELECT md5(string_agg(row_hash, '' ORDER BY row_hash)) FROM (SELECT md5(row_to_json(t)::text) AS row_hash FROM comparisons t UNION ALL SELECT md5(row_to_json(t)::text) FROM correction_reports t UNION ALL SELECT md5(row_to_json(t)::text) FROM questions t) rows`
  if (sql(original, fingerprintSql) !== sql(restored, fingerprintSql)) throw new Error('Restored content differs')
  const constraintSql = `SELECT count(*) FROM pg_constraint WHERE connamespace = 'public'::regnamespace`
  if (sql(original, constraintSql) !== sql(restored, constraintSql)) throw new Error('Restored constraints differ')

  report = {
    timestamp: new Date().toISOString(),
    scope: 'Disposable local seeded databases only. No production backup was accessed or verified.',
    encryption: 'GPG symmetric AES256; synthetic one-run passphrase',
    counts,
    contentFingerprintMatches: true,
    constraints: Number(sql(restored, constraintSql)),
    restoreVerified: true,
  }
  mkdirSync('output/release', { recursive: true })
  writeFileSync('output/release/recovery.json', JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify(report, null, 2))
} finally {
  // The generated database names and encrypted dump are the only resources removed.
  pg('dropdb', '-U', 'postgres', '--if-exists', original)
  pg('dropdb', '-U', 'postgres', '--if-exists', restored)
  try { unlinkSync(dumpPath) } catch { /* absent after a successful restore */ }
  try { unlinkSync(encryptedDump) } catch { /* absent if encryption did not complete */ }
}
