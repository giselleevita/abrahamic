import prisma from '@/lib/prisma'
import { isTrackedStep } from '@/lib/learn/metrics'

export const runtime = 'nodejs'

const MAX_DAILY_ACTIONS_PER_STEP = 10_000

export async function POST(request: Request): Promise<Response> {
  const origin = request.headers.get('origin')
  if (!origin || origin !== new URL(request.url).origin) {
    return new Response(null, { status: 403 })
  }
  if (Number(request.headers.get('content-length') ?? 0) > 256) {
    return new Response(null, { status: 413 })
  }

  let body: unknown
  try {
    const text = await request.text()
    if (text.length > 256) return new Response(null, { status: 413 })
    body = JSON.parse(text)
  } catch {
    return new Response(null, { status: 400 })
  }
  const chapterSlug = typeof body === 'object' && body !== null && 'chapterSlug' in body
    ? body.chapterSlug
    : null
  if (!isTrackedStep(chapterSlug)) return new Response(null, { status: 400 })

  // One row per day and step; no IP, cookie, user ID, or event log is stored.
  // A fixed cap bounds storage and protects the free database from a noisy client.
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  await prisma.$executeRaw`
    INSERT INTO journey_metrics (day, "chapterSlug", count)
    VALUES (${today}, ${chapterSlug}, 1)
    ON CONFLICT (day, "chapterSlug") DO UPDATE
      SET count = LEAST(journey_metrics.count + 1, ${MAX_DAILY_ACTIONS_PER_STEP})
  `
  return new Response(null, { status: 204 })
}
