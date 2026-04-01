import type { ClaimWithRelations } from '@/types'
import type { Tradition } from '@prisma/client'

interface Props {
  claim: ClaimWithRelations
  showSource?: boolean
}

const TRADITION_STYLE: Record<Tradition, { border: string; sourceDot: string; sourceText: string; citeBg: string }> = {
  JEWISH:    { border: 'border-l-blue-500',   sourceDot: 'bg-blue-500',   sourceText: 'text-blue-700',  citeBg: 'bg-blue-50'   },
  CHRISTIAN: { border: 'border-l-red-600',    sourceDot: 'bg-red-600',    sourceText: 'text-red-700',   citeBg: 'bg-red-50'    },
  ISLAMIC:   { border: 'border-l-green-600',  sourceDot: 'bg-green-600',  sourceText: 'text-green-700', citeBg: 'bg-green-50'  },
  SHARED:    { border: 'border-l-violet-500', sourceDot: 'bg-violet-500', sourceText: 'text-violet-700',citeBg: 'bg-violet-50' },
}

export function ClaimCard({ claim, showSource = true }: Props) {
  const tradition = claim.source.tradition as Tradition
  const style = TRADITION_STYLE[tradition] ?? TRADITION_STYLE.SHARED
  const primaryVerse = claim.verses[0]?.verse
  const defaultTranslation = primaryVerse?.translations[0]

  return (
    <div className={`rounded-lg border border-stone-200 border-l-4 ${style.border} bg-white p-4 shadow-sm flex flex-col gap-3`}>
      {showSource && (
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${style.sourceDot}`} />
          <span className={`text-xs font-semibold ${style.sourceText}`}>{claim.source.title}</span>
        </div>
      )}

      <p className="text-sm text-stone-800 leading-relaxed">{claim.statement}</p>

      {primaryVerse && defaultTranslation && (
        <blockquote className={`rounded-md ${style.citeBg} px-3 py-2`}>
          <p className="text-xs text-stone-600 italic leading-relaxed">
            "{defaultTranslation.text}"
          </p>
          <cite className="mt-1 block text-xs font-semibold text-stone-500 not-italic">
            {primaryVerse.book} {primaryVerse.chapter}:{primaryVerse.verse}
          </cite>
        </blockquote>
      )}

      <div className="flex flex-wrap gap-1.5">
        {claim.interpretationScope && (
          <span className="rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-xs text-stone-500">
            {claim.interpretationScope === 'LITERAL'
              ? 'Literal reading'
              : claim.interpretationScope === 'MAJORITY_SCHOLARLY'
              ? 'Majority scholarly view'
              : 'Specific tradition'}
          </span>
        )}
        {claim.specificTradition && (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
            {claim.specificTradition}
          </span>
        )}
        {claim.themes.map(({ theme }) => (
          <span
            key={theme.id}
            className="rounded-full px-2 py-0.5 text-xs font-medium"
            style={{ backgroundColor: (theme.color ?? '#888') + '22', color: theme.color ?? '#888' }}
          >
            {theme.name}
          </span>
        ))}
      </div>
    </div>
  )
}
