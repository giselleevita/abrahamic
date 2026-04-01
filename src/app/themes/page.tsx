import type { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'

export const metadata: Metadata = { title: 'Themes' }
export const dynamic = 'force-dynamic'

export default async function ThemesPage() {
  const themes = await prisma.theme.findMany({
    include: { _count: { select: { claims: true } } },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-stone-900">Themes</h1>
      <p className="mb-10 text-stone-500">
        Conceptual themes addressed across all three traditions.
      </p>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => (
          <Link
            key={theme.slug}
            href={`/themes/${theme.slug}`}
            className="rounded-xl border border-stone-200 bg-white p-5 hover:border-stone-400 hover:shadow-sm transition-all"
            style={{ borderTopColor: theme.color ?? undefined, borderTopWidth: 3 }}
          >
            <h2 className="text-lg font-semibold text-stone-900">{theme.name}</h2>
            {theme.description && (
              <p className="mt-2 line-clamp-3 text-sm text-stone-500">{theme.description}</p>
            )}
            <p className="mt-3 text-xs text-stone-400">
              {theme._count.claims} claim{theme._count.claims !== 1 ? 's' : ''}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
