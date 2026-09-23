import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * The light content card used throughout the site.
 *
 * The app renders light "islands" on a dark canvas (`layout.tsx` sets
 * `bg-stone-950`). This component owns that contract so the card treatment —
 * border, radius, hover lift — is defined once rather than re-typed inline on
 * every page.
 */
interface SurfaceProps {
  children: ReactNode
  className?: string
  /** Renders as a link and enables the hover affordance. */
  href?: string
  /** Adds hover styling without a link, for cards with interactive children. */
  interactive?: boolean
}

const BASE = 'rounded-xl border border-stone-200 bg-white'
const HOVER = 'transition-all hover:border-stone-400 hover:shadow-sm'
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
