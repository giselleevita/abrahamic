import { z } from 'zod'
import { reviewTraditionSchema } from '@/lib/editorial/signoff-api'

export const REPORT_MAX_PER_DAY = 5
export const REPORT_GLOBAL_MAX_PER_HOUR = 200
export const PROPOSAL_MAX_PER_DAY = 5
export const PROPOSAL_MAX_OPEN = 20

export const reportSchema = z.object({
  kind: z.enum(['CORRECTION', 'UNFAIR_TO_TRADITION', 'SOURCE_ERROR', 'OTHER']),
  claimId: z.number().int().positive().optional(),
  pagePath: z.string().trim().max(300).regex(/^\//, 'Must be a path on this site').optional(),
  message: z.string().trim().min(20, 'Please say what is wrong (at least 20 characters)').max(3000),
  contactEmail: z.string().trim().email().max(254).optional().or(z.literal('').transform(() => undefined)),
  /** Honeypot: hidden from people, filled in by bots. Any value means "pretend it worked". */
  website: z.string().optional(),
})

export const proposalSchema = z.object({
  sourceId: z.number().int().positive(),
  statement: z.string().trim().min(20, 'Write a full sentence (at least 20 characters)').max(1000),
  /** One citation per entry, e.g. "Genesis 12:1-3". At least one is required: no claim without a source. */
  references: z.array(z.string().trim().min(3).max(60)).min(1, 'Cite at least one passage').max(5),
  notes: z.string().trim().max(2000).optional(),
  extraTraditions: z.array(reviewTraditionSchema).max(3).optional(),
})
