import { z } from 'zod'

export const correctionStatuses = ['NEW', 'IN_REVIEW', 'RESOLVED', 'DISMISSED'] as const
export const correctionCategories = ['SOURCE', 'INTERPRETATION', 'LABEL', 'OTHER'] as const
export const correctionStatusLabels = { NEW: 'New', IN_REVIEW: 'In review', RESOLVED: 'Resolved', DISMISSED: 'Dismissed' }
export function validCorrectionPath(path: string): boolean {
  if (!path.startsWith('/') || path.startsWith('//') || /[\\\r\n]/.test(path)) return false
  const url = new URL(path, 'https://context.invalid')
  if (url.hash) return false
  if (/^\/comparisons\/[1-9]\d*$/.test(url.pathname)) return !url.search
  if (!/^\/sources\/[a-z0-9-]+\/read$/.test(url.pathname)) return false
  if ([...url.searchParams.keys()].some((key) => key !== 'book' && key !== 'chapter')) return false
  const book = url.searchParams.get('book')
  const chapter = url.searchParams.get('chapter')
  return (!book && !chapter) || (!!book && book.length <= 200 && !!chapter && /^[1-9]\d{0,3}$/.test(chapter))
}
export const correctionSchema = z.object({
  pagePath: z.string().max(2000).refine(validCorrectionPath, 'Choose a comparison or source reader page.'),
  reference: z.string().trim().max(300).optional(),
  category: z.enum(correctionCategories),
  description: z.string().trim().min(20).max(3000),
  website: z.string().max(200).optional().default(''),
})
export const correctionUpdateSchema = z.object({ status: z.enum(correctionStatuses) })
