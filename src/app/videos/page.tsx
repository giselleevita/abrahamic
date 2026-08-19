import Link from 'next/link'
import prisma from '@/lib/prisma'
import { YouTubeFacade } from '@/components/video/YouTubeFacade'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Callout } from '@/components/ui/Callout'

// Cached content. Editors' changes appear immediately: mutating routes
// invalidate the matching tag via revalidateContent().
export const revalidate = 3600

export const metadata = {
  title: 'Videos · Abrahamic Texts',
  description:
    'Editor-selected background videos on the texts, figures, and concepts covered on this site.',
}

export default async function VideosPage() {
  const videos = await prisma.videoResource.findMany({
    where: { isPublished: true },
    include: {
      concepts: { include: { concept: { select: { slug: true, name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <SectionHeader
        title="Videos"
        description="Background material selected by the editors. These are third-party videos, not made by this project."
      />

      {videos.length === 0 ? (
        <Callout tone="note">
          No videos have been published yet.{' '}
          <Link href="/concepts" className="underline">
            Browse concepts instead
          </Link>
          .
        </Callout>
      ) : (
        <div className="stagger grid gap-6 sm:grid-cols-2">
          {videos.map((video) => (
            <div key={video.id}>
              <YouTubeFacade
                youtubeId={video.youtubeId}
                title={video.title}
                channelName={video.channelName}
                editorNote={video.editorNote}
                perspectiveTradition={video.perspectiveTradition}
                durationSeconds={video.durationSeconds}
              />
              {video.concepts.length > 0 && (
                <p className="mt-2 flex flex-wrap gap-2 text-xs">
                  {video.concepts.map(({ concept }) => (
                    <Link
                      key={concept.slug}
                      href={`/concepts/${concept.slug}`}
                      className="rounded-full border border-stone-700 px-3 py-1 text-primary-300 hover:border-gold-500 hover:text-gold-400"
                    >
                      {concept.name}
                    </Link>
                  ))}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <Callout tone="editorial" title="Why these videos are here" className="mt-10">
        This platform authors its own comparisons and cites its own sources. Videos are the
        one place outside voices appear, so each carries a note explaining why an editor
        selected it. A lecture is an argument, and including one is not an endorsement of it.
        Videos are never shown on comparison pages.
      </Callout>
    </div>
  )
}
