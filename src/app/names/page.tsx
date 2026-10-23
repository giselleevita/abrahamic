import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { PageIntro } from '@/components/layout/PageIntro'
import { NameExplorer } from '@/components/names/NameExplorer'

export const revalidate = 3600
export const metadata: Metadata = {
  title: 'Name explorer',
  description: 'Look up any name, such as Moses, Moshe or Musa, and see the same person in all three traditions.',
}

export default async function NamesPage() {
  const figures = await prisma.figure.findMany({
    select: { slug: true, canonicalName: true, aliases: { select: { tradition: true, name: true, notes: true } } },
    orderBy: { canonicalName: 'asc' },
  })
  const people = figures
    .filter((f) => f.aliases.length > 0)
    .map((f) => ({ slug: f.slug, name: f.canonicalName, aliases: f.aliases }))
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <PageIntro
        eyebrow="Explore"
        title="Name explorer"
        description="The same person often has a different name in each tradition. Type one and see the others."
        plainWords="Not sure whether Ibrahim and Abraham are the same person? Type either name and you will see all the names side by side."
      />
      <NameExplorer people={people} />
    </div>
  )
}
