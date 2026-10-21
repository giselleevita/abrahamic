/**
 * The whole-picture overview: how the three traditions relate to one another.
 *
 * Hand-authored, not derived from the genealogy table, because it also shows
 * how each tradition began. Every line carries a kind so the reader can tell a
 * recorded family link from a tradition's own account:
 *  - recorded:  a parent-child link in the sourced genealogy (solid).
 *  - kin:       a recorded family tie that is not descent, e.g. spouse, brother
 *               or nephew (solid green).
 *  - tradition: what a tradition itself teaches about descent or origin (dashed,
 *               always worded "According to ..."). Several are held back from
 *               the genealogy table pending editorial review, so they are never
 *               drawn as recorded fact.
 *  - honoured:  a figure a later tradition also reveres (listed under the religion).
 *  - gap:       generations that exist but are not drawn (dotted).
 *
 * Layers let a reader simplify the picture: the core line of Abraham and his
 * descendants is always shown.
 */
export type BigLayer = 'women' | 'kin' | 'prophets'
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
  layer?: BigLayer
  /** Smaller box, used inside the prophets panel. */
  compact?: boolean
}
export type BigLinkKind = 'recorded' | 'kin' | 'tradition' | 'honoured' | 'gap'
export type BigLink = {
  from: string
  to: string
  kind: BigLinkKind
  label?: string
  /** Plain-language source or account, shown in the text list. */
  source: string
}

export const LAYERS: { id: BigLayer; label: string; hint: string }[] = [
  { id: 'women', label: 'Women', hint: 'Eve, Hagar and Mary' },
  { id: 'kin', label: 'Relatives', hint: 'Lot and Aaron' },
  { id: 'prophets', label: 'Prophets', hint: 'Elijah to John the Baptist' },
]

export const PROPHET_PANEL = { x: 8, y: 585, w: 124, h: 330, title: 'Prophets and forerunners', note: 'In the order of the site timeline' }

export const BIG_NODES: BigNode[] = [
  { id: 'adam', label: 'Adam', kind: 'figure', slug: 'adam', x: 600, y: 30, sub: 'First human in all three' },
  { id: 'eve', label: 'Eve', kind: 'figure', slug: 'eve', x: 810, y: 30, sub: 'Hawwa in Islam', layer: 'women' },
  { id: 'enoch', label: 'Enoch', kind: 'figure', slug: 'enoch', x: 600, y: 125, sub: 'Idris in Islam' },
  { id: 'noah', label: 'Noah', kind: 'figure', slug: 'noah', x: 600, y: 220 },
  { id: 'abraham', label: 'Abraham', kind: 'figure', slug: 'abraham', x: 600, y: 335, sub: 'Honoured in all three' },
  { id: 'lot', label: 'Lot', kind: 'figure', slug: 'lot', x: 810, y: 335, sub: 'Lut in Islam', layer: 'kin' },
  { id: 'isaac', label: 'Isaac', kind: 'figure', slug: 'isaac', x: 360, y: 445 },
  { id: 'hagar', label: 'Hagar', kind: 'figure', slug: 'hagar', x: 715, y: 445, layer: 'women' },
  { id: 'ishmael', label: 'Ishmael', kind: 'figure', slug: 'ishmael', x: 890, y: 445 },
  { id: 'jacob', label: 'Jacob', kind: 'figure', slug: 'jacob', x: 360, y: 545, sub: 'Israel' },
  { id: 'kedar', label: 'Kedar', kind: 'figure', slug: 'kedar', x: 890, y: 545 },
  { id: 'aaron', label: 'Aaron', kind: 'figure', slug: 'aaron', x: 215, y: 650, sub: 'Harun in Islam', layer: 'kin' },
  { id: 'moses', label: 'Moses', kind: 'figure', slug: 'moses', x: 395, y: 650 },
  { id: 'david', label: 'David', kind: 'figure', slug: 'david', x: 570, y: 650 },
  { id: 'mary', label: 'Mary', kind: 'figure', slug: 'mary', x: 760, y: 650, sub: 'Maryam in Islam', layer: 'women' },
  { id: 'solomon', label: 'Solomon', kind: 'figure', slug: 'solomon', x: 570, y: 745 },
  { id: 'jesus', label: 'Jesus', kind: 'figure', slug: 'jesus', x: 760, y: 745, sub: 'Isa in Islam' },
  { id: 'muhammad', label: 'Muhammad', kind: 'figure', slug: 'muhammad', x: 940, y: 745 },
  { id: 'judaism', label: 'Judaism', kind: 'religion', x: 395, y: 880, sub: 'Torah and Temple' },
  { id: 'christianity', label: 'Christianity', kind: 'religion', x: 740, y: 880, sub: '1st century' },
  { id: 'islam', label: 'Islam', kind: 'religion', x: 950, y: 880, sub: '7th century' },
  // The prophets panel: stacked, in the order of the site's own timeline.
  { id: 'elijah', label: 'Elijah', kind: 'figure', slug: 'elijah', x: 70, y: 650, layer: 'prophets', compact: true },
  { id: 'isaiah', label: 'Isaiah', kind: 'figure', slug: 'isaiah', x: 70, y: 710, layer: 'prophets', compact: true },
  { id: 'jonah', label: 'Jonah', kind: 'figure', slug: 'jonah', x: 70, y: 770, layer: 'prophets', compact: true },
  { id: 'ezra', label: 'Ezra', kind: 'figure', slug: 'ezra', x: 70, y: 830, layer: 'prophets', compact: true },
  { id: 'john', label: 'John the Baptist', kind: 'figure', slug: 'john-the-baptist', x: 70, y: 890, layer: 'prophets', compact: true },
]

export const BIG_LINKS: BigLink[] = [
  { from: 'adam', to: 'eve', kind: 'kin', label: 'wife', source: 'Genesis 3:20 says Adam named his wife Eve. The Quran also speaks of Adam and his wife, whom Islamic tradition names Hawwa.' },
  { from: 'adam', to: 'enoch', kind: 'gap', label: '5 generations', source: 'Genesis 5 lists five generations between Adam and Enoch: Seth, Enosh, Kenan, Mahalalel and Jared. They are not drawn here.' },
  { from: 'enoch', to: 'noah', kind: 'gap', label: '2 generations', source: 'Genesis 5 lists two generations between Enoch and Noah: Methuselah and Lamech. They are not drawn here.' },
  { from: 'noah', to: 'abraham', kind: 'gap', label: '9 generations', source: 'Genesis 11 lists nine generations between Noah and Abraham, from Shem to Terah. They are not drawn here.' },
  { from: 'abraham', to: 'lot', kind: 'kin', label: 'nephew', source: 'Genesis 11:27 and 12:5 describe Lot as the son of Abraham\'s brother Haran, so Abraham\'s nephew. The Quran honours Lot (Lut) as a prophet.' },
  { from: 'abraham', to: 'isaac', kind: 'recorded', source: 'Genesis 21:3 records Isaac as Abraham\'s son.' },
  { from: 'abraham', to: 'ishmael', kind: 'recorded', source: 'Genesis 16:15 records Ishmael as Abraham\'s son. The Quran also honours both sons.' },
  { from: 'hagar', to: 'ishmael', kind: 'recorded', source: 'Genesis 16:15 records Hagar as the mother of Ishmael.' },
  { from: 'isaac', to: 'jacob', kind: 'recorded', source: 'Genesis 25:26 records Jacob as Isaac\'s son. Jacob is also called Israel.' },
  { from: 'ishmael', to: 'kedar', kind: 'recorded', source: 'Genesis 25:13 lists Kedar among the sons of Ishmael.' },
  { from: 'jacob', to: 'moses', kind: 'gap', label: 'tribes of Israel', source: 'Exodus 6 places Moses in the tribe of Levi, a son of Jacob; the generations between are not drawn.' },
  { from: 'jacob', to: 'david', kind: 'gap', source: 'David belongs to the tribe of Judah, a son of Jacob; the generations between are not drawn.' },
  { from: 'moses', to: 'aaron', kind: 'kin', label: 'brother', source: 'Exodus 6:20 and 7:1 describe Aaron as Moses\'s brother. The Quran also speaks of Harun as Musa\'s brother.' },
  { from: 'david', to: 'solomon', kind: 'recorded', source: 'The Hebrew Bible records Solomon as David\'s son.' },
  { from: 'mary', to: 'jesus', kind: 'recorded', source: 'Luke 2:7 records Mary giving birth to Jesus. The Quran also calls him Isa, son of Maryam.' },
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

/** The prophets panel is a list in timeline order, not a set of lines. */
export const PROPHET_ORDER = ['elijah', 'isaiah', 'jonah', 'ezra', 'john'] as const
export const PROPHET_NOTES: Record<(typeof PROPHET_ORDER)[number], string> = {
  elijah: 'Elijah (Eliyahu; Ilyas in Islam) appears in the Hebrew Bible, and in the Gospels at the Transfiguration.',
  isaiah: 'Isaiah (Yeshayahu) is the most-quoted prophet in the New Testament.',
  jonah: 'Jonah (Yonah; Yunus in Islam) is the subject of a Hebrew Bible book and of a Quran chapter.',
  ezra: 'Ezra is the scribe and priest credited in Jewish tradition with leading the return from exile and restoring the Torah.',
  john: 'John the Baptist (Yochanan; Yahya in Islam) is a forerunner of Jesus in the Gospels; the Quran honours Yahya as a prophet.',
}
