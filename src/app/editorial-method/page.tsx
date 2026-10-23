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
      <section><h2 className="text-2xl font-bold text-slate-950">How a claim is reviewed</h2><p className="mt-3">Before a new claim can be published, a member of each tradition it describes must confirm that their tradition is fairly described. We ask a single question: would a thoughtful member of your tradition recognise this as a fair description? We do not ask reviewers to say whether it is true. A claim from the Qur&rsquo;an is checked by a Muslim reviewer; a claim from the Hebrew Bible, which Jews and Christians both read, needs both a Jewish and a Christian reviewer. A reviewer can approve, ask for changes, or object, and any change to the wording or its cited verses starts the review again.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">What the review labels mean</h2><p className="mt-3">Each claim shows its review status separately for every tradition it describes. &ldquo;Reviewed by a &hellip; reviewer&rdquo; means an approved member of that tradition confirmed it. While we are still recruiting reviewers, the project editor may check a claim so it can be published; that is labelled &ldquo;checked by the project editor&rdquo; and is never presented as a review by the tradition. Material published before this process existed shows &ldquo;awaiting review&rdquo; until a reviewer has read it. If a reviewer disagrees and we publish anyway, the page says that a reviewer disagrees.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">What review cannot do</h2><p className="mt-3">We cannot verify anyone&rsquo;s faith, so reviewers are accepted on the community or institution they name and are approved by an administrator. One reviewer does not speak for a whole tradition, which contains many views, and review is not external academic peer review. A comparison&rsquo;s title and summary are framing text and are not separately reviewed; a comparison can only go live once every claim in it has been published.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Corrections</h2><p className="mt-3">If you find an error or think a tradition is described unfairly, use the report options on the <Link href="/about" className="font-semibold text-blue-700 underline">About page</Link>, or <Link href="/account" className="font-semibold text-blue-700 underline">apply to review</Link> for your own tradition.</p></section>
    </div>
    <Link href="/learn" className="mt-10 inline-flex rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800">Explore a guided journey</Link>
  </div>
}
