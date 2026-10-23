import { describe, expect, it } from 'vitest'
import { addToTrail, parseTrail, TRAIL_MAX, type TrailItem } from './trail'

const item = (n: number): TrailItem => ({ href: `/figures/p${n}`, label: `Person ${n}`, kind: 'figure' })

describe('exploration trail', () => {
  it('puts the newest visit first and moves a revisit to the front without duplicating it', () => {
    const t = addToTrail(addToTrail(addToTrail([], item(1)), item(2)), item(1))
    expect(t.map((x) => x.href)).toEqual(['/figures/p1', '/figures/p2'])
  })

  it('keeps only the most recent visits', () => {
    let t: TrailItem[] = []
    for (let i = 0; i < TRAIL_MAX + 5; i++) t = addToTrail(t, item(i))
    expect(t).toHaveLength(TRAIL_MAX)
    expect(t[0].href).toBe(`/figures/p${TRAIL_MAX + 4}`)
  })

  it('drops malformed or off-site entries from storage', () => {
    const raw = JSON.stringify([
      item(1),
      { href: 'https://evil.example', label: 'x', kind: 'figure' },
      { href: '/figures/a', label: 5, kind: 'figure' },
      { href: '/figures/b', label: 'B', kind: 'other' },
      null,
    ])
    expect(parseTrail(raw).map((x) => x.href)).toEqual(['/figures/p1'])
    expect(parseTrail('{"not":"a list"}')).toEqual([])
  })
})
