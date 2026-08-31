import { describe, expect, it } from 'vitest'
import { claimHash } from './hash'

describe('claimHash', () => {
  it('is deterministic for the same source and statement', () => {
    expect(claimHash(1, 'Abraham is a prophet')).toBe(claimHash(1, 'Abraham is a prophet'))
  })

  it('normalizes whitespace and case before hashing', () => {
    expect(claimHash(1, '  Abraham   is a  Prophet ')).toBe(claimHash(1, 'abraham is a prophet'))
  })

  it('differs across sources for the same statement', () => {
    expect(claimHash(1, 'Abraham is a prophet')).not.toBe(claimHash(2, 'Abraham is a prophet'))
  })

  it('differs for different statements', () => {
    expect(claimHash(1, 'Abraham is a prophet')).not.toBe(claimHash(1, 'Moses is a prophet'))
  })

  it('produces a 64-character hex sha256 digest', () => {
    expect(claimHash(1, 'test')).toMatch(/^[0-9a-f]{64}$/)
  })
})
