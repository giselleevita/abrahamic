export const SEARCH_TRADITIONS = { JEWISH: 'Jewish', CHRISTIAN: 'Christian', ISLAMIC: 'Islamic', SHARED: 'Shared' } as const
export const SEARCH_SOURCES = { TORAH: 'Torah', HEBREW_BIBLE: 'Hebrew Bible', NEW_TESTAMENT: 'New Testament', QURAN: 'Quran', SIRAH_IBN_HISHAM: 'Sirah', HADITH_TRADITION: 'Hadith' } as const
export const SEARCH_TYPES = { verses: 'Verses', claims: 'Teachings & interpretations', figures: 'Figures', themes: 'Themes', concepts: 'Concepts', timelineEvents: 'Timeline' } as const
export type SearchOptions = { tradition?: keyof typeof SEARCH_TRADITIONS; source?: keyof typeof SEARCH_SOURCES; type?: keyof typeof SEARCH_TYPES }
export function searchOptions(params: Record<string, unknown>): SearchOptions {
  return {
    ...(typeof params.tradition === 'string' && Object.hasOwn(SEARCH_TRADITIONS, params.tradition) ? { tradition: params.tradition as SearchOptions['tradition'] } : {}),
    ...(typeof params.source === 'string' && Object.hasOwn(SEARCH_SOURCES, params.source) ? { source: params.source as SearchOptions['source'] } : {}),
    ...(typeof params.type === 'string' && Object.hasOwn(SEARCH_TYPES, params.type) ? { type: params.type as SearchOptions['type'] } : {}),
  }
}
