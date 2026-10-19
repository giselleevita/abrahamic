import Link from 'next/link'
import type { ReactNode } from 'react'

/** Shared parchment content surface; links alone receive navigation affordances. */
interface SurfaceProps {
  children: ReactNode
  className?: string
  /** Renders as a link and enables the hover affordance. */
  href?: string
  /** Adds hover styling without a link, for cards with interactive children. */
  interactive?: boolean
}

const BASE = 'editorial-card'
const HOVER = 'transition-colors hover:border-gold-700 hover:shadow-sm'
const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600'

export function Surface({ children, className = '', href, interactive }: SurfaceProps) {
  if (href) {
    return (
      <Link href={href} className={`group block ${BASE} ${HOVER} ${FOCUS} ${className}`}>
        {children}
      </Link>
    )
  }

  return (
    <div className={`${BASE} ${interactive ? HOVER : ''} ${className}`}>{children}</div>
  )
}
