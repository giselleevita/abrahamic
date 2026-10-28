'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { NAV_GROUPS, isActivePath } from '@/lib/navigation'

/**
 * Three focused menus plus the direct kids route keep the primary choices easy
 * to scan while specialist tools stay available inside relevant menus.
 */
export function NavLinks() {
  const pathname = usePathname()
  const [openId, setOpenId] = useState<string | null>(null)
  const baseId = useId()
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!openId) return
    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpenId(null)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      const trigger = containerRef.current?.querySelector<HTMLButtonElement>(`[data-door="${openId}"]`)
      setOpenId(null)
      trigger?.focus()
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [openId])

  return (
    <nav ref={containerRef} aria-label="Main navigation" className="hidden items-center gap-1 text-base font-semibold lg:flex">
      {NAV_GROUPS.map((group) => {
        const open = openId === group.id
        const active = group.items.some((item) => isActivePath(pathname, item.href))
        const panelId = `${baseId}-${group.id}`
        return (
          <div key={group.id} className="relative">
            <button
              type="button"
              data-door={group.id}
              onClick={() => setOpenId(open ? null : group.id)}
              aria-expanded={open}
              aria-controls={panelId}
              className={`flex min-h-11 items-center gap-1 rounded-lg px-3 py-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a67222] focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                open || active ? 'bg-[#f3eadb] text-[#173b68]' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              {group.label}
              <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
              <ul id={panelId} className="absolute left-0 top-12 z-50 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                {group.items.map((item) => {
                  const here = isActivePath(pathname, item.href)
                  return (
                    <li key={item.href}>
                      <Link
                        prefetch={false}
                        href={item.href}
                        onClick={() => setOpenId(null)}
                        aria-current={here ? 'page' : undefined}
                        className={`block min-h-11 rounded-lg px-3 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a67222] ${
                          here ? 'bg-[#f3eadb] text-blue-900' : 'text-slate-700 hover:bg-[#f3eadb] hover:text-blue-900'
                        }`}
                      >
                        <span className="font-semibold">{item.label}</span>
                        {item.description && (
                          <span className="mt-0.5 block text-xs font-normal leading-5 text-slate-500">{item.description}</span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )
      })}

      <Link
        prefetch={false}
        href="/kids"
        className="ml-1 inline-flex min-h-11 items-center rounded-full bg-[#f3eadb] px-4 py-2 text-sm font-bold text-[#173b68] transition-colors hover:bg-[#e9d9bd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a67222]"
      >
        For kids
      </Link>
    </nav>
  )
}
