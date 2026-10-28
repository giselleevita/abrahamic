import Link from 'next/link'
import { FOOTER_GROUPS } from '@/lib/navigation'


export function Footer() {
  return (
    <footer className="mt-20 border-t border-amber-200 bg-[#f3eadb]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-lg font-serif font-bold text-slate-950">
              Abrahamic Texts
            </Link>
            <p className="mt-3 text-sm leading-6 text-slate-600 max-w-xs">
              A curated, sourced introduction to Jewish, Christian, and Islamic
              perspectives. Traditions are presented separately before comparison.
            </p>
            <div className="mt-4 flex gap-2">
              <span className="rounded-full bg-jewish-50 px-2.5 py-1 text-xs font-semibold text-jewish-700">Judaism</span>
              <span className="rounded-full bg-christian-50 px-2.5 py-1 text-xs font-semibold text-christian-700">Christianity</span>
              <span className="rounded-full bg-islamic-50 px-2.5 py-1 text-xs font-semibold text-islamic-700">Islam</span>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_GROUPS.map((section) => (
            <div key={section.id}>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                {section.label}
              </p>
              <ul className="space-y-2">
                {section.items.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-11 items-center text-sm font-medium text-slate-700 hover:text-jewish-700 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500">
            Comparisons are editorially authored and reviewed for attribution and citations. Reader coverage varies by language and source.
          </p>
          <p className="text-xs leading-5 text-slate-500">
            Tags (Shared / Similar-Different / Contradiction) are editorial judgments, not computed.
          </p>
        </div>
      </div>
    </footer>
  )
}
