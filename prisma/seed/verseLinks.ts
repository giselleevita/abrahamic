import type { PrismaClient } from '@prisma/client'

type VerseLinkData = {
  refA: string
  refB: string
  linkType: 'PARALLEL' | 'CONTRAST' | 'ELABORATION' | 'FULFILLMENT_CLAIM'
  notes?: string
}

// Each link connects two verses by their referenceKey (SOURCE.Book.Chapter.Verse).
// Notes are editorial — neutral, descriptive, not evaluative.
const verseLinkData: VerseLinkData[] = [

  // ── CREATION ──────────────────────────────────────────────────────────────
  {
    refA: 'TORAH.Genesis.1.1',
    refB: 'NEW_TESTAMENT.John.1.1',
    linkType: 'PARALLEL',
    notes: 'Both open with the phrase "In the beginning" and describe divine creative agency. Christianity reads John 1:1 as identifying the Logos (Word) with God, co-present at creation. Judaism reads Genesis 1:1 without a pre-existent mediating agent.',
  },
  {
    refA: 'TORAH.Genesis.2.7',
    refB: 'QURAN.Maryam.19.16',
    linkType: 'PARALLEL',
    notes: 'Genesis describes the creation of Adam from dust and the divine breath of life. The Quran uses similar language across multiple surahs (e.g. 15:29, 38:72). Both traditions affirm the unique divine act in human creation.',
  },
  {
    refA: 'TORAH.Genesis.1.1',
    refB: 'QURAN.Al-Baqarah.2.255',
    linkType: 'ELABORATION',
    notes: 'Genesis 1:1 asserts God as creator of heaven and earth. Ayat al-Kursi (2:255) elaborates the nature of that Creator — eternal, self-sustaining, all-knowing — without contradiction but with additional theological detail.',
  },

  // ── ONENESS OF GOD / SHEMA ────────────────────────────────────────────────
  {
    refA: 'TORAH.Deuteronomy.6.4',
    refB: 'QURAN.Al-Ikhlas.112.1',
    linkType: 'PARALLEL',
    notes: 'The Shema ("The LORD is One") and Al-Ikhlas ("He is Allah, the One") are the central monotheism declarations of Judaism and Islam respectively. Both are recited daily and treated as foundational creedal statements.',
  },
  {
    refA: 'TORAH.Deuteronomy.6.4',
    refB: 'QURAN.Al-Ikhlas.112.3',
    linkType: 'CONTRAST',
    notes: '"He neither begets nor is born" (Q 112:3) is widely read in Islamic tradition as a direct rebuttal to Christian theology of the Son of God. The Shema does not contain this clause; Jewish monotheism affirms divine unity without the polemical context present in Al-Ikhlas.',
  },
  {
    refA: 'TORAH.Deuteronomy.6.4',
    refB: 'NEW_TESTAMENT.Matthew.22.37',
    linkType: 'FULFILLMENT_CLAIM',
    notes: 'Matthew 22:37 quotes Deuteronomy 6:4-5 directly ("Love the Lord your God...") as the greatest commandment. Christianity presents Jesus as affirming and summarising the Torah, not replacing it.',
  },

  // ── LOVE YOUR NEIGHBOUR ───────────────────────────────────────────────────
  {
    refA: 'TORAH.Leviticus.19.18',
    refB: 'NEW_TESTAMENT.Matthew.22.39',
    linkType: 'FULFILLMENT_CLAIM',
    notes: 'Matthew 22:39 quotes Leviticus 19:18 verbatim as the second-greatest commandment. Christianity presents this as Jesus affirming the core ethical content of the Torah. The quote is direct and unmodified.',
  },
  {
    refA: 'TORAH.Leviticus.19.18',
    refB: 'QURAN.An-Nisa.4.36',
    linkType: 'PARALLEL',
    notes: 'Both texts extend ethical obligation to neighbours, the poor, and travellers. The Quran does not quote Leviticus but the ethical structure — worship God, then care for kin, strangers, and the needy — closely parallels it.',
  },
  {
    refA: 'NEW_TESTAMENT.Matthew.7.12',
    refB: 'QURAN.An-Nahl.16.90',
    linkType: 'PARALLEL',
    notes: 'The Golden Rule (Matthew 7:12) and Q 16:90 ("Allah commands justice and good conduct") express similar ethical structures. Both ground ethical behaviour in divine command rather than social contract.',
  },

  // ── FASTING ───────────────────────────────────────────────────────────────
  {
    refA: 'TORAH.Leviticus.16.29',
    refB: 'QURAN.Al-Baqarah.2.183',
    linkType: 'PARALLEL',
    notes: 'Leviticus 16:29 prescribes fasting on Yom Kippur; Q 2:183 prescribes Ramadan, explicitly noting fasting "as it was prescribed to those before you." The Quran directly acknowledges the continuity of fasting as a shared Abrahamic practice.',
  },
  {
    refA: 'TORAH.Leviticus.16.29',
    refB: 'NEW_TESTAMENT.Matthew.6.16',
    linkType: 'ELABORATION',
    notes: 'Matthew 6:16 addresses the manner of fasting rather than its prescription, warning against public display. This builds on the assumed practice of fasting (inherited from Leviticus) while redirecting its intent toward sincerity.',
  },

  // ── PRAYER / CHARITY ──────────────────────────────────────────────────────
  {
    refA: 'QURAN.Al-Baqarah.2.43',
    refB: 'NEW_TESTAMENT.Matthew.6.3',
    linkType: 'PARALLEL',
    notes: 'Both instruct giving to the poor as a religious duty (zakat / almsgiving). Matthew 6:3 focuses on the sincerity of the giver; Q 2:43 frames it as an obligation alongside prayer.',
  },
  {
    refA: 'QURAN.Al-Jumua.62.9',
    refB: 'TORAH.Exodus.20.8',
    linkType: 'PARALLEL',
    notes: 'The Sabbath commandment (Exodus 20:8) and the Jumu\'ah obligation (Q 62:9) both establish a weekly communal pause for divine remembrance. The day differs (Saturday vs. Friday) and the mechanism differs, but the structural parallel is widely noted.',
  },

  // ── COVENANT WITH ABRAHAM ─────────────────────────────────────────────────
  {
    refA: 'TORAH.Genesis.17.7',
    refB: 'QURAN.Al-Baqarah.2.124',
    linkType: 'PARALLEL',
    notes: 'Genesis 17:7 establishes the Abrahamic covenant — Abraham as leader of nations, God as his God. Q 2:124 independently describes God appointing Abraham as an Imam (leader) to the nations. Both texts make Abraham the prototype of the faithful leader.',
  },
  {
    refA: 'TORAH.Genesis.17.7',
    refB: 'NEW_TESTAMENT.Romans.4.13',
    linkType: 'ELABORATION',
    notes: 'Romans 4:13 reinterprets the Abrahamic covenant: the promise came "not through the law but through the righteousness of faith." Paul argues the covenant predates circumcision, making Abraham the father of all believers regardless of ethnicity.',
  },
  {
    refA: 'TORAH.Genesis.17.10',
    refB: 'QURAN.Al-Baqarah.2.124',
    linkType: 'CONTRAST',
    notes: 'Genesis 17:10 makes circumcision the sign of the covenant for all male descendants. The Quran\'s parallel account of Abraham (2:124) makes no mention of circumcision as a covenant sign, though circumcision is practiced in Islam via Sunnah tradition.',
  },

  // ── THE AKEDAH / SACRIFICE OF ABRAHAM'S SON ───────────────────────────────
  {
    refA: 'TORAH.Genesis.22.2',
    refB: 'QURAN.Al-Baqarah.2.124',
    linkType: 'PARALLEL',
    notes: 'Both texts present God testing Abraham with an extreme command. Genesis 22:2 specifies Isaac; Islamic tradition (majority view) holds the son was Ishmael. This is one of the most discussed points of divergence across the Abrahamic traditions.',
  },

  // ── DIETARY LAWS ─────────────────────────────────────────────────────────
  {
    refA: 'TORAH.Leviticus.11.3',
    refB: 'QURAN.Al-Baqarah.2.173',
    linkType: 'PARALLEL',
    notes: 'Both texts impose dietary restrictions on grounds of divine command. Leviticus details permitted/forbidden animal categories; Q 2:173 prohibits dead meat, blood, pork, and animals dedicated to other deities. Pork is forbidden in both; other categories differ.',
  },
  {
    refA: 'TORAH.Leviticus.11.3',
    refB: 'NEW_TESTAMENT.Mark.7.19',
    linkType: 'CONTRAST',
    notes: 'Mark 7:19 records Jesus as "declaring all foods clean," which the majority Christian tradition reads as nullifying the Levitical dietary laws. This is a clear textual contrast: Leviticus mandates the laws, Mark reports their abrogation.',
  },

  // ── SABBATH ───────────────────────────────────────────────────────────────
  {
    refA: 'TORAH.Exodus.20.8',
    refB: 'NEW_TESTAMENT.Mark.2.27',
    linkType: 'CONTRAST',
    notes: 'The Sabbath commandment is unconditional in Exodus. Mark 2:27 ("The Sabbath was made for man, not man for the Sabbath") reframes the commandment as purposive rather than absolute, reflecting a shift in Christian hermeneutics of the Torah.',
  },

  // ── DIVINE NAME / I AM ────────────────────────────────────────────────────
  {
    refA: 'TORAH.Exodus.3.14',
    refB: 'NEW_TESTAMENT.John.1.1',
    linkType: 'ELABORATION',
    notes: 'The divine name "I AM" (Ehyeh Asher Ehyeh) in Exodus 3:14 establishes eternal self-existence as the divine nature. John 1:1 ("the Word was God") is read by Christianity as extending this self-existent nature to the Logos. Islam affirms divine self-existence (Q 2:255) without identifying it with a mediating Word.',
  },

  // ── MARY / ANNUNCIATION ───────────────────────────────────────────────────
  {
    refA: 'NEW_TESTAMENT.Luke.1.35',
    refB: 'QURAN.Maryam.19.19',
    linkType: 'PARALLEL',
    notes: 'Both texts describe an angelic annunciation to Mary of a miraculous conception. Luke identifies the angel as Gabriel and describes the Holy Spirit overshadowing Mary. The Quran (Maryam 19) also describes an angelic messenger and a pure boy — the accounts share structure but differ in theological interpretation.',
  },
  {
    refA: 'NEW_TESTAMENT.Luke.1.26',
    refB: 'QURAN.Maryam.19.16',
    linkType: 'PARALLEL',
    notes: 'Both passages introduce Mary in a similar narrative register: she is in a withdrawn location when a divine messenger appears. Luke names Gabriel; the Quran names the messenger as a "spirit" (Ruh). Both traditions hold Mary in exceptional honour.',
  },
  {
    refA: 'HEBREW_BIBLE.Isaiah.7.14',
    refB: 'NEW_TESTAMENT.Matthew.1.23',
    linkType: 'FULFILLMENT_CLAIM',
    notes: 'Matthew 1:23 quotes Isaiah 7:14 directly as a prophecy fulfilled in Jesus\'s birth to a virgin ("Immanuel"). Judaism reads Isaiah 7:14 as a near-historical sign given to King Ahaz, referring to the Hebrew almah (young woman) not necessarily a virgin. This is one of the most contested fulfillment claims in Jewish–Christian dialogue.',
  },
  {
    refA: 'QURAN.Al-Imran.3.45',
    refB: 'NEW_TESTAMENT.Luke.1.35',
    linkType: 'CONTRAST',
    notes: 'Q 3:45 names Jesus the Messiah and "a Word from Him" — honoured in this world and the next. Luke 1:35 calls Jesus "Son of God." Islam affirms the messianic title and the miraculous birth; it rejects the divine sonship reading.',
  },

  // ── CRUCIFIXION ───────────────────────────────────────────────────────────
  {
    refA: 'HEBREW_BIBLE.Isaiah.53.5',
    refB: 'NEW_TESTAMENT.Matthew.16.16',
    linkType: 'FULFILLMENT_CLAIM',
    notes: 'Christianity reads Isaiah 53 as a prophecy of the suffering servant fulfilled in Jesus\'s crucifixion. Peter\'s confession (Matthew 16:16) identifies Jesus as the Christ. Judaism reads Isaiah 53 as referring to the collective suffering of Israel, not an individual messianic figure.',
  },
  {
    refA: 'HEBREW_BIBLE.Isaiah.53.3',
    refB: 'QURAN.An-Nisa.4.157',
    linkType: 'CONTRAST',
    notes: 'Isaiah 53:3 describes a suffering, rejected figure. Q 4:157 states that Jesus was not killed nor crucified — "it was made to appear so." The Quran explicitly denies the event that Christianity regards as the fulfilment of Isaiah 53.',
  },
  {
    refA: 'HEBREW_BIBLE.Psalms.22.1',
    refB: 'HEBREW_BIBLE.Isaiah.53.5',
    linkType: 'PARALLEL',
    notes: 'Both Psalm 22:1 and Isaiah 53:5 describe a figure abandoned, despised, and suffering. Christianity reads both as messianic prophecies pointing to Jesus. Jewish tradition reads Psalm 22 as a personal lament of David and Isaiah 53 as collective Israel.',
  },

  // ── PROPHET LIKE MOSES / SEAL OF PROPHETS ────────────────────────────────
  {
    refA: 'TORAH.Deuteronomy.18.15',
    refB: 'NEW_TESTAMENT.Acts.3.22',
    linkType: 'FULFILLMENT_CLAIM',
    notes: 'Acts 3:22 quotes Deuteronomy 18:15 ("A prophet like me the Lord will raise up") as a prophecy fulfilled in Jesus. Christianity applies this to Christ; Islamic tradition applies it to Muhammad.',
  },
  {
    refA: 'TORAH.Deuteronomy.18.15',
    refB: 'QURAN.Al-Ahzab.33.40',
    linkType: 'FULFILLMENT_CLAIM',
    notes: 'Islamic tradition identifies Deuteronomy 18:15 as a prophecy of Muhammad. Q 33:40 identifies Muhammad as the Seal (Khatam) of the Prophets. Jewish interpretation limits the passage to a line of Israelite prophets without messianic implications.',
  },

  // ── ENOCH / IDRIS ─────────────────────────────────────────────────────────
  {
    refA: 'TORAH.Genesis.5.24',
    refB: 'NEW_TESTAMENT.Hebrews.11.5',
    linkType: 'ELABORATION',
    notes: 'Genesis 5:24 states that Enoch "walked with God; then he was no more, for God took him." Hebrews 11:5 interprets this as Enoch being translated without dying, "by faith." The elaboration is explicit — Hebrews cites the Torah passage as its basis.',
  },
  {
    refA: 'TORAH.Genesis.5.24',
    refB: 'QURAN.Maryam.19.56',
    linkType: 'PARALLEL',
    notes: 'Genesis 5:24 and Maryam 19:56-57 both describe Enoch/Idris as a figure taken up to a high place by God. Islam identifies Idris with Enoch. Both traditions treat this figure as exceptional — taken alive or exalted — without further explanation.',
  },

  // ── NOAH'S FLOOD ─────────────────────────────────────────────────────────
  {
    refA: 'TORAH.Genesis.6.9',
    refB: 'QURAN.Hud.11.42',
    linkType: 'PARALLEL',
    notes: 'Both texts describe Noah as righteous and record the flood narrative. Genesis 6:9 calls Noah "perfect in his generations"; Q 11:42 depicts him calling his son to board the ark. The Quran\'s account diverges on Noah\'s son — who perishes by drowning — a detail absent from Genesis.',
  },

  // ── COMPULSION IN RELIGION ────────────────────────────────────────────────
  {
    refA: 'QURAN.Al-Baqarah.2.256',
    refB: 'NEW_TESTAMENT.Matthew.5.44',
    linkType: 'PARALLEL',
    notes: '"No compulsion in religion" (Q 2:256) and "love your enemies" (Matthew 5:44) both affirm a non-coercive ethical stance toward religious others. Both are invoked in contemporary interfaith dialogue as evidence of non-violent principles within each tradition.',
  },

  // ── RIGHTEOUSNESS / JUSTICE ───────────────────────────────────────────────
  {
    refA: 'QURAN.Al-Baqarah.2.177',
    refB: 'HEBREW_BIBLE.Isaiah.58.6',
    linkType: 'PARALLEL',
    notes: 'Both texts define righteousness not as ritual performance but as active care for the poor and oppressed. Isaiah 58:6 ("loose the bonds of wickedness") and Q 2:177 ("give wealth to relatives, orphans, the needy, travellers") share a prophetic critique of hollow ritual.',
  },
  {
    refA: 'QURAN.Al-Baqarah.2.177',
    refB: 'TORAH.Leviticus.19.9',
    linkType: 'PARALLEL',
    notes: 'Leviticus 19:9 (gleaning law — leaving harvest edges for the poor) and Q 2:177 (giving to orphans and travellers) both institutionalise care for the vulnerable as a religious obligation framed as divine command rather than voluntary generosity.',
  },

  // ── TEMPLE / DIVINE PRESENCE ─────────────────────────────────────────────
  {
    refA: 'TORAH.Exodus.25.8',
    refB: 'NEW_TESTAMENT.1 Corinthians.3.16',
    linkType: 'CONTRAST',
    notes: 'Exodus 25:8 commands the building of a physical sanctuary for God to dwell in. 1 Corinthians 3:16 transfers the temple metaphor to the individual/community: "you are God\'s temple." Christianity internalises what the Torah externalises as a physical structure.',
  },
  {
    refA: 'HEBREW_BIBLE.1 Kings.8.27',
    refB: 'QURAN.Al-Baqarah.2.255',
    linkType: 'PARALLEL',
    notes: 'Solomon\'s prayer (1 Kings 8:27) — "heaven and the highest heaven cannot contain you" — and Ayat al-Kursi (Q 2:255) — "His throne extends over the heavens and earth" — both assert divine transcendence of any physical space. The theological thrust is closely parallel.',
  },

  // ── MONOTHEISM VS TRINITY ─────────────────────────────────────────────────
  {
    refA: 'TORAH.Exodus.20.3',
    refB: 'QURAN.Al-Maidah.5.73',
    linkType: 'PARALLEL',
    notes: 'The first commandment ("no other gods before Me") and Q 5:73 (rejecting Trinity as shirk) both assert strict monotheism as the foundational religious obligation. The Quran frames its critique as a defence of this same commandment against what it reads as Christian polytheism.',
  },
]

export async function seedVerseLinks(prisma: PrismaClient) {
  const allVerses = await prisma.verse.findMany({ select: { id: true, referenceKey: true } })
  const verseMap = new Map(allVerses.map((v) => [v.referenceKey, v.id]))

  let created = 0
  let skipped = 0

  for (const link of verseLinkData) {
    const verseAId = verseMap.get(link.refA)
    const verseBId = verseMap.get(link.refB)

    if (!verseAId || !verseBId) {
      console.warn(`  ⚠ Skipping link — verse not found: ${link.refA} <-> ${link.refB}`)
      skipped++
      continue
    }

    await prisma.verseLink.upsert({
      where: { verseAId_verseBId_linkType: { verseAId, verseBId, linkType: link.linkType } },
      update: { notes: link.notes ?? null },
      create: {
        verseAId,
        verseBId,
        linkType: link.linkType,
        notes: link.notes ?? null,
      },
    })
    created++
  }

  console.log(`✓ Verse links seeded (${created} links, ${skipped} skipped — verse not in seed)`)
}
