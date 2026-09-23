'use client'

/**
 * Game progress for the kids section — device-local, and nothing else.
 *
 * There are no accounts, no cookies, no network calls, and no name or nickname
 * field anywhere in the kids section. Progress lives in one localStorage key on
 * the child's own device. That keeps the section entirely outside COPPA and
 * GDPR Article 8 scope: there is no personal data to collect, transmit, or
 * delete on request, and "Clear my progress" on /kids genuinely removes
 * everything the site holds.
 *
 * Every access is defensive. Safari in private mode throws on setItem, a
 * corrupt blob must never crash a child's page, and the store must be readable
 * during SSR without a window.
 */
import { useCallback, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'abrahamic.kids.v1'
const VERSION = 1

export interface GameProgress {
  bestScore: number
  completions: number
  lastPlayedIso: string
}

export interface KidsProgress {
  version: number
  games: Record<string, GameProgress>
}

const EMPTY: KidsProgress = { version: VERSION, games: {} }

/**
 * Hand-rolled validation rather than zod: this module is imported by every
 * game component, and the shape is small enough that the check is cheaper and
 * clearer than pulling a schema library into the client bundle.
 */
function parse(raw: string | null): KidsProgress {
  if (!raw) return EMPTY
  try {
    const data = JSON.parse(raw) as unknown
    if (typeof data !== 'object' || data === null) return EMPTY

    const obj = data as Record<string, unknown>
    if (obj.version !== VERSION) return EMPTY
    if (typeof obj.games !== 'object' || obj.games === null) return EMPTY

    const games: Record<string, GameProgress> = {}
    for (const [id, value] of Object.entries(obj.games as Record<string, unknown>)) {
      const g = value as Record<string, unknown>
      if (
        typeof g?.bestScore === 'number' &&
        typeof g?.completions === 'number' &&
        typeof g?.lastPlayedIso === 'string'
      ) {
        games[id] = {
          bestScore: g.bestScore,
          completions: g.completions,
          lastPlayedIso: g.lastPlayedIso,
        }
      }
    }
    return { version: VERSION, games }
  } catch {
    // Corrupt or foreign data: start clean rather than surfacing an error.
    return EMPTY
  }
}

function read(): KidsProgress {
  if (typeof window === 'undefined') return EMPTY
  try {
    return parse(window.localStorage.getItem(STORAGE_KEY))
  } catch {
    return EMPTY
  }
}

// useSyncExternalStore compares snapshots by reference, so the parsed object is
// cached and only replaced when the underlying string actually changes.
let cachedRaw: string | null = null
let cachedValue: KidsProgress = EMPTY

function getSnapshot(): KidsProgress {
  if (typeof window === 'undefined') return EMPTY
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return EMPTY
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cachedValue = parse(raw)
  }
  return cachedValue
}

const listeners = new Set<() => void>()

function emit() {
  for (const l of listeners) l()
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange)
  // `storage` fires in other tabs; the local emit covers this one.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) onChange()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('storage', onStorage)
  }
}

function write(next: KidsProgress) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Private browsing or a full quota: progress simply is not saved. The game
    // must keep working, so this is deliberately silent.
  }
  emit()
}

export function recordResult(gameId: string, score: number, nowIso: string) {
  const current = read()
  const existing = current.games[gameId]
  write({
    version: VERSION,
    games: {
      ...current.games,
      [gameId]: {
        bestScore: Math.max(score, existing?.bestScore ?? 0),
        completions: (existing?.completions ?? 0) + 1,
        lastPlayedIso: nowIso,
      },
    },
  })
}

export function clearProgress() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing to do — there is no server copy to fall back on.
  }
  emit()
}

export function useKidsProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY)

  const record = useCallback((gameId: string, score: number) => {
    recordResult(gameId, score, new Date().toISOString())
  }, [])

  return { progress, record, clear: clearProgress }
}
