import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { requireSession, hasSession } from '@/lib/api-auth'
import { createVideoSchema, extractYoutubeId } from '@/lib/schemas/video'

export async function GET(req: NextRequest) {
  const kidsSafeOnly = req.nextUrl.searchParams.get('kidsSafe') === 'true'
  const includeUnpublished =
    req.nextUrl.searchParams.get('published') === 'all' && (await hasSession())

  const videos = await prisma.videoResource.findMany({
    where: {
      ...(includeUnpublished ? {} : { isPublished: true }),
      ...(kidsSafeOnly ? { isKidsSafe: true } : {}),
    },
    include: {
      concepts: { include: { concept: { select: { slug: true, name: true } } } },
      figures: { include: { figure: { select: { slug: true, canonicalName: true } } } },
      themes: { include: { theme: { select: { slug: true, name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(videos)
}

export async function POST(req: NextRequest) {
  const denied = await requireSession()
  if (denied) return denied

  const parsed = createVideoSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { youtubeId: raw, conceptIds, figureIds, themeIds, ...rest } = parsed.data

  // Editors paste URLs; normalise to a strict 11-character id. A value that
  // cannot be normalised is rejected rather than stored — this string is
  // interpolated into an iframe src.
  const youtubeId = extractYoutubeId(raw)
  if (!youtubeId) {
    return NextResponse.json(
      { error: { fieldErrors: { youtubeId: ['Not a valid YouTube video or URL'] } } },
      { status: 400 },
    )
  }

  const existing = await prisma.videoResource.findUnique({ where: { youtubeId } })
  if (existing) {
    return NextResponse.json({ error: 'That video has already been added' }, { status: 409 })
  }

  const video = await prisma.videoResource.create({
    data: {
      ...rest,
      youtubeId,
      ...(conceptIds?.length
        ? { concepts: { create: conceptIds.map((conceptId, i) => ({ conceptId, position: i })) } }
        : {}),
      ...(figureIds?.length
        ? { figures: { create: figureIds.map((figureId, i) => ({ figureId, position: i })) } }
        : {}),
      ...(themeIds?.length
        ? { themes: { create: themeIds.map((themeId, i) => ({ themeId, position: i })) } }
        : {}),
    },
  })

  revalidatePath('/videos')
  return NextResponse.json(video, { status: 201 })
}
