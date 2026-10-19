import { isSameOrigin } from '@/lib/same-origin'
import { describe, expect, it } from 'vitest'
import { DEFAULT_READING, activeEdition, parseReading } from '@/lib/experience/preferences'
import { parseSaved, EMPTY_SAVED } from '@/lib/experience/saved'
import { correctionSchema, validCorrectionPath } from '@/lib/schemas/corrections'
import { verseReaderHref } from '@/lib/verse-links'

describe('reading and saved data', () => {
  it('falls back to an available default edition without changing its preference', () => {
    expect(activeEdition('Missing', [{ name: 'Arabic', isDefault: true }])).toBe('Arabic')
    expect(parseReading('{"version":1,"size":999,"spacious":"yes"}')).toEqual(DEFAULT_READING)
  })
  it('drops foreign destinations, duplicates, and excerpts from saved data', () => {
    const item = { id: 'comparison:1', label: 'Abraham', kind: 'comparison', href: '/comparisons/1', text: 'Do not store scripture' }
    const parsed = parseSaved(JSON.stringify({ version: 1, items: [item, item, { ...item, id: 'evil', href: '//evil.test' }] }))
    expect(parsed.items).toEqual([{ id: 'comparison:1', label: 'Abraham', kind: 'comparison', href: '/comparisons/1' }])
    expect(parseSaved('{"version":9,"items":[]}')).toEqual(EMPTY_SAVED)
  })
  it('keeps Hebrew numbering separate in canonical links', () => {
    expect(verseReaderHref('torah', { book: 'Genesis', chapter: 22, verse: 2, versification: 'MASORETIC' })).toBe('/sources/torah/read?book=Genesis&chapter=22#h-2')
  })
})

describe('correction context', () => {
  it.each(['/kids', '/admin', '//evil.test', '/comparisons/1?redirect=evil', '/sources/torah/read?chapter=0', '/sources/torah/read?book=Genesis&chapter=1&extra=1', '/sources/torah/read#v-1'])('rejects unsupported context %s', (path) => expect(validCorrectionPath(path)).toBe(false))
  it.each(['/comparisons/1', '/sources/torah/read', '/sources/torah/read?book=Genesis&chapter=1'])('accepts %s', (path) => expect(validCorrectionPath(path)).toBe(true))
  it('enforces description length and known categories', () => {
    expect(correctionSchema.safeParse({ pagePath: '/comparisons/1', category: 'SOURCE', description: 'too short' }).success).toBe(false)
    expect(correctionSchema.safeParse({ pagePath: '/comparisons/1', category: 'OTHER', description: 'A reference needs correcting here.' }).success).toBe(true)
  })
})

it('compares origin against the public host when Next normalizes the request URL', () => {
  expect(isSameOrigin(new Request('http://localhost:3100/api/corrections', { headers: { host: '127.0.0.1:3100', origin: 'http://127.0.0.1:3100' } }))).toBe(true)
  expect(isSameOrigin(new Request('http://localhost:3100/api/corrections', { headers: { host: '127.0.0.1:3100', origin: 'http://other.test' } }))).toBe(false)
})
