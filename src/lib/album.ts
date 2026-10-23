export const ALBUM_KEY = 'abrahamic.album.v1'

export type AlbumState = {
  /** Local dates (YYYY-MM-DD) on which the daily challenge was finished. */
  days: string[]
  /** Daily challenges finished with every answer right. */
  perfect: number
  /** Person-page quizzes finished. */
  quizzes: number
}
export const EMPTY_ALBUM: AlbumState = { days: [], perfect: 0, quizzes: 0 }

export function parseAlbum(raw: string): AlbumState {
  const v = JSON.parse(raw)
  const days = Array.isArray(v?.days) ? v.days.filter((d: unknown) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)).slice(-400) : []
  return {
    days: [...new Set<string>(days)].sort(),
    perfect: Number.isInteger(v?.perfect) && v.perfect >= 0 ? Math.min(v.perfect, 9999) : 0,
    quizzes: Number.isInteger(v?.quizzes) && v.quizzes >= 0 ? Math.min(v.quizzes, 9999) : 0,
  }
}

const DAY = 86_400_000
const toTime = (d: string) => Date.parse(`${d}T00:00:00Z`)
export function dayKey(date: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`
}

/** Consecutive days ending today, or ending yesterday (so a streak is not lost before today's play). */
export function currentStreak(days: string[], today: string): number {
  const set = new Set(days)
  let cursor = toTime(today)
  if (!set.has(today)) cursor -= DAY
  let n = 0
  while (set.has(new Date(cursor).toISOString().slice(0, 10))) { n++; cursor -= DAY }
  return n
}

export function recordDaily(state: AlbumState, today: string, perfect: boolean): AlbumState {
  return {
    ...state,
    days: [...new Set([...state.days, today])].sort().slice(-400),
    perfect: state.perfect + (perfect && !state.days.includes(today) ? 1 : 0),
  }
}

export type Badge = { id: string; icon: string; title: string; how: string; earned: boolean }
export function badges(state: AlbumState, today: string, extras: { figuresVisited: number; notes: number }): Badge[] {
  const streak = currentStreak(state.days, today)
  const b = (id: string, icon: string, title: string, how: string, earned: boolean): Badge => ({ id, icon, title, how, earned })
  return [
    b('first', '🌱', 'First challenge', 'Finish a daily challenge.', state.days.length >= 1),
    b('streak3', '🔥', 'Three days running', 'Finish the daily challenge three days in a row.', streak >= 3),
    b('streak7', '🌟', 'A whole week', 'Finish it seven days in a row.', streak >= 7),
    b('perfect', '🎯', 'Spot on', 'Get every answer right in a daily challenge.', state.perfect >= 1),
    b('quizzer', '🧠', 'Name collector', 'Finish three person quizzes.', state.quizzes >= 3),
    b('explorer', '🧭', 'Explorer', 'Visit five different people on the site.', extras.figuresVisited >= 5),
    b('notes', '📝', 'Note taker', 'Write a private note.', extras.notes >= 1),
  ]
}
