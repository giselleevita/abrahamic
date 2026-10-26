import Link from 'next/link'
import type { ClaimWithRelations } from '@/types'
import type { Tradition } from '@/generated/prisma/client'
import { formatVerseRef, verseReaderHref } from '@/lib/verse-links'
import { filterVerseTranslations } from '@/lib/filter-public-translations'
import { preferredPublicTranslation } from '@/lib/public-demo-policy'
import { Citation } from '@/components/ui/Citation'
import { ScriptText } from '@/components/ui/ScriptText'
import { SignoffBadge } from '@/components/claims/SignoffBadge'

interface Props {
  claim: ClaimWithRelations
  showSource?: boolean
}

const TRADITION_STYLE: Record<Tradition, { sourceDot: string; sourceText: string; citeBg: string }> = {
  JEWISH:    { sourceDot: 'bg-jewish-600',   sourceText: 'text-jewish-700',  citeBg: 'bg-jewish-50'   },
  CHRISTIAN: { sourceDot: 'bg-christian-600',    sourceText: 'text-christian-700',   citeBg: 'bg-christian-50'    },
  ISLAMIC:   { sourceDot: 'bg-islamic-600', sourceText: 'text-islamic-700', citeBg: 'bg-islamic-50'  },
  SHARED:    { sourceDot: 'bg-violet-500', sourceText: 'text-violet-700', citeBg: 'bg-violet-50' },
}

export function ClaimCard({ claim, showSource = true }: Props) {
  const tradition = claim.source.tradition as Tradition
  const style = TRADITION_STYLE[tradition] ?? TRADITION_STYLE.SHARED
  const primaryVerse = claim.verses[0]?.verse
  // Pages feeding this component query prisma directly, so apply the
  // public-demo policy here too rather than trusting how the DB was seeded.
  // If the only available translation is licensed, the quote is omitted.
  const defaultTranslation = primaryVerse
    ? preferredPublicTranslation(filterVerseTranslations(primaryVerse.translations))
    : undefined

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4">
      {showSource && (
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${style.sourceDot}`} />
          <span className={`text-xs font-semibold ${style.sourceText}`}>{claim.source.title}</span>
        </div>
      )}

      <p className="text-sm text-stone-800 leading-relaxed">{claim.statement}</p>

      {primaryVerse && defaultTranslation && (
        <blockquote className={`rounded-md ${style.citeBg} px-3 py-2`}>
          <ScriptText text={defaultTranslation.text} quoted className="text-xs text-stone-600 italic leading-relaxed" />
          <p className="text-xs text-primary-700">{defaultTranslation.name === 'Reader note (original)' ? 'Project explanation · ' : 'Edition: '}{defaultTranslation.name}{defaultTranslation.attribution ? ` · ${defaultTranslation.attribution}` : ''}</p>
          <cite className="mt-1 block not-italic">
            <Link
              href={verseReaderHref(claim.source.slug, primaryVerse)}
              className="text-xs font-semibold text-stone-500 underline decoration-stone-300 underline-offset-2 transition-colors hover:text-blue-800 hover:decoration-blue-400"
            >
              {formatVerseRef(primaryVerse)}
              <span className="sr-only"> — read in context</span>
            </Link>
          </cite>
        </blockquote>
      )}

      {claim.verses.length > 0 && <ul aria-label="All supporting passages" className="flex flex-wrap gap-3">{claim.verses.map(({ verse }) => <li key={verse.id}><Citation sourceSlug={claim.source.slug} verse={verse} /></li>)}</ul>}

      <SignoffBadge requiredTraditions={claim.requiredTraditions} signoffSummary={claim.signoffSummary} revision={claim.revision} />
      <Link href={`/suggest?claim=${claim.id}`} className="self-start text-xs text-stone-400 underline decoration-stone-300 underline-offset-2 hover:text-blue-800">
        Report a problem with this claim
      </Link>

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
