import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { ThemeForm } from '@/components/admin/ThemeForm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function EditThemePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const theme = await prisma.theme.findUnique({ where: { slug } })
  if (!theme) notFound()

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/themes" className="text-sm text-stone-500 hover:text-stone-700">← Themes</Link>
        <h1 className="text-2xl font-bold text-stone-900">{theme.name}</h1>
      </div>
      <div className="max-w-2xl">
        <ThemeForm initialData={theme} />
      </div>
    </div>
  )
}
