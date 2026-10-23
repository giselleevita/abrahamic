import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SignoffBadge } from '@/components/claims/SignoffBadge'

const show = (summary: unknown, required = ['JEWISH'], revision = 1) =>
  render(<SignoffBadge requiredTraditions={required} signoffSummary={summary} revision={revision} />)

describe('SignoffBadge honesty', () => {
  it('shows nothing for a claim that requires no tradition', () => {
    const { container } = show(null, [])
    expect(container).toBeEmptyDOMElement()
  })

  it('says awaiting review when there is no sign-off yet (legacy content)', () => {
    show(null)
    expect(screen.getByTestId('signoff-badge')).toHaveTextContent(/awaiting review/i)
    expect(screen.queryByText(/reviewed by/i)).toBeNull()
  })

  it('credits a tradition only when a member of it reviewed', () => {
    show({ revision: 1, states: { JEWISH: 'MEMBER' } })
    expect(screen.getByText('Reviewed by a Judaism reviewer')).toBeInTheDocument()
  })

  it('never presents a project-editor check as a tradition review', () => {
    show({ revision: 1, states: { JEWISH: 'EDITOR' } })
    expect(screen.queryByText(/Reviewed by a Judaism reviewer/)).toBeNull()
    expect(screen.getByText(/Checked by the project editor; awaiting a Judaism reviewer/)).toBeInTheDocument()
  })

  it('does not trust a stale sign-off from earlier wording', () => {
    show({ revision: 1, states: { JEWISH: 'MEMBER' } }, ['JEWISH'], 2)
    expect(screen.queryByText(/Reviewed by/)).toBeNull()
    expect(screen.getByTestId('signoff-badge')).toHaveTextContent(/awaiting review/i)
  })

  it('shows a disagreement plainly', () => {
    show({ revision: 1, states: { JEWISH: 'CONTESTED' } })
    expect(screen.getByText('A Judaism reviewer disagrees with this wording')).toBeInTheDocument()
  })

  it('reports each required tradition separately, and ignores forged extras', () => {
    show({ revision: 1, states: { JEWISH: 'MEMBER', CHRISTIAN: 'AWAITING', ISLAMIC: 'MEMBER' } }, ['JEWISH', 'CHRISTIAN'])
    expect(screen.getByText('Reviewed by a Judaism reviewer')).toBeInTheDocument()
    expect(screen.getByText('Awaiting Christianity review')).toBeInTheDocument()
    expect(screen.queryByText(/Islam/)).toBeNull()
  })

  it('rejects an unknown state value instead of rendering it', () => {
    show({ revision: 1, states: { JEWISH: 'VERIFIED_BY_EVERYONE' } })
    expect(screen.queryByText(/VERIFIED/)).toBeNull()
    expect(screen.getByTestId('signoff-badge')).toHaveTextContent(/awaiting review/i)
  })
})
