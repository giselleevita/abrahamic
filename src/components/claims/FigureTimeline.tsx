import type { ClaimWithRelations } from '@/types'
import { SOURCE_ORDER, TRADITION_BG, TRADITION_COLORS } from '@/lib/constants'
import { Badge } from '@/components/ui/Badge'

interface Props {
  claims: ClaimWithRelations[]
}

const SOURCE_ERA: Record<string, string> = {
  TORAH: 'c. 1400–400 BCE',
  HEBREW_BIBLE: 'c. 1000–400 BCE',
  NEW_TESTAMENT: 'c. 50–100 CE',
  QURAN: 'c. 610–632 CE',
}

export function FigureTimeline({ claims }: Props) {
  const bySource = SOURCE_ORDER.reduce<Record<string, ClaimWithRelations[]>>((acc, key) => {
    acc[key] = claims.filter((c) => c.source.key === key)
    return acc
  }, {})

  const activeSources = SOURCE_ORDER.filter((key) => bySource[key].length > 0)

  if (activeSources.length === 0) {
    return <p className="text-stone-500">No claims to display.</p>
  }

  return (
    <div className="relative">
      {/* Vertical spine */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-stone-200" aria-hidden />

      <div className="space-y-10">
        {activeSources.map((key) => {
          const sourceClaims = bySource[key]
          const source = sourceClaims[0].source

          return (
            <div key={key} className="relative pl-12">
              {/* Dot */}
              <div
                className="absolute left-2 top-1.5 h-4 w-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: TRADITION_COLORS[source.tradition] }}
                aria-hidden
              />

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Badge className={TRADITION_BG[source.tradition]}>{source.title}</Badge>
                  <span className="text-xs text-stone-400">{SOURCE_ERA[key]}</span>
                </div>

                <div className="mt-3 space-y-3">
                  {sourceClaims.map((claim) => {
                    const primaryVerse = claim.verses[0]?.verse
                    return (
                      <div key={claim.id} className="rounded-lg border border-stone-100 bg-white p-3">
                        <p className="text-sm text-stone-700 leading-relaxed">{claim.statement}</p>
                        {primaryVerse && (
                          <p className="mt-1.5 text-xs text-stone-400">
                            {primaryVerse.book} {primaryVerse.chapter}:{primaryVerse.verse}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
