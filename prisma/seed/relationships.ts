import type { PrismaClient } from '@prisma/client'

export async function seedFigureRelationships(prisma: PrismaClient) {
  const relationships = [
    // Adam's lineage
    { from: 'adam', to: 'seth', type: 'PARENT' },
    { from: 'seth', to: 'enosh', type: 'PARENT' },
    { from: 'enosh', to: 'kenan', type: 'PARENT' },
    { from: 'kenan', to: 'mahalalel', type: 'PARENT' },
    { from: 'mahalalel', to: 'jared', type: 'PARENT' },
    { from: 'jared', to: 'enoch', type: 'PARENT' },
    { from: 'enoch', to: 'methuselah', type: 'PARENT' },
    { from: 'methuselah', to: 'lamech', type: 'PARENT' },
    { from: 'lamech', to: 'noah', type: 'PARENT' },

    // Noah's sons
    { from: 'noah', to: 'shem', type: 'PARENT' },
    { from: 'noah', to: 'ham', type: 'PARENT' },
    { from: 'noah', to: 'japheth', type: 'PARENT' },

    // Abraham's lineage through Shem
    { from: 'shem', to: 'arpachshad', type: 'PARENT' },
    { from: 'arpachshad', to: 'shelah', type: 'PARENT' },
    { from: 'shelah', to: 'eber', type: 'PARENT' },
    { from: 'eber', to: 'peleg', type: 'PARENT' },
    { from: 'peleg', to: 'reu', type: 'PARENT' },
    { from: 'reu', to: 'serug', type: 'PARENT' },
    { from: 'serug', to: 'nahor', type: 'PARENT' },
    { from: 'nahor', to: 'terah', type: 'PARENT' },
    { from: 'terah', to: 'abraham', type: 'PARENT' },

    // Abraham's family
    { from: 'abraham', to: 'ishmael', type: 'PARENT' },
    { from: 'hagar', to: 'ishmael', type: 'SPOUSE', notes: 'Mother of Ishmael' },
    { from: 'abraham', to: 'isaac', type: 'PARENT' },
    { from: 'sarah', to: 'isaac', type: 'SPOUSE', notes: 'Mother of Isaac' },
    { from: 'abraham', to: 'keturah', type: 'SPOUSE' },

    // Ishmael's lineage (Islamic genealogy to Muhammad)
    { from: 'ishmael', to: 'kedar', type: 'PARENT' },
    { from: 'kedar', to: 'adnan', type: 'PARENT', notes: 'Ancestor of Muhammad through the Quraysh tribe' },
    { from: 'adnan', to: 'umayyah', type: 'PARENT' },
    { from: 'umayyah', to: 'murrah', type: 'PARENT' },
    { from: 'murrah', to: 'kaab', type: 'PARENT' },
    { from: 'kaab', to: 'luayy', type: 'PARENT' },
    { from: 'luayy', to: 'ghalib', type: 'PARENT' },
    { from: 'ghalib', to: 'fihr', type: 'PARENT', notes: 'Founder of Quraysh tribe' },
    { from: 'fihr', to: 'malik', type: 'PARENT' },
    { from: 'malik', to: 'nadhr', type: 'PARENT' },
    { from: 'nadhr', to: 'kinana', type: 'PARENT' },
    { from: 'kinana', to: 'khuzaymah', type: 'PARENT' },
    { from: 'khuzaymah', to: 'mudrika', type: 'PARENT' },
    { from: 'mudrika', to: 'ilyas', type: 'PARENT' },
    { from: 'ilyas', to: 'mudar', type: 'PARENT' },
    { from: 'mudar', to: 'nizar', type: 'PARENT' },
    { from: 'nizar', to: 'maad', type: 'PARENT' },
    { from: 'maad', to: 'qais', type: 'PARENT' },
    { from: 'qais', to: 'qahtan', type: 'PARENT' },
    { from: 'qahtan', to: 'hashim', type: 'PARENT', notes: 'Muhammad\'s great-grandfather; founder of Hashim clan' },
    { from: 'hashim', to: 'abdul-muttalib', type: 'PARENT' },
    { from: 'abdul-muttalib', to: 'abdullah', type: 'PARENT' },
    { from: 'abdullah', to: 'muhammad', type: 'PARENT', notes: 'Muhammad\'s father' },

    // Isaac's family
    { from: 'isaac', to: 'jacob', type: 'PARENT' },
    { from: 'isaac', to: 'esau', type: 'PARENT' },
    { from: 'rebekah', to: 'jacob', type: 'SPOUSE', notes: 'Mother of Jacob' },
    { from: 'rebekah', to: 'esau', type: 'SPOUSE', notes: 'Mother of Esau' },

    // Jacob's family and 12 tribes
    { from: 'jacob', to: 'reuben', type: 'PARENT' },
    { from: 'jacob', to: 'simeon', type: 'PARENT' },
    { from: 'jacob', to: 'levi', type: 'PARENT' },
    { from: 'jacob', to: 'judah', type: 'PARENT' },
    { from: 'jacob', to: 'issachar', type: 'PARENT' },
    { from: 'jacob', to: 'zebulun', type: 'PARENT' },
    { from: 'jacob', to: 'gad', type: 'PARENT' },
    { from: 'jacob', to: 'asher', type: 'PARENT' },
    { from: 'jacob', to: 'dan', type: 'PARENT' },
    { from: 'jacob', to: 'naphtali', type: 'PARENT' },
    { from: 'jacob', to: 'joseph', type: 'PARENT' },
    { from: 'jacob', to: 'benjamin', type: 'PARENT' },

    // Judah's lineage (Davidic line)
    { from: 'judah', to: 'perez', type: 'PARENT' },
    { from: 'perez', to: 'hezron', type: 'PARENT' },
    { from: 'hezron', to: 'ram', type: 'PARENT' },
    { from: 'ram', to: 'amminadab', type: 'PARENT' },
    { from: 'amminadab', to: 'nahshon', type: 'PARENT' },
    { from: 'nahshon', to: 'salmon', type: 'PARENT' },
    { from: 'salmon', to: 'boaz', type: 'PARENT' },
    { from: 'boaz', to: 'obed', type: 'PARENT' },
    { from: 'obed', to: 'jesse', type: 'PARENT' },
    { from: 'jesse', to: 'david', type: 'PARENT' },
    { from: 'david', to: 'solomon', type: 'PARENT' },

    // Joseph's lineage
    { from: 'joseph', to: 'manasseh', type: 'PARENT' },
    { from: 'joseph', to: 'ephraim', type: 'PARENT' },

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
    { from: 'zerubbabel', to: 'abijah-nt', type: 'PARENT' },
    { from: 'abijah-nt', to: 'eliakim', type: 'PARENT' },
    { from: 'eliakim', to: 'azor', type: 'PARENT' },
    { from: 'azor', to: 'zadok-nt', type: 'PARENT' },
    { from: 'zadok-nt', to: 'achim', type: 'PARENT' },
    { from: 'achim', to: 'eliud', type: 'PARENT' },
    { from: 'eliud', to: 'eleazar', type: 'PARENT' },
    { from: 'eleazar', to: 'matthan', type: 'PARENT' },
    { from: 'matthan', to: 'jacob-nt', type: 'PARENT' },
    { from: 'jacob-nt', to: 'joseph', type: 'PARENT' },
    { from: 'joseph', to: 'jesus', type: 'PARENT', notes: 'Earthly father (Matthew genealogy)' },

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
      try {
        await prisma.figureRelation.create({
          data: {
            fromFigureId: fromFigure.id,
            toFigureId: toFigure.id,
            relationType: rel.type as 'PARENT' | 'CHILD' | 'SPOUSE' | 'SIBLING' | 'DESCENDANT',
            notes: rel.notes,
          },
        })
      } catch {
        // Unique constraint or other error — skip
      }
    }
  }

  console.log('✓ Seeded figure relationships')
}
