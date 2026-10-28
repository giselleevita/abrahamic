import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'What Abrahamic Texts is for, how it stays fair to each tradition, and how to report a problem.',
}

export default function AboutPage() {
  return <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
    <p className="text-sm font-bold uppercase tracking-[0.14em] text-violet-700">About the project</p>
    <h1 className="mt-2 text-4xl font-bold text-slate-950">What this site is for</h1>
    <p className="mt-5 text-lg leading-8 text-slate-700">Abrahamic Texts is a free, sourced introduction to Judaism, Christianity, and Islam, built around the people and stories the three traditions share. It helps curious readers see where the traditions agree, where they differ, and what each one says in its own terms.</p>
    <div className="mt-10 space-y-9 leading-7 text-slate-700">
      <section><h2 className="text-2xl font-bold text-slate-950">What it does not do</h2><p className="mt-3">It does not rank the traditions, decide which is true, or claim religious authority. A comparison describes each position the way its own adherents would recognise it. Where traditions disagree, the site says so plainly.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Fairness to each tradition</h2><p className="mt-3">Every claim cites a passage or source, and new material moves through draft and review before it is published. AI tools may suggest drafts for editors, but nothing is published without a person approving it. Our <Link href="/editorial-method" className="font-semibold text-blue-700 underline">editorial method</Link> explains the standards in full.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Review status</h2><p className="mt-3">The project is working towards having members of each tradition confirm how their own tradition is described. So far, claims have been checked by the project editor, Giselle Koch, and are labelled that way; reviewers from each tradition are welcome. Until that review is in place for an item, it is not labelled as reviewed by that tradition. We will not display a review badge that has not been earned.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Report a problem</h2><p className="mt-3">If a claim, citation, or comparison looks inaccurate or disrespectful, tell us which page and passage. Use the <Link href="/suggest" className="font-semibold text-blue-700 underline">correction form</Link> (no account needed), the repository&rsquo;s <a href="https://github.com/giselleevita/abrahamic/issues/new?template=content_accuracy.md" className="font-semibold text-blue-700 underline">content accuracy form</a>, or email <a href="mailto:giselle.evita@gmail.com" className="font-semibold text-blue-700 underline">giselle.evita@gmail.com</a>. To request removal of content you believe infringes your rights, use the same email and name the page and the rights concerned.</p></section>
    </div>
    <Link href="/learn" className="mt-10 inline-flex rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800">Explore a guided journey</Link>
  </div>
}
