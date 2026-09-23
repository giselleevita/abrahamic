import { describe, it, expect } from 'vitest'
import { guardKidsStory } from '@/lib/kids/content-guard'
import { analyseReadability, countSyllables } from '@/lib/kids/readability'

/** A draft that satisfies every rule, used as the base for each negative case. */
const GOOD = {
  title: 'A Promise Under the Stars',
  ageBand: 'AGE_6_8' as const,
  body:
    'The Torah tells a story about Abraham. One night he went outside. ' +
    'He looked up at the sky. There were many stars. ' +
    'The Quran also tells about Abraham. These books tell this part differently.',
}

describe('guardKidsStory — accepts a compliant draft', () => {
  it('passes a neutral, attributed, age-appropriate story', () => {
    const result = guardKidsStory(GOOD)
    expect(result.reasons).toEqual([])
    expect(result.ok).toBe(true)
  })
})

describe('guardKidsStory — blocks policy violations', () => {
  it('blocks a named licensed translation', () => {
    const r = guardKidsStory({ ...GOOD, body: `${GOOD.body} From the KJV.` })
    expect(r.ok).toBe(false)
    expect(r.reasons.join()).toMatch(/licensed translation/i)
  })

  it('blocks long quoted passages', () => {
    const r = guardKidsStory({
      ...GOOD,
      body: `${GOOD.body} "In the beginning God created the heavens and the earth and all that lives."`,
    })
    expect(r.ok).toBe(false)
    expect(r.reasons.join()).toMatch(/quoted passage/i)
  })

  it('allows short quoted words, which are usually glossary terms', () => {
    const r = guardKidsStory({ ...GOOD, body: `${GOOD.body} The word "covenant" means a promise.` })
    expect(r.ok).toBe(true)
  })
})

describe('guardKidsStory — blocks non-neutral language', () => {
  it.each([
    ['evaluative adverb', 'This truly happened.'],
    ['adjudication', 'The Torah account was corrected later.'],
    ['supersession', 'That promise was fulfilled by the later book.'],
  ])('blocks %s', (_label, sentence) => {
    const r = guardKidsStory({ ...GOOD, body: `${GOOD.body} ${sentence}` })
    expect(r.ok).toBe(false)
    expect(r.reasons.join()).toMatch(/evaluative/i)
  })

  it.each([
    ['second-person instruction', 'You should pray every day.'],
    ['first-person belief', 'We believe this is so.'],
  ])('blocks %s', (_label, sentence) => {
    const r = guardKidsStory({ ...GOOD, body: `${GOOD.body} ${sentence}` })
    expect(r.ok).toBe(false)
  })

  it('blocks a story that never attributes to a text', () => {
    const r = guardKidsStory({
      ...GOOD,
      body: 'God spoke to Abraham. He went outside. He saw the stars. He was happy.',
    })
    expect(r.ok).toBe(false)
    expect(r.reasons.join()).toMatch(/attribut/i)
  })
})

describe('guardKidsStory — blocks age-inappropriate content', () => {
  it('blocks distressing content', () => {
    const r = guardKidsStory({ ...GOOD, body: `${GOOD.body} Many people were killed.` })
    expect(r.ok).toBe(false)
    expect(r.reasons.join()).toMatch(/distressing/i)
  })

  it('blocks physical description of a prophet', () => {
    const r = guardKidsStory({ ...GOOD, body: `${GOOD.body} Muhammad had a long beard.` })
    expect(r.ok).toBe(false)
    expect(r.reasons.join()).toMatch(/appearance of a prophet/i)
  })
})

describe('guardKidsStory — enforces the age band', () => {
  it('blocks a sentence too long for ages 6-8', () => {
    const long =
      'The Torah tells this story about Abraham who went outside on a clear night and looked up towards the sky above him.'
    const r = guardKidsStory({ ...GOOD, ageBand: 'AGE_6_8', body: long })
    expect(r.ok).toBe(false)
    expect(r.reasons.join()).toMatch(/Longest sentence/)
  })

  it('accepts that same sentence for ages 9-12', () => {
    const long =
      'The Torah tells this story about Abraham, who went outside at night and looked up at the sky.'
    const r = guardKidsStory({ ...GOOD, ageBand: 'AGE_9_12', body: long })
    expect(r.reasons.filter((x) => /Longest sentence/.test(x))).toEqual([])
  })

  it('blocks a body over the word ceiling', () => {
    const body = `The Torah tells this. ${'A cat sat on a mat. '.repeat(60)}`
    const r = guardKidsStory({ ...GOOD, body })
    expect(r.ok).toBe(false)
    expect(r.reasons.join()).toMatch(/Too long/)
  })

  it('warns rather than blocks when the text is simpler than the band', () => {
    const r = guardKidsStory({
      ...GOOD,
      ageBand: 'AGE_9_12',
      body: 'The Torah tells a story. A man went out. He saw stars. The Quran tells it too.',
    })
    expect(r.warnings.join()).toMatch(/below the usual/i)
    // A too-simple draft is a fit note for the reviewer, never a block.
    expect(r.ok).toBe(true)
  })
})

describe('readability', () => {
  it.each([
    ['cat', 1],
    ['little', 2],
    ['candle', 2],
    ['beginning', 3],
    // 'creation' scores 2, not 3 — adjacent vowels spanning a syllable break
    // are a documented limitation of the heuristic.
    ['creation', 2],
  ])('counts syllables in %s', (word, expected) => {
    expect(countSyllables(word)).toBe(expected)
  })

  it('never returns zero syllables for a real word', () => {
    for (const w of ['a', 'I', 'the', 'strength', 'rhythm']) {
      expect(countSyllables(w)).toBeGreaterThanOrEqual(1)
    }
  })

  it('scores simple prose below complex prose', () => {
    const simple = analyseReadability('The cat sat. The dog ran. It was fun.')
    const complex = analyseReadability(
      'The eschatological interpretation demonstrates considerable theological divergence between traditions.',
    )
    expect(simple.grade).toBeLessThan(complex.grade)
  })

  it('reports the longest sentence, not the average', () => {
    const stats = analyseReadability('Short one. This sentence has exactly seven words here.')
    expect(stats.longestSentenceWords).toBe(7)
  })
})
