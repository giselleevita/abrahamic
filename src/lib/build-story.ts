import { MAP_PLACES } from './map-places'

export type StoryEvent = { slug: string; name: string; order: number; placeId: string }
export const ERA_ORDER = ['PRIMORDIAL', 'PATRIARCHAL', 'EXODUS', 'KINGDOM', 'GOSPEL', 'EARLY_ISLAM']

/** Event slug -> the one place it is pinned to on the map (first place that lists it). */
export function placeForEvents(): Map<string, string> {
  const m = new Map<string, string>()
  for (const p of MAP_PLACES) for (const e of p.events) if (!m.has(e.slug)) m.set(e.slug, p.id)
  return m
}

/** Five events for a round, spread across the story, different each round. Deterministic. */
export function pickStoryRound(events: StoryEvent[], round: number, size = 5): StoryEvent[] {
  const sorted = [...events].sort((a, b) => a.order - b.order)
  if (sorted.length <= size) return sorted
  const stride = sorted.length / size
  const offset = (round * 3) % Math.max(1, Math.floor(stride))
  const picks: StoryEvent[] = []
  for (let k = 0; k < size; k++) picks.push(sorted[Math.min(sorted.length - 1, Math.floor(k * stride) + offset)])
  return picks.filter((e, i, a) => a.findIndex((x) => x.slug === e.slug) === i)
}

/** Deterministic shuffle by a rotation, so the cards do not arrive in the right order. */
export function scramble<T>(items: T[], round: number): T[] {
  const n = items.length
  if (n < 2) return items
  const stride = [3, 2, 5, 7].find((s) => s % n !== 0 && gcd(s, n) === 1) ?? 1
  const shift = (round + 1) % n
  const out = items.map((_, i) => items[(i * stride + shift) % n])
  return out.every((x, i) => x === items[i]) ? [...items.slice(1), items[0]] : out
}
function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b) }
