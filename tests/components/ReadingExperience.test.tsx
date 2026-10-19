import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SaveButton, SavedList } from '@/components/experience/SavedItems'
import { VerseReader } from '@/components/sources/VerseReader'
import { SAVED_KEY } from '@/lib/experience/saved'
import { READING_KEY } from '@/lib/experience/preferences'

const item = { id: 'comparison:1', kind: 'comparison' as const, href: '/comparisons/1', label: 'Abraham' }
const verses = [{ id: 1, book: 'Genesis', chapter: 1, verse: 1, versification: 'CHRISTIAN', translations: [{ name: 'World English Bible', text: 'In the beginning', isDefault: true, label: 'CLASSIC' }], linksAsA: [], linksAsB: [] }] as unknown as Parameters<typeof VerseReader>[0]['verses']
beforeEach(() => { vi.restoreAllMocks(); localStorage.clear() })

describe('saved collection', () => {
  it('persists an item and synchronizes controls with the list', async () => {
    const user = userEvent.setup()
    render(<><SaveButton item={item} /><SavedList /></>)
    await user.click(screen.getByRole('button', { name: 'Save Abraham' }))
    expect(screen.getByRole('button', { name: 'Unsave Abraham' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('link', { name: 'Abraham' })).toHaveAttribute('href', '/comparisons/1')
    expect(localStorage.getItem(SAVED_KEY)).not.toContain('text')
    await user.click(screen.getByRole('button', { name: 'Remove Abraham' }))
    expect(screen.getByRole('button', { name: 'Save Abraham' })).toHaveAttribute('aria-pressed', 'false')
  })
  it('never reports a failed save as saved', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    render(<SaveButton item={item} />)
    await userEvent.click(screen.getByRole('button', { name: 'Save Abraham' }))
    expect(screen.getByRole('button', { name: 'Save Abraham' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('status')).toHaveTextContent('Could not save')
  })
  it('recovers from corrupt saved storage', () => {
    localStorage.setItem(SAVED_KEY, 'broken')
    render(<SavedList />)
    expect(screen.getByText('Your collection starts here')).toBeInTheDocument()
  })
})

describe('reader controls', () => {
  it('shows the real active edition and persists text size', async () => {
    localStorage.setItem(READING_KEY, JSON.stringify({ version: 1, size: 21, spacious: true, edition: 'Missing' }))
    render(<VerseReader verses={verses} sourceSlug="torah" />)
    expect(screen.getByText(/Edition: World English Bible/)).toBeInTheDocument()
    expect(screen.getByLabelText('Text size')).toHaveValue('21')
    await userEvent.selectOptions(screen.getByLabelText('Text size'), '24')
    expect(JSON.parse(localStorage.getItem(READING_KEY)!).size).toBe(24)
    await userEvent.click(screen.getByRole('button', { name: 'Reset reading preferences' }))
    expect(screen.getByLabelText('Text size')).toHaveValue('18')
  })
  it('keeps an edition chosen from search while adjusting comfort and restores the chapter default on reset', async () => {
    const editions = [{ ...verses[0], translations: [...verses[0].translations, { ...verses[0].translations[0], name: 'Reader note (original)', isDefault: false, text: 'Project explanation' }] }]
    render(<VerseReader verses={editions} sourceSlug="torah" initialEdition="Reader note (original)" />)
    expect(screen.getByRole('button', { name: 'Reader note (original)' })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.selectOptions(screen.getByLabelText('Text size'), '24')
    expect(screen.getByRole('button', { name: 'Reader note (original)' })).toHaveAttribute('aria-pressed', 'true')
    expect(JSON.parse(localStorage.getItem(READING_KEY)!).edition).toBe('Reader note (original)')
    await userEvent.click(screen.getByRole('button', { name: 'Reset reading preferences' }))
    expect(screen.getByRole('button', { name: 'World English Bible' })).toHaveAttribute('aria-pressed', 'true')
  })
  it('allows reading adjustments for the visit when persistence is blocked', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    render(<VerseReader verses={verses} />)
    await userEvent.selectOptions(screen.getByLabelText('Text size'), '24')
    expect(screen.getByLabelText('Text size')).toHaveValue('24')
    expect(screen.getByText(/Preferences apply for this visit/)).toBeInTheDocument()
  })
})
