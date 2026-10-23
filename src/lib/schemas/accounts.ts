import { z } from 'zod'

/** A reviewer speaks for one real tradition; SHARED is not a community anyone belongs to. */
export const reviewerTraditionSchema = z.enum(['JEWISH', 'CHRISTIAN', 'ISLAMIC'])

export const reviewerApplicationSchema = z.object({
  tradition: reviewerTraditionSchema,
  affiliation: z.string().trim().min(3).max(200),
  statement: z.string().trim().min(20).max(2000),
})

/** ADMIN is intentionally absent: administrators exist only as environment credentials. */
export const userUpdateSchema = z
  .object({
    role: z.enum(['CONTRIBUTOR', 'EDITOR']).optional(),
    status: z.enum(['ACTIVE', 'SUSPENDED']).optional(),
  })
  .refine((value) => value.role !== undefined || value.status !== undefined, {
    message: 'Provide a role or a status',
  })

export const reviewerDecisionSchema = z.object({
  status: z.enum(['APPROVED', 'REVOKED']),
})
