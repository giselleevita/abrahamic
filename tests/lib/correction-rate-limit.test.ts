import { beforeEach, afterEach, expect, it, vi } from 'vitest'
const db = vi.hoisted(() => ({ $queryRaw: vi.fn(), $executeRaw: vi.fn() }))
vi.mock('@/lib/prisma', () => ({ default: db }))
import { correctionRateLimit } from '@/lib/correction-rate-limit'
beforeEach(() => { vi.stubEnv('RATE_LIMIT_SECRET', 'synthetic-stable-quota-secret-32-chars'); db.$queryRaw.mockResolvedValue([{ count: 1, retryAfterSeconds: 300 }]); db.$executeRaw.mockResolvedValue(0) })
afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks() })
it('persists a stable keyed digest rather than a raw request address', async () => {
  expect(await correctionRateLimit('192.0.2.44')).toEqual({ ok: true, retryAfterSeconds: 300 })
  const digest = db.$queryRaw.mock.calls[0][1]
  expect(digest).toMatch(/^[0-9a-f]{64}$/)
  expect(JSON.stringify(db.$queryRaw.mock.calls)).not.toContain('192.0.2.44')
  await correctionRateLimit('192.0.2.44')
  expect(db.$queryRaw.mock.calls[1][1]).toBe(digest)
})
it('returns a retry interval when the atomic quota refuses admission', async () => {
  db.$queryRaw.mockResolvedValue([{ count: null, retryAfterSeconds: 90 }])
  expect(await correctionRateLimit('test')).toEqual({ ok: false, retryAfterSeconds: 90 })
})
it('fails closed for missing configuration, database errors and cleanup failures', async () => {
  vi.stubEnv('RATE_LIMIT_SECRET', '')
  await expect(correctionRateLimit('test')).rejects.toThrow()
  expect(db.$queryRaw).not.toHaveBeenCalled()
  vi.stubEnv('RATE_LIMIT_SECRET', 'synthetic-stable-quota-secret-32-chars')
  db.$queryRaw.mockRejectedValueOnce(new Error('unavailable'))
  await expect(correctionRateLimit('test')).rejects.toThrow()
  db.$executeRaw.mockRejectedValueOnce(new Error('unavailable'))
  await expect(correctionRateLimit('test')).rejects.toThrow()
})
