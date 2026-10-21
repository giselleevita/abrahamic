import Link from 'next/link'
import { GLOSSARY } from '@/lib/glossary'

/** Terms safe to explain inline. Everyday words in the glossary (Silent, Parallel...) are left alone. */
const INLINE_TERMS = [
  'Soteriology', 'Eschatology', 'Hermeneutics', 'Exegesis', 'Typology', 'Tafsir', 'Midrash',
  'Hadith', 'Talmud', 'Tawhid', 'Shema', 'Cosmology', 'Theology', 'Prophethood',
  'Original Sin', 'Hebrew Bible', 'New Testament',
]
const ALIAS: Record<string, string> = { Mashiach: 'Messiah / Mashiach', Messiah: 'Messiah / Mashiach' }

const definitions = new Map<string, string>()
for (const section of GLOSSARY) for (const e of section.entries) definitions.set(e.term, e.definition)
const TERMS = [...INLINE_TERMS, ...Object.keys(ALIAS)].filter((t) => definitions.has(ALIAS[t] ?? t))
const PATTERN = new RegExp(`\\b(${[...TERMS].sort((a, b) => b.length - a.length).join('|')})\\b`, 'g')

/**
 * Wraps the first mention of each glossary term in a link that shows its
 * definition on hover or focus, so a reader need not leave the page.
 */
export function GlossaryText({ text }: { text: string }) {
  const seen = new Set<string>()
  const out: React.ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(PATTERN)) {
    const word = m[1]
    const key = ALIAS[word] ?? word
    if (seen.has(key)) continue
    seen.add(key)
    const def = definitions.get(key)
    if (!def) continue
    out.push(text.slice(last, m.index))
    out.push(
      <Link key={`${key}-${m.index}`} href="/glossary" className="glossary-term" data-definition={def} aria-description={def}>
        {word}
      </Link>,
    )
    last = m.index + word.length
  }
  out.push(text.slice(last))
  return <>{out}</>
}
