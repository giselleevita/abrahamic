import type {
  SourceKey,
  Tradition,
  ComparisonTag,
  TraditionPresence,
  TimelineEra,
  ConceptCategory,
} from '@/generated/prisma/client'

export const ERA_ORDER: TimelineEra[] = [
  'PRIMORDIAL',
  'PATRIARCHAL',
  'EXODUS',
  'KINGDOM',
  'GOSPEL',
  'EARLY_ISLAM',
]

export const ERA_LABEL: Record<TimelineEra, string> = {
  PRIMORDIAL: 'Primordial',
  PATRIARCHAL: 'Patriarchal',
  EXODUS: 'Exodus',
  KINGDOM: 'Kingdom',
  GOSPEL: 'Gospel',
  EARLY_ISLAM: 'Early Islam',
}

export const ERA_GRADIENT: Record<TimelineEra, string> = {
  PRIMORDIAL: 'from-jewish-700 to-jewish-600',
  PATRIARCHAL: 'from-gold-700 to-gold-600',
  EXODUS: 'from-christian-700 to-christian-600',
  KINGDOM: 'from-jewish-700 to-jewish-600',
  GOSPEL: 'from-christian-700 to-christian-600',
  EARLY_ISLAM: 'from-islamic-700 to-islamic-600',
}

/** Gold-on-dark needs dark text; every other era gradient takes white. */
export const ERA_TEXT: Record<TimelineEra, string> = {
  PRIMORDIAL: 'text-white',
  PATRIARCHAL: 'text-primary-950',
  EXODUS: 'text-white',
  KINGDOM: 'text-white',
  GOSPEL: 'text-white',
  EARLY_ISLAM: 'text-white',
}

export const CONCEPT_CATEGORY_LABEL: Record<ConceptCategory, string> = {
  THEOLOGY: 'Theology',
  SOTERIOLOGY: 'Soteriology',
  ESCHATOLOGY: 'Eschatology',
  PROPHETHOOD: 'Prophethood',
  PRACTICE: 'Practice',
  LAW: 'Law & Covenant',
  COSMOLOGY: 'Cosmology',
}

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

/**
 * Tradition accents for surfaces that are not solid badges.
 *
 * These replace the raw blue/red/green literals that had drifted into
 * ClaimCard and VisualTimeline, which broke the tradition palette's meaning:
 * the same tradition rendered sapphire in one component and generic blue in
 * another. Every tradition-coloured surface now derives from one place.
 */
export const TRADITION_ACCENT: Record<Tradition, string> = {
  JEWISH: 'text-jewish-700',
  CHRISTIAN: 'text-christian-700',
  ISLAMIC: 'text-islamic-700',
  SHARED: 'text-gold-700',
}

export const TRADITION_BORDER: Record<Tradition, string> = {
  JEWISH: 'border-jewish-600',
  CHRISTIAN: 'border-christian-600',
  ISLAMIC: 'border-islamic-600',
  SHARED: 'border-gold-600',
}

export const TRADITION_SURFACE: Record<Tradition, string> = {
  JEWISH: 'bg-jewish-50 border-jewish-200',
  CHRISTIAN: 'bg-christian-50 border-christian-200',
  ISLAMIC: 'bg-islamic-50 border-islamic-200',
  SHARED: 'bg-gold-50 border-gold-200',
}

/** Solid fill, for timeline dots and other small marks. */
export const TRADITION_DOT: Record<Tradition, string> = {
  JEWISH: 'bg-jewish-600',
  CHRISTIAN: 'bg-christian-600',
  ISLAMIC: 'bg-islamic-600',
  SHARED: 'bg-gold-600',
}

export const TRADITION_LABEL: Record<Tradition, string> = {
  JEWISH: 'Judaism',
  CHRISTIAN: 'Christianity',
  ISLAMIC: 'Islam',
  SHARED: 'Shared',
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
