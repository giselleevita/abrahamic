import type { Metadata } from 'next'
import { PageIntro } from '@/components/layout/PageIntro'
import { NotebookView } from '@/components/experience/NotebookView'

export const metadata: Metadata = { title: 'My notebook', robots: { index: false } }

export default function NotebookPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <PageIntro
        eyebrow="Your collection"
        title="My notebook"
        description="Your private notes and reading list. Everything stays on this device."
        plainWords="Add a note or a reading-list item from any person, idea or comparison page. Download them, print them, or share just the list of pages."
      />
      <NotebookView />
    </div>
  )
}
