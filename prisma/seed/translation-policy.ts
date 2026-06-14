/**
 * Public-demo translation policy.
 *
 * Production deployments should only seed and display translations listed here.
 * Editorial claims, figures, themes, and metadata are original summaries.
 */

export const COPYRIGHTED_TRANSLATION_NAMES = [
  'JPS 1985',
  'ESV',
  'Yusuf Ali',
  'Sahih International',
] as const

/** Translations treated as public-domain / safe for the public engineering demo (US-focused). */
export const PUBLIC_DEMO_TRANSLATION_NAMES = new Set([
  'Hebrew (MT)',
  'Arabic',
  'JPS 1917',
  'KJV',
])

export type SeedTranslation = {
  label: 'ORIGINAL' | 'CLASSIC' | 'MODERN'
  name: string
  text: string
  isDefault?: boolean
}

const DEFAULT_PRIORITY = ['JPS 1917', 'KJV', 'Hebrew (MT)', 'Arabic'] as const

export function publicDemoTranslations(translations: SeedTranslation[]): SeedTranslation[] {
  const filtered = translations.filter((t) => PUBLIC_DEMO_TRANSLATION_NAMES.has(t.name))
  if (filtered.length === 0) return []

  const preferred =
    DEFAULT_PRIORITY.find((name) => filtered.some((t) => t.name === name)) ?? filtered[0].name

  return filtered.map((t) => ({
    ...t,
    isDefault: t.name === preferred,
  }))
}
