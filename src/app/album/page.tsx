import type { Metadata } from 'next'
import Link from 'next/link'
import { PageIntro } from '@/components/layout/PageIntro'
import { AlbumView } from '@/components/experience/AlbumView'

export const metadata: Metadata = { title: 'My streak and badges', robots: { index: false } }

export default function AlbumPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <PageIntro
        eyebrow="Play"
        title="My streak and badges"
        description="Your streak and badges, kept on this device."
        plainWords="Finish the daily challenge to grow your streak. Badges also come from exploring, taking quizzes and writing notes."
      />
      <AlbumView />
      <p className="mt-6"><Link href="/daily" className="font-bold text-[#173b68] hover:underline">Play today’s challenge →</Link></p>
    </div>
  )
}
