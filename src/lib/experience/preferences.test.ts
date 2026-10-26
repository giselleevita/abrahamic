import { describe, expect, it } from 'vitest'
import { activeEdition } from './preferences'

describe('activeEdition', () => {
  it('keeps an explicit edition choice when it is available', () => {
    expect(activeEdition('Reader note (original)', [
      { name: 'Reader note (original)', isDefault: true, coverage: 4 },
      { name: 'World English Bible', isDefault: false, coverage: 4 },
    ])).toBe('Reader note (original)')
  })

  it('prefers permitted scripture over a mislabelled project-note default', () => {
    expect(activeEdition('', [
      { name: 'Reader note (original)', isDefault: true, coverage: 24 },
      { name: 'World English Bible', isDefault: false, coverage: 24 },
    ])).toBe('World English Bible')
  })

  it('chooses the edition that covers the most of the chapter', () => {
    expect(activeEdition('', [
      { name: 'Hebrew (MT)', isDefault: true, coverage: 3 },
      { name: 'World English Bible', isDefault: false, coverage: 24 },
    ])).toBe('World English Bible')
  })

  it('falls back to the existing default when the preferred edition is absent', () => {
    expect(activeEdition('Unavailable edition', [
      { name: 'World English Bible', isDefault: true, coverage: 24 },
    ])).toBe('World English Bible')
  })
})
