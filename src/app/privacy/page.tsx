import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What Abrahamic Texts does and does not collect about its visitors.',
}

export default function PrivacyPage() {
  return <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
    <p className="text-sm font-bold uppercase tracking-[0.14em] text-violet-700">Legal</p>
    <h1 className="mt-2 text-4xl font-bold text-slate-950">Privacy</h1>
    <p className="mt-5 text-lg leading-8 text-slate-700">Reading this site does not require an account, and we do not ask for your name, email, or beliefs.</p>
    <div className="mt-10 space-y-9 leading-7 text-slate-700">
      <section><h2 className="text-2xl font-bold text-slate-950">What stays on your device</h2><p className="mt-3">Your progress through guided journeys and the kids games is saved in your browser&rsquo;s local storage so you can resume. It is never sent to us. Clearing your browser data, or using the clear-progress button in the kids section, removes it.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">What we count</h2><p className="mt-3">We use Vercel Web Analytics for page views. Separately, when someone completes a journey step we add one to an anonymous daily total. We do not store answers, accounts, IP addresses, cookies, device identifiers, or a record per visitor, so the totals cannot be traced to a person.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Server logs</h2><p className="mt-3">The hosting platform keeps operational logs. Our own error logging records the route and an error digest only, without request URLs, headers, bodies, or search terms.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Search and AI</h2><p className="mt-3">What you type into search is used to query our own database. It is not sent to an AI provider. AI tools are used only by site administrators on published source material to draft suggestions for human review.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Children</h2><p className="mt-3">The kids section collects no personal information and has no accounts, forms, or name fields.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">If this changes</h2><p className="mt-3">Contributor accounts are planned. If they launch, this page will be updated before any account data is collected, and will say what is stored, why, and how to delete it.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Contact</h2><p className="mt-3">Questions about privacy: <a href="mailto:yusaftareen@gmail.com" className="font-semibold text-blue-700 underline">yusaftareen@gmail.com</a>.</p></section>
    </div>
  </div>
}
