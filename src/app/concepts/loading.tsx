export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 animate-pulse">
      <div className="mb-2 h-8 w-36 rounded-lg bg-stone-200" />
      <div className="mb-10 h-4 w-64 rounded bg-stone-100" />
      {Array.from({ length: 3 }).map((_, section) => (
        <div key={section} className="mb-8">
          <div className="mb-4 h-4 w-28 rounded bg-stone-200" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-stone-100 bg-white p-5 space-y-3">
                <div className="h-5 w-3/4 rounded bg-stone-200" />
                <div className="h-3 w-full rounded bg-stone-100" />
                <div className="flex gap-1.5 pt-1">
                  <div className="h-5 w-12 rounded-full bg-blue-100" />
                  <div className="h-5 w-14 rounded-full bg-red-100" />
                  <div className="h-5 w-10 rounded-full bg-green-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
