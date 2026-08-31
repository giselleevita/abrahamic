/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Good enough for a single-instance demo deployment; if the app ever runs
 * on multiple instances/edge regions this should move to a shared store
 * (e.g. Redis / Upstash) instead of per-process memory.
 */

type Bucket = { count: number; windowStart: number }

const buckets = new Map<string, Bucket>()

export type RateLimitResult = {
  ok: boolean
  limit: number
  remaining: number
  retryAfterSeconds: number
}

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now()
  const existing = buckets.get(key)

  if (!existing || now - existing.windowStart >= windowMs) {
    buckets.set(key, { count: 1, windowStart: now })
    return { ok: true, limit, remaining: limit - 1, retryAfterSeconds: 0 }
  }

  if (existing.count >= limit) {
    const retryAfterSeconds = Math.ceil((existing.windowStart + windowMs - now) / 1000)
    return { ok: false, limit, remaining: 0, retryAfterSeconds }
  }

  existing.count += 1
  return { ok: true, limit, remaining: limit - existing.count, retryAfterSeconds: 0 }
}

export function requestKey(req: Request): string {
  const headers = req.headers
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  )
}
