import { z } from 'zod'
import { traditionSchema } from '@/lib/schemas/enums'

/**
 * A YouTube video id is exactly 11 characters from an unreserved alphabet.
 *
 * This is security-critical, not cosmetic: the embed URL is built by string
 * interpolation, so an unvalidated id is an iframe-src injection. Validate
 * here and again at render time — a row could predate this constraint.
 */
export const youtubeIdSchema = z
  .string()
  .regex(/^[A-Za-z0-9_-]{11}$/, 'Not a valid YouTube video id')

/**
 * Editors paste URLs, not ids. Accept the common YouTube URL shapes and
 * normalise, but fall through to strict id validation either way — no URL
 * shape is trusted to produce a safe id on its own.
 */
export function extractYoutubeId(input: string): string | null {
  const trimmed = input.trim()

  if (youtubeIdSchema.safeParse(trimmed).success) return trimmed

  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([A-Za-z0-9_-]{11})/,
    /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube(?:-nocookie)?\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = trimmed.match(pattern)
    if (match && youtubeIdSchema.safeParse(match[1]).success) return match[1]
  }

  return null
}

const attachments = z.object({
  conceptIds: z.array(z.number().int().positive()).optional(),
  figureIds: z.array(z.number().int().positive()).optional(),
  themeIds: z.array(z.number().int().positive()).optional(),
})

export const createVideoSchema = attachments.extend({
  // Accepts an id or a URL; the route normalises before storing.
  youtubeId: z.string().min(1).max(200),
  title: z.string().min(2).max(300),
  channelName: z.string().min(1).max(200),
  // Long enough that "good video" will not pass: inclusion must be justified.
  editorNote: z.string().min(20).max(2000),
  perspectiveTradition: traditionSchema.optional(),
  durationSeconds: z.number().int().positive().max(86400).optional(),
  isPublished: z.boolean().optional(),
  isKidsSafe: z.boolean().optional(),
})

export const updateVideoSchema = createVideoSchema.partial()

export type CreateVideoInput = z.infer<typeof createVideoSchema>
