import type { PrismaClient } from '../../src/generated/prisma/client'
import { guardKidsStory } from '../../src/lib/kids/content-guard'

/**
 * Hand-authored baseline stories for the kids section.
 *
 * These are written by an editor, not generated — `aiModel: 'hand-authored'`
 * records that. Seeding real content means a fresh clone has a working /kids
 * without an Anthropic key, and the games have something to link to.
 *
 * One story is left PENDING so the admin review queue demonstrates itself on
 * first run rather than appearing broken because it is empty.
 */

type SeedStory = {
  slug: string
  title: string
  ageBand: 'AGE_6_8' | 'AGE_9_12'
  body: string
  glossary: { term: string; plainDefinition: string }[]
  status: 'PENDING' | 'APPROVED'
  isPublished: boolean
  /** Matched against Claim.statement to build the provenance chain. */
  claimMatch: string
  figureSlugs: string[]
}

const STORIES: SeedStory[] = [
  {
    slug: 'many-names-one-story',
    title: 'Many Names, One Story',
    ageBand: 'AGE_6_8',
    body:
      'Some people appear in more than one holy book. ' +
      'The Torah calls a man Moshe. ' +
      'The Bible calls him Moses. ' +
      'The Quran calls him Musa. ' +
      'These are three names for one person. ' +
      'Each book tells his story in its own way. ' +
      'Sometimes the books agree. ' +
      'Sometimes these books tell a part differently. ' +
      'Reading them side by side helps us see both.',
    glossary: [
      { term: 'Torah', plainDefinition: 'A holy book in Judaism.' },
      { term: 'Quran', plainDefinition: 'The holy book of Islam.' },
    ],
    status: 'APPROVED',
    isPublished: true,
    claimMatch: 'Moses',
    figureSlugs: ['moses'],
  },
  {
    slug: 'a-promise-under-the-stars',
    title: 'A Promise Under the Stars',
    ageBand: 'AGE_6_8',
    body:
      'The Torah tells a story about a man named Abraham. ' +
      'One night he went outside his tent. ' +
      'He looked up at the night sky. ' +
      'There were more stars than he could count. ' +
      'The Torah says he was given a promise there. ' +
      'The Quran also tells about Abraham. ' +
      'It calls him Ibrahim. ' +
      'These books tell this part differently. ' +
      'Both of them remember him as important.',
    glossary: [
      { term: 'promise', plainDefinition: 'When someone says they will do something.' },
      { term: 'Ibrahim', plainDefinition: 'The name for Abraham in the Quran.' },
    ],
    status: 'APPROVED',
    isPublished: true,
    claimMatch: 'Abraham',
    figureSlugs: ['abraham'],
  },
  {
    slug: 'three-books-one-family',
    title: 'Three Books, One Family',
    ageBand: 'AGE_9_12',
    body:
      'Judaism, Christianity, and Islam each have their own holy books. ' +
      'The Torah and the Hebrew Bible are central in Judaism. ' +
      'The New Testament is central in Christianity. ' +
      'The Quran is the holy book of Islam. ' +
      'These books are not the same, but they are related. ' +
      'Many of the same people appear across all three. ' +
      'Abraham appears in every one of them. ' +
      'So do Moses and many others. ' +
      'Sometimes the books describe an event in nearly the same way. ' +
      'Sometimes these books tell a story differently from each other. ' +
      'Sometimes one book mentions a person the others never name. ' +
      'Scholars read them side by side to see exactly where they match. ' +
      'This website does the same thing. ' +
      'It shows what each book says, and lets you compare them yourself.',
    glossary: [
      { term: 'Judaism', plainDefinition: 'The religion of the Jewish people.' },
      { term: 'scholars', plainDefinition: 'People who study a subject very carefully.' },
    ],
    status: 'APPROVED',
    isPublished: true,
    claimMatch: 'Abraham',
    figureSlugs: ['abraham', 'moses'],
  },
  {
    slug: 'the-story-of-noah',
    title: 'A Boat and a Flood',
    ageBand: 'AGE_6_8',
    body:
      'The Torah tells a story about a man named Noah. ' +
      'He built a very large boat. ' +
      'The Torah says animals came aboard in pairs. ' +
      'Then a great flood covered the land. ' +
      'The Quran tells about Noah too. ' +
      'It calls him Nuh. ' +
      'These books tell this part differently. ' +
      'Both remember the boat and the water.',
    glossary: [
      { term: 'flood', plainDefinition: 'When a lot of water covers the land.' },
      { term: 'Nuh', plainDefinition: 'The name for Noah in the Quran.' },
    ],
    // Left unreviewed on purpose so /admin/kids-stories has a live example.
    status: 'PENDING',
    isPublished: false,
    claimMatch: 'Noah',
    figureSlugs: ['noah'],
  },
]

export async function seedKidsStories(prisma: PrismaClient) {
  let seeded = 0
  let skipped = 0

  for (const story of STORIES) {
    // The seeded text must satisfy exactly the same checks as generated text.
    // If an editor writes something that fails, the seed should say so loudly
    // rather than quietly planting content the pipeline would have rejected.
    const guard = guardKidsStory({
      title: story.title,
      body: story.body,
      ageBand: story.ageBand,
    })
    if (!guard.ok) {
      throw new Error(
        `Seed story "${story.slug}" fails the content guard:\n  - ${guard.reasons.join('\n  - ')}`,
      )
    }

    const claims = await prisma.claim.findMany({
      where: { isPublished: true, statement: { contains: story.claimMatch, mode: 'insensitive' } },
      select: { id: true },
      take: 3,
    })

    if (claims.length === 0) {
      skipped += 1
      continue
    }

    const figures = await prisma.figure.findMany({
      where: { slug: { in: story.figureSlugs } },
      select: { id: true },
    })

    await prisma.kidsStory.upsert({
      where: { slug: story.slug },
      update: {},
      create: {
        slug: story.slug,
        title: story.title,
        ageBand: story.ageBand,
        body: story.body,
        glossary: story.glossary,
        aiModel: 'hand-authored',
        aiRationale:
          'Seeded editorial baseline. Written by an editor from published claims, not model-generated.',
        status: story.status,
        isPublished: story.isPublished,
        reviewedAt: story.status === 'APPROVED' ? new Date() : null,
        claims: { create: claims.map((c, i) => ({ claimId: c.id, position: i })) },
        figures: { create: figures.map((f) => ({ figureId: f.id })) },
      },
    })
    seeded += 1
  }

  console.log(
    `✓ Kids stories seeded (${seeded} stories${skipped ? `, ${skipped} skipped — no matching claims` : ''})`,
  )
}
