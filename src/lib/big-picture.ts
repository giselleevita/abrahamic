/**
 * The whole-picture overview: how the three traditions relate to one another.
 *
 * Hand-authored, not derived from the genealogy table, because it also shows
 * how each tradition began. Every line carries a kind so the reader can tell a
 * recorded family link from a tradition's own account:
 *  - recorded:  a parent-child link in the sourced genealogy (solid).
 *  - tradition: what a tradition itself teaches about descent or origin (dashed,
 *               always worded "According to ..."). Several are held back from
 *               the genealogy table pending editorial review, so they are never
 *               drawn as recorded fact.
 *  - honoured:  a figure a later tradition also reveres (dotted).
 *  - gap:       generations that exist but are not drawn.
 */
export type BigNodeKind = 'figure' | 'religion'
export type BigNode = {
  id: string
  label: string
  kind: BigNodeKind
  x: number
  y: number
  /** Figure slug, for the link to the person's page. */
  slug?: string
  sub?: string
}
export type BigLinkKind = 'recorded' | 'tradition' | 'honoured' | 'gap'
export type BigLink = {
  from: string
  to: string
  kind: BigLinkKind
  label?: string
  /** Plain-language source or account, shown in the text list. */
  source: string
}

export const BIG_NODES: BigNode[] = [
  { id: 'adam', label: 'Adam', kind: 'figure', slug: 'adam', x: 450, y: 30, sub: 'First human in all three' },
  { id: 'noah', label: 'Noah', kind: 'figure', slug: 'noah', x: 450, y: 130 },
  { id: 'abraham', label: 'Abraham', kind: 'figure', slug: 'abraham', x: 450, y: 245, sub: 'Honoured in all three' },
  { id: 'isaac', label: 'Isaac', kind: 'figure', slug: 'isaac', x: 215, y: 355 },
  { id: 'ishmael', label: 'Ishmael', kind: 'figure', slug: 'ishmael', x: 685, y: 355 },
  { id: 'jacob', label: 'Jacob', kind: 'figure', slug: 'jacob', x: 215, y: 455, sub: 'Israel' },
  { id: 'kedar', label: 'Kedar', kind: 'figure', slug: 'kedar', x: 685, y: 455 },
  { id: 'moses', label: 'Moses', kind: 'figure', slug: 'moses', x: 95, y: 570 },
  { id: 'david', label: 'David', kind: 'figure', slug: 'david', x: 280, y: 570 },
  { id: 'solomon', label: 'Solomon', kind: 'figure', slug: 'solomon', x: 280, y: 660 },
  { id: 'jesus', label: 'Jesus', kind: 'figure', slug: 'jesus', x: 470, y: 660, sub: 'Isa in Islam' },
  { id: 'muhammad', label: 'Muhammad', kind: 'figure', slug: 'muhammad', x: 700, y: 660 },
  { id: 'judaism', label: 'Judaism', kind: 'religion', x: 150, y: 790, sub: 'Torah and Temple' },
  { id: 'christianity', label: 'Christianity', kind: 'religion', x: 450, y: 790, sub: '1st century' },
  { id: 'islam', label: 'Islam', kind: 'religion', x: 740, y: 790, sub: '7th century' },
]

export const BIG_LINKS: BigLink[] = [
  { from: 'adam', to: 'noah', kind: 'gap', label: '10 generations', source: 'Genesis 5 lists ten generations from Adam to Noah; they are not drawn here.' },
  { from: 'noah', to: 'abraham', kind: 'gap', label: '10 generations', source: 'Genesis 11 lists the generations from Noah\'s son Shem to Abraham; they are not drawn here.' },
  { from: 'abraham', to: 'isaac', kind: 'recorded', source: 'Genesis 21:3 records Isaac as Abraham\'s son.' },
  { from: 'abraham', to: 'ishmael', kind: 'recorded', source: 'Genesis 16:15 records Ishmael as Abraham\'s son. The Quran also honours both sons.' },
  { from: 'isaac', to: 'jacob', kind: 'recorded', source: 'Genesis 25:26 records Jacob as Isaac\'s son. Jacob is also called Israel.' },
  { from: 'ishmael', to: 'kedar', kind: 'recorded', source: 'Genesis 25:13 lists Kedar among the sons of Ishmael.' },
  { from: 'jacob', to: 'moses', kind: 'gap', label: 'tribes of Israel', source: 'Exodus 6 places Moses in the tribe of Levi, a son of Jacob; the generations between are not drawn.' },
  { from: 'jacob', to: 'david', kind: 'gap', label: 'tribes of Israel', source: 'David belongs to the tribe of Judah, a son of Jacob; the generations between are not drawn.' },
  { from: 'david', to: 'solomon', kind: 'recorded', source: 'The Hebrew Bible records Solomon as David\'s son.' },
  { from: 'david', to: 'jesus', kind: 'tradition', label: 'Gospel genealogies', source: 'According to Christian tradition, the genealogies in Matthew 1 and Luke 3 trace Jesus to David. These lines are held back from the recorded genealogy pending review.' },
  { from: 'kedar', to: 'muhammad', kind: 'tradition', label: 'Islamic tradition', source: 'According to Islamic tradition, Muhammad descends from Ishmael; the long chain rests on later Sirah and Hadith sources and is held back from the recorded genealogy pending review.' },
  { from: 'moses', to: 'judaism', kind: 'tradition', source: 'According to Jewish tradition, the Torah was given through Moses at Sinai.' },
  { from: 'jesus', to: 'christianity', kind: 'tradition', label: 'followers of Jesus', source: 'Christianity began in the first century among Jewish followers of Jesus.' },
  { from: 'judaism', to: 'christianity', kind: 'tradition', label: 'grew out of', source: 'Christianity grew out of first-century Judaism and keeps the Hebrew Bible as scripture.' },
  { from: 'muhammad', to: 'islam', kind: 'tradition', label: 'the Quran', source: 'According to Islamic tradition, the Quran was revealed to Muhammad in the seventh century.' },
  { from: 'abraham', to: 'judaism', kind: 'honoured', source: 'Jewish tradition remembers Abraham (Avraham) as the first patriarch.' },
  { from: 'abraham', to: 'christianity', kind: 'honoured', source: 'The New Testament presents Abraham as a father of faith (Romans 4).' },
  { from: 'abraham', to: 'islam', kind: 'honoured', source: 'The Quran honours Abraham (Ibrahim) as a prophet.' },
  { from: 'moses', to: 'islam', kind: 'honoured', source: 'The Quran honours Moses (Musa) as a prophet.' },
  { from: 'jesus', to: 'islam', kind: 'honoured', source: 'The Quran honours Jesus (Isa) as a prophet and messenger.' },
  { from: 'moses', to: 'christianity', kind: 'honoured', source: 'Christians read the Torah of Moses as part of the Old Testament.' },
]
