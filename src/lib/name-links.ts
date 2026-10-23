export type NameFigure = { slug: string; name: string; aliases: { tradition: string; name: string; language?: string | null }[] }
export type Segment = { text: string } | { text: string; figure: NameFigure }

const MIN_LEN = 4
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Splits `text` into plain runs and the first mention of each known person.
 * Longer names win over shorter ones ("Abdul-Muttalib" before "Abdul"), names
 * under four letters are ignored to avoid false matches, and one name that
 * belongs to two people is skipped rather than guessed.
 */
export function findNameMatches(text: string, figures: NameFigure[], exclude: string[] = []): Segment[] {
  const owners = new Map<string, NameFigure | null>()
  for (const f of figures) {
    if (exclude.includes(f.slug)) continue
    for (const n of new Set([f.name, ...f.aliases.map((a) => a.name)])) {
      const key = n.trim()
      if (key.length < MIN_LEN) continue
      const prev = owners.get(key.toLowerCase())
      owners.set(key.toLowerCase(), prev === undefined || prev?.slug === f.slug ? f : null)
    }
  }
  const names = [...owners.entries()].filter(([, f]) => f).map(([n]) => n).sort((a, b) => b.length - a.length)
  if (names.length === 0) return [{ text }]
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(${names.map(esc).join('|')})(?![\\p{L}\\p{N}])`, 'giu')
  const seen = new Set<string>()
  const out: Segment[] = []
  let last = 0
  for (const m of text.matchAll(pattern)) {
    const figure = owners.get(m[1].toLowerCase())
    if (!figure || seen.has(figure.slug)) continue
    seen.add(figure.slug)
    if (m.index! > last) out.push({ text: text.slice(last, m.index) })
    out.push({ text: m[1], figure })
    last = m.index! + m[1].length
  }
  if (last < text.length) out.push({ text: text.slice(last) })
  return out.length ? out : [{ text }]
}
