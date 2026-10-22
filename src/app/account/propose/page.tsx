import type { Metadata } from 'next'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { contributorSessionOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { ProposalForm } from '@/components/contribute/ProposalForm'

export const metadata: Metadata = { title: 'Propose a claim', robots: { index: false } }
export const dynamic = 'force-dynamic'

export default async function ProposePage() {
  const session = await getServerSession(contributorSessionOptions)
  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-12 sm:px-8 sm:py-16">
        <h1 className="text-3xl font-bold text-slate-950">Propose a claim</h1>
        <p className="mt-4 text-slate-700">Please sign in first. If you only want to point out a mistake, you can <Link href="/suggest" className="font-semibold text-blue-700 underline">suggest a correction</Link> without an account.</p>
        <Link href="/account" className="mt-6 inline-flex rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800">Sign in</Link>
      </div>
    )
  }

  const [sources, mine] = await Promise.all([
    prisma.source.findMany({ where: { key: { in: ['TORAH', 'HEBREW_BIBLE', 'NEW_TESTAMENT', 'QURAN'] } }, orderBy: { id: 'asc' }, select: { id: true, title: true } }),
    prisma.claim.findMany({
      where: { proposedById: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: { id: true, statement: true, editorialStatus: true, createdAt: true },
    }),
  ])
  const STATUS: Record<string, string> = {
    DRAFT: 'Received, waiting for the editors',
    IN_REVIEW: 'In review by tradition reviewers',
    PUBLISHED: 'Published',
    ARCHIVED: 'Not taken forward',
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-violet-700">Contribute</p>
      <h1 className="mt-2 text-4xl font-bold text-slate-950">Propose a claim</h1>
      <p className="mt-5 leading-7 text-slate-700">
        A claim is one sourced sentence about what a text or tradition says. Your proposal becomes a draft that only the editors can see.
        Nothing is published until members of the tradition it describes have confirmed it is fairly worded. You can send up to five a day.
      </p>
      <ProposalForm sources={sources} />

      {mine.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-950">Your proposals</h2>
          <ul className="mt-4 space-y-3">
            {mine.map((claim) => (
              <li key={claim.id} className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
                <p className="text-slate-800">{claim.statement}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">{STATUS[claim.editorialStatus]} · {claim.createdAt.toISOString().slice(0, 10)}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
