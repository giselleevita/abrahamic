'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export function SearchBar() {
  const [value, setValue] = useState('')
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (value.trim().length < 2) return
    router.push(`/search?q=${encodeURIComponent(value.trim())}`)
  }

  return (
    <form onSubmit={handleSubmit} role="search">
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search people, beliefs, or verses"
        className="h-11 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm text-slate-950 placeholder:text-slate-500 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
        aria-label="Search the whole site"
      />
    </form>
  )
}
