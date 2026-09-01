import Link from 'next/link'

const SECTIONS = [
  {
    title: 'Explore',
    links: [
      { href: '/figures', label: 'Figures' },
      { href: '/themes', label: 'Themes' },
      { href: '/sources', label: 'Sources' },
      { href: '/comparisons', label: 'Comparisons' },
    ],
  },
  {
    title: 'Study',
    links: [
      { href: '/concepts', label: 'Concepts' },
      { href: '/timeline', label: 'Timeline' },
      { href: '/verse-links', label: 'Cross-References' },
      { href: '/glossary', label: 'Glossary' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { href: '/search', label: 'Search' },
      { href: '/licensing', label: 'Licensing' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-20 border-t border-amber-200 bg-gradient-to-br from-amber-50 via-white to-violet-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-lg font-serif font-bold text-slate-950">
              Abrahamic Texts
            </Link>
            <p className="mt-3 text-sm leading-6 text-slate-600 max-w-xs">
              A structured, neutral, and citable comparison of Jewish, Christian, and Islamic
              sacred texts. Every claim is cited. Every comparison is editorially authored.
            </p>
            <div className="mt-4 flex gap-2">
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">Judaism</span>
              <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-800">Christianity</span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">Islam</span>
            </div>
          </div>

          {/* Link columns */}
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                {section.title}
              </p>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-slate-700 hover:text-blue-800 transition-colors"
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
            All comparisons are editorially authored and peer-reviewed. No claim is shown without a source citation.
          </p>
          <p className="text-xs leading-5 text-slate-500">
            Tags (Shared / Similar-Different / Contradiction) are editorial judgments, not computed.
          </p>
        </div>
      </div>
    </footer>
  )
}
