/**
 * Brute-force protection for sign-in.
 *
 * `rate-limit.ts` keeps counters in process memory, which does not work on
 * serverless: every instance has its own map, so an attacker is simply spread
 * across instances. Failed sign-ins are therefore counted in Postgres.
 *
 * Two counters are kept per attempt: one per email and one per IP. The email
 * counter stops password guessing against an account; the IP counter stops an
 * attacker rotating through many emails. Keys are SHA-256 hashes, so no raw
 * email address or IP is stored.
 *
 * Read-modify-write is not atomic. Under heavy concurrency a few extra guesses
 * can slip through before the lock lands; that is an acceptable bound for a
 * lock after 5 failures, and keeps the logic simple and testable.
 */
import { createHash } from 'node:crypto'
import type { PrismaClient } from '@/generated/prisma/client'

export const MAX_FAILURES = 5
export const WINDOW_MS = 15 * 60 * 1000
export const LOCK_MS = 15 * 60 * 1000
/** The IP counter is looser so shared networks (a school, a mosque, an office) are not locked out by a few typos. */
export const IP_MAX_FAILURES = MAX_FAILURES * 4

export type AttemptState = { failures: number; windowStart: Date; lockedUntil: Date | null }
export type LoginKeys = { email: string; ip: string | null }

export function nextFailureState(
  state: AttemptState | null,
  now: Date,
  max: number = MAX_FAILURES,
): AttemptState {
  if (state?.lockedUntil && state.lockedUntil > now) return state
  if (!state || now.getTime() - state.windowStart.getTime() >= WINDOW_MS) {
    return { failures: 1, windowStart: now, lockedUntil: max <= 1 ? new Date(now.getTime() + LOCK_MS) : null }
  }
  const failures = state.failures + 1
  return {
    failures,
    windowStart: state.windowStart,
    lockedUntil: failures >= max ? new Date(now.getTime() + LOCK_MS) : null,
  }
}

export function retryAfterSeconds(state: AttemptState | null, now: Date): number {
  if (!state?.lockedUntil || state.lockedUntil <= now) return 0
  return Math.ceil((state.lockedUntil.getTime() - now.getTime()) / 1000)
}

const hash = (value: string) => createHash('sha256').update(value).digest('hex')

export function loginKeys(email: string, ip: string | null | undefined): { email: string; ip: string } & LoginKeys {
  return {
    email: hash(`email:${email.trim().toLowerCase()}`),
    ip: hash(`ip:${ip?.trim() || 'unknown'}`),
  }
}

export function createThrottleStore(prisma: PrismaClient) {
  const read = (key: string) => prisma.loginAttempt.findUnique({ where: { key } })

  async function bump(key: string, now: Date, max: number) {
    const current = await read(key)
    const next = nextFailureState(current, now, max)
    await prisma.loginAttempt.upsert({
      where: { key },
      create: { key, ...next },
      update: next,
    })
  }

  return {
    /** Seconds the caller must wait; 0 means sign-in may proceed. */
    async blockedFor(keys: LoginKeys, now = new Date()): Promise<number> {
      const rows = await Promise.all([read(keys.email), keys.ip ? read(keys.ip) : null])
      return Math.max(...rows.map((row) => retryAfterSeconds(row, now)))
    },
    async recordFailure(keys: LoginKeys, now = new Date()): Promise<void> {
      await bump(keys.email, now, MAX_FAILURES)
      if (keys.ip) await bump(keys.ip, now, IP_MAX_FAILURES)
    },
    /** A correct password clears the account counter. The IP counter is left to expire. */
    async clearEmail(keys: LoginKeys): Promise<void> {
      await prisma.loginAttempt.deleteMany({ where: { key: keys.email } })
    },
  }
}
