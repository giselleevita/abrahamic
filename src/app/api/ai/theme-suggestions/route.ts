import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { suggestThemeTags } from '@/lib/ai'

const schema = z.object({ statement: z.string().min(10) })

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ suggestedThemeIds: [] })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const themes = await prisma.theme.findMany({ orderBy: { name: 'asc' } })
  const suggestedThemeIds = await suggestThemeTags(parsed.data.statement, themes)

  return NextResponse.json({ suggestedThemeIds })
}
