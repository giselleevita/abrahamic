import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NameMatchGame, type NamePair } from '@/components/kids/games/NameMatchGame'

const PAIRS: NamePair[] = [
  { figureId: 1, canonicalName: 'Moses', aliasName: 'Musa', aliasTradition: 'ISLAMIC' },
  { figureId: 2, canonicalName: 'Abraham', aliasName: 'Avraham', aliasTradition: 'JEWISH' },
  { figureId: 3, canonicalName: 'Aaron', aliasName: 'Aharon', aliasTradition: 'JEWISH' },
]

beforeEach(() => window.localStorage.clear())

function setup() {
  return { user: userEvent.setup(), ...render(<NameMatchGame pairs={PAIRS} />) }
}

describe('NameMatchGame', () => {
  it('disables the alias column until a person is chosen', () => {
    setup()
    expect(screen.getByRole('button', { name: /Musa/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Moses' })).toBeEnabled()
  })

  it('enables the alias column once a person is selected', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('button', { name: 'Moses' }))

    expect(screen.getByRole('button', { name: 'Moses' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /Musa/ })).toBeEnabled()
  })

  it('announces a correct match and counts it', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('button', { name: 'Moses' }))
    await user.click(screen.getByRole('button', { name: /Musa/ }))

    expect(screen.getByText(/Correct\. Moses is also called Musa\./)).toBeInTheDocument()
    expect(screen.getByText('1 of 3 right')).toBeInTheDocument()
    // A matched pair is locked so it cannot be re-scored.
    expect(screen.getByRole('button', { name: /Moses/ })).toBeDisabled()
  })

  it('announces a wrong match without counting it', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('button', { name: 'Moses' }))
    await user.click(screen.getByRole('button', { name: /Avraham/ }))

    expect(screen.getByText(/Not a match/)).toBeInTheDocument()
    expect(screen.getByText('0 of 3 right')).toBeInTheDocument()
  })

  it('reports a final score once every pair is matched', async () => {
    const { user } = setup()
    for (const pair of PAIRS) {
      await user.click(screen.getByRole('button', { name: pair.canonicalName }))
      await user.click(screen.getByRole('button', { name: new RegExp(pair.aliasName) }))
    }

    expect(screen.getByText('3 of 3 right')).toBeInTheDocument()
    // Perfect play — three attempts for three pairs.
    expect(screen.getByText(/All done — 100%/)).toBeInTheDocument()
  })

  it('persists the best score to localStorage and nothing else', async () => {
    const { user } = setup()
    for (const pair of PAIRS) {
      await user.click(screen.getByRole('button', { name: pair.canonicalName }))
      await user.click(screen.getByRole('button', { name: new RegExp(pair.aliasName) }))
    }

    const raw = window.localStorage.getItem('abrahamic.kids.v1')
    expect(raw).toBeTruthy()

    const stored = JSON.parse(raw as string)
    expect(stored.games['name-match'].bestScore).toBe(100)

    // The stored shape is asserted exactly, not merely scanned for suspicious
    // words: only a score, a count, and a timestamp may ever be written. No
    // identifier can appear without failing this test, which is what keeps the
    // kids section outside COPPA / GDPR Art. 8 scope.
    expect(Object.keys(stored).sort()).toEqual(['games', 'version'])
    expect(Object.keys(stored.games['name-match']).sort()).toEqual([
      'bestScore',
      'completions',
      'lastPlayedIso',
    ])
    // And it is the only key the site writes.
    expect(window.localStorage.length).toBe(1)
  })

  it('resets to a fresh board on restart', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('button', { name: 'Moses' }))
    await user.click(screen.getByRole('button', { name: /Musa/ }))
    expect(screen.getByText('1 of 3 right')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Start again' }))
    expect(screen.getByText('0 of 3 right')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Moses' })).toBeEnabled()
  })
})
