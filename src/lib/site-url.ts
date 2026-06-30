/**
 * Public site URL for metadata, sitemap, robots, and auth callbacks.
 */
export function getSiteUrl(): string {
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL.replace(/\/$/, '')
  }

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercelProduction) {
    return `https://${vercelProduction.replace(/\/$/, '')}`
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`
  }

  return 'http://localhost:3000'
}
