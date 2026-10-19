import { ComparisonLens } from '@/components/claims/ComparisonLens'
import type { ComparisonWithClaims } from '@/types'
import { COMPARISON_TAG_LABEL, TRADITION_LABEL, TRADITION_BG, TRADITION_SURFACE } from '@/lib/constants'
import { filterVerseTranslations } from '@/lib/filter-public-translations'
import { ScriptText } from '@/components/ui/ScriptText'
import { Citation } from '@/components/ui/Citation'

interface Props { comparison: ComparisonWithClaims; showSummary?: boolean }
export function ComparisonBlock({ comparison, showSummary = true }: Props) {
  return <div>
    <span className="mb-5 inline-flex rounded-full border border-[#d7c5ad] bg-[#f3eadb] px-3 py-2 text-sm font-semibold text-primary-800">{COMPARISON_TAG_LABEL[comparison.tag]}</span>
    {showSummary && comparison.summary && <p className="mb-6 leading-7 text-primary-700">{comparison.summary}</p>}
    {(comparison.sharedGround || comparison.keyDifferences) && <div className="mb-8 grid gap-4 md:grid-cols-2">{comparison.sharedGround && <section className="editorial-card p-5"><h2 className="text-xl">Shared ground</h2><p className="mt-3 whitespace-pre-line leading-7 text-primary-700">{comparison.sharedGround}</p></section>}{comparison.keyDifferences && <section className="editorial-card p-5"><h2 className="text-xl">Key differences</h2><p className="mt-3 whitespace-pre-line leading-7 text-primary-700">{comparison.keyDifferences}</p></section>}</div>}
    <h2 className="mb-4 text-2xl">Each tradition’s perspective</h2>
    <ComparisonLens views={comparison.claims.map(({ claim }) => {
        const primary = claim.verses.find((v) => v.isPrimary)?.verse ?? claim.verses[0]?.verse
        const edition = primary ? filterVerseTranslations(primary.translations).find((t) => t.isDefault) ?? filterVerseTranslations(primary.translations)[0] : undefined
        return { id: claim.id, tradition: claim.source.tradition, content: <article key={claim.id} className={`overflow-hidden rounded-2xl border ${TRADITION_SURFACE[claim.source.tradition]}`}>
          <div className={`px-5 py-4 ${TRADITION_BG[claim.source.tradition]}`}><p className="text-sm font-bold">{TRADITION_LABEL[claim.source.tradition]}</p><p className="mt-1 text-sm">{claim.source.title}</p></div>
          <div className="space-y-4 p-5"><p className="text-xs font-semibold uppercase tracking-wide text-primary-700">Project explanation</p><p className="leading-7 text-primary-900">{claim.statement}</p>
            {(claim.specificTradition || claim.interpretationScope) && <p className="text-sm text-primary-700">{claim.specificTradition || claim.interpretationScope?.replaceAll('_', ' ').toLowerCase()}</p>}
            {primary && edition && <div className="border-t border-[#d7c5ad] pt-4"><p className="mb-2 text-xs font-semibold text-primary-700">{edition.name === 'Reader note (original)' ? 'Project reader note' : 'Scripture excerpt'} · {edition.name}</p><blockquote><ScriptText text={edition.text} quoted className="text-base leading-7 text-primary-800" /></blockquote></div>}
          </div>
        </article> }
      })} />
    <section className="editorial-card mt-8 p-5 sm:p-7" aria-label="Supporting passages"><h2 className="text-2xl">Supporting passages</h2><p className="mt-2 text-sm leading-6 text-primary-700">Read the sources in context. References across traditions do not imply equivalent passages.</p><ul className="mt-5 space-y-5">{comparison.claims.map(({ claim }) => <li key={claim.id}><p className="mb-2 font-semibold">{TRADITION_LABEL[claim.source.tradition]} · {claim.source.title}</p>{claim.verses.length ? <ul className="flex flex-wrap gap-x-5 gap-y-3">{claim.verses.map(({ verse }) => <li key={verse.id}><Citation sourceSlug={claim.source.slug} verse={verse} /></li>)}</ul> : <p className="text-sm text-primary-700">No passage reference is attached to this explanation.</p>}</li>)}</ul></section>
  </div>
}
