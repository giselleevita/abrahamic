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
  const isAdminPage = pathname === '/admin' || pathname?.startsWith('/admin/')
  const ContentWrapper = isAdminPage ? 'div' : 'main'

  return <>
    {!isKidsPage && chrome}
    <ContentWrapper id="main-content" className="flex-1 public-content">{children}</ContentWrapper>
    {!isKidsPage && settings}
    {!isKidsPage && footer}
  </>
}
