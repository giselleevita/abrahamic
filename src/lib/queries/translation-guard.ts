/**
 * Runtime enforcement of the public-demo translation policy.
 *
 * Historically the policy held only because `prisma/seed/verses.ts` deleted the
 * licensed rows at seed time — a data-state accident, not an invariant. Every
 * read path except `/api/sources/[sourceKey]/verses` selected translations
 * straight from Prisma, so any data import or admin upload would have silently
 * published licensed text across the whole site.
 *
 * This module closes that gap at the client layer: any `translations` array in
 * any query result, at any nesting depth, is filtered before it reaches calling
 * code. Enforcement is therefore structural — a new query cannot opt out of it
 * by forgetting to call a helper.
 *
 * Set `PUBLIC_DEMO_MODE=false` for a deployment that holds real translation
 * licences. It defaults to enabled so the safe path is the default path.
 */
import { isPublicDemoTranslation } from '@/lib/public-demo-policy'

export function isPublicDemoMode(): boolean {
  return process.env.PUBLIC_DEMO_MODE !== 'false'
}

/** Keys whose array values hold `VerseTranslation` rows. */
const TRANSLATION_KEY = 'translations'

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isTranslationRow(value: unknown): value is { name: string } {
  return isPlainObject(value) && typeof value.name === 'string'
}

/**
 * Recursively strip non-public translations from a Prisma result.
 *
 * Returns the input unchanged (same reference) when nothing was filtered, so
 * the common case allocates nothing. Dates, Decimals, and other class instances
 * are passed through untouched — only plain objects and arrays are traversed.
 */
export function stripLicensedTranslations<T>(value: T): T {
  if (Array.isArray(value)) {
    let changed = false
    const next = value.map((item) => {
      const stripped = stripLicensedTranslations(item)
      if (stripped !== item) changed = true
      return stripped
    })
    return (changed ? next : value) as T
  }

  if (!isPlainObject(value)) return value
  // Preserve Date, Decimal, Buffer, etc. — traversing them would corrupt them.
  if (Object.getPrototypeOf(value) !== Object.prototype) return value

  let changed = false
  const next: Record<string, unknown> = {}

  for (const [key, child] of Object.entries(value)) {
    if (key === TRANSLATION_KEY && Array.isArray(child) && child.every(isTranslationRow)) {
      const filtered = child.filter((t) => isPublicDemoTranslation(t.name))
      if (filtered.length !== child.length) changed = true
      next[key] = filtered
      continue
    }

    const stripped = stripLicensedTranslations(child)
    if (stripped !== child) changed = true
    next[key] = stripped
  }

  return (changed ? next : value) as T
}
