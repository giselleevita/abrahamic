import { describe, expect, it } from 'vitest'
import { BIG_LINKS, BIG_NODES, PROPHET_NOTES, PROPHET_ORDER } from './big-picture'

describe('big picture overview data', () => {
  const ids = new Set(BIG_NODES.map((n) => n.id))

  it('has unique node ids and every link joins two known nodes', () => {
    expect(ids.size).toBe(BIG_NODES.length)
    for (const l of BIG_LINKS) {
      expect(ids.has(l.from), `${l.from} -> ${l.to}`).toBe(true)
      expect(ids.has(l.to), `${l.from} -> ${l.to}`).toBe(true)
    }
  })

  it('gives every link a source sentence', () => {
    for (const l of BIG_LINKS) expect(l.source.length).toBeGreaterThan(15)
  })

  it('never draws a held genealogy link as recorded fact', () => {
    const held = [['david', 'jesus'], ['kedar', 'muhammad']]
    for (const [from, to] of held) {
      const link = BIG_LINKS.find((l) => l.from === from && l.to === to)!
      expect(link.kind).toBe('tradition')
      expect(link.source).toMatch(/According to/)
    }
  })

  it('words every tradition link as that tradition\'s own account', () => {
    for (const l of BIG_LINKS.filter((x) => x.kind === 'tradition' && x.source.startsWith('According')))
      expect(l.source).toMatch(/tradition/)
  })

  it('keeps nodes from overlapping each other', () => {
    const box = (n: (typeof BIG_NODES)[number]) => {
      const w = n.kind === 'religion' ? 190 : n.compact ? 108 : 132
      const h = n.kind === 'religion' ? 62 : n.compact ? 44 : 46
      return { l: n.x - w / 2, r: n.x + w / 2, t: n.y - h / 2, b: n.y + h / 2 }
    }
    for (let i = 0; i < BIG_NODES.length; i++)
      for (let j = i + 1; j < BIG_NODES.length; j++) {
        const a = box(BIG_NODES[i]), b = box(BIG_NODES[j])
        const overlap = a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b
        expect(overlap, `${BIG_NODES[i].id} overlaps ${BIG_NODES[j].id}`).toBe(false)
      }
  })

  it('explains every prophet in the panel', () => {
    for (const id of PROPHET_ORDER) {
      expect(ids.has(id)).toBe(true)
      expect(PROPHET_NOTES[id].length).toBeGreaterThan(20)
    }
  })

  it('does not call a relative a descendant', () => {
    for (const l of BIG_LINKS.filter((x) => x.kind === 'kin')) expect(l.source).not.toMatch(/descend/i)
  })
})
