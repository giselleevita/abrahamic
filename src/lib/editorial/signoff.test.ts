import { describe, expect, it } from 'vitest'
import {
  describeState,
  readSummary,
  requiredTraditionsFor,
  reviewKindFor,
  summarizeSignoff,
  unmetSignoffs,
  type ReviewRow,
} from './signoff'

const row = (tradition: ReviewRow['tradition'], verdict: ReviewRow['verdict'], kind: ReviewRow['kind'] = 'TRADITION_MEMBER'): ReviewRow => ({
  tradition, verdict, kind,
})

describe('requiredTraditionsFor', () => {
  it('maps a single-tradition source to that tradition', () => {
    expect(requiredTraditionsFor('ISLAMIC')).toEqual(['ISLAMIC'])
    expect(requiredTraditionsFor('JEWISH')).toEqual(['JEWISH'])
  })
  it('requires both Jewish and Christian review for the shared Hebrew Bible', () => {
    expect(requiredTraditionsFor('SHARED')).toEqual(['JEWISH', 'CHRISTIAN'])
  })
  it('lets an editor add traditions but never remove the source tradition', () => {
    expect(requiredTraditionsFor('ISLAMIC', ['JEWISH'])).toEqual(['JEWISH', 'ISLAMIC'])
    expect(requiredTraditionsFor('ISLAMIC', [])).toEqual(['ISLAMIC'])
  })
})

describe('unmetSignoffs (mirror of the database gate)', () => {
  it('blocks a claim with no required traditions', () => {
    expect(unmetSignoffs([], [], false).allowed).toBe(false)
  })
  it('lists every tradition still missing', () => {
    expect(unmetSignoffs(['JEWISH', 'CHRISTIAN'], [row('JEWISH', 'ACCURATE')], false)).toEqual({
      allowed: false, missing: ['CHRISTIAN'], blockedByConcern: false,
    })
  })
  it('allows publication when every required tradition is ACCURATE', () => {
    expect(unmetSignoffs(['JEWISH', 'CHRISTIAN'], [row('JEWISH', 'ACCURATE'), row('CHRISTIAN', 'ACCURATE')], false).allowed).toBe(true)
  })
  it('does not let one tradition satisfy another', () => {
    expect(unmetSignoffs(['JEWISH'], [row('ISLAMIC', 'ACCURATE')], false).allowed).toBe(false)
  })
  it('lets the project editor stand in for the gate', () => {
    expect(unmetSignoffs(['ISLAMIC'], [row('ISLAMIC', 'ACCURATE', 'PROJECT_EDITOR')], false).allowed).toBe(true)
  })
  it('blocks on an unresolved objection even when another reviewer approved', () => {
    const reviews = [row('JEWISH', 'ACCURATE'), row('JEWISH', 'OBJECTS')]
    expect(unmetSignoffs(['JEWISH'], reviews, false)).toMatchObject({ allowed: false, blockedByConcern: true })
  })
  it('blocks on a change request', () => {
    expect(unmetSignoffs(['JEWISH'], [row('JEWISH', 'NEEDS_CHANGES')], false).allowed).toBe(false)
  })
  it('allows contested publication only for traditions that actually reviewed', () => {
    const reviews = [row('JEWISH', 'OBJECTS'), row('CHRISTIAN', 'ACCURATE')]
    expect(unmetSignoffs(['JEWISH', 'CHRISTIAN'], reviews, true).allowed).toBe(true)
    expect(unmetSignoffs(['JEWISH', 'CHRISTIAN'], [row('CHRISTIAN', 'ACCURATE')], true)).toMatchObject({ allowed: false, missing: ['JEWISH'] })
  })
})

describe('summarizeSignoff', () => {
  it('distinguishes a member review from a project-editor check', () => {
    const summary = summarizeSignoff(['JEWISH', 'ISLAMIC'], [row('JEWISH', 'ACCURATE'), row('ISLAMIC', 'ACCURATE', 'PROJECT_EDITOR')], false, 3)
    expect(summary).toEqual({ revision: 3, states: { JEWISH: 'MEMBER', ISLAMIC: 'EDITOR' } })
  })
  it('prefers a member review over a project-editor check for the same tradition', () => {
    const summary = summarizeSignoff(['ISLAMIC'], [row('ISLAMIC', 'ACCURATE', 'PROJECT_EDITOR'), row('ISLAMIC', 'ACCURATE')], false, 1)
    expect(summary.states.ISLAMIC).toBe('MEMBER')
  })
  it('lets any concern outrank approval', () => {
    expect(summarizeSignoff(['JEWISH'], [row('JEWISH', 'ACCURATE'), row('JEWISH', 'OBJECTS')], false, 1).states.JEWISH).toBe('CHANGES')
    expect(summarizeSignoff(['JEWISH'], [row('JEWISH', 'ACCURATE'), row('JEWISH', 'OBJECTS')], true, 1).states.JEWISH).toBe('CONTESTED')
  })
  it('marks unreviewed traditions as awaiting', () => {
    expect(summarizeSignoff(['CHRISTIAN'], [], false, 1).states.CHRISTIAN).toBe('AWAITING')
  })
})

describe('readSummary', () => {
  it('treats a cached summary from an older revision as awaiting', () => {
    const stale = { revision: 1, states: { ISLAMIC: 'MEMBER' } }
    expect(readSummary(['ISLAMIC'], stale, 2).states.ISLAMIC).toBe('AWAITING')
  })
  it('ignores malformed or missing data', () => {
    expect(readSummary(['ISLAMIC'], null, 1).states.ISLAMIC).toBe('AWAITING')
    expect(readSummary(['ISLAMIC'], 'garbage', 1).states.ISLAMIC).toBe('AWAITING')
    expect(readSummary(['ISLAMIC'], { revision: 1, states: { ISLAMIC: 'HACKED' } }, 1).states.ISLAMIC).toBe('AWAITING')
  })
  it('only trusts states for traditions the claim requires', () => {
    expect(readSummary(['ISLAMIC'], { revision: 1, states: { ISLAMIC: 'MEMBER', JEWISH: 'MEMBER' } }, 1).states).toEqual({ ISLAMIC: 'MEMBER' })
  })
})

describe('reviewKindFor', () => {
  it('lets a member review only their own tradition', () => {
    const actor = { isAdmin: false, reviewerTraditions: ['ISLAMIC'] as const }
    expect(reviewKindFor(actor, 'ISLAMIC')).toBe('TRADITION_MEMBER')
    expect(reviewKindFor(actor, 'JEWISH')).toBeNull()
  })
  it('records the administrator as the project editor for any tradition', () => {
    expect(reviewKindFor({ isAdmin: true, reviewerTraditions: [] }, 'JEWISH')).toBe('PROJECT_EDITOR')
  })
  it('prefers the member capacity when an administrator is also an approved member', () => {
    expect(reviewKindFor({ isAdmin: true, reviewerTraditions: ['ISLAMIC'] }, 'ISLAMIC')).toBe('TRADITION_MEMBER')
    expect(reviewKindFor({ isAdmin: true, reviewerTraditions: ['ISLAMIC'] }, 'JEWISH')).toBe('PROJECT_EDITOR')
  })
  it('gives nothing to someone who is neither', () => {
    expect(reviewKindFor({ isAdmin: false, reviewerTraditions: [] }, 'JEWISH')).toBeNull()
  })
})

describe('describeState', () => {
  it('never describes a project-editor check as a tradition review', () => {
    expect(describeState('JEWISH', 'EDITOR')).not.toMatch(/^Reviewed by a Judaism reviewer/)
    expect(describeState('JEWISH', 'EDITOR')).toContain('awaiting')
    expect(describeState('JEWISH', 'MEMBER')).toBe('Reviewed by a Judaism reviewer')
  })
})
