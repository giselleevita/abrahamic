import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'

/**
 * Cache tags and TTLs for content reads.
 *
 * Before this existed, `export const dynamic = 'force-dynamic'` appeared in 39
 * files including the root layout, so every request rendered every page from
 * scratch and hit Postgres — including a figures query in the global nav that
 * ran on literally every page view. At 94 verses that is invisible; at corpus
 * scale it is both the latency budget and the database bill.
 *
 * Content here changes only when an editor publishes, so a long TTL plus
 * explicit invalidation on write is the right shape: reads are free, and edits
 * still appear immediately because mutating routes call `revalidateContent`.
 */

export const CACHE_TAGS = {
  figures: 'figures',
  themes: 'themes',
  claims: 'claims',
  comparisons: 'comparisons',
  concepts: 'concepts',
  timeline: 'timeline',
  sources: 'sources',
  verseLinks: 'verse-links',
  kidsStories: 'kids-stories',
  videos: 'videos',
} as const

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS]

/**
 * One hour. Long enough that traffic spikes cost nothing, short enough that a
 * missed invalidation self-heals within a working session rather than
 * persisting until the next deploy.
 */
export const CONTENT_TTL_SECONDS = 3600

/**
 * Wrap a database read so it is cached and tag-invalidated.
 *
 * `keyParts` must capture every argument the reader varies on — a slug, a
 * filter — or two different queries will share one cache entry.
 */
export function cachedQuery<Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>,
  keyParts: string[],
  tags: CacheTag[],
  revalidate: number = CONTENT_TTL_SECONDS,
) {
  return unstable_cache(fn, keyParts, { tags, revalidate })
}

/**
 * Invalidate after a write. Call from mutating route handlers so an editor's
 * change is visible on the next request rather than after the TTL expires.
 */
export function revalidateContent(...tags: CacheTag[]): void {
  // Next 16 requires a cache profile on revalidateTag. `expire: 0` purges
  // immediately, which is what an editor publishing a change expects.
  for (const tag of tags) revalidateTag(tag, { expire: 0 })
}

/**
 * Pages that must be purged when a given kind of content changes.
 *
 * Page-level ISR (`export const revalidate`) is time-based, so without this an
 * editor's change would sit invisible for up to an hour. Every mutating route
 * calls `revalidateEntity` so publishing still feels immediate.
 *
 * The homepage appears against most entities because it surfaces counts and
 * featured content from nearly all of them.
 */
const ENTITY_PATHS: Record<string, string[]> = {
  figure:     ['/', '/figures', '/family-tree'],
  theme:      ['/', '/themes'],
  claim:      ['/', '/comparisons', '/concepts'],
  comparison: ['/', '/comparisons'],
  concept:    ['/', '/concepts'],
  timeline:   ['/', '/timeline'],
  source:     ['/sources'],
  verseLink:  ['/verse-links'],
  kidsStory:  ['/kids', '/kids/stories'],
  video:      ['/videos', '/concepts'],
}

export type ContentEntity = keyof typeof ENTITY_PATHS

/**
 * Invalidate every page affected by a change to `entity`, plus any tagged
 * queries. Pass `slug` to also purge that entity's own detail page.
 */
export function revalidateEntity(
  entity: ContentEntity,
  opts: { slug?: string; tags?: CacheTag[] } = {},
): void {
  for (const path of ENTITY_PATHS[entity] ?? []) {
    revalidatePath(path)
  }
  if (opts.slug) {
    const base = ENTITY_PATHS[entity]?.find((p) => p !== '/')
    if (base) revalidatePath(`${base}/${opts.slug}`)
  }
  if (opts.tags?.length) revalidateContent(...opts.tags)
}
