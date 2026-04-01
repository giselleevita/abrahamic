import { PrismaClient } from '@prisma/client'

export async function seedTimeline(prisma: PrismaClient) {
  const events = [
    // ── PRIMORDIAL ─────────────────────────────────────────────────────────────
    {
      slug: 'creation-universe',
      name: 'Creation of the Universe',
      era: 'PRIMORDIAL' as const,
      position: 1,
      summary:
        'God creates the heavens, the earth, light, sky, land, seas, plants, celestial bodies, animals, and humanity over six days, resting on the seventh.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 1:1–2:3. The six-day creation account is foundational to the Jewish calendar (Sabbath rest). Rabbinic tradition interprets the days variously — 24-hour periods or divine epochs.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Identical to the Jewish account. John 1:1-3 identifies the Logos (Word/Jesus) as the agent of creation. The debate between literal 6-day creationism and theistic evolution is internal to Christianity.' },
        { tradition: 'ISLAMIC' as const, presence: 'MODIFIED' as const, notes: 'The Quran confirms God created the heavens and earth in six days (7:54, 10:3, 41:9–12) but does not enumerate what happened on each day. The six "days" (ayyam) may be epochs of indefinite length.' },
      ],
    },
    {
      slug: 'creation-of-adam',
      name: 'Creation of Adam',
      era: 'PRIMORDIAL' as const,
      position: 2,
      summary:
        'God forms the first human being from earth and breathes life into him. Adam is given dominion over creation.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 2:7. Adam (from adamah, "ground") is formed from dust. He is placed in the Garden of Eden to tend it. His creation completes the first account (Gen 1:27) and is elaborated in Gen 2.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Same account. Paul calls Jesus the "second Adam" (1 Cor 15:45) — Adam who brought death, Christ who brings life.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Adam is the first prophet in Islam. Quran 2:30-33: God announces to the angels He will place a khalifa (vicegerent) on earth. The angels prostrate to Adam; Iblis (Satan) refuses, establishing the central spiritual conflict.' },
      ],
    },
    {
      slug: 'creation-of-eve',
      name: 'Creation of Eve / Hawwa',
      era: 'PRIMORDIAL' as const,
      position: 3,
      summary:
        'God creates a companion for Adam — fashioning a woman from his rib (or side) and presenting her to him. She is recognized as "bone of my bones and flesh of my flesh."',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 2:21-23. Eve (Chavah — "mother of all living") is formed from Adam\'s tzela (rib or side). Adam\'s recognition of her as "bone of my bones" is the first recorded human speech in the Torah. The text establishes the foundation of marriage: "therefore a man shall leave his father and mother and cleave to his wife."' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Paul uses Eve\'s creation from Adam to establish a theology of gender relations (1 Cor 11:8-9). The Church Fathers frequently read Eve as a type of the Church, just as Adam is a type of Christ — bone of his bone, flesh of his flesh.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'The Quran confirms that God created humanity from a single soul and created its mate from it (Quran 4:1, 7:189). Eve (Hawwa) is not named in the Quran but is recognized in Islamic tradition. The Hadith confirms she was created from Adam\'s rib (Bukhari 3331). The narrative emphasizes unity of origin as the basis for human equality.' },
      ],
    },
    {
      slug: 'garden-of-eden',
      name: 'The Garden of Eden',
      era: 'PRIMORDIAL' as const,
      position: 4,
      summary:
        'God places Adam (and Eve) in a lush garden, providing every fruit except the fruit of the tree of knowledge of good and evil.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 2:8-25. The garden (Gan Eden) contains the Tree of Life and Tree of Knowledge. Eve is created from Adam\'s rib as his companion (ezer kenegdo). They are naked and unashamed.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Same account, but the Garden carries greater theological weight as the setting of the Fall that necessitates redemption. Revelation 22 depicts a restored Eden at the end of time.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'The Quran confirms Adam and his wife (unnamed) were placed in a garden (Jannah) and forbidden from one tree (Quran 2:35, 7:19). The location is not specified as Earth — some scholars place it in heaven before their descent.' },
      ],
    },
    {
      slug: 'the-fall',
      name: 'The Fall — Eating from the Forbidden Tree',
      era: 'PRIMORDIAL' as const,
      position: 5,
      summary:
        'Tempted by the serpent (or Iblis), the first humans eat the forbidden fruit, gaining knowledge of good and evil and introducing mortality.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 3:1-7. The serpent convinces Eve; she and Adam eat. Their eyes are opened; they feel shame. This is not called "the Fall" in Judaism — it is a turning point, but humans are not permanently corrupted. Repentance always remains available.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'The central catastrophe of salvation history. Adam and Eve\'s sin introduces death, spiritual separation from God, and a corrupted human nature into all their descendants. Redemption through Christ is the answer to this fall.' },
        { tradition: 'ISLAMIC' as const, presence: 'MODIFIED' as const, notes: 'Quran 7:20-22: Iblis (not a serpent) whispers to both Adam and Eve, causing them to eat. They both repent immediately and God forgives them (2:37). This is a test and a descent to earth (their appointed dwelling), not an eternal curse. No inherited guilt results.' },
      ],
    },
    {
      slug: 'expulsion-from-eden',
      name: 'Expulsion from Eden',
      era: 'PRIMORDIAL' as const,
      position: 6,
      summary:
        'Adam and Eve are expelled from the garden, placed into a world of toil, pain, and mortality. Cherubim guard the way back.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 3:22-24. The expulsion is to prevent Adam from eating from the Tree of Life and living forever in his fallen state. Cherubim with a flaming sword guard Eden. The ground is cursed; Adam must labor; Eve will have pain in childbirth.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'The expulsion marks the beginning of the fallen age. The flaming sword blocking the Tree of Life is undone by the Cross — Christ opens Paradise again (Luke 23:43).' },
        { tradition: 'ISLAMIC' as const, presence: 'MODIFIED' as const, notes: 'Quran 2:38, 7:24-25: God sends them down to earth ("get down, some of you enemies of others") with the promise that divine guidance will come. The descent is purposeful — they are khalifas (vicegerents) on earth. No mention of cherubim or Tree of Life.' },
      ],
    },
    {
      slug: 'cain-and-abel',
      name: 'Cain and Abel',
      era: 'PRIMORDIAL' as const,
      position: 7,
      summary:
        'The first children of Adam — Cain (a farmer) and Abel (a shepherd) — both offer sacrifices to God. God accepts Abel\'s but not Cain\'s, leading to the first murder.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 4:1-16. God\'s preference for Abel\'s offering is unexplained in the text (rabbinic sources suggest Cain\'s offering was not his best). God warns Cain "sin is crouching at the door" — the first explicit mention of moral struggle in the Bible.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Hebrews 11:4 says Abel offered "a more acceptable sacrifice" by faith. 1 John 3:12 uses Cain as the archetype of hatred and the world\'s rejection of righteousness. Revelation 6:9-10 echoes Abel\'s blood crying out.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Quran 5:27-32. Both sons of Adam offer sacrifices; one is accepted, one not. The rejected son threatens to kill his brother; the accepted one says he will not resist. This passage introduces the principle: "whoever kills one person, it is as if he killed all mankind." The murderer buries his victim, learning from a crow.' },
      ],
    },
    {
      slug: 'enoch-idris',
      name: 'Enoch / Idris',
      era: 'PRIMORDIAL' as const,
      position: 8,
      summary:
        'A righteous man in the seventh generation from Adam who "walked with God" and was taken by God without dying — the first ascent to heaven in recorded tradition.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 5:21-24. Enoch lived 365 years, "walked with God, and was not, for God took him." Enoch literature (1 Enoch, 2 Enoch, Jubilees) expands him into a major heavenly figure, angelic scribe, and receiver of cosmic secrets. He is identified with the angel Metatron in some traditions.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Hebrews 11:5 identifies Enoch as a man of faith "translated" to heaven without death. Jude 1:14-15 quotes from 1 Enoch, giving it apostolic weight. He is seen as a type of those who will be "raptured" at Christ\'s return.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Idris is mentioned in the Quran (19:56-57, 21:85) as a prophet, siddiq (truthful), and one God "raised to a high station." Islamic tradition identifies Idris with Enoch and sometimes with Hermes Trismegistus. He is placed in the fourth heaven in hadith accounts of the Prophet\'s night journey.' },
      ],
    },
    {
      slug: 'the-flood',
      name: "Noah's Flood",
      era: 'PRIMORDIAL' as const,
      position: 9,
      summary:
        'God, grieved by human wickedness, sends a catastrophic flood to cleanse the earth. Noah and his family survive in an ark, along with pairs of every animal.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 6-9. Noah is righteous in his generation (tamim — complete/blameless). He builds an ark per divine specifications. The flood lasts 40 days and nights. After it, God makes the covenant of the rainbow — never again to destroy the earth by flood. The seven Noahide laws are given to all humanity.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Matthew 24:37-39: Jesus uses Noah\'s flood as a type of the end times. 1 Peter 3:20-21: the ark is a type of baptism. Hebrews 11:7: Noah\'s faith in building the ark condemned the unbelieving world.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Nuh (Noah) is one of the five major prophets (ulu al-azm). Quran 71 is named after him. He preaches for 950 years and is rejected. The flood is God\'s judgment on disbelievers. His son (unnamed in Torah) refuses to board the ark and drowns — a dramatic departure from the Genesis narrative.' },
      ],
    },
    {
      slug: 'noah-covenant-rainbow',
      name: "The Rainbow Covenant with Noah",
      era: 'PRIMORDIAL' as const,
      position: 10,
      summary:
        'After the flood, God makes an unconditional covenant with Noah and all living creatures — sealing it with a rainbow as a sign that the earth will never again be destroyed by flood.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 9:8-17. The Noahide covenant is the first post-flood covenant, binding on all humanity. The seven Noahide laws (prohibiting idolatry, blasphemy, murder, theft, sexual immorality, eating flesh torn from a living animal, and requiring courts of law) are derived from this covenant by the Talmud. The rainbow (keshet) remains the sign of this promise.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'The rainbow covenant confirms God\'s patience and mercy toward all creation. Some Christian theologians see it as a "common grace" covenant — God\'s provision for the entire human family, distinct from the redemptive covenants with Abraham and Israel.' },
        { tradition: 'ISLAMIC' as const, presence: 'MODIFIED' as const, notes: 'The Quran describes God\'s covenant with the prophets generally (33:7) and confirms Nuh\'s deliverance and the destruction of the disbelievers. The specific rainbow sign is not mentioned in the Quran; the covenant with all of humanity is implied in the survival of Nuh\'s family.' },
      ],
    },
    {
      slug: 'tower-of-babel',
      name: 'Tower of Babel',
      era: 'PRIMORDIAL' as const,
      position: 11,
      summary:
        'Humanity, speaking one language, attempts to build a tower to heaven. God scatters them by confusing their languages, creating the diversity of nations.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 11:1-9. The episode explains the origin of languages and the dispersion of nations. Midrashic tradition elaborates on what the builders intended — some say they wanted to fight God; others say they wanted to prevent another flood.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Acts 2 (Pentecost) is often read as the reversal of Babel — the Spirit enables people of every nation to understand each other, reuniting what was divided. The confusion of languages becomes intelligible speech.' },
        { tradition: 'ISLAMIC' as const, presence: 'SILENT' as const, notes: 'The Quran does not mention the Tower of Babel or the confusion of languages. Some Islamic scholars reference it from Israelite traditions (Isra\'iliyyat) but it has no Quranic basis.' },
      ],
    },

    {
      slug: 'noahs-drunkenness',
      name: "Noah's Drunkenness and the Curse of Ham",
      era: 'PRIMORDIAL' as const,
      position: 12,
      summary:
        'After the flood, Noah plants a vineyard, becomes drunk, and lies uncovered in his tent. His son Ham sees him and tells his brothers. Noah curses Ham\'s son Canaan when he awakens — one of the most debated passages in all of scripture.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 9:20-27. The nature of Ham\'s sin is debated in rabbinic literature — whether he merely looked without covering his father, or committed a worse act. The curse falls on Canaan, not Ham, which Midrash explains as the punishment affecting Ham through his beloved son. This episode is the narrative justification for the Israelite conquest of Canaan.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'The passage is acknowledged in Christian tradition. Church Fathers read it variously — as prefiguring the dishonor done to Christ, or as a warning about the consequences of sin even in the most righteous. The curse of Canaan was infamously and catastrophically misread in later centuries to justify slavery, a reading universally rejected by modern scholarship and theology.' },
        { tradition: 'ISLAMIC' as const, presence: 'SILENT' as const, notes: 'The Quran does not narrate this episode. Islamic tradition does not include this specific story about Nuh\'s drunkenness. The Quran presents Nuh as a prophet of the highest moral standing, and accounts of prophetic weakness like this are generally absent or reinterpreted.' },
      ],
    },

    // ── PATRIARCHAL ────────────────────────────────────────────────────────────
    {
      slug: 'call-of-abraham',
      name: 'The Call of Abraham / Ibrahim',
      era: 'PATRIARCHAL' as const,
      position: 20,
      summary:
        'God calls a man from Ur of the Chaldeans to leave his homeland and go to a promised land, initiating the covenant that defines all three traditions.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 12:1-3. God calls Abram: "Go from your land, your birthplace, your father\'s house, to the land I will show you." The promises: a great nation, a blessed name, and being a blessing to all families of the earth. This is the founding covenant of the Jewish people.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Romans 4: Abraham is the father of faith — he believed God, and it was credited to him as righteousness. Galatians 3:6-9: the promise to Abraham that "all nations will be blessed through him" is fulfilled in Christ. Christians are "heirs of Abraham" by faith.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Ibrahim is called hanif — a pure monotheist who broke with his idol-worshipping family (Quran 9:114, 6:74-83). He is the father of both Ishmael (ancestor of the Arabs) and Isaac. The Kaaba in Mecca was built by Ibrahim and Ishmael (2:127). He is called "khalilullah" — the friend of God.' },
      ],
    },
    {
      slug: 'covenant-of-circumcision',
      name: 'The Covenant of Circumcision',
      era: 'PATRIARCHAL' as const,
      position: 21,
      summary:
        'God commands Abraham to circumcise himself and all males of his household as a physical sign of the covenant — establishing a rite that persists across all three traditions, though with radically different meanings.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 17:9-14. Circumcision (brit milah) is the sign of God\'s covenant with Abraham and his descendants. It is performed on the eighth day of life for Jewish male infants. Failure to be circumcised "cuts off" a male from the covenant people. It remains the most universal Jewish practice across all denominations.' },
        { tradition: 'CHRISTIAN' as const, presence: 'MODIFIED' as const, notes: 'Paul argues in Romans and Galatians that physical circumcision is not required for Gentile Christians — it is the "circumcision of the heart" (spiritual renewal) that matters (Romans 2:29). The Jerusalem Council (Acts 15) confirmed that Gentiles need not be circumcised. Circumcision became a major controversy in the early church.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Circumcision (khitan) is considered a Sunnah (prophetic practice) in Islam and a mark of the Abrahamic covenant. It is not mentioned by name in the Quran but is established through hadith. Ibrahim is described as circumcising himself at an advanced age (Bukhari 3356). It is near-universal among Muslim males.' },
      ],
    },
    {
      slug: 'hagar-and-ishmael',
      name: 'Hagar and Ishmael',
      era: 'PATRIARCHAL' as const,
      position: 22,
      summary:
        'Abraham\'s Egyptian servant Hagar bears his son Ishmael. After Sarah demands their expulsion, God appears to Hagar in the wilderness and promises that Ishmael will become a great nation.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 16, 21. Hagar flees Sarah\'s harsh treatment and is met by the angel of the LORD at a spring — naming God "El-Roi" (the God who sees me). After their final expulsion, God hears the child\'s cry and shows Hagar a well. Ishmael is promised 12 princes and a great nation. Jewish tradition generally sees Ishmael as a separate branch from the main covenant line.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Paul reads Hagar and Ishmael allegorically in Galatians 4:21-31 — Hagar represents the Sinai covenant and the law; Sarah represents the covenant of promise and freedom. This allegorical reading is one of the most controversial in Paul\'s letters.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Hagar (Hajar) is highly honoured in Islam. Her running between the hills of Safa and Marwa searching for water for Ishmael is the origin of the Sa\'i ritual of Hajj. The well of Zamzam that sprang up for Ishmael is the most sacred water in Islam. Ishmael is considered the ancestor of the Arabs and the Prophet Muhammad.' },
      ],
    },
    {
      slug: 'birth-of-isaac',
      name: 'The Birth of Isaac',
      era: 'PATRIARCHAL' as const,
      position: 23,
      summary:
        'Sarah, well past childbearing age, miraculously conceives and bears a son named Isaac — the child of promise through whom the covenant line will continue.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 21:1-7. Sarah laughs (yitzchak — the origin of the name Isaac) when told she will conceive in old age. God fulfills the impossible promise. Isaac is the heir of the covenant; through him come Jacob and the twelve tribes of Israel. Abraham\'s binding of Isaac (Akedah) is the supreme test of faith.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Paul uses Isaac\'s miraculous birth as a paradigm of grace — what is impossible with humans is possible with God (Romans 4:19-21). Hebrews 11:11 credits Sarah\'s faith. Isaac is a type of Christ: the son of promise who is offered and returned.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'The Quran confirms the angels brought Ibrahim the good news of a "knowledgeable son" (Isaac) to Sarah in her old age (Quran 51:28-30). Isaac (Ishaq) is a prophet in Islam and the father of Yaqub (Jacob). He is honoured as a messenger, though Ishmael holds a more prominent place in Islamic narrative.' },
      ],
    },
    {
      slug: 'sacrifice-of-the-son',
      name: 'The Binding / The Sacrifice',
      era: 'PATRIARCHAL' as const,
      position: 24,
      summary:
        'God commands Abraham to sacrifice his son. Abraham obeys. At the last moment, God intervenes and provides a ram. Which son — Isaac or Ishmael — is the central point of divergence between traditions.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 22 (the Akedah — "binding"). Isaac is explicitly named as the son to be sacrificed. This event is the supreme test of Abraham\'s faith and is recalled in Rosh Hashanah prayers. It foreshadows the Temple sacrificial system.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'The Akedah is a type of the Crucifixion: Abraham offering his son prefigures God the Father offering Jesus. Hebrews 11:17-19 says Abraham expected God to raise Isaac from the dead. The ram caught in the thicket foreshadows substitutionary atonement.' },
        { tradition: 'ISLAMIC' as const, presence: 'MODIFIED' as const, notes: 'Quran 37:99-111 describes Ibrahim offering to sacrifice his son but does not name the son. The majority of Islamic scholars identify the intended sacrifice as Ishmael, not Isaac — making this the founding event of the annual Eid al-Adha sacrifice. The story underscores total submission (islam) to God.' },
      ],
    },
    {
      slug: 'jacobs-ladder',
      name: "Jacob's Ladder at Bethel",
      era: 'PATRIARCHAL' as const,
      position: 25,
      summary:
        'Fleeing from his brother Esau, Jacob falls asleep at Bethel and dreams of a ladder reaching from earth to heaven, with angels ascending and descending. God renews the Abrahamic covenant with him.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 28:10-22. God confirms to Jacob the promises made to Abraham and Isaac — the land, the nation, and the blessing. Jacob wakes and declares "How awesome is this place — this is none other than the house of God, the gate of heaven." He names the place Bethel (House of God) and vows a tithe. Later Jacob is renamed Israel (Genesis 32).' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Jesus identifies himself with the ladder in John 1:51: "You will see heaven opened, and the angels of God ascending and descending on the Son of Man." Jacob\'s ladder is thus a Christological type — Christ is the connection between heaven and earth.' },
        { tradition: 'ISLAMIC' as const, presence: 'MODIFIED' as const, notes: 'The Quran confirms Yaqub (Jacob) as a prophet and patriarch (Quran 19:49, 21:72). The specific vision at Bethel is not narrated in the Quran, but Jacob\'s role as patriarch of the twelve tribes is affirmed. His son Yusuf (Joseph) receives a full surah in the Quran.' },
      ],
    },
    {
      slug: 'joseph-in-egypt',
      name: 'Joseph and Egypt',
      era: 'PATRIARCHAL' as const,
      position: 26,
      summary:
        'Joseph, sold into slavery by his brothers, rises through divine providence to become second-in-command of Egypt — saving the region from famine and enabling his family\'s survival.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 37-50. Joseph\'s story is the longest continuous narrative in Genesis. His ability to interpret dreams is a divine gift. "You intended harm against me; God intended it for good" (50:20) is the narrative\'s theological center. His death in Egypt and the promise to carry his bones to Canaan bridges the book of Genesis to the Exodus story.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Joseph is widely read as a type of Christ: rejected by his own brothers, falsely accused, imprisoned, raised to glory, and ultimately forgiving and saving those who wronged him. Stephen\'s speech in Acts 7 reads Joseph as a preview of Israel\'s rejection of its saviors.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Surah Yusuf (Chapter 12) is dedicated entirely to Joseph\'s story, which the Quran calls "the best of stories" (ahsan al-qasas). The Quranic account closely parallels Genesis but adds a famous scene where Egyptian women cut their hands upon seeing Yusuf\'s beauty. His nobility, patience, and chastity are emphasized. He is one of the most beloved prophets in Islam.' },
      ],
    },

    // ── EXODUS ──────────────────────────────────────────────────────────────────
    {
      slug: 'birth-of-moses',
      name: 'Birth and Early Life of Moses',
      era: 'EXODUS' as const,
      position: 30,
      summary:
        'Moses is born during Pharaoh\'s decree to kill all Hebrew male infants, hidden in a basket on the Nile, discovered by Pharaoh\'s daughter, and raised in the Egyptian royal court.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Exodus 2:1-10. Moses is saved by his mother Jochebed and sister Miriam\'s ingenuity. He is raised as an Egyptian prince but retains his identity. As an adult, he kills an Egyptian taskmaster to defend a Hebrew slave and flees to Midian, where he marries Zipporah and lives as a shepherd for 40 years before God\'s call.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Matthew\'s account of the Holy Family fleeing to Egypt (2:13-15) and the slaughter of the innocents (2:16-18) is explicitly modeled on Moses\' birth narrative. Jesus relives and fulfills the Moses story. Hebrews 11:24-27 celebrates Moses\' choice to identify with his people rather than enjoy Egypt\'s pleasures.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Quran 28:7-13 narrates God\'s command to Musa\'s mother to place him in the river and the promise of his return. Pharaoh\'s wife Asiya (revered in Islam as one of the four greatest women) adopts Moses against Pharaoh\'s will. His story is narrated extensively across multiple surahs (20, 26, 28).' },
      ],
    },
    {
      slug: 'burning-bush',
      name: 'The Burning Bush',
      era: 'EXODUS' as const,
      position: 31,
      summary:
        'God appears to Moses in a burning bush that is not consumed, revealing the divine name and commissioning Moses to return to Egypt and lead the Israelites to freedom.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Exodus 3:1-15. On Mount Horeb (Sinai), God appears in fire within a thorn-bush. God reveals the name YHWH: "Ehyeh-Asher-Ehyeh" — "I am/will be what I am/will be." This divine self-disclosure is the theological foundation of Jewish monotheism. Moses is commissioned as prophet, lawgiver, and redeemer.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Jesus uses the burning bush to argue for the resurrection of the dead (Mark 12:26): at the bush, God identified himself as "the God of Abraham, Isaac, and Jacob" — implying they are still living before Him. The Church Fathers read the burning fire as a type of the Holy Spirit and the un-consumed bush as Mary\'s virginity.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Quran 28:29-30 and 20:9-14 narrate Musa seeing a fire and approaching it, at which point God speaks to him from it. God declares: "I am Allah, there is no god but Me — worship Me and establish prayer." The burning bush scene becomes Musa\'s prophetic commissioning and the revelation of tawhid.' },
      ],
    },
    {
      slug: 'ten-plagues',
      name: 'The Ten Plagues of Egypt',
      era: 'EXODUS' as const,
      position: 32,
      summary:
        'God sends ten catastrophic plagues upon Egypt to compel Pharaoh to release the Israelites: blood, frogs, lice, flies, livestock disease, boils, hail, locusts, darkness, and the death of the firstborn.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Exodus 7-12. The plagues demonstrate God\'s absolute sovereignty over Egyptian gods (each plague targets a domain associated with an Egyptian deity). Pharaoh\'s heart is hardened — both by himself and by God — raising deep questions about free will and divine sovereignty. The Passover Seder commemorates the plagues annually, dropping wine from the cup for each one out of empathy for human suffering.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'The plagues are read typologically — the final plague (death of the firstborn) points to the sacrifice of the Lamb of God. Revelation\'s apocalyptic plagues (Rev 8-9, 15-16) are modeled directly on the Egyptian plagues. The Exodus plagues frame the book of Revelation\'s end-time narrative.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'The Quran confirms that Musa was sent with clear signs (ayat) to Pharaoh (7:133-136), specifying the flood, locusts, lice, frogs, and blood as signs. The plagues are presented as divine proofs that Pharaoh and his court consistently denied. The Quranic emphasis is on Pharaoh\'s arrogance and ultimate drowning.' },
      ],
    },
    {
      slug: 'passover-institution',
      name: 'The Passover',
      era: 'EXODUS' as const,
      position: 33,
      summary:
        'On the night before the Exodus, God commands Israel to slaughter a lamb, mark their doorposts with its blood, eat the meal in haste, and observe this night as a perpetual festival — the Passover.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Exodus 12. Pesach is the oldest and most universally observed Jewish festival. The Seder meal re-enacts the Exodus: bitter herbs (maror) for slavery, matzah for haste, four cups of wine for the four divine promises of redemption. "In every generation, each person is obligated to see himself as if he personally left Egypt" (Mishnah Pesachim 10:5).' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Jesus\' Last Supper was a Passover Seder (Synoptic Gospels). His death on the cross at Passover fulfills the Passover lamb typology: "Christ, our Passover, has been sacrificed" (1 Corinthians 5:7). The Eucharist is a direct development of the Passover meal. Easter is theologically and calendrically linked to Passover.' },
        { tradition: 'ISLAMIC' as const, presence: 'MODIFIED' as const, notes: 'The Quran confirms the Exodus and Musa\'s deliverance of his people but does not detail the Passover institution. The Prophet Muhammad, upon arriving in Medina and finding Jews fasting on Ashura (10th of Muharram), asked about it and was told it commemorated Musa\'s salvation. He ordered Muslims to fast on that day too, as an act of solidarity with Moses.' },
      ],
    },
    {
      slug: 'exodus-crossing',
      name: 'The Exodus and Crossing of the Sea',
      era: 'EXODUS' as const,
      position: 34,
      summary:
        'After ten plagues, Pharaoh releases the Israelites. God parts the sea before them, drowning Pharaoh\'s army, completing Israel\'s liberation.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'The Exodus is the defining event of Jewish history — experienced annually at Passover. The splitting of the Reed Sea and the destruction of Pharaoh\'s army are celebrated in the Song of the Sea (Exodus 15). "I am the LORD your God who brought you out of Egypt" opens the Ten Commandments.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: '1 Corinthians 10:1-4: Paul reads the Exodus typologically — the cloud and the sea are baptism, the manna is spiritual food, Christ was with Israel. Passover becomes the prototype of the Lord\'s Supper. Jesus is "our Passover lamb" (1 Cor 5:7).' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Musa is the most-mentioned prophet in the Quran (136 times). His confrontation with Pharaoh and the crossing are narrated in Surahs 26, 20, and 7. God parts the sea for Musa; Pharaoh drowns but his body is preserved as a sign (10:92). The Prophet Muhammad fasted on Ashura to honor Moses\' deliverance.' },
      ],
    },
    {
      slug: 'ten-commandments',
      name: 'The Ten Commandments at Sinai',
      era: 'EXODUS' as const,
      position: 35,
      summary:
        'God gives Moses the foundational law on Mount Sinai, establishing the moral and covenantal basis for Israel — and by extension, for Western religious ethics.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Exodus 20, Deuteronomy 5. The Decalogue (Ten Words/Commandments) is the heart of the Sinai covenant. In Judaism, all 613 commandments of the Torah derive their authority from this theophany. The Sabbath commandment is especially central.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'The Ten Commandments remain morally authoritative in Christianity, though the ceremonial law (Sabbath, dietary laws) is reinterpreted in Christ. Jesus summarizes all commandments in two: love God and love neighbor (Matthew 22:37-40).' },
        { tradition: 'ISLAMIC' as const, presence: 'MODIFIED' as const, notes: 'The Quran describes God giving Musa the tablets (7:145) containing guidance and mercy. Quran 17:22-39 contains a similar moral summary (do not associate partners with God, honor parents, do not kill, etc.) sometimes compared to the Decalogue. The specific ten are not enumerated.' },
      ],
    },
    {
      slug: 'red-heifer-commandment',
      name: 'The Red Heifer — Statute of Purification',
      era: 'EXODUS' as const,
      position: 36,
      summary:
        'God commands the preparation of a perfect red cow whose ashes, mixed with water, purify those defiled by contact with the dead — yet paradoxically render the priest who prepares it impure. The rabbis called this the archetype of all divine commands that transcend human logic.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Numbers 19. The parah adumah (red heifer) is the classical chok — a statute without a disclosed reason. Only nine were ever prepared in all of history; the tenth will be prepared by the Messiah. The paradox (it purifies the impure while making the pure impure) is treated by the Talmud as the supreme example of faith that transcends understanding. "The dead do not defile, nor does water purify — it is a decree of the King of Kings."' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Hebrews 9:13-14 reads the red heifer as a type (prefigurement) of Christ\'s atoning sacrifice. The ashes that cleanse the physically defiled point to the blood of Christ that cleanses the conscience from dead works. The heifer was offered outside the camp — as Jesus was crucified outside Jerusalem (Hebrews 13:12). The perfect red cow without blemish prefigures the sinless Christ.' },
        { tradition: 'ISLAMIC' as const, presence: 'MODIFIED' as const, notes: 'The Quran contains a related but distinct sacred cow narrative (Surah Al-Baqarah 2:67-73): God commands Moses to instruct Israel to slaughter a cow to reveal a murderer. The Israelites delay with questions about the cow\'s description, color, and condition — a lesson in over-complicating divine commands. The story gives Surah Al-Baqarah its name ("The Cow") but is a separate miracle from the Numbers 19 purification law.' },
      ],
    },
    {
      slug: 'golden-calf',
      name: 'The Golden Calf',
      era: 'EXODUS' as const,
      position: 36,
      summary:
        'While Moses is on Mount Sinai receiving the Torah, the Israelites persuade Aaron to make them a golden calf to worship. This near-catastrophic act of idolatry tests God\'s covenant with Israel.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Exodus 32. Moses intercedes for Israel, and God relents from destroying the nation. The Levites rally to Moses and execute the idolaters. Moses grinds the calf to powder. This is treated in the Talmud as the paradigmatic sin of Israel — all subsequent national tragedies are connected to it. Yom Kippur was established, according to tradition, on the day Moses received the second tablets of the law.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: '1 Corinthians 10:7 warns Christians not to be idolaters "as some of them were" — directly referencing the golden calf. Stephen\'s speech in Acts 7 uses Israel\'s idolatry as the pattern of rejecting God\'s messengers, culminating in the rejection of Jesus. The golden calf becomes a warning against spiritual complacency.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Quran 20:83-97 narrates the golden calf story in detail. Al-Samiri (the Samaritan) fashioned the calf, which could moo, by throwing a handful of dust from the angel\'s footprint into the golden idol. Musa angrily confronts Harun (Aaron). The Quranic account is significant in that Harun\'s role is less central and Al-Samiri bears the blame.' },
      ],
    },

    // ── KINGDOM ────────────────────────────────────────────────────────────────
    {
      slug: 'david-anointed-king',
      name: 'David Anointed as King',
      era: 'KINGDOM' as const,
      position: 40,
      summary:
        'The prophet Samuel anoints David — the youngest son of Jesse, a shepherd boy — as the chosen king of Israel, bypassing his older brothers.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: '1 Samuel 16. God\'s selection criteria confound human expectations: "Man looks at the outward appearance, but the LORD looks at the heart" (16:7). David becomes the standard for all subsequent kings. His reign is idealized as Israel\'s golden age. The Messiah (Mashiach) will be a descendant of David — this "Davidic covenant" (2 Samuel 7) is the foundation of Jewish messianic hope.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'The Gospels of Matthew and Luke trace Jesus\'s genealogy to David, establishing his messianic credentials. Jesus is called "Son of David" (Matthew 1:1). The New Testament reads David\'s anointing as a foreshadowing of Christ\'s anointing (the word Christ = Christos = "the Anointed One"). Acts 13:22-23 presents Jesus as the fulfillment of David\'s line.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Dawud (David) is a prophet and king in Islam, given the Zabur (Psalms) as divine scripture (Quran 4:163, 17:55). He is described as a caliph (vicegerent) on earth (38:26) with divine wisdom and judgment. The Quran credits Dawud with the invention of iron armor (21:80). He is praised for his repentance and constant remembrance of God (38:17-20).' },
      ],
    },
    {
      slug: 'solomons-temple',
      name: "Solomon's Temple",
      era: 'KINGDOM' as const,
      position: 41,
      summary:
        'Solomon builds the First Temple in Jerusalem — the central sanctuary of Israelite worship and the dwelling place of God\'s presence on earth.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: '1 Kings 5-8. Solomon builds the Temple on Mount Moriah (where Abraham bound Isaac) over seven years. The Ark of the Covenant is installed in the Holy of Holies; the Shekhina (divine presence) descends in a cloud. The Temple became the center of Jewish worship until its destruction by Babylon in 586 BCE. The destruction is mourned on Tisha B\'Av.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Jesus identifies his own body as the Temple (John 2:19-21). The tearing of the Temple curtain at the crucifixion (Mark 15:38) signals the end of the Temple system. Paul teaches that Christians are the Temple of the Holy Spirit (1 Corinthians 3:16-17). Revelation 21 describes the New Jerusalem as having no Temple because God himself is its Temple.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Sulaiman (Solomon) is a major prophet and king in Islam, given extraordinary power over humans, jinn, and animals (Quran 27:15-44, 34:12-14). He is described as building a magnificent palace and the Quran affirms his construction of a great edifice. The Temple Mount (Masjid al-Aqsa) is the third holiest site in Islam — from which Muhammad ascended on the Night Journey.' },
      ],
    },
    {
      slug: 'elijah-and-the-prophets-of-baal',
      name: 'Elijah and the Prophets of Baal',
      era: 'KINGDOM' as const,
      position: 42,
      summary:
        'The prophet Elijah challenges 450 prophets of Baal to a contest on Mount Carmel: whose God will answer by fire? YHWH sends fire; Baal does not answer. This becomes the defining moment of the prophetic tradition.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: '1 Kings 18. Elijah\'s contest on Mount Carmel is the supreme demonstration of YHWH\'s power over pagan deities. The prophets of Baal cry out all day to no avail; Elijah mocks them. God\'s fire consumes Elijah\'s water-drenched sacrifice. The prophets of Baal are killed. Elijah then flees from Jezebel to Mount Horeb, where God appears to him not in wind, earthquake, or fire, but in a "still small voice." He is associated with the coming of the Messiah (Malachi 4:5).' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Elijah appears at the Transfiguration alongside Moses (Mark 9:4) — representing the prophets as Moses represents the Law. James 5:17-18 cites Elijah\'s prayer that closed and opened the heavens as a model for powerful intercessory prayer. Jesus is identified with Elijah\'s spirit by some (Mark 6:15). John the Baptist comes "in the spirit and power of Elijah" (Luke 1:17).' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Ilyas (Elijah) is mentioned in the Quran (6:85, 37:123-132) as a righteous prophet sent to a people who worshipped Baal (Ba\'l). His people rejected him; God saved him. He is praised as among the best of God\'s servants. Islamic tradition sometimes identifies Ilyas with al-Khidr, the mysterious guide of Musa — though this is disputed.' },
      ],
    },
    {
      slug: 'babylonian-exile',
      name: 'The Babylonian Exile',
      era: 'KINGDOM' as const,
      position: 43,
      summary:
        'Nebuchadnezzar of Babylon destroys Jerusalem and the First Temple (586 BCE) and deports the Jewish population to Babylon — the most traumatic event in ancient Jewish history.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: '2 Kings 24-25; Jeremiah, Ezekiel, Lamentations. The destruction of the Temple and exile to Babylon is mourned on Tisha B\'Av. The exile forced a transformation of Jewish religion: without Temple sacrifice, prayer, Torah study, and synagogue worship became the center of Jewish life. This transformation — led by Ezra and the prophets of the exile — shaped the Judaism that survived. "How can we sing the LORD\'s song in a foreign land?" (Psalm 137).' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Matthew\'s genealogy (1:17) divides Jewish history into three periods of 14 generations, making the Babylonian exile a turning point. The exile is read typologically as the condition of humanity apart from God — in exile, longing for return. Isaiah 40-55 (Deutero-Isaiah), written during or after exile, contains the Servant Songs, which Christianity reads as prophecies of Christ.' },
        { tradition: 'ISLAMIC' as const, presence: 'MODIFIED' as const, notes: 'The Quran references the Children of Israel\'s punishment for corruption in the land (17:4-8), which Islamic commentators identify with the Babylonian exile and later Roman destruction. The Quran does not name Nebuchadnezzar or the specific historical events but affirms God\'s pattern of raising nations against Israel when they transgressed.' },
      ],
    },
    {
      slug: 'return-from-exile',
      name: 'The Return from Exile',
      era: 'KINGDOM' as const,
      position: 44,
      summary:
        'After 70 years in Babylon, the Persian king Cyrus issues a decree allowing the Jews to return to their homeland and rebuild the Temple — fulfilling Jeremiah\'s prophecy.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Ezra 1-2; Nehemiah. Cyrus the Great is called God\'s "anointed" (mashiach) in Isaiah 45:1 — the only non-Israelite given this title. He decrees the return (538 BCE). The Second Temple is completed in 516 BCE. Ezra restores Torah observance; Nehemiah rebuilds Jerusalem\'s walls. The return inaugurates the Second Temple Period (516 BCE–70 CE).' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Isaiah\'s prophecy of Cyrus (45:1) is a remarkable fulfilled prophecy cited by Christians as evidence of divine foreknowledge. The restoration of Israel after exile is read typologically as the resurrection — death and return to life. The rebuilt Temple is the context for Malachi\'s prophecy of a coming messenger (3:1), which Christians identify with John the Baptist.' },
        { tradition: 'ISLAMIC' as const, presence: 'MODIFIED' as const, notes: 'The Quran\'s passage about the second lifting of Israel\'s punishment (17:7-8) is sometimes read by commentators as the return from exile and rebuilding of the Temple. The Quran confirms God\'s pattern of restoration after punishment. Cyrus is sometimes identified with Dhul-Qarnayn in Islamic tradition (18:83-98), though this identification is disputed.' },
      ],
    },

    // ── GOSPEL ─────────────────────────────────────────────────────────────────
    {
      slug: 'birth-of-jesus',
      name: 'Birth of Jesus / Isa',
      era: 'GOSPEL' as const,
      position: 50,
      summary:
        'A child is born to a virgin woman in Bethlehem / announced to Mary. All three Abrahamic traditions have a position on this event, but its significance differs radically.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'SILENT' as const, notes: 'The Hebrew Bible contains no account of Jesus\' birth. Some rabbinic texts acknowledge a historical figure called Yeshu. Traditional Judaism does not recognize Jesus as the Messiah, as he did not fulfill the messianic prophecies (rebuilding the Temple, gathering all Jews to Israel, universal peace).' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'The Nativity is the Incarnation — God becomes human. Matthew 1-2 emphasizes the fulfillment of Messianic prophecy (Isaiah 7:14). Luke 1-2 gives the annunciation and birth narrative. The virgin birth is central to Christology: Jesus is fully divine and fully human.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Quran 19 (Surah Maryam) narrates Mary\'s purity, the annunciation by the angel, and Jesus\' miraculous birth. Jesus (Isa) is born speaking from the cradle (19:30-33). He is "a word from God" (3:45) and a prophet, but not divine. The virgin birth is affirmed; Jesus as son of God is denied.' },
      ],
    },
    {
      slug: 'baptism-of-jesus',
      name: "Jesus' Baptism by John",
      era: 'GOSPEL' as const,
      position: 51,
      summary:
        'Jesus is baptized by John the Baptist in the Jordan River. A voice from heaven declares him God\'s Son, and the Spirit descends like a dove — marking the beginning of his public ministry.',
      traditions: [
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'All four Gospels record the baptism (Matthew 3:13-17, Mark 1:9-11, Luke 3:21-22, John 1:29-34). The voice from heaven says "This is my beloved Son, in whom I am well pleased." The Trinity is implicitly revealed: the Son is baptized, the Spirit descends, the Father speaks. Christian baptism is modeled on this event.' },
        { tradition: 'JEWISH' as const, presence: 'SILENT' as const, notes: 'The immersion (tevilah) in water for ritual purification is a standard Jewish practice. John\'s baptism was likely modeled on Jewish mikveh practices. Judaism does not assign theological significance to Jesus\' baptism.' },
        { tradition: 'ISLAMIC' as const, presence: 'SILENT' as const, notes: 'The Quran does not describe Jesus\' baptism. Islamic tradition emphasizes Isa\'s prophethood and his miraculous birth and speech from the cradle rather than this event.' },
      ],
    },
    {
      slug: 'sermon-on-the-mount',
      name: 'The Sermon on the Mount',
      era: 'GOSPEL' as const,
      position: 52,
      summary:
        'Jesus delivers his most extended moral and spiritual teaching — the Beatitudes, the Lord\'s Prayer, teachings on anger, lust, divorce, oaths, prayer, fasting, and the Golden Rule.',
      traditions: [
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Matthew 5-7 (Luke 6:17-49 records a "Sermon on the Plain"). The Sermon is the ethical constitution of Christianity — often called "the greatest sermon ever preached." It begins with the Beatitudes (blessings for the humble, the merciful, the peacemakers) and culminates in the call to build one\'s house on rock. Jesus contrasts his teaching with Torah: "You have heard it said... but I say to you."' },
        { tradition: 'JEWISH' as const, presence: 'MODIFIED' as const, notes: 'The Sermon draws heavily on the Hebrew prophets, Psalms, and rabbinic ethics. Many of the teachings parallel passages in the Talmud. Jewish scholars generally appreciate the ethical teachings while rejecting the implicit claim of Jesus as a new lawgiver superseding Moses. The Beatitudes echo Isaiah and the Psalms.' },
        { tradition: 'ISLAMIC' as const, presence: 'MODIFIED' as const, notes: 'The Quran confirms that Isa was given the Injil (Gospel) containing guidance and light (5:46). Islamic scholars read the ethical teachings of the Sermon favorably while understanding them as part of Jesus\' prophetic message. The Sermon\'s teachings on prayer (including the Lord\'s Prayer) and fasting are noted as parallels to Islamic practice.' },
      ],
    },
    {
      slug: 'last-supper',
      name: 'The Last Supper',
      era: 'GOSPEL' as const,
      position: 53,
      summary:
        'Jesus shares a final meal with his disciples on the night before his crucifixion, instituting the Eucharist — identifying bread and wine with his body and blood — and commanding the disciples to remember him.',
      traditions: [
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Matthew 26:17-30, Mark 14:12-26, Luke 22:7-38, 1 Corinthians 11:23-26. The Last Supper is the founding moment of the Eucharist (Holy Communion / Lord\'s Supper). Jesus takes bread and wine, identifies them with his body and blood, and says "Do this in remembrance of me." This is the most repeated act of Christian worship and the center of Catholic/Orthodox liturgy.' },
        { tradition: 'JEWISH' as const, presence: 'MODIFIED' as const, notes: 'The Synoptic Gospels place the Last Supper on the night of Passover — making it a Seder meal. The words of institution over bread and wine correspond to specific Passover rituals. Jewish scholars recognize the Passover context while not accepting the theological significance Jesus attached to it.' },
        { tradition: 'ISLAMIC' as const, presence: 'MODIFIED' as const, notes: 'The Quran references a Table (Ma\'ida) sent down from heaven to the disciples of Isa at their request (5:111-115) — Surah Al-Ma\'ida is named after this event. Islamic commentators debate whether this refers to the Last Supper or a separate miracle. Islam does not accept the eucharistic theology attached to it.' },
      ],
    },
    {
      slug: 'crucifixion-resurrection',
      name: 'Crucifixion and Resurrection',
      era: 'GOSPEL' as const,
      position: 54,
      summary:
        'The central event of Christian faith: Jesus is crucified, dies, and rises from the dead on the third day. This event is evaluated completely differently by each tradition.',
      traditions: [
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'The Crucifixion is the atoning sacrifice for human sin; the Resurrection is God\'s vindication of Jesus and the defeat of death. Without the Resurrection, "your faith is in vain" (1 Cor 15:17). This is the most attested event in the New Testament.' },
        { tradition: 'JEWISH' as const, presence: 'MODIFIED' as const, notes: 'Jewish sources acknowledge a historical crucifixion under Roman authority. The Talmud has passing references to Yeshu. However, the theological interpretation — that this was the death and resurrection of the Messiah — is entirely rejected.' },
        { tradition: 'ISLAMIC' as const, presence: 'REJECTED' as const, notes: 'Quran 4:157: "They did not kill him, nor did they crucify him, but it was made to appear so to them." Islam teaches that Jesus was not crucified — God raised him alive to heaven. A substitute was crucified in his place (according to most classical commentators). Jesus will return at the end of times.' },
      ],
    },
    {
      slug: 'isaiah-53-written',
      name: "Isaiah's Servant Songs — The Suffering Servant",
      era: 'KINGDOM' as const,
      position: 45,
      summary:
        'The prophet Isaiah writes four "Servant Songs" — including the famous Isaiah 52:13–53:12 — describing a figure who is despised, pierced for our transgressions, and whose suffering brings healing. This passage became the single most contested text in all of inter-Abrahamic dialogue.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Isaiah 52:13–53:12. The mainstream Jewish reading is that the Servant represents the nation of Israel — suffering among the nations, rejected and despised, but ultimately vindicated by God. This is not a messianic prophecy of an individual but a portrait of Israel\'s collective experience in exile. The Talmud and medieval commentators (Rashi, Ibn Ezra) consistently support this reading. The text was a major source of Jewish-Christian polemic throughout the Middle Ages.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'This is the most explicitly "pre-Christian" messianic prophecy in the Old Testament from a Christian standpoint. Philip uses Isaiah 53 to explain the Gospel to the Ethiopian eunuch (Acts 8:32-35). Paul quotes it (Romans 10:16). Peter reads it in 1 Peter 2:24. Jesus himself may have alluded to it (Mark 10:45). Every detail — despised, rejected, silent before his accusers, buried with the rich, seeing the light after death — is read as fulfilled by Jesus.' },
        { tradition: 'ISLAMIC' as const, presence: 'MODIFIED' as const, notes: 'The Quran affirms that the Torah and the previous prophetic scriptures contained guidance and light (5:46). However, Islam teaches that the biblical texts have been altered (tahrif) and does not use them as a source of normative theology. The specific claim of Isaiah 53 as a prophecy of crucifixion is doubly problematic in Islam: first, Jesus was not crucified (4:157); second, prior scriptures are not considered intact. Some Muslim scholars have proposed that Isaiah 53 originally prophesied Muhammad rather than Jesus.' },
      ],
    },
    {
      slug: 'destruction-second-temple',
      name: 'Destruction of the Second Temple (70 CE)',
      era: 'GOSPEL' as const,
      position: 56,
      summary:
        'Roman forces under Titus destroy Jerusalem and the Second Temple in 70 CE — the most catastrophic event in Jewish history since the Babylonian exile, and a pivotal moment in the divergence of Judaism and Christianity.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'The destruction of the Second Temple (Churban Bayit Sheni) is mourned annually on Tisha B\'Av, the saddest day of the Jewish calendar. Over one million Jews were killed according to ancient sources; the Temple menorah was carried to Rome (depicted on the Arch of Titus). Without Temple sacrifice, the rabbis transformed Judaism: prayer replaced sacrifice, the synagogue replaced the Temple, and the Talmud became the portable homeland of the Jewish people. This event gave birth to Rabbinic Judaism.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Jesus explicitly predicted the Temple\'s destruction: "Not one stone will be left on another" (Matthew 24:2). For Christians, the destruction in 70 CE was the fulfillment of Jesus\' prophecy and the definitive end of the old covenant sacrificial system — confirming that Christ\'s once-for-all sacrifice had made Temple worship obsolete. Many early Christians saw it as divine judgment on Jerusalem for rejecting the Messiah.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'The Quran (17:4-8) references two periods of corruption by the Children of Israel, each met with divine punishment — Islamic commentators generally identify the second as the Roman destruction of 70 CE. The destruction is understood as part of the divine pattern of consequences for covenantal betrayal. The subsequent Muslim building on the Temple Mount in the 7th century is understood as God\'s restoration of proper monotheistic worship to the sacred site.' },
      ],
    },
    {
      slug: 'pentecost',
      name: 'Pentecost — Descent of the Holy Spirit',
      era: 'GOSPEL' as const,
      position: 55,
      summary:
        'Fifty days after Passover, the disciples of Jesus gathered in Jerusalem experience a rushing wind and tongues of fire — the Holy Spirit descends, enabling them to speak in multiple languages and inaugurating the Christian church.',
      traditions: [
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Acts 2. Pentecost (Shavuot) marks the birth of the church. Three thousand people are baptized in a single day. The event reverses Babel — all nations hear the gospel in their own languages. The Holy Spirit is now given to all believers, fulfilling Joel\'s prophecy (2:28-29). Every subsequent act of the apostles is empowered by this Spirit.' },
        { tradition: 'JEWISH' as const, presence: 'MODIFIED' as const, notes: 'Shavuot (Pentecost) is the Jewish festival commemorating the giving of the Torah at Sinai — fifty days after Passover. The timing of the Christian Pentecost on this feast is significant: it signals that the coming of the Spirit fulfills and surpasses the giving of the Law. Judaism marks this day with Torah study through the night (tikkun leil Shavuot).' },
        { tradition: 'ISLAMIC' as const, presence: 'SILENT' as const, notes: 'The Quran does not reference the Pentecost event. Islamic theology does not include a separate doctrine of the Holy Spirit as a divine person; the ruh al-qudus (Holy Spirit) in Islam is understood as the angel Jibreel.' },
      ],
    },

    // ── EARLY ISLAM ────────────────────────────────────────────────────────────
    {
      slug: 'first-revelation',
      name: 'First Revelation — Iqra',
      era: 'EARLY_ISLAM' as const,
      position: 60,
      summary:
        'In 610 CE, Muhammad ibn Abdullah, meditating in the cave of Hira near Mecca, receives the first revelation through the angel Jibreel: "Recite in the name of your Lord." This initiates 23 years of Quranic revelation.',
      traditions: [
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Quran 96:1-5 (Surah Al-Alaq). The event is described in Hadith: the angel squeezed Muhammad three times before speaking. Muhammad, terrified, returned to his wife Khadijah, who reassured him and brought him to her Christian cousin Waraqah ibn Nawfal. This night is called Laylat al-Qadr, commemorated in the last ten days of Ramadan.' },
        { tradition: 'JEWISH' as const, presence: 'SILENT' as const, notes: 'No position in Jewish scripture or theology on this event. Some medieval Jewish scholars engaged with Islam and its prophetic claims (Saadia Gaon, Maimonides); they rejected Muhammad\'s prophethood as outside the covenant given at Sinai.' },
        { tradition: 'CHRISTIAN' as const, presence: 'SILENT' as const, notes: 'No position in Christian scripture. Christian theologians have evaluated Muhammad\'s prophetic claims through various lenses — some seeing demonic influence, others acknowledging a genuine religious experience not aligned with Christian revelation.' },
      ],
    },
    {
      slug: 'night-journey',
      name: "Muhammad's Night Journey — Al-Isra wal-Mi'raj",
      era: 'EARLY_ISLAM' as const,
      position: 61,
      summary:
        "Muhammad is transported miraculously from Mecca to Jerusalem, then ascends through the seven heavens, meeting the previous prophets and receiving the obligation of the five daily prayers.",
      traditions: [
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Quran 17:1 (the Isra); the Mi\'raj is described in Hadith. Muhammad leads all prophets in prayer at the Temple Mount, then ascends past Moses and Abraham to the Sidrat al-Muntaha (Lote Tree of the Uttermost End). Originally 50 daily prayers are commanded; Moses advises Muhammad to negotiate them down to five.' },
        { tradition: 'JEWISH' as const, presence: 'SILENT' as const, notes: 'The Temple Mount (al-Aqsa) being the departure point is significant in Jewish-Islamic relations. Judaism has no canonical position on the event itself.' },
        { tradition: 'CHRISTIAN' as const, presence: 'SILENT' as const, notes: 'The mention of previous prophets (including Jesus) greeting Muhammad is part of the Islamic narrative of prophethood\'s continuity. Christianity has no canonical response.' },
      ],
    },
    {
      slug: 'hijra',
      name: 'The Hijra — Migration to Medina',
      era: 'EARLY_ISLAM' as const,
      position: 62,
      summary:
        'In 622 CE, the Prophet Muhammad and his followers migrate from Mecca to Medina, escaping persecution. This marks Year 1 of the Islamic calendar and the founding of the first Muslim community-state.',
      traditions: [
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'The Hijra is the most historically significant event in early Islam. It marks the transition from a persecuted minority to a community with political authority. The Islamic calendar (AH — Anno Hegirae) begins from this year (622 CE). The Constitution of Medina established a pluralistic compact between Muslims, Jews, and other tribes. The Prophet\'s Mosque in Medina was built there.' },
        { tradition: 'JEWISH' as const, presence: 'SILENT' as const, notes: 'Several Jewish tribes (Banu Qaynuqa, Banu Nadir, Banu Qurayza) were present in Medina and initially coexisted with the early Muslim community under the Constitution of Medina. Subsequent conflicts led to their expulsion or defeat. This history is documented in both Islamic and Jewish historical sources.' },
        { tradition: 'CHRISTIAN' as const, presence: 'SILENT' as const, notes: 'No canonical Christian position on the Hijra, though early Christian communities in Arabia and Syria were aware of Islam\'s emergence. John of Damascus (7th-8th century) was among the first Christians to write a theological response to Islam.' },
      ],
    },
    {
      slug: 'conquest-of-mecca',
      name: 'The Conquest of Mecca',
      era: 'EARLY_ISLAM' as const,
      position: 63,
      summary:
        'In 630 CE, the Prophet Muhammad re-enters Mecca with an army of 10,000 and issues a general amnesty, cleansing the Kaaba of idols and establishing the city as Islam\'s holiest site.',
      traditions: [
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'The Fath (opening/victory) of Mecca is a pivotal moment — the city that had expelled and persecuted the Muslims was retaken without major bloodshed. The Prophet declared a general amnesty: "Go, for you are free." The 360 idols around the Kaaba were destroyed. The Kaaba was re-consecrated as the House of God built by Ibrahim and Ishmael. The adhan (call to prayer) was given from its roof.' },
        { tradition: 'JEWISH' as const, presence: 'SILENT' as const, notes: 'Jewish tradition has no canonical stance on this event. Some scholars note parallels between the Conquest of Mecca and biblical accounts of Joshua\'s entry into Canaan — both framed as restoration of divine worship to a sacred city.' },
        { tradition: 'CHRISTIAN' as const, presence: 'SILENT' as const, notes: 'No canonical Christian position. The re-consecration of the Kaaba removed the Christian cross and icons that some traditions claim had been inside it. Byzantine Christian chronicles of the era record the rapid expansion of Islam with alarm.' },
      ],
    },
    {
      slug: 'farewell-pilgrimage',
      name: "The Farewell Pilgrimage and Last Sermon",
      era: 'EARLY_ISLAM' as const,
      position: 64,
      summary:
        'In 632 CE, the Prophet Muhammad performs his only and final Hajj pilgrimage and delivers his Farewell Sermon on Mount Arafat to over 100,000 people — announcing the completion of the religion.',
      traditions: [
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'The Farewell Sermon is one of the most important documents in Islam, containing proclamations on human equality, the prohibition of usury and blood feuds, the rights of women, and the preservation of the Quran and Sunnah. During this pilgrimage, the final verse of the Quran was revealed: "Today I have perfected your religion for you, completed my favor upon you, and chosen Islam as your way of life" (Quran 5:3). Muhammad died approximately 80 days later.' },
        { tradition: 'JEWISH' as const, presence: 'SILENT' as const, notes: 'No canonical Jewish position. Some scholars compare the Farewell Sermon\'s proclamation of equality to the covenant renewal ceremonies in Deuteronomy and Nehemiah.' },
        { tradition: 'CHRISTIAN' as const, presence: 'SILENT' as const, notes: 'No canonical Christian position. The timing of the death of Muhammad (632 CE) coincides with the ongoing Byzantine-Persian wars that had weakened both empires, facilitating the rapid spread of Islam throughout the Middle East in subsequent decades.' },
      ],
    },

    // ── Additional PRIMORDIAL ────────────────────────────────────────────────
    {
      slug: 'cain-and-abel',
      name: 'Cain and Abel — The First Murder',
      era: 'PRIMORDIAL' as const,
      position: 3,
      summary:
        'Cain murders his brother Abel out of jealousy after God accepts Abel\'s offering but rejects Cain\'s. This is the first murder in scripture, establishing the theme of jealousy, violence, and divine justice.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 4. Cain (Kayin) is a farmer; Abel (Hevel) is a shepherd. God\'s preference for Abel\'s offering is unexplained. The Talmud (Sanhedrin 37a) derives from this story that "whoever destroys a single soul, Scripture accounts it as if he had destroyed an entire world." God marks Cain but protects him — divine mercy even for a murderer.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: '1 John 3:12 cites Cain as the archetype of the evil one — his actions were evil while Abel\'s were righteous. Hebrews 11:4 says "by faith Abel offered a better sacrifice." Cain\'s city-building (Gen 4:17) is read as the founding of secular civilization. Augustine uses Cain and Abel as types of the earthly city vs. the City of God.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Quran 5:27-31 narrates the story without naming the brothers (Habil and Qabil in Islamic tradition). The Quran derives from this: "Whoever kills a soul... it is as if he had killed all mankind" (5:32). The raven showing Qabil how to bury his brother is a touching detail unique to the Quranic account.' },
      ],
    },
    {
      slug: 'tower-of-babel',
      name: 'Tower of Babel — Dispersion of Languages',
      era: 'PRIMORDIAL' as const,
      position: 5,
      summary:
        'Humanity, speaking one language, attempts to build a tower reaching heaven. God confuses their language and scatters them across the earth — explaining the diversity of human languages and nations.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 11:1-9. "Babel" (Babylon) means "gateway to the gods" in Sumerian but the Torah derives it from the Hebrew balal (confuse). The rabbis debate the sin: was it pride, rebellion, or social cohesion that threatened free choice? Some read it favorably — unity of purpose even if misdirected. The Table of Nations (Gen 10) precedes it, suggesting the diversity of peoples is part of God\'s plan.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'The Pentecost (Acts 2) explicitly reverses Babel — where Babel scattered and confused languages, the Spirit enables all nations to hear in their own tongue. Babel represents human pride and self-sufficiency; Pentecost is divine restoration. The Augustinian tradition reads Babel as the founding of the sinful earthly city.' },
        { tradition: 'ISLAMIC' as const, presence: 'SILENT' as const, notes: 'The Quran does not mention the Tower of Babel directly. However, it affirms that God made humanity into peoples and tribes (49:13) and that the diversity of languages and colors is a sign of God (30:22). Some Islamic scholars identify Nimrod (Namrud) — the Babel story\'s background figure — with the king who challenged Ibrahim.' },
      ],
    },
    {
      slug: 'sodom-and-gomorrah',
      name: 'Sodom and Gomorrah',
      era: 'PATRIARCHAL' as const,
      position: 13,
      summary:
        'God destroys the cities of Sodom and Gomorrah by fire and brimstone for their wickedness. Lot and his family escape, but his wife looks back and is turned into a pillar of salt.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 19. The Sodom narrative in Judaism emphasizes the sin of inhospitality and lack of social justice (Ezekiel 16:49: "This was the guilt of your sister Sodom: she and her daughters had pride, excess food, and prosperous ease, but did not aid the poor and needy"). The rabbis (Sanhedrin 109a) describe the laws of Sodom as the institutionalization of selfishness: "What is mine is mine, what is yours is yours."' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: '2 Peter 2:6-7 uses Sodom as an example of judgment on the ungodly. Jude 7 connects Sodom\'s destruction to sexual immorality. Jesus uses it as the archetype of unrepentant cities facing judgment (Matt 10:15; 11:24). Traditional Christian theology identifies sexual sin as the primary sin, a reading that has been used in debates about homosexuality. Progressive Christianity emphasizes the inhospitality reading.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Surah 7:80-84; 11:77-83; 15:58-77. Lut (Lot) is a prophet sent to his people to warn them. The Quran explicitly identifies their sin as approaching men with desire rather than women — making this the most direct Quranic prohibition of homosexual acts. Lut\'s people reject him; angels rescue him; the city is destroyed with stones of baked clay (sijjil).' },
      ],
    },
    {
      slug: 'joseph-sold-into-slavery',
      name: 'Joseph Sold into Slavery',
      era: 'PATRIARCHAL' as const,
      position: 22,
      summary:
        'Joseph\'s brothers, consumed by jealousy over his favor with their father Jacob and his prophetic dreams, sell him to Ishmaelite traders for 20 pieces of silver. He is taken to Egypt.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 37. The Joseph narrative is one of the longest continuous stories in the Torah — a psychological drama of sibling rivalry, temptation, and divine providence. Joseph\'s "coat of many colours" (or long-sleeved robe) is the symbol of his father\'s favoritism. The rabbis note that the selling of Joseph for 20 pieces of silver led to the enslavement of all Israel in Egypt — collective consequence of individual sin.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Joseph is the richest type of Christ in the Old Testament: sold by brothers for silver, falsely accused, imprisoned, and then exalted to the right hand of power. Stephen\'s speech in Acts 7 uses Joseph\'s rejection by his brothers as a pattern of Israel rejecting God\'s appointed deliverers, culminating in the rejection of Jesus. Joseph\'s forgiveness of his brothers prefigures God\'s forgiveness of humanity.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Surah 12 (Yusuf) is the most complete and sustained narrative in the Quran, called "the best of stories" (12:3). The Quran emphasizes Yusuf\'s steadfast faith, chastity (resisting Potiphar\'s wife), and ultimate forgiveness of his brothers. Unlike the Torah, the Quran presents Yusuf as a prophet throughout, with divine protection guiding every step of his journey.' },
      ],
    },

    // ── Additional KINGDOM ────────────────────────────────────────────────────
    {
      slug: 'jonah-and-the-whale',
      name: 'Jonah and the Great Fish',
      era: 'KINGDOM' as const,
      position: 46,
      summary:
        'The prophet Jonah flees from God\'s command to preach to Nineveh, is swallowed by a great fish for three days, and after being released, preaches repentance — and the entire city of Nineveh repents.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'The Book of Jonah is read on Yom Kippur afternoon — specifically because of its message: God\'s mercy extends beyond Israel to all nations who repent. Nineveh (Assyria — Israel\'s bitter enemy) repents and is spared. The rabbis use Jonah to teach that repentance (teshuva) is available to all humanity, and that God\'s compassion encompasses even those who have oppressed Israel.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Jesus calls Jonah\'s three days in the fish a sign (the "sign of Jonah") prefiguring his own three days in the earth (Matthew 12:39-41). Jonah preaching to the Gentiles of Nineveh is a type of the Gospel going to all nations. Jonah\'s reluctance to share God\'s mercy is compared to Jewish exclusivism. The fish delivering Jonah is a type of resurrection.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Surah 10 (Yunus) and 21:87-88 detail Yunus\'s story. He is called Dhul-Nun (he of the whale/fish). His prayer from inside the whale — "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers" — is considered one of the most powerful prayers in Islam. He is criticized for leaving his mission without God\'s permission but is ultimately saved and sent back.' },
      ],
    },
    {
      slug: 'solomons-decline-idolatry',
      name: "Solomon's Decline — Foreign Wives and Idolatry",
      era: 'KINGDOM' as const,
      position: 43,
      summary:
        'Despite his unparalleled wisdom, King Solomon\'s 700 wives and 300 concubines — many of them foreign and pagan — lead his heart away from God in his old age, and he builds shrines for their gods.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: '1 Kings 11. This is the great theological scandal of Solomon\'s reign. God had specifically warned against foreign wives (Deut 17:17). Solomon\'s apostasy is presented as the direct cause of the kingdom\'s division after his death. The rabbis are divided: some (Talmud, Sanhedrin 21b) use this to illustrate that no one is immune to the evil inclination; others find excuses for Solomon\'s behavior. His authorship of Song of Songs is seen as repentance and wisdom returned.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Jesus contrasts his wisdom with Solomon\'s (Matt 12:42 — "something greater than Solomon is here") and notes Solomon\'s transient glory (Matt 6:29 — "even Solomon in all his glory was not arrayed like one of these"). The decline of Solomon is read as demonstrating that even the wisest humans fail without ongoing obedience to God — pointing to the need for the Messiah who will not fail.' },
        { tradition: 'ISLAMIC' as const, presence: 'REJECTED' as const, notes: 'The Quran presents Sulayman as a righteous prophet-king who never fell into idolatry. In Islam, prophets are protected from major sins (isma — infallibility in matters of prophetic mission). The Quranic Sulayman repents from a test (38:34-35) involving wealth, but never worships false gods. The Biblical account of his idolatry is seen as a later corruption of scripture (tahrif).' },
      ],
    },
    {
      slug: 'ezra-restores-the-torah',
      name: 'Ezra Restores the Torah',
      era: 'KINGDOM' as const,
      position: 47,
      summary:
        'After the Babylonian exile, Ezra the scribe leads the return to Jerusalem and publicly reads the Torah to the assembled people, restoring Torah observance as the center of Jewish life.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Nehemiah 8. Ezra\'s public Torah reading is the founding moment of synagogue Judaism. He established the public reading of Torah on Mondays, Thursdays, and Shabbat. The Great Assembly (Anshei Knesset HaGedolah) that Ezra convened became the foundation of later rabbinic authority. The Talmud compares Ezra to Moses: "Ezra was worthy to have received the Torah had not Moses come before him."' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'The books of Ezra and Nehemiah record the restoration after exile. Paul\'s reading of Abraham precedes the Mosaic law (Romans 4) draws on the understanding that Ezra\'s restoration of Torah observance represented a post-exile renewal. The return from exile is read as a type of resurrection and spiritual renewal.' },
        { tradition: 'ISLAMIC' as const, presence: 'MODIFIED' as const, notes: 'The controversial Quranic verse (9:30) states that Jews call Uzayr (identified by most commentators as Ezra) the "son of God." This is widely denied by Jews. Islamic tradition sees Ezra as possibly having compiled or restored the Torah, which Muslims believe was then subject to alteration (tahrif). The role of Ezra in preserving Jewish scripture is acknowledged but its divine authenticity questioned.' },
      ],
    },

    // ── Additional GOSPEL ─────────────────────────────────────────────────────
    {
      slug: 'transfiguration',
      name: 'The Transfiguration',
      era: 'GOSPEL' as const,
      position: 53,
      summary:
        'Jesus takes Peter, James, and John up a mountain where he is transfigured before them — his face shines like the sun, his clothes become dazzling white, and Moses and Elijah appear beside him.',
      traditions: [
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Matthew 17:1-8; Mark 9:2-8; Luke 9:28-36. The Transfiguration reveals Jesus\'s divine glory before the crucifixion. Moses (representing the Law) and Elijah (representing the Prophets) appear with Jesus — signaling that he is the fulfillment of both. The voice from the cloud repeats the baptism declaration. 2 Peter 1:16-18 cites the Transfiguration as eyewitness confirmation of Jesus\'s divine majesty.' },
        { tradition: 'JEWISH' as const, presence: 'SILENT' as const, notes: 'Judaism has no canonical position on this event. The presence of Moses in a post-mortem appearance would be unusual in Jewish thought, though Enoch\'s translation and the tradition of Moses\'s mysterious burial allow for varied interpretations. Some scholars compare the Transfiguration to Moses\'s shining face after receiving the Torah (Exodus 34:29-35).' },
        { tradition: 'ISLAMIC' as const, presence: 'SILENT' as const, notes: 'The Quran does not record the Transfiguration. Islam affirms Jesus\'s prophetic glory but not his divine nature. The luminous quality attributed to prophets is discussed in Islamic hadith (nur al-nubuwwa — the light of prophethood) without implying divinity.' },
      ],
    },
    {
      slug: 'john-the-baptist-ministry',
      name: "John the Baptist's Ministry",
      era: 'GOSPEL' as const,
      position: 50,
      summary:
        'John the Baptist preaches repentance in the Judean wilderness, baptizes crowds in the Jordan River, and announces the coming of one who is greater than he.',
      traditions: [
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'John is the fulfillment of Isaiah 40:3 ("a voice crying in the wilderness") and Malachi 4:5 (Elijah\'s return). He baptizes Jesus, identifying him as the Lamb of God (John 1:29). He is described by Jesus as the greatest prophet before the Kingdom era (Matt 11:11). His martyrdom by Herod Antipas (beheaded at the request of Salome/Herodias\'s daughter) is recorded in all Synoptics.' },
        { tradition: 'JEWISH' as const, presence: 'MODIFIED' as const, notes: 'Josephus (Antiquities 18) confirms John\'s historical existence and describes him as "a good man who commanded the Jews to exercise virtue, both as to righteousness towards one another, and piety towards God, and so to come to baptism." Josephus presents him positively. Judaism does not accept John\'s theological role as forerunner of the Messiah.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Yahya (John the Baptist) is a prophet in Islam. Surah 19:7-15 records his miraculous birth to the elderly Zakariyya and his mother. He is described as receiving wisdom as a child, as chaste (hasur) and kind, confirming a word from God (i.e., Jesus). He is declared righteous and granted the greeting of peace on the day of his birth, death, and resurrection.' },
      ],
    },

    // ── Additional EARLY_ISLAM ────────────────────────────────────────────────
    {
      slug: 'battle-of-badr',
      name: 'Battle of Badr',
      era: 'EARLY_ISLAM' as const,
      position: 63,
      summary:
        'In 624 CE (2 AH), the small Muslim army of approximately 313 fighters defeats a Meccan force of ~1,000 at the wells of Badr. The Quran describes the victory as divine intervention — angels fought with the Muslims.',
      traditions: [
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Surah 3:123-127; 8:9-19. Badr is the foundational military victory of Islam — "the Day of Criterion" (Yawm al-Furqan). The angels Jibril, Mika\'il, and Israfil led 1,000, then 3,000, then 5,000 angels in support of the Muslims (3:124-125). Key Meccan leaders killed include Abu Jahl. The spoils of war (ghanima) rules are established in this context (Surah Al-Anfal).' },
        { tradition: 'JEWISH' as const, presence: 'SILENT' as const, notes: 'No canonical Jewish position. The Battle of Badr was preceded by the expulsion of the Jewish tribe Banu Qaynuqa from Medina shortly afterward — connecting the two events in early Islamic history.' },
        { tradition: 'CHRISTIAN' as const, presence: 'SILENT' as const, notes: 'No canonical Christian position. The Battle of Badr marks the shift of Islam from a purely spiritual movement to a militarily capable state — a shift that contemporary Christian observers would only begin to note in the following decades as Islamic expansion reached into previously Byzantine territories.' },
      ],
    },
    {
      slug: 'death-of-muhammad',
      name: 'Death of the Prophet Muhammad',
      era: 'EARLY_ISLAM' as const,
      position: 65,
      summary:
        'On the 12th of Rabi\' al-Awwal, 11 AH (632 CE), Muhammad ibn Abdullah dies in Medina at approximately 63 years of age. His death triggers a succession crisis that would ultimately produce the Sunni-Shia split.',
      traditions: [
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Muhammad died in the arms of his wife Aisha. Abu Bakr announced the death: "Whoever worshipped Muhammad, know that Muhammad has died. Whoever worshipped God, know that God is alive and never dies." (referencing Quran 3:144: Muhammad is only a messenger; messengers have died before him). This distinction between the eternal God and the mortal prophet is fundamental. The Companions chose Abu Bakr as Caliph; Ali was not immediately selected — the seed of the Sunni-Shia divide.' },
        { tradition: 'JEWISH' as const, presence: 'SILENT' as const, notes: 'The death of Muhammad had significant consequences for the remaining Jewish communities in Arabia. Jewish communities in Medina had already been expelled or destroyed during his lifetime; the Arabian Peninsula was later declared closed to non-Muslims under Caliph Umar.' },
        { tradition: 'CHRISTIAN' as const, presence: 'SILENT' as const, notes: 'No canonical Christian position. In the following decades and centuries, the rapid Islamic conquest of formerly Christian territories — Syria, Egypt, North Africa, Spain — would be the defining challenge for Byzantine and Western Christendom. John of Damascus, writing a generation after Muhammad\'s death, was among the first systematic Christian theologians to address Islam.' },
      ],
    },

    // ══════════════════════════════════════════════════════════════════════════
    // 20 NEW EVENTS
    // ══════════════════════════════════════════════════════════════════════════

    // ── PRIMORDIAL ───────────────────────────────────────────────────────────
    {
      slug: 'the-fall-of-adam-and-eve',
      name: 'The Fall — Expulsion from Paradise',
      era: 'PRIMORDIAL' as const,
      position: 2,
      summary:
        'Adam and Eve eat the forbidden fruit and are expelled from the Garden of Eden. This event introduces mortality, shame, and the broken relationship between God and humanity — with radically different theological consequences in each tradition.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 3. The sin is individual disobedience. Adam and Eve hide from God in shame; God makes them garments of skin and expels them. Judaism does not derive a doctrine of original sin — each person is born with the capacity for good and evil (yetzer ha-tov and yetzer ha-ra). Death is introduced as a consequence, but guilt is not inherited. The rabbis debate whether the forbidden fruit was a fig, grape, wheat, or citron.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'The Fall is the foundational event of Christian soteriology. Augustine formalized the doctrine of Original Sin: all humanity inherits Adam\'s guilt and corruption. The "protoevangelium" (Gen 3:15) — the woman\'s seed will crush the serpent\'s head — is read as the first prophecy of Christ. Paul\'s theology (Romans 5:12-21) hinges on Adam\'s fall being reversed by Christ\'s obedience: "as in Adam all die, so in Christ shall all be made alive" (1 Cor 15:22).' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Quran 2:35-38; 7:19-25; 20:115-123. Adam and Hawwa both eat the fruit (Iblis deceives them). They immediately repent and God forgives them (2:37) — there is no "fall" in the Christian sense. No original sin is transmitted. Adam is sent to earth as God\'s khalifa (vicegerent), not as punishment but as the fulfillment of the divine plan. Islam teaches every child is born in a state of fitrah (pure nature).' },
      ],
    },
    {
      slug: 'abrahams-sacrifice',
      name: 'The Binding — Abraham\'s Sacrifice',
      era: 'PATRIARCHAL' as const,
      position: 14,
      summary:
        'God commands Abraham to sacrifice his beloved son as a test of faith. At the last moment, God provides a ram as substitute. All three traditions revere this as the supreme test of faith — but disagree on which son was offered.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 22. The Akedah (Binding of Isaac) is one of the most profound passages in the Torah. Abraham binds Isaac on Mount Moriah — later identified as the Temple Mount. The ram caught in the thicket is substituted. The shofar (ram\'s horn) blown on Rosh Hashanah recalls this event. The Akedah is invoked as the supreme merit of Abraham that protects Israel. Isaac is explicitly named as the intended sacrifice.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'The Akedah is the most significant Old Testament type of Christ\'s crucifixion. Isaac carries the wood up the mountain as Jesus carried the cross. Abraham\'s willingness mirrors God the Father offering His Son. The key difference: God stopped Abraham from killing Isaac, but did NOT stop the crucifixion — the sacrifice of Christ is the reality to which the Akedah points. Hebrews 11:17-19 says Abraham believed God could raise Isaac from the dead.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Quran 37:100-111. The son is not named in the Quran, but the majority of Islamic scholars (including Ibn Kathir) identify him as Ismail (Ishmael), not Ishaq (Isaac). The test occurs in Mina near Mecca — the basis for the Eid al-Adha sacrifice (Festival of Sacrifice) celebrated annually during Hajj. Ibrahim and Ismail both submit willingly. "When they had both submitted and he put him down upon his forehead, We called to him: O Ibrahim, you have fulfilled the vision."' },
      ],
    },

    // ── PATRIARCHAL ──────────────────────────────────────────────────────────
    {
      slug: 'abraham-and-the-three-visitors',
      name: 'Abraham and the Three Visitors',
      era: 'PATRIARCHAL' as const,
      position: 12,
      summary:
        'Three mysterious visitors appear to Abraham at Mamre. He offers them lavish hospitality. They announce that Sarah will bear a son (Isaac) within a year — and Sarah laughs in disbelief.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 18. The three visitors are understood as angels (malachim). Abraham\'s running to greet them and preparing a meal is the paradigm of hachnasat orchim (hospitality to strangers) — one of the greatest mitzvot in Judaism. The Talmud (Shabbat 127a) says welcoming guests is greater than receiving the Divine Presence. Abraham served meat and dairy together (Gen 18:8) — a classic rabbinic discussion point about pre-Sinai kashrut.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'The three visitors have been interpreted as a Trinitarian theophany since the early church — the famous Rublev icon "Trinity" depicts this scene. Hebrews 13:2 says "Do not forget to show hospitality to strangers, for thereby some have entertained angels unawares" — directly referencing Abraham. The announcement of Isaac\'s birth is a prototype of angelic annunciations (including the Annunciation to Mary).' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Quran 11:69-73; 15:51-56; 51:24-30. The guests are angels (who also visit Lut afterward to warn of Sodom\'s destruction). Ibrahim prepares a roasted calf but the angels do not eat — alarming him. They give glad tidings of Ishaq (Isaac). Ibrahim\'s wife (not named in the Quran) laughs in surprise. The story emphasizes Ibrahim\'s generosity and the miraculous promise of a son in old age.' },
      ],
    },
    {
      slug: 'jacob-wrestles-the-angel',
      name: 'Jacob Wrestles with the Angel',
      era: 'PATRIARCHAL' as const,
      position: 18,
      summary:
        'On the night before meeting his estranged brother Esau, Jacob wrestles with a mysterious figure until dawn. He is wounded in the hip but refuses to let go until he receives a blessing. He is renamed "Israel" — "one who struggles with God."',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 32:22-32. This is the origin of the name "Israel" (Yisra-El — "he who wrestles with God" or "God prevails"). The rabbis identify the opponent as the guardian angel of Esau (Samael). The wound to the hip socket (gid ha-nasheh) is the reason Jews do not eat the sciatic nerve of animals — one of the oldest kosher restrictions. The event symbolizes the Jewish people\'s ongoing struggle with God, with the nations, and with their own identity.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Hosea 12:3-4 identifies the opponent as an angel. Christian theologians (Origen, Augustine) read this as a Christophany — a pre-incarnation appearance of Christ. The wrestling symbolizes prayer and perseverance in faith. Jacob\'s new name "Israel" becomes the name of God\'s chosen people, fulfilled in the Church as the "new Israel" (a contested supersessionist reading). The wound symbolizes the cost of encountering God.' },
        { tradition: 'ISLAMIC' as const, presence: 'SILENT' as const, notes: 'The Quran does not mention Jacob wrestling with an angel. Ya\'qub is honored as a prophet, given wisdom and revelation (6:84; 12:6). Islamic tradition does not contain the renaming narrative or the concept of "struggling with God." The absence of this story is consistent with the Islamic principle that prophets maintain dignity and do not physically wrestle with divine beings.' },
      ],
    },
    {
      slug: 'joseph-forgives-brothers',
      name: 'Joseph Forgives His Brothers',
      era: 'PATRIARCHAL' as const,
      position: 24,
      summary:
        'After rising to become Viceroy of Egypt, Joseph reveals his identity to the brothers who sold him into slavery — and instead of revenge, offers forgiveness and reconciliation, declaring that God meant it for good.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Genesis 45. "I am Joseph; is my father still alive?" — one of the most dramatic moments in the Torah. Joseph weeps and says "God sent me before you to preserve life" (45:5). This is the Torah\'s supreme example of divine providence (hashgacha pratit): human evil is woven into God\'s redemptive plan. The rabbis see this as the model for forgiveness and the resolution of sibling rivalry that began with Cain and Abel.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Joseph\'s forgiveness is a type of Christ\'s forgiveness from the cross ("Father, forgive them, for they know not what they do," Luke 23:34). The pattern — rejection by his own, suffering, exaltation, then forgiveness and provision — perfectly mirrors the Christian narrative of Jesus. Stephen\'s speech (Acts 7) uses Joseph\'s story as part of the pattern of Israel rejecting God\'s deliverers, only to be saved by them.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Quran 12:90-92. "He said: No blame upon you today. May God forgive you; and He is the most merciful of the merciful." Yusuf\'s forgiveness is presented as the pinnacle of prophetic character — grace over revenge. The entire family is reunited; Ya\'qub\'s sight is restored when Yusuf\'s shirt is placed over his face. The Quran calls this "the most beautiful of stories" (ahsan al-qasas, 12:3).' },
      ],
    },

    // ── EXODUS ───────────────────────────────────────────────────────────────
    {
      slug: 'parting-of-the-red-sea',
      name: 'The Parting of the Red Sea',
      era: 'EXODUS' as const,
      position: 33,
      summary:
        'Trapped between the Egyptian army and the sea, Moses stretches his hand and God parts the waters, allowing the Israelites to cross on dry ground. The Egyptian army follows and is drowned when the waters return.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Exodus 14-15. The splitting of the Yam Suf (Sea of Reeds) is the supreme miracle of the Hebrew Bible and the central event of the Exodus. The Song of the Sea (Shirat HaYam, Exodus 15) is recited daily in Jewish liturgy. The rabbis debate whether the sea split into 12 paths (one per tribe). Nachshon ben Aminadav, who stepped into the water before it parted, is a model of radical faith. The seventh day of Passover commemorates this event.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: '1 Corinthians 10:1-2 reads the crossing as a type of baptism: "all were baptized into Moses in the cloud and in the sea." The Exodus liberation becomes the paradigm for spiritual liberation through Christ. The Easter Vigil liturgy in both Catholic and Orthodox traditions includes the reading of Exodus 14. The parting of the sea is a type of the resurrection — passing through death to new life.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Quran 26:60-67; 2:50; 7:136-138. God commands Musa to strike the sea with his staff. The sea splits and the Israelites cross. Pharaoh and his army pursue and are drowned. As Pharaoh drowns, he declares belief in God — but God says it is too late and preserves his body as a sign (10:90-92). The day of deliverance is the basis for the fast of Ashura (10th of Muharram) in Sunni Islam.' },
      ],
    },
    {
      slug: 'giving-of-the-torah-sinai',
      name: 'The Giving of the Torah at Sinai',
      era: 'EXODUS' as const,
      position: 34,
      summary:
        'God reveals the Ten Commandments and the Torah to Moses at Mount Sinai amid thunder, lightning, and the sound of a shofar. The entire nation of Israel hears God\'s voice — the foundational moment of the covenant.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'Exodus 19-20. This is the defining moment of Jewish identity: God enters into a covenant with the entire nation of Israel. The rabbis teach that all Jewish souls — past, present, and future — were present at Sinai. The Torah was offered to all nations, but only Israel accepted. The festival of Shavuot commemorates this event. The tradition of 613 commandments derives from the Sinai revelation. "Na\'aseh v\'nishma" — "We will do and we will hear" (Exodus 24:7) — is Israel\'s iconic acceptance.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'The giving of the Law at Sinai is the "Old Covenant" that Jesus fulfills with the "New Covenant" (Jeremiah 31:31-33; Luke 22:20). Paul\'s theology (Galatians 3-4; 2 Corinthians 3) contrasts the "ministry of death, carved in letters on stone" with the "ministry of the Spirit." The Transfiguration on a mountain parallels Sinai. Pentecost (Acts 2) — the giving of the Spirit — occurs on Shavuot, the anniversary of Sinai.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Quran 7:142-145; 2:63. God gives Musa the Tawrat (Torah) on tablets after 40 nights of fasting. The Quran affirms the Tawrat as divine revelation but teaches that it was later altered (tahrif). The covenant with the Children of Israel at the mountain is affirmed, and the raising of Mount Tur over the Israelites as a sign of the covenant\'s seriousness is described (2:63; 7:171). Musa asks to see God but is refused — the mountain crumbles instead (7:143).' },
      ],
    },

    // ── KINGDOM ──────────────────────────────────────────────────────────────
    {
      slug: 'david-and-goliath',
      name: 'David and Goliath',
      era: 'KINGDOM' as const,
      position: 39,
      summary:
        'The shepherd boy David, armed only with a sling and five stones, defeats the Philistine giant Goliath in single combat — changing the course of Israel\'s war and establishing David\'s reputation.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: '1 Samuel 17. David\'s victory is the triumph of faith over might, the small over the great. He says to Goliath: "You come against me with sword and spear and javelin, but I come against you in the name of the LORD of hosts" (17:45). The Talmud treats this as the paradigmatic proof that God fights for those who trust Him. David\'s rise from this moment leads to his anointing as king, his capture of Jerusalem, and the establishment of the Davidic dynasty.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'David\'s victory over Goliath is a type of Christ\'s victory over Satan and death — the unlikely champion defeating the overwhelming enemy through divine power, not human strength. Michelangelo\'s David symbolizes Florence\'s resistance to tyranny. David\'s five stones are read by some commentators as the five wounds of Christ. The victory establishes the Davidic line through which Jesus (the "Son of David") will come.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Quran 2:251: "So they defeated them by permission of Allah, and David killed Goliath (Jalut), and Allah gave him the kingship and wisdom and taught him from that which He willed." The story is more briefly told in the Quran but confirms Dawud\'s pivotal role. Islamic tradition emphasizes that God grants victory to whom He wills, regardless of numbers or strength — a lesson applied to the Battle of Badr.' },
      ],
    },
    {
      slug: 'kingdom-divides',
      name: 'The Kingdom Divides — Israel and Judah',
      era: 'KINGDOM' as const,
      position: 42,
      summary:
        'After Solomon\'s death, his son Rehoboam\'s harsh rule causes the ten northern tribes to secede under Jeroboam, splitting the united kingdom into Israel (north) and Judah (south) — a division that would have lasting consequences.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: '1 Kings 12. The split is directly attributed to Solomon\'s sins (1 Kings 11:11-13). The northern kingdom of Israel (capital: Samaria) sets up rival worship centers at Dan and Bethel with golden calves, a deliberate echo of the sin at Sinai. The southern kingdom of Judah (capital: Jerusalem) retains the Temple and the Davidic dynasty. The northern kingdom falls to Assyria in 722 BCE — the "Ten Lost Tribes." Judah survives until the Babylonian exile (586 BCE).' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'The divided kingdom is read as a consequence of disobedience and a foreshadowing of the broader pattern of covenant unfaithfulness that leads to exile. Jesus\'s choice of 12 apostles is read as symbolically reconstituting the 12 tribes — reunifying what was divided. The schism between Israel and Judah has been compared to the Catholic-Protestant split.' },
        { tradition: 'ISLAMIC' as const, presence: 'MODIFIED' as const, notes: 'The Quran does not narrate the kingdom\'s division but references God sending prophets to the Children of Israel who were repeatedly rejected. The pattern of divine favor, disobedience, and punishment that led to the split is consistent with the Quranic narrative of Bani Israel\'s history. The loss of the northern tribes is seen as part of God\'s ongoing discipline.' },
      ],
    },
    {
      slug: 'fall-of-northern-israel',
      name: 'Fall of Northern Israel — The Ten Lost Tribes',
      era: 'KINGDOM' as const,
      position: 44,
      summary:
        'In 722 BCE, the Assyrian Empire under Sargon II conquers the northern kingdom of Israel, deports its population, and resettles foreigners in the land. The ten northern tribes disappear from history — the "Lost Tribes of Israel."',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: '2 Kings 17. The fall of Israel is presented as divine punishment for persistent idolatry and covenant violation. The Assyrians resettle foreigners who intermarry with remaining Israelites, producing the Samaritans — a despised mixed population in later Jewish tradition. The fate of the Ten Lost Tribes became a powerful myth; various groups (Ethiopian Jews, Pashtuns, Japanese Shintoists, Native Americans) have been identified with them. The rabbis debated whether the Lost Tribes will return in the messianic age.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'The fall of Israel is cited as a warning about the consequences of unfaithfulness. Jesus\'s interaction with the Samaritan woman (John 4) and the Parable of the Good Samaritan (Luke 10) deliberately engage with the legacy of the northern kingdom\'s fall. The restoration of the tribes is an eschatological expectation (Revelation 7:4-8 lists all 12 tribes).' },
        { tradition: 'ISLAMIC' as const, presence: 'MODIFIED' as const, notes: 'The Quran references two periods of corruption by Bani Israel and two punishments (17:4-8), which commentators often identify as the Assyrian and Babylonian/Roman destructions. The pattern of divine punishment for transgression is central to the Quranic narrative. The Quran does not specifically discuss the "lost tribes" but the theme of nations being punished for rejecting prophets is pervasive.' },
      ],
    },
    {
      slug: 'daniel-in-babylon',
      name: 'Daniel in the Babylonian Court',
      era: 'KINGDOM' as const,
      position: 45,
      summary:
        'The prophet Daniel, taken captive to Babylon as a youth, rises to prominence through his ability to interpret dreams and visions. His apocalyptic visions of four kingdoms and the "Son of Man" become some of the most debated prophecies in all Abrahamic scripture.',
      traditions: [
        { tradition: 'JEWISH' as const, presence: 'AFFIRMED' as const, notes: 'The Book of Daniel is classified in the Ketuvim (Writings), not the Nevi\'im (Prophets) — Jews generally do not consider Daniel a prophet in the technical sense. His miraculous deliverance from the lion\'s den (Daniel 6) and his three friends from the fiery furnace (Daniel 3) are models of faithfulness under persecution. His vision of the "Son of Man" (7:13-14) is read as a symbol of Israel vindicated by God. His 70 weeks prophecy (9:24-27) has generated endless messianic speculation.' },
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Daniel is classified as a major prophet in the Christian Bible. Jesus explicitly identifies himself as the "Son of Man" (Daniel 7:13-14) over 80 times in the Gospels — the most common title he uses for himself. The 70 weeks prophecy (Daniel 9:24-27) is read as pointing precisely to the time of Christ. Daniel\'s apocalyptic visions of four kingdoms (ch. 2, 7) provide the framework for Revelation. Jesus cites the "abomination of desolation" from Daniel (Matt 24:15).' },
        { tradition: 'ISLAMIC' as const, presence: 'MODIFIED' as const, notes: 'Daniel is not mentioned in the Quran but is recognized in Islamic tradition (hadith and historical sources). A tomb attributed to him exists in Susa, Iran. The Prophet Muhammad reportedly said: "The people of Susa found the body of Daniel." Islamic scholars accept him as a righteous figure. His apocalyptic visions are not central to Islamic eschatology, which has its own framework (Mahdi, Dajjal, return of Isa).' },
      ],
    },

    // ── GOSPEL ───────────────────────────────────────────────────────────────
    {
      slug: 'jesus-temptation-wilderness',
      name: 'The Temptation in the Wilderness',
      era: 'GOSPEL' as const,
      position: 51,
      summary:
        'After his baptism, Jesus spends 40 days fasting in the wilderness, where he is tempted three times by Satan — to turn stones to bread, to throw himself from the Temple, and to worship Satan in exchange for all the kingdoms of the world.',
      traditions: [
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Matthew 4:1-11; Luke 4:1-13; Mark 1:12-13. The three temptations represent the lust of the flesh, the lust of the eyes, and the pride of life (1 John 2:16). Jesus defeats Satan by quoting Deuteronomy three times — showing that obedience to God\'s word is the weapon against temptation. The 40 days parallel Israel\'s 40 years in the wilderness (where Israel failed, Jesus succeeds). This event establishes Jesus as the "new Adam" who does not fall to the tempter, and the "new Israel" who is faithful in testing.' },
        { tradition: 'JEWISH' as const, presence: 'SILENT' as const, notes: 'Judaism has no canonical position on this event. The 40-day pattern echoes Moses on Sinai (Exodus 34:28) and Elijah\'s journey to Horeb (1 Kings 19:8). The concept of being tested by a satanic figure exists in Judaism (Job 1-2) but the specific temptation narrative belongs exclusively to Christian scripture.' },
        { tradition: 'ISLAMIC' as const, presence: 'SILENT' as const, notes: 'The Quran does not record a wilderness temptation of Jesus. Islam teaches that prophets are protected from major sin (isma), so a narrative of temptation — while not impossible — is not part of the Islamic portrayal of Isa. The broader concept of Iblis tempting humanity is affirmed, but specific temptation of prophets is generally minimized in Islamic theology.' },
      ],
    },
    {
      slug: 'raising-of-lazarus',
      name: 'The Raising of Lazarus',
      era: 'GOSPEL' as const,
      position: 52,
      summary:
        'Jesus arrives in Bethany four days after the death of his friend Lazarus and commands him to come out of the tomb — and Lazarus, still wrapped in burial cloths, walks out alive.',
      traditions: [
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'John 11:1-44. Jesus declares: "I am the resurrection and the life. Whoever believes in me, though he die, yet shall he live" (11:25) — one of the most important theological statements in John\'s Gospel. The raising of Lazarus is the climactic miracle that triggers the plot to kill Jesus (11:53). It demonstrates Christ\'s power over death and prefigures his own resurrection. "Jesus wept" (11:35) — the shortest verse in the Bible — shows his full humanity.' },
        { tradition: 'JEWISH' as const, presence: 'SILENT' as const, notes: 'Judaism has no canonical position on this event. The concept of resurrection (techiyat ha-meitim) exists in Jewish tradition but as an eschatological event, not a present miracle. The claim of raising the dead would have been evaluated against the Torah\'s criteria for prophets — but Jesus\'s broader claims exceeded what Judaism could accept.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'The Quran affirms that Isa raised the dead by God\'s permission (3:49; 5:110): "and I give life to the dead — by permission of Allah." While Lazarus is not named, the miracle of raising the dead is explicitly attributed to Jesus in the Quran. Crucially, Islam insists this was done "by permission of Allah" — not by Jesus\'s own divine power. The miracles prove Isa\'s prophethood, not his divinity.' },
      ],
    },
    {
      slug: 'triumphal-entry-jerusalem',
      name: 'The Triumphal Entry into Jerusalem',
      era: 'GOSPEL' as const,
      position: 53,
      summary:
        'Jesus enters Jerusalem riding on a donkey as crowds wave palm branches and cry "Hosanna to the Son of David!" — fulfilling Zechariah 9:9. The event is celebrated as Palm Sunday in Christianity.',
      traditions: [
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Matthew 21:1-11; Mark 11:1-11; Luke 19:28-44; John 12:12-19. Jesus deliberately arranges the entry to fulfill Zechariah 9:9 — coming as a humble king on a donkey, not a warhorse. The crowds spread cloaks and palm branches; the cry "Hosanna" (Hebrew: hoshia-na, "save us") is a messianic acclamation. Palm Sunday begins Holy Week — the journey from triumph to crucifixion in five days.' },
        { tradition: 'JEWISH' as const, presence: 'MODIFIED' as const, notes: 'Zechariah 9:9 is indeed a messianic text in Jewish tradition — the humble king on a donkey. However, Judaism reads this as a yet-unfulfilled prophecy of the future Messiah. The Talmud (Sanhedrin 98a) teaches that the Messiah will come riding a donkey if Israel is unworthy, or on the clouds of heaven if worthy. Jesus\'s entry is not recognized as messianic fulfillment because he did not bring universal peace or rebuild the Temple.' },
        { tradition: 'ISLAMIC' as const, presence: 'SILENT' as const, notes: 'The Quran does not record the triumphal entry. Islam honors Isa as a prophet but does not attribute messianic kingship to his ministry on earth. The concept of Jesus entering Jerusalem as a king is not part of the Islamic narrative. Jesus\'s connection to Jerusalem in Islam is primarily through the Night Journey (Isra) of Muhammad, not through Jesus\'s own ministry there.' },
      ],
    },
    {
      slug: 'garden-of-gethsemane',
      name: 'The Agony in the Garden of Gethsemane',
      era: 'GOSPEL' as const,
      position: 54,
      summary:
        'On the night before his crucifixion, Jesus prays in anguish in the Garden of Gethsemane, asking the Father to "let this cup pass from me" — but submitting: "not my will, but yours be done." He is then arrested by a mob led by Judas.',
      traditions: [
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Matthew 26:36-56; Mark 14:32-50; Luke 22:39-53. Jesus\'s prayer reveals his full humanity — dread, anguish, and the desire to avoid suffering — while his submission reveals his divine obedience. Luke records that his sweat became like drops of blood (hematohidrosis). The disciples sleep while he prays — "the spirit is willing but the flesh is weak" (Matt 26:41). Judas\'s betrayal with a kiss is the ultimate symbol of treachery.' },
        { tradition: 'JEWISH' as const, presence: 'SILENT' as const, notes: 'Gethsemane (Gat Shmanim — "oil press") is on the Mount of Olives. Judaism has no canonical position on this event. The concept of righteous suffering and prayer before death exists in Jewish tradition (compare Hannah\'s prayer, David\'s psalms), but the specific Gethsemane narrative is exclusively Christian scripture.' },
        { tradition: 'ISLAMIC' as const, presence: 'REJECTED' as const, notes: 'Since Islam denies the crucifixion of Jesus (4:157), the Gethsemane narrative has no theological place in Islamic belief. If Jesus was not crucified, he would not have prayed in anguish about an upcoming death. Some Muslim scholars suggest this might be the point where God intervened to raise Jesus and substitute another person (the substitution theory).' },
      ],
    },
    {
      slug: 'ascension-of-jesus',
      name: 'The Ascension of Jesus',
      era: 'GOSPEL' as const,
      position: 55,
      summary:
        'Forty days after his resurrection, Jesus is taken up into heaven in the presence of his disciples. Two angels appear and declare that he will return in the same way he ascended.',
      traditions: [
        { tradition: 'CHRISTIAN' as const, presence: 'AFFIRMED' as const, notes: 'Acts 1:6-11; Luke 24:50-53; Mark 16:19. The Ascension completes the incarnation cycle: descent from heaven (birth) → ministry → death → resurrection → return to heaven. Jesus sits at the "right hand of the Father" (Apostles\' Creed). The Ascension is a major feast day in all Christian traditions. It establishes Christ as the heavenly intercessor (Hebrews 7:25) and prepares for the sending of the Holy Spirit at Pentecost ten days later.' },
        { tradition: 'JEWISH' as const, presence: 'SILENT' as const, notes: 'Judaism has no canonical position on the Ascension. The concept of being taken to heaven without dying exists in Jewish tradition — Enoch (Gen 5:24) and Elijah (2 Kings 2:11) — but Judaism does not accept Jesus as a figure in this category. The messianic claims associated with the Ascension are entirely rejected.' },
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Islam affirms that God raised Jesus to Himself (3:55; 4:158) — but places this event INSTEAD of the crucifixion, not after it. "Allah raised him to Himself" (rafa\'ahu Allahu ilayhi). Jesus is alive in heaven and will return before the Day of Judgment. The timing and circumstances of the "raising" differ entirely from the Christian Ascension: Islam places it at the moment of the attempted crucifixion, not 40 days after the resurrection.' },
      ],
    },

    // ── EARLY_ISLAM ──────────────────────────────────────────────────────────
    {
      slug: 'treaty-of-hudaybiyyah',
      name: 'Treaty of Hudaybiyyah',
      era: 'EARLY_ISLAM' as const,
      position: 63,
      summary:
        'In 628 CE (6 AH), Muhammad negotiates a 10-year peace treaty with the Quraysh of Mecca. Though the terms seem unfavorable, the Quran calls it "a clear victory" — it establishes Islam as a legitimate political entity and enables rapid expansion.',
      traditions: [
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Quran 48:1 (Surah Al-Fath, "The Victory"): "Indeed, We have given you a clear conquest." The terms seemed humiliating to the Companions — Muslims had to return to Medina without performing Umrah, and return Meccan converts. But the treaty enabled two years of peaceful da\'wa (preaching) during which Islam tripled in size. It also established a precedent: diplomacy and treaty-making as legitimate tools of Islamic statecraft. When Mecca violated the treaty, it gave Muhammad the legal basis for the Conquest of Mecca in 630 CE.' },
        { tradition: 'JEWISH' as const, presence: 'SILENT' as const, notes: 'No canonical Jewish position on this event. The treaty negotiations involved no Jewish parties, as the major Jewish tribes of Medina had already been expelled or defeated by this point in Islamic history.' },
        { tradition: 'CHRISTIAN' as const, presence: 'SILENT' as const, notes: 'No canonical Christian position. The treaty is significant in the broader context of Islam\'s rapid rise — within years of this treaty, the entire Arabian Peninsula would come under Islamic rule, followed by the conquest of the Sassanid Persian Empire and large portions of the Byzantine Christian Empire.' },
      ],
    },
    {
      slug: 'battle-of-uhud',
      name: 'Battle of Uhud',
      era: 'EARLY_ISLAM' as const,
      position: 62,
      summary:
        'In 625 CE (3 AH), the Meccans seek revenge for Badr and attack with 3,000 men. The Muslim archers disobey orders and leave their positions; the Muslim army suffers heavy losses. The Prophet himself is wounded. Uhud becomes a lesson in obedience and humility.',
      traditions: [
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Quran 3:121-179. Unlike Badr, Uhud is a military setback — presented by the Quran as a divine test and a consequence of disobedience (the archers abandoned their posts to collect war spoils). The Prophet was wounded in the face and a rumor spread that he was killed. Hamza, the Prophet\'s uncle, was killed and mutilated. The Quran reassures: "If a wound should touch you, there has already touched the [opposing] people a wound similar to it" (3:140). Uhud taught the Muslims that victory requires both faith AND discipline.' },
        { tradition: 'JEWISH' as const, presence: 'SILENT' as const, notes: 'No canonical Jewish position. The Jewish tribe Banu Nadir was expelled from Medina shortly after Uhud, partly because of suspicion of collaboration with the Meccans.' },
        { tradition: 'CHRISTIAN' as const, presence: 'SILENT' as const, notes: 'No canonical Christian position. The defeat at Uhud and the subsequent Quranic response have been compared by scholars to biblical patterns of interpreting military defeat theologically — particularly the Deuteronomistic history, which attributes Israel\'s losses to sin and disobedience.' },
      ],
    },
    {
      slug: 'battle-of-the-trench',
      name: 'Battle of the Trench (Khandaq)',
      era: 'EARLY_ISLAM' as const,
      position: 63,
      summary:
        'In 627 CE (5 AH), a coalition of 10,000 Meccans and allies besiege Medina. Salman al-Farsi suggests digging a trench around the city — an unprecedented tactic in Arabia. The siege fails after two weeks.',
      traditions: [
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'Quran 33:9-27 (Surah Al-Ahzab, "The Confederates"). The combined force of Quraysh, Ghatafan, and other tribes — called "the Confederates" (al-Ahzab) — attempt to overwhelm Medina. The trench strategy (suggested by Salman al-Farsi, a Persian convert) neutralizes the Meccan cavalry. God sends a fierce wind and unseen forces (33:9). The failure of the siege marks the strategic turning point — after this, Mecca will never attack Medina again. The Banu Qurayza Jewish tribe, accused of breaking their treaty during the siege, are besieged and ultimately executed — a deeply controversial event in interfaith relations.' },
        { tradition: 'JEWISH' as const, presence: 'MODIFIED' as const, notes: 'The fate of the Banu Qurayza is one of the most sensitive topics in Jewish-Muslim relations. After the siege, the Jewish tribe was accused of treachery and besieged. Their fate was judged by Sa\'d ibn Mu\'adh (who ruled according to Torah law, Deut 20:13-14). Between 400-900 men were executed and women and children enslaved. Islamic sources present this as the consequence of treaty violation; Jewish and Western historians have debated the scale and circumstances extensively.' },
        { tradition: 'CHRISTIAN' as const, presence: 'SILENT' as const, notes: 'No canonical Christian position. The event is studied in comparative religion and military history. The fate of the Banu Qurayza has been a focus of modern academic debate about early Muslim-Jewish relations and the application of religious law to warfare.' },
      ],
    },
    {
      slug: 'compilation-of-quran',
      name: 'Compilation of the Quran',
      era: 'EARLY_ISLAM' as const,
      position: 66,
      summary:
        'Under the third Caliph Uthman ibn Affan (644-656 CE), the Quran is compiled into a single authoritative written text (mushaf) and variant copies are destroyed, establishing the textual unity that the Quran maintains to this day.',
      traditions: [
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'The Quran was memorized by hundreds of companions (huffaz) and written on various materials during Muhammad\'s lifetime. Abu Bakr ordered the first compilation after the Battle of Yamama (633 CE) killed many memorizers. Uthman\'s standardization (c. 650 CE) produced a single authorized text and destroyed variant codices (mushaf of Ibn Mas\'ud, Ubayy ibn Ka\'b). This is a source of Muslim pride — the Quran claims to be divinely preserved (15:9: "Indeed, it is We who sent down the remembrance, and indeed, We will be its guardian"). Modern scholarship (Birmingham manuscript, Sana\'a palimpsest) has confirmed the text\'s remarkable stability.' },
        { tradition: 'JEWISH' as const, presence: 'SILENT' as const, notes: 'The compilation process has been compared to the canonization of the Hebrew Bible — both involved selecting from variant traditions. Jewish tradition credits Ezra and the Great Assembly with fixing the Torah text; the Masoretes (6th-10th century CE) standardized the vowelization and cantillation of the Hebrew Bible, much later than the Uthmanic Quran compilation.' },
        { tradition: 'CHRISTIAN' as const, presence: 'SILENT' as const, notes: 'Christian scholars compare Uthman\'s compilation to the early church\'s process of canonizing the New Testament (finalized c. 4th century CE). The destruction of variant Quran codices has no Christian parallel — multiple textual families of the New Testament were preserved, and textual criticism remains a major field. The Quran\'s textual uniformity contrasts with the rich manuscript tradition of the New Testament.' },
      ],
    },
    {
      slug: 'martyrdom-of-husayn-karbala',
      name: 'The Martyrdom of Husayn at Karbala',
      era: 'EARLY_ISLAM' as const,
      position: 67,
      summary:
        'In 680 CE (61 AH), Husayn ibn Ali — the grandson of Muhammad and son of Ali — is killed with 72 companions by the Umayyad army at Karbala in Iraq. This event becomes the foundational trauma of Shia Islam, commemorated annually in Ashura mourning rituals.',
      traditions: [
        { tradition: 'ISLAMIC' as const, presence: 'AFFIRMED' as const, notes: 'The Battle of Karbala is the defining moment of the Sunni-Shia split. Husayn, invited by the people of Kufa to lead a revolt against the Umayyad Caliph Yazid, is intercepted at Karbala and massacred with his small band. The atrocity is universally condemned by all Muslims — Sunni and Shia. For Shia Islam, Karbala is a cosmic event: the martyrdom of the Prophet\'s grandson embodies the struggle of justice against tyranny. Ashura (10th of Muharram) involves mourning processions, passion plays (ta\'ziyah), and self-flagellation in some Shia communities. The phrase "Every day is Ashura, every land is Karbala" expresses the ongoing significance.' },
        { tradition: 'JEWISH' as const, presence: 'SILENT' as const, notes: 'No canonical Jewish position. Ashura (10th of Muharram) in Sunni Islam is actually linked to the 10th of Tishrei (Yom Kippur) — the Prophet reportedly fasted on this day because the Jews of Medina fasted to commemorate Moses\'s deliverance from Pharaoh. The Shia and Sunni observances of Ashura have completely different emphases.' },
        { tradition: 'CHRISTIAN' as const, presence: 'SILENT' as const, notes: 'No canonical Christian position. Christian scholars have drawn structural comparisons between Karbala and the Passion of Christ: an innocent holy figure willingly going to death, a betrayal by those who invited him, suffering as a redemptive act. Shia Islam\'s emphasis on suffering and intercession has been compared to Catholic and Orthodox spirituality of the Cross. The theological parallels — and their limits — are a significant topic in comparative religion.' },
      ],
    },
  ]

  for (const event of events) {
    const { traditions, ...eventData } = event
    await prisma.timelineEvent.upsert({
      where: { slug: eventData.slug },
      update: {},
      create: {
        ...eventData,
        isPublished: true,
        traditions: {
          create: traditions,
        },
      },
    })
  }

  console.log(`  ✓ Seeded ${events.length} timeline events`)
}
