import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { ComparisonForm } from '@/components/admin/ComparisonForm'

export default async function EditComparisonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [comparison, claims] = await Promise.all([
    prisma.comparison.findUnique({
      where: { id: parseInt(id) },
      include: { claims: { orderBy: { position: 'asc' } } },
    }),
    prisma.claim.findMany({
      include: { source: true },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  if (!comparison) notFound()

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 text-2xl font-bold text-stone-900">Edit Comparison #{comparison.id}</h1>
      <ComparisonForm claims={claims} initialData={comparison} />
    </div>
  )
}
