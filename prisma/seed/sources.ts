import type { PrismaClient } from '@prisma/client'

export async function seedSources(prisma: PrismaClient) {
  const sources = [
    {
      key: 'TORAH' as const,
      title: 'Torah',
      tradition: 'JEWISH' as const,
      language: 'Hebrew',
      slug: 'torah',
      description:
        'The Torah (תּוֹרָה) comprises the five books of Moses — Genesis, Exodus, Leviticus, Numbers, and Deuteronomy — forming the foundational text of Judaism. It contains the narrative of creation, the patriarchs, the exodus from Egypt, and the divine commandments given at Sinai.',
    },
    {
      key: 'HEBREW_BIBLE' as const,
      title: 'Hebrew Bible / Old Testament',
      tradition: 'SHARED' as const,
      language: 'Hebrew',
      slug: 'hebrew-bible',
      description:
        "The Hebrew Bible (Tanakh) encompasses the Torah, Nevi'im (Prophets), and Ketuvim (Writings). It is the foundational scripture of Judaism and, as the Old Testament, forms the first part of the Christian Bible. It includes poetry, wisdom literature, prophecy, and historical narratives.",
    },
    {
      key: 'NEW_TESTAMENT' as const,
      title: 'New Testament',
      tradition: 'CHRISTIAN' as const,
      language: 'Greek',
      slug: 'new-testament',
      description:
        "The New Testament (Καινὴ Διαθήκη) is the second part of the Christian Bible, written in Koine Greek. It documents the life and teachings of Jesus of Nazareth through the four Gospels, the history of the early church in Acts, Paul's letters, and the book of Revelation.",
    },
    {
      key: 'QURAN' as const,
      title: "Qur'an",
      tradition: 'ISLAMIC' as const,
      language: 'Arabic',
      slug: 'quran',
      description:
        "The Qur'an (القرآن) is the central religious text of Islam, believed by Muslims to be the word of God (Allah) as revealed to the Prophet Muhammad through the angel Jibril (Gabriel) over approximately 23 years. It comprises 114 chapters (surahs) containing 6,236 verses (ayat).",
    },
  ]

  for (const source of sources) {
    await prisma.source.upsert({
      where: { key: source.key },
      update: {},
      create: source,
    })
  }

  console.log('✓ Sources seeded')
}
