import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const sources = await prisma.source.findMany({
    include: { _count: { select: { verses: true, claims: true } } },
    orderBy: { id: 'asc' },
  })
  return NextResponse.json(sources)
}

