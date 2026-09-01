/**
 * Single source of truth for site navigation.
 *
 * The header (`NavLinks`), the mobile menu (`MobileMenu`) and the footer
 * (`Footer`) all render from these structures. Previously each kept its own
 * hardcoded list, which had drifted: the same page carried different labels
 * on desktop and mobile, and `/verse-links` and `/licensing` were reachable
 * only from the footer. Adding a page here surfaces it everywhere at once.
 */

export type NavItem = {
  href: string
  /** Label shown in every surface. Keep it short enough for the header. */
  label: string
  /** Optional one-line hint, used by the mobile menu and dropdown. */
  description?: string
}

export type NavGroup = {
  id: string
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'learn',
    label: 'Learn',
    items: [
      { href: '/learn', label: 'Chapters', description: 'Guided paths through the material, each ending in a short quiz.' },
      { href: '/timeline', label: 'Timeline', description: 'Major people and events in chronological order.' },
    ],
  },
  {
    id: 'explore',
    label: 'Explore',
    items: [
      { href: '/figures', label: 'People', description: 'Abraham, Moses, Jesus, Muhammad and others.' },
      { href: '/themes', label: 'Themes', description: 'Prayer, law, prophecy, ethics and more.' },
      { href: '/concepts', label: 'Beliefs & concepts', description: 'How each tradition defines key ideas.' },
      { href: '/family-tree', label: 'Family tree', description: 'Genealogy across the three traditions.' },
    ],
  },
  {
    id: 'compare',
    label: 'Compare',
    items: [
      { href: '/comparisons', label: 'Comparisons', description: 'Side-by-side, with sources attached.' },
      { href: '/verse-links', label: 'Cross-references', description: 'Linked passages between scriptures.' },
    ],
  },
  {
    id: 'read',
    label: 'Read',
    items: [
      { href: '/sources', label: 'Sources', description: 'Torah, Hebrew Bible, New Testament, Quran.' },
      { href: '/glossary', label: 'Glossary', description: 'Plain-language definitions of the terms used.' },
    ],
  },
]

/** Flat lookup of every item in `NAV_GROUPS`. */
export const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((group) => group.items)

/**
 * Hrefs promoted to the header bar. Everything else lives in the "More" menu.
 * Order here is the order shown.
 */
const PRIMARY_NAV_HREFS = ['/learn', '/figures', '/comparisons', '/sources'] as const

/**
 * Header links shown directly (not behind the "More" menu). Derived from
 * NAV_GROUPS by href rather than re-declared, so a label can never differ
 * between the header, the mobile menu and the footer.
 */
export const PRIMARY_NAV: NavItem[] = PRIMARY_NAV_HREFS.map((href) => {
  const item = ALL_NAV_ITEMS.find((candidate) => candidate.href === href)
  if (!item) throw new Error(`PRIMARY_NAV_HREFS lists ${href}, which is not in NAV_GROUPS`)
  return item
})

/** Items that are not already in `PRIMARY_NAV`, grouped for the "More" menu. */
export const SECONDARY_NAV_GROUPS: NavGroup[] = NAV_GROUPS.map((group) => ({
  ...group,
  items: group.items.filter(
    (item) => !PRIMARY_NAV.some((primary) => primary.href === item.href),
  ),
})).filter((group) => group.items.length > 0)

/** Footer columns: the content groups plus a site-level column. */
export const FOOTER_GROUPS: NavGroup[] = [
  ...NAV_GROUPS,
  {
    id: 'site',
    label: 'Site',
    items: [
      { href: '/search', label: 'Search' },
      { href: '/licensing', label: 'Licensing' },
    ],
  },
]

/** True when `pathname` is `href` or a page beneath it. */
export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + '/')
}
