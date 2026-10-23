import { describe, expect, it } from 'vitest'
import { buildFigureQuiz, type QuizAlias } from './figure-quiz'

const a = (figureId: number, tradition: QuizAlias['tradition'], name: string): QuizAlias => ({ figureId, tradition, name })
const aliases = [
  a(1, 'JEWISH', 'Moshe'), a(1, 'CHRISTIAN', 'Moses'), a(1, 'ISLAMIC', 'Musa'),
  a(2, 'JEWISH', 'Avraham'), a(2, 'CHRISTIAN', 'Abraham'), a(2, 'ISLAMIC', 'Ibrahim'),
  a(3, 'JEWISH', 'Yitzchak'), a(3, 'CHRISTIAN', 'Isaac'), a(3, 'ISLAMIC', 'Ishaq'),
  a(4, 'JEWISH', 'Yaakov'), a(4, 'CHRISTIAN', 'Jacob'), a(4, 'ISLAMIC', 'Yaqub'),
]

describe('buildFigureQuiz', () => {
  const quiz = buildFigureQuiz({ id: 1, canonicalName: 'Moses' }, aliases)

  it('asks about names recorded for the person, with the right answer among three options', () => {
    expect(quiz.length).toBeGreaterThan(0)
    for (const q of quiz) {
      expect(q.options).toHaveLength(3)
      expect(new Set(q.options).size).toBe(3)
      expect(['Moshe', 'Musa']).toContain(q.options[q.answerIndex])
    }
  })

  it('draws wrong options only from other people in the same tradition', () => {
    const islamic = quiz.find((q) => q.prompt.includes('Quran'))!
    const wrong = islamic.options.filter((o) => o !== 'Musa')
    expect(wrong).toHaveLength(2)
    for (const w of wrong) expect(['Ibrahim', 'Ishaq', 'Yaqub']).toContain(w)
  })

  it('skips a tradition whose name matches the canonical name, and is stable between calls', () => {
    expect(quiz.some((q) => q.prompt.includes('the Bible'))).toBe(false)
    expect(buildFigureQuiz({ id: 1, canonicalName: 'Moses' }, aliases)).toEqual(quiz)
  })

  it('returns nothing when there are not enough other names to make a fair choice', () => {
    expect(buildFigureQuiz({ id: 1, canonicalName: 'Moses' }, aliases.filter((x) => x.figureId <= 2))).toEqual([])
  })
})
