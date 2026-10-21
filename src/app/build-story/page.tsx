import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { PageIntro } from '@/components/layout/PageIntro'
import { BuildStoryGame } from '@/components/play/BuildStoryGame'
import { ERA_ORDER, placeForEvents, type StoryEvent } from '@/lib/build-story'

export const revalidate = 3600
export const metadata: Metadata = {
  title: 'Build the story',
  description: 'Pin events to the places they happened, then put them in order.',
}

export default async function BuildStoryPage() {
  const places = placeForEvents()
  const rows = await prisma.timelineEvent.findMany({
    where: { isPublished: true, slug: { in: [...places.keys()] } },
    select: { slug: true, name: true, era: true, position: true },
  })
  const events: StoryEvent[] = rows.map((r) => ({
    slug: r.slug,
    name: r.name,
    order: ERA_ORDER.indexOf(r.era) * 1000 + r.position,
    placeId: places.get(r.slug)!,
  }))
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageIntro
        eyebrow="Play"
        title="Build the story"
        description="Five events from the stories. Pin each to where it happened, then put them in the order the timeline tells them."
        plainWords="First choose an event, then choose its place on the map. When you have placed them all, put the five in order using the arrow buttons."
      />
      <BuildStoryGame events={events} />
    </div>
  )
}
