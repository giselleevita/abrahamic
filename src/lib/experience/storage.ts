'use client'

import { useCallback, useMemo, useSyncExternalStore } from 'react'

const EVENT = 'abrahamic:preferences'
const subscribe = (notify: () => void) => {
  window.addEventListener('storage', notify)
  window.addEventListener(EVENT, notify)
  return () => {
    window.removeEventListener('storage', notify)
    window.removeEventListener(EVENT, notify)
  }
}

/** Primitive snapshots keep hydration stable, including when storage is blocked. */
export function useDeviceStore<T>(key: string, fallback: T, parse: (raw: string) => T) {
  const read = useCallback(() => {
    try { return window.localStorage.getItem(key) } catch { return null }
  }, [key])
  const raw = useSyncExternalStore(subscribe, read, () => null)
  const value = useMemo(() => {
    try { return raw === null ? fallback : parse(raw) } catch { return fallback }
  }, [raw, fallback, parse])
  const save = useCallback((next: T) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(next))
      window.dispatchEvent(new Event(EVENT))
      return true
    } catch { return false }
  }, [key])
  return { value, save }
}
