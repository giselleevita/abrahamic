import prisma from '@/lib/prisma'
import { VideoManager, type AdminVideo } from '@/components/admin/VideoManager'

export const dynamic = 'force-dynamic'

export default async function AdminVideosPage() {
  const [videos, concepts] = await Promise.all([
    prisma.videoResource.findMany({
      include: { concepts: { include: { concept: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.concept.findMany({
      where: { isPublished: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ])

  const shaped: AdminVideo[] = videos.map((v) => ({
    id: v.id,
    youtubeId: v.youtubeId,
    title: v.title,
    channelName: v.channelName,
    editorNote: v.editorNote,
    perspectiveTradition: v.perspectiveTradition,
    isPublished: v.isPublished,
    isKidsSafe: v.isKidsSafe,
    conceptNames: v.concepts.map((c) => c.concept.name),
  }))

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-stone-900">Videos</h1>
        <p className="mt-1 max-w-3xl text-sm text-stone-600">
          Every video is added individually — there is no search or channel import, so
          nothing can appear that you did not approve. Videos never surface on comparison
          pages: those stay first-party.
        </p>
      </header>

      <VideoManager
        videos={shaped}
        concepts={concepts.map((c) => ({ id: c.id, label: c.name }))}
      />
    </div>
  )
}
