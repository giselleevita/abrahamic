import type { PrismaClient } from '@prisma/client'

export async function seedThemes(prisma: PrismaClient) {
  const themes = [
    {
      name: 'God',
      slug: 'god',
      color: '#6366f1',
      description:
        'The nature, attributes, and oneness of God (monotheism) across all three Abrahamic traditions. Includes concepts of divine names, attributes, transcendence, and immanence.',
    },
    {
      name: 'Law',
      slug: 'law',
      color: '#f59e0b',
      description:
        "Divine commandments, jurisprudence, and moral law. Encompasses the Torah's mitzvot, Christian understandings of law and grace, and Islamic sharia.",
    },
    {
      name: 'Revelation',
      slug: 'revelation',
      color: '#10b981',
      description:
        'How God communicates with humanity through scripture and prophets. Includes the nature of prophecy, divine speech, and the transmission of sacred texts.',
    },
    {
      name: 'Judgment',
      slug: 'judgment',
      color: '#ef4444',
      description:
        'Divine judgment, the afterlife, resurrection, and accountability before God. Includes eschatological teachings across all three traditions.',
    },
    {
      name: 'Prayer',
      slug: 'prayer',
      color: '#8b5cf6',
      description:
        'Worship, supplication, and ritual prayer. Encompasses prescribed prayer forms, personal petition, and communal worship practices.',
    },
    {
      name: 'Prophecy',
      slug: 'prophecy',
      color: '#06b6d4',
      description:
        'Prophetic tradition, foretelling, and messianic expectation. Covers the role of prophets, fulfilled prophecy, and eschatological anticipation.',
    },
    {
      name: 'Salvation',
      slug: 'salvation',
      color: '#14b8a6',
      description:
        'How humanity is saved, redeemed, or brought into right relationship with God. Includes atonement, forgiveness, grace, faith, and works across all three traditions.',
    },
    {
      name: 'Holy War',
      slug: 'holy-war',
      color: '#dc2626',
      description:
        'Violence sanctioned or commanded in God\'s name. Includes the Israelite conquest of Canaan, the Crusades, and the concept of Jihad. One of the most controversial and debated topics across traditions.',
    },
    {
      name: 'Ethics',
      slug: 'ethics',
      color: '#16a34a',
      description:
        'Moral teachings and ethical commandments derived from scripture. Includes treatment of neighbors, strangers, the poor, gender roles, and social justice across all three traditions.',
    },
    {
      name: 'Evil',
      slug: 'evil',
      color: '#7c3aed',
      description:
        'The origin of evil, sin, and the nature of the adversary (Satan/Iblis). Includes the fall of Lucifer, original sin, and the role of the tempter in each tradition.',
    },
    {
      name: 'Lineage',
      slug: 'lineage',
      color: '#92400e',
      description:
        'Prophetic genealogies and family trees. Covers the descent from Adam through the patriarchs to the great prophets, and how each tradition views the significance of lineage in prophethood and covenant.',
    },
  ]

  for (const theme of themes) {
    await prisma.theme.upsert({
      where: { slug: theme.slug },
      update: {},
      create: theme,
    })
  }

  console.log('✓ Themes seeded')
}
