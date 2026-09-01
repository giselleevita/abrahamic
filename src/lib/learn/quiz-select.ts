/**
 * Deterministic question sampling.
 *
 * The full published pool is delivered to the client and sampled there, seeded
 * by attempt number: a retry varies without a refetch, and no Math.random()
 * runs during render (which would differ between server and client markup).
 */

/** Small deterministic PRNG (mulberry32). */
function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Fisher-Yates using the seeded generator; does not mutate `items`. */
export function seededShuffle<T>(items: T[], seed: number): T[] {
  const next = rng(seed)
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Pick up to `count` questions for a given attempt. */
export function selectQuestions<T>(pool: T[], count: number, attempt: number): T[] {
  if (count <= 0) return []
  return seededShuffle(pool, attempt + 1).slice(0, Math.min(count, pool.length))
}
