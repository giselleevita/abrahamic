import { createHmac } from 'node:crypto'

/** First hop of x-forwarded-for (set by Vercel), else x-real-ip, else null. */
export function ipFromHeaders(headers: Headers): string | null {
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || headers.get('x-real-ip')?.trim() || null
}

/**
 * Keyed hash of an IP address, for rate limiting only. Plain SHA-256 of an IPv4 address can be
 * reversed by trying all 4 billion addresses; keying it with the server secret means a leaked
 * database does not reveal who reported what.
 */
export function ipHash(ip: string | null, secret = process.env.NEXTAUTH_SECRET ?? ''): string {
  return createHmac('sha256', secret || 'dev-only-unkeyed').update(`ip:${ip ?? 'unknown'}`).digest('hex')
}
