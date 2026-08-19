import type { ReactNode } from 'react'

/**
 * Bordered note block — editorial notes, AI rationale, policy banners.
 *
 * `tone` carries meaning, so each variant also gets a default `role`: notes are
 * complementary, warnings are live-region-free but announced as notes.
 */
type Tone = 'note' | 'editorial' | 'ai' | 'warning'

const TONE: Record<Tone, string> = {
  note: 'border-stone-200 bg-stone-50 text-stone-700',
  editorial: 'border-amber-200 bg-amber-50 text-amber-800',
  ai: 'border-islamic-200 bg-islamic-50 text-islamic-900',
  warning: 'border-christian-300 bg-christian-50 text-christian-900',
}

const TITLE_TONE: Record<Tone, string> = {
  note: 'text-stone-900',
  editorial: 'text-amber-900',
  ai: 'text-islamic-900',
  warning: 'text-christian-900',
}

interface CalloutProps {
  children: ReactNode
  title?: string
  tone?: Tone
  className?: string
}

export function Callout({ children, title, tone = 'note', className = '' }: CalloutProps) {
  return (
    <div className={`rounded-xl border p-6 ${TONE[tone]} ${className}`}>
      {title && (
        <h2 className={`text-sm font-semibold ${TITLE_TONE[tone]}`}>{title}</h2>
      )}
      <div className={`text-sm leading-relaxed ${title ? 'mt-2' : ''}`}>{children}</div>
    </div>
  )
}
