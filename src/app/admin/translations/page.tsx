import prisma from '@/lib/prisma'
import { TranslationManager } from '@/components/admin/TranslationManager'

export const dynamic = 'force-dynamic'

export default async function AdminTranslationsPage({
  searchParams,
}: {
  searchParams: Promise<{ verseId?: string; sourceKey?: string }>
}) {
  const { verseId, sourceKey } = await searchParams

  const sources = await prisma.source.findMany({ orderBy: { id: 'asc' } })

  const selectedSource = sourceKey
    ? sources.find((s) => s.key.toLowerCase() === sourceKey.toLowerCase())
    : sources[0]

  const verses = selectedSource
    ? await prisma.verse.findMany({
        where: { sourceId: selectedSource.id },
        include: { translations: { orderBy: { isDefault: 'desc' } } },
        orderBy: [{ book: 'asc' }, { chapter: 'asc' }, { verse: 'asc' }],
      })
    : []

  const selectedVerseId = verseId ? parseInt(verseId) : verses[0]?.id

  const selectedVerse = selectedVerseId
    ? verses.find((v) => v.id === selectedVerseId) ??
      (await prisma.verse.findUnique({
        where: { id: selectedVerseId },
        include: { translations: { orderBy: { isDefault: 'desc' } } },
      }))
    : verses[0]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Translation Management</h1>
        <p className="mt-1 text-sm text-stone-500">
          Add, edit, and set default translations per verse.
        </p>
      </div>

      <TranslationManager
        sources={sources}
        verses={verses as Parameters<typeof TranslationManager>[0]['verses']}
        selectedVerse={selectedVerse as Parameters<typeof TranslationManager>[0]['selectedVerse']}
        currentSourceKey={selectedSource?.key ?? ''}
      />
    </div>
  )
}
