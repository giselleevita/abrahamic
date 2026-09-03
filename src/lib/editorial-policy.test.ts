import { describe, expect, it } from 'vitest'
import { canDelete, canEdit, canTransition, roleFromSession } from './editorial-policy'

describe('editorial authorization policy', () => {
  it('keeps viewers read-only', () => {
    expect(canEdit('VIEWER', 'DRAFT')).toBe(false)
    expect(canTransition('VIEWER', 'DRAFT', 'IN_REVIEW')).toBe(false)
    expect(canDelete('VIEWER')).toBe(false)
  })

  it('lets editors draft and request review but not publish', () => {
    expect(canEdit('EDITOR', 'DRAFT')).toBe(true)
    expect(canTransition('EDITOR', 'DRAFT', 'IN_REVIEW')).toBe(true)
    expect(canTransition('EDITOR', 'IN_REVIEW', 'PUBLISHED')).toBe(false)
    expect(canEdit('EDITOR', 'PUBLISHED')).toBe(false)
  })

  it('reserves publication, archival, and deletion for administrators', () => {
    expect(canTransition('ADMIN', 'IN_REVIEW', 'PUBLISHED')).toBe(true)
    expect(canTransition('ADMIN', 'PUBLISHED', 'ARCHIVED')).toBe(true)
    expect(canDelete('ADMIN')).toBe(true)
  })

  it('fails unknown and missing session roles closed as viewer', () => {
    expect(roleFromSession(null)).toBe('VIEWER')
    expect(roleFromSession({ user: { role: 'OWNER' } })).toBe('VIEWER')
  })
})
