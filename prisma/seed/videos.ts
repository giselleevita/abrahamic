import type { PrismaClient } from '../../src/generated/prisma/client'

// Candidate third-party videos. Seeded UNPUBLISHED: an editor must watch each
// one, adjust the note, and publish it from /admin/videos. IDs and titles were
// checked against YouTube metadata; durations are rounded to the minute.
const videos = [
  {
    youtubeId: 'O89-OaWMkP0',
    title: 'Lecture 6. Biblical Narrative: The Stories of the Patriarchs (Genesis 12-36)',
    channelName: 'YaleCourses',
    perspectiveTradition: 'JEWISH' as const,
    durationSeconds: 2940,
    editorNote:
      'A university lecture (Yale, 2006) on the Abraham narratives as they appear in the Hebrew Bible: the call, the covenant and the binding of Isaac. It also surveys scholarly disagreement over the historical reliability of the patriarchal stories, which this site does not adjudicate. Draft note: confirm against the video before publishing.',
    figureSlugs: ['abraham'],
    conceptSlugs: ['monotheism', 'circumcision'],
  },
  {
    youtubeId: '1qCUgkr2ohY',
    title: '16. Paul as Jewish Theologian',
    channelName: 'YaleCourses',
    perspectiveTradition: 'CHRISTIAN' as const,
    durationSeconds: 2820,
    editorNote:
      'A university lecture (Yale) on how Paul treats the Jewish Law in Galatians and Romans, the letters where Paul presents Abraham as the model of faith. Academic and historical in approach, not devotional. Draft note: confirm against the video before publishing.',
    figureSlugs: ['abraham'],
    conceptSlugs: ['salvation', 'circumcision'],
  },
  {
    youtubeId: 'RE_BXp1LPl0',
    title: 'The Prophets in the Quran Ep. 9: Prophet Ibrahim (Abraham) (AS)',
    channelName: 'IslamiCity',
    perspectiveTradition: 'ISLAMIC' as const,
    durationSeconds: 518,
    editorNote:
      'A short devotional presentation from an Islamic outreach channel on how the Quran tells the story of Ibrahim. It speaks from within the tradition and is not an academic survey. Draft note: confirm against the video before publishing.',
    figureSlugs: ['abraham'],
    conceptSlugs: ['monotheism', 'prophethood'],
  },
]

export async function seedVideos(prisma: PrismaClient) {
  for (const { figureSlugs, conceptSlugs, ...video } of videos) {
    const created = await prisma.videoResource.upsert({
      where: { youtubeId: video.youtubeId },
      update: {}, // never overwrite an editor's changes or published state
      create: { ...video, isPublished: false },
    })
    const [figures, concepts] = await Promise.all([
      prisma.figure.findMany({ where: { slug: { in: figureSlugs } }, select: { id: true } }),
      prisma.concept.findMany({ where: { slug: { in: conceptSlugs } }, select: { id: true } }),
    ])
    for (const [position, { id }] of figures.entries()) {
      await prisma.videoResourceFigure.upsert({
        where: { videoId_figureId: { videoId: created.id, figureId: id } },
        update: {},
        create: { videoId: created.id, figureId: id, position },
      })
    }
    for (const [position, { id }] of concepts.entries()) {
      await prisma.videoResourceConcept.upsert({
        where: { videoId_conceptId: { videoId: created.id, conceptId: id } },
        update: {},
        create: { videoId: created.id, conceptId: id, position },
      })
    }
  }
  console.log('✓ Video candidates seeded (unpublished)')
}
