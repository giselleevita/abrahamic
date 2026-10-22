/**
 * API-side helpers for the sign-off gate: turn the database trigger's error into a
 * friendly 409 so a race (or a bug in the pre-check) is never reported as a 500.
 */
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { TRADITION_LABEL, type ReviewTradition } from '@/lib/editorial/signoff'

export const reviewTraditionSchema = z.enum(['JEWISH', 'CHRISTIAN', 'ISLAMIC'])

export function signoffErrorMessage(error: unknown): string | null {
  const message = error instanceof Error ? error.message : String(error)
  const match = message.match(/signoff: ([^\n]*)/)
  return match ? match[1].trim() : null
}

/** Returns a 409 response if `error` came from a sign-off trigger, otherwise null. */
export function signoffConflict(error: unknown): NextResponse | null {
  const reason = signoffErrorMessage(error)
  return reason ? NextResponse.json({ error: `Cannot publish: ${reason}` }, { status: 409 }) : null
}

export function missingMessage(missing: readonly ReviewTradition[], blockedByConcern: boolean): string {
  const parts: string[] = []
  if (missing.length > 0) parts.push(`missing sign-off for ${missing.map((t) => TRADITION_LABEL[t]).join(', ')}`)
  if (blockedByConcern) parts.push('a reviewer has requested changes or objected (resolve it, or an administrator may publish it as contested)')
  if (parts.length === 0) parts.push('this claim has no required traditions')
  return `Cannot publish: ${parts.join('; ')}`
}
