import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PublicShell } from '@/components/layout/PublicShell'
import { PublicAnalytics } from '@/components/layout/PublicAnalytics'

const pathname = vi.hoisted(() => ({ value: '/' }))
vi.mock('next/navigation', () => ({ usePathname: () => pathname.value }))
vi.mock('@vercel/analytics/next', () => ({ Analytics: () => <div>Public analytics loaded</div> }))

describe('PublicShell', () => {
  beforeEach(() => { pathname.value = '/' })

  it('shows one main landmark and public chrome on learning pages', () => {
    render(<PublicShell chrome={<header>Public navigation</header>} settings={<p>Motion settings</p>} footer={<footer>Site links</footer>}><h1>Learning</h1></PublicShell>)
    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(screen.getByRole('banner')).toHaveTextContent('Public navigation')
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Site links')
  })

  it('keeps the kids area inside the single main landmark without public chrome', () => {
    pathname.value = '/kids/games'
    render(<PublicShell chrome={<header>Public navigation</header>} settings={<p>Motion settings</p>} footer={<footer>Site links</footer>}><h1>Kids game</h1></PublicShell>)
    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(screen.queryByText('Public navigation')).not.toBeInTheDocument()
    expect(screen.queryByText('Site links')).not.toBeInTheDocument()
  })

  it('does not mount analytics on kids pages, but does on public pages', () => {
    pathname.value = '/kids/stories'
    const kids = render(<PublicAnalytics />)
    expect(screen.queryByText('Public analytics loaded')).not.toBeInTheDocument()
    kids.unmount()
    pathname.value = '/learn'
    render(<PublicAnalytics />)
    expect(screen.getByText('Public analytics loaded')).toBeInTheDocument()
  })
})
