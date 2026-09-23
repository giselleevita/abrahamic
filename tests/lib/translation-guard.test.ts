import { describe, it, expect } from 'vitest'
import { stripLicensedTranslations } from '@/lib/queries/translation-guard'

const LICENSED = { name: 'KJV', text: 'In the beginning', isDefault: true }
const ALLOWED = { name: 'Hebrew (MT)', text: 'בְּרֵאשִׁית', isDefault: false }

describe('stripLicensedTranslations', () => {
  it('filters a top-level translations array', () => {
    const result = stripLicensedTranslations({ translations: [LICENSED, ALLOWED] })
    expect(result.translations).toEqual([ALLOWED])
  })

  it('filters translations nested under claim → verses → verse', () => {
    // Mirrors the include shape used across the app, e.g. src/app/page.tsx:63
    const claims = [
      {
        id: 1,
        verses: [{ verse: { referenceKey: 'GEN.1.1', translations: [LICENSED, ALLOWED] } }],
      },
    ]
    const result = stripLicensedTranslations(claims)
    expect(result[0].verses[0].verse.translations).toEqual([ALLOWED])
  })

  it('filters both sides of a verse-link candidate', () => {
    const candidate = {
      verseA: { translations: [LICENSED] },
      verseB: { translations: [ALLOWED, LICENSED] },
    }
    const result = stripLicensedTranslations(candidate)
    expect(result.verseA.translations).toEqual([])
    expect(result.verseB.translations).toEqual([ALLOWED])
  })

  it('returns the identical reference when nothing needs filtering', () => {
    const input = { id: 1, verses: [{ verse: { translations: [ALLOWED] } }] }
    expect(stripLicensedTranslations(input)).toBe(input)
  })

  it('preserves Date instances rather than traversing them', () => {
    const createdAt = new Date('2026-01-01T00:00:00Z')
    const result = stripLicensedTranslations({ createdAt, translations: [LICENSED] })
    expect(result.createdAt).toBe(createdAt)
    expect(result.createdAt instanceof Date).toBe(true)
  })

  it('passes through null and primitive results untouched', () => {
    expect(stripLicensedTranslations(null)).toBeNull()
    expect(stripLicensedTranslations(42)).toBe(42)
    expect(stripLicensedTranslations('text')).toBe('text')
  })

  it('ignores a translations key that does not hold translation rows', () => {
    const input = { translations: [1, 2, 3] }
    expect(stripLicensedTranslations(input)).toBe(input)
  })
})
