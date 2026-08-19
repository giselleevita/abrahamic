import { z } from 'zod'

export const ageBandSchema = z.enum(['AGE_6_8', 'AGE_9_12'])

/** Draft a story from a set of published claims. */
export const generateKidsStorySchema = z.object({
  ageBand: ageBandSchema,
  claimIds: z.array(z.number().int().positive()).min(1).max(6),
  figureIds: z.array(z.number().int().positive()).optional(),
})

/**
 * Review a drafted story. Approval and publication are separate actions: an
 * approving reviewer is judging the text, not deciding release. `isPublished`
 * is therefore its own field, and the database rejects publishing anything not
 * already APPROVED.
 */
export const reviewKidsStorySchema = z
  .object({
    status: z.enum(['APPROVED', 'REJECTED']).optional(),
    reviewNotes: z.string().max(2000).optional(),
    isPublished: z.boolean().optional(),
  })
  .refine((d) => d.status !== undefined || d.isPublished !== undefined, {
    message: 'Provide a status change, a publish change, or both',
  })

export type GenerateKidsStoryInput = z.infer<typeof generateKidsStorySchema>
export type ReviewKidsStoryInput = z.infer<typeof reviewKidsStorySchema>
