import type { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { TRADITION_BG } from '@/lib/constants'
import { Badge } from '@/components/ui/Badge'
import type { VerseLinkType } from '@prisma/client'

export const metadata: Metadata = { title: 'Cross-References' }
export const dynamic = 'force-dynamic'

const LINK_TYPE_LABEL: Record<VerseLinkType, string> = {
  PARALLEL: 'Parallel',
  CONTRAST: 'Contrast',
  ELABORATION: 'Elaboration',
  FULFILLMENT_CLAIM: 'Fulfillment claim',
}

const LINK_TYPE_STYLE: Record<VerseLinkType, string> = {
  PARALLEL: 'bg-blue-50 text-blue-700 border-blue-200',
  CONTRAST: 'bg-rose-50 text-rose-700 border-rose-200',
  ELABORATION: 'bg-amber-50 text-amber-700 border-amber-200',
  FULFILLMENT_CLAIM: 'bg-violet-50 text-violet-700 border-violet-200',
}

const LINK_TYPE_DESCRIPTION: Record<VerseLinkType, string> = {
  PARALLEL: 'Passages that describe the same event or teaching.',
  CONTRAST: 'Passages that reach opposing conclusions on the same topic.',
  ELABORATION: 'One passage expands upon or contextualises another.',
  FULFILLMENT_CLAIM: 'One tradition claims an earlier passage is fulfilled by a later event.',
}

const LINK_TYPE_ORDER: VerseLinkType[] = ['PARALLEL', 'CONTRAST', 'ELABORATION', 'FULFILLMENT_CLAIM']

export default async function VerseLinksPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const { type } = await searchParams
  const validTypes = LINK_TYPE_ORDER
  const activeType = type && validTypes.includes(type as VerseLinkType) ? (type as VerseLinkType) : null

  const links = await prisma.verseLink.findMany({
    where: activeType ? { linkType: activeType } : undefined,
    include: {
      verseA: {
        include: {
          source: true,
          translations: { where: { isDefault: true } },
        },
      },
      verseB: {
        include: {
          source: true,
          translations: { where: { isDefault: true } },
        },
      },
    },
    orderBy: { id: 'asc' },
  })

  // Group by link type when showing all
  const grouped = LINK_TYPE_ORDER.reduce<Record<VerseLinkType, typeof links>>((acc, t) => {
    acc[t] = links.filter((l) => l.linkType === t)
    return acc
  }, {} as Record<VerseLinkType, typeof links>)

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-stone-900">Cross-References</h1>
      <p className="mb-8 text-stone-500 leading-relaxed max-w-2xl">
        Editorially curated connections between passages across Jewish, Christian, and Islamic scriptures.
        Each link is reviewed and categorised by type.
      </p>

      {/* Type filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/verse-links"
          className={`rounded-full border px-3 py-1 text-sm transition-colors ${
            !activeType
              ? 'border-stone-800 bg-stone-800 text-white'
              : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
          }`}
        >
          All ({links.length || (activeType ? '…' : links.length)})
        </Link>
        {LINK_TYPE_ORDER.map((t) => (
          <Link
            key={t}
            href={`/verse-links?type=${t}`}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              activeType === t
                ? 'border-stone-800 bg-stone-800 text-white'
                : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
            }`}
          >
            {LINK_TYPE_LABEL[t]}
          </Link>
        ))}
      </div>

      {links.length === 0 ? (
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-10 text-center">
          <p className="text-stone-500">No cross-references yet.</p>
          <p className="mt-1 text-sm text-stone-400">
            Cross-references are added by editors after review.
          </p>
        </div>
      ) : activeType ? (
        /* Filtered: flat list */
        <div className="space-y-3">
          <div className={`mb-6 rounded-lg border px-4 py-3 text-sm ${LINK_TYPE_STYLE[activeType]}`}>
            <span className="font-medium">{LINK_TYPE_LABEL[activeType]}:</span>{' '}
            {LINK_TYPE_DESCRIPTION[activeType]}
          </div>
          {links.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
      ) : (
        /* All: grouped */
        <div className="space-y-10">
          {LINK_TYPE_ORDER.map((t) => {
            const group = grouped[t]
            if (group.length === 0) return null
            return (
              <section key={t}>
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="text-base font-semibold text-stone-900">{LINK_TYPE_LABEL[t]}</h2>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs ${LINK_TYPE_STYLE[t]}`}>
                    {group.length}
                  </span>
                </div>
                <p className="mb-4 text-sm text-stone-500">{LINK_TYPE_DESCRIPTION[t]}</p>
                <div className="space-y-3">
                  {group.map((link) => (
                    <LinkCard key={link.id} link={link} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}

      <div className="mt-12 rounded-lg border border-stone-100 bg-stone-50 p-4 text-sm text-stone-500">
        Cross-references are also surfaced inline while{' '}
        <Link href="/sources" className="underline underline-offset-2 hover:text-stone-700">
          reading scripture
        </Link>{' '}
        — tap any verse with a link indicator to see its connections.
      </div>
    </div>
  )
}

function LinkCard({
  link,
}: {
  link: {
    id: number
    linkType: VerseLinkType
    notes: string | null
    verseA: { book: string; chapter: number; verse: number; source: { title: string; tradition: string }; translations: { text: string }[] }
    verseB: { book: string; chapter: number; verse: number; source: { title: string; tradition: string }; translations: { text: string }[] }
  }
}) {
  const tradA = link.verseA.source.tradition as keyof typeof TRADITION_BG
  const tradB = link.verseB.source.tradition as keyof typeof TRADITION_BG
  const textA = link.verseA.translations[0]?.text
  const textB = link.verseB.translations[0]?.text

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Verse A */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge className={TRADITION_BG[tradA]}>{link.verseA.source.title}</Badge>
            <span className="text-xs text-stone-400">
              {link.verseA.book} {link.verseA.chapter}:{link.verseA.verse}
            </span>
          </div>
          {textA && (
            <p className="text-sm text-stone-700 italic leading-relaxed line-clamp-3">
              "{textA}"
            </p>
          )}
        </div>

        {/* Verse B */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge className={TRADITION_BG[tradB]}>{link.verseB.source.title}</Badge>
            <span className="text-xs text-stone-400">
              {link.verseB.book} {link.verseB.chapter}:{link.verseB.verse}
            </span>
          </div>
          {textB && (
            <p className="text-sm text-stone-700 italic leading-relaxed line-clamp-3">
              "{textB}"
            </p>
          )}
        </div>
      </div>

      {link.notes && (
        <p className="border-t border-stone-100 pt-2 text-xs text-stone-500 leading-relaxed">
          {link.notes}
        </p>
      )}
    </div>
  )
}
