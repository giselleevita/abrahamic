'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { TRADITION_LABEL } from '@/lib/constants'
import { PronounceButton } from '@/components/ui/PronounceButton'
import type { NameFigure } from '@/lib/name-links'
import type { Tradition } from '@/generated/prisma/client'

/** A name in running text. Tap it for the same person's names in each tradition. */
export function NameTap({ text, figure }: { text: string; figure: NameFigure }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return
    const out = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', out)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', out); document.removeEventListener('keydown', esc) }
  }, [open])

  return (
    <span ref={root} className="relative inline">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`${text}: show this person's names in each tradition`}
        className="inline-flex min-h-11 items-center rounded-sm align-middle underline decoration-[#b7791f] decoration-dotted underline-offset-4 hover:bg-[#fbf6ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b7791f]"
      >
        {text}
      </button>
      {open && (
        <span role="dialog" aria-label={`${figure.name}, names across the traditions`} className="absolute left-0 top-full z-40 mt-2 block w-72 max-w-[80vw] rounded-2xl border border-[#d7c5ad] bg-white p-4 text-left shadow-xl">
          <span className="block font-serif text-lg font-bold text-slate-950">{figure.name}</span>
          <span className="mt-2 block space-y-1">
            {(['JEWISH', 'CHRISTIAN', 'ISLAMIC'] as Tradition[]).map((t) => {
              const a = figure.aliases.find((x) => x.tradition === t)
              return (
                <span key={t} className="flex items-center justify-between gap-2 border-b border-[#eadfca] py-1 text-sm last:border-0">
                  <span className="text-slate-600">{TRADITION_LABEL[t]}</span>
                  <span className="flex items-center gap-2 font-semibold text-slate-950">{a?.name ?? '—'}{a && <PronounceButton name={a.name} tradition={t} />}</span>
                </span>
              )
            })}
          </span>
          <Link href={`/figures/${figure.slug}`} className="mt-3 block text-sm font-bold text-[#173b68] hover:underline">Read the full page →</Link>
        </span>
      )}
    </span>
  )
}
