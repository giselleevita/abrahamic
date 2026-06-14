import { filterPublicDemoTranslations } from '@/lib/public-demo-policy'

type TranslationRow = { name: string }

export function filterVerseTranslations<T extends TranslationRow>(translations: T[]): T[] {
  return filterPublicDemoTranslations(translations)
}

export function filterVersesWithTranslations<
  T extends { translations: TranslationRow[] },
>(verses: T[]): T[] {
  return verses.map((verse) => ({
    ...verse,
    translations: filterVerseTranslations(verse.translations),
  }))
}
