'use client'

import { useState } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '/figures', label: 'Explore people' },
  { href: '/comparisons', label: 'Compare beliefs' },
  { href: '/sources', label: 'Read sources' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/themes', label: 'Browse themes' },
  { href: '/concepts', label: 'Beliefs & concepts' },
  { href: '/family-tree', label: 'Family tree' },
  { href: '/glossary', label: 'Glossary' },
]

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 border-b border-slate-200 bg-white shadow-xl">
          <nav aria-label="Mobile navigation" className="mx-auto max-w-7xl px-5 py-5">
            <form action="/search" role="search" className="mb-4"><label htmlFor="mobile-search" className="sr-only">Search the whole site</label><input id="mobile-search" name="q" type="search" placeholder="Search the whole site" className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-base text-slate-950" /></form>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-base font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}
