import type { Metadata } from 'next'
import { PageIntro } from '@/components/layout/PageIntro'
import { StoryMap } from '@/components/map/StoryMap'

export const metadata: Metadata = {
  title: 'Map of the stories',
  description: 'Where the stories of Abraham, Moses, Jesus, Mary and Muhammad took place, with what each text says.',
}

export default function MapPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageIntro
        eyebrow="Explore"
        title="Map of the stories"
        description="Ten places that matter in the stories, from Ur to Medina. Choose one to read what each text says happened there."
        plainWords="Stories are easier to remember when you know where they happened. Tap a place on the map, or pick it from the list, to see who was there and why it matters."
      />
      <StoryMap />
    </div>
  )
}
