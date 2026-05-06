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
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-20 border-t border-primary-800 bg-primary-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-lg font-serif font-semibold text-gold-500">
              Abrahamic Texts
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-primary-400 max-w-xs">
              A structured, neutral, and citable comparison of Jewish, Christian, and Islamic
              sacred texts. Every claim is cited. Every comparison is editorially authored.
            </p>
            <div className="mt-4 flex gap-2">
              <span className="rounded-full bg-jewish-900/40 px-2.5 py-0.5 text-[10px] font-medium text-jewish-300">Judaism</span>
              <span className="rounded-full bg-christian-900/40 px-2.5 py-0.5 text-[10px] font-medium text-christian-300">Christianity</span>
              <span className="rounded-full bg-islamic-900/40 px-2.5 py-0.5 text-[10px] font-medium text-islamic-300">Islam</span>
            </div>
          </div>

          {/* Link columns */}
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-600">
                {section.title}
              </p>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-400 hover:text-gold-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-primary-800 pt-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-primary-400">
            All comparisons are editorially authored and peer-reviewed. No claim is shown without a source citation.
          </p>
          <p className="text-xs text-primary-300">
            Tags (Shared / Similar-Different / Contradiction) are editorial judgments, not computed.
          </p>
        </div>
      </div>
    </footer>
  )
}
