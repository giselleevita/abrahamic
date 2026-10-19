// Run before deployment writes. Preview credentials must be explicitly isolated.
export function previewDatabase(env = process.env) {
  if (env.VERCEL_ENV !== 'preview') return null
  if (env.PREVIEW_DATABASE_ISOLATED !== 'true' || !env.PREVIEW_DATABASE_URL || !env.PREVIEW_DIRECT_URL) {
    throw new Error('Preview blocked: configure an isolated seeded database using PREVIEW_DATABASE_URL, PREVIEW_DIRECT_URL and PREVIEW_DATABASE_ISOLATED=true.')
  }
  const identity = (value) => {
    const url = new URL(value)
    return `${url.hostname.replace('-pooler', '')}:${url.port || '5432'}${url.pathname}`
  }
  const preview = identity(env.PREVIEW_DATABASE_URL)
  if (identity(env.PREVIEW_DIRECT_URL) !== preview) throw new Error('Preview pooled and direct URLs must identify the same isolated database.')
  for (const key of ['NEON_DATABASE_URL', 'NEON_DATABASE_URL_UNPOOLED', 'DATABASE_URL', 'DIRECT_URL', 'POSTGRES_URL', 'PRISMA_DATABASE_URL', 'storage_POSTGRES_URL', 'storage_PRISMA_DATABASE_URL', 'storage_DATABASE_URL']) {
    if (env[key] && identity(env[key]) === preview) throw new Error('Preview isolation check failed: preview credentials match an inherited database.')
  }
  return { pooled: env.PREVIEW_DATABASE_URL, direct: env.PREVIEW_DIRECT_URL }
}
