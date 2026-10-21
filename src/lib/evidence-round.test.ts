import { describe, expect, it } from 'vitest'
import { pickRound, type Trad } from './evidence-round'

const pool = (['JEWISH', 'CHRISTIAN', 'ISLAMIC'] as Trad[]).flatMap((t, ti) =>
  Array.from({ length: 5 }, (_, i) => ({ id: ti * 10 + i, tradition: t })),
)

describe('pickRound', () => {
  it('takes two from each tradition with no repeats, as a real permutation', () => {
    const r = pickRound(pool, 0)
    expect(r).toHaveLength(6)
    expect(new Set(r.map((c) => c.id)).size).toBe(6)
    for (const t of ['JEWISH', 'CHRISTIAN', 'ISLAMIC']) expect(r.filter((c) => c.tradition === t)).toHaveLength(2)
  })

  it('differs between rounds and repeats deterministically', () => {
    expect(pickRound(pool, 1).map((c) => c.id)).not.toEqual(pickRound(pool, 0).map((c) => c.id))
    expect(pickRound(pool, 3)).toEqual(pickRound(pool, 3))
  })

  it('copes with a tradition that has no statements', () => {
    const r = pickRound(pool.filter((c) => c.tradition !== 'ISLAMIC'), 0)
    expect(r.every((c) => c.tradition !== 'ISLAMIC')).toBe(true)
    expect(r).toHaveLength(4)
  })
})
