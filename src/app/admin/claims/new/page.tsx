import prisma from '@/lib/prisma'
import { ClaimForm } from '@/components/admin/ClaimForm'

export default async function NewClaimPage() {
  const [sources, figures, themes, verses] = await Promise.all([
    prisma.source.findMany({ orderBy: { id: 'asc' } }),
    prisma.figure.findMany({ orderBy: { canonicalName: 'asc' } }),
    prisma.theme.findMany({ orderBy: { name: 'asc' } }),
    prisma.verse.findMany({
      select: { id: true, book: true, chapter: true, verse: true, referenceKey: true, source: { select: { title: true } } },
      orderBy: [{ source: { id: 'asc' } }, { bookNumber: 'asc' }, { chapter: 'asc' }, { verse: 'asc' }],
    }),
  ])

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 text-2xl font-bold text-stone-900">New Claim</h1>
      <ClaimForm sources={sources} figures={figures} themes={themes} verses={verses} />
    </div>
  )
}
