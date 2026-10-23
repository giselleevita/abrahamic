import { expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ComparisonBlock } from '@/components/claims/ComparisonBlock'
import type { ComparisonWithClaims } from '@/types'

it('shows every citation, hides unlicensed excerpts, and identifies the available edition', () => {
  const comparison = { title: 'Abraham', tag: 'SHARED', claims: [{ claim: { id: 1, statement: 'A project explanation.', source: { slug: 'torah', title: 'Torah', tradition: 'JEWISH' }, verses: [
    { isPrimary: true, verse: { id: 1, book: 'Genesis', chapter: 22, verse: 2, translations: [{ name: 'KJV', text: 'Unlicensed quote' }] } },
    { verse: { id: 2, book: 'Genesis', chapter: 17, verse: 1, translations: [] } },
  ] } }, { claim: { id: 2, statement: 'Another explanation.', source: { slug: 'quran', title: 'Quran', tradition: 'ISLAMIC' }, verses: [{ verse: { id: 3, book: 'Al-Ikhlas', chapter: 112, verse: 1, translations: [{ name: 'Arabic', text: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', isDefault: true }] } }] } }] } as unknown as ComparisonWithClaims
  render(<ComparisonBlock comparison={comparison} />)
  expect(screen.queryByText('Unlicensed quote')).not.toBeInTheDocument()
  expect(screen.getByRole('link', { name: /Genesis 22:2/ })).toHaveAttribute('href', '/sources/torah/read?book=Genesis&chapter=22#v-2')
  expect(screen.getByRole('link', { name: /Genesis 17:1/ })).toBeInTheDocument()
  expect(screen.getByText('Scripture excerpt · Arabic')).toBeInTheDocument()
  expect(screen.getByText(/قُلْ/)).toHaveAttribute('dir', 'rtl')
  expect(screen.queryByText('Shared ground')).not.toBeInTheDocument()
})
