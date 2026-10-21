import { describe, expect, it } from 'vitest'
import { decodeShare, encodeShare, notesToMarkdown, parseList, parseNotes, toggleListItem, upsertNote } from './notebook'

const note = (href: string, text: string, at = 1) => ({ href, label: 'L', text, at })

describe('notebook', () => {
  it('keeps one note per page, newest first, and removes a page note when emptied', () => {
    let n = upsertNote([], note('/figures/moses', 'a'))
    n = upsertNote(n, note('/figures/abraham', 'b'))
    n = upsertNote(n, note('/figures/moses', 'c'))
    expect(n.map((x) => `${x.href}:${x.text}`)).toEqual(['/figures/moses:c', '/figures/abraham:b'])
    expect(upsertNote(n, note('/figures/moses', '   ')).map((x) => x.href)).toEqual(['/figures/abraham'])
  })

  it('toggles reading-list items', () => {
    const item = { href: '/concepts/salvation', label: 'Salvation' }
    expect(toggleListItem([], item)).toEqual([item])
    expect(toggleListItem([item], item)).toEqual([])
  })

  it('round-trips a share link, including accents and non-Latin text', () => {
    const list = [{ href: '/figures/moses', label: 'Moses, Moshe, Musa — موسى' }, { href: '/concepts/trinity', label: 'Trinity' }]
    expect(decodeShare(encodeShare(list))).toEqual(list)
  })

  it('refuses off-site, scripted or malformed share links', () => {
    const evil = encodeShare([{ href: 'https://evil.example', label: 'x' }, { href: '//evil.example', label: 'y' }, { href: 'javascript:alert(1)', label: 'z' }, { href: '/figures/../admin', label: 'w' }])
    expect(decodeShare(evil)).toEqual([])
    expect(decodeShare('not base64 !!')).toEqual([])
    expect(decodeShare(undefined)).toEqual([])
    expect(decodeShare('a'.repeat(7000))).toEqual([])
  })

  it('drops invalid stored entries', () => {
    expect(parseNotes(JSON.stringify([note('/figures/ok', 't'), note('https://x.y', 't'), { href: '/figures/a', label: 1, text: 't', at: 1 }])).map((n) => n.href)).toEqual(['/figures/ok'])
    expect(parseList(JSON.stringify([{ href: '/admin/users', label: 'x' }, { href: '/map', label: 'Map' }])).map((l) => l.href)).toEqual(['/map'])
  })

  it('exports notes and the reading list as markdown', () => {
    const md = notesToMarkdown([note('/figures/moses', 'hello')], [{ href: '/map', label: 'Map' }])
    expect(md).toContain('## L')
    expect(md).toContain('hello')
    expect(md).toContain('- Map (/map)')
  })
})
