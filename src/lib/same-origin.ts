/** Next may normalize request.url to localhost behind a proxy; Host retains the public authority. */
export function isSameOrigin(req: Request): boolean {
  const expected = new URL(req.url)
  const host = req.headers.get('host')
  if (host) expected.host = host
  return req.headers.get('origin') === expected.origin
}
