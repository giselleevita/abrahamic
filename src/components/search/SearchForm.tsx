'use client'
import { useEffect, useId, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SearchOptions } from '@/lib/search-options'

type Suggestion = { kind: string; label: string; href: string }
export function SearchForm({ query, filters }: { query: string; filters: SearchOptions }) {
  const [value, setValue] = useState(query)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [active, setActive] = useState(-1)
  const [open, setOpen] = useState(false)
  const dismissed = useRef(false)
  const focused = useRef(false)
  const router = useRouter()
  const id = useId()
  useEffect(() => {
    const controller = new AbortController()
    if (value.trim().length < 2) return
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(value.trim())}`, { signal: controller.signal })
        if (!response.ok) return
        const rows = await response.json() as Suggestion[]
        if (!controller.signal.aborted && !dismissed.current && focused.current) { setSuggestions(rows); setOpen(true); setActive(-1) }
      } catch { /* Ordinary form submission remains available. */ }
    }, 200)
    return () => { controller.abort(); clearTimeout(timer) }
  }, [value])
  return <form action="/search" role="search" className="mb-5 flex flex-wrap items-start gap-3" onSubmit={(event) => {
    if (open && active >= 0 && suggestions[active]) { event.preventDefault(); setOpen(false); router.push(suggestions[active].href) }
  }}>
    {Object.entries(filters).map(([key, filter]) => <input key={key} type="hidden" name={key} value={filter} />)}
    <div className="relative min-w-0 flex-1 basis-48">
      <label className="sr-only" htmlFor={id}>Search the whole site</label>
      <input id={id} name="q" type="search" role="combobox" aria-autocomplete="list" aria-expanded={open && suggestions.length > 0} aria-controls={`${id}-suggestions`} aria-activedescendant={open && active >= 0 ? `${id}-${active}` : undefined}
        value={value} minLength={2} maxLength={300} autoComplete="off" placeholder="Search people, beliefs, or verses" className="editorial-control w-full px-4 py-3"
        onChange={(event) => { setValue(event.target.value); setOpen(false); setActive(-1); setSuggestions([]); dismissed.current = false }}
        onBlur={() => { focused.current = false; setOpen(false) }} onFocus={() => { focused.current = true; dismissed.current = false; if (suggestions.length) setOpen(true) }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') { event.preventDefault(); dismissed.current = true; setOpen(false); setActive(-1) }
          if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && suggestions.length) {
            event.preventDefault(); setOpen(true); setActive((index) => event.key === 'ArrowDown' ? (index + 1) % suggestions.length : (index <= 0 ? suggestions.length - 1 : index - 1))
          }
        }} />
      <ul id={`${id}-suggestions`} role="listbox" aria-label="Suggested pages" hidden={!open || !suggestions.length} className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-primary-200 bg-white shadow-xl">
        {suggestions.map((suggestion, index) => <li id={`${id}-${index}`} key={suggestion.href} role="option" aria-selected={active === index}>
          <a href={suggestion.href} tabIndex={-1} onMouseDown={(event) => event.preventDefault()} className={`block px-4 py-3 ${index === active ? 'bg-primary-100' : 'hover:bg-primary-50'}`}><span className="block text-xs text-primary-600">{suggestion.kind}</span>{suggestion.label}</a>
        </li>)}
      </ul>
    </div><button className="editorial-button" type="submit">Search</button>
  </form>
}
