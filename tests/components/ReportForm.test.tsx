import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReportForm } from '@/components/contribute/ReportForm'

afterEach(() => vi.unstubAllGlobals())

describe('ReportForm network recovery', () => {
  it('preserves the draft and re-enables submission after a network failure', async () => {
    const fetchMock = vi.fn()
      .mockRejectedValueOnce(new TypeError('offline'))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 201, headers: { 'content-type': 'application/json' } }))
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    render(<ReportForm pagePath="/comparisons/1" />)

    const textarea = screen.getByLabelText('What is wrong, and what should it say?')
    await user.type(textarea, 'The cited source is missing its surrounding context.')
    await user.click(screen.getByRole('button', { name: 'Send report' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/could not connect/i)
    await waitFor(() => expect(screen.getByRole('button', { name: 'Send report' })).toBeEnabled())
    expect(textarea).toHaveValue('The cited source is missing its surrounding context.')
    await user.click(screen.getByRole('button', { name: 'Send report' }))
    expect(await screen.findByText(/thank you. your report has been sent/i)).toBeInTheDocument()
  })

  it('shows server retry timing for a throttled report without clearing the draft', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ error: 'Too many reports.' }), {
      status: 429,
      headers: { 'content-type': 'application/json', 'retry-after': '125' },
    }))
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    render(<ReportForm />)
    const textarea = screen.getByLabelText('What is wrong, and what should it say?')
    const message = 'The citation needs a better source and context.'
    await user.type(textarea, message)
    await user.click(screen.getByRole('button', { name: 'Send report' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/try again in about 3 minutes/i)
    expect(textarea).toHaveValue(message)
  })
})
