import Link from 'next/link'

/**
 * The "<heading> ……… View all →" row that opens most sections on the site.
 * Appears five times on the homepage alone.
 */
interface SectionHeaderProps {
  title: string
  /** Optional lead paragraph rendered beneath the heading. */
  description?: string
  href?: string
  linkLabel?: string
}

export function SectionHeader({
  title,
  description,
  href,
  linkLabel = 'View all',
}: SectionHeaderProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-stone-900">{title}</h2>
        {href && (
          <Link
            href={href}
            className="shrink-0 text-sm font-medium text-stone-600 transition-colors hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
          >
            {linkLabel} <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
      {description && (
        <p className="mt-2 max-w-2xl text-sm text-stone-500">{description}</p>
      )}
    </div>
  )
}
