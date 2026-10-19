import { isSameOrigin } from '@/lib/same-origin'
import prisma from '@/lib/prisma'
import { requireSession } from '@/lib/api-auth'
import { correctionUpdateSchema } from '@/lib/schemas/corrections'
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireSession()
  if (denied) return denied
  if (!isSameOrigin(req)) return Response.json({ error: 'Please submit from this site.' }, { status: 403 })
  const { id } = await params
  if (!/^[1-9]\d*$/.test(id)) return Response.json({ error: 'Invalid report.' }, { status: 400 })
  const parsed = correctionUpdateSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: 'Invalid status.' }, { status: 400 })
  const updated = await prisma.correctionReport.updateMany({ where: { id: Number(id) }, data: parsed.data })
  if (!updated.count) return Response.json({ error: 'Report not found.' }, { status: 404 })
  return Response.json({ ok: true })
}
