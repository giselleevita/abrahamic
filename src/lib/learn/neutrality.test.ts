import { describe, expect, it } from 'vitest'
import { isPublishable, lintQuestion, type QuestionDraft } from './neutrality'

const base: QuestionDraft = {
  kind: 'TRADITION_TEACHING',
  format: 'SINGLE_CHOICE',
  prompt: 'What does Islam teach about the crucifixion of Jesus?',
  explanation: 'The Quran states that it was made to appear so.',
  subjectTradition: 'ISLAMIC',
  isContested: false,
  hasProvenance: true,
  options: [
    { text: 'He was not crucified', isCorrect: true, optionTradition: 'ISLAMIC' },
    { text: 'He died on the cross', isCorrect: false, optionTradition: 'CHRISTIAN' },
  ],
}

const draft = (over: Partial<QuestionDraft> = {}): QuestionDraft => ({ ...base, ...over })
const codes = (d: QuestionDraft) => lintQuestion(d).map((f) => f.code)

describe('attribution', () => {
  it('accepts a properly attributed question', () => {
    expect(lintQuestion(draft())).toEqual([])
    expect(isPublishable(lintQuestion(draft()))).toBe(true)
  })

  it('blocks TRADITION_TEACHING with no subject tradition', () => {
    const flags = lintQuestion(draft({ subjectTradition: null }))
    expect(flags.map((f) => f.code)).toContain('MISSING_SUBJECT_TRADITION')
    expect(isPublishable(flags)).toBe(false)
  })

  it('blocks FIGURE_IDENTITY with no subject tradition', () => {
    expect(codes(draft({ kind: 'FIGURE_IDENTITY', subjectTradition: null }))).toContain(
      'MISSING_SUBJECT_TRADITION',
    )
  })

  it('blocks SHARED as a teaching holder', () => {
    expect(codes(draft({ subjectTradition: 'SHARED' }))).toContain('SUBJECT_TRADITION_SHARED')
  })

  it('warns when the stem never names the tradition it asks about', () => {
    const flags = lintQuestion(draft({ prompt: 'What is taught about the crucifixion?' }))
    const flag = flags.find((f) => f.code === 'UNATTRIBUTED_STEM')
    expect(flag?.severity).toBe('WARN')
    // lexical heuristic, so it must not block on its own
    expect(isPublishable(flags)).toBe(true)
  })
})

describe('truth-claim language', () => {
  it.each([
    'Which is true about the crucifixion?',
    'What actually happened to Jesus?',
    'The truth about the Trinity is which of these?',
    'Which religion is right about the afterlife?',
    'Did Jesus really die on the cross?',
  ])('blocks %j', (prompt) => {
    const flags = lintQuestion(draft({ prompt }))
    expect(flags.map((f) => f.code)).toContain('TRUTH_LANGUAGE')
    expect(isPublishable(flags)).toBe(false)
  })

  it('allows an attributive stem about the same subject', () => {
    expect(codes(draft({ prompt: 'What does Christianity teach about the resurrection?', subjectTradition: 'CHRISTIAN' })))
      .not.toContain('TRUTH_LANGUAGE')
  })
})

describe('contested material', () => {
  const contested = (over: Partial<QuestionDraft> = {}) =>
    draft({ isContested: true, ...over })

  it('blocks a kind that does not attribute every position', () => {
    expect(codes(contested({ kind: 'TERMINOLOGY', subjectTradition: null }))).toContain(
      'CONTESTED_KIND_NOT_ALLOWED',
    )
  })

  it('allows the attributive kinds', () => {
    for (const kind of ['TRADITION_TEACHING', 'DIVERGENCE_MAP', 'SOURCE_TEXT'] as const) {
      expect(codes(contested({ kind }))).not.toContain('CONTESTED_KIND_NOT_ALLOWED')
    }
  })

  it('blocks a distractor that neither names a tradition nor explains itself', () => {
    const flags = lintQuestion(contested({
      options: [
        { text: 'He was not crucified', isCorrect: true, optionTradition: 'ISLAMIC' },
        { text: 'He was never born', isCorrect: false },
      ],
    }))
    expect(flags.map((f) => f.code)).toContain('BARE_DISTRACTOR')
    expect(isPublishable(flags)).toBe(false)
  })

  it('accepts a distractor carrying a rationale instead of a tradition', () => {
    expect(codes(contested({
      options: [
        { text: 'He was not crucified', isCorrect: true, optionTradition: 'ISLAMIC' },
        { text: 'He was never born', isCorrect: false, rationale: 'No tradition holds this.' },
      ],
    }))).not.toContain('BARE_DISTRACTOR')
  })
})

describe('divergence maps', () => {
  const map = (options: QuestionDraft['options']) =>
    draft({ kind: 'DIVERGENCE_MAP', subjectTradition: null, options })

  it('blocks a map that omits a tradition', () => {
    expect(codes(map([
      { text: 'Judaism', isCorrect: false, optionTradition: 'JEWISH', presence: 'SILENT' },
      { text: 'Christianity', isCorrect: true, optionTradition: 'CHRISTIAN', presence: 'AFFIRMED' },
    ]))).toContain('PARTIAL_TRADITION_COVERAGE')
  })

  it('accepts a map covering all three', () => {
    expect(codes(map([
      { text: 'Judaism', isCorrect: false, optionTradition: 'JEWISH', presence: 'SILENT' },
      { text: 'Christianity', isCorrect: true, optionTradition: 'CHRISTIAN', presence: 'AFFIRMED' },
      { text: 'Islam', isCorrect: false, optionTradition: 'ISLAMIC', presence: 'REJECTED' },
    ]))).not.toContain('PARTIAL_TRADITION_COVERAGE')
  })
})

describe('answerability', () => {
  it('blocks when nothing is correct', () => {
    expect(codes(draft({ options: [{ text: 'a', isCorrect: false, optionTradition: 'ISLAMIC' }] })))
      .toContain('NO_CORRECT_OPTION')
  })

  it('blocks multiple correct options on SINGLE_CHOICE', () => {
    expect(codes(draft({
      options: [
        { text: 'a', isCorrect: true, optionTradition: 'ISLAMIC' },
        { text: 'b', isCorrect: true, optionTradition: 'CHRISTIAN' },
      ],
    }))).toContain('MULTIPLE_CORRECT_OPTIONS')
  })

  it('allows multiple correct options on MULTI_SELECT', () => {
    expect(codes(draft({
      format: 'MULTI_SELECT',
      options: [
        { text: 'a', isCorrect: true, optionTradition: 'ISLAMIC' },
        { text: 'b', isCorrect: true, optionTradition: 'CHRISTIAN' },
      ],
    }))).not.toContain('MULTIPLE_CORRECT_OPTIONS')
  })

  it('blocks a missing explanation', () => {
    expect(codes(draft({ explanation: '   ' }))).toContain('MISSING_EXPLANATION')
  })

  it('blocks a question with no provenance', () => {
    expect(codes(draft({ hasProvenance: false }))).toContain('MISSING_PROVENANCE')
  })
})

describe('isPublishable', () => {
  it('is false when any BLOCK is present', () => {
    expect(isPublishable([{ code: 'TRUTH_LANGUAGE', severity: 'BLOCK', message: '' }])).toBe(false)
  })

  it('is true when only WARNs are present — a reviewer may override those', () => {
    expect(isPublishable([{ code: 'UNATTRIBUTED_STEM', severity: 'WARN', message: '' }])).toBe(true)
  })
})
