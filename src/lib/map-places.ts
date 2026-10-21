/**
 * Places in the stories, with what each tradition's text says happened there.
 * Locations are approximate and some are traditional rather than certain; the
 * note says so where it matters. Every claim names its text.
 */
export type MapPlace = {
  id: string
  name: string
  lat: number
  lon: number
  /** Label offset so pins near each other stay readable. */
  dx?: number
  dy?: number
  story: string
  caution?: string
  links: { label: string; href: string }[]
}

export const MAP_PLACES: MapPlace[] = [
  {
    id: 'ur', name: 'Ur', lat: 30.96, lon: 46.1, dy: 18,
    story: 'Genesis 11:28 names Ur of the Chaldeans as the place where Abraham’s family lived before he set out.',
    caution: 'Ur is traditionally placed in southern Iraq. Some Islamic and Jewish traditions name other birthplaces for Abraham.',
    links: [{ label: 'Abraham, Avraham, Ibrahim', href: '/figures/abraham' }],
  },
  {
    id: 'haran', name: 'Haran', lat: 36.86, lon: 39.03, dx: -8,
    story: 'Terah’s family settles at Haran. In Genesis 12:1–4 Abraham is called to leave and go to a land he will be shown.',
    links: [{ label: 'Abraham', href: '/figures/abraham' }, { label: 'Start the Abraham journey', href: '/learn' }],
  },
  {
    id: 'canaan', name: 'Hebron and Canaan', lat: 31.53, lon: 35.1, dx: -10, dy: 14,
    story: 'Abraham lives in the land of Canaan, near Hebron. Genesis 23 records him buying a burial place there for Sarah.',
    links: [{ label: 'Abraham', href: '/figures/abraham' }, { label: 'Isaac', href: '/figures/isaac' }, { label: 'Jacob', href: '/figures/jacob' }],
  },
  {
    id: 'egypt', name: 'Egypt', lat: 30.04, lon: 31.24, dx: -6, dy: 16,
    story: 'Genesis 37–50 tells how Joseph came to Egypt and how his family followed. Exodus 1–2 places the birth of Moses there.',
    links: [{ label: 'Joseph', href: '/figures/joseph' }, { label: 'Moses, Moshe, Musa', href: '/figures/moses' }],
  },
  {
    id: 'sinai', name: 'Sinai', lat: 28.54, lon: 33.97, dx: -14, dy: 20,
    story: 'In the Torah, God gives the law to Moses at Sinai (Exodus 19–20). The Quran also speaks of Mount Tur, which Islamic tradition identifies with Sinai.',
    caution: 'The exact mountain is not certain; Jebel Musa is the traditional site.',
    links: [{ label: 'Moses', href: '/figures/moses' }, { label: 'The Ten Commandments', href: '/concepts/ten-commandments' }],
  },
  {
    id: 'jerusalem', name: 'Jerusalem', lat: 31.77, lon: 35.21, dx: 12, dy: -8,
    story: 'David makes Jerusalem his capital (2 Samuel 5) and Solomon builds the Temple. The Gospels place the last days of Jesus there. Islamic tradition holds that Muhammad’s night journey went to the “farthest mosque” (Quran 17:1), understood as Jerusalem.',
    links: [{ label: 'David', href: '/figures/david' }, { label: 'Solomon', href: '/figures/solomon' }, { label: 'Temple and Jerusalem', href: '/concepts/temple-jerusalem' }],
  },
  {
    id: 'nazareth', name: 'Nazareth', lat: 32.7, lon: 35.3, dx: 12, dy: -14,
    story: 'The Gospel of Luke (chapters 1–2) places Mary in Nazareth. The Quran tells her story in a chapter named for her, Maryam (chapter 19).',
    links: [{ label: 'Mary', href: '/figures/mary' }, { label: 'Jesus, Isa', href: '/figures/jesus' }],
  },
  {
    id: 'babylon', name: 'Babylon', lat: 32.54, lon: 44.42, dy: -12,
    story: 'After Jerusalem fell, many Judeans were taken to Babylon (2 Kings 25). The book of Ezra tells of a later return.',
    links: [{ label: 'Ezra', href: '/figures/ezra' }],
  },
  {
    id: 'mecca', name: 'Mecca', lat: 21.42, lon: 39.83, dx: -12, dy: 16,
    story: 'According to Islamic tradition, Muhammad was born in Mecca and received the first revelations nearby. The Quran (2:127) speaks of Ibrahim and Ishmael raising the foundations of the Kaaba.',
    links: [{ label: 'Muhammad', href: '/figures/muhammad' }, { label: 'Ishmael, Ismail', href: '/figures/ishmael' }],
  },
  {
    id: 'medina', name: 'Medina', lat: 24.47, lon: 39.61, dx: -12, dy: -10,
    story: 'In 622 Muhammad and his followers moved from Mecca to Medina, an event Muslims call the Hijra and the start of the Islamic calendar.',
    links: [{ label: 'Muhammad', href: '/figures/muhammad' }],
  },
]
