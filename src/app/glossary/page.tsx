import { GlossaryExplorer } from '@/components/glossary/GlossaryExplorer'
import type { Metadata } from 'next'
import { PageIntro } from '@/components/layout/PageIntro'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Glossary' }


export default function GlossaryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <PageIntro
        eyebrow="Read"
        title="Glossary"
        description="Definitions of terms used across this platform — concept categories, timeline presence states, interpretive vocabulary, and key theological concepts."
      />

      <GlossaryExplorer />

      <div className="mt-14 rounded-lg border border-stone-100 bg-stone-50 p-5">
        <p className="text-sm font-medium text-stone-700">Want to explore these concepts?</p>
        <p className="mt-1 text-sm text-stone-500">
          Browse the{' '}
          <Link href="/concepts" className="underline underline-offset-2 hover:text-stone-700">
            Concepts section
          </Link>{' '}
          for in-depth per-tradition definitions, or view the{' '}
          <Link href="/timeline" className="underline underline-offset-2 hover:text-stone-700">
            Timeline
          </Link>{' '}
          to see how key events are treated across traditions.
        </p>
      </div>
    </div>
  )
}
