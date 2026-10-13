import type { PrismaClient, Tradition, TraditionPresence } from '@/generated/prisma/client'

const ART = {
  artworkPath: '/timeline/patriarchal.jpg',
  artworkAlt: 'Illustrated ancient desert encampment beneath a field of stars',
  artworkCredit: 'Abrahamic Texts project artwork',
  artworkSourceUrl: '/licensing',
  artworkLicense: 'PROJECT',
}

type Item =
  | { kind: 'FIGURE'; slug: string; note: string }
  | { kind: 'COMPARISON'; slug: string; note: string }
  | { kind: 'VERSE'; referenceKey: string; note: string }

type Question = {
  prompt: string
  explanation: string
  comparisonSlug: string
  subjectTradition?: Tradition
  options: { text: string; correct?: boolean; tradition?: Tradition; presence?: TraditionPresence; rationale?: string }[]
}

type Step = {
  slug: string
  title: string
  summary: string
  objective: string
  takeaway: string
  minutes: number
  items: Item[]
  questions?: Question[]
}

const STEPS: Step[] = [
  {
    slug: 'journey-abraham-meet', title: 'Meet Abraham', minutes: 2,
    summary: 'Begin with the shared figure called Avraham, Abraham, and Ibrahim, and see why all three traditions remember him.',
    objective: 'Recognise Abraham as a shared figure while keeping each tradition’s account distinct.',
    takeaway: 'The traditions share Abraham as a central ancestor and model of faith, but they develop his significance differently.',
    items: [
      { kind: 'FIGURE', slug: 'abraham', note: 'Start with the names and roles attributed to Abraham in each tradition.' },
      { kind: 'VERSE', referenceKey: 'TORAH.Genesis.12.1', note: 'In the Torah, Abram is called to leave his land and household.' },
      { kind: 'COMPARISON', slug: 'abrahams-call', note: 'Now compare how the three traditions remember that call.' },
    ],
  },
  {
    slug: 'journey-abraham-judaism', title: 'Avraham in Judaism', minutes: 2,
    summary: 'Explore covenant, land, descendants, circumcision, and Abraham’s place in Jewish memory.',
    objective: 'Describe the Jewish account of Abraham’s covenant without importing later Christian or Islamic interpretations.',
    takeaway: 'In Judaism, Avraham is the first patriarch and the recipient of a covenant carried through Isaac and Jacob.',
    items: [
      { kind: 'VERSE', referenceKey: 'TORAH.Genesis.17.7', note: 'The Torah describes an everlasting covenant with Abraham and his descendants.' },
      { kind: 'COMPARISON', slug: 'abrahams-covenant', note: 'Read the Jewish position first; comparison comes after it is clear.' },
      { kind: 'COMPARISON', slug: 'circumcision-sign-covenant', note: 'Brit milah remains the embodied sign of this covenant in Jewish practice.' },
    ],
  },
  {
    slug: 'journey-abraham-christianity', title: 'Abraham in Christianity', minutes: 2,
    summary: 'See how the New Testament presents Abraham as an example of faith and reads the promise through Christ.',
    objective: 'Identify the specifically Christian interpretation of Abraham in Paul’s letters.',
    takeaway: 'Christianity retains the scriptural Abraham and interprets inheritance of the promise through faith in Christ.',
    items: [
      { kind: 'VERSE', referenceKey: 'NEW_TESTAMENT.Romans.4.13', note: 'Paul connects Abraham’s promise with righteousness through faith.' },
      { kind: 'VERSE', referenceKey: 'NEW_TESTAMENT.Galatians.3.6', note: 'Paul presents Abraham’s belief as counted for righteousness.' },
      { kind: 'COMPARISON', slug: 'abrahams-covenant', note: 'Compare this reading only after seeing its New Testament basis.' },
    ],
  },
  {
    slug: 'journey-abraham-islam', title: 'Ibrahim in Islam', minutes: 2,
    summary: 'Meet Ibrahim as prophet, hanif, friend of God, leader, and model of submission in the Quran and Islamic tradition.',
    objective: 'Explain Ibrahim’s Quranic identity in explicitly Islamic terms.',
    takeaway: 'In Islam, Ibrahim is a prophet of pure monotheism whose submission, family, and connection to the Kaaba are foundational.',
    items: [
      { kind: 'VERSE', referenceKey: 'QURAN.Al-Baqarah.2.124', note: 'The Quran presents Ibrahim as tested by God and appointed as a leader for people.' },
      { kind: 'COMPARISON', slug: 'abrahams-call', note: 'Compare the Islamic account with the earlier scriptural traditions.' },
    ],
  },
  {
    slug: 'journey-abraham-distinct', title: 'One figure, distinct traditions', minutes: 2,
    summary: 'Place the traditions side by side without flattening their disagreements about covenant, lineage, and sacrifice.',
    objective: 'Distinguish shared narrative from tradition-specific interpretation and genuine contradiction.',
    takeaway: 'Similarity does not mean sameness: covenant lineage and the near-sacrifice are important points of divergence.',
    items: [
      { kind: 'FIGURE', slug: 'isaac', note: 'Isaac is covenant heir in Judaism and Christianity and an honoured prophet in Islam.' },
      { kind: 'FIGURE', slug: 'ishmael', note: 'Ishmael’s role and lineage receive different emphasis across the traditions.' },
      { kind: 'COMPARISON', slug: 'akedah-which-son', note: 'This comparison names the disagreement and the Quran’s textual ambiguity directly.' },
    ],
  },
  {
    slug: 'journey-abraham-review', title: 'Review the evidence', minutes: 3,
    summary: 'Check what you learned with five sourced questions. The quiz asks what each tradition teaches, never which is right.',
    objective: 'Recall the attributed positions and locate their supporting evidence.',
    takeaway: 'You can now recognise both the shared Abrahamic inheritance and the places where the traditions make distinct claims.',
    items: [
      { kind: 'COMPARISON', slug: 'abrahams-call', note: 'Review the shared call before the quiz.' },
      { kind: 'COMPARISON', slug: 'abrahams-covenant', note: 'Review how the covenant’s scope is interpreted differently.' },
      { kind: 'COMPARISON', slug: 'akedah-which-son', note: 'Review the principal divergence around the near-sacrifice.' },
    ],
    questions: [
      { prompt: 'What name is Abraham given in Islamic tradition?', explanation: 'Ibrahim is the Arabic and Quranic form of Abraham’s name.', comparisonSlug: 'abrahams-call', subjectTradition: 'ISLAMIC', options: [{ text: 'Ibrahim', correct: true, tradition: 'ISLAMIC' }, { text: 'Musa' }, { text: 'Isa' }, { text: 'Dawud' }] },
      { prompt: 'According to Judaism, through whom does the covenant lineage continue?', explanation: 'The Torah presents Isaac, and then Jacob, as the covenant lineage.', comparisonSlug: 'abrahams-covenant', subjectTradition: 'JEWISH', options: [{ text: 'Isaac and Jacob', correct: true, tradition: 'JEWISH' }, { text: 'Ishmael alone' }, { text: 'Paul' }, { text: 'Muhammad' }] },
      { prompt: 'How does Paul use Abraham in Christian teaching?', explanation: 'Paul presents Abraham as a model and father of those justified by faith.', comparisonSlug: 'abrahams-covenant', subjectTradition: 'CHRISTIAN', options: [{ text: 'As a model and father of faith', correct: true, tradition: 'CHRISTIAN' }, { text: 'As the final prophet' }, { text: 'As a Roman ruler' }, { text: 'As an opponent of faith' }] },
      { prompt: 'How does the Quran describe Ibrahim in Quran 3:67?', explanation: 'The verse calls Ibrahim a hanif and one who submitted to God, not a Jew or Christian.', comparisonSlug: 'abrahams-call', subjectTradition: 'ISLAMIC', options: [{ text: 'A hanif who submitted to God', correct: true, tradition: 'ISLAMIC' }, { text: 'A Christian bishop' }, { text: 'An Israelite king' }, { text: 'A Roman priest' }] },
      { prompt: 'How do the traditions identify the son in the near-sacrifice?', explanation: 'Genesis explicitly names Isaac. The Quran does not name the son; most later Islamic tradition identifies Ishmael.', comparisonSlug: 'akedah-which-son', options: [{ text: 'Judaism: Isaac', correct: true, tradition: 'JEWISH', presence: 'AFFIRMED' }, { text: 'Christianity: Isaac', correct: true, tradition: 'CHRISTIAN', presence: 'AFFIRMED' }, { text: 'Islam: Quran unnamed; predominantly Ishmael in later tradition', correct: true, tradition: 'ISLAMIC', presence: 'MODIFIED' }] },
    ],
  },
]

export async function seedJourneys(prisma: PrismaClient) {
  await prisma.course.updateMany({ where: { slug: 'foundations' }, data: { position: 1 } })
  const course = await prisma.course.upsert({
    where: { slug: 'abraham-across-traditions' },
    update: { title: 'Abraham Across Traditions', subtitle: 'One shared figure, three distinct traditions', description: 'A beginner-friendly journey through Avraham, Abraham, and Ibrahim—presenting each tradition in its own voice before comparing them.', position: 0, isPublished: true, estimatedMinutes: 13, ...ART },
    create: { slug: 'abraham-across-traditions', title: 'Abraham Across Traditions', subtitle: 'One shared figure, three distinct traditions', description: 'A beginner-friendly journey through Avraham, Abraham, and Ibrahim—presenting each tradition in its own voice before comparing them.', position: 0, isPublished: true, estimatedMinutes: 13, ...ART },
  })

  const [figures, comparisons, verses] = await Promise.all([
    prisma.figure.findMany({ select: { id: true, slug: true } }),
    prisma.comparison.findMany({ select: { id: true, slug: true, tag: true, isControversial: true } }),
    prisma.verse.findMany({ where: { referenceKey: { in: STEPS.flatMap((s) => s.items.flatMap((i) => i.kind === 'VERSE' ? [i.referenceKey] : [])) } }, select: { id: true, referenceKey: true } }),
  ])
  const figureBySlug = new Map(figures.map((x) => [x.slug, x]))
  const comparisonBySlug = new Map(comparisons.map((x) => [x.slug, x]))
  const verseByKey = new Map(verses.map((x) => [x.referenceKey, x]))
  const missing: string[] = []

  for (const [position, spec] of STEPS.entries()) {
    const chapter = await prisma.chapter.upsert({
      where: { slug: spec.slug },
      update: { courseId: course.id, title: spec.title, summary: spec.summary, position, isPublished: true, estimatedMinutes: spec.minutes, learningObjective: spec.objective, takeaway: spec.takeaway, neutralityReviewedAt: new Date(), neutralityReviewNote: 'Journey seed: tradition-specific claims are attributed and every comparison is sourced.', ...ART },
      create: { courseId: course.id, slug: spec.slug, title: spec.title, summary: spec.summary, position, isPublished: true, estimatedMinutes: spec.minutes, learningObjective: spec.objective, takeaway: spec.takeaway, neutralityReviewedAt: new Date(), neutralityReviewNote: 'Journey seed: tradition-specific claims are attributed and every comparison is sourced.', ...ART },
    })
    await prisma.chapterItem.deleteMany({ where: { chapterId: chapter.id } })
    await prisma.question.deleteMany({ where: { chapterId: chapter.id } })

    for (const [itemPosition, item] of spec.items.entries()) {
      const figure = item.kind === 'FIGURE' ? figureBySlug.get(item.slug) : undefined
      const comparison = item.kind === 'COMPARISON' ? comparisonBySlug.get(item.slug) : undefined
      const verse = item.kind === 'VERSE' ? verseByKey.get(item.referenceKey) : undefined
      if (!figure && !comparison && !verse) { missing.push(`${spec.slug}: ${item.kind}`); continue }
      await prisma.chapterItem.create({ data: { chapterId: chapter.id, itemType: item.kind, position: itemPosition, note: item.note, figureId: figure?.id, comparisonId: comparison?.id, verseId: verse?.id } })
    }

    for (const [questionPosition, q] of (spec.questions ?? []).entries()) {
      const comparison = comparisonBySlug.get(q.comparisonSlug)
      if (!comparison) { missing.push(`${spec.slug}: comparison ${q.comparisonSlug}`); continue }
      const divergence = q.options.every((o) => o.correct)
      await prisma.question.create({ data: { chapterId: chapter.id, kind: divergence ? 'DIVERGENCE_MAP' : q.subjectTradition ? 'TRADITION_TEACHING' : 'SOURCE_TEXT', format: divergence ? 'MULTI_SELECT' : 'SINGLE_CHOICE', difficulty: 'INTRO', position: questionPosition, prompt: q.prompt, explanation: q.explanation, subjectTradition: q.subjectTradition, isPublished: true, isContested: comparison.isControversial || comparison.tag === 'CONTRADICTION', sourceType: 'COMPARISON', comparisonId: comparison.id, neutralityReviewedAt: new Date(), options: { create: q.options.map((o, i) => ({ text: o.text, isCorrect: o.correct ?? false, position: i, optionTradition: o.tradition, presence: o.presence, rationale: o.rationale })) } } })
    }
  }

  if (missing.length) throw new Error(`Journey seed has unresolved references: ${missing.join(', ')}`)
  console.log(`  ✓ Journey "${course.slug}": ${STEPS.length} steps`)
}
