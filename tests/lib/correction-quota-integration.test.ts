import { createHmac, randomUUID } from 'node:crypto'
import { describe, expect, it, afterAll, vi } from 'vitest'
import prisma from '@/lib/prisma'
import { correctionRateLimit } from '@/lib/correction-rate-limit'
const secret = 'synthetic-integration-quota-secret-32-characters'
describe.skipIf(!process.env.DATABASE_URL)('shared PostgreSQL correction quota', () => {
  afterAll(async () => { vi.unstubAllEnvs(); await prisma.$disconnect() })
  it('admits only five concurrent submissions, rolls over windows and bounds cleanup', async () => {
    vi.stubEnv('RATE_LIMIT_SECRET', secret)
    const key = `synthetic-${randomUUID()}`
    const keyDigest = createHmac('sha256', secret).update(`corrections:${key}`).digest('hex')
    try {
      const results = await Promise.all(Array.from({ length: 18 }, () => correctionRateLimit(key)))
      expect(results.filter((row) => row.ok)).toHaveLength(5)
      expect(results.filter((row) => !row.ok)).toHaveLength(13)
      expect(results.every((row) => row.retryAfterSeconds >= 1 && row.retryAfterSeconds <= 600)).toBe(true)
      const buckets = await prisma.correctionRateBucket.findMany({ where: { keyDigest } })
      expect(buckets).toHaveLength(1)
      expect(buckets[0].count).toBe(5)
      // Move only this test's consumed window into the past; the next request gets a fresh quota.
      await prisma.correctionRateBucket.updateMany({ where: { keyDigest }, data: { windowStart: new Date(Date.now() - 1_200_000) } })
      expect((await correctionRateLimit(key)).ok).toBe(true)
      expect(await prisma.correctionRateBucket.count({ where: { keyDigest } })).toBe(1)
      const expired = Array.from({ length: 105 }, (_, index) => ({ keyDigest: createHmac('sha256', secret).update(`${key}-${index}`).digest('hex'), windowStart: new Date(Date.now() - 3_600_000), count: 1 }))
      await prisma.correctionRateBucket.createMany({ data: expired })
      await correctionRateLimit(key)
      expect(await prisma.correctionRateBucket.count({ where: { keyDigest: { in: expired.map((row) => row.keyDigest) } } })).toBe(5)
      await correctionRateLimit(key)
      expect(await prisma.correctionRateBucket.count({ where: { keyDigest: { in: expired.map((row) => row.keyDigest) } } })).toBe(0)
    } finally { await prisma.correctionRateBucket.deleteMany({ where: { keyDigest } }) }
  })
})
