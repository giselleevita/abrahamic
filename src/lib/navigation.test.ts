import { existsSync } from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'
import {
  ALL_NAV_ITEMS,
  FOOTER_GROUPS,
  NAV_GROUPS,
  PRIMARY_NAV,
  SECONDARY_NAV_GROUPS,
  isActivePath,
} from './navigation'

const APP_DIR = path.join(process.cwd(), 'src', 'app')

/** A route exists if src/app/<segments>/page.tsx is on disk. */
function routeExists(href: string): boolean {
  const segments = href.split('/').filter(Boolean)
  return existsSync(path.join(APP_DIR, ...segments, 'page.tsx'))
}

describe('navigation', () => {
  const everyItem = [
    ...ALL_NAV_ITEMS,
    ...PRIMARY_NAV,
    ...FOOTER_GROUPS.flatMap((g) => g.items),
  ]

  it('points every link at a route that exists on disk', () => {
    const broken = everyItem.filter((item) => !routeExists(item.href))
    expect(broken.map((b) => `${b.label} -> ${b.href}`)).toEqual([])
  })

  it('uses one label per href across every surface', () => {
    const labelsByHref = new Map<string, Set<string>>()
    for (const item of everyItem) {
      if (!labelsByHref.has(item.href)) labelsByHref.set(item.href, new Set())
      labelsByHref.get(item.href)!.add(item.label)
    }
    const inconsistent = [...labelsByHref.entries()]
      .filter(([, labels]) => labels.size > 1)
      .map(([href, labels]) => `${href}: ${[...labels].join(' / ')}`)
    expect(inconsistent).toEqual([])
  })

  it('lists each href only once within a group', () => {
    for (const group of NAV_GROUPS) {
      const hrefs = group.items.map((i) => i.href)
      expect(new Set(hrefs).size).toBe(hrefs.length)
    }
  })

  it('keeps every nav item reachable from the header (primary or More menu)', () => {
    const reachable = new Set([
      ...PRIMARY_NAV.map((i) => i.href),
      ...SECONDARY_NAV_GROUPS.flatMap((g) => g.items.map((i) => i.href)),
    ])
    const unreachable = ALL_NAV_ITEMS.filter((i) => !reachable.has(i.href))
    expect(unreachable.map((i) => i.href)).toEqual([])
  })

  it('never duplicates an item between the header and the More menu', () => {
    const primary = new Set(PRIMARY_NAV.map((i) => i.href))
    const secondary = SECONDARY_NAV_GROUPS.flatMap((g) => g.items.map((i) => i.href))
    expect(secondary.filter((href) => primary.has(href))).toEqual([])
  })

  describe('isActivePath', () => {
    it('matches the page itself and its descendants', () => {
      expect(isActivePath('/figures', '/figures')).toBe(true)
      expect(isActivePath('/figures/abraham', '/figures')).toBe(true)
    })

    it('does not match a sibling route with a shared prefix', () => {
      expect(isActivePath('/figures-archive', '/figures')).toBe(false)
      expect(isActivePath('/', '/figures')).toBe(false)
    })
  })
})
