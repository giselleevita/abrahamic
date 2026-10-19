import prisma from '@/lib/prisma'
import { requireSession } from '@/lib/api-auth'
import { correctionStatuses } from '@/lib/schemas/corrections'
export async function GET(req: Request) {
  const denied = await requireSession()
  if (denied) return denied
  const status = new URL(req.url).searchParams.get('status')
  if (status && !correctionStatuses.includes(status as typeof correctionStatuses[number])) return Response.json({ error: 'Invalid status.' }, { status: 400 })
  const reports = await prisma.correctionReport.findMany({ where: status ? { status: status as typeof correctionStatuses[number] } : {}, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: 100 })
  return Response.json(reports, { headers: { 'Cache-Control': 'no-store' } })
}
