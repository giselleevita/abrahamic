import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'
import {
  LOCK_MS,
  MAX_FAILURES,
  WINDOW_MS,
  createThrottleStore,
  loginKeys,
  nextFailureState,
  retryAfterSeconds,
} from './login-throttle'

const T0 = new Date('2026-01-01T12:00:00Z')
const at = (ms: number) => new Date(T0.getTime() + ms)

describe('login throttle policy', () => {
  it('starts a window on the first failure', () => {
    expect(nextFailureState(null, T0)).toEqual({ failures: 1, windowStart: T0, lockedUntil: null })
  })

  it('locks on the failure that reaches the limit, not before', () => {
    let state = nextFailureState(null, T0)
    for (let i = 1; i < MAX_FAILURES - 1; i++) state = nextFailureState(state, at(i))
    expect(state.lockedUntil).toBeNull()
    state = nextFailureState(state, at(MAX_FAILURES))
    expect(state.lockedUntil).toEqual(at(MAX_FAILURES + LOCK_MS))
  })

  it('starts a fresh window after the old one expires', () => {
    const old = { failures: MAX_FAILURES - 1, windowStart: T0, lockedUntil: null }
    expect(nextFailureState(old, at(WINDOW_MS + 1))).toEqual({
      failures: 1, windowStart: at(WINDOW_MS + 1), lockedUntil: null,
    })
  })

  it('does not extend or reset an active lock while attempts keep coming', () => {
    const locked = { failures: MAX_FAILURES, windowStart: T0, lockedUntil: at(LOCK_MS) }
    expect(nextFailureState(locked, at(1000))).toEqual(locked)
  })

  it('reports seconds remaining only while locked', () => {
    const locked = { failures: MAX_FAILURES, windowStart: T0, lockedUntil: at(LOCK_MS) }
    expect(retryAfterSeconds(locked, at(0))).toBe(LOCK_MS / 1000)
    expect(retryAfterSeconds(locked, at(LOCK_MS))).toBe(0)
    expect(retryAfterSeconds(null, T0)).toBe(0)
  })

  it('keys the hash with the server secret, so the same email hashes differently under another secret', () => {
    const original = process.env.NEXTAUTH_SECRET
    try {
      process.env.NEXTAUTH_SECRET = 'secret-one'
      const one = loginKeys('admin@example.com', '203.0.113.9')
      process.env.NEXTAUTH_SECRET = 'secret-two'
      const two = loginKeys('admin@example.com', '203.0.113.9')
      expect(one.email).not.toBe(two.email)
      expect(one.ip).not.toBe(two.ip)
      process.env.NEXTAUTH_SECRET = 'secret-one'
      expect(loginKeys('admin@example.com', '203.0.113.9').email).toBe(one.email)
    } finally {
      if (original === undefined) delete process.env.NEXTAUTH_SECRET
      else process.env.NEXTAUTH_SECRET = original
    }
  })

  it('hashes keys so raw emails and IPs are never stored', () => {
    const keys = loginKeys('Admin@Example.com', '203.0.113.9')
    expect(keys.email).toMatch(/^[0-9a-f]{64}$/)
    expect(keys.ip).toMatch(/^[0-9a-f]{64}$/)
    expect(keys.email).not.toBe(keys.ip)
    expect(JSON.stringify(keys)).not.toContain('example.com')
    expect(loginKeys('ADMIN@example.com', null).email).toBe(keys.email)
  })
})

const DATABASE_URL = process.env.DATABASE_URL
const describeDb = DATABASE_URL ? describe : describe.skip

describeDb('login throttle store (database)', () => {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: DATABASE_URL }) })
  const store = createThrottleStore(prisma)
  const keys = loginKeys('throttle-test@example.test', '198.51.100.7')

  beforeEach(async () => {
    await prisma.loginAttempt.deleteMany({ where: { key: { in: [keys.email, keys.ip] } } })
  })
  afterAll(async () => {
    await prisma.loginAttempt.deleteMany({ where: { key: { in: [keys.email, keys.ip] } } })
    await prisma.$disconnect()
  })

  it('blocks only after the limit is reached', async () => {
    for (let i = 0; i < MAX_FAILURES - 1; i++) await store.recordFailure(keys, at(i))
    expect(await store.blockedFor(keys, at(10))).toBe(0)
    await store.recordFailure(keys, at(11))
    expect(await store.blockedFor(keys, at(12))).toBeGreaterThan(0)
  })

  it('unlocks once the lock period has passed', async () => {
    for (let i = 0; i < MAX_FAILURES; i++) await store.recordFailure(keys, at(i))
    expect(await store.blockedFor(keys, at(LOCK_MS + 1000))).toBe(0)
  })

  it('clears the email counter on success but keeps the IP counter', async () => {
    for (let i = 0; i < MAX_FAILURES - 1; i++) await store.recordFailure(keys, at(i))
    await store.clearEmail(keys)
    expect(await prisma.loginAttempt.findUnique({ where: { key: keys.email } })).toBeNull()
    expect(await prisma.loginAttempt.findUnique({ where: { key: keys.ip } })).not.toBeNull()
  })

  it('throttles a rotating-email attacker by IP', async () => {
    const rotated = Array.from({ length: MAX_FAILURES * 4 }, (_, i) => loginKeys(`rotate${i}@example.test`, '198.51.100.7'))
    for (let i = 0; i < rotated.length; i++) await store.recordFailure(rotated[i], at(i))
    const fresh = loginKeys('fresh@example.test', '198.51.100.7')
    expect(await store.blockedFor(fresh, at(1000))).toBeGreaterThan(0)
    await prisma.loginAttempt.deleteMany({ where: { key: { in: rotated.map((k) => k.email) } } })
  })
})
