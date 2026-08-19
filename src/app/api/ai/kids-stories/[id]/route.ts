import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { requireSession } from '@/lib/api-auth'
import { reviewKidsStorySchema } from '@/lib/schemas/kids'
import { guardKidsStory } from '@/lib/kids/content-guard'

/**
 * Review or publish a drafted story.
 *
 * Unlike the verse-link queue, approving does NOT release the content.
 * Publication is a second, explicit action. For child-facing material a single
 * click should not take a draft from unreviewed to publicly readable.
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireSession()
  if (denied) return denied

  const { id } = await params
  const storyId = Number.parseInt(id, 10)
  if (!Number.isInteger(storyId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const parsed = reviewKidsStorySchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const story = await prisma.kidsStory.findUnique({ where: { id: storyId } })
  if (!story) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const nextStatus = parsed.data.status ?? story.status
  const nextPublished = parsed.data.isPublished ?? story.isPublished

  // Mirror the database CHECK constraint with a clear message. The constraint
  // is the real guarantee; this exists so the admin UI gets an explanation
  // rather than a raw driver error.
  if (nextPublished && nextStatus !== 'APPROVED') {
    return NextResponse.json(
      { error: 'A story must be approved before it can be published' },
      { status: 400 },
    )
  }

  // Re-run the guard at publish time: the body may have been edited since it
  // was drafted, and publishing is the moment the content becomes reachable.
  if (nextPublished && !story.isPublished) {
    const guard = guardKidsStory({
      title: story.title,
      body: story.body,
      ageBand: story.ageBand,
    })
    if (!guard.ok) {
      return NextResponse.json(
        { error: 'Story fails content checks', reasons: guard.reasons },
        { status: 400 },
      )
    }
  }

  const updated = await prisma.kidsStory.update({
    where: { id: storyId },
    data: {
      status: nextStatus,
      isPublished: nextPublished,
      reviewNotes: parsed.data.reviewNotes ?? story.reviewNotes,
      ...(parsed.data.status ? { reviewedAt: new Date() } : {}),
    },
  })

  revalidatePath('/kids', 'layout')
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireSession()
  if (denied) return denied

  const { id } = await params
  const storyId = Number.parseInt(id, 10)
  if (!Number.isInteger(storyId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  await prisma.kidsStory.delete({ where: { id: storyId } })
  revalidatePath('/kids', 'layout')
  return NextResponse.json({ ok: true })
}
