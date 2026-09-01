import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  EMPTY_PROGRESS,
  PROGRESS_STORAGE_KEY,
  chapterProgress,
  clearProgress,
  completedCount,
  parseProgress,
  readProgress,
  withAttemptRecorded,
  withChapterReset,
  withChapterVisited,
  writeProgress,
  type LearnProgress,
  type QuizAttempt,
} from './progress'

const attempt = (over: Partial<QuizAttempt> = {}): QuizAttempt => ({
  attemptAt: '2026-01-01T00:00:00.000Z',
  correct: 4,
  total: 5,
  passed: true,
  ...over,
})

const fresh = (): LearnProgress => ({ ...EMPTY_PROGRESS, chapters: {} })

describe('parseProgress', () => {
  it('returns empty progress for missing storage', () => {
    expect(parseProgress(null).chapters).toEqual({})
  })

  it('returns empty progress for malformed JSON rather than throwing', () => {
    expect(parseProgress('{not json').chapters).toEqual({})
  })

  it('discards a payload from a different version instead of guessing', () => {
    const stored = JSON.stringify({ version: 99, updatedAt: '', chapters: { a: { bestScore: 1 } } })
    expect(parseProgress(stored).chapters).toEqual({})
  })

  it('discards a payload with no version field', () => {
    expect(parseProgress(JSON.stringify({ chapters: { a: {} } })).chapters).toEqual({})
  })

  it('coerces unexpected field types to safe defaults', () => {
    const stored = JSON.stringify({
      version: 1,
      updatedAt: 5,
      chapters: { a: { visitedAt: 42, bestScore: 'high', attempts: 'nope', completedAt: null } },
    })
    expect(parseProgress(stored).chapters.a).toEqual({
      visitedAt: null, bestScore: null, attempts: [], completedAt: null,
    })
  })

  it('round-trips a valid payload', () => {
    const p = withAttemptRecorded(fresh(), 'the-one-god', attempt())
    expect(parseProgress(JSON.stringify(p))).toEqual(p)
  })
})

describe('withAttemptRecorded', () => {
  it('records score, completion and the attempt', () => {
    const p = withAttemptRecorded(fresh(), 'ch', attempt())
    expect(chapterProgress(p, 'ch').bestScore).toBeCloseTo(0.8)
    expect(chapterProgress(p, 'ch').completedAt).toBe(attempt().attemptAt)
    expect(chapterProgress(p, 'ch').attempts).toHaveLength(1)
  })

  it('never lowers the best score on a worse retry', () => {
    let p = withAttemptRecorded(fresh(), 'ch', attempt({ correct: 5, total: 5 }))
    p = withAttemptRecorded(p, 'ch', attempt({ correct: 1, total: 5, passed: false }))
    expect(chapterProgress(p, 'ch').bestScore).toBe(1)
  })

  it('keeps completedAt from the first passing attempt', () => {
    let p = withAttemptRecorded(fresh(), 'ch', attempt({ attemptAt: 'first' }))
    p = withAttemptRecorded(p, 'ch', attempt({ attemptAt: 'second' }))
    expect(chapterProgress(p, 'ch').completedAt).toBe('first')
  })

  it('does not mark complete on a failing attempt', () => {
    const p = withAttemptRecorded(fresh(), 'ch', attempt({ correct: 1, passed: false }))
    expect(chapterProgress(p, 'ch').completedAt).toBeNull()
  })

  it('keeps at most 5 attempts, newest first', () => {
    let p = fresh()
    for (let i = 0; i < 8; i++) p = withAttemptRecorded(p, 'ch', attempt({ attemptAt: `t${i}` }))
    const attempts = chapterProgress(p, 'ch').attempts
    expect(attempts).toHaveLength(5)
    expect(attempts[0].attemptAt).toBe('t7')
  })

  it('handles a zero-question quiz without dividing by zero', () => {
    const p = withAttemptRecorded(fresh(), 'ch', attempt({ correct: 0, total: 0, passed: false }))
    expect(chapterProgress(p, 'ch').bestScore).toBe(0)
  })

  it('does not mutate the previous state', () => {
    const before = fresh()
    withAttemptRecorded(before, 'ch', attempt())
    expect(before.chapters).toEqual({})
  })
})

describe('withChapterVisited', () => {
  it('sets visitedAt once and keeps the original timestamp', () => {
    let p = withChapterVisited(fresh(), 'ch', 'first')
    p = withChapterVisited(p, 'ch', 'second')
    expect(chapterProgress(p, 'ch').visitedAt).toBe('first')
  })
})

describe('withChapterReset / completedCount', () => {
  it('removes only the named chapter', () => {
    let p = withAttemptRecorded(fresh(), 'a', attempt())
    p = withAttemptRecorded(p, 'b', attempt())
    p = withChapterReset(p, 'a')
    expect(Object.keys(p.chapters)).toEqual(['b'])
  })

  it('counts only completed chapters', () => {
    let p = withAttemptRecorded(fresh(), 'a', attempt())
    p = withAttemptRecorded(p, 'b', attempt({ passed: false, correct: 1 }))
    expect(completedCount(p, ['a', 'b', 'c'])).toBe(1)
  })
})

describe('storage access', () => {
  beforeEach(() => { window.localStorage.clear() })

  it('round-trips through localStorage', () => {
    writeProgress(withAttemptRecorded(fresh(), 'ch', attempt()))
    expect(chapterProgress(readProgress(), 'ch').bestScore).toBeCloseTo(0.8)
  })

  it('clears progress', () => {
    writeProgress(withAttemptRecorded(fresh(), 'ch', attempt()))
    clearProgress()
    expect(readProgress().chapters).toEqual({})
  })

  it('returns empty progress when localStorage throws on read (private mode)', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError')
    })
    expect(readProgress()).toEqual(EMPTY_PROGRESS)
    spy.mockRestore()
  })

  it('does not throw when localStorage throws on write (quota exceeded)', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota', 'QuotaExceededError')
    })
    expect(() => writeProgress(fresh())).not.toThrow()
    spy.mockRestore()
  })

  it('stores under the documented key', () => {
    writeProgress(withAttemptRecorded(fresh(), 'ch', attempt()))
    expect(window.localStorage.getItem(PROGRESS_STORAGE_KEY)).toContain('"ch"')
  })
})
