'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { PRIMARY_NAV, SECONDARY_NAV_GROUPS, isActivePath } from '@/lib/navigation'

export function NavLinks() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Close on outside click and on Escape. The previous implementation used a
  // bare <details>, which stayed open on both.
  useEffect(() => {
    if (!open) return

    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const secondaryActive = SECONDARY_NAV_GROUPS.some((group) =>
    group.items.some((item) => isActivePath(pathname, item.href)),
  )

  return (
    <nav aria-label="Main navigation" className="hidden items-center gap-1 text-base font-semibold md:flex">
      {PRIMARY_NAV.map((link) => {
        const active = isActivePath(pathname, link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-100 ${
              active ? 'bg-blue-50 text-blue-800' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
            }`}
            aria-current={active ? 'page' : undefined}
          >
            {link.label}
          </Link>
        )
      })}

      <div ref={containerRef} className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={menuId}
          aria-haspopup="true"
          className={`flex items-center gap-1 rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-100 ${
            open || secondaryActive ? 'bg-blue-50 text-blue-800' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
          }`}
        >
          More
          <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div
            id={menuId}
            className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
          >
            {SECONDARY_NAV_GROUPS.map((group) => (
              <div key={group.id} className="py-1">
                <p className="px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  {group.label}
                </p>
                {group.items.map((item) => {
                  const active = isActivePath(pathname, item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        active ? 'bg-blue-50 text-blue-900' : 'text-slate-700 hover:bg-blue-50 hover:text-blue-900'
                      }`}
                      aria-current={active ? 'page' : undefined}
                    >
                      <span className="font-semibold">{item.label}</span>
                      {item.description && (
                        <span className="mt-0.5 block text-xs font-normal leading-5 text-slate-500">
                          {item.description}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
