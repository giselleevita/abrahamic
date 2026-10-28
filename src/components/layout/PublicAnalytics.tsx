'use client'

import { Analytics } from '@vercel/analytics/next'
import { usePathname } from 'next/navigation'

/** The children's area intentionally does not load the public-page analytics script. */
export function PublicAnalytics() {
  const pathname = usePathname()
  if (pathname === '/kids' || pathname?.startsWith('/kids/')) return null
  return <Analytics />
}
