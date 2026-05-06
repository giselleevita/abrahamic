import type { PrismaClient } from '@prisma/client'

// Map of relationship keys to verse references: "Genesis:5:3" format
const relationshipVerses: Record<string, { source: 'TORAH' | 'HEBREW_BIBLE' | 'QURAN' | 'NEW_TESTAMENT'; book: string; chapter: number; verse: number } | null> = {
  'adam-seth': { source: 'TORAH', book: 'Genesis', chapter: 5, verse: 3 },
  'seth-enosh': { source: 'TORAH', book: 'Genesis', chapter: 5, verse: 6 },
  'enosh-kenan': { source: 'TORAH', book: 'Genesis', chapter: 5, verse: 9 },
  'kenan-mahalalel': { source: 'TORAH', book: 'Genesis', chapter: 5, verse: 12 },
  'mahalalel-jared': { source: 'TORAH', book: 'Genesis', chapter: 5, verse: 15 },
  'jared-enoch': { source: 'TORAH', book: 'Genesis', chapter: 5, verse: 18 },
  'enoch-methuselah': { source: 'TORAH', book: 'Genesis', chapter: 5, verse: 21 },
  'methuselah-lamech': { source: 'TORAH', book: 'Genesis', chapter: 5, verse: 25 },
  'lamech-noah': { source: 'TORAH', book: 'Genesis', chapter: 5, verse: 28 },
  'noah-shem': { source: 'TORAH', book: 'Genesis', chapter: 5, verse: 32 },
  'noah-ham': { source: 'TORAH', book: 'Genesis', chapter: 5, verse: 32 },
  'noah-japheth': { source: 'TORAH', book: 'Genesis', chapter: 5, verse: 32 },
  'shem-arpachshad': { source: 'TORAH', book: 'Genesis', chapter: 11, verse: 10 },
  'arpachshad-shelah': { source: 'TORAH', book: 'Genesis', chapter: 11, verse: 12 },
  'shelah-eber': { source: 'TORAH', book: 'Genesis', chapter: 11, verse: 14 },
  'eber-peleg': { source: 'TORAH', book: 'Genesis', chapter: 11, verse: 16 },
  'peleg-reu': { source: 'TORAH', book: 'Genesis', chapter: 11, verse: 18 },
  'reu-serug': { source: 'TORAH', book: 'Genesis', chapter: 11, verse: 20 },
  'serug-nahor': { source: 'TORAH', book: 'Genesis', chapter: 11, verse: 22 },
  'nahor-terah': { source: 'TORAH', book: 'Genesis', chapter: 11, verse: 24 },
  'terah-abraham': { source: 'TORAH', book: 'Genesis', chapter: 11, verse: 26 },
  'abraham-ishmael': { source: 'TORAH', book: 'Genesis', chapter: 16, verse: 15 },
  'abraham-isaac': { source: 'TORAH', book: 'Genesis', chapter: 21, verse: 2 },
  'ishmael-kedar': { source: 'TORAH', book: 'Genesis', chapter: 25, verse: 13 },
  'isaac-jacob': { source: 'TORAH', book: 'Genesis', chapter: 25, verse: 26 },
  'isaac-esau': { source: 'TORAH', book: 'Genesis', chapter: 25, verse: 25 },
  'jacob-reuben': { source: 'TORAH', book: 'Genesis', chapter: 29, verse: 32 },
  'jacob-simeon': { source: 'TORAH', book: 'Genesis', chapter: 29, verse: 33 },
  'jacob-levi': { source: 'TORAH', book: 'Genesis', chapter: 29, verse: 34 },
  'jacob-judah': { source: 'TORAH', book: 'Genesis', chapter: 29, verse: 35 },
  'jacob-issachar': { source: 'TORAH', book: 'Genesis', chapter: 30, verse: 17 },
  'jacob-zebulun': { source: 'TORAH', book: 'Genesis', chapter: 30, verse: 20 },
  'jacob-gad': { source: 'TORAH', book: 'Genesis', chapter: 30, verse: 11 },
  'jacob-asher': { source: 'TORAH', book: 'Genesis', chapter: 30, verse: 13 },
  'jacob-dan': { source: 'TORAH', book: 'Genesis', chapter: 30, verse: 6 },
  'jacob-naphtali': { source: 'TORAH', book: 'Genesis', chapter: 30, verse: 8 },
  'jacob-joseph': { source: 'TORAH', book: 'Genesis', chapter: 30, verse: 23 },
  'jacob-benjamin': { source: 'TORAH', book: 'Genesis', chapter: 35, verse: 18 },
  'judah-perez': { source: 'TORAH', book: 'Genesis', chapter: 38, verse: 29 },
  'perez-hezron': { source: 'HEBREW_BIBLE', book: 'Ruth', chapter: 4, verse: 18 },
  'hezron-ram': { source: 'HEBREW_BIBLE', book: 'Ruth', chapter: 4, verse: 19 },
  'ram-amminadab': { source: 'HEBREW_BIBLE', book: 'Ruth', chapter: 4, verse: 19 },
  'amminadab-nahshon': { source: 'HEBREW_BIBLE', book: 'Ruth', chapter: 4, verse: 20 },
  'nahshon-salmon': { source: 'HEBREW_BIBLE', book: 'Ruth', chapter: 4, verse: 20 },
  'salmon-boaz': { source: 'HEBREW_BIBLE', book: 'Ruth', chapter: 4, verse: 21 },
  'boaz-obed': { source: 'HEBREW_BIBLE', book: 'Ruth', chapter: 4, verse: 21 },
  'obed-jesse': { source: 'HEBREW_BIBLE', book: 'Ruth', chapter: 4, verse: 22 },
  'jesse-david': { source: 'HEBREW_BIBLE', book: 'Ruth', chapter: 4, verse: 22 },
  'david-solomon': { source: 'HEBREW_BIBLE', book: '2 Samuel', chapter: 12, verse: 25 },
  'joseph-manasseh': { source: 'TORAH', book: 'Genesis', chapter: 41, verse: 50 },
  'joseph-ephraim': { source: 'TORAH', book: 'Genesis', chapter: 41, verse: 52 },
  'zerubbabel-abijah-nt': { source: 'NEW_TESTAMENT', book: 'Matthew', chapter: 1, verse: 12 },
  'abijah-nt-eliakim': { source: 'NEW_TESTAMENT', book: 'Matthew', chapter: 1, verse: 13 },
  'eliakim-azor': { source: 'NEW_TESTAMENT', book: 'Matthew', chapter: 1, verse: 13 },
  'azor-zadok-nt': { source: 'NEW_TESTAMENT', book: 'Matthew', chapter: 1, verse: 14 },
  'zadok-nt-achim': { source: 'NEW_TESTAMENT', book: 'Matthew', chapter: 1, verse: 14 },
  'achim-eliud': { source: 'NEW_TESTAMENT', book: 'Matthew', chapter: 1, verse: 15 },
  'eliud-eleazar': { source: 'NEW_TESTAMENT', book: 'Matthew', chapter: 1, verse: 15 },
  'eleazar-matthan': { source: 'NEW_TESTAMENT', book: 'Matthew', chapter: 1, verse: 15 },
  'matthan-jacob-nt': { source: 'NEW_TESTAMENT', book: 'Matthew', chapter: 1, verse: 16 },
  'jacob-nt-joseph': { source: 'NEW_TESTAMENT', book: 'Matthew', chapter: 1, verse: 16 },
  'joseph-jesus': { source: 'NEW_TESTAMENT', book: 'Matthew', chapter: 1, verse: 16 },
}

export async function seedFigureRelationships(prisma: PrismaClient) {
  const relationships = [
    // Adam's lineage
    { from: 'adam', to: 'seth', type: 'PARENT', verseKey: 'adam-seth' },
    { from: 'seth', to: 'enosh', type: 'PARENT', verseKey: 'seth-enosh' },
    { from: 'enosh', to: 'kenan', type: 'PARENT', verseKey: 'enosh-kenan' },
    { from: 'kenan', to: 'mahalalel', type: 'PARENT', verseKey: 'kenan-mahalalel' },
    { from: 'mahalalel', to: 'jared', type: 'PARENT', verseKey: 'mahalalel-jared' },
    { from: 'jared', to: 'enoch', type: 'PARENT', verseKey: 'jared-enoch' },
    { from: 'enoch', to: 'methuselah', type: 'PARENT', verseKey: 'enoch-methuselah' },
    { from: 'methuselah', to: 'lamech', type: 'PARENT', verseKey: 'methuselah-lamech' },
    { from: 'lamech', to: 'noah', type: 'PARENT', verseKey: 'lamech-noah' },

    // Noah's sons
    { from: 'noah', to: 'shem', type: 'PARENT', verseKey: 'noah-shem' },
    { from: 'noah', to: 'ham', type: 'PARENT', verseKey: 'noah-ham' },
    { from: 'noah', to: 'japheth', type: 'PARENT', verseKey: 'noah-japheth' },

    // Abraham's lineage through Shem
    { from: 'shem', to: 'arpachshad', type: 'PARENT', verseKey: 'shem-arpachshad' },
    { from: 'arpachshad', to: 'shelah', type: 'PARENT', verseKey: 'arpachshad-shelah' },
    { from: 'shelah', to: 'eber', type: 'PARENT', verseKey: 'shelah-eber' },
    { from: 'eber', to: 'peleg', type: 'PARENT', verseKey: 'eber-peleg' },
    { from: 'peleg', to: 'reu', type: 'PARENT', verseKey: 'peleg-reu' },
    { from: 'reu', to: 'serug', type: 'PARENT', verseKey: 'reu-serug' },
    { from: 'serug', to: 'nahor', type: 'PARENT', verseKey: 'serug-nahor' },
    { from: 'nahor', to: 'terah', type: 'PARENT', verseKey: 'nahor-terah' },
    { from: 'terah', to: 'abraham', type: 'PARENT', verseKey: 'terah-abraham' },

    // Abraham's family
    { from: 'abraham', to: 'ishmael', type: 'PARENT', verseKey: 'abraham-ishmael' },
    { from: 'hagar', to: 'ishmael', type: 'SPOUSE', notes: 'Mother of Ishmael' },
    { from: 'abraham', to: 'isaac', type: 'PARENT', verseKey: 'abraham-isaac' },
    { from: 'sarah', to: 'isaac', type: 'SPOUSE', notes: 'Mother of Isaac' },
    { from: 'abraham', to: 'keturah', type: 'SPOUSE' },

    // Ishmael's lineage (Islamic genealogy to Muhammad)
    { from: 'ishmael', to: 'kedar', type: 'PARENT', verseKey: 'ishmael-kedar', notes: 'Gen 25:13 (Torah); Qur\'an 21:76 mentions Isma\'il' },
    { from: 'kedar', to: 'adnan', type: 'PARENT', notes: '[Sirah: Islamic historical tradition] Ancestor of Muhammad through the Quraysh tribe' },
    { from: 'adnan', to: 'umayyah', type: 'PARENT', notes: '[Sirah al-Ibn Hisham]' },
    { from: 'umayyah', to: 'murrah', type: 'PARENT', notes: '[Sirah al-Ibn Hisham]' },
    { from: 'murrah', to: 'kaab', type: 'PARENT', notes: '[Sirah al-Ibn Hisham]' },
    { from: 'kaab', to: 'luayy', type: 'PARENT', notes: '[Sirah al-Ibn Hisham]' },
    { from: 'luayy', to: 'ghalib', type: 'PARENT', notes: '[Sirah al-Ibn Hisham]' },
    { from: 'ghalib', to: 'fihr', type: 'PARENT', notes: '[Sirah al-Ibn Hisham] Founder of Quraysh tribe' },
    { from: 'fihr', to: 'malik', type: 'PARENT', notes: '[Sirah al-Ibn Hisham]' },
    { from: 'malik', to: 'nadhr', type: 'PARENT', notes: '[Sirah al-Ibn Hisham]' },
    { from: 'nadhr', to: 'kinana', type: 'PARENT', notes: '[Sirah al-Ibn Hisham]' },
    { from: 'kinana', to: 'khuzaymah', type: 'PARENT', notes: '[Sirah al-Ibn Hisham]' },
    { from: 'khuzaymah', to: 'mudrika', type: 'PARENT', notes: '[Sirah al-Ibn Hisham]' },
    { from: 'mudrika', to: 'ilyas', type: 'PARENT', notes: '[Sirah al-Ibn Hisham]' },
    { from: 'ilyas', to: 'mudar', type: 'PARENT', notes: '[Sirah al-Ibn Hisham]' },
    { from: 'mudar', to: 'nizar', type: 'PARENT', notes: '[Sirah al-Ibn Hisham]' },
    { from: 'nizar', to: 'maad', type: 'PARENT', notes: '[Sirah al-Ibn Hisham]' },
    { from: 'maad', to: 'qais', type: 'PARENT', notes: '[Sirah al-Ibn Hisham]' },
    { from: 'qais', to: 'qahtan', type: 'PARENT', notes: '[Sirah al-Ibn Hisham]' },
    { from: 'qahtan', to: 'hashim', type: 'PARENT', notes: '[Sirah al-Ibn Hisham] Muhammad\'s great-grandfather; founder of Hashim clan' },
    { from: 'hashim', to: 'abdul-muttalib', type: 'PARENT', notes: '[Hadith tradition]' },
    { from: 'abdul-muttalib', to: 'abdullah', type: 'PARENT', notes: '[Hadith tradition]' },
    { from: 'abdullah', to: 'muhammad', type: 'PARENT', notes: '[Qur\'an 3:144, 33:40] Muhammad\'s father' },

    // Isaac's family
    { from: 'isaac', to: 'jacob', type: 'PARENT', verseKey: 'isaac-jacob' },
    { from: 'isaac', to: 'esau', type: 'PARENT', verseKey: 'isaac-esau' },
    { from: 'rebekah', to: 'jacob', type: 'SPOUSE', notes: 'Mother of Jacob' },
    { from: 'rebekah', to: 'esau', type: 'SPOUSE', notes: 'Mother of Esau' },

    // Jacob's family and 12 tribes
    { from: 'jacob', to: 'reuben', type: 'PARENT', verseKey: 'jacob-reuben' },
    { from: 'jacob', to: 'simeon', type: 'PARENT', verseKey: 'jacob-simeon' },
    { from: 'jacob', to: 'levi', type: 'PARENT', verseKey: 'jacob-levi' },
    { from: 'jacob', to: 'judah', type: 'PARENT', verseKey: 'jacob-judah' },
    { from: 'jacob', to: 'issachar', type: 'PARENT', verseKey: 'jacob-issachar' },
    { from: 'jacob', to: 'zebulun', type: 'PARENT', verseKey: 'jacob-zebulun' },
    { from: 'jacob', to: 'gad', type: 'PARENT', verseKey: 'jacob-gad' },
    { from: 'jacob', to: 'asher', type: 'PARENT', verseKey: 'jacob-asher' },
    { from: 'jacob', to: 'dan', type: 'PARENT', verseKey: 'jacob-dan' },
    { from: 'jacob', to: 'naphtali', type: 'PARENT', verseKey: 'jacob-naphtali' },
    { from: 'jacob', to: 'joseph', type: 'PARENT', verseKey: 'jacob-joseph' },
    { from: 'jacob', to: 'benjamin', type: 'PARENT', verseKey: 'jacob-benjamin' },

    // Judah's lineage (Davidic line)
    { from: 'judah', to: 'perez', type: 'PARENT', verseKey: 'judah-perez' },
    { from: 'perez', to: 'hezron', type: 'PARENT', verseKey: 'perez-hezron' },
    { from: 'hezron', to: 'ram', type: 'PARENT', verseKey: 'hezron-ram' },
    { from: 'ram', to: 'amminadab', type: 'PARENT', verseKey: 'ram-amminadab' },
    { from: 'amminadab', to: 'nahshon', type: 'PARENT', verseKey: 'amminadab-nahshon' },
    { from: 'nahshon', to: 'salmon', type: 'PARENT', verseKey: 'nahshon-salmon' },
    { from: 'salmon', to: 'boaz', type: 'PARENT', verseKey: 'salmon-boaz' },
    { from: 'boaz', to: 'obed', type: 'PARENT', verseKey: 'boaz-obed' },
    { from: 'obed', to: 'jesse', type: 'PARENT', verseKey: 'obed-jesse' },
    { from: 'jesse', to: 'david', type: 'PARENT', verseKey: 'jesse-david' },
    { from: 'david', to: 'solomon', type: 'PARENT', verseKey: 'david-solomon' },

    // Joseph's lineage
    { from: 'joseph', to: 'manasseh', type: 'PARENT', verseKey: 'joseph-manasseh' },
    { from: 'joseph', to: 'ephraim', type: 'PARENT', verseKey: 'joseph-ephraim' },

    // Solomon's lineage
    { from: 'solomon', to: 'rehoboam', type: 'PARENT' },
    { from: 'rehoboam', to: 'abijah', type: 'PARENT' },
    { from: 'abijah', to: 'asa', type: 'PARENT' },
    { from: 'asa', to: 'jehoshaphat', type: 'PARENT' },
    { from: 'jehoshaphat', to: 'jehoram', type: 'PARENT' },
    { from: 'jehoram', to: 'ahaziah', type: 'PARENT' },
    { from: 'ahaziah', to: 'joash', type: 'PARENT' },
    { from: 'joash', to: 'amaziah', type: 'PARENT' },
    { from: 'amaziah', to: 'azariah', type: 'PARENT' },
    { from: 'azariah', to: 'jotham', type: 'PARENT' },
    { from: 'jotham', to: 'ahaz', type: 'PARENT' },
    { from: 'ahaz', to: 'hezekiah', type: 'PARENT' },
    { from: 'hezekiah', to: 'manasseh-king', type: 'PARENT' },
    { from: 'manasseh-king', to: 'amon', type: 'PARENT' },
    { from: 'amon', to: 'josiah', type: 'PARENT' },
    { from: 'josiah', to: 'jehoiakim', type: 'PARENT' },
    { from: 'jehoiakim', to: 'jehoiachin', type: 'PARENT' },
    { from: 'jehoiachin', to: 'shealtiel', type: 'PARENT' },
    { from: 'shealtiel', to: 'zerubbabel', type: 'PARENT' },

    // Jesus' genealogy (from Matthew)
    { from: 'zerubbabel', to: 'abijah-nt', type: 'PARENT', verseKey: 'zerubbabel-abijah-nt' },
    { from: 'abijah-nt', to: 'eliakim', type: 'PARENT', verseKey: 'abijah-nt-eliakim' },
    { from: 'eliakim', to: 'azor', type: 'PARENT', verseKey: 'eliakim-azor' },
    { from: 'azor', to: 'zadok-nt', type: 'PARENT', verseKey: 'azor-zadok-nt' },
    { from: 'zadok-nt', to: 'achim', type: 'PARENT', verseKey: 'zadok-nt-achim' },
    { from: 'achim', to: 'eliud', type: 'PARENT', verseKey: 'achim-eliud' },
    { from: 'eliud', to: 'eleazar', type: 'PARENT', verseKey: 'eliud-eleazar' },
    { from: 'eleazar', to: 'matthan', type: 'PARENT', verseKey: 'eleazar-matthan' },
    { from: 'matthan', to: 'jacob-nt', type: 'PARENT', verseKey: 'matthan-jacob-nt' },
    { from: 'jacob-nt', to: 'joseph', type: 'PARENT', verseKey: 'jacob-nt-joseph' },
    { from: 'joseph', to: 'jesus', type: 'PARENT', verseKey: 'joseph-jesus', notes: 'Earthly father (Matthew genealogy)' },

    // Jesus' relationships
    { from: 'jesus', to: 'james-the-less', type: 'SIBLING', notes: 'Brother (according to some traditions)' },
    { from: 'mary-of-nazareth', to: 'jesus', type: 'SPOUSE', notes: 'Mother' },

    // Apostles
    { from: 'jesus', to: 'peter', type: 'CHILD', notes: 'Spiritual relationship' },
    { from: 'jesus', to: 'james-the-greater', type: 'CHILD', notes: 'Spiritual relationship' },
    { from: 'jesus', to: 'john', type: 'CHILD', notes: 'Spiritual relationship' },

    // Abraham to Lot (nephew)
    { from: 'abraham', to: 'lot', type: 'CHILD', notes: 'Nephew' },

    // Additional family ties
    { from: 'terah', to: 'sarah', type: 'CHILD', notes: 'Daughter (some sources)' },
  ]

  for (const rel of relationships) {
    const fromFigure = await prisma.figure.findUnique({ where: { slug: rel.from } })
    const toFigure = await prisma.figure.findUnique({ where: { slug: rel.to } })

    if (fromFigure && toFigure) {
      // Look up verse reference if available
      let verseRef = rel.verseKey ? relationshipVerses[rel.verseKey] : null
      let verse = null

      if (verseRef) {
        verse = await prisma.verse.findUnique({
          where: {
            referenceKey: `${verseRef.source}:${verseRef.book}:${verseRef.chapter}:${verseRef.verse}`,
          },
        })
      }

      try {
        await prisma.figureRelation.create({
          data: {
            fromFigureId: fromFigure.id,
            toFigureId: toFigure.id,
            relationType: rel.type as 'PARENT' | 'CHILD' | 'SPOUSE' | 'SIBLING' | 'DESCENDANT',
            notes: rel.notes || null,
            verseId: verse?.id || null,
          },
        })
      } catch {
        // Unique constraint or other error — skip
      }
    }
  }

  console.log('✓ Seeded figure relationships with citations')
}
