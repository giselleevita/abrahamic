export const TRAIL_KEY = 'abrahamic.trail.v1'
export const TRAIL_MAX = 8
export const PREFERENCES_EVENT = 'abrahamic:preferences'

export type TrailItem = { href: string; label: string; kind: 'figure' | 'concept' | 'comparison' }

const KINDS = new Set(['figure', 'concept', 'comparison'])

/** Tolerant parse: anything unexpected in storage is dropped rather than trusted. */
export function parseTrail(raw: string): TrailItem[] {
  const data: unknown = JSON.parse(raw)
  if (!Array.isArray(data)) return []
  return data
    .filter(
      (x): x is TrailItem =>
        !!x && typeof x.href === 'string' && x.href.startsWith('/') && typeof x.label === 'string' && KINDS.has(x.kind),
    )
    .slice(0, TRAIL_MAX)
    .map((x) => ({ href: x.href, label: x.label.slice(0, 80), kind: x.kind }))
}

/** Newest first, no duplicates, capped. Pure so it can be tested. */
export function addToTrail(trail: TrailItem[], item: TrailItem): TrailItem[] {
  return [item, ...trail.filter((t) => t.href !== item.href)].slice(0, TRAIL_MAX)
}
