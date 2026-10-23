export const NOTES_KEY = 'abrahamic.notes.v1'
export const READLIST_KEY = 'abrahamic.readlist.v1'

export type Note = { href: string; label: string; text: string; at: number }
export type ListItem = { href: string; label: string }

const PAGE = /^\/(figures|concepts|comparisons|themes|sources|learn|timeline|map|names|family-tree)(\/[A-Za-z0-9._~-]+){0,3}$/
const isPage = (h: unknown): h is string => typeof h === 'string' && h.length < 200 && !h.includes('..') && PAGE.test(h)

export function parseNotes(raw: string): Note[] {
  const data: unknown = JSON.parse(raw)
  if (!Array.isArray(data)) return []
  return data
    .filter((n): n is Note => !!n && isPage(n.href) && typeof n.label === 'string' && typeof n.text === 'string' && typeof n.at === 'number')
    .map((n) => ({ href: n.href, label: n.label.slice(0, 80), text: n.text.slice(0, 4000), at: n.at }))
    .slice(0, 200)
}

export function parseList(raw: string): ListItem[] {
  const data: unknown = JSON.parse(raw)
  if (!Array.isArray(data)) return []
  return data
    .filter((n): n is ListItem => !!n && isPage(n.href) && typeof n.label === 'string')
    .map((n) => ({ href: n.href, label: n.label.slice(0, 80) }))
    .slice(0, 50)
}

/** One note per page: saving replaces it, and an empty note removes it. */
export function upsertNote(notes: Note[], note: Note): Note[] {
  const rest = notes.filter((n) => n.href !== note.href)
  return note.text.trim() ? [note, ...rest] : rest
}

export function toggleListItem(list: ListItem[], item: ListItem): ListItem[] {
  return list.some((l) => l.href === item.href) ? list.filter((l) => l.href !== item.href) : [...list, item].slice(-50)
}

/** A share link carries only page paths and titles, never notes. */
export function encodeShare(list: ListItem[]): string {
  const json = JSON.stringify(list.map((l) => [l.href, l.label]))
  const bytes = new TextEncoder().encode(json)
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Anything that is not a plain list of known page paths is dropped, so a crafted link cannot point off-site. */
export function decodeShare(param: string | undefined): ListItem[] {
  if (!param || param.length > 6000) return []
  try {
    const b64 = param.replace(/-/g, '+').replace(/_/g, '/')
    const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4))
    const json = new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)))
    const data: unknown = JSON.parse(json)
    if (!Array.isArray(data)) return []
    return data
      .filter((x): x is [string, string] => Array.isArray(x) && isPage(x[0]) && typeof x[1] === 'string')
      .map(([href, label]) => ({ href, label: label.slice(0, 80) }))
      .slice(0, 50)
  } catch {
    return []
  }
}

export function notesToMarkdown(notes: Note[], list: ListItem[]): string {
  const lines = ['# My notes', '']
  for (const n of notes) lines.push(`## ${n.label}`, `<${n.href}>`, '', n.text, '')
  if (list.length) lines.push('# Reading list', '', ...list.map((l) => `- ${l.label} (${l.href})`), '')
  return lines.join('\n')
}
