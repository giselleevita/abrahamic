export const READING_KEY = 'abrahamic:reading:v1'
export const EFFECTS_KEY = 'abrahamic:effects:v1'
export type ReadingPreferences = { version: 1; size: 18 | 21 | 24; spacious: boolean; edition: string }
export const DEFAULT_READING: ReadingPreferences = { version: 1, size: 18, spacious: false, edition: '' }
export const DEFAULT_EFFECTS = { version: 1 as const, reduced: false }
export function parseReading(raw: string): ReadingPreferences {
  const v = JSON.parse(raw)
  if (v?.version !== 1) return DEFAULT_READING
  return { version: 1, size: [18, 21, 24].includes(v.size) ? v.size : 18, spacious: v.spacious === true, edition: typeof v.edition === 'string' ? v.edition.slice(0, 200) : '' }
}
export function parseEffects(raw: string) {
  const v = JSON.parse(raw)
  return { version: 1 as const, reduced: v?.version === 1 && v.reduced === true }
}
export function activeEdition(
  preferred: string,
  editions: { name: string; isDefault: boolean; coverage?: number }[],
) {
  const explicit = preferred && editions.find((edition) => edition.name === preferred)
  if (explicit) return explicit.name

  const covered = editions.filter((edition) => (edition.coverage ?? 1) > 0)
  if (!covered.length) return editions[0]?.name ?? ''

  // Old imports could mark a project-authored placeholder as default even
  // when a permitted scripture edition covered more of the chapter.
  const priority = ['Hebrew (MT)', 'Arabic', 'World English Bible', 'Reader note (original)']
  return [...covered].sort((a, b) => {
    const coverage = (b.coverage ?? 1) - (a.coverage ?? 1)
    if (coverage) return coverage
    const defaultPriority = Number(b.isDefault && b.name !== 'Reader note (original)') - Number(a.isDefault && a.name !== 'Reader note (original)')
    if (defaultPriority) return defaultPriority
    const aPriority = priority.indexOf(a.name)
    const bPriority = priority.indexOf(b.name)
    return (aPriority < 0 ? priority.length : aPriority) - (bPriority < 0 ? priority.length : bPriority)
  })[0]?.name ?? editions[0]?.name ?? ''
}
