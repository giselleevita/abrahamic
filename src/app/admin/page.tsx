import prisma from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [claimCount, compCount, figureCount, themeCount, verseCount, conceptCount, timelineCount, pendingCandidates, approvedLinks] = await Promise.all([
    prisma.claim.count(),
    prisma.comparison.count(),
    prisma.figure.count(),
    prisma.theme.count(),
    prisma.verse.count(),
    prisma.concept.count(),
    prisma.timelineEvent.count(),
    prisma.verseLinkCandidate.count({ where: { status: 'PENDING' } }),
    prisma.verseLink.count(),
  ])

  const recentClaims = await prisma.claim.findMany({
    include: { source: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const contentStats = [
    { label: 'Claims', value: claimCount, href: '/admin/claims' },
    { label: 'Comparisons', value: compCount, href: '/admin/comparisons' },
    { label: 'Figures', value: figureCount, href: '/admin/figures' },
    { label: 'Themes', value: themeCount, href: '/admin/themes' },
    { label: 'Verses', value: verseCount, href: '/admin/translations' },
    { label: 'Concepts', value: conceptCount, href: '/admin/concepts' },
    { label: 'Timeline Events', value: timelineCount, href: '/admin/timeline' },
  ]

  const toolStats = [
    { label: 'Pending link candidates', value: pendingCandidates, href: '/admin/verse-link-candidates', alert: pendingCandidates > 0 },
    { label: 'Approved verse links', value: approvedLinks, href: '/admin/verse-links', alert: false },
  ]

  return (
    <div className="max-w-3xl">
      <h1 className="mb-8 text-2xl font-bold text-stone-900">Dashboard</h1>

      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-400">Content</h2>
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {contentStats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-stone-200 bg-white p-4 hover:border-stone-400 transition-colors"
          >
            <p className="text-2xl font-bold text-stone-900">{s.value}</p>
            <p className="text-xs text-stone-500 mt-0.5">{s.label}</p>
          </Link>
        ))}
      </div>

      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-400">AI Tools</h2>
      <div className="mb-10 grid grid-cols-2 gap-3">
        {toolStats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`rounded-xl border p-4 hover:border-stone-400 transition-colors ${
              s.alert ? 'border-amber-200 bg-amber-50' : 'border-stone-200 bg-white'
            }`}
          >
            <p className={`text-2xl font-bold ${s.alert ? 'text-amber-700' : 'text-stone-900'}`}>{s.value}</p>
            <p className={`text-xs mt-0.5 ${s.alert ? 'text-amber-600' : 'text-stone-500'}`}>{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-semibold text-stone-900">Recent Claims</h2>
        <div className="flex gap-2">
          <Link
            href="/admin/claims/new"
            className="rounded-md bg-stone-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-700 transition-colors"
          >
            + New Claim
          </Link>
          <Link
            href="/admin/comparisons/new"
            className="rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors"
          >
            + New Comparison
          </Link>
          <Link
            href="/admin/figures/new"
            className="rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors"
          >
            + New Figure
          </Link>
        </div>
      </div>

      <div className="space-y-2">
        {recentClaims.map((claim) => (
          <Link
            key={claim.id}
            href={`/admin/claims/${claim.id}`}
            className="flex items-start gap-3 rounded-lg border border-stone-200 bg-white p-4 hover:border-stone-400 transition-colors"
          >
            <span className={`mt-0.5 flex-shrink-0 rounded-full px-2 py-0.5 text-xs ${claim.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
              {claim.isPublished ? 'Published' : 'Draft'}
            </span>
            <div>
              <p className="text-xs text-stone-400">{claim.source.title}</p>
              <p className="mt-0.5 text-sm text-stone-800 line-clamp-2">{claim.statement}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
