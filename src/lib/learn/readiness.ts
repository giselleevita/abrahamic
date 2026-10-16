type Artwork = {
  artworkPath: string | null
  artworkAlt: string | null
  artworkCredit: string | null
  artworkSourceUrl: string | null
  artworkLicense: string | null
}

type Chapter = Artwork & {
  neutralityReviewedAt: Date | null
  items: { itemType: string }[]
}

const ALLOWED_LICENSES = new Set(['PROJECT', 'PUBLIC_DOMAIN', 'CC0', 'CC_BY', 'CC_BY_SA'])

function present(value: string | null): boolean {
  return Boolean(value?.trim())
}

export function artworkIssues(artwork: Artwork): string[] {
  const issues: string[] = []
  if (!present(artwork.artworkPath)) issues.push('image')
  if (!present(artwork.artworkAlt)) issues.push('alt text')
  if (!present(artwork.artworkCredit)) issues.push('creator credit')
  if (!present(artwork.artworkSourceUrl) || !/^(\/|https:\/\/)/.test(artwork.artworkSourceUrl!.trim())) issues.push('source URL')
  if (!artwork.artworkLicense || !ALLOWED_LICENSES.has(artwork.artworkLicense)) issues.push('reusable licence')
  return issues
}

export function chapterReadiness(chapter: Chapter, course: Artwork) {
  const effectiveArtwork: Artwork = {
    artworkPath: chapter.artworkPath ?? course.artworkPath,
    artworkAlt: chapter.artworkAlt ?? course.artworkAlt,
    artworkCredit: chapter.artworkCredit ?? course.artworkCredit,
    artworkSourceUrl: chapter.artworkSourceUrl ?? course.artworkSourceUrl,
    artworkLicense: chapter.artworkLicense ?? course.artworkLicense,
  }
  const artwork = artworkIssues(effectiveArtwork)
  const evidenceLinks = chapter.items.filter((item) => item.itemType === 'VERSE' || item.itemType === 'COMPARISON').length
  const directVerses = chapter.items.filter((item) => item.itemType === 'VERSE').length
  const issues = [
    ...artwork.map((field) => `Artwork: ${field}`),
    ...(!chapter.neutralityReviewedAt ? ['Neutrality review'] : []),
    ...(chapter.items.length === 0 ? ['No learning items'] : []),
    ...(evidenceLinks === 0 ? ['No evidence links'] : []),
  ]
  return { artwork, directVerses, evidenceLinks, issues, ready: issues.length === 0 }
}
