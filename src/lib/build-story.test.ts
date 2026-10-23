import { describe, expect, it } from 'vitest'
import { pickStoryRound, placeForEvents, scramble, type StoryEvent } from './build-story'

const events: StoryEvent[] = Array.from({ length: 12 }, (_, i) => ({ slug: `e${i}`, name: `Event ${i}`, order: i, placeId: 'p' }))

describe('build-story helpers', () => {
  it('maps every mapped timeline event to exactly one place', () => {
    const m = placeForEvents()
    expect(m.get('burning-bush')).toBe('sinai')
    expect(m.get('hijra')).toBe('medina')
    expect(m.size).toBeGreaterThan(10)
  })

  it('picks five spread-out events, and a different set on another round', () => {
    const a = pickStoryRound(events, 0)
    expect(a).toHaveLength(5)
    expect(new Set(a.map((e) => e.slug)).size).toBe(5)
    expect(pickStoryRound(events, 1).map((e) => e.slug)).not.toEqual(a.map((e) => e.slug))
  })

  it('returns everything when there are fewer events than a round', () => {
    expect(pickStoryRound(events.slice(0, 3), 0)).toHaveLength(3)
  })

  it('scrambles into a real permutation that is never the original order', () => {
    for (let r = 0; r < 6; r++) {
      const s = scramble(events.slice(0, 5), r)
      expect(s.map((e) => e.slug).sort()).toEqual(events.slice(0, 5).map((e) => e.slug).sort())
      expect(s.map((e) => e.slug)).not.toEqual(events.slice(0, 5).map((e) => e.slug))
    }
  })
})
