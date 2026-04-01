import type { SourceKey, Tradition, ComparisonTag } from '@prisma/client'

export const TRADITION_COLORS: Record<Tradition, string> = {
  JEWISH: '#2563eb',    // blue-600
  CHRISTIAN: '#dc2626', // red-600
  ISLAMIC: '#16a34a',   // green-600
  SHARED: '#7c3aed',    // violet-600
}

export const TRADITION_BG: Record<Tradition, string> = {
  JEWISH: 'bg-blue-100 text-blue-800',
  CHRISTIAN: 'bg-red-100 text-red-800',
  ISLAMIC: 'bg-green-100 text-green-800',
  SHARED: 'bg-violet-100 text-violet-800',
}

export const SOURCE_ORDER: SourceKey[] = [
  'TORAH',
  'HEBREW_BIBLE',
  'NEW_TESTAMENT',
  'QURAN',
]

export const SOURCE_TRADITION: Record<SourceKey, Tradition> = {
  TORAH: 'JEWISH',
  HEBREW_BIBLE: 'SHARED',
  NEW_TESTAMENT: 'CHRISTIAN',
  QURAN: 'ISLAMIC',
}

export const COMPARISON_TAG_LABEL: Record<ComparisonTag, string> = {
  SHARED: 'Shared',
  SIMILAR_DIFFERENT: 'Similar / Different',
  CONTRADICTION: 'Contradiction',
}

export const COMPARISON_TAG_STYLE: Record<ComparisonTag, string> = {
  SHARED: 'bg-emerald-100 text-emerald-800',
  SIMILAR_DIFFERENT: 'bg-amber-100 text-amber-800',
  CONTRADICTION: 'bg-rose-100 text-rose-800',
}
