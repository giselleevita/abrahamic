/** Which pages a correction may be filed against: comparisons and the source reader, nothing else. */
export function validCorrectionPath(path: string): boolean {
  if (!path.startsWith('/') || path.startsWith('//') || /[\\\r\n]/.test(path)) return false
  const url = new URL(path, 'https://context.invalid')
  if (url.hash) return false
  if (/^\/comparisons\/[1-9]\d*$/.test(url.pathname)) return !url.search
  if (!/^\/sources\/[a-z0-9-]+\/read$/.test(url.pathname)) return false
  if ([...url.searchParams.keys()].some((key) => key !== 'book' && key !== 'chapter')) return false
  const book = url.searchParams.get('book')
  const chapter = url.searchParams.get('chapter')
  return (!book && !chapter) || (!!book && book.length <= 200 && !!chapter && /^[1-9]\d{0,3}$/.test(chapter))
}
