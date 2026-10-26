'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export function PublicShell({
  children,
  chrome,
  settings,
  footer,
}: {
  children: ReactNode
  chrome: ReactNode
  settings: ReactNode
  footer: ReactNode
}) {
  const pathname = usePathname()
  const isKidsPage = pathname === '/kids' || pathname?.startsWith('/kids/')

  return <>
    {!isKidsPage && chrome}
    <main id="main-content" className="flex-1 public-content">{children}</main>
    {!isKidsPage && settings}
    {!isKidsPage && footer}
  </>
}
