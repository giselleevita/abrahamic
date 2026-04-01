export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 animate-pulse">
      <div className="mb-2 h-8 w-44 rounded-lg bg-stone-200" />
      <div className="mb-8 h-4 w-64 rounded bg-stone-100" />
      <div className="mb-8 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-7 w-24 rounded-full bg-stone-100" />
        ))}
      </div>
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-stone-100 bg-white p-6 space-y-4">
            <div className="h-5 w-2/3 rounded bg-stone-200" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-stone-100" />
                <div className="h-3 w-5/6 rounded bg-stone-100" />
                <div className="h-3 w-4/6 rounded bg-stone-100" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-stone-100" />
                <div className="h-3 w-5/6 rounded bg-stone-100" />
                <div className="h-3 w-4/6 rounded bg-stone-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
