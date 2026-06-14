import Link from 'next/link'

export const metadata = {
  title: 'Content policy',
  description: 'How scripture content is handled in the public Abrahamic Texts engineering demo.',
}

export default function LicensingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold text-gold-500">Content policy</h1>
      <p className="mt-4 text-sm leading-relaxed text-primary-300">
        This site is an <strong className="text-primary-100">engineering demonstration</strong>. You do not
        need a publisher license to view it — we do not redistribute modern copyrighted translations.
      </p>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-primary-300">
        <h2 className="text-lg font-semibold text-primary-100">Included (no license required)</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Platform data: figures, themes, concepts, timeline, comparisons, claims, cross-references, search</li>
          <li>Original-language verse text (Hebrew, Arabic) where seeded</li>
          <li>
            <strong className="text-primary-100">Reader note (original)</strong> — short English context
            written for this demo; not a published translation
          </li>
        </ul>
      </section>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-primary-300">
        <h2 className="text-lg font-semibold text-primary-100">Excluded</h2>
        <p>
          JPS 1917, JPS 1985, KJV, ESV, Yusuf Ali, Sahih International, and similar third-party translations
          are removed at seed time and filtered from APIs.
        </p>
      </section>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-primary-300">
        <h2 className="text-lg font-semibold text-primary-100">Source code</h2>
        <p>
          Application source is proprietary and provided for technical review. See the{' '}
          <Link href="https://github.com/giselleevita/abrahamic" className="text-gold-400 hover:underline">
            repository
          </Link>{' '}
          and <code className="text-primary-200">docs/LICENSING.md</code>.
        </p>
      </section>

      <section className="mt-10 rounded-lg border border-primary-800 bg-primary-900/50 p-4 text-xs text-primary-400">
        <p>This page describes the intended public-demo policy. It is not legal advice.</p>
      </section>
    </div>
  )
}
