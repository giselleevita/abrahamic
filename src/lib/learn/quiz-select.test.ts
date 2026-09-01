import { describe, expect, it } from 'vitest'
import { seededShuffle, selectQuestions } from './quiz-select'

const pool = Array.from({ length: 10 }, (_, i) => i)

describe('seededShuffle', () => {
  it('is deterministic for a given seed', () => {
    expect(seededShuffle(pool, 1)).toEqual(seededShuffle(pool, 1))
  })

  it('differs between seeds', () => {
    expect(seededShuffle(pool, 1)).not.toEqual(seededShuffle(pool, 2))
  })

  it('preserves every element', () => {
    expect([...seededShuffle(pool, 7)].sort((a, b) => a - b)).toEqual(pool)
  })

  it('does not mutate the input', () => {
    const original = [...pool]
    seededShuffle(pool, 3)
    expect(pool).toEqual(original)
  })
})

describe('selectQuestions', () => {
  it('returns the requested count', () => {
    expect(selectQuestions(pool, 5, 0)).toHaveLength(5)
  })

  it('never returns more than the pool holds', () => {
    expect(selectQuestions([1, 2], 5, 0)).toHaveLength(2)
  })

  it('gives a different set on a retry', () => {
    expect(selectQuestions(pool, 5, 0)).not.toEqual(selectQuestions(pool, 5, 1))
  })

  it('is stable for the same attempt, so re-render does not reshuffle', () => {
    expect(selectQuestions(pool, 5, 3)).toEqual(selectQuestions(pool, 5, 3))
  })

  it('returns nothing for a non-positive count', () => {
    expect(selectQuestions(pool, 0, 0)).toEqual([])
  })
})
