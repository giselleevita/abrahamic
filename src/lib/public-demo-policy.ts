/**
 * Public-demo content policy — no publisher licenses required.
 *
 * - Original-language scripture text (Hebrew, Arabic) is shown as source text.
 * - English uses only original "reader notes" written for this demo.
 * - Editorial claims, figures, themes, and comparisons are project-authored summaries.
 */

export const REMOVED_TRANSLATION_NAMES = [
  'JPS 1985',
  'ESV',
  'Yusuf Ali',
  'Sahih International',
  'JPS 1917',
  'KJV',
] as const

/**
 * Licences whose text may be shown on a public deployment.
 *
 * This is the primary mechanism. Importing a new translation is a data
 * decision — set a permitted `licenseCode` on the rows — rather than a code
 * change, which is what the name allowlist below required.
 *
 * `PD` is public domain. `PROJECT` is text authored by this project itself,
 * such as the reader notes. Anything else is denied.
 */
export const PERMITTED_LICENSE_CODES = new Set(['PD', 'PROJECT'])

/**
 * Translations permitted by name.
 *
 * Retained as a fallback for rows that carry no licence, and for queries that
 * do not select the licence column. An unknown name is denied — an allowlist,
 * not a blocklist, because the failure mode is publishing someone else's
 * copyrighted text.
 */
export const PUBLIC_DEMO_TRANSLATION_NAMES = new Set([
  'Hebrew (MT)',
  'Arabic',
  'Reader note (original)',
  'World English Bible',
])

/** A row as the guard sees it. `licenseCode` is absent unless selected. */
export type TranslationPermissionInput = {
  name: string
  licenseCode?: string | null
}

/**
 * Whether a translation row may be shown publicly.
 *
 * Order matters. An explicitly removed name is denied whatever its licence
 * claims, because a mislabelled row must not be able to talk its way past the
 * policy. Otherwise a permitted licence admits the row; failing that, the name
 * allowlist does.
 *
 * Note the asymmetry when `licenseCode` is not selected by a query: the row
 * falls back to name matching. That is deliberately the safe direction — it can
 * only ever deny something the licence would have allowed, never the reverse.
 * Queries that need licence-based permission must select the column;
 * `PUBLIC_TRANSLATION_FIELDS` exists for that.
 */
export function isPermittedTranslation(row: TranslationPermissionInput): boolean {
  if ((REMOVED_TRANSLATION_NAMES as readonly string[]).includes(row.name)) return false
  if (row.licenseCode && PERMITTED_LICENSE_CODES.has(row.licenseCode)) return true
  return PUBLIC_DEMO_TRANSLATION_NAMES.has(row.name)
}

/** Select these wherever licence-based permission should apply. */
export const PUBLIC_TRANSLATION_FIELDS = {
  name: true,
  text: true,
  label: true,
  isDefault: true,
  licenseCode: true,
  attribution: true,
} as const

export type DemoTranslation = {
  label: 'ORIGINAL' | 'CLASSIC' | 'MODERN'
  name: string
  text: string
  isDefault?: boolean
  /** Set by the policy so every seeded row carries provenance, like imports do. */
  licenseCode?: string
}

/**
 * Licence for each translation the policy itself produces.
 *
 * The Masoretic Hebrew and the Quranic Arabic are public-domain source texts;
 * the reader notes are written by this project. Recording these means seeded
 * rows and imported rows are governed by the same licence check rather than
 * seeded rows relying on a name allowlist.
 */
const SEED_LICENSES: Record<string, string> = {
  'Hebrew (MT)': 'PD',
  'Arabic': 'PD',
  'Reader note (original)': 'PROJECT',
}

/**
 * Original-language text wins over the reader note.
 *
 * The order used to be the other way round, so the reader note — which is
 * boilerplate *about* the demo, not scripture — was the default on every verse
 * that had one, i.e. all of them. 56 Hebrew and Arabic translations existed and
 * none was ever displayed, while the README claimed original-language text was
 * shown. The note is a fallback for verses with no original text, not a
 * replacement for it.
 */
export const DEFAULT_PRIORITY = [
  // Original-language source text first, per the platform's stated policy.
  'Hebrew (MT)',
  'Arabic',
  // Then real English. The reader note ranks below this: it is boilerplate
  // *about* the demo, and showing it in preference to actual scripture was a
  // bug once already.
  'World English Bible',
  'Reader note (original)',
] as const

export function readerNoteForVerse(input: {
  sourceKey: string
  book: string
  chapter: number
  verse: number
}): string {
  const ref = `${input.book} ${input.chapter}:${input.verse}`
  const tradition =
    input.sourceKey === 'QURAN'
      ? 'Islamic'
      : input.sourceKey === 'NEW_TESTAMENT'
        ? 'Christian'
        : 'Jewish'

  return (
    `Original reader note (${tradition}, ${ref}): this entry supports citations, comparisons, and search ` +
    `in the Abrahamic Texts engineering demo. It is not a published scripture translation and does not ` +
    `quote any licensed English translation. Use the original-language text where available.`
  )
}

export function buildPublicDemoTranslations(
  verse: {
    sourceKey: string
    book: string
    chapter: number
    verse: number
  },
  seedTranslations: DemoTranslation[],
): DemoTranslation[] {
  const originals = seedTranslations.filter(
    (t) => t.name === 'Hebrew (MT)' || t.name === 'Arabic',
  )

  const readerNote: DemoTranslation = {
    label: 'MODERN',
    name: 'Reader note (original)',
    text: readerNoteForVerse(verse),
  }

  const combined = [...originals, readerNote]
  const preferred =
    DEFAULT_PRIORITY.find((name) => combined.some((t) => t.name === name)) ?? readerNote.name

  return combined.map((t) => ({
    ...t,
    isDefault: t.name === preferred,
    licenseCode: t.licenseCode ?? SEED_LICENSES[t.name],
  }))
}

/**
 * Name-only permission check.
 *
 * Kept for callers that genuinely have nothing but a name. Prefer
 * `isPermittedTranslation`, which also honours the licence.
 */
export function isPublicDemoTranslation(name: string): boolean {
  return isPermittedTranslation({ name })
}

/**
 * Filter a list of translation rows to those permitted publicly.
 *
 * Uses the licence when the row carries one, and the name otherwise, so the
 * same helper serves both fully-selected rows and name-only ones.
 */
export function filterPublicDemoTranslations<
  T extends { name: string; licenseCode?: string | null },
>(translations: T[]): T[] {
  return translations.filter((t) => isPermittedTranslation(t))
}
