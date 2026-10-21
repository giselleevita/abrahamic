import { describe, expect, it } from 'vitest'
import { BIG_LINKS, BIG_NODES } from './big-picture'

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
})
