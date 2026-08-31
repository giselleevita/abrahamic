import { describe, expect, it } from 'vitest'
import { rateLimit } from './rate-limit'

describe('rateLimit', () => {
  it('allows requests up to the limit within the window', () => {
    const key = `test-${Math.random()}`
    for (let i = 0; i < 3; i++) {
      expect(rateLimit(key, { limit: 3, windowMs: 60_000 }).ok).toBe(true)
    }
  })

  it('rejects once the limit is exceeded within the window', () => {
    const key = `test-${Math.random()}`
    for (let i = 0; i < 3; i++) rateLimit(key, { limit: 3, windowMs: 60_000 })
    const result = rateLimit(key, { limit: 3, windowMs: 60_000 })
    expect(result.ok).toBe(false)
    expect(result.retryAfterSeconds).toBeGreaterThan(0)
  })

  it('tracks separate keys independently', () => {
    const a = `test-a-${Math.random()}`
    const b = `test-b-${Math.random()}`
    for (let i = 0; i < 3; i++) rateLimit(a, { limit: 3, windowMs: 60_000 })
    expect(rateLimit(b, { limit: 3, windowMs: 60_000 }).ok).toBe(true)
  })
})
