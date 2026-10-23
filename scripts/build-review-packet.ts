// Usage: npx tsx scripts/build-review-packet.ts > docs/release/EDITORIAL_REVIEW_LIVE_TEXT.md
// Extracts the project-written text that is live in code (not the database-held, editor-authored
// content) so a qualified reviewer reads exactly what a visitor reads. Regenerate after any edit.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { MAP_PLACES } from '../src/lib/map-places'
import { BIG_LINKS, BIG_NODES } from '../src/lib/big-picture'

const out: string[] = []
const p = (s = '') => out.push(s)
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]))
const quote = (s: string) => s.split('\n').map((l) => `> ${l}`).join('\n')

p('# Live project-written text — review packet')
p()
p('**Status: UNREVIEWED.** Everything below is project-written explanatory text that a visitor can read today. It was written with AI assistance and has had no qualified human review. This file lists it for a reviewer; it is not approval. Regenerate with `npx tsx scripts/build-review-packet.ts`.')
p()
p('For each item the reviewer records: **Accept / Edit / Withdraw**, their name and qualification, and the date. Questions that apply to every item: Is it attributed to a tradition rather than stated as fact? Does it avoid implying one view speaks for a whole tradition? Is any date, place or relationship supported by the cited text?')
p()
p('## 1. Map place descriptions')
p()
p(`${MAP_PLACES.length} places. Locations are approximate (shown on the page). Each has a story sentence and sometimes a caution.`)
p()
for (const m of MAP_PLACES) {
  p(`### ${m.name}`)
  p(`Eras: ${m.eras.join(', ')} · Links: ${m.links.map((l) => l.href).join(', ')}`)
  p(quote(m.story))
  if (m.caution) p(quote(`Caution: ${m.caution}`))
  p()
}

p('## 2. Overview diagram: source sentences')
p()
p('Lines of kind `tradition` are a tradition\'s own account and must read "According to …". The reviewer should check that no `tradition` line reads as recorded fact, and that held relations (Jesus–David, Kedar–Muhammad) appear only as a tradition\'s account.')
p()
const label = new Map(BIG_NODES.map((n) => [n.id, n.label]))
p('| From | To | Kind | Sentence shown |')
p('| --- | --- | --- | --- |')
for (const l of BIG_LINKS) p(`| ${label.get(l.from) ?? l.from} | ${label.get(l.to) ?? l.to} | ${l.kind} | ${l.source.replace(/[\\|]/g, '\\$&')} |`)
p()
const subs = BIG_NODES.filter((n) => n.sub)
p('Node sub-labels:')
p()
for (const n of subs) p(`- ${n.label}: ${n.sub}`)
p()

p('## 3. “In plain words” boxes')
p()
const pages = walk('src/app').filter((f) => /page\.tsx$/.test(f))
let count = 0
for (const f of pages) {
  const src = readFileSync(f, 'utf8')
  const title = /title="([^"]+)"/.exec(src)?.[1]
  const plain = /plainWords=(?:"([^"]+)"|\{`([^`]+)`\}|\{'([^']+)'\})/.exec(src)
  if (!plain) continue
  count++
  p(`### ${title ?? f}  \`${f.replace('src/app', '').replace('/page.tsx', '') || '/'}\``)
  p(quote(plain[1] ?? plain[2] ?? plain[3]))
  p()
}
p(`(${count} boxes found.)`)
p()

p('## 4. Kids copy')
p()
p('### 4a. Seeded stories')
p()
p('**Flag for the editor:** the seed marks stories `APPROVED` and published with `reviewedAt` set at seed time and no named reviewer, and describes them as "hand-authored". Confirm who wrote and who approved each before relying on that status. One story is deliberately `PENDING` and unpublished.')
p()
const kidsSeed = readFileSync('prisma/seed/kidsStories.ts', 'utf8')
// Parsed block by block with simple patterns, not one nested regex, so a malformed seed cannot cause runaway backtracking.
const blocks = kidsSeed.split(/\n\s*slug: '/).slice(1)
for (const block of blocks) {
  const slug = block.slice(0, block.indexOf("'"))
  const title = /title: '([^']+)'/.exec(block)?.[1] ?? slug
  const age = /ageBand: '([^']+)'/.exec(block)?.[1] ?? ''
  const status = /status: '([^']+)'/.exec(block)?.[1] ?? ''
  const published = /isPublished: (true|false)/.exec(block)?.[1] ?? ''
  const bodyChunk = block.slice(block.indexOf('body:'), block.indexOf('glossary:'))
  const body = [...bodyChunk.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1].replace(/\\'/g, "'")).join('')
  p(`#### ${title} (${age}, seed status ${status}, published: ${published})`)
  p(quote(body))
  p()
}
p('### 4b. Kids page and game wording')
p()
for (const f of [...walk('src/app/kids'), ...walk('src/components/kids')].filter((x) => x.endsWith('.tsx'))) {
  const src = readFileSync(f, 'utf8')
  const lines = [...src.matchAll(/>\s*([A-Z][^<>{}\n]{35,})\s*</g)].map((m) => m[1].trim())
  const strs = [...src.matchAll(/(?:description|text|blurb|intro|hint)[:=]\s*['"`]([^'"`\n]{35,})['"`]/g)].map((m) => m[1])
  const all = [...new Set([...lines, ...strs])]
  if (!all.length) continue
  p(`#### \`${f}\``)
  for (const l of all) p(`- ${l}`)
  p()
}
console.log(out.join('\n'))
