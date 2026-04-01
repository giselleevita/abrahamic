import { TimelineEventForm } from '@/components/admin/TimelineEventForm'

export default function NewTimelineEventPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-stone-900">New Timeline Event</h1>
      <TimelineEventForm />
    </div>
  )
}
