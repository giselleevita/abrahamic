import type { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { TRADITION_BG } from '@/lib/constants'
import { Badge } from '@/components/ui/Badge'
import { PageIntro } from '@/components/layout/PageIntro'

export const metadata: Metadata = { title: 'Figures' }
export const dynamic = 'force-dynamic'

export default async function FiguresPage() {
  const figures = await prisma.figure.findMany({
    include: {
      aliases: { orderBy: { tradition: 'asc' } },
      _count: { select: { claims: true } },
    },
    orderBy: { canonicalName: 'asc' },
  })

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <PageIntro eyebrow="Explore" title="People" description="Find important people and see how their names, stories, and roles appear across Judaism, Christianity, and Islam." />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {figures.map((figure) => (
          <Link
            key={figure.slug}
            href={`/figures/${figure.slug}`}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="mb-5 flex h-1.5 overflow-hidden rounded-full" aria-hidden="true"><span className="flex-1 bg-blue-500" /><span className="flex-1 bg-rose-500" /><span className="flex-1 bg-emerald-500" /></div>
            <h2 className="text-xl font-bold text-slate-950 group-hover:text-blue-800">{figure.canonicalName}</h2>

            {figure.description && (
              <p className="mt-2 line-clamp-3 text-base leading-7 text-slate-600">{figure.description}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-1.5">
              {figure.aliases.map((alias) => (
                <Badge key={alias.id} className={TRADITION_BG[alias.tradition]}>
                  {alias.name}
                </Badge>
              ))}
            </div>

            <p className="mt-4 text-sm font-semibold text-blue-700">
              Read profile · {figure._count.claims} sourced claim{figure._count.claims !== 1 ? 's' : ''}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
