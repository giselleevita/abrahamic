import { expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PerspectiveExplorer, type PerspectiveTopic } from '@/components/discovery/PerspectiveExplorer'
import { JourneyDiscovery } from '@/components/discovery/JourneyDiscovery'

const topics: PerspectiveTopic[] = [
  { id: 1, title: 'A shared figure', perspectives: [
    { id: 1, tradition: 'JEWISH', statement: 'The first published Jewish explanation.', sourceTitle: 'Torah', sourceSlug: 'torah', citations: [{ book: 'Genesis', chapter: 22, verse: 2 }] },
    { id: 2, tradition: 'ISLAMIC', statement: 'The published Islamic explanation.', sourceTitle: 'Quran', sourceSlug: 'quran', citations: [{ book: 'Al-Baqarah', chapter: 2, verse: 124 }] },
  ] },
  { id: 2, title: 'A different question', perspectives: [{ id: 3, tradition: 'CHRISTIAN', statement: 'The other published explanation.', sourceTitle: 'New Testament', sourceSlug: 'new-testament', citations: [] }] },
]

it('switches traditions using the keyboard and keeps citations attached to the selected view', async () => {
  const user = userEvent.setup()
  render(<PerspectiveExplorer topics={topics} />)
  await user.click(screen.getByRole('tab', { name: 'Judaism' }))
  await user.keyboard('{ArrowRight}')
  expect(screen.getByRole('tab', { name: 'Islam' })).toHaveFocus()
  expect(screen.getByText('The published Islamic explanation.')).toBeVisible()
  expect(screen.queryByText('The first published Jewish explanation.')).not.toBeInTheDocument()
  expect(screen.getByRole('link', { name: /Al-Baqarah 2:124/ })).toHaveAttribute('href', '/sources/quran/read?book=Al-Baqarah&chapter=2#v-124')
})

it('selects a new topic without showing a tradition absent from its published data', async () => {
  render(<PerspectiveExplorer topics={topics} />)
  await userEvent.click(screen.getByRole('button', { name: /A different question/ }))
  expect(screen.getByRole('tab', { name: 'Christianity' })).toHaveAttribute('aria-selected', 'true')
  expect(screen.queryByRole('tab', { name: 'Judaism' })).not.toBeInTheDocument()
  expect(screen.getByText('The other published explanation.')).toBeVisible()
  expect(screen.getByRole('link', { name: 'Open the complete comparison' })).toHaveAttribute('href', '/comparisons/2')
})

it('previews journey chapters and links to the selected real chapter', async () => {
  vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
  render(<JourneyDiscovery courseSlug="abraham" steps={[
    { slug: 'first', title: 'First chapter', summary: 'First summary', learningObjective: null, estimatedMinutes: 2 },
    { slug: 'next', title: 'Next chapter', summary: 'Next summary', learningObjective: 'A sourced learning objective.', estimatedMinutes: 3 },
  ]} />)
  await userEvent.click(screen.getByRole('button', { name: /Next chapter/ }))
  expect(screen.getByText('A sourced learning objective.')).toBeVisible()
  expect(screen.getByRole('link', { name: 'Explore this step' })).toHaveAttribute('href', '/learn/abraham/next')
  vi.restoreAllMocks()
})

it('lets readers focus a comparison and return to all traditions', async () => {
  const { ComparisonLens } = await import('@/components/claims/ComparisonLens')
  render(<ComparisonLens views={[
    { id: 1, tradition: 'JEWISH', content: <p>Jewish perspective</p> },
    { id: 2, tradition: 'ISLAMIC', content: <p>Islamic perspective</p> },
  ]} />)
  await userEvent.click(screen.getByRole('button', { name: /^Islam$/ }))
  expect(screen.getByText('Islamic perspective')).toBeVisible()
  expect(screen.queryByText('Jewish perspective')).not.toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'All perspectives' }))
  expect(screen.getByText('Jewish perspective')).toBeVisible()
})
