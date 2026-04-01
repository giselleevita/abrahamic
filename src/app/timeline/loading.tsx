export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 animate-pulse">
      <div className="mb-2 h-8 w-48 rounded-lg bg-stone-200" />
      <div className="mb-4 h-4 w-80 rounded bg-stone-100" />
      <div className="mb-10 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-5 w-20 rounded bg-stone-100" />
        ))}
      </div>
      <div className="space-y-10">
        {Array.from({ length: 2 }).map((_, era) => (
          <div key={era}>
            <div className="mb-6 h-6 w-40 rounded-full bg-stone-200" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-stone-200" />
                  <div className="flex-1 rounded-xl border border-stone-100 bg-white p-4 space-y-2">
                    <div className="h-5 w-1/2 rounded bg-stone-200" />
                    <div className="grid gap-3 sm:grid-cols-3">
                      {Array.from({ length: 3 }).map((_, j) => (
                        <div key={j} className="h-3 rounded bg-stone-100" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
