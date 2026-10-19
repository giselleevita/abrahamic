import type { Metadata } from 'next'
import { PageIntro } from '@/components/layout/PageIntro'
import { SavedList } from '@/components/experience/SavedItems'
export const metadata: Metadata = { title: 'Saved', robots: { index: false } }
export default function SavedPage() {
  return <div className="mx-auto max-w-3xl px-5 py-12"><PageIntro eyebrow="Your collection" title="Saved for another visit" /><SavedList /></div>
}
