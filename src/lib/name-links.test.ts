import { describe, expect, it } from 'vitest'
import { findNameMatches, type NameFigure } from './name-links'

const abraham: NameFigure = { slug: 'abraham', name: 'Abraham', aliases: [{ tradition: 'ISLAMIC', name: 'Ibrahim' }, { tradition: 'JEWISH', name: 'Avraham' }] }
const moses: NameFigure = { slug: 'moses', name: 'Moses', aliases: [{ tradition: 'ISLAMIC', name: 'Musa' }] }
const eve: NameFigure = { slug: 'eve', name: 'Eve', aliases: [] }
const figs = [abraham, moses, eve]
const linked = (t: string, ex: string[] = []) => findNameMatches(t, figs, ex).filter((s) => 'figure' in s).map((s) => s.text)

describe('findNameMatches', () => {
  it('links the first mention of a person under any of their names', () => {
    expect(linked('God spoke to Ibrahim, and Abraham obeyed. Musa listened.')).toEqual(['Ibrahim', 'Musa'])
  })

  it('does not match inside longer words and keeps the original text intact', () => {
    const segs = findNameMatches('Abrahamic faiths remember Abraham.', figs)
    expect(segs.map((s) => s.text).join('')).toBe('Abrahamic faiths remember Abraham.')
    expect(segs.filter((s) => 'figure' in s).map((s) => s.text)).toEqual(['Abraham'])
  })

  it('ignores very short names and excluded people', () => {
    expect(linked('Eve and Moses')).toEqual(['Moses'])
    expect(linked('Moses and Abraham', ['moses'])).toEqual(['Abraham'])
  })

  it('skips a name shared by two different people instead of guessing', () => {
    const a: NameFigure = { slug: 'a', name: 'Miriam', aliases: [] }
    const b: NameFigure = { slug: 'b', name: 'Mary', aliases: [{ tradition: 'JEWISH', name: 'Miriam' }] }
    expect(findNameMatches('Miriam sang.', [a, b]).some((s) => 'figure' in s)).toBe(false)
  })

  it('returns the text unchanged when nothing matches', () => {
    expect(findNameMatches('Nothing here.', figs)).toEqual([{ text: 'Nothing here.' }])
  })
})
