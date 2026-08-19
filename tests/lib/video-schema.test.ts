import { describe, it, expect } from 'vitest'
import { youtubeIdSchema, extractYoutubeId, createVideoSchema } from '@/lib/schemas/video'

const VALID_ID = 'dQw4w9WgXcQ'

describe('youtubeIdSchema', () => {
  it('accepts a well-formed id', () => {
    expect(youtubeIdSchema.safeParse(VALID_ID).success).toBe(true)
    expect(youtubeIdSchema.safeParse('_-Aa09Zz123').success).toBe(true)
  })

  it.each([
    ['too short', 'abc'],
    ['too long', 'dQw4w9WgXcQxx'],
    ['empty', ''],
    ['quote break-out', 'abc" onload=x'],
    ['tag injection', '"><script>alert(1)</script>'],
    ['path traversal', '../../etc/passwd'],
    ['javascript url', 'javascript:alert(1)'],
    ['whitespace padded', ' dQw4w9WgXcQ '],
    ['query smuggling', 'dQw4w9WgX?a=1'],
  ])('rejects %s', (_label, value) => {
    expect(youtubeIdSchema.safeParse(value).success).toBe(false)
  })
})

describe('extractYoutubeId', () => {
  it.each([
    ['bare id', VALID_ID],
    ['watch url', `https://www.youtube.com/watch?v=${VALID_ID}`],
    ['watch url with extra params', `https://www.youtube.com/watch?list=PL1&v=${VALID_ID}&t=30`],
    ['short url', `https://youtu.be/${VALID_ID}`],
    ['embed url', `https://www.youtube.com/embed/${VALID_ID}`],
    ['nocookie embed', `https://www.youtube-nocookie.com/embed/${VALID_ID}`],
    ['shorts url', `https://www.youtube.com/shorts/${VALID_ID}`],
    ['padded input', `  https://youtu.be/${VALID_ID}  `],
  ])('extracts the id from a %s', (_label, input) => {
    expect(extractYoutubeId(input)).toBe(VALID_ID)
  })

  it.each([
    ['a non-YouTube url', 'https://example.com/watch?v=dQw4w9WgXcQ1'],
    ['an empty string', ''],
    ['a malicious string', '"><iframe src=evil>'],
    ['a truncated id', 'https://youtu.be/abc'],
  ])('returns null for %s', (_label, input) => {
    expect(extractYoutubeId(input)).toBeNull()
  })

  it('never returns a value that fails id validation', () => {
    const inputs = [
      VALID_ID,
      `https://youtu.be/${VALID_ID}`,
      'garbage',
      '"><script>',
      'https://youtube.com/watch?v=' + 'x'.repeat(50),
    ]
    for (const input of inputs) {
      const id = extractYoutubeId(input)
      if (id !== null) expect(youtubeIdSchema.safeParse(id).success).toBe(true)
    }
  })
})

describe('createVideoSchema', () => {
  const base = {
    youtubeId: VALID_ID,
    title: 'A lecture on covenant',
    channelName: 'Example University',
    editorNote: 'Included because it surveys the covenant texts without advocating a reading.',
  }

  it('accepts a complete record', () => {
    expect(createVideoSchema.safeParse(base).success).toBe(true)
  })

  it('requires a substantive editor note', () => {
    // "good video" must not pass — inclusion has to be justified in writing.
    expect(createVideoSchema.safeParse({ ...base, editorNote: 'good video' }).success).toBe(false)
    expect(createVideoSchema.safeParse({ ...base, editorNote: '' }).success).toBe(false)
  })

  it('rejects an unknown tradition', () => {
    expect(
      createVideoSchema.safeParse({ ...base, perspectiveTradition: 'BUDDHIST' }).success,
    ).toBe(false)
  })

  it('defaults both visibility flags to off rather than assuming publication', () => {
    const parsed = createVideoSchema.parse(base)
    expect(parsed.isPublished).toBeUndefined()
    expect(parsed.isKidsSafe).toBeUndefined()
  })
})
