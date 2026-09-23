import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs } from '@/components/ui/Tabs'

const TABS = [
  { label: 'Jewish', content: <p>Torah content</p> },
  { label: 'Christian', content: <p>Gospel content</p> },
  { label: 'Islamic', content: <p>Quran content</p> },
]

function setup() {
  return {
    user: userEvent.setup(),
    ...render(<Tabs tabs={TABS} label="Tradition views" />),
  }
}

describe('Tabs', () => {
  it('exposes the ARIA tabs pattern', () => {
    setup()
    expect(screen.getByRole('tablist', { name: 'Tradition views' })).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(screen.getByRole('tab', { name: 'Jewish' })).toHaveAttribute('aria-selected', 'true')
  })

  it('links each tab to its panel', () => {
    setup()
    const tab = screen.getByRole('tab', { name: 'Jewish' })
    const panel = screen.getByRole('tabpanel')
    expect(tab.getAttribute('aria-controls')).toBe(panel.id)
    expect(panel.getAttribute('aria-labelledby')).toBe(tab.id)
  })

  it('keeps only the active tab in the tab order (roving tabindex)', () => {
    setup()
    expect(screen.getByRole('tab', { name: 'Jewish' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: 'Christian' })).toHaveAttribute('tabindex', '-1')
  })

  it('moves between tabs with arrow keys', async () => {
    const { user } = setup()
    await user.tab()
    expect(screen.getByRole('tab', { name: 'Jewish' })).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Christian' })).toHaveFocus()
    expect(screen.getByText('Gospel content')).toBeInTheDocument()
    expect(screen.queryByText('Torah content')).not.toBeInTheDocument()
  })

  it('wraps around at both ends', async () => {
    const { user } = setup()
    await user.tab()
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('tab', { name: 'Islamic' })).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Jewish' })).toHaveFocus()
  })

  it('jumps to first and last with Home and End', async () => {
    const { user } = setup()
    await user.tab()
    await user.keyboard('{End}')
    expect(screen.getByRole('tab', { name: 'Islamic' })).toHaveFocus()

    await user.keyboard('{Home}')
    expect(screen.getByRole('tab', { name: 'Jewish' })).toHaveFocus()
  })

  it('switches panels on click', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('tab', { name: 'Islamic' }))
    expect(screen.getByText('Quran content')).toBeInTheDocument()
  })
})
