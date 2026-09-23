import type { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { PageIntro } from '@/components/layout/PageIntro'

export const metadata: Metadata = { title: 'Themes' }
// Cached content. Editors' changes appear immediately: mutating routes
// invalidate the matching tag via revalidateContent().
export const revalidate = 3600

export default async function ThemesPage() {
  const themes = await prisma.theme.findMany({
    include: { _count: { select: { claims: true } } },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <PageIntro eyebrow="Browse" title="Themes" description="Start with a familiar topic—such as prayer, law, prophecy, or ethics—and find related material across all three traditions." />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => (
          <Link
            key={theme.slug}
            href={`/themes/${theme.slug}`}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
            style={{ borderTopColor: theme.color ?? undefined, borderTopWidth: 3 }}
          >
            <h2 className="text-xl font-bold text-slate-950 group-hover:text-blue-800">{theme.name}</h2>
            {theme.description && (
              <p className="mt-2 line-clamp-3 text-base leading-7 text-slate-600">{theme.description}</p>
            )}
            <p className="mt-4 text-sm font-semibold text-blue-700">
              Explore theme · {theme._count.claims} claim{theme._count.claims !== 1 ? 's' : ''}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
