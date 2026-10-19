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
export function activeEdition(preferred: string, editions: { name: string; isDefault: boolean }[]) {
  return editions.find((e) => e.name === preferred)?.name ?? editions.find((e) => e.isDefault)?.name ?? editions[0]?.name ?? ''
}
