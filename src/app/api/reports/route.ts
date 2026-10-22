import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { ipFromHeaders, ipHash } from '@/lib/client-ip'
import { REPORT_GLOBAL_MAX_PER_HOUR, REPORT_MAX_PER_DAY, reportSchema } from '@/lib/schemas/contributions'

const DAY_MS = 24 * 60 * 60 * 1000
const MAX_BODY_BYTES = 20_000
const RETENTION_MS = 30 * DAY_MS

/**
 * Public, no account. Tells the editors something looks wrong. A report is input for a human:
 * it is never a vote, never changes content, and cannot publish anything.
 *
 * Abuse controls: a hidden honeypot field, a per-IP daily cap and a global hourly cap held in
 * the database (in-memory counters do not work across serverless instances), and a body size cap.
 * The IP is stored only as a keyed hash and blanked after 30 days.
 */
export async function POST(req: Request) {
  const length = Number(req.headers.get('content-length') ?? 0)
  if (length > MAX_BODY_BYTES) return NextResponse.json({ error: 'Too large' }, { status: 413 })

  const raw = await req.json().catch(() => null)
  if (!raw || typeof raw !== 'object') return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  // A bot filled the field no person can see. Say it worked and store nothing.
  if (typeof (raw as { website?: unknown }).website === 'string' && (raw as { website: string }).website.trim() !== '') {
    return NextResponse.json({ ok: true }, { status: 201 })
  }

  const parsed = reportSchema.safeParse(raw)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const { website: _website, ...data } = parsed.data
  void _website

  const hash = ipHash(ipFromHeaders(req.headers))
  const now = Date.now()

  // Housekeeping: forget who sent old reports.
  await prisma.correctionReport.updateMany({
    where: { createdAt: { lt: new Date(now - RETENTION_MS) }, NOT: { ipHash: 'expired' } },
    data: { ipHash: 'expired' },
  })

  const [fromThisSender, fromEveryone] = await Promise.all([
    prisma.correctionReport.count({ where: { ipHash: hash, createdAt: { gt: new Date(now - DAY_MS) } } }),
    prisma.correctionReport.count({ where: { createdAt: { gt: new Date(now - 60 * 60 * 1000) } } }),
  ])
  if (fromThisSender >= REPORT_MAX_PER_DAY || fromEveryone >= REPORT_GLOBAL_MAX_PER_HOUR) {
    return NextResponse.json(
      { error: 'You have sent several reports today. Thank you; please try again tomorrow.' },
      { status: 429, headers: { 'Retry-After': '3600' } },
    )
  }

  if (data.claimId !== undefined) {
    const exists = await prisma.claim.findUnique({ where: { id: data.claimId }, select: { id: true } })
    if (!exists) return NextResponse.json({ error: 'That claim does not exist' }, { status: 400 })
  }

  await prisma.correctionReport.create({ data: { ...data, ipHash: hash } })
  return NextResponse.json({ ok: true }, { status: 201 })
}
