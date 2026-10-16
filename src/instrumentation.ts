import type { Instrumentation } from 'next'

/** Structured, low-detail server error record for the existing Vercel runtime logs. */
export const onRequestError: Instrumentation.onRequestError = (error, _request, context) => {
  const name = error instanceof Error ? error.name : 'UnknownError'
  const digest = typeof error === 'object' && error !== null && 'digest' in error
    ? String(error.digest)
    : undefined

  // Never log the request URL, query, headers, body, or error message: they may
  // contain search terms, credentials, or private admin content.
  console.error('[server-error]', JSON.stringify({
    name,
    digest,
    route: context.routePath,
    type: context.routeType,
  }))
}
