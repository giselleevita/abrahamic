import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { requireSession } from '@/lib/api-auth'
import { updateVideoSchema, extractYoutubeId } from '@/lib/schemas/video'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireSession()
  if (denied) return denied

  const { id } = await params
  const videoId = Number.parseInt(id, 10)
  if (!Number.isInteger(videoId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const parsed = updateVideoSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { youtubeId: raw, conceptIds, figureIds, themeIds, ...rest } = parsed.data

  let youtubeId: string | undefined
  if (raw !== undefined) {
    const normalised = extractYoutubeId(raw)
    if (!normalised) {
      return NextResponse.json(
        { error: { fieldErrors: { youtubeId: ['Not a valid YouTube video or URL'] } } },
        { status: 400 },
      )
    }
    youtubeId = normalised
  }

  // Attachments are replaced wholesale when supplied, so removing a link is
  // possible; omitting the field leaves existing links untouched.
  const video = await prisma.videoResource.update({
    where: { id: videoId },
    data: {
      ...rest,
      ...(youtubeId ? { youtubeId } : {}),
      ...(conceptIds
        ? {
            concepts: {
              deleteMany: {},
              create: conceptIds.map((conceptId, i) => ({ conceptId, position: i })),
            },
          }
        : {}),
      ...(figureIds
        ? {
            figures: {
              deleteMany: {},
              create: figureIds.map((figureId, i) => ({ figureId, position: i })),
            },
          }
        : {}),
      ...(themeIds
        ? {
            themes: {
              deleteMany: {},
              create: themeIds.map((themeId, i) => ({ themeId, position: i })),
            },
          }
        : {}),
    },
  })

  revalidatePath('/videos')
  return NextResponse.json(video)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireSession()
  if (denied) return denied

  const { id } = await params
  const videoId = Number.parseInt(id, 10)
  if (!Number.isInteger(videoId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  await prisma.videoResource.delete({ where: { id: videoId } })
  revalidatePath('/videos')
  return NextResponse.json({ ok: true })
}
