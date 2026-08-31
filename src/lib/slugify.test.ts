import { describe, expect, it } from 'vitest'
import { slugify } from './slugify'

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Abraham and Isaac')).toBe('abraham-and-isaac')
  })

  it('strips curly and straight apostrophes without inserting a hyphen', () => {
    expect(slugify("Ishmael's Covenant")).toBe('ishmaels-covenant')
    expect(slugify('Ishmael’s Covenant')).toBe('ishmaels-covenant')
  })

  it('collapses non-alphanumeric runs into a single hyphen', () => {
    expect(slugify('Jacob & Esau -- Rivalry!!')).toBe('jacob-esau-rivalry')
  })

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  --Moses--  ')).toBe('moses')
  })
})
