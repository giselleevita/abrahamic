import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { ClaimForm } from '@/components/admin/ClaimForm'

export default async function EditClaimPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [claim, sources, figures, themes, verses] = await Promise.all([
    prisma.claim.findUnique({
      where: { id: parseInt(id) },
      include: {
        verses: { include: { verse: { include: { source: { select: { title: true } } } } } },
        figures: { include: { figure: true } },
        themes: { include: { theme: true } },
      },
    }),
    prisma.source.findMany({ orderBy: { id: 'asc' } }),
    prisma.figure.findMany({ orderBy: { canonicalName: 'asc' } }),
    prisma.theme.findMany({ orderBy: { name: 'asc' } }),
    prisma.verse.findMany({
      select: { id: true, book: true, chapter: true, verse: true, referenceKey: true, source: { select: { title: true } } },
      orderBy: [{ source: { id: 'asc' } }, { bookNumber: 'asc' }, { chapter: 'asc' }, { verse: 'asc' }],
    }),
  ])

  if (!claim) notFound()

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 text-2xl font-bold text-stone-900">Edit Claim #{claim.id}</h1>
      <ClaimForm
        sources={sources}
        figures={figures}
        themes={themes}
        verses={verses}
        initialData={claim}
      />
    </div>
  )
}
