import type { Metadata } from 'next'
import { PageIntro } from '@/components/layout/PageIntro'
import { SavedList } from '@/components/experience/SavedItems'
import Link from 'next/link'
export const metadata: Metadata = { title: 'Saved', robots: { index: false } }
export default function SavedPage() {
  return <div className="mx-auto max-w-3xl px-5 py-12"><PageIntro eyebrow="Your collection" title="Saved for another visit" description="Quick links to passages and comparisons saved on this device." /><p className="mb-6 text-sm text-primary-700">Your notebook has private notes and a separate reading list. <Link href="/notebook" className="editorial-link">Open notebook</Link>.</p><SavedList /></div>
}
