import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { PageIntro } from '@/components/layout/PageIntro'
import { EvidenceBoard, type EvidenceClaim } from '@/components/evidence/EvidenceBoard'

export const revalidate = 3600
export const metadata: Metadata = {
  title: 'Evidence board',
  description: 'Sort statements into the tradition whose text says them, then check the source.',
}

export default async function EvidencePage() {
  const claims = await prisma.claim.findMany({
    where: { isPublished: true, source: { tradition: { in: ['JEWISH', 'CHRISTIAN', 'ISLAMIC'] } } },
    select: { id: true, statement: true, source: { select: { title: true, tradition: true } } },
    orderBy: { id: 'asc' },
  })
  const pool: EvidenceClaim[] = claims
    .filter((c) => c.statement.length <= 260)
    .map((c) => ({ id: c.id, statement: c.statement, tradition: c.source.tradition as EvidenceClaim['tradition'], source: c.source.title }))
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageIntro
        eyebrow="Play"
        title="Evidence board"
        description="Each card is a statement from the site. Decide which tradition’s text it comes from, then flip it to see the source."
        plainWords="This is a sorting game, not a test of belief. Drag a card into a column (or select it and choose a column), then press Check to see where each one comes from."
      />
      <EvidenceBoard pool={pool} />
    </div>
  )
}
