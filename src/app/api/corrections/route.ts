import { isSameOrigin } from '@/lib/same-origin'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { correctionSchema } from '@/lib/schemas/corrections'
import { requestKey } from '@/lib/rate-limit'
import { correctionRateLimit } from '@/lib/correction-rate-limit'

/** Public write only. Reports are never returned through a public endpoint. */
export async function POST(req: Request) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: 'Please submit from this site.' }, { status: 403 })
  let limit
  try { limit = await correctionRateLimit(requestKey(req)) } catch {
    return NextResponse.json({ error: 'We could not save your report. Please try again.' }, { status: 503 })
  }
  if (!limit.ok) return NextResponse.json({ error: 'Too many reports. Please try again later.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } })
  let body: unknown
  try {
    const text = await req.text()
    if (text.length > 12000) return NextResponse.json({ error: 'Report is too long.' }, { status: 413 })
    body = JSON.parse(text)
  } catch { return NextResponse.json({ error: 'Please send a valid report.' }, { status: 400 }) }
  const parsed = correctionSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Choose a category and describe the correction in 20–3,000 characters.' }, { status: 400 })
  const { website, ...data } = parsed.data
  if (website) return NextResponse.json({ ok: true }, { status: 201 })
  const url = new URL(data.pagePath, req.url)
  try {
    if (url.pathname.startsWith('/comparisons/')) {
      const comparison = await prisma.comparison.findUnique({ where: { id: Number(url.pathname.split('/')[2]), isPublished: true }, select: { id: true } })
      if (!comparison) return NextResponse.json({ error: 'This comparison is no longer available.' }, { status: 404 })
    } else {
      const source = await prisma.source.findUnique({ where: { slug: url.pathname.split('/')[2] }, select: { id: true } })
      if (!source) return NextResponse.json({ error: 'This source is no longer available.' }, { status: 404 })
      if (url.searchParams.has('book')) {
        const passage = await prisma.verse.findFirst({ where: { sourceId: source.id, book: url.searchParams.get('book')!, chapter: Number(url.searchParams.get('chapter')) }, select: { id: true } })
        if (!passage) return NextResponse.json({ error: 'This passage is no longer available.' }, { status: 404 })
      }
    }
    await prisma.correctionReport.create({ data: { ...data, reference: data.reference || null } })
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'We could not save your report. Please try again.' }, { status: 503 })
  }
}
