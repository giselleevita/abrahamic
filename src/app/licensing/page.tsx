import Link from 'next/link'

export const metadata = {
  title: 'Licensing & public demo',
  description: 'How scripture text is handled in the public Abrahamic Texts engineering demo.',
}

export default function LicensingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold text-gold-500">Licensing & public demo</h1>
      <p className="mt-4 text-sm leading-relaxed text-primary-300">
        This site is an <strong className="text-primary-100">engineering and UX demonstration</strong> of a
        scripture-comparison platform. It is not offered as a commercial scripture product or a complete
        licensed library of translations.
      </p>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-primary-300">
        <h2 className="text-lg font-semibold text-primary-100">What the public demo includes</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-primary-100">Full platform data</strong> — figures, themes, concepts,
            timeline, comparisons, claims, cross-references, and search (editorial summaries written for
            this project).
          </li>
          <li>
            <strong className="text-primary-100">Verse text (limited translations)</strong> — original
            Hebrew/Arabic where seeded, plus English from translations treated as public domain for this
            demo: <em>JPS 1917</em> and <em>KJV</em>.
          </li>
          <li>
            <strong className="text-primary-100">No modern copyrighted translations</strong> on the public
            deployment — e.g. JPS 1985, ESV, Sahih International, and Yusuf Ali are excluded from seed and
            removed if present.
          </li>
        </ul>
      </section>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-primary-300">
        <h2 className="text-lg font-semibold text-primary-100">Attribution</h2>
        <p>
          Where public-domain English text is shown, retain customary attribution in documentation:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Jewish Publication Society (1917) — Tanakh translation excerpts</li>
          <li>King James Version — New Testament / Old Testament excerpts</li>
        </ul>
        <p>
          Qur&apos;an verses in the public demo display <strong className="text-primary-100">Arabic source
          text</strong> only; English translations requiring publisher permission are omitted.
        </p>
      </section>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-primary-300">
        <h2 className="text-lg font-semibold text-primary-100">Source code</h2>
        <p>
          Application source is proprietary and provided for technical review. See the{' '}
          <Link href="https://github.com/giselleevita/abrahamic" className="text-gold-400 hover:underline">
            repository README
          </Link>{' '}
          for scope and limitations.
        </p>
      </section>

      <section className="mt-10 rounded-lg border border-primary-800 bg-primary-900/50 p-4 text-xs text-primary-400">
        <p>
          This page describes the <em>intended</em> public-demo policy implemented in{' '}
          <code className="text-primary-200">prisma/seed/translation-policy.ts</code>. It is not legal advice.
          For production scripture products, obtain publisher licenses for each translation you display.
        </p>
      </section>
    </div>
  )
}
