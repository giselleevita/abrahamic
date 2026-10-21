import { describe, expect, it } from 'vitest'
import { badges, currentStreak, dayKey, EMPTY_ALBUM, parseAlbum, recordDaily } from './album'

describe('album', () => {
  it('counts consecutive days, and keeps yesterday’s streak alive until you have played today', () => {
    expect(currentStreak(['2026-10-19', '2026-10-20', '2026-10-21'], '2026-10-21')).toBe(3)
    expect(currentStreak(['2026-10-19', '2026-10-20'], '2026-10-21')).toBe(2)
    expect(currentStreak(['2026-10-17', '2026-10-20'], '2026-10-21')).toBe(1)
    expect(currentStreak(['2026-10-10'], '2026-10-21')).toBe(0)
    expect(currentStreak([], '2026-10-21')).toBe(0)
  })

  it('records a day once and counts a perfect score only the first time that day', () => {
    let s = recordDaily(EMPTY_ALBUM, '2026-10-21', true)
    s = recordDaily(s, '2026-10-21', true)
    expect(s.days).toEqual(['2026-10-21'])
    expect(s.perfect).toBe(1)
  })

  it('earns badges from state and extras, and not before', () => {
    const none = badges(EMPTY_ALBUM, '2026-10-21', { figuresVisited: 0, notes: 0 })
    expect(none.every((b) => !b.earned)).toBe(true)
    const some = badges({ days: ['2026-10-19', '2026-10-20', '2026-10-21'], perfect: 1, quizzes: 3 }, '2026-10-21', { figuresVisited: 5, notes: 1 })
    expect(some.find((b) => b.id === 'streak3')!.earned).toBe(true)
    expect(some.find((b) => b.id === 'streak7')!.earned).toBe(false)
    expect(some.filter((b) => b.earned).length).toBe(6)
  })

  it('parses storage defensively', () => {
    expect(parseAlbum(JSON.stringify({ days: ['2026-10-21', 'junk', 5], perfect: -3, quizzes: 'x' }))).toEqual({ days: ['2026-10-21'], perfect: 0, quizzes: 0 })
    expect(parseAlbum('[]')).toEqual(EMPTY_ALBUM)
  })

  it('formats a local day key', () => {
    expect(dayKey(new Date(2026, 9, 5))).toBe('2026-10-05')
  })
})
