import prisma from '@/lib/prisma'
import type { NamePair } from '@/components/kids/games/NameMatchGame'
import type { PresenceQuestion } from '@/components/kids/games/WhoTellsItGame'
import type { SortableEvent } from '@/components/kids/games/TimelineSorterGame'
import type { ChainLink } from '@/components/kids/games/FamilyChainGame'
import type { TimelineEra } from '@/generated/prisma/client'

/**
 * Server-side data shaping for the kids games.
 *
 * Every game is built from data that already exists on the main site —
 * aliases, timeline positions, recorded tradition presence, parent relations —
 * so no game asserts anything the editorial pipeline has not already reviewed.
 *
 * Note what is absent: none of these queries touches VerseTranslation. The
 * games deal in names, order, and references, never scripture text.
 */

const GAME_SIZE = 5

export async function getNamePairs(): Promise<NamePair[]> {
  // Figures whose name differs across traditions are the whole point of the
  // game, so take those with the most aliases.
  const figures = await prisma.figure.findMany({
    where: { aliases: { some: {} } },
    select: {
      id: true,
      canonicalName: true,
      aliases: { select: { name: true, tradition: true } },
    },
    orderBy: { canonicalName: 'asc' },
  })

  return figures
    .flatMap((figure) => {
      // Pick an alias that actually differs from the canonical name; an alias
      // identical to it would make the question meaningless.
      const distinct = figure.aliases.find(
        (a) => a.name.toLowerCase() !== figure.canonicalName.toLowerCase(),
      )
      if (!distinct) return []
      return [
        {
          figureId: figure.id,
          canonicalName: figure.canonicalName,
          aliasName: distinct.name,
          aliasTradition: distinct.tradition,
        },
      ]
    })
    .slice(0, GAME_SIZE)
}

export async function getPresenceQuestions(): Promise<PresenceQuestion[]> {
  const events = await prisma.timelineEvent.findMany({
    where: { isPublished: true, traditions: { some: {} } },
    select: {
      slug: true,
      name: true,
      summary: true,
      traditions: { select: { tradition: true, presence: true } },
    },
    orderBy: [{ era: 'asc' }, { position: 'asc' }],
  })

  return events
    .flatMap((event) => {
      const entry = event.traditions[0]
      if (!entry) return []
      return [
        {
          eventSlug: event.slug,
          eventName: event.name,
          summary: event.summary,
          tradition: entry.tradition,
          answer: entry.presence,
        },
      ]
    })
    .slice(0, GAME_SIZE)
}

export async function getSortableEra(): Promise<{ era: TimelineEra; events: SortableEvent[] } | null> {
  // Group by era first so we pick one that actually has enough events to sort.
  const groups = await prisma.timelineEvent.groupBy({
    by: ['era'],
    where: { isPublished: true },
    _count: { id: true },
  })

  const usable = groups.filter((g) => g._count.id >= 3)
  if (usable.length === 0) return null

  // Deterministic pick: the era with the most events, ties broken by name, so
  // the server and client never disagree and the page can be cached.
  const era = usable.sort(
    (a, b) => b._count.id - a._count.id || a.era.localeCompare(b.era),
  )[0].era

  const events = await prisma.timelineEvent.findMany({
    where: { isPublished: true, era },
    select: { slug: true, name: true, position: true },
    orderBy: { position: 'asc' },
    take: GAME_SIZE,
  })

  return { era, events }
}

export async function getFamilyChain(): Promise<ChainLink[]> {
  const relations = await prisma.figureRelation.findMany({
    where: { relationType: 'PARENT' },
    select: {
      fromFigure: { select: { id: true, canonicalName: true } },
      toFigure: { select: { id: true, canonicalName: true } },
      verse: { select: { referenceKey: true } },
    },
  })

  if (relations.length === 0) return []

  // Build parent → child edges, then walk the longest chain available.
  const childOf = new Map<number, { id: number; name: string; reference: string | null }>()
  const names = new Map<number, string>()

  for (const r of relations) {
    names.set(r.fromFigure.id, r.fromFigure.canonicalName)
    names.set(r.toFigure.id, r.toFigure.canonicalName)
    // `fromFigure` is the parent for a PARENT relation.
    if (!childOf.has(r.fromFigure.id)) {
      childOf.set(r.fromFigure.id, {
        id: r.toFigure.id,
        name: r.toFigure.canonicalName,
        reference: r.verse?.referenceKey ?? null,
      })
    }
  }

  let best: ChainLink[] = []

  for (const startId of names.keys()) {
    const chain: ChainLink[] = [
      { figureId: startId, name: names.get(startId) ?? '', generation: 0, reference: null },
    ]
    const seen = new Set<number>([startId])

    let cursor = startId
    while (childOf.has(cursor)) {
      const next = childOf.get(cursor)!
      if (seen.has(next.id)) break // guard against a cyclic data error
      seen.add(next.id)
      chain.push({
        figureId: next.id,
        name: next.name,
        generation: chain.length,
        reference: next.reference,
      })
      cursor = next.id
    }

    if (chain.length > best.length) best = chain
  }

  // Fewer than three links is not a puzzle.
  return best.length >= 3 ? best.slice(0, GAME_SIZE) : []
}
