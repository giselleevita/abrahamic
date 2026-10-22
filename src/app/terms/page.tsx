import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of use',
  description: 'The basic terms for using Abrahamic Texts.',
}

export default function TermsPage() {
  return <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
    <p className="text-sm font-bold uppercase tracking-[0.14em] text-violet-700">Legal</p>
    <h1 className="mt-2 text-4xl font-bold text-slate-950">Terms of use</h1>
    <p className="mt-5 text-lg leading-8 text-slate-700">Abrahamic Texts is a free educational resource provided as is. By using it you agree to the points below.</p>
    <div className="mt-10 space-y-9 leading-7 text-slate-700">
      <section><h2 className="text-2xl font-bold text-slate-950">Educational use</h2><p className="mt-3">The site is for learning. It is not religious, legal, or professional advice, and it does not speak with the authority of any tradition or community.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Accuracy</h2><p className="mt-3">We aim to cite sources and describe each tradition fairly, but errors can occur. Tell us about them through the <Link href="/about" className="font-semibold text-blue-700 underline">report options</Link> and we will review them.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Content and licences</h2><p className="mt-3">Scripture texts and other third-party material keep their own licences and attributions, listed on the <Link href="/licensing" className="font-semibold text-blue-700 underline">content policy</Link> page. Project-authored explanations are available under the licence in the project repository.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Respectful use</h2><p className="mt-3">Do not misuse the site: no attempts to disrupt it, bypass its access controls, scrape it at a rate that harms other readers, or use its content to demean any faith or community.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">No warranty</h2><p className="mt-3">The site is provided without warranties and may be unavailable or change at any time. It runs on free hosting and is maintained by volunteers.</p></section>
    </div>
  </div>
}
