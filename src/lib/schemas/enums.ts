/**
 * Zod mirrors of the Prisma enums, for validating query/body params.
 *
 * These replace inline `as` casts in route handlers, which silently accepted
 * any string and — in the case of `sourceKey` — omitted `SIRAH_IBN_HISHAM` and
 * `HADITH_TRADITION`, making the two newest sources unfilterable.
 */
import { z } from 'zod'

export const sourceKeySchema = z.enum([
  'TORAH',
  'HEBREW_BIBLE',
  'NEW_TESTAMENT',
  'QURAN',
  'SIRAH_IBN_HISHAM',
  'HADITH_TRADITION',
])

export const traditionSchema = z.enum(['JEWISH', 'CHRISTIAN', 'ISLAMIC', 'SHARED'])

export const comparisonTagSchema = z.enum(['SHARED', 'SIMILAR_DIFFERENT', 'CONTRADICTION'])

export const candidateStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED'])

export type SourceKeyInput = z.infer<typeof sourceKeySchema>
export type TraditionInput = z.infer<typeof traditionSchema>
export type ComparisonTagInput = z.infer<typeof comparisonTagSchema>
