'use client'

import { useState } from 'react'
import type { Verse, VerseTranslation, VerseLink, Source } from '@/generated/prisma/client'
import { Badge } from '@/components/ui/Badge'
import { TRADITION_BG } from '@/lib/constants'
import { ScriptText } from '@/components/ui/ScriptText'
import { verseAnchorId } from '@/lib/verse-links'

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
      <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-[#e5d9c8] pb-5">
        {hasMultiple && (
          <div className="flex items-center rounded-full border border-[#d7c5ad] bg-[#f3eadb] p-0.5">
            <button
              type="button"
              onClick={() => setSideBySide(false)}
              aria-pressed={!sideBySide}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                !sideBySide ? 'bg-[#173b68] text-white' : 'text-[#51483c] hover:text-[#242019]'
              }`}
            >
              Single
            </button>
            <button
              type="button"
              onClick={() => setSideBySide(true)}
              aria-pressed={sideBySide}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                sideBySide ? 'bg-[#173b68] text-white' : 'text-[#51483c] hover:text-[#242019]'
              }`}
            >
              Compare editions
            </button>
          </div>
        )}

        {!sideBySide && hasMultiple && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone-600">Edition:</span>
            {translationNames.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setSelectedTranslation(name)}
                aria-pressed={selectedTranslation === name}
                className={`rounded-full border px-3 py-0.5 text-xs transition-colors ${
                  selectedTranslation === name
                    ? 'border-[#173b68] bg-[#173b68] text-white'
                    : 'border-[#b9aa95] bg-[#fffdf9] text-[#51483c] hover:border-[#173b68]'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        )}

        {sideBySide && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone-600">Editions of this same numbered passage:</span>
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
              id={verseAnchorId(verse.verse)}
              className={`group scroll-mt-28 rounded-lg px-1 py-4 transition-colors target:bg-[#f3eadb] target:ring-2 target:ring-[#a67222] ${
                isExpanded ? 'bg-[#f7f0e5]' : 'hover:bg-[#faf6ee]'
              }`}
            >
              <div className="flex gap-3">
                <span className="w-8 flex-shrink-0 pt-1 text-right text-xs font-semibold text-[#655a4b]">
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
                            <ScriptText text={t.text} className="text-base leading-8 text-[#242019]" />
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <ScriptText
                      text={
                        (
                          verse.translations.find((t) => t.name === selectedTranslation) ??
                          verse.translations.find((t) => t.isDefault) ??
                          verse.translations[0]
                        )?.text ?? ''
                      }
                      className="text-lg leading-8 text-[#242019]"
                    />
                  )}

                  {allLinks.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setExpandedVerseId(isExpanded ? null : verse.id)}
                      aria-expanded={isExpanded}
                      className="editorial-link mt-2 text-xs"
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
                              <ScriptText
                                text={linkedDefault.text}
                                quoted
                                className="mt-1 text-xs italic text-stone-500"
                              />
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
