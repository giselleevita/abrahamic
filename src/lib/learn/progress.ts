/**
 * Anonymous, browser-local learning progress.
 *
 * There is no User model and no server-side progress by design: no signup
 * friction, no PII, and nothing to store for a public educational demo. The
 * cost is that progress is per-device and can vanish (private browsing, cleared
 * site data, Safari's eviction of storage for sites that are not installed), so
 * the UI says so and offers a reset rather than pretending otherwise.
 *
 * Keyed by chapter *slug*, not id: this project reseeds routinely and ids
 * renumber, which would silently reattribute a learner's progress to whichever
 * chapter inherited the id.
 *
 * Every access is wrapped — Safari private mode and storage-disabled browsers
 * throw on access rather than returning null.
 */

export const PROGRESS_STORAGE_KEY = 'abrahamic.learn.progress'
export const PROGRESS_VERSION = 1

/** Fired on same-tab writes; `storage` only fires in *other* tabs. */
export const PROGRESS_EVENT = 'learn-progress-change'

const MAX_ATTEMPTS_KEPT = 5

export type QuizAttempt = {
  attemptAt: string
  correct: number
  total: number
  passed: boolean
}

export type ChapterProgress = {
  visitedAt: string | null
  bestScore: number | null
  attempts: QuizAttempt[]
  completedAt: string | null
}

export type LearnProgress = {
  version: typeof PROGRESS_VERSION
  updatedAt: string
  chapters: Record<string, ChapterProgress>
}

export const EMPTY_PROGRESS: LearnProgress = Object.freeze({
  version: PROGRESS_VERSION,
  updatedAt: '',
  chapters: {},
}) as LearnProgress

export const EMPTY_CHAPTER: ChapterProgress = Object.freeze({
  visitedAt: null,
  bestScore: null,
  attempts: [],
  completedAt: null,
}) as ChapterProgress

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Coerce stored JSON into a valid shape. On any version mismatch or malformed
 * payload we discard rather than guess — progress is low-value and re-earnable,
 * and a half-migrated object is worse than a clean slate.
 */
export function parseProgress(raw: string | null): LearnProgress {
  if (!raw) return { ...EMPTY_PROGRESS, chapters: {} }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { ...EMPTY_PROGRESS, chapters: {} }
  }

  if (!isRecord(parsed) || parsed.version !== PROGRESS_VERSION || !isRecord(parsed.chapters)) {
    return { ...EMPTY_PROGRESS, chapters: {} }
  }

  const chapters: Record<string, ChapterProgress> = {}
  for (const [slug, value] of Object.entries(parsed.chapters)) {
    if (!isRecord(value)) continue
    chapters[slug] = {
      visitedAt: typeof value.visitedAt === 'string' ? value.visitedAt : null,
      bestScore: typeof value.bestScore === 'number' ? value.bestScore : null,
      completedAt: typeof value.completedAt === 'string' ? value.completedAt : null,
      attempts: Array.isArray(value.attempts)
        ? value.attempts.filter(isRecord).map((a) => ({
            attemptAt: typeof a.attemptAt === 'string' ? a.attemptAt : '',
            correct: typeof a.correct === 'number' ? a.correct : 0,
            total: typeof a.total === 'number' ? a.total : 0,
            passed: a.passed === true,
          }))
        : [],
    }
  }

  return {
    version: PROGRESS_VERSION,
    updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '',
    chapters,
  }
}

// ── pure reducers (unit-testable, no browser needed) ───────────────────────

export function withChapterVisited(
  prev: LearnProgress,
  slug: string,
  now: string,
): LearnProgress {
  const existing = prev.chapters[slug] ?? EMPTY_CHAPTER
  return {
    ...prev,
    updatedAt: now,
    chapters: { ...prev.chapters, [slug]: { ...existing, visitedAt: existing.visitedAt ?? now } },
  }
}

export function withAttemptRecorded(
  prev: LearnProgress,
  slug: string,
  attempt: QuizAttempt,
): LearnProgress {
  const existing = prev.chapters[slug] ?? EMPTY_CHAPTER
  const score = attempt.total > 0 ? attempt.correct / attempt.total : 0

  return {
    ...prev,
    updatedAt: attempt.attemptAt,
    chapters: {
      ...prev.chapters,
      [slug]: {
        visitedAt: existing.visitedAt ?? attempt.attemptAt,
        // Best score is never lowered by a worse retry.
        bestScore: existing.bestScore === null ? score : Math.max(existing.bestScore, score),
        completedAt: existing.completedAt ?? (attempt.passed ? attempt.attemptAt : null),
        attempts: [attempt, ...existing.attempts].slice(0, MAX_ATTEMPTS_KEPT),
      },
    },
  }
}

export function withChapterReset(prev: LearnProgress, slug: string): LearnProgress {
  const chapters = { ...prev.chapters }
  delete chapters[slug]
  return { ...prev, chapters }
}

export function chapterProgress(progress: LearnProgress, slug: string): ChapterProgress {
  return progress.chapters[slug] ?? EMPTY_CHAPTER
}

export function completedCount(progress: LearnProgress, slugs: string[]): number {
  return slugs.filter((slug) => progress.chapters[slug]?.completedAt).length
}

// ── storage access (all guarded) ───────────────────────────────────────────

export function readProgress(): LearnProgress {
  if (typeof window === 'undefined') return EMPTY_PROGRESS
  try {
    return parseProgress(window.localStorage.getItem(PROGRESS_STORAGE_KEY))
  } catch {
    return EMPTY_PROGRESS
  }
}

export function writeProgress(next: LearnProgress): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next))
    window.dispatchEvent(new Event(PROGRESS_EVENT))
  } catch {
    // Quota exceeded, private mode, storage disabled — progress is best-effort.
  }
}

export function clearProgress(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(PROGRESS_STORAGE_KEY)
    window.dispatchEvent(new Event(PROGRESS_EVENT))
  } catch {
    // ignore
  }
}
