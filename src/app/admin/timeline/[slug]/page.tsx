import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { TimelineEventForm } from '@/components/admin/TimelineEventForm'

export default async function EditTimelineEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await prisma.timelineEvent.findUnique({
    where: { slug },
    include: { traditions: true },
  })
  if (!event) notFound()

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-stone-900">Edit Event — {event.name}</h1>
      <TimelineEventForm initialData={event} />
    </div>
  )
}
