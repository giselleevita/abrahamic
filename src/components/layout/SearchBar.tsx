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
        className="editorial-control h-11 w-full px-4 text-sm placeholder:text-primary-700"
        aria-label="Search the whole site"
      />
    </form>
  )
}
