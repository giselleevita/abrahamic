'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/figures', label: 'People' },
  { href: '/comparisons', label: 'Compare' },
  { href: '/sources', label: 'Read sources' },
  { href: '/timeline', label: 'Timeline' },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav aria-label="Main navigation" className="hidden items-center gap-1 text-base font-semibold md:flex">
      {LINKS.map((link) => {
        const active = pathname === link.href || pathname.startsWith(link.href + '/')
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-100 ${
              active
                ? 'bg-blue-50 text-blue-800'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
            }`}
            aria-current={active ? 'page' : undefined}
          >
            {link.label}
          </Link>
        )
      })}
      <details className="relative">
        <summary className="cursor-pointer list-none rounded-lg px-3 py-2.5 text-slate-700 hover:bg-slate-100 hover:text-slate-950">More <span aria-hidden="true">▾</span></summary>
        <div className="absolute left-0 top-12 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          {[{ href: '/themes', label: 'Themes' }, { href: '/concepts', label: 'Beliefs & concepts' }, { href: '/family-tree', label: 'Family tree' }, { href: '/glossary', label: 'Glossary' }].map((link) => <Link key={link.href} href={link.href} className="block rounded-lg px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-900">{link.label}</Link>)}
        </div>
      </details>
    </nav>
  )
}
