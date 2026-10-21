import { describe, expect, it } from 'vitest'
import { forceLayout } from './force-layout'

const nodes = ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({ id }))
const links = [{ a: 'a', b: 'b' }, { a: 'b', b: 'c' }, { a: 'd', b: 'e' }, { a: 'e', b: 'f' }]

describe('forceLayout', () => {
  const out = forceLayout(nodes, links, 800, 600)
  const at = (id: string) => out.find((p) => p.id === id)!
  const dist = (p: string, q: string) => Math.hypot(at(p).x - at(q).x, at(p).y - at(q).y)

  it('places every node inside the frame with finite coordinates', () => {
    expect(out).toHaveLength(6)
    for (const p of out) {
      expect(Number.isFinite(p.x) && Number.isFinite(p.y)).toBe(true)
      expect(p.x).toBeGreaterThanOrEqual(0); expect(p.x).toBeLessThanOrEqual(800)
      expect(p.y).toBeGreaterThanOrEqual(0); expect(p.y).toBeLessThanOrEqual(600)
    }
  })

  it('is deterministic', () => {
    expect(forceLayout(nodes, links, 800, 600)).toEqual(out)
  })

  it('pulls linked nodes closer than unlinked ones', () => {
    expect(dist('a', 'b')).toBeLessThan(dist('a', 'f'))
    expect(dist('d', 'e')).toBeLessThan(dist('c', 'd'))
  })

  it('ignores links to unknown nodes and handles an empty graph', () => {
    expect(forceLayout([], [], 100, 100)).toEqual([])
    expect(forceLayout(nodes, [{ a: 'a', b: 'zzz' }], 800, 600)).toHaveLength(6)
  })

  it('keeps nodes apart even when all start in one spot', () => {
    const same = forceLayout([{ id: 'x' }, { id: 'y' }], [], 400, 300)
    expect(Math.hypot(same[0].x - same[1].x, same[0].y - same[1].y)).toBeGreaterThan(20)
  })
})
