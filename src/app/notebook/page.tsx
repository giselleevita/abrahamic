import type { Metadata } from 'next'
import { PageIntro } from '@/components/layout/PageIntro'
import { NotebookView } from '@/components/experience/NotebookView'
import Link from 'next/link'

export const metadata: Metadata = { title: 'My notebook', robots: { index: false } }

export default function NotebookPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <PageIntro
        eyebrow="Your collection"
        title="My notebook"
        description="Your private notes and reading list. Everything stays on this device."
        plainWords="The notebook holds notes and a reading list. For quick saved passages and comparisons, open Saved. Download or print your notebook; sharing includes page links only."
      />
      <p className="mb-6 text-sm text-primary-700">Looking for a passage or comparison you saved? <Link href="/saved" className="editorial-link">Open Saved</Link>.</p>
      <NotebookView />
    </div>
  )
}
