import type { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { TRADITION_BG } from '@/lib/constants'
import { Badge } from '@/components/ui/Badge'
import { PageIntro } from '@/components/layout/PageIntro'

export const metadata: Metadata = { title: 'Figures' }
// Cached content. Editors' changes appear immediately: mutating routes
// invalidate the matching tag via revalidateContent().
export const revalidate = 3600

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
      <PageIntro artwork={{ src: "/timeline/patriarchal.jpg", alt: "Painting of a Bedouin encampment with tents and palms beside a well (Marie-Méloé Lafon, 1841)" }} eyebrow="Explore" title="People" description="Find important people and see how their names, stories, and roles appear across Judaism, Christianity, and Islam." />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {figures.map((figure) => (
          <Link
            key={figure.slug}
            href={`/figures/${figure.slug}`}
            className="group editorial-card p-6 shadow-sm hover:border-gold-700 hover:shadow-md transition-all"
          >
            <div className="mb-5 flex h-1.5 overflow-hidden rounded-full" aria-hidden="true"><span className="flex-1 bg-jewish-600" /><span className="flex-1 bg-christian-600" /><span className="flex-1 bg-islamic-600" /></div>
            <h2 className="text-xl font-bold text-slate-950 group-hover:text-[#173b68]">{figure.canonicalName}</h2>

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

            <p className="mt-4 text-sm font-semibold text-[#173b68]">
              Read profile · {figure._count.claims} sourced claim{figure._count.claims !== 1 ? 's' : ''}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
