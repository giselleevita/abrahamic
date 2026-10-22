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
      <section><h2 className="text-2xl font-bold text-slate-950">What we count</h2><p className="mt-3">We use Vercel Web Analytics for page views. Separately, when someone completes a journey step we add one to an anonymous daily total. For that count we do not store answers, IP addresses, cookies, device identifiers, or a record per visitor, so the totals cannot be traced to a person.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Server logs</h2><p className="mt-3">The hosting platform keeps operational logs. Our own error logging records the route and an error digest only, without request URLs, headers, bodies, or search terms.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Search and AI</h2><p className="mt-3">What you type into search is used to query our own database. It is not sent to an AI provider. AI tools are used only by site administrators on published source material to draft suggestions for human review.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Children</h2><p className="mt-3">The kids section collects no personal information and has no accounts, forms, or name fields.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Contributor accounts</h2><p className="mt-3">Accounts are optional and only needed to contribute or to apply as a reviewer. If you sign in with GitHub or Google we store your provider account ID, display name, email address, the role we give you, and when you last signed in. If you apply to review, we also store the tradition, the community or institution you name, and your statement; only administrators can read them, and they are not published. We never use your email to link accounts, and we do not send you marketing. You can delete your account and applications at any time from the Contribute page, and an anonymous record that a deletion happened is kept in our audit log. Your sign-in session lasts up to eight hours and uses one cookie that keeps you signed in; it is not used for tracking.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Correction reports</h2><p className="mt-3">You do not need an account to suggest a correction. We store your message, the claim it is about, and your email address only if you choose to give one so we can reply. To limit spam we also keep a scrambled (keyed hash) form of your IP address, from which the address cannot be recovered; it is erased after 30 days. Reports are read by the editors and are never published. If you give an email address and want it removed, write to the contact address below.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-950">Contact</h2><p className="mt-3">Questions about privacy: <a href="mailto:yusaftareen@gmail.com" className="font-semibold text-blue-700 underline">yusaftareen@gmail.com</a>.</p></section>
    </div>
  </div>
}
