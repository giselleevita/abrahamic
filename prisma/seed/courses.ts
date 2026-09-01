import type { PrismaClient, Tradition, TraditionPresence } from '@/generated/prisma/client'

/**
 * Seeds the "Foundations" course.
 *
 * Chapters curate content that already exists (concepts, comparisons, figures,
 * themes) rather than duplicating it; each ends in a short quiz.
 *
 * Every question here obeys the neutrality rule enforced by
 * src/lib/learn/neutrality.ts and the migration's CHECK constraints: the
 * correct answer is always a fact about what a *named* tradition teaches or
 * what a *named* text says, never an unattributed truth claim. Chapter 5 draws
 * on contested material deliberately, and uses DIVERGENCE_MAP so every
 * tradition's position is shown and none is scored as mistaken.
 */

type ItemSpec =
  | { kind: 'CONCEPT'; slug: string; note?: string }
  | { kind: 'COMPARISON'; slug: string; note?: string }
  | { kind: 'FIGURE'; slug: string; note?: string }
  | { kind: 'THEME'; slug: string; note?: string }

type OptionSpec = {
  text: string
  isCorrect?: boolean
  tradition?: Tradition
  presence?: TraditionPresence
  rationale?: string
}

type QuestionSpec = {
  kind: 'TRADITION_TEACHING' | 'FIGURE_IDENTITY' | 'SOURCE_TEXT' | 'DIVERGENCE_MAP' | 'TERMINOLOGY'
  prompt: string
  explanation: string
  subjectTradition?: Tradition
  /** Provenance — exactly one must be given. */
  conceptSlug?: string
  comparisonSlug?: string
  options: OptionSpec[]
}

type ChapterSpec = {
  slug: string
  title: string
  summary: string
  items: ItemSpec[]
  questions: QuestionSpec[]
}

const CHAPTERS: ChapterSpec[] = [
  {
    slug: 'the-one-god',
    title: 'The One God',
    summary:
      'All three traditions call themselves monotheistic — but they mean noticeably different things by "one". Start here, because this disagreement shapes almost everything that follows.',
    items: [
      { kind: 'CONCEPT', slug: 'monotheism', note: 'Read all three definitions side by side before going further.' },
      { kind: 'COMPARISON', slug: 'oneness-of-god' },
      { kind: 'CONCEPT', slug: 'trinity', note: 'The doctrine Judaism and Islam both regard as the sticking point.' },
      { kind: 'THEME', slug: 'god' },
    ],
    questions: [
      {
        kind: 'TERMINOLOGY',
        prompt: 'In Islamic theology, what does the term "tawhid" refer to?',
        explanation:
          'Tawhid is the doctrine of absolute divine unity — that God is one, eternal, uncreated and unique. It is the central pillar of Islamic theology.',
        conceptSlug: 'monotheism',
        options: [
          { text: 'The absolute oneness and uniqueness of God', isCorrect: true },
          { text: 'The night journey of Muhammad', rationale: 'That is the Isra and Miraj, a separate concept.' },
          { text: 'The obligation of almsgiving', rationale: 'That is zakat, one of the five pillars.' },
          { text: 'The line of prophets before Muhammad', rationale: 'That is nubuwwa (prophethood).' },
        ],
      },
      {
        kind: 'TRADITION_TEACHING',
        prompt: 'What does Judaism teach about the nature of God\'s oneness?',
        explanation:
          'The Shema (Deuteronomy 6:4) declares God to be one, and rabbinic tradition reads that oneness as absolute and indivisible — without body, partners or intermediaries.',
        subjectTradition: 'JEWISH',
        conceptSlug: 'monotheism',
        options: [
          { text: 'An absolute, indivisible unity with no partners or persons', isCorrect: true, tradition: 'JEWISH' },
          { text: 'One essence subsisting in three persons', tradition: 'CHRISTIAN', rationale: 'This is the Christian Trinitarian formulation, not the Jewish one.' },
          { text: 'A unity that admits a divine son', tradition: 'CHRISTIAN', rationale: 'Jewish theology rejects divine sonship in this sense.' },
          { text: 'A supreme god among lesser gods', rationale: 'No Abrahamic tradition teaches this; it describes henotheism.' },
        ],
      },
      {
        kind: 'TRADITION_TEACHING',
        prompt: 'In Christianity, what does the doctrine of the Trinity assert?',
        explanation:
          'Formulated at Nicaea (325 CE) and Constantinople (381 CE), the doctrine holds that God is numerically one in essence yet three in persons — Father, Son and Holy Spirit.',
        subjectTradition: 'CHRISTIAN',
        conceptSlug: 'trinity',
        options: [
          { text: 'One God in three persons, one in essence', isCorrect: true, tradition: 'CHRISTIAN' },
          { text: 'Three separate gods acting in concert', rationale: 'Christian theology explicitly rejects tritheism, though critics raise it as an objection.' },
          { text: 'One God who appears in three successive modes', rationale: 'This is modalism, rejected as heresy by mainstream Christianity.' },
          { text: 'A single undifferentiated unity', tradition: 'ISLAMIC', rationale: 'This is closer to the Islamic and Jewish position than the Christian one.' },
        ],
      },
    ],
  },
  {
    slug: 'abraham-and-his-family',
    title: 'Abraham and his family',
    summary:
      'Every one of these traditions traces itself to Abraham, and each tells his story slightly differently. The differences in the family line are where the traditions begin to diverge.',
    items: [
      { kind: 'FIGURE', slug: 'abraham', note: 'Note how the name changes across traditions: Avraham, Abraham, Ibrahim.' },
      { kind: 'COMPARISON', slug: 'abrahams-call' },
      { kind: 'COMPARISON', slug: 'abrahams-covenant' },
      { kind: 'FIGURE', slug: 'hagar' },
      { kind: 'FIGURE', slug: 'ishmael' },
      { kind: 'FIGURE', slug: 'isaac' },
      { kind: 'COMPARISON', slug: 'akedah-which-son', note: 'The traditions disagree here. Notice that each names a different son.' },
    ],
    questions: [
      {
        kind: 'FIGURE_IDENTITY',
        prompt: 'In Islamic tradition, by what name is Abraham known?',
        explanation: 'Ibrahim is the Arabic form of the name, and he is counted among the greatest prophets in Islam.',
        subjectTradition: 'ISLAMIC',
        conceptSlug: 'prophethood',
        options: [
          { text: 'Ibrahim', isCorrect: true, tradition: 'ISLAMIC' },
          { text: 'Avraham', tradition: 'JEWISH', rationale: 'This is the Hebrew form used in Jewish tradition.' },
          { text: 'Isa', rationale: 'Isa is the Arabic name for Jesus.' },
          { text: 'Musa', rationale: 'Musa is the Arabic name for Moses.' },
        ],
      },
      {
        kind: 'DIVERGENCE_MAP',
        prompt: 'In the near-sacrifice of Abraham\'s son, which son does each tradition identify?',
        explanation:
          'Jewish and Christian scripture name Isaac (Genesis 22). Islamic tradition predominantly identifies Ishmael, though the Quran does not name the son explicitly and some early Muslim commentators said Isaac. This is a genuine divergence, not an error by any side.',
        comparisonSlug: 'akedah-which-son',
        options: [
          { text: 'Judaism: Isaac', isCorrect: true, tradition: 'JEWISH', presence: 'AFFIRMED' },
          { text: 'Christianity: Isaac', isCorrect: true, tradition: 'CHRISTIAN', presence: 'AFFIRMED' },
          { text: 'Islam: predominantly Ishmael', isCorrect: true, tradition: 'ISLAMIC', presence: 'MODIFIED' },
        ],
      },
    ],
  },
  {
    slug: 'prophets-and-revelation',
    title: 'Prophets and revelation',
    summary:
      'Each tradition believes God has spoken to humanity — but they differ on who the prophets were, when revelation ended, and what counts as scripture.',
    items: [
      { kind: 'CONCEPT', slug: 'prophethood' },
      { kind: 'THEME', slug: 'revelation' },
      { kind: 'THEME', slug: 'prophecy' },
      { kind: 'COMPARISON', slug: 'the-future-prophet-deuteronomy-18' },
      { kind: 'FIGURE', slug: 'moses' },
      { kind: 'FIGURE', slug: 'muhammad' },
    ],
    questions: [
      {
        kind: 'TRADITION_TEACHING',
        prompt: 'What does Islam teach about Muhammad\'s place in the line of prophets?',
        explanation:
          'Islam regards Muhammad as the Seal of the Prophets — the final messenger in a line including Abraham, Moses and Jesus, after whom no further prophet comes.',
        subjectTradition: 'ISLAMIC',
        conceptSlug: 'prophethood',
        options: [
          { text: 'The final prophet, sealing a line that includes Moses and Jesus', isCorrect: true, tradition: 'ISLAMIC' },
          { text: 'The first prophet God ever sent', rationale: 'Islam holds that prophets were sent to every nation, beginning with Adam.' },
          { text: 'A prophet whose message replaced belief in earlier prophets', rationale: 'Islam requires belief in the earlier prophets, not their rejection.' },
          { text: 'A teacher who made no prophetic claim', rationale: 'Prophethood is central to how Islam understands Muhammad.' },
        ],
      },
      {
        kind: 'TRADITION_TEACHING',
        prompt: 'In Jewish tradition, what status does Moses hold among the prophets?',
        explanation:
          'Jewish tradition regards Moses as the greatest of the prophets, uniquely receiving the Torah and, as Deuteronomy 34:10 puts it, known by God face to face.',
        subjectTradition: 'JEWISH',
        conceptSlug: 'prophethood',
        options: [
          { text: 'The greatest prophet, who received the Torah directly', isCorrect: true, tradition: 'JEWISH' },
          { text: 'One prophet among many, with no special rank', rationale: 'Jewish tradition consistently gives Moses a unique standing.' },
          { text: 'A prophet later superseded by a final messenger', tradition: 'ISLAMIC', rationale: 'This reflects the Islamic framing of prophetic succession, not the Jewish one.' },
          { text: 'A priest rather than a prophet', rationale: 'That role belongs to his brother Aaron.' },
        ],
      },
    ],
  },
  {
    slug: 'law-and-practice',
    title: 'Law and practice',
    summary:
      'Belief becomes visible in practice — food, rest, fasting, charity. Here the traditions often agree on the principle and differ sharply on the detail.',
    items: [
      { kind: 'THEME', slug: 'law' },
      { kind: 'CONCEPT', slug: 'dietary-laws' },
      { kind: 'COMPARISON', slug: 'sabbath-day-of-rest' },
      { kind: 'COMPARISON', slug: 'fasting-across-traditions' },
      { kind: 'COMPARISON', slug: 'charity-care-for-the-poor' },
      { kind: 'COMPARISON', slug: 'ten-commandments-moral-law' },
    ],
    questions: [
      {
        kind: 'DIVERGENCE_MAP',
        prompt: 'Which traditions maintain binding dietary restrictions on their adherents?',
        explanation:
          'Judaism maintains kashrut and Islam maintains halal rules, both binding. Mainstream Christianity generally regards the Mosaic food laws as not binding, following Acts 10 and Mark 7, though some churches retain practices.',
        comparisonSlug: 'dietary-laws',
        options: [
          { text: 'Judaism: yes, kashrut', isCorrect: true, tradition: 'JEWISH', presence: 'AFFIRMED' },
          { text: 'Christianity: generally not binding', isCorrect: true, tradition: 'CHRISTIAN', presence: 'MODIFIED' },
          { text: 'Islam: yes, halal', isCorrect: true, tradition: 'ISLAMIC', presence: 'AFFIRMED' },
        ],
      },
      {
        kind: 'TRADITION_TEACHING',
        prompt: 'In Judaism, when is the Sabbath observed?',
        explanation:
          'The Jewish Sabbath runs from sunset on Friday to nightfall on Saturday, the seventh day, per Genesis 2 and Exodus 20.',
        subjectTradition: 'JEWISH',
        comparisonSlug: 'sabbath-day-of-rest',
        options: [
          { text: 'From Friday sunset to Saturday nightfall', isCorrect: true, tradition: 'JEWISH' },
          { text: 'On Sunday, the first day of the week', tradition: 'CHRISTIAN', rationale: 'Most Christians observe Sunday, a different day from the Jewish Sabbath.' },
          { text: 'On Friday at midday', tradition: 'ISLAMIC', rationale: 'Friday congregational prayer (jumu\'ah) is an Islamic practice, and is not a Sabbath rest in the Jewish sense.' },
          { text: 'On the first day of each lunar month', rationale: 'This describes Rosh Chodesh, not the Sabbath.' },
        ],
      },
    ],
  },
  {
    slug: 'jesus-across-the-traditions',
    title: 'Jesus across the traditions',
    summary:
      'No figure divides these traditions more. All three have a position on Jesus, and those positions cannot all be true at once — so this chapter reports what each tradition teaches rather than adjudicating between them.',
    items: [
      { kind: 'FIGURE', slug: 'jesus' },
      { kind: 'COMPARISON', slug: 'the-virgin-birth' },
      { kind: 'COMPARISON', slug: 'was-jesus-crucified', note: 'A genuine contradiction. Each tradition is presented in its own terms.' },
      { kind: 'CONCEPT', slug: 'crucifixion-of-jesus' },
      { kind: 'COMPARISON', slug: 'the-messiah-prophecy' },
    ],
    questions: [
      {
        kind: 'DIVERGENCE_MAP',
        prompt: 'What position does each tradition take on the crucifixion of Jesus?',
        explanation:
          'Christianity affirms the crucifixion as central to its faith. Islam denies that Jesus died on the cross, holding that it was made to appear so (Quran 4:157). Judaism does not treat the event as theologically significant and makes no doctrinal claim about it.',
        comparisonSlug: 'was-jesus-crucified',
        options: [
          { text: 'Judaism: no doctrinal position on the event', isCorrect: true, tradition: 'JEWISH', presence: 'SILENT' },
          { text: 'Christianity: affirms it as central to salvation', isCorrect: true, tradition: 'CHRISTIAN', presence: 'AFFIRMED' },
          { text: 'Islam: denies he died on the cross', isCorrect: true, tradition: 'ISLAMIC', presence: 'REJECTED' },
        ],
      },
      {
        kind: 'TRADITION_TEACHING',
        prompt: 'What does Islam teach about the birth of Jesus (Isa)?',
        explanation:
          'The Quran affirms the virgin birth: Maryam conceives Isa without a father by God\'s command (Quran 19:20-21). Islam holds this as a miracle, while rejecting that it makes Jesus divine.',
        subjectTradition: 'ISLAMIC',
        comparisonSlug: 'the-virgin-birth',
        options: [
          { text: 'A virgin birth by God\'s command, but not implying divinity', isCorrect: true, tradition: 'ISLAMIC' },
          { text: 'A virgin birth establishing him as the Son of God', tradition: 'CHRISTIAN', rationale: 'The virgin birth is affirmed in Islam, but divine sonship is explicitly rejected.' },
          { text: 'An ordinary birth to two human parents', rationale: 'The Quran describes the birth as miraculous.' },
          { text: 'That he was never born as a human being', rationale: 'Islam holds Isa to be a human prophet, born of Maryam.' },
        ],
      },
    ],
  },
]

export async function seedCourses(prisma: PrismaClient) {
  const course = await prisma.course.upsert({
    where: { slug: 'foundations' },
    update: {
      title: 'Foundations',
      subtitle: 'A guided path through the three traditions',
      description:
        'Five short chapters covering where Judaism, Christianity and Islam agree, where they diverge, and why. Each chapter ends with a few questions. Nothing here asks which tradition is right — the questions ask what each tradition teaches.',
      position: 0,
      isPublished: true,
    },
    create: {
      slug: 'foundations',
      title: 'Foundations',
      subtitle: 'A guided path through the three traditions',
      description:
        'Five short chapters covering where Judaism, Christianity and Islam agree, where they diverge, and why. Each chapter ends with a few questions. Nothing here asks which tradition is right — the questions ask what each tradition teaches.',
      position: 0,
      isPublished: true,
    },
  })

  // Resolve the entities the chapters reference, once.
  const [concepts, comparisons, figures, themes] = await Promise.all([
    prisma.concept.findMany({ select: { id: true, slug: true } }),
    prisma.comparison.findMany({ select: { id: true, slug: true, tag: true, isControversial: true } }),
    prisma.figure.findMany({ select: { id: true, slug: true } }),
    prisma.theme.findMany({ select: { id: true, slug: true } }),
  ])
  const conceptBySlug = new Map(concepts.map((c) => [c.slug, c]))
  const comparisonBySlug = new Map(comparisons.map((c) => [c.slug, c]))
  const figureBySlug = new Map(figures.map((f) => [f.slug, f]))
  const themeBySlug = new Map(themes.map((t) => [t.slug, t]))

  const missing: string[] = []
  let chapterPosition = 0

  for (const spec of CHAPTERS) {
    const chapter = await prisma.chapter.upsert({
      where: { slug: spec.slug },
      update: {
        courseId: course.id,
        title: spec.title,
        summary: spec.summary,
        position: chapterPosition,
        isPublished: true,
        neutralityReviewedAt: new Date(),
        neutralityReviewNote: 'Seed content: every question is attributive by construction.',
      },
      create: {
        courseId: course.id,
        slug: spec.slug,
        title: spec.title,
        summary: spec.summary,
        position: chapterPosition,
        isPublished: true,
        neutralityReviewedAt: new Date(),
        neutralityReviewNote: 'Seed content: every question is attributive by construction.',
      },
    })
    chapterPosition += 1

    // Rebuild only the rows this seed owns, matched by their own identifying
    // content. A blanket deleteMany on the chapter would also destroy
    // questions an editor approved through the admin queue and items they
    // curated by hand — re-seeding must never silently undo editorial work.
    const seededPrompts = spec.questions.map((q) => q.prompt)
    if (seededPrompts.length > 0) {
      await prisma.question.deleteMany({
        where: { chapterId: chapter.id, prompt: { in: seededPrompts } },
      })
    }

    const seededItemRefs = spec.items
      .map((item) => {
        const entity =
          item.kind === 'CONCEPT' ? conceptBySlug.get(item.slug)
          : item.kind === 'COMPARISON' ? comparisonBySlug.get(item.slug)
          : item.kind === 'FIGURE' ? figureBySlug.get(item.slug)
          : themeBySlug.get(item.slug)
        if (!entity) return null
        return {
          itemType: item.kind,
          conceptId: item.kind === 'CONCEPT' ? entity.id : null,
          comparisonId: item.kind === 'COMPARISON' ? entity.id : null,
          figureId: item.kind === 'FIGURE' ? entity.id : null,
          themeId: item.kind === 'THEME' ? entity.id : null,
        }
      })
      .filter((ref): ref is NonNullable<typeof ref> => ref !== null)

    if (seededItemRefs.length > 0) {
      await prisma.chapterItem.deleteMany({
        where: { chapterId: chapter.id, OR: seededItemRefs },
      })
    }

    let itemPosition = 0
    for (const item of spec.items) {
      const entity =
        item.kind === 'CONCEPT' ? conceptBySlug.get(item.slug)
        : item.kind === 'COMPARISON' ? comparisonBySlug.get(item.slug)
        : item.kind === 'FIGURE' ? figureBySlug.get(item.slug)
        : themeBySlug.get(item.slug)

      if (!entity) {
        missing.push(`${spec.slug}: ${item.kind} "${item.slug}"`)
        continue
      }

      await prisma.chapterItem.create({
        data: {
          chapterId: chapter.id,
          itemType: item.kind,
          position: itemPosition,
          note: item.note,
          conceptId: item.kind === 'CONCEPT' ? entity.id : null,
          comparisonId: item.kind === 'COMPARISON' ? entity.id : null,
          figureId: item.kind === 'FIGURE' ? entity.id : null,
          themeId: item.kind === 'THEME' ? entity.id : null,
        },
      })
      itemPosition += 1
    }

    let questionPosition = 0
    for (const q of spec.questions) {
      const concept = q.conceptSlug ? conceptBySlug.get(q.conceptSlug) : undefined
      const comparison = q.comparisonSlug ? comparisonBySlug.get(q.comparisonSlug) : undefined

      if (q.conceptSlug && !concept) { missing.push(`${spec.slug}: question concept "${q.conceptSlug}"`); continue }
      if (q.comparisonSlug && !comparison) { missing.push(`${spec.slug}: question comparison "${q.comparisonSlug}"`); continue }

      // Contested is derived from the source, never hand-set.
      const isContested = comparison
        ? comparison.isControversial || comparison.tag === 'CONTRADICTION'
        : false

      await prisma.question.create({
        data: {
          chapterId: chapter.id,
          kind: q.kind,
          format: q.kind === 'DIVERGENCE_MAP' ? 'MULTI_SELECT' : 'SINGLE_CHOICE',
          position: questionPosition,
          prompt: q.prompt,
          explanation: q.explanation,
          subjectTradition: q.subjectTradition ?? null,
          isPublished: true,
          isContested,
          sourceType: comparison ? 'COMPARISON' : 'CONCEPT',
          conceptId: comparison ? null : concept!.id,
          comparisonId: comparison ? comparison.id : null,
          neutralityReviewedAt: new Date(),
          options: {
            create: q.options.map((o, index) => ({
              text: o.text,
              isCorrect: o.isCorrect ?? false,
              position: index,
              optionTradition: o.tradition ?? null,
              presence: o.presence ?? null,
              rationale: o.rationale ?? null,
            })),
          },
        },
      })
      questionPosition += 1
    }
  }

  const counts = await Promise.all([
    prisma.chapter.count({ where: { courseId: course.id } }),
    prisma.chapterItem.count(),
    prisma.question.count(),
  ])
  console.log(`  ✓ Course "${course.slug}": ${counts[0]} chapters, ${counts[1]} items, ${counts[2]} questions`)

  if (missing.length > 0) {
    // Loud, because a silently-skipped reference produces a thin chapter that
    // still looks fine — the same failure mode as seed/legacy.ts.
    console.warn(`  ⚠ ${missing.length} unresolved reference(s):`)
    for (const m of missing) console.warn(`      - ${m}`)
  }
}
