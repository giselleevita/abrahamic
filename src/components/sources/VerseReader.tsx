'use client'

import { useState } from 'react'
import type { Verse, VerseTranslation, VerseLink, Source } from '@prisma/client'
import { Badge } from '@/components/ui/Badge'
import { TRADITION_BG } from '@/lib/constants'

type LinkedVerse = Verse & {
  source: Source
  translations: VerseTranslation[]
}

type VerseWithLinks = Verse & {
  translations: VerseTranslation[]
  linksAsA: (VerseLink & { verseB: LinkedVerse })[]
  linksAsB: (VerseLink & { verseA: LinkedVerse })[]
}

interface Props {
  verses: VerseWithLinks[]
}

const LABEL_ORDER = ['ORIGINAL', 'CLASSIC', 'MODERN', 'SCHOLARLY'] as const
type LabelKey = typeof LABEL_ORDER[number]

const LABEL_DISPLAY: Record<LabelKey, string> = {
  ORIGINAL: 'Original', CLASSIC: 'Classic', MODERN: 'Modern', SCHOLARLY: 'Scholarly',
}

export function VerseReader({ verses }: Props) {
  const [expandedVerseId, setExpandedVerseId] = useState<number | null>(null)
  const [sideBySide, setSideBySide] = useState(false)

  // Collect all unique translation names and labels present in this chapter
  const allTranslations = verses.flatMap((v) => v.translations)
  const translationNames = Array.from(new Set(allTranslations.map((t) => t.name))).filter(Boolean)
  const availableLabels = LABEL_ORDER.filter((label) =>
    allTranslations.some((t) => t.label === label)
  )

  const defaultName = verses[0]?.translations.find((t) => t.isDefault)?.name ?? translationNames[0]
  const [selectedTranslation, setSelectedTranslation] = useState(defaultName)

  const hasMultiple = translationNames.length > 1

  if (verses.length === 0) {
    return <p className="text-stone-500">No verses found.</p>
  }

  return (
    <div>
      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        {hasMultiple && (
          <div className="flex items-center rounded-full border border-stone-200 bg-stone-50 p-0.5">
            <button
              onClick={() => setSideBySide(false)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                !sideBySide ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Single
            </button>
            <button
              onClick={() => setSideBySide(true)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                sideBySide ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Side by side
            </button>
          </div>
        )}

        {!sideBySide && hasMultiple && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone-400">Translation:</span>
            {translationNames.map((name) => (
              <button
                key={name}
                onClick={() => setSelectedTranslation(name)}
                className={`rounded-full border px-3 py-0.5 text-xs transition-colors ${
                  selectedTranslation === name
                    ? 'border-stone-800 bg-stone-800 text-white'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        )}

        {sideBySide && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone-400">Comparing:</span>
            {availableLabels.map((label) => (
              <span key={label} className="rounded-full border border-stone-200 bg-white px-2.5 py-0.5 text-xs text-stone-600">
                {LABEL_DISPLAY[label]}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Verse list */}
      <div className="space-y-1">
        {verses.map((verse) => {
          const allLinks = [
            ...verse.linksAsA.map((l) => ({ ...l, linkedVerse: l.verseB })),
            ...verse.linksAsB.map((l) => ({ ...l, linkedVerse: l.verseA })),
          ]
          const isExpanded = expandedVerseId === verse.id

          return (
            <div
              key={verse.id}
              className={`group rounded-lg p-3 transition-colors ${
                isExpanded ? 'bg-stone-100' : 'hover:bg-stone-50'
              }`}
            >
              <div className="flex gap-3">
                <span className="w-8 flex-shrink-0 pt-0.5 text-right text-xs font-medium text-stone-400">
                  {verse.verse}
                </span>
                <div className="flex-1">
                  {sideBySide && hasMultiple ? (
                    <div className="space-y-3">
                      {availableLabels.map((label) => {
                        const t = verse.translations.find((tr) => tr.label === label)
                        if (!t) return null
                        return (
                          <div key={label}>
                            <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                              {LABEL_DISPLAY[label]} — {t.name}
                            </span>
                            <p className="text-sm leading-relaxed text-stone-800">{t.text}</p>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed text-stone-800">
                      {(
                        verse.translations.find((t) => t.name === selectedTranslation) ??
                        verse.translations.find((t) => t.isDefault) ??
                        verse.translations[0]
                      )?.text ?? ''}
                    </p>
                  )}

                  {allLinks.length > 0 && (
                    <button
                      onClick={() => setExpandedVerseId(isExpanded ? null : verse.id)}
                      className="mt-2 text-xs text-stone-400 hover:text-stone-600"
                    >
                      {isExpanded
                        ? '▲ Hide'
                        : `▼ ${allLinks.length} linked verse${allLinks.length > 1 ? 's' : ''}`}
                    </button>
                  )}

                  {isExpanded && allLinks.length > 0 && (
                    <div className="mt-3 space-y-2 border-l-2 border-stone-200 pl-3">
                      {allLinks.map((link) => {
                        const linkedDefault = link.linkedVerse.translations[0]
                        const trad = link.linkedVerse.source.tradition as keyof typeof TRADITION_BG
                        return (
                          <div key={link.id}>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge className={TRADITION_BG[trad]}>
                                {link.linkedVerse.source.title}
                              </Badge>
                              <span className="text-xs text-stone-400">
                                {link.linkedVerse.book} {link.linkedVerse.chapter}:{link.linkedVerse.verse}
                              </span>
                              <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] uppercase text-stone-500">
                                {link.linkType.replace('_', ' ')}
                              </span>
                            </div>
                            {linkedDefault && (
                              <p className="mt-1 text-xs italic text-stone-500">
                                "{linkedDefault.text}"
                              </p>
                            )}
                            {link.notes && (
                              <p className="mt-0.5 text-xs text-stone-400">{link.notes}</p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
