'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto max-w-2xl px-4 py-32 text-center">
      <p className="text-8xl font-bold text-stone-100 select-none">!</p>
      <h1 className="mt-2 text-2xl font-semibold text-stone-900">Something went wrong</h1>
      <p className="mt-3 text-stone-500 leading-relaxed">
        An unexpected error occurred. You can try again or return to the homepage.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-stone-400">Error ID: {error.digest}</p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
