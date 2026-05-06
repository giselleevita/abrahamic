import type { PrismaClient } from '@prisma/client'

export async function seedFigureLegacy(prisma: PrismaClient) {
  const legacyData = [
    { slug: 'adam', legacy: 'First human being; introduced mortality and original sin; father of humanity' },
    { slug: 'eve', legacy: 'First woman; mother of humanity; role in the fall of mankind' },
    { slug: 'enoch', legacy: 'Ascended to heaven without death; associated with esoteric knowledge and prophecy' },
    { slug: 'noah', legacy: 'Preserved humanity and creation through the Flood; established Noahide Laws for all humanity' },
    { slug: 'abraham', legacy: 'Founder of monotheism; established covenant with God; father of Ishmael and Isaac; rebuilt the Ka\'ba' },
    { slug: 'sarah', legacy: 'Mother of Isaac; matriarch of the Jewish people; model of faith in old age' },
    { slug: 'hagar', legacy: 'Mother of Ishmael; her struggle commemorated in the Hajj pilgrimage ritual' },
    { slug: 'ishmael', legacy: 'Prophet and co-builder of the Ka\'ba; father of Arab peoples; offered for sacrifice' },
    { slug: 'isaac', legacy: 'Covenant heir; binding of Isaac becomes model of faith and obedience; father of Jacob and Esau' },
    { slug: 'jacob', legacy: 'Israel; struggled with God; father of 12 tribes; established the covenant lineage' },
    { slug: 'rebekah', legacy: 'Mother of Jacob and Esau; secured the blessing for Jacob; matriarch of Israel' },
    { slug: 'joseph', legacy: 'Dreamer and administrator; preserved Egypt and the Israelite family during famine; prefigures Christ' },
    { slug: 'moses', legacy: 'Lawgiver; liberated Israel from Egypt; received the Torah; established monotheism\'s foundations' },
    { slug: 'aaron', legacy: 'First High Priest; brother of Moses; mediator between God and people; established priesthood' },
    { slug: 'david', legacy: 'Greatest king of Israel; psalms and music; messianic ancestor; established Jerusalem as capital' },
    { slug: 'solomon', legacy: 'Wisest king; built the First Temple; expanded the kingdom; authored wisdom literature' },
    { slug: 'elijah', legacy: 'Greatest prophet; confronted idolatry; performed miracles; ascended to heaven' },
    { slug: 'jeremiah', legacy: 'Prophet of doom and hope; witnessed the fall of Jerusalem; wrote Lamentations' },
    { slug: 'isaiah', legacy: 'Prophet of salvation; foretold the messiah; vision of world peace; comfort to the exiled' },
    { slug: 'ezra', legacy: 'Rebuilt the Temple; restored Torah; established scribal tradition; saved Judaism from assimilation' },
    { slug: 'john-the-baptist', legacy: 'Forerunner of Jesus; baptized Christ; established baptism as spiritual renewal' },
    { slug: 'jesus', legacy: 'Christ/Messiah; Incarnation of God; founder of Christianity; salvation through faith and resurrection' },
    { slug: 'peter', legacy: 'Rock of the church; first pope; led apostles; boldly testified to resurrection' },
    { slug: 'paul', legacy: 'Apostle to gentiles; wrote most of NT; expanded church beyond Judaism; theology of grace' },
    { slug: 'mary-of-nazareth', legacy: 'Mother of Jesus; venerated as Theotokos; model of virginity and motherhood' },
    { slug: 'john', legacy: 'Beloved disciple; wrote gospel and apocalypse; established mystical theology' },
    { slug: 'james-the-greater', legacy: 'Apostle; first apostle to be martyred; patron of pilgrims; apostle to Spain' },
    { slug: 'lot', legacy: 'Righteous man; saved from Sodom; prophet in Islamic tradition; tested by trial' },
    { slug: 'jethro', legacy: 'Midianite priest; Moses\' father-in-law; counselor; helped establish judicial system' },
    { slug: 'salome', legacy: 'Follower of Jesus; witness to crucifixion and resurrection; ministry to the risen Lord' },
    { slug: 'john-the-baptist', legacy: 'Prophet; baptized Jesus Christ; forerunner to the Messiah; practiced ritual immersion' },
    { slug: 'judas-iscariot', legacy: 'Apostle and betrayer; complex figure in Christianity; death and repentance debate' },
    { slug: 'thomas', legacy: 'Apostle; "doubting Thomas"; martyred missionary; established church in India' },
    { slug: 'simon-peter', legacy: 'Apostle; founder of church; martyr; venerated as first pope' },
    { slug: 'andrew', legacy: 'Apostle; brother of Peter; missionary to various regions; patron saint' },
    { slug: 'bartholomew', legacy: 'Apostle; preacher of the gospel; martyred; venerated in Eastern Christianity' },
    { slug: 'philip', legacy: 'Apostle; evangelist; preached in Greece and Asia; fed the 5,000' },
  ]

  for (const data of legacyData) {
    try {
      await prisma.figure.update({
        where: { slug: data.slug },
        data: { legacy: data.legacy },
      })
    } catch (e) {
      // Figure might not exist yet, skip
    }
  }

  console.log('✓ Seeded figure legacy information')
}
