export type SavedItem = { id: string; kind: 'verse' | 'comparison'; href: string; label: string }
export type SavedItems = { version: 1; items: SavedItem[] }
export const SAVED_KEY = 'abrahamic:saved:v1'
export const EMPTY_SAVED: SavedItems = { version: 1, items: [] }
export function validSavedItem(item: unknown): item is SavedItem {
  if (!item || typeof item !== 'object') return false
  const v = item as Record<string, unknown>
  return typeof v.id === 'string' && v.id.length <= 200 && typeof v.label === 'string' && v.label.length <= 300 && typeof v.href === 'string' && v.href.length <= 2000 &&
    ((v.kind === 'comparison' && /^\/comparisons\/\d+$/.test(v.href)) || (v.kind === 'verse' && /^\/sources\/[a-z0-9-]+\/read\?[^#]+#(?:v|h)-\d+$/.test(v.href)))
}
export function parseSaved(raw: string): SavedItems {
  const v = JSON.parse(raw)
  if (v?.version !== 1 || !Array.isArray(v.items)) return EMPTY_SAVED
  const seen = new Set<string>()
  return { version: 1, items: v.items.filter((i: unknown) => {
    if (!validSavedItem(i) || seen.has(i.id)) return false
    seen.add(i.id)
    return true
  }).slice(0, 500).map((i: SavedItem) => ({ id: i.id, kind: i.kind, href: i.href, label: i.label })) }
}
