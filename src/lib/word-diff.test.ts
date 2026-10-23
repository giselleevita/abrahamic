import { describe, expect, it } from 'vitest'
import { diffWords } from './word-diff'

describe('diffWords', () => {
  it('marks shared words in order and the rest as unshared, ignoring case and punctuation', () => {
    const { a, b } = diffWords('God called Abraham, and he went.', 'God called Ibrahim and he submitted')
    expect(a.filter((w) => !w.shared).map((w) => w.text)).toEqual(['Abraham,', 'went.'])
    expect(b.filter((w) => !w.shared).map((w) => w.text)).toEqual(['Ibrahim', 'submitted'])
    expect(a.find((w) => w.text === 'God')!.shared).toBe(true)
  })

  it('treats identical text as fully shared and disjoint text as fully unshared', () => {
    expect(diffWords('one two', 'one two').a.every((w) => w.shared)).toBe(true)
    expect(diffWords('one two', 'three four').b.every((w) => !w.shared)).toBe(true)
  })

  it('handles empty input', () => {
    expect(diffWords('', 'word')).toEqual({ a: [], b: [{ text: 'word', shared: false }] })
  })

  it('does not match a word out of order', () => {
    const { b } = diffWords('red green', 'green red')
    expect(b.filter((w) => w.shared)).toHaveLength(1)
  })
})
