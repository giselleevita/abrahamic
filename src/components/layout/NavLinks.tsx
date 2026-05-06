'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/figures',     label: 'Figures' },
  { href: '/family-tree', label: 'Family Tree' },
  { href: '/themes',      label: 'Themes' },
  { href: '/sources',     label: 'Sources' },
  { href: '/comparisons', label: 'Comparisons' },
  { href: '/concepts',    label: 'Concepts' },
  { href: '/timeline',    label: 'Timeline' },
  { href: '/glossary',    label: 'Glossary' },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="hidden items-center gap-0.5 text-sm font-medium sm:flex">
      {LINKS.map((link) => {
        const active = pathname === link.href || pathname.startsWith(link.href + '/')
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative rounded-md px-3 py-1.5 transition-colors ${
              active
                ? 'bg-stone-100 text-stone-900'
                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
            }`}
          >
            {link.label}
            {active && (
              <span className="absolute bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-stone-800" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
