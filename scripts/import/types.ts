/**
 * Shared shapes for the ingestion pipeline.
 *
 * A source adapter's only job is to yield verses; everything about batching,
 * idempotency, provenance and statistics lives in the runner. Adding a new
 * translation should mean writing a `fetch` function, not another script.
 */
import type { SourceKey, TranslationLabel } from '../../src/generated/prisma/client'

export interface ImportedVerse {
  book: string
  /** Canonical ordering within the source, 1-based. */
  bookNumber: number
  chapter: number
  verse: number
  text: string
}

export interface TranslationSpec {
  /** Display name; also the key the public-demo policy matches on. */
  name: string
  label: TranslationLabel
  sourceKey: SourceKey
  /** Short licence code, e.g. "PD". Recorded on every row. */
  licenseCode: string
  sourceUrl: string
  /** Credit line, where the licence requires one. */
  attribution: string
}

export interface ImportAdapter {
  spec: TranslationSpec
  /** Yield verses in batches so a large import never holds the whole corpus. */
  fetchVerses(options: { limitBooks?: number }): AsyncGenerator<ImportedVerse[]>
}

export interface ImportStats {
  fetched: number
  versesCreated: number
  translationsCreated: number
  translationsUpdated: number
  skipped: number
  errors: string[]
}
