import type { ReactNode } from 'react'
import Link from 'next/link'

export type Crumb = { href: string; label: string }

export function PageIntro({
  eyebrow,
  title,
  description,
  trail = [],
  crumbLabel,
  actions,
  children,
}: {
  eyebrow: string
  title: string
  description?: string
  /**
   * Ancestors between Home and this page, e.g. [{ href: '/figures', label: 'People' }].
   * Home is always prepended and the current page always appended, so detail
   * pages no longer need to hand-roll their own breadcrumb markup.
   */
  trail?: Crumb[]
  /** Breadcrumb text for the current page when `title` is too long for it. */
  crumbLabel?: string
  /** Right-aligned controls (filters, links) shown beside the heading. */
  actions?: ReactNode
  /** Extra content below the description — badges, metadata, tabs. */
  children?: ReactNode
}) {
  return (
    <header className="relative mb-10 overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-violet-50 p-6 shadow-sm sm:p-9">
      <div className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-rose-200/35 blur-2xl" aria-hidden="true" />
      <div className="absolute -bottom-16 right-24 h-36 w-36 rounded-full bg-blue-200/40 blur-2xl" aria-hidden="true" />
      <div className="relative">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm font-medium text-slate-500">
          <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
            <li>
              <Link href="/" className="hover:text-blue-800">Home</Link>
            </li>
            {trail.map((crumb) => (
              <li key={crumb.href} className="flex items-center gap-x-1">
                <span className="text-slate-400" aria-hidden="true">/</span>
                <Link href={crumb.href} className="hover:text-blue-800">{crumb.label}</Link>
              </li>
            ))}
            <li className="flex items-center gap-x-1">
              <span className="text-slate-400" aria-hidden="true">/</span>
              <span aria-current="page" className="text-slate-700">{crumbLabel ?? title}</span>
            </li>
          </ol>
        </nav>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-violet-700">{eyebrow}</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
          </div>
          {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </div>

        {description && <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{description}</p>}
        {children && <div className="mt-5">{children}</div>}
      </div>
    </header>
  )
}
