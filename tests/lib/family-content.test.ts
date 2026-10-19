import { describe, it, expect } from 'vitest'
import { MOTHER_REFERENCES, FAMILY_HOLD, normalizeFamilyEntry } from '../../prisma/seed/family-policy'
import { familySeedEntries } from '../../prisma/seed/relationships'
import { GLOSSARY } from '@/lib/glossary'

describe('source-checked content corrections', () => {
  it.each(MOTHER_REFERENCES)('classifies $from → $to as a parent with an exact source', (ref) => {
    expect(normalizeFamilyEntry({ from: ref.from, to: ref.to, type: 'SPOUSE', notes: ref.note })).toMatchObject({ type: 'PARENT', verseKey: ref.key, notes: ref.note })
  })
  it('withholds spiritual, uncertain-identity and unverified lineage seed records', () => {
    const rows = familySeedEntries.map(normalizeFamilyEntry)
    for (const [from, to] of [['jesus', 'peter'], ['abraham', 'lot'], ['jacob-nt', 'joseph'], ['joseph', 'jesus'], ['kedar', 'adnan']]) {
      const row = rows.find((entry) => entry.from === from && entry.to === to)
      expect(row, `${from} → ${to}`).toBeDefined()
      expect(row?.notes).toMatch(/^\[EDITORIAL HOLD\] /)
    }
    expect(rows.filter((row) => row.notes?.startsWith(FAMILY_HOLD)).length).toBeGreaterThan(20)
  })
  it('preserves valid records and removes the incorrect Quran attribution', () => {
    const valid = { from: 'abraham', to: 'isaac', type: 'PARENT', verseKey: 'abraham-isaac' }
    expect(normalizeFamilyEntry(valid)).toEqual(valid)
    expect(normalizeFamilyEntry({ from: 'ishmael', to: 'kedar', type: 'PARENT', verseKey: 'ishmael-kedar' }).notes).toBe('Genesis 25:13 records Kedar among the sons of Ishmael.')
  })
  it('qualifies glossary summaries and supplies inspectable sources', () => {
    const entries = GLOSSARY.flatMap((section) => section.entries)
    const modified = entries.find((entry) => entry.term === 'Modified')!
    expect(modified.note).toMatch(/does not name the son/)
    expect(modified.sources?.some((source) => source.href.includes('quran.com/37/102'))).toBe(true)
    const messiah = entries.find((entry) => entry.term.startsWith('Messiah'))!
    expect(JSON.stringify(messiah)).toContain('3/45')
    expect(entries.find((entry) => entry.term === 'Original Sin')?.sources).toHaveLength(2)
  })
})
