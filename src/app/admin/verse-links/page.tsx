import prisma from '@/lib/prisma'
import { VerseLinkManager } from '@/components/admin/VerseLinkManager'

export const dynamic = 'force-dynamic'

export default async function AdminVerseLinksPage() {
  const [verseLinks, verses] = await Promise.all([
    prisma.verseLink.findMany({
      include: {
        verseA: { include: { source: true } },
        verseB: { include: { source: true } },
      },
      orderBy: { id: 'desc' },
    }),
    prisma.verse.findMany({
      include: { source: true },
      orderBy: [{ source: { id: 'asc' } }, { book: 'asc' }, { chapter: 'asc' }, { verse: 'asc' }],
    }),
  ])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Approved Verse Links</h1>
        <p className="mt-1 text-sm text-stone-500">
          Approved cross-scriptural links. Links approved from the candidates queue appear here automatically.
          You can also create links manually or delete incorrect ones.
        </p>
      </div>

      <VerseLinkManager verseLinks={verseLinks as Parameters<typeof VerseLinkManager>[0]['verseLinks']} verses={verses as Parameters<typeof VerseLinkManager>[0]['verses']} />
    </div>
  )
}
