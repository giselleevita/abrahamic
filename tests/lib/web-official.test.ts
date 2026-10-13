import { describe, expect, it } from 'vitest'
import { parseOfficialWebVerse, OFFICIAL_WEB_SPEC } from '../../scripts/import/adapters/web-official'

describe('official WEB archive parser', () => {
  it('maps canonical book codes and verse numbers', () => {
    expect(parseOfficialWebVerse('GEN 2:7 The LORD God formed man.')).toMatchObject({ book: 'Genesis', bookNumber: 1, chapter: 2, verse: 7 })
    expect(parseOfficialWebVerse('1CO 13:4 Love is patient.')).toMatchObject({ book: '1 Corinthians', bookNumber: 46, chapter: 13, verse: 4 })
    expect(parseOfficialWebVerse('REV 22:21 The grace of the Lord Jesus Christ be with all the saints.')).toMatchObject({ book: 'Revelation', bookNumber: 66, chapter: 22, verse: 21 })
  })

  it('rejects unknown or out-of-range references', () => {
    expect(parseOfficialWebVerse('XYZ 1:1 Unknown')).toBeNull()
    expect(parseOfficialWebVerse('GEN 51:1 Impossible')).toBeNull()
    expect(parseOfficialWebVerse('GEN 1:0 Impossible')).toBeNull()
  })

  it('records official public-domain provenance', () => {
    expect(OFFICIAL_WEB_SPEC.licenseCode).toBe('PD')
    expect(OFFICIAL_WEB_SPEC.sourceUrl).toBe('https://ebible.org/find/show.php?id=engwebp')
  })
})
