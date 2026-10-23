import { describe, expect, it } from 'vitest'
import { lintProposal } from './lint'

describe('lintProposal', () => {
  it('accepts an attributed, descriptive claim', () => {
    expect(lintProposal('Jewish tradition holds that Abraham was called to leave his father’s house (Genesis 12:1).').ok).toBe(true)
  })

  it('does not block legitimate uses of words like false and wrong', () => {
    expect(lintProposal('The Torah warns against a false prophet who leads people to other gods (Deuteronomy 13:2).').ok).toBe(true)
    expect(lintProposal('Muslim scholars hold that the earlier scriptures were not wrong in origin but altered in transmission.').ok).toBe(true)
  })

  it('turns away wording that adjudicates between traditions', () => {
    const result = lintProposal('Obviously Islam is the one true religion.')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reasons.length).toBeGreaterThanOrEqual(2)
  })

  it('is case- and whitespace-insensitive', () => {
    expect(lintProposal('EVERYONE   KNOWS this.').ok).toBe(false)
  })

  it('explains how to fix the wording', () => {
    const result = lintProposal('So-called prophets.')
    expect(!result.ok && result.reasons[0]).toMatch(/attribute/)
  })
})
