import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ChapterItemType } from '@/generated/prisma/client'
import { ScriptText } from '@/components/ui/ScriptText'
import { preferredPublicTranslation } from '@/lib/public-demo-policy'

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
  verse: {
    referenceKey: string
    book: string
    chapter: number
    verse: number
    versification: string
    source: { key: string; title: string }
    translations: { name: string; text: string; label: string; licenseCode: string | null; attribution: string | null }[]
  } | null
}

const KIND_LABEL: Record<ChapterItemType, string> = {
  CONCEPT: 'Belief',
  COMPARISON: 'Comparison',
  FIGURE: 'Person',
  TIMELINE_EVENT: 'Event',
  THEME: 'Theme',
  VERSE: 'Scripture',
}

const KIND_STYLE: Record<ChapterItemType, string> = {
  CONCEPT: 'bg-[#eee2cf] text-[#654414]',
  COMPARISON: 'bg-[#eee2cf] text-[#654414]',
  FIGURE: 'bg-[#eee2cf] text-[#654414]',
  TIMELINE_EVENT: 'bg-[#eee2cf] text-[#654414]',
  THEME: 'bg-[#eee2cf] text-[#654414]',
  VERSE: 'bg-[#dce8f2] text-[#173b68]',
}

function resolve(item: ItemShape): { href: string; title: string; description: string | null; edition?: string; attribution?: string | null } | null {
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
    case 'VERSE': {
      if (!item.verse) return null
      const translation = preferredPublicTranslation(item.verse.translations)
      return {
        href: `/sources/${item.verse.source.key.toLowerCase().replaceAll('_', '-')}/read?book=${encodeURIComponent(item.verse.book)}&chapter=${item.verse.chapter}`,
        title: `${item.verse.book} ${item.verse.chapter}:${item.verse.verse}`,
        description: translation?.text ?? null,
        edition: translation?.name,
        attribution: translation?.attribution,
      }
    }
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
    <div className={`editorial-card p-5 ${item.itemType === 'VERSE' ? 'border-l-4 border-l-[#80571b] bg-[#fdf9f1]' : ''}`}>
      {item.note && (
        <p className="mb-3 rounded-lg border-l-4 border-amber-300 bg-amber-50 px-3 py-2 text-sm leading-6 text-slate-700">
          {item.note}
        </p>
      )}
      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${KIND_STYLE[item.itemType]}`}>
        {item.itemType === 'VERSE' && resolved.edition === 'Reader note (original)' ? 'Project note' : KIND_LABEL[item.itemType]}
      </span>
      <h3 className="mt-2 text-lg font-bold text-[#242019]">{resolved.title}</h3>
      {item.itemType === 'VERSE' && item.verse && <p className="mt-1 text-xs font-semibold text-[#51483c]">{item.verse.source.title} · {resolved.edition === 'Reader note (original)' ? 'Project explanation · Reader note (original)' : resolved.edition ? `Edition: ${resolved.edition}${resolved.attribution ? ` · ${resolved.attribution}` : ''}` : 'No permitted excerpt is available'}{item.verse.source.key === 'QURAN' ? '' : ` · ${item.verse.versification === 'MASORETIC' ? 'Masoretic' : 'Christian'} numbering`}</p>}
      {item.itemType === 'VERSE' && !resolved.description && <p className="mt-3 text-sm text-[#51483c]">No permitted excerpt is available here. Open the source to check its coverage.</p>}
      {resolved.description && (item.itemType === 'VERSE' ? <ScriptText text={resolved.description} className="mt-3 border-l-2 border-[#c9ad7e] pl-4 text-base leading-8 text-[#242019]" /> : <p className="mt-1 line-clamp-3 leading-7 text-[#51483c]">{resolved.description}</p>)}
      <Link
        href={resolved.href}
        className="editorial-link group mt-3 inline-flex items-center gap-2"
      >
        Open <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-1" />
      </Link>
    </div>
  )
}
