import { createHash } from 'crypto'
import type { PrismaClient } from '@prisma/client'

function claimHash(sourceId: number, statement: string): string {
  const normalized = statement.trim().toLowerCase().replace(/\s+/g, ' ')
  return createHash('sha256').update(`${sourceId}::${normalized}`).digest('hex')
}

type ClaimData = {
  sourceKey: 'TORAH' | 'HEBREW_BIBLE' | 'NEW_TESTAMENT' | 'QURAN'
  statement: string
  notes?: string
  verseRefs: string[]         // referenceKey format
  figureSlugs?: string[]
  themeSlugs?: string[]
}

const claimsData: ClaimData[] = [
  // ── Abraham ──────────────────────────────────────────────────────────────
  {
    sourceKey: 'TORAH',
    statement: 'God establishes an everlasting covenant with Abraham and his descendants, promising them the land of Canaan.',
    verseRefs: ['TORAH.Genesis.17.7', 'TORAH.Genesis.17.8'],
    figureSlugs: ['abraham'],
    themeSlugs: ['god'],
  },
  {
    sourceKey: 'TORAH',
    statement: 'God calls Abraham (then Abram) to leave his country, kindred, and father\'s house for a land that God will show him.',
    verseRefs: ['TORAH.Genesis.12.1'],
    figureSlugs: ['abraham'],
    themeSlugs: ['revelation'],
  },
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'Paul states that the promise given to Abraham came through the righteousness of faith, not through the Law.',
    verseRefs: ['NEW_TESTAMENT.Romans.4.13', 'NEW_TESTAMENT.Galatians.3.6'],
    figureSlugs: ['abraham'],
    themeSlugs: ['law'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'God makes Ibrahim an Imam (leader) for all people after testing him with trials, and the covenant extends through his righteous descendants.',
    verseRefs: ['QURAN.Al-Baqarah.2.124'],
    figureSlugs: ['abraham'],
    themeSlugs: ['god'],
  },

  // ── Monotheism / God ─────────────────────────────────────────────────────
  {
    sourceKey: 'TORAH',
    statement: 'The Shema declares that the LORD (YHWH) is the one God of Israel.',
    verseRefs: ['TORAH.Deuteronomy.6.4'],
    themeSlugs: ['god'],
  },
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'The Gospel of John opens by identifying the Word (Logos) as being with God and being God from the beginning.',
    verseRefs: ['NEW_TESTAMENT.John.1.1'],
    themeSlugs: ['god', 'revelation'],
  },
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'Jesus states the greatest commandment is to love God with all one\'s heart, soul, and mind.',
    verseRefs: ['NEW_TESTAMENT.Matthew.22.37'],
    figureSlugs: ['jesus'],
    themeSlugs: ['god', 'law'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'Surah Al-Ikhlas declares God as absolutely One, who neither begets nor was begotten, with no equivalent.',
    verseRefs: ['QURAN.Al-Ikhlas.112.1', 'QURAN.Al-Ikhlas.112.3'],
    themeSlugs: ['god'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'Ayat al-Kursi (the Throne Verse) describes God as the Ever-Living, Self-Sustaining, and declares there is no deity except Him.',
    verseRefs: ['QURAN.Al-Baqarah.2.255'],
    themeSlugs: ['god'],
  },

  // ── Moses / Revelation ────────────────────────────────────────────────────
  {
    sourceKey: 'TORAH',
    statement: 'At the burning bush, God reveals the divine name to Moses as "Ehyeh-Asher-Ehyeh" (I Am That I Am / I Will Be What I Will Be).',
    verseRefs: ['TORAH.Exodus.3.14'],
    figureSlugs: ['moses'],
    themeSlugs: ['god', 'revelation'],
  },

  // ── Mary / Jesus ─────────────────────────────────────────────────────────
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'The angel Gabriel is sent to Mary in Nazareth to announce that she will conceive a son through the Holy Spirit, who will be called the Son of God.',
    verseRefs: ['NEW_TESTAMENT.Luke.1.26', 'NEW_TESTAMENT.Luke.1.35'],
    figureSlugs: ['mary', 'gabriel', 'jesus'],
    themeSlugs: ['prophecy'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'The Qur\'an describes how a messenger (identified by commentators as Jibril/Gabriel) appeared to Maryam to announce the gift of a pure son.',
    verseRefs: ['QURAN.Maryam.19.16', 'QURAN.Maryam.19.19'],
    figureSlugs: ['mary', 'gabriel', 'jesus'],
    themeSlugs: ['prophecy'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'The Qur\'an states that Jesus was not killed nor crucified, but it was made to appear so to those who claimed it.',
    verseRefs: ['QURAN.An-Nisa.4.157'],
    figureSlugs: ['jesus'],
    themeSlugs: ['prophecy'],
  },

  // ── Gabriel ───────────────────────────────────────────────────────────────
  {
    sourceKey: 'HEBREW_BIBLE',
    statement: 'Gabriel is commanded to help Daniel understand a vision, appearing as a divine messenger who interprets prophetic events.',
    verseRefs: ['HEBREW_BIBLE.Daniel.8.16'],
    figureSlugs: ['gabriel'],
    themeSlugs: ['revelation', 'prophecy'],
  },

  // ── Prophecy / Isaiah ─────────────────────────────────────────────────────
  {
    sourceKey: 'HEBREW_BIBLE',
    statement: 'Isaiah prophesies that a young woman will conceive and bear a son named Immanuel (God with us) as a sign from God.',
    verseRefs: ['HEBREW_BIBLE.Isaiah.7.14'],
    themeSlugs: ['prophecy'],
  },
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'Matthew cites Isaiah 7:14 as fulfilled in the birth of Jesus, translating the Hebrew \'almah as parthenos (virgin).',
    verseRefs: ['NEW_TESTAMENT.Matthew.1.23'],
    figureSlugs: ['jesus'],
    themeSlugs: ['prophecy'],
  },

  // ── Ten Commandments ──────────────────────────────────────────────────────
  {
    sourceKey: 'TORAH',
    statement: 'God opens the Decalogue by identifying Himself as the Redeemer who brought Israel out of Egypt, then commands: have no other gods before Me.',
    verseRefs: ['TORAH.Exodus.20.2', 'TORAH.Exodus.20.3'],
    figureSlugs: ['moses'],
    themeSlugs: ['god', 'law'],
  },
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'Jesus declares that all the Law and the Prophets hang on two commandments: love God with all your heart, and love your neighbor as yourself.',
    verseRefs: ['NEW_TESTAMENT.Matthew.22.37', 'NEW_TESTAMENT.Matthew.22.39'],
    figureSlugs: ['jesus'],
    themeSlugs: ['god', 'law'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'God commands worshipping Him alone and honouring parents — the Quran\'s moral summary in Al-Isra mirrors the ethical core of the Decalogue.',
    verseRefs: ['QURAN.Al-Isra.17.23'],
    figureSlugs: ['moses'],
    themeSlugs: ['god', 'law'],
  },

  // ── Sabbath / Day of Rest ─────────────────────────────────────────────────
  {
    sourceKey: 'TORAH',
    statement: 'The fourth commandment requires Israel to remember the Sabbath day and keep it holy, refraining from all work — because God rested on the seventh day.',
    verseRefs: ['TORAH.Exodus.20.8'],
    figureSlugs: ['moses'],
    themeSlugs: ['law'],
  },
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'Jesus teaches that the Sabbath was created for the benefit of humanity — it exists to serve people, and the Son of Man is Lord even of the Sabbath.',
    verseRefs: ['NEW_TESTAMENT.Mark.2.27'],
    figureSlugs: ['jesus'],
    themeSlugs: ['law'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'The Quran commands believers to leave trade and hasten to the congregational prayer (Jumu\'ah) on Friday — Islam\'s weekly communal assembly replaces the Sabbath.',
    verseRefs: ['QURAN.Al-Jumua.62.9'],
    themeSlugs: ['prayer', 'law'],
  },

  // ── Golden Rule ───────────────────────────────────────────────────────────
  {
    sourceKey: 'TORAH',
    statement: 'The Torah commands: do not bear grudges against your kinsmen — love your neighbor as yourself; this is the LORD\'s command.',
    verseRefs: ['TORAH.Leviticus.19.18'],
    themeSlugs: ['law'],
  },
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'Jesus teaches the Golden Rule: do to others whatever you would have them do to you — this, he says, summarizes the entire Law and the Prophets.',
    verseRefs: ['NEW_TESTAMENT.Matthew.7.12'],
    figureSlugs: ['jesus'],
    themeSlugs: ['law'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'God commands worshipping Him alone and doing good to parents, relatives, orphans, the needy, near and far neighbours, and all those in need — the Quranic framework of ethical obligation toward others.',
    verseRefs: ['QURAN.An-Nisa.4.36'],
    themeSlugs: ['law'],
  },

  // ── Fasting ───────────────────────────────────────────────────────────────
  {
    sourceKey: 'TORAH',
    statement: 'God commands Israel to observe the Day of Atonement (Yom Kippur) with fasting and complete rest — a statute in perpetuity for the entire community.',
    verseRefs: ['TORAH.Leviticus.16.29'],
    figureSlugs: ['moses'],
    themeSlugs: ['law', 'prayer'],
  },
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'Jesus presupposes that his followers will fast, and instructs them not to make a show of it — fasting is a private act of devotion between the individual and God.',
    verseRefs: ['NEW_TESTAMENT.Matthew.6.16'],
    figureSlugs: ['jesus'],
    themeSlugs: ['prayer'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'God prescribes fasting during the month of Ramadan for all believers, as it was prescribed for peoples before them, so that they may develop God-consciousness (taqwa).',
    verseRefs: ['QURAN.Al-Baqarah.2.183'],
    themeSlugs: ['law', 'prayer'],
  },

  // ── Dietary Laws ──────────────────────────────────────────────────────────
  {
    sourceKey: 'TORAH',
    statement: 'God specifies which land animals may be eaten: only those that have completely split hooves and chew their cud are permitted — the foundation of kashrut.',
    verseRefs: ['TORAH.Leviticus.11.3'],
    figureSlugs: ['moses'],
    themeSlugs: ['law'],
  },
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'A voice from heaven tells Peter that what God has made clean must not be called impure — the vision signals that Gentile Christians are not bound by Jewish dietary laws.',
    verseRefs: ['NEW_TESTAMENT.Acts.10.15'],
    figureSlugs: ['jesus'],
    themeSlugs: ['law'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'God forbids only what is clearly harmful: carrion, blood, pork, and animals slaughtered in any name other than God\'s — beyond these, all food is permitted (halal).',
    verseRefs: ['QURAN.Al-Baqarah.2.173'],
    themeSlugs: ['law'],
  },

  // ── Charity ───────────────────────────────────────────────────────────────
  {
    sourceKey: 'TORAH',
    statement: 'God commands landowners to leave the corners and gleanings of their fields unharvested, so that the poor and the stranger may gather food — tzedakah built into the land.',
    verseRefs: ['TORAH.Leviticus.19.9'],
    themeSlugs: ['law'],
  },
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'Jesus teaches that authentic charity is entirely private: do not let your left hand know what your right hand is doing — your Father who sees in secret will reward you.',
    verseRefs: ['NEW_TESTAMENT.Matthew.6.3'],
    figureSlugs: ['jesus'],
    themeSlugs: ['law'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'True righteousness, according to the Quran, includes giving wealth — despite loving it — to relatives, orphans, the needy, travellers, and those in bondage; and giving the obligatory zakat.',
    verseRefs: ['QURAN.Al-Baqarah.2.177'],
    themeSlugs: ['law'],
  },

  // ── Isaiah 53 — The Suffering Servant ─────────────────────────────────────
  {
    sourceKey: 'HEBREW_BIBLE',
    statement: 'Isaiah describes the Servant of the LORD as despised, pierced for our transgressions and crushed for our iniquities — the LORD laid on him the iniquity of us all, and by his wounds we are healed.',
    verseRefs: ['HEBREW_BIBLE.Isaiah.53.3', 'HEBREW_BIBLE.Isaiah.53.5'],
    themeSlugs: ['prophecy', 'judgment'],
  },
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'The New Testament reads Isaiah\'s Suffering Servant as a direct prophecy of Jesus Christ — fulfilled in his rejection, crucifixion, and the healing of humanity through his atoning death.',
    verseRefs: ['NEW_TESTAMENT.Matthew.16.16'],
    figureSlugs: ['jesus'],
    themeSlugs: ['prophecy'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'The Quran honours Isa as the Messiah — a word from God, honoured in this world and the next, and among those brought near to God — but denies his crucifixion, making a suffering-servant reading of his death impossible within Islamic theology.',
    verseRefs: ['QURAN.Al-Imran.3.45', 'QURAN.An-Nisa.4.157'],
    figureSlugs: ['jesus'],
    themeSlugs: ['prophecy'],
  },

  // ── The Messiah ───────────────────────────────────────────────────────────
  {
    sourceKey: 'HEBREW_BIBLE',
    statement: 'Isaiah prophesies a child born to be king, bearing the names Wonderful Counsellor, Mighty God, Everlasting Father, Prince of Peace — his government and peace shall have no end, established on the throne of David.',
    verseRefs: ['HEBREW_BIBLE.Isaiah.9.6'],
    themeSlugs: ['prophecy'],
  },
  {
    sourceKey: 'HEBREW_BIBLE',
    statement: 'Zechariah announces the coming of Israel\'s king: righteous, victorious, and humble — riding not on a warhorse but on a donkey — bringing peace to the nations.',
    verseRefs: ['HEBREW_BIBLE.Zechariah.9.9'],
    themeSlugs: ['prophecy'],
  },
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'Peter confesses Jesus as the Messiah and Son of the living God; Jesus declares this a revelation from the Father, not a human insight — and on this confession he will build his church.',
    verseRefs: ['NEW_TESTAMENT.Matthew.16.16'],
    figureSlugs: ['jesus'],
    themeSlugs: ['prophecy', 'god'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'The angels announce to Maryam that God gives her glad tidings of a Word from Him, whose name is the Messiah, Jesus son of Mary — honoured in this world and the next, and among those brought near to God.',
    verseRefs: ['QURAN.Al-Imran.3.45'],
    figureSlugs: ['mary', 'jesus'],
    themeSlugs: ['prophecy'],
  },

  // ── The Temple ────────────────────────────────────────────────────────────
  {
    sourceKey: 'TORAH',
    statement: 'God commands the construction of a sanctuary — the Tabernacle — so that the divine presence may dwell among the Israelites; the portable sanctuary is the model for the later Temple.',
    verseRefs: ['TORAH.Exodus.25.8'],
    figureSlugs: ['moses'],
    themeSlugs: ['god', 'law'],
  },
  {
    sourceKey: 'HEBREW_BIBLE',
    statement: 'Solomon, at the dedication of the First Temple, acknowledges that even the highest heaven cannot contain God — the Temple is a house of prayer and a focal point of divine presence, not a container for the infinite.',
    verseRefs: ['HEBREW_BIBLE.1 Kings.8.27'],
    themeSlugs: ['god'],
  },
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'Jesus declares that if the Temple is destroyed he will raise it again in three days — John explains that the temple he spoke of was his body, identifying Jesus himself as the new dwelling of God among humanity.',
    verseRefs: ['NEW_TESTAMENT.John.2.19'],
    figureSlugs: ['jesus'],
    themeSlugs: ['god', 'prophecy'],
  },
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'Paul teaches that believers themselves are the temple of God — the Holy Spirit dwells within the community of the faithful, transferring the locus of divine presence from the Jerusalem Temple to the church.',
    verseRefs: ['NEW_TESTAMENT.1 Corinthians.3.16'],
    themeSlugs: ['god', 'law'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'The Quran commemorates God\'s transportation of Muhammad from the Sacred Mosque in Mecca to the Furthest Mosque (al-Masjid al-Aqsa) in Jerusalem — Islam\'s sacred connection to the Temple Mount, the third holiest site in Islam.',
    verseRefs: ['QURAN.Al-Isra.17.1'],
    themeSlugs: ['god', 'prophecy'],
  },

  // ── The Red Heifer ────────────────────────────────────────────────────────
  {
    sourceKey: 'TORAH',
    statement: 'God commands the preparation of the most paradoxical purification: the ashes of a perfect red heifer, burned outside the camp, mixed with water — the water of lustration that cleanses those defiled by contact with death, yet renders the one who prepares it impure.',
    verseRefs: ['TORAH.Numbers.19.2', 'TORAH.Numbers.19.9'],
    figureSlugs: ['moses'],
    themeSlugs: ['law'],
  },
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'The author of Hebrews argues from lesser to greater: if the ashes of a heifer can sanctify the flesh, how much more will the blood of Christ — who offered himself without blemish to God — purify the conscience from dead works to serve the living God.',
    verseRefs: ['NEW_TESTAMENT.Hebrews.9.13'],
    figureSlugs: ['jesus'],
    themeSlugs: ['law', 'judgment'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'In Surah Al-Baqarah, God commands Moses to tell the Israelites to slaughter a cow — a divine test they resist with repeated questioning. When they finally comply, the cow\'s flesh miraculously reveals a murderer. The Quran\'s sacred cow narrative is related to but distinct from the red heifer purification law.',
    verseRefs: ['QURAN.Al-Baqarah.2.67'],
    figureSlugs: ['moses'],
    themeSlugs: ['law'],
  },

  // ── Noah ──────────────────────────────────────────────────────────────────
  {
    sourceKey: 'TORAH',
    statement: 'Noah is singled out as a righteous man, blameless in his generation, who walked with God — the same phrase used of Enoch, marking Noah as the one upright person in a generation consumed by violence and corruption.',
    verseRefs: ['TORAH.Genesis.6.9'],
    figureSlugs: ['noah'],
    themeSlugs: ['god', 'judgment'],
  },
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'Peter uses the days of Noah and the ark as a type of Christian salvation through baptism — as eight people were saved through water, so baptism now saves believers through the resurrection of Jesus Christ.',
    verseRefs: ['NEW_TESTAMENT.Matthew.24.2'],
    figureSlugs: ['noah', 'jesus'],
    themeSlugs: ['salvation', 'judgment'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'As the flood rises, Noah calls to his son to board the ark and not remain with the disbelievers — but his son refuses, saying a mountain will protect him, and he is drowned. The Quran uses this to illustrate that kinship cannot save those who reject faith.',
    verseRefs: ['QURAN.Hud.11.42'],
    figureSlugs: ['noah'],
    themeSlugs: ['judgment', 'prophecy'],
  },

  // ── Circumcision ─────────────────────────────────────────────────────────
  {
    sourceKey: 'TORAH',
    statement: 'God commands Abraham that every male in his household must be circumcised as the sign of the covenant — this is the foundational commandment of brit milah, observed by Jews on the 8th day of a male child\'s life.',
    verseRefs: ['TORAH.Genesis.17.10'],
    figureSlugs: ['abraham'],
    themeSlugs: ['law'],
  },
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'Paul argues that true circumcision is of the heart, by the Spirit — the physical circumcision of the flesh is not required for Gentile Christians, and those who insist on it are mutilating themselves.',
    verseRefs: ['NEW_TESTAMENT.Romans.3.28'],
    figureSlugs: ['abraham'],
    themeSlugs: ['law', 'salvation'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'The Quran commands believers to follow the religion of Ibrahim as a hanif (pure monotheist), the same Ibrahim whom God chose as a close friend — Islamic tradition understands this to include circumcision as part of the fitra (natural human state).',
    verseRefs: ['QURAN.Al-Baqarah.2.177'],
    figureSlugs: ['abraham', 'muhammad'],
    themeSlugs: ['law'],
  },

  // ── Trinity / Crucifixion ─────────────────────────────────────────────────
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'Jesus dies on the cross crying "My God, my God, why have you forsaken me?" — quoting Psalm 22:1 — and gives up his spirit; his death is the atoning sacrifice for the sins of all humanity, confirmed by the resurrection three days later.',
    verseRefs: ['NEW_TESTAMENT.Matthew.24.2'],
    figureSlugs: ['jesus'],
    themeSlugs: ['salvation', 'judgment'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'The Quran categorically denies that Jesus was killed or crucified — it was made to appear so — and affirms that God raised him up to Himself; those who dispute this have only conjecture and no certainty.',
    verseRefs: ['QURAN.An-Nisa.4.157'],
    figureSlugs: ['jesus'],
    themeSlugs: ['salvation', 'prophecy'],
  },
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'Jesus is declared to be the Christ, the Son of the living God — the first explicit apostolic confession of his divine messianic identity, which Jesus affirms as revealed by the Father in heaven.',
    verseRefs: ['NEW_TESTAMENT.Matthew.16.16'],
    figureSlugs: ['jesus'],
    themeSlugs: ['god', 'prophecy'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'The Quran rejects the Trinity, stating that those who say "God is the third of three" have disbelieved — there is only one God, and Jesus son of Mary was a messenger of God and His Word directed to Mary, not a divine person.',
    verseRefs: ['QURAN.Al-Maidah.5.73', 'QURAN.An-Nisa.4.171'],
    figureSlugs: ['jesus', 'mary'],
    themeSlugs: ['god'],
  },

  // ── Salvation ─────────────────────────────────────────────────────────────
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'Paul teaches that a person is justified by faith apart from works of the law — salvation is a gift of grace through faith in Christ, not earned through observance of the Mosaic commandments.',
    verseRefs: ['NEW_TESTAMENT.Romans.3.28'],
    figureSlugs: ['jesus'],
    themeSlugs: ['salvation', 'law'],
  },
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'In Christ there is neither Jew nor Greek, slave nor free, male nor female — all are one in Christ Jesus, and if you belong to Christ you are Abraham\'s offspring, heirs according to the promise.',
    verseRefs: ['NEW_TESTAMENT.Galatians.3.28'],
    figureSlugs: ['abraham', 'jesus'],
    themeSlugs: ['salvation', 'law'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'There is no compulsion in religion — the right path has been made clear from the wrong; this Quranic principle establishes freedom of belief as a divine decree, complicating later juridical rulings on apostasy.',
    verseRefs: ['QURAN.Al-Baqarah.2.256'],
    themeSlugs: ['law', 'salvation'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'Whoever reverts from their religion and dies as a disbeliever, their deeds become worthless in this world and the Hereafter, and they will be companions of the Fire — the Quranic warning for apostasy focuses on the afterlife rather than specifying an earthly penalty.',
    verseRefs: ['QURAN.Al-Baqarah.2.217'],
    themeSlugs: ['law', 'judgment'],
  },

  // ── Prophethood / Seal ────────────────────────────────────────────────────
  {
    sourceKey: 'TORAH',
    statement: 'Moses prophesies that God will raise up a prophet from among the Israelites who is like Moses — this prophet\'s words must be heeded; Christians apply this to Jesus, Muslims apply it to Muhammad.',
    verseRefs: ['TORAH.Deuteronomy.18.15'],
    figureSlugs: ['moses'],
    themeSlugs: ['prophecy', 'revelation'],
  },
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'Peter quotes Moses\'s prophecy about the future prophet and applies it to Jesus — Jesus is the prophet-like-Moses whom Israel was commanded to obey, now raised from the dead and exalted to God\'s right hand.',
    verseRefs: ['NEW_TESTAMENT.Acts.3.22'],
    figureSlugs: ['moses', 'jesus'],
    themeSlugs: ['prophecy', 'revelation'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'Muhammad is declared the Seal of the Prophets (Khatam an-Nabiyyin) — not the father of any man but the Messenger of God and the final prophet, after whom no new prophet will come.',
    verseRefs: ['QURAN.Al-Ahzab.33.40'],
    figureSlugs: ['muhammad'],
    themeSlugs: ['prophecy', 'revelation'],
  },

  // ── Women / Social Ethics ─────────────────────────────────────────────────
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'Paul instructs that he does not permit a woman to teach or exercise authority over a man — she is to remain quiet; this is the most cited text in debates about women\'s ordination and authority in the church.',
    verseRefs: ['NEW_TESTAMENT.1 Timothy.2.12'],
    themeSlugs: ['law', 'ethics'],
  },
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'Paul writes that in Christ there is no male or female — all are equally heirs of the promise of Abraham; egalitarian Christians use this verse to argue for women\'s full equality in church ministry.',
    verseRefs: ['NEW_TESTAMENT.Galatians.3.28'],
    figureSlugs: ['abraham', 'jesus'],
    themeSlugs: ['ethics', 'law'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'Men are declared to be in charge of (qawwamun) women by virtue of what God has given one over the other and because men provide for women from their wealth — the Quranic basis for male guardianship in Islamic law.',
    verseRefs: ['QURAN.An-Nisa.4.34'],
    themeSlugs: ['law', 'ethics'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'Allah commands justice, good conduct, giving to relatives, and forbids immorality, bad conduct, and oppression — the Quranic foundation for Islamic social ethics that applies equally to all people.',
    verseRefs: ['QURAN.An-Nahl.16.90'],
    themeSlugs: ['law', 'ethics'],
  },

  // ── Holy War / Jihad ──────────────────────────────────────────────────────
  {
    sourceKey: 'QURAN',
    statement: 'The Quran permits fighting those who fight you in the way of God, but prohibits transgressing limits — God does not love those who go beyond what is necessary; this establishes the foundational Quranic principle of defensive jihad.',
    verseRefs: ['QURAN.Al-Baqarah.2.190'],
    themeSlugs: ['law', 'holy-war'],
  },

  // ── Messianic Prophecy ────────────────────────────────────────────────────
  {
    sourceKey: 'HEBREW_BIBLE',
    statement: 'Isaiah prophesies that God Himself will give a sign: a young woman (almah) will conceive and bear a son called Immanuel ("God with us") — Christians read "almah" as "virgin" (parthenos in LXX) and apply this to the virgin birth of Jesus.',
    verseRefs: ['HEBREW_BIBLE.Isaiah.7.14'],
    figureSlugs: ['isaiah', 'mary', 'jesus'],
    themeSlugs: ['prophecy'],
  },
  {
    sourceKey: 'HEBREW_BIBLE',
    statement: 'Micah prophesies that a ruler of Israel will come from Bethlehem Ephrathah — a small and insignificant town — whose origins are from ancient days; Matthew cites this as fulfilled in Jesus\'s birth in Bethlehem.',
    verseRefs: ['HEBREW_BIBLE.Micah.5.2'],
    figureSlugs: ['jesus'],
    themeSlugs: ['prophecy'],
  },
  {
    sourceKey: 'HEBREW_BIBLE',
    statement: 'Malachi prophesies that God will send Elijah the prophet before the coming of the great and dreadful day of the LORD — Judaism interprets this as Elijah returning before the Messiah; Christianity interprets it as fulfilled by John the Baptist.',
    verseRefs: ['HEBREW_BIBLE.Malachi.4.5'],
    figureSlugs: ['elijah', 'john-the-baptist'],
    themeSlugs: ['prophecy'],
  },
  {
    sourceKey: 'HEBREW_BIBLE',
    statement: 'Psalm 22 opens with the cry "My God, my God, why have you forsaken me?" — a lament that Jesus quotes from the cross (Mark 15:34), which Christianity reads as a messianic prophecy fulfilled in the crucifixion.',
    verseRefs: ['HEBREW_BIBLE.Psalms.22.1'],
    figureSlugs: ['david', 'jesus'],
    themeSlugs: ['prophecy', 'salvation'],
  },

  // ── Ezra / Uzayr ─────────────────────────────────────────────────────────
  {
    sourceKey: 'QURAN',
    statement: 'The Quran states that the Jews call Uzair (Ezra) the son of God, just as Christians call the Messiah the son of God — both claims are rejected as distortions; the curse is upon those who say this.',
    verseRefs: ['QURAN.At-Tawbah.9.30'],
    figureSlugs: ['ezra'],
    themeSlugs: ['god'],
  },

  // ── Creation of Adam ──────────────────────────────────────────────────────
  {
    sourceKey: 'TORAH',
    statement: 'God forms Adam from the dust of the earth and breathes into his nostrils the breath of life — humanity is uniquely made from both earth and divine breath, setting humans apart from all other creatures.',
    verseRefs: ['TORAH.Genesis.2.7'],
    figureSlugs: ['adam'],
    themeSlugs: ['god'],
  },
  {
    sourceKey: 'TORAH',
    statement: 'God places enmity between the serpent\'s offspring and the woman\'s offspring — the woman\'s seed will crush the serpent\'s head while the serpent will strike his heel; Christians read this (the Protoevangelium) as the first messianic prophecy pointing to Jesus.',
    verseRefs: ['TORAH.Genesis.3.15'],
    figureSlugs: ['adam', 'eve', 'satan'],
    themeSlugs: ['prophecy', 'evil'],
  },

  // ── Enoch / Idris ────────────────────────────────────────────────────────
  {
    sourceKey: 'TORAH',
    statement: 'Enoch walked with God for 365 years, and then "was not, for God took him" — the Torah\'s terse account of the first human being taken to heaven without dying, a phrase that generated an enormous body of apocalyptic and mystical literature in all three traditions.',
    verseRefs: ['TORAH.Genesis.5.24'],
    figureSlugs: ['enoch'],
    themeSlugs: ['god', 'prophecy', 'lineage'],
  },
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'The author of Hebrews lists Enoch among the heroes of faith: "By faith Enoch was translated that he should not see death" — his translation is presented as the reward for a life that pleased God, a prototype of the resurrection hope.',
    verseRefs: ['NEW_TESTAMENT.Hebrews.11.5'],
    figureSlugs: ['enoch'],
    themeSlugs: ['salvation', 'prophecy'],
  },
  {
    sourceKey: 'NEW_TESTAMENT',
    statement: 'Jude quotes directly from the Book of Enoch: "Enoch, the seventh from Adam, prophesied, saying, Behold, the Lord cometh with ten thousands of his saints" — the only New Testament citation of an apocryphal text attributed to Enoch, giving the Book of Enoch apostolic weight.',
    verseRefs: ['NEW_TESTAMENT.Jude.1.14'],
    figureSlugs: ['enoch'],
    themeSlugs: ['prophecy', 'judgment'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'The Quran describes Idris as a siddiq (man of truth) and a prophet whom God "raised to a lofty station" — Islamic tradition identifies Idris with the biblical Enoch, and places him in the fourth heaven where Muhammad met him during the Night Journey (Mi\'raj).',
    verseRefs: ['QURAN.Maryam.19.56', 'QURAN.Maryam.19.57'],
    figureSlugs: ['enoch'],
    themeSlugs: ['prophecy', 'revelation'],
  },
  {
    sourceKey: 'QURAN',
    statement: 'Idris is listed alongside Ishmael and Dhul-Kifl among "the patient" — prophets praised for constancy and perseverance — confirming his status as a major prophetic figure in the Quranic tradition.',
    verseRefs: ['QURAN.Al-Anbiya.21.85'],
    figureSlugs: ['enoch', 'ishmael'],
    themeSlugs: ['prophecy'],
  },

  // ── The Akedah ────────────────────────────────────────────────────────────
  {
    sourceKey: 'TORAH',
    statement: 'God commands Abraham to take his son Isaac — the beloved, only son — to the land of Moriah and offer him as a burnt offering; Abraham obeys, but God provides a ram at the last moment; all three traditions debate the theological meaning of this test.',
    verseRefs: ['TORAH.Genesis.22.2'],
    figureSlugs: ['abraham', 'isaac'],
    themeSlugs: ['god', 'prophecy'],
  },
]

export async function seedClaims(prisma: PrismaClient) {
  const sources = await prisma.source.findMany()
  const sourceMap = new Map(sources.map((s) => [s.key, s.id]))

  const figures = await prisma.figure.findMany()
  const figureMap = new Map(figures.map((f) => [f.slug, f.id]))

  const themes = await prisma.theme.findMany()
  const themeMap = new Map(themes.map((t) => [t.slug, t.id]))

  const verses = await prisma.verse.findMany()
  const verseMap = new Map(verses.map((v) => [v.referenceKey, v.id]))

  for (const c of claimsData) {
    const sourceId = sourceMap.get(c.sourceKey)!
    const hash = claimHash(sourceId, c.statement)

    const claim = await prisma.claim.upsert({
      where: { contentHash: hash },
      update: {},
      create: {
        sourceId,
        statement: c.statement,
        contentHash: hash,
        notes: c.notes,
        isPublished: true,
      },
    })

    // Link verses (first is primary)
    for (let i = 0; i < c.verseRefs.length; i++) {
      const verseId = verseMap.get(c.verseRefs[i])
      if (!verseId) {
        console.warn(`  ⚠ Verse not found: ${c.verseRefs[i]}`)
        continue
      }
      await prisma.claimVerse.upsert({
        where: { claimId_verseId: { claimId: claim.id, verseId } },
        update: {},
        create: { claimId: claim.id, verseId, isPrimary: i === 0 },
      })
    }

    // Link figures
    for (const slug of c.figureSlugs ?? []) {
      const figureId = figureMap.get(slug)
      if (!figureId) continue
      await prisma.claimFigure.upsert({
        where: { claimId_figureId: { claimId: claim.id, figureId } },
        update: {},
        create: { claimId: claim.id, figureId },
      })
    }

    // Link themes
    for (const slug of c.themeSlugs ?? []) {
      const themeId = themeMap.get(slug)
      if (!themeId) continue
      await prisma.claimTheme.upsert({
        where: { claimId_themeId: { claimId: claim.id, themeId } },
        update: {},
        create: { claimId: claim.id, themeId },
      })
    }
  }

  console.log(`✓ Claims seeded (${claimsData.length} claims)`)
}
