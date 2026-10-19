import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Editorial method',
  description: 'How Abrahamic Texts presents traditions, citations, comparisons, and scripture excerpts.',
}

export default function EditorialMethodPage() {
  return <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
    <p className="text-sm font-bold uppercase tracking-[0.14em] text-violet-700">About the project</p>
    <h1 className="mt-2 text-4xl font-bold text-slate-950">Our editorial method</h1>
    <p className="mt-5 text-lg leading-8 text-slate-700">This site helps curious readers understand Jewish, Christian, and Islamic perspectives without presenting one tradition’s interpretation as a neutral fact.</p>
    <div className="mt-10 space-y-9 leading-7 text-slate-700">
      <section><h2 className="text-2xl font-bold text-slate-950">Each tradition in its own voice</h2><p className="mt-3">A journey introduces Jewish, Christian, and Islamic accounts separately before comparing them. Tradition-specific beliefs are labelled. Differences are described plainly, without claiming that disagreement is a flaw to resolve.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Evidence you can inspect</h2><p className="mt-3">Claims and quiz explanations point to cited passages. A citation supports the stated claim or identifies the tradition’s source; it does not make a later interpretation identical to the source text. Where an interpretation is disputed, we identify it as such.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Clear limits</h2><p className="mt-3">The reader includes the supported Bible canon in public-domain English and the complete Quran in Arabic. Hebrew-original coverage and historical sources remain selective. A text’s presence here does not imply endorsement of one tradition’s interpretation by another. Our <Link href="/licensing" className="font-semibold text-blue-700 underline">content policy</Link> explains how editions and translations are handled.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Corrections and review</h2><p className="mt-3">Published material passes the project’s editorial checks for citations, attribution, and neutrality. Those checks are not a claim of external academic peer review. If you find an error, use “Suggest a correction” on the comparison or source reader page. Reports go privately to the project editorial team and do not require an account. We cannot send a personal reply.</p></section>
    </div>
    <Link href="/learn" className="mt-10 inline-flex rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800">Explore a guided journey</Link>
  </div>
}
