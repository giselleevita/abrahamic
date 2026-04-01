import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { FigureForm } from '@/components/admin/FigureForm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function EditFigurePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const figure = await prisma.figure.findUnique({
    where: { slug },
    include: { aliases: { orderBy: { tradition: 'asc' } } },
  })
  if (!figure) notFound()

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/figures" className="text-sm text-stone-500 hover:text-stone-700">← Figures</Link>
        <h1 className="text-2xl font-bold text-stone-900">{figure.canonicalName}</h1>
      </div>
      <div className="max-w-2xl">
        <FigureForm initialData={figure} />
      </div>
    </div>
  )
}
