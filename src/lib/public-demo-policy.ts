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
 * Translations permitted on a public deployment.
 *
 * This is an explicit allowlist, not a blocklist: an unknown translation name
 * is denied. That is the correct default when the failure mode is publishing
 * someone else's copyrighted text.
 *
 * The World English Bible is admitted because it is explicitly dedicated to the
 * public domain by its publisher — the one modern English translation whose
 * status is not in question. Imported rows carry `licenseCode`, `sourceUrl` and
 * `attribution`, so the provenance of every line is recorded.
 *
 * Next step for this list: permit by `licenseCode` rather than by name, so
 * adding a translation is a data decision rather than a code change. That needs
 * the guard to see the licence column, which it currently does not.
 */
export const PUBLIC_DEMO_TRANSLATION_NAMES = new Set([
  'Hebrew (MT)',
  'Arabic',
  'Reader note (original)',
  'World English Bible',
])

export type DemoTranslation = {
  label: 'ORIGINAL' | 'CLASSIC' | 'MODERN'
  name: string
  text: string
  isDefault?: boolean
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
const DEFAULT_PRIORITY = ['Hebrew (MT)', 'Arabic', 'Reader note (original)'] as const

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
  }))
}

export function isPublicDemoTranslation(name: string): boolean {
  return PUBLIC_DEMO_TRANSLATION_NAMES.has(name)
}

export function filterPublicDemoTranslations<T extends { name: string }>(translations: T[]): T[] {
  return translations.filter((t) => isPublicDemoTranslation(t.name))
}
