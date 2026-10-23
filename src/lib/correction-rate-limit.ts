import { createHmac } from 'node:crypto'
import prisma from '@/lib/prisma'

const WINDOW_MS = 600_000

/** Throws on configuration or database failure: callers must fail closed. */
export async function correctionRateLimit(requestKey: string) {
  const secret = process.env.RATE_LIMIT_SECRET
  if (!secret || secret.length < 32) throw new Error('Correction quota is not configured')
  const digest = createHmac('sha256', secret).update(`corrections:${requestKey}`).digest('hex')
  // Database time keeps all application instances in the same ten-minute window.
  const rows = await prisma.$queryRaw<{ count: number | null; retryAfterSeconds: number }[]>`
    WITH quota_window AS (
      SELECT to_timestamp(floor(extract(epoch FROM statement_timestamp()) / 600) * 600) AT TIME ZONE 'UTC' AS start
    ), accepted AS (
      INSERT INTO correction_rate_buckets ("keyDigest", "windowStart", count)
      SELECT ${digest}, start, 1 FROM quota_window
      ON CONFLICT ("keyDigest", "windowStart") DO UPDATE
        SET count = correction_rate_buckets.count + 1
        WHERE correction_rate_buckets.count < 5
      RETURNING count
    )
    SELECT (SELECT count FROM accepted) AS count,
      greatest(1, ceil(extract(epoch FROM (start + interval '10 minutes' - (statement_timestamp() AT TIME ZONE 'UTC')))))::integer AS "retryAfterSeconds"
    FROM quota_window
  `
  // One bounded cleanup per submission, including throttled submissions. No raw keys persist.
  await prisma.$executeRaw`
    WITH expired AS MATERIALIZED (
      SELECT "keyDigest", "windowStart" FROM correction_rate_buckets
      WHERE "windowStart" < (statement_timestamp() AT TIME ZONE 'UTC') - interval '10 minutes'
      ORDER BY "windowStart" LIMIT 100 FOR UPDATE SKIP LOCKED
    )
    DELETE FROM correction_rate_buckets bucket USING expired
    WHERE bucket."keyDigest" = expired."keyDigest" AND bucket."windowStart" = expired."windowStart"
  `
  if (!rows[0]) throw new Error('Correction quota is unavailable')
  return { ok: rows[0].count != null, retryAfterSeconds: Math.min(WINDOW_MS / 1000, rows[0].retryAfterSeconds) }
}
