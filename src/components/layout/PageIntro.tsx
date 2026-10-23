import { ListenButton } from '@/components/ui/ListenButton'
import Image from 'next/image'
import { StoryScene } from '@/components/experience/Motion'
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
  artwork,
  plainWords,
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
  artwork?: { src: string; alt: string }
  /** One or two everyday sentences: what this page is and why a newcomer might use it. */
  plainWords?: string
  children?: ReactNode
}) {
  return (
    <header className="page-intro relative mb-10 border-b border-[#e5d9c8] pb-7">
      {artwork && <figure className="mb-7"><StoryScene className="relative h-44 overflow-hidden rounded-2xl bg-[#173b68] sm:h-64"><Image src={artwork.src} alt={artwork.alt} fill sizes="(min-width:1024px) 1100px, 100vw" className="object-cover" /></StoryScene><figcaption className="mt-2 text-xs text-primary-700">Historical artwork, public domain · <Link href="/licensing" className="editorial-link">source and licence</Link></figcaption></figure>}
      <div className="relative">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm font-medium text-slate-500">
          <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
            <li>
              <Link href="/" prefetch={false} className="hover:text-blue-800">Home</Link>
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
            <p className="editorial-eyebrow">{eyebrow}</p>
            <h1 className="editorial-title mt-2 text-4xl sm:text-5xl">{title}</h1>
          </div>
          {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </div>

        {description && <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{description}</p>}
        {plainWords && (
          <p className="mt-4 max-w-3xl rounded-2xl border border-[#d7c5ad] bg-[#fbf6ec] px-5 py-3 text-base leading-7 text-[#3d3326]">
            <span aria-hidden="true">💬 </span>
            <strong>In plain words:</strong> {plainWords}
            <span className="ml-3 inline-block align-middle"><ListenButton text={plainWords} label="Listen" /></span>
          </p>
        )}
        {children && <div className="mt-5">{children}</div>}
      </div>
    </header>
  )
}
