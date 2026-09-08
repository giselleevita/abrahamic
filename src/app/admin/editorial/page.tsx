import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const STATUS_STYLE = {
  DRAFT: 'bg-stone-100 text-stone-700',
  IN_REVIEW: 'bg-amber-100 text-amber-800',
  PUBLISHED: 'bg-emerald-100 text-emerald-800',
  ARCHIVED: 'bg-slate-200 text-slate-700',
} as const

export default async function EditorialWorkflowPage() {
  const [groups, events] = await Promise.all([
    prisma.claim.groupBy({ by: ['editorialStatus'], _count: { _all: true } }),
    prisma.editorialAuditEvent.findMany({ orderBy: { createdAt: 'desc' }, take: 30 }),
  ])
  const counts = Object.fromEntries(groups.map((group) => [group.editorialStatus, group._count._all]))
  const stages = ['DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED'] as const

  return (
    <div className="max-w-5xl">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Editorial integrity</p>
      <h1 className="mt-1 text-3xl font-bold text-stone-900">Workflow & audit evidence</h1>
      <p className="mt-2 max-w-3xl text-sm text-stone-600">
        Editors prepare and submit sourced claims. Administrators control publication,
        archival, and deletion. Every mutation is recorded in the same database transaction.
      </p>

      <div className="my-8 grid gap-3 md:grid-cols-4">
        {stages.map((status, index) => (
          <div key={status} className="relative rounded-xl border border-stone-200 bg-white p-5">
            <span className="text-xs text-stone-400">Stage {index + 1}</span>
            <p className="mt-2 text-3xl font-bold text-stone-900">{counts[status] ?? 0}</p>
            <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${STATUS_STYLE[status]}`}>
              {status.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 px-5 py-4">
          <h2 className="font-semibold text-stone-900">Recent immutable audit events</h2>
          <p className="text-xs text-stone-500">Actor, role, action, entity, timestamp, and state delta.</p>
        </div>
        <div className="divide-y divide-stone-100">
          {events.length === 0 ? (
            <p className="p-5 text-sm text-stone-500">No editorial mutations recorded yet.</p>
          ) : events.map((event) => (
            <article key={event.id} className="grid gap-2 px-5 py-4 md:grid-cols-[150px_1fr_190px]">
              <div><span className="rounded bg-stone-900 px-2 py-1 text-xs font-semibold text-white">{event.action}</span></div>
              <div>
                <p className="text-sm font-medium text-stone-800">{event.entityType} #{event.entityId}</p>
                <p className="text-xs text-stone-500">{event.actorRole} · {event.actorId}</p>
                <details className="mt-2 text-xs text-stone-500">
                  <summary className="cursor-pointer">State evidence</summary>
                  <pre className="mt-2 overflow-auto rounded bg-stone-50 p-2">{JSON.stringify({ before: event.before, after: event.after }, null, 2)}</pre>
                </details>
              </div>
              <time className="text-xs text-stone-500 md:text-right">{event.createdAt.toISOString()}</time>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
