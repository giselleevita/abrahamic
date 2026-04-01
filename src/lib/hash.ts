import { createHash } from 'crypto'

export function claimHash(sourceId: number, statement: string): string {
  const normalized = statement.trim().toLowerCase().replace(/\s+/g, ' ')
  return createHash('sha256').update(`${sourceId}::${normalized}`).digest('hex')
}
