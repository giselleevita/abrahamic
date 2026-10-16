import { describe, expect, it, vi } from 'vitest'
import { onRequestError } from '@/instrumentation'

describe('server error logging', () => {
  it('keeps paths, messages, and headers out of production records', () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    onRequestError(
      Object.assign(new Error('private message'), { digest: 'abc123' }),
      { path: '/search?q=secret', method: 'GET', headers: { authorization: 'secret' } },
      { routePath: '/search', routeType: 'render', routerKind: 'App Router', renderSource: 'server-rendering', revalidateReason: undefined },
    )
    expect(log).toHaveBeenCalledWith('[server-error]', JSON.stringify({
      name: 'Error', digest: 'abc123', route: '/search', type: 'render',
    }))
    log.mockRestore()
  })
})
