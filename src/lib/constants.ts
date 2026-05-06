import type { SourceKey, Tradition, ComparisonTag, TraditionPresence } from '@prisma/client'

export const TRADITION_COLORS: Record<Tradition, string> = {
  JEWISH: '#0f4c7f',    // sapphire blue
  CHRISTIAN: '#7c2d3e', // deep garnet
  ISLAMIC: '#3d2a5c',   // deep amethyst
  SHARED: '#d4a574',    // warm gold
}

export const TRADITION_BG: Record<Tradition, string> = {
  JEWISH: 'bg-jewish-600 text-jewish-50',
  CHRISTIAN: 'bg-christian-600 text-christian-50',
  ISLAMIC: 'bg-islamic-600 text-islamic-50',
  SHARED: 'bg-gold-600 text-primary-950',
}

export const SOURCE_ORDER: SourceKey[] = [
  'TORAH',
  'HEBREW_BIBLE',
  'NEW_TESTAMENT',
  'QURAN',
  'SIRAH_IBN_HISHAM',
  'HADITH_TRADITION',
]

export const SOURCE_TRADITION: Record<SourceKey, Tradition> = {
  TORAH: 'JEWISH',
  HEBREW_BIBLE: 'SHARED',
  NEW_TESTAMENT: 'CHRISTIAN',
  QURAN: 'ISLAMIC',
  SIRAH_IBN_HISHAM: 'ISLAMIC',
  HADITH_TRADITION: 'ISLAMIC',
}

export const COMPARISON_TAG_LABEL: Record<ComparisonTag, string> = {
  SHARED: 'Shared',
  SIMILAR_DIFFERENT: 'Similar / Different',
  CONTRADICTION: 'Contradiction',
}

export const COMPARISON_TAG_STYLE: Record<ComparisonTag, string> = {
  SHARED: 'bg-gold-700 text-primary-50',
  SIMILAR_DIFFERENT: 'bg-primary-700 text-gold-100',
  CONTRADICTION: 'bg-christian-600 text-christian-50',
}

export const TRADITION_PRESENCE_LABEL: Record<TraditionPresence, string> = {
  AFFIRMED: 'Affirmed',
  MODIFIED: 'Modified',
  SILENT: 'Silent',
  REJECTED: 'Rejected',
}

export const TRADITION_PRESENCE_STYLE: Record<TraditionPresence, string> = {
  AFFIRMED: 'bg-jewish-600 text-jewish-50',
  MODIFIED: 'bg-gold-700 text-primary-50',
  SILENT: 'bg-primary-700 text-primary-400',
  REJECTED: 'bg-christian-600 text-christian-50',
}

export const TRADITION_PRESENCE_ICON: Record<TraditionPresence, string> = {
  AFFIRMED: '✓',
  MODIFIED: '⚠',
  SILENT: '∅',
  REJECTED: '✕',
}
