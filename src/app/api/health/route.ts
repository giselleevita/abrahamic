import prisma from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const headers = { 'Cache-Control': 'no-store' }

export async function GET(): Promise<Response> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return Response.json({ status: 'ok' }, { headers })
  } catch {
    // The public response contains no database details. This fixed marker is
    // enough to find the incident in Vercel runtime logs.
    console.error('[health-check] database unavailable')
    return Response.json({ status: 'unavailable' }, { status: 503, headers })
  }
}
