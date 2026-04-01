import prisma from '@/lib/prisma'
import Link from 'next/link'
import type { TimelineEra } from '@prisma/client'

const ERA_LABEL: Record<TimelineEra, string> = {
  PRIMORDIAL: 'Primordial', PATRIARCHAL: 'Patriarchal', EXODUS: 'Exodus',
  KINGDOM: 'Kingdom', GOSPEL: 'Gospel', EARLY_ISLAM: 'Early Islam',
}

export default async function AdminTimelinePage() {
  const events = await prisma.timelineEvent.findMany({
    include: { _count: { select: { traditions: true } } },
    orderBy: [{ era: 'asc' }, { position: 'asc' }],
  })

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Timeline Events</h1>
        <Link
          href="/admin/timeline/new"
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 transition-colors"
        >
          + New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-stone-500 text-sm">No timeline events yet.</p>
      ) : (
        <div className="space-y-2">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/admin/timeline/${event.slug}`}
              className="flex items-center gap-4 rounded-lg border border-stone-200 bg-white p-4 hover:border-stone-400 transition-colors"
            >
              <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs ${event.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                {event.isPublished ? 'Published' : 'Draft'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-900">{event.name}</p>
                {event.summary && (
                  <p className="mt-0.5 text-xs text-stone-500 truncate">{event.summary}</p>
                )}
              </div>
              <span className="flex-shrink-0 text-xs text-stone-400 bg-stone-100 rounded px-2 py-0.5">
                {ERA_LABEL[event.era]}
              </span>
              <span className="flex-shrink-0 text-xs text-stone-400 w-6 text-center">
                #{event.position}
              </span>
              <span className="flex-shrink-0 text-xs text-stone-400">
                {event._count.traditions} tradition{event._count.traditions !== 1 ? 's' : ''}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
