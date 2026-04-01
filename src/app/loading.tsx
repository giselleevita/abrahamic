export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 animate-pulse">
      <div className="mb-4 h-8 w-48 rounded-lg bg-stone-200" />
      <div className="mb-10 h-4 w-72 rounded bg-stone-100" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-stone-100 bg-stone-50 p-5 space-y-3">
            <div className="h-5 w-3/4 rounded bg-stone-200" />
            <div className="h-3 w-full rounded bg-stone-100" />
            <div className="h-3 w-5/6 rounded bg-stone-100" />
            <div className="flex gap-2 pt-1">
              <div className="h-5 w-14 rounded-full bg-stone-200" />
              <div className="h-5 w-14 rounded-full bg-stone-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
