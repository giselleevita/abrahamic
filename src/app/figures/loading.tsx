export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 animate-pulse">
      <div className="mb-2 h-8 w-32 rounded-lg bg-stone-200" />
      <div className="mb-10 h-4 w-80 rounded bg-stone-100" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-stone-100 bg-white p-5 space-y-3">
            <div className="h-6 w-2/3 rounded bg-stone-200" />
            <div className="h-3 w-full rounded bg-stone-100" />
            <div className="h-3 w-4/5 rounded bg-stone-100" />
            <div className="flex gap-2 pt-1">
              <div className="h-5 w-16 rounded-full bg-blue-100" />
              <div className="h-5 w-16 rounded-full bg-red-100" />
              <div className="h-5 w-16 rounded-full bg-green-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
