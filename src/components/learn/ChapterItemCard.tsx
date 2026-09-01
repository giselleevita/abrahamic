import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ChapterItemType } from '@/generated/prisma/client'

/**
 * Renders one playlist entry, switching on the discriminator.
 *
 * NOTE: comparisons are linked by id, not slug — the public route is
 * /comparisons/[id] even though Comparison has a unique slug.
 */

type ItemShape = {
  id: number
  itemType: ChapterItemType
  note: string | null
  concept: { slug: string; name: string; summary: string | null; category: string } | null
  comparison: { id: number; title: string; summary: string | null; tag: string } | null
  figure: { slug: string; canonicalName: string; description: string | null } | null
  timelineEvent: { slug: string; name: string; summary: string | null } | null
  theme: { slug: string; name: string; description: string | null } | null
}

const KIND_LABEL: Record<ChapterItemType, string> = {
  CONCEPT: 'Belief',
  COMPARISON: 'Comparison',
  FIGURE: 'Person',
  TIMELINE_EVENT: 'Event',
  THEME: 'Theme',
}

const KIND_STYLE: Record<ChapterItemType, string> = {
  CONCEPT: 'bg-violet-100 text-violet-800',
  COMPARISON: 'bg-amber-100 text-amber-900',
  FIGURE: 'bg-blue-100 text-blue-800',
  TIMELINE_EVENT: 'bg-emerald-100 text-emerald-800',
  THEME: 'bg-rose-100 text-rose-800',
}

function resolve(item: ItemShape): { href: string; title: string; description: string | null } | null {
  switch (item.itemType) {
    case 'CONCEPT':
      return item.concept && { href: `/concepts/${item.concept.slug}`, title: item.concept.name, description: item.concept.summary }
    case 'COMPARISON':
      return item.comparison && { href: `/comparisons/${item.comparison.id}`, title: item.comparison.title, description: item.comparison.summary }
    case 'FIGURE':
      return item.figure && { href: `/figures/${item.figure.slug}`, title: item.figure.canonicalName, description: item.figure.description }
    case 'TIMELINE_EVENT':
      return item.timelineEvent && { href: `/timeline#${item.timelineEvent.slug}`, title: item.timelineEvent.name, description: item.timelineEvent.summary }
    case 'THEME':
      return item.theme && { href: `/themes/${item.theme.slug}`, title: item.theme.name, description: item.theme.description }
    default:
      return null
  }
}

export function ChapterItemCard({ item }: { item: ItemShape }) {
  const resolved = resolve(item)
  // A CHECK constraint guarantees the FK matches itemType, so this is
  // unreachable in practice — but the entity could be unpublished/missing.
  if (!resolved) return null

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md">
      {item.note && (
        <p className="mb-3 rounded-lg border-l-4 border-amber-300 bg-amber-50 px-3 py-2 text-sm leading-6 text-slate-700">
          {item.note}
        </p>
      )}
      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${KIND_STYLE[item.itemType]}`}>
        {KIND_LABEL[item.itemType]}
      </span>
      <h3 className="mt-2 text-lg font-bold text-slate-950">{resolved.title}</h3>
      {resolved.description && (
        <p className="mt-1 line-clamp-3 leading-7 text-slate-600">{resolved.description}</p>
      )}
      <Link
        href={resolved.href}
        className="group mt-3 inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-900"
      >
        Open <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-1" />
      </Link>
    </div>
  )
}
