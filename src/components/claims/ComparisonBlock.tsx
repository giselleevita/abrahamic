import type { ComparisonWithClaims } from '@/types'
import { COMPARISON_TAG_LABEL } from '@/lib/constants'
import type { Tradition } from '@prisma/client'

interface Props {
  comparison: ComparisonWithClaims
  showSummary?: boolean
}

const TRADITION_CARD: Record<Tradition, { header: string; body: string; border: string; cite: string }> = {
  JEWISH:    { header: 'bg-blue-700 text-white',   body: 'bg-blue-50/40',   border: 'border-blue-200',   cite: 'text-blue-600' },
  CHRISTIAN: { header: 'bg-red-700 text-white',    body: 'bg-red-50/40',    border: 'border-red-200',    cite: 'text-red-600' },
  ISLAMIC:   { header: 'bg-green-700 text-white',  body: 'bg-green-50/40',  border: 'border-green-200',  cite: 'text-green-600' },
  SHARED:    { header: 'bg-violet-700 text-white', body: 'bg-violet-50/40', border: 'border-violet-200', cite: 'text-violet-600' },
}

const TAG_STYLE: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  SHARED:           { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: '✓' },
  SIMILAR_DIFFERENT:{ bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   icon: '~' },
  CONTRADICTION:    { bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200',    icon: '✕' },
}

const TRADITION_LABEL: Partial<Record<Tradition, string>> = {
  JEWISH: 'Judaism', CHRISTIAN: 'Christianity', ISLAMIC: 'Islam', SHARED: 'Shared',
}

export function ComparisonBlock({ comparison, showSummary = true }: Props) {
  const tag = TAG_STYLE[comparison.tag] ?? TAG_STYLE.SHARED

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-stone-900 leading-snug">{comparison.title}</h3>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${tag.bg} ${tag.text} ${tag.border}`}>
          <span className="font-bold">{tag.icon}</span>
          {COMPARISON_TAG_LABEL[comparison.tag]}
        </span>
      </div>

      {showSummary && comparison.summary && (
        <p className="mb-5 text-sm text-stone-600 leading-relaxed border-l-2 border-stone-200 pl-4 italic">
          {comparison.summary}
        </p>
      )}

      {/* Claim cards */}
      <div
        className={`grid gap-0 overflow-hidden rounded-xl border border-stone-200 shadow-sm ${
          comparison.claims.length === 2
            ? 'sm:grid-cols-2'
            : comparison.claims.length >= 3
            ? 'sm:grid-cols-3'
            : 'grid-cols-1'
        }`}
      >
        {comparison.claims.map(({ claim }, i) => {
          const tradition = claim.source.tradition as Tradition
          const style = TRADITION_CARD[tradition] ?? TRADITION_CARD.SHARED
          const primaryVerse = claim.verses[0]?.verse
          const defaultTranslation = primaryVerse?.translations[0]
          const isLast = i === comparison.claims.length - 1

          return (
            <div
              key={claim.id}
              className={`flex flex-col ${!isLast ? 'border-b border-stone-200 sm:border-b-0 sm:border-r' : ''}`}
            >
              {/* Tradition header */}
              <div className={`px-4 py-3 ${style.header}`}>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                  {TRADITION_LABEL[tradition] ?? tradition}
                </p>
                <p className="text-sm font-semibold">{claim.source.title}</p>
              </div>

              {/* Body */}
              <div className={`flex flex-1 flex-col gap-3 p-4 ${style.body}`}>
                <p className="text-sm text-stone-800 leading-relaxed">{claim.statement}</p>

                {primaryVerse && defaultTranslation && (
                  <blockquote className="mt-auto border-l-2 border-stone-300/60 pl-3">
                    <p className="text-xs text-stone-500 italic leading-relaxed">
                      "{defaultTranslation.text}"
                    </p>
                    <cite className={`mt-1 block text-xs font-semibold not-italic ${style.cite}`}>
                      {primaryVerse.book} {primaryVerse.chapter}:{primaryVerse.verse}
                    </cite>
                  </blockquote>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
