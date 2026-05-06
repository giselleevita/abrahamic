import type { PrismaClient } from '@prisma/client'

export async function seedFigures(prisma: PrismaClient) {
  const figures = [
    // ── Primordial ──────────────────────────────────────────────────────────
    {
      canonicalName: 'Adam',
      slug: 'adam',
      description:
        `Adam is the first human being in all three Abrahamic traditions. Created from dust/clay by God, he is placed in the Garden of Eden/Paradise. His disobedience — eating the forbidden fruit — results in expulsion and introduces mortality. In Judaism, Adam's sin is individual; in Christianity it produces "original sin" inherited by all humanity; in Islam, Adam repents and is forgiven, making him the first prophet. Lineage: Adam → Seth → Enosh → ... → Noah.`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'Adam', language: 'Hebrew', notes: 'אָדָם — "man" or "earth"; created on the sixth day (Genesis 1–2)' },
        { tradition: 'CHRISTIAN' as const, name: 'Adam', language: 'Greek', notes: "Ἀδάμ — Paul calls Jesus the \"second Adam\" who reverses the first Adam's fall (Rom 5:14)" },
        { tradition: 'ISLAMIC' as const, name: 'Adam', language: 'Arabic', notes: 'آدَم — the first prophet; God taught him the names of all things; repented and was forgiven (Surah 2:37)' },
      ],
    },
    {
      canonicalName: 'Eve',
      slug: 'eve',
      description:
        `Eve (Hawwa in Arabic) is the first woman, created from Adam's rib according to the Abrahamic scriptures. In Judaism she is the mother of all living. In Christianity her role in the fall introduces the concept of original sin alongside Adam. In Islam, Hawwa is mentioned only obliquely; the Quran places equal blame on both Adam and Hawwa for eating the forbidden fruit. Lineage: Adam + Eve → Cain, Abel, Seth (and others).`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'Chava', language: 'Hebrew', notes: 'חַוָּה — "living"; named by Adam in Genesis 3:20' },
        { tradition: 'CHRISTIAN' as const, name: 'Eve', language: 'Greek', notes: 'Εὔα — featured in typological contrast with Mary, who is called the "New Eve"' },
        { tradition: 'ISLAMIC' as const, name: 'Hawwa', language: 'Arabic', notes: 'حَوَّاء — shares equal blame with Adam in Quran; both are forgiven together (2:37)' },
      ],
    },
    {
      canonicalName: 'Enoch',
      slug: 'enoch',
      description:
        `Enoch (son of Jared) walked with God and was taken by God without dying (Genesis 5:24). He is associated with the apocryphal Book of Enoch in Judaism. In Christianity, Enoch is cited in Hebrews as a man of faith. In Islam, Idris is identified with Enoch and regarded as a prophet and sage who was elevated to a high place. Lineage: Adam → Seth → ... → Enoch/Idris → Methuselah → Lamech → Noah.`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'Chanoch', language: 'Hebrew', notes: 'חֲנוֹךְ — "dedicated"; walked with God 365 years; taken by God (Gen 5:24); credited with esoteric Book of Enoch' },
        { tradition: 'CHRISTIAN' as const, name: 'Enoch', language: 'Greek', notes: "Ἑνώχ — praised in the \"Hall of Faith\" (Hebrews 11:5) as one who pleased God" },
        { tradition: 'ISLAMIC' as const, name: 'Idris', language: 'Arabic', notes: 'إِدْرِيس — mentioned in Quran 19:56–57 as a truthful prophet raised to a high place; associated with knowledge and writing' },
      ],
    },
    {
      canonicalName: 'Noah',
      slug: 'noah',
      description:
        `Noah is the builder of the Ark and survivor of the great Flood sent by God to cleanse a corrupt world. He is a righteous figure in all three traditions. In Judaism, the Noahide Laws (7 universal commandments) derive from the covenant God makes with Noah after the flood. In Christianity, the flood and Noah's ark are types of baptism and salvation. In Islam, Nuh is a major prophet who preached for 950 years. Lineage: Adam → ... → Noah → Shem, Ham, Japheth.`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'Noach', language: 'Hebrew', notes: "נֹחַ — \"rest/comfort\"; recipient of the Noahide covenant; rainbow sign (Gen 9); ancestor of all post-flood humanity" },
        { tradition: 'CHRISTIAN' as const, name: 'Noah', language: 'Greek', notes: "Νῶε — the ark typifies the Church and baptism (1 Pet 3:20–21); a preacher of righteousness (2 Pet 2:5)" },
        { tradition: 'ISLAMIC' as const, name: 'Nuh', language: 'Arabic', notes: "نُوح — entire Surah 71 (Nuh) dedicated to him; preached 950 years; one of the five Ulul Azm (prophets of strong will)" },
      ],
    },
    {
      canonicalName: 'Lot',
      slug: 'lot',
      description:
        `Lot is the nephew of Abraham who settled in Sodom. When God destroys Sodom and Gomorrah for their wickedness, Lot and his family escape. His wife looks back and turns to a pillar of salt. In Islam, Lut is a prophet sent specifically to the people of Sodom. Lineage: Lot is the son of Haran (Abraham's brother), making him Abraham's nephew.`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'Lot', language: 'Hebrew', notes: 'לוֹט — nephew of Abraham; saved from Sodom (Gen 19); ancestor of Moabites and Ammonites through his daughters' },
        { tradition: 'CHRISTIAN' as const, name: 'Lot', language: 'Greek', notes: 'Λώτ — cited as a righteous man rescued from wicked Sodom (2 Pet 2:7–8)' },
        { tradition: 'ISLAMIC' as const, name: 'Lut', language: 'Arabic', notes: "لُوط — a prophet and messenger (rasul) sent to the people of Sodom; mentioned in 15 surahs; sent to condemn wickedness" },
      ],
    },
    // ── Patriarchal ─────────────────────────────────────────────────────────
    {
      canonicalName: 'Abraham',
      slug: 'abraham',
      description:
        `Abraham is recognized across all three Abrahamic traditions as the founding patriarch who established monotheism. Called to leave Ur of the Chaldeans, he entered into a covenant with God. Lineage: Abraham + Hagar → Ishmael; Abraham + Sarah → Isaac → Jacob (Israel) → 12 Tribes. The Arab/Islamic prophetic line runs through Ishmael; the Israelite line through Isaac.`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'Avraham', language: 'Hebrew', notes: 'אַבְרָהָם — renamed from Avram (Gen 17:5); first to be called "Hebrew" (Ivri); father of the Jewish people through Isaac and Jacob' },
        { tradition: 'CHRISTIAN' as const, name: 'Abraham', language: 'Greek', notes: 'Ἀβραάμ — Paul cites him as father of all the faithful, justified by faith not law (Rom 4; Gal 3)' },
        { tradition: 'ISLAMIC' as const, name: 'Ibrahim', language: 'Arabic', notes: "إِبْرَاهِيم — Khalilullah (Friend of God); hanif (pure monotheist); rebuilt the Ka'ba with Ishmael; one of five Ulul Azm prophets" },
      ],
    },
    {
      canonicalName: 'Hagar',
      slug: 'hagar',
      description:
        `Hagar is the Egyptian handmaid of Sarah who becomes the mother of Ishmael, Abraham's firstborn son. When Sarah becomes jealous after the birth of Isaac, Hagar and Ishmael are expelled into the desert. In Islam, Hagar (Hajar) is a central figure — her running between Safa and Marwa in search of water is commemorated in the Hajj ritual (Sa'i). Lineage: Hagar + Abraham → Ishmael → 12 Arab tribes → Muhammad (through Adnan lineage).`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'Hagar', language: 'Hebrew', notes: 'הָגָר — Egyptian servant; her expulsion into the desert with Ishmael is recorded in Gen 21; God saves them at a well' },
        { tradition: 'CHRISTIAN' as const, name: 'Hagar', language: 'Greek', notes: 'Ἄγαρ — Paul uses her allegorically as representing the Sinai covenant and slavery (Gal 4:24–25)' },
        { tradition: 'ISLAMIC' as const, name: 'Hajar', language: 'Arabic', notes: "هَاجَر — her running between Safa and Marwa for water forms the Sa'i ritual of Hajj; considered a pious and faithful woman" },
      ],
    },
    {
      canonicalName: 'Ishmael',
      slug: 'ishmael',
      description:
        `Ishmael is Abraham's firstborn son by Hagar. In Judaism and Christianity he is the ancestor of Arab peoples, distinct from the covenant line through Isaac. In Islam, Ishmael (Isma'il) is a prophet of the highest rank, the one Abraham nearly sacrificed (not Isaac), and the co-builder of the Ka'ba in Mecca with Abraham. Lineage: Abraham + Hagar → Ishmael → 12 Princes (Gen 25) → Arab tribes → Muhammad (through Kedar line).`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'Yishmael', language: 'Hebrew', notes: 'יִשְׁמָעֵאל — "God hears"; circumcised at 13 (Gen 17); ancestor of 12 princes; not the heir of the Abrahamic covenant' },
        { tradition: 'CHRISTIAN' as const, name: 'Ishmael', language: 'Greek', notes: 'Ἰσμαήλ — used by Paul as a type of the "child of the flesh" vs. Isaac as the "child of promise" (Gal 4:23)' },
        { tradition: 'ISLAMIC' as const, name: 'Ismail', language: 'Arabic', notes: "إِسْمَاعِيل — a prophet and rasul; built the Ka'ba with Ibrahim; the son offered for sacrifice (per Islamic tradition); his descendants settled in Hijaz" },
      ],
    },
    {
      canonicalName: 'Isaac',
      slug: 'isaac',
      description:
        `Isaac is the son born to Abraham and Sarah in their old age, fulfilling God's promise. He is nearly sacrificed by Abraham (the Akedah/binding of Isaac) before God substitutes a ram. In Judaism and Christianity, he is the covenant heir through whom God's promises to Abraham continue. In Islam, Ishaq is a prophet and the father of Yaqub (Jacob). Lineage: Abraham + Sarah → Isaac → Jacob (Israel) → 12 Tribes.`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'Yitzchak', language: 'Hebrew', notes: 'יִצְחָק — "he will laugh"; the Akedah (binding, Gen 22) is central to Jewish theology of sacrifice; covenant heir' },
        { tradition: 'CHRISTIAN' as const, name: 'Isaac', language: 'Greek', notes: "Ἰσαάκ — the Akedah prefigures Christ's sacrifice; Isaac carries wood up the mountain as Christ carried the cross" },
        { tradition: 'ISLAMIC' as const, name: 'Ishaq', language: 'Arabic', notes: "إِسْحَاق — a prophet; father of Yaqub; distinct from the Islamic view that Ismail was the one offered for sacrifice, not Ishaq" },
      ],
    },
    {
      canonicalName: 'Jacob',
      slug: 'jacob',
      description:
        `Jacob (renamed Israel after wrestling with an angel) is the son of Isaac and grandson of Abraham. He is the father of the twelve sons who become the twelve tribes of Israel. Lineage: Isaac → Jacob/Israel → 12 Sons: Reuben, Simeon, Levi (→ Moses/Aaron/Miriam), Judah (→ David → Jesus's genealogy), Dan, Naphtali, Gad, Asher, Issachar, Zebulun, Joseph (→ Ephraim, Manasseh), Benjamin.`,
      aliases: [
        { tradition: 'JEWISH' as const, name: "Ya'akov / Yisrael", language: 'Hebrew', notes: 'יַעֲקֹב / יִשְׂרָאֵל — renamed Israel ("one who wrestles with God") after wrestling with the angel at Peniel (Gen 32:28); the nation Israel takes his name' },
        { tradition: 'CHRISTIAN' as const, name: 'Jacob', language: 'Greek', notes: "Ἰακώβ — appears in the genealogy of Jesus (Matt 1:2); Jesus's well encounter with the Samaritan woman at \"Jacob's well\" (John 4)" },
        { tradition: 'ISLAMIC' as const, name: "Ya'qub", language: 'Arabic', notes: 'يَعْقُوب — a prophet mentioned in 10 surahs; prominent in the story of Yusuf (Joseph); blind from grief at Joseph\'s absence, later healed' },
      ],
    },
    {
      canonicalName: 'Joseph',
      slug: 'joseph',
      description:
        `Joseph is the favored son of Jacob, sold into slavery by his jealous brothers, who rises to become Viceroy of Egypt. His story is told in Genesis 37–50 and in Surah 12 (Yusuf) — described in the Quran as "the most beautiful of stories." Lineage: Jacob + Rachel → Joseph (and Benjamin). Joseph's sons Ephraim and Manasseh become two of the twelve tribes.`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'Yosef', language: 'Hebrew', notes: "יוֹסֵף — central to the patriarchal narrative; his coat of many colours; his gift of dream interpretation; reconciliation with brothers" },
        { tradition: 'CHRISTIAN' as const, name: 'Joseph', language: 'Greek', notes: "Ἰωσήφ — a type of Christ: betrayed for 20 pieces of silver, falsely accused, imprisoned, then exalted; also Stephen's speech (Acts 7)" },
        { tradition: 'ISLAMIC' as const, name: 'Yusuf', language: 'Arabic', notes: "يُوسُف — Surah 12 (Yusuf) is the longest continuous narrative in the Quran; called \"the most beautiful of stories\"; he is a prophet who forgives his brothers" },
      ],
    },
    // ── Exodus ──────────────────────────────────────────────────────────────
    {
      canonicalName: 'Moses',
      slug: 'moses',
      description:
        `Moses is the central prophet of Judaism who received the Torah at Sinai and led the Israelites out of Egypt. He is venerated in Christianity as a lawgiver and prefigurer of Christ, and in Islam as a major prophet (Rasul) who received divine scripture (the Tawrat). He is the most-mentioned prophet in the Quran. Lineage: Levi (son of Jacob) → Kohath → Amram + Jochebed → Aaron, Moses, Miriam.`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'Moshe', language: 'Hebrew', notes: "מֹשֶׁה — the greatest prophet in Jewish tradition; spoke with God \"face to face\" (Deut 34:10); mediator of the Sinai covenant" },
        { tradition: 'CHRISTIAN' as const, name: 'Moses', language: 'Greek', notes: "Μωϋσῆς — appears at the Transfiguration alongside Elijah; Jesus is presented as a \"new Moses\" in Matthew's Gospel" },
        { tradition: 'ISLAMIC' as const, name: 'Musa', language: 'Arabic', notes: "مُوسَى — most-mentioned prophet in the Quran (136 times); given the Tawrat (Torah); spoke directly with God (Kalimullah); one of five Ulul Azm" },
      ],
    },
    {
      canonicalName: 'Aaron',
      slug: 'aaron',
      description:
        `Aaron is the older brother of Moses and the first High Priest of Israel. He assists Moses in confronting Pharaoh and performs miraculous signs. He briefly leads the people into making the Golden Calf. In Islam, Harun is a prophet and minister (wazir) to Musa. Lineage: Amram + Jochebed → Aaron + Moses + Miriam; Aaron's descendants became the Kohanim (Jewish priestly class).`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'Aharon', language: 'Hebrew', notes: "אַהֲרֹן — first High Priest; his rod budded (Num 17); his descendants are the Kohanim; Korah's rebellion was against his authority" },
        { tradition: 'CHRISTIAN' as const, name: 'Aaron', language: 'Greek', notes: "Ἀαρών — the Levitical priesthood under Aaron is contrasted with the priesthood of Melchizedek/Christ in Hebrews 7" },
        { tradition: 'ISLAMIC' as const, name: 'Harun', language: 'Arabic', notes: "هَارُون — a prophet; Moses asked God to make him a wazir (minister/helper) in Surah 20:29–32; mentioned 20 times in the Quran" },
      ],
    },
    // ── Kingdom ──────────────────────────────────────────────────────────────
    {
      canonicalName: 'David',
      slug: 'david',
      description:
        `David is the shepherd-king of Israel who defeated Goliath, united the tribes, conquered Jerusalem, and is credited with composing the Psalms. In Judaism he is the ideal king; in Christianity, Jesus is the "Son of David"; in Islam, Dawud is a prophet-king who received the Zabur (Psalms) as divine scripture. Lineage: Judah (Jacob's son) → Perez → ... → Jesse → David → Solomon → (Davidic royal line and genealogy to Jesus in NT).`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'David', language: 'Hebrew', notes: "דָּוִד — anointed king by Samuel; composed Psalms (Tehillim); the Messiah will be from his line (2 Sam 7:16); Jerusalem is the \"City of David\"" },
        { tradition: 'CHRISTIAN' as const, name: 'David', language: 'Greek', notes: "Δαυίδ — Jesus is \"Son of David\" 17× in NT; his covenant (2 Sam 7) is fulfilled in Christ; the Psalms are the most-quoted OT text in NT" },
        { tradition: 'ISLAMIC' as const, name: 'Dawud', language: 'Arabic', notes: "دَاوُود — prophet-king; given the Zabur (Psalms); famous for killing Jalut (Goliath); known for his melodious voice; mentioned in Surah 2:251" },
      ],
    },
    {
      canonicalName: 'Solomon',
      slug: 'solomon',
      description:
        `Solomon is the son of David, renowned for his wisdom, wealth, and the construction of the First Temple in Jerusalem. In Islam, Sulayman commands jinn and birds, and the Queen of Sheba (Bilqis) visits him. Controversially, his 700 wives and 300 concubines, many pagan, led to idolatry in his old age (1 Kings 11) — a fact Islam denies for a prophet. Lineage: David + Bathsheba → Solomon → Rehoboam → (Judah's royal line).`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'Shlomo', language: 'Hebrew', notes: "שְׁלֹמֹה — built the First Temple (Beit HaMikdash); authored Proverbs, Ecclesiastes, Song of Songs; 700 wives led to idolatry (1 Kings 11)" },
        { tradition: 'CHRISTIAN' as const, name: 'Solomon', language: 'Greek', notes: "Σολομών — Jesus surpasses his wisdom (\"something greater than Solomon is here,\" Matt 12:42); Temple typologically fulfilled in Christ's body (John 2:19)" },
        { tradition: 'ISLAMIC' as const, name: 'Sulayman', language: 'Arabic', notes: "سُلَيْمَان — commands wind, jinn, and birds; receives the hoopoe's message from Sheba (Surah 27); given unparalleled dominion (38:35); a just and wise prophet-king" },
      ],
    },
    {
      canonicalName: 'Elijah',
      slug: 'elijah',
      description:
        `Elijah is the dramatic prophet who confronts the prophets of Baal on Mount Carmel and flees to Horeb (Sinai) to encounter God. He is taken to heaven in a chariot of fire without dying. In Judaism, Elijah is expected to return before the Messiah (Malachi 4:5). In Christianity, John the Baptist comes "in the spirit of Elijah." In Islam, Ilyas is a prophet who calls his people back from idol worship.`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'Eliyahu', language: 'Hebrew', notes: "אֵלִיָּהוּ — \"My God is YHWH\"; taken to heaven in a fiery chariot (2 Kings 2); the Passover Seder sets a cup for him; Malachi predicts his return (4:5)" },
        { tradition: 'CHRISTIAN' as const, name: 'Elijah', language: 'Greek', notes: "Ἠλίας — appears at the Transfiguration with Moses and Jesus (Mark 9:4); John the Baptist is the Elijah-figure who prepares the way (Luke 1:17)" },
        { tradition: 'ISLAMIC' as const, name: 'Ilyas', language: 'Arabic', notes: "إِلْيَاس — a prophet mentioned in Surahs 6:85 and 37:123–130; sent to a people who worshipped Baal; declared righteous" },
      ],
    },
    {
      canonicalName: 'Jonah',
      slug: 'jonah',
      description:
        `Jonah (Yunus) is the prophet swallowed by a great fish after fleeing his divine commission to preach to Nineveh. After three days inside the fish he is released, preaches repentance, and the entire city of Nineveh repents. In Christianity, the "sign of Jonah" prefigures Christ's resurrection. In Islam, Yunus is a prophet who left his people prematurely. Surah 10 is named Yunus.`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'Yonah', language: 'Hebrew', notes: "יוֹנָה — \"dove\"; Book of Jonah read on Yom Kippur afternoon as a lesson on repentance and divine mercy extending beyond Israel" },
        { tradition: 'CHRISTIAN' as const, name: 'Jonah', language: 'Greek', notes: "Ἰωνᾶς — the \"sign of Jonah\" (3 days → resurrection, Matt 12:40); Nineveh's repentance contrasts with Israel's hardness of heart (Matt 12:41)" },
        { tradition: 'ISLAMIC' as const, name: 'Yunus', language: 'Arabic', notes: "يُونُس — Dhul-Nun (\"he of the whale/fish\"); Surah 10 named after him; his tasbih prayer (21:87–88) is renowned for its power; left mission without permission" },
      ],
    },
    {
      canonicalName: 'Isaiah',
      slug: 'isaiah',
      description:
        `Isaiah is the major Hebrew prophet whose book contains the most debated passages across traditions — particularly Isaiah 53 (the "Suffering Servant") and Isaiah 7:14 (the "Almah/Virgin" prophecy). In Judaism he is a prophet of Israel's redemption. In Christianity, Isaiah 53 is read as a direct prophecy of Jesus's crucifixion. Lineage: Isaiah son of Amoz, from a priestly/royal family in Jerusalem (c. 740–700 BCE).`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'Yeshayahu', language: 'Hebrew', notes: "יְשַׁעְיָהוּ — \"YHWH is salvation\"; Isaiah 53 interpreted as referring to the nation of Israel's suffering in exile; Isaiah 7:14 \"almah\" means young woman, not necessarily virgin" },
        { tradition: 'CHRISTIAN' as const, name: 'Isaiah', language: 'Greek', notes: "Ἠσαΐας — most-quoted OT prophet in NT; Isaiah 53 read as prophecy of Christ's passion; Isaiah 7:14 \"parthenos\" (virgin) applied to Mary's conception" },
        { tradition: 'ISLAMIC' as const, name: "Isha'ya", language: 'Arabic', notes: "إِشَعْيَاء — not named in the Quran but mentioned in Islamic tradition (hadith/tafsir); some scholars identify him as one of the unnamed prophets" },
      ],
    },
    {
      canonicalName: 'Ezra',
      slug: 'ezra',
      description:
        `Ezra is the scribe and priest credited with leading the return of Jews from Babylonian exile and restoring/canonizing the Torah. In Judaism he is second only to Moses in establishing the written Torah. In Islam, Uzayr is controversially mentioned in Surah 9:30 as being called "son of God" by the Jews — a claim that generated significant interfaith debate. In Christianity, Ezra-Nehemiah records the post-exilic restoration.`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'Ezra', language: 'Hebrew', notes: "עֶזְרָא — \"help\"; the great scribe (Sofer); credited with establishing the Great Assembly and public Torah reading; canonized the Hebrew Bible" },
        { tradition: 'CHRISTIAN' as const, name: 'Ezra', language: 'Greek', notes: "Ἔσδρας — books of Ezra-Nehemiah in OT record the return from exile and Temple restoration; 4 Esdras is an important apocalyptic text" },
        { tradition: 'ISLAMIC' as const, name: 'Uzayr', language: 'Arabic', notes: "عُزَيْر — Quran 9:30 claims \"the Jews call Uzayr the son of God\"; scholars debate whether this refers to Ezra and whether it was a common Jewish belief or a minority view; highly controversial" },
      ],
    },
    // ── Gospel ───────────────────────────────────────────────────────────────
    {
      canonicalName: 'John the Baptist',
      slug: 'john-the-baptist',
      description:
        `John the Baptist is the forerunner of Jesus who preaches repentance and baptizes in the Jordan River. In Christianity he is the fulfillment of the Elijah prophecy (Malachi 4:5; Luke 1:17). In Islam, Yahya (son of Zakariya) is a prophet whose miraculous birth to elderly parents is mentioned in the Quran alongside the birth of Jesus. Lineage: Zachariah the priest + Elizabeth (cousin of Mary) → John.`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'Yochanan', language: 'Hebrew', notes: "יוֹחָנָן — \"God is gracious\"; historically attested by Josephus; seen by some Jews as a legitimate prophet figure but not connected to messianic fulfillment" },
        { tradition: 'CHRISTIAN' as const, name: 'John the Baptist', language: 'Greek', notes: "Ἰωάννης ὁ βαπτιστής — greatest of the prophets (Matt 11:11); baptizes Jesus; imprisoned and beheaded by Herod Antipas; his disciples became the early church" },
        { tradition: 'ISLAMIC' as const, name: 'Yahya', language: 'Arabic', notes: "يَحْيَى — a prophet; his birth announced to Zakariya (3:39); confirmed the Word of God (Isa/Jesus, 3:39); Surah 19:12–15 praises him; martyred; did not commit sins" },
      ],
    },
    {
      canonicalName: 'Jesus',
      slug: 'jesus',
      description:
        `Jesus of Nazareth is the central figure of Christianity, understood as the incarnate Son of God and Messiah. In Judaism he is a historical figure outside the main tradition. In Islam, he is the prophet Isa, born of a virgin, given the Injil (Gospel), performed miracles, and was raised to heaven (not crucified). He will return at the end of days. Lineage: Davidic line through Mary; Matthew and Luke provide genealogies tracing his ancestry to Abraham (and ultimately Adam).`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'Yeshua', language: 'Hebrew', notes: "יֵשׁוּעַ — a common name in 1st-century Judea; in Talmudic literature referred to obliquely; not recognized as Messiah; Maimonides classified him as a false messiah who changed the Torah" },
        { tradition: 'CHRISTIAN' as const, name: 'Jesus Christ', language: 'Greek', notes: "Ἰησοῦς Χριστός — \"Christ\" (Christos) is the Greek equivalent of \"Messiah\" (anointed); fully divine and fully human (Council of Chalcedon, 451 CE); crucified, resurrected, ascended" },
        { tradition: 'ISLAMIC' as const, name: 'Isa ibn Maryam', language: 'Arabic', notes: "عِيسَى ابن مَرْيَم — born of virgin Maryam; given the Injil; performed miracles (healed lepers, raised dead, spoke as infant); raised to heaven alive; NOT crucified (4:157); will return before Judgment Day" },
      ],
    },
    {
      canonicalName: 'Mary',
      slug: 'mary',
      description:
        `Mary, mother of Jesus, holds a unique position across traditions. In Christianity she is the Virgin Mother of God (Theotokos). In Islam, Maryam is the only woman mentioned by name in the Quran and has an entire chapter dedicated to her. In Judaism she is a historical figure of minimal religious significance. Lineage: Priestly line (Joachim + Anne in tradition); Elizabeth (mother of John the Baptist) was her cousin.`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'Miriam', language: 'Hebrew', notes: "מִרְיָם — the Hebrew name; Talmud (Sanhedrin 106a) references \"Miriam the hair-dresser,\" a negative characterization; distinct from Moses's sister Miriam" },
        { tradition: 'CHRISTIAN' as const, name: 'Mary', language: 'Greek', notes: "Μαρία — venerated as Theotokos (God-bearer) since Council of Ephesus (431 CE); Catholic doctrine of Immaculate Conception (1854) and bodily Assumption; perpetual virginity debated" },
        { tradition: 'ISLAMIC' as const, name: 'Maryam', language: 'Arabic', notes: "مَرْيَم — Surah 19 (Maryam) named after her; described as the most righteous woman (3:42); gave birth under a palm tree; only woman named in Quran; declared pure and chaste" },
      ],
    },
    // ── Islamic Genealogy ────────────────────────────────────────────────────
    {
      canonicalName: 'Kedar',
      slug: 'kedar',
      description:
        `Kedar is the second son of Ishmael mentioned in Genesis 25:13. In the Islamic tradition, Kedar is the ancestor of Arab peoples, and his lineage through Adnan leads to Muhammad. The genealogical connection is documented in Islamic historical sources (Sirah) tracing the Quraysh tribe to Kedar through multiple generations. Lineage: Ishmael → Kedar → Adnan → [24+ generations] → Quraysh → Hashim → Abdullah → Muhammad.`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'Kedar', language: 'Hebrew', notes: "קֵדָר — listed as second son of Ishmael (Genesis 25:13); ancestor of Kedarite Arabs; known for archers and merchants (Jeremiah 49:28–33)" },
        { tradition: 'ISLAMIC' as const, name: 'Qaydar', language: 'Arabic', notes: "قَيْدَار — ancestor of Arabian tribes; his lineage through Adnan leads to the Quraysh and Muhammad (Sirah tradition)" },
      ],
    },
    {
      canonicalName: 'Adnan',
      slug: 'adnan',
      description:
        `Adnan is a crucial figure in Islamic genealogy as the ancestor of the Quraysh tribe and, through them, of Muhammad. Islamic sources identify Adnan as a descendant of Kedar through multiple generations. The lineage from Kedar to Adnan represents a long chain of Arabian patriarchs documented in Sirah al-Ibn Hisham. Lineage: Ishmael → [through Kedar and others] → Adnan → Umayyah → [continues] → Muhammad.`,
      aliases: [
        { tradition: 'ISLAMIC' as const, name: 'Adnan', language: 'Arabic', notes: "عَدْنَان — Qur'anic context: ancestor of Muhammad; the lineage from Kedar to Adnan spans many generations in Islamic tradition; identified as a unifying ancestor of Arabian tribes" },
      ],
    },
    {
      canonicalName: 'Umayyah',
      slug: 'umayyah',
      description:
        `Umayyah is the son of Adnan in the Islamic genealogical chain. He continues the lineage toward the Quraysh tribe and Muhammad. Lineage: Adnan → Umayyah → Murrah → [continues] → Muhammad.`,
      aliases: [
        { tradition: 'ISLAMIC' as const, name: 'Umayyah', language: 'Arabic', notes: "أُمَيَّة — son of Adnan (Sirah al-Ibn Hisham); continuation of the prophetic lineage; ancestor of the Quraysh through his descendants" },
      ],
    },
    {
      canonicalName: 'Murrah',
      slug: 'murrah',
      description:
        `Murrah is the son of Umayyah in the Islamic genealogical tradition. Lineage: Umayyah → Murrah → Kaab → [continues] → Muhammad.`,
      aliases: [
        { tradition: 'ISLAMIC' as const, name: 'Murrah', language: 'Arabic', notes: "مُرَّة — son of Umayyah (Sirah al-Ibn Hisham); ancestor of the Quraysh tribe" },
      ],
    },
    {
      canonicalName: 'Kaab',
      slug: 'kaab',
      description:
        `Kaab is the son of Murrah in the Islamic genealogical tradition. Lineage: Murrah → Kaab → Luayy → [continues] → Muhammad.`,
      aliases: [
        { tradition: 'ISLAMIC' as const, name: 'Kaab', language: 'Arabic', notes: "كَعْب — son of Murrah (Sirah al-Ibn Hisham); ancestor of the Quraysh" },
      ],
    },
    {
      canonicalName: 'Luayy',
      slug: 'luayy',
      description:
        `Luayy is the son of Kaab in the Islamic genealogical tradition. Lineage: Kaab → Luayy → Ghalib → [continues] → Muhammad.`,
      aliases: [
        { tradition: 'ISLAMIC' as const, name: 'Luayy', language: 'Arabic', notes: "لُوَيّ — son of Kaab (Sirah al-Ibn Hisham); ancestor of the Quraysh" },
      ],
    },
    {
      canonicalName: 'Ghalib',
      slug: 'ghalib',
      description:
        `Ghalib is the son of Luayy in the Islamic genealogical tradition. Lineage: Luayy → Ghalib → Fihr → [continues] → Muhammad.`,
      aliases: [
        { tradition: 'ISLAMIC' as const, name: 'Ghalib', language: 'Arabic', notes: "غَالِب — son of Luayy (Sirah al-Ibn Hisham); ancestor of the Quraysh" },
      ],
    },
    {
      canonicalName: 'Fihr',
      slug: 'fihr',
      description:
        `Fihr is the son of Ghalib and a significant figure in Islamic genealogy as the founder of the Quraysh tribe. The tribe is known as "Quraysh" (also spelled Quraish) and is the tribe into which Muhammad was born. Lineage: Ghalib → Fihr (founder of Quraysh) → Malik → [continues] → Muhammad.`,
      aliases: [
        { tradition: 'ISLAMIC' as const, name: 'Fihr', language: 'Arabic', notes: "فِهْر — son of Ghalib (Sirah al-Ibn Hisham); founder of the Quraysh tribe; father of Malik; the tribe is named after him (also called Banu Fihr)" },
      ],
    },
    {
      canonicalName: 'Malik',
      slug: 'malik',
      description:
        `Malik is the son of Fihr (founder of Quraysh) in the Islamic genealogical tradition. Lineage: Fihr → Malik → Nadhr → [continues] → Muhammad.`,
      aliases: [
        { tradition: 'ISLAMIC' as const, name: 'Malik', language: 'Arabic', notes: "مَالِك — son of Fihr (Sirah al-Ibn Hisham); member of the Quraysh tribe" },
      ],
    },
    {
      canonicalName: 'Nadhr',
      slug: 'nadhr',
      description:
        `Nadhr is the son of Malik in the Islamic genealogical tradition. Lineage: Malik → Nadhr → Kinana → [continues] → Muhammad.`,
      aliases: [
        { tradition: 'ISLAMIC' as const, name: 'Nadhr', language: 'Arabic', notes: "نَضْر — son of Malik (Sirah al-Ibn Hisham); ancestor of the Quraysh" },
      ],
    },
    {
      canonicalName: 'Kinana',
      slug: 'kinana',
      description:
        `Kinana is the son of Nadhr in the Islamic genealogical tradition. Lineage: Nadhr → Kinana → Khuzaymah → [continues] → Muhammad.`,
      aliases: [
        { tradition: 'ISLAMIC' as const, name: 'Kinana', language: 'Arabic', notes: "كِنَانَة — son of Nadhr (Sirah al-Ibn Hisham); ancestor of the Quraysh" },
      ],
    },
    {
      canonicalName: 'Khuzaymah',
      slug: 'khuzaymah',
      description:
        `Khuzaymah is the son of Kinana in the Islamic genealogical tradition. Lineage: Kinana → Khuzaymah → Mudrika → [continues] → Muhammad.`,
      aliases: [
        { tradition: 'ISLAMIC' as const, name: 'Khuzaymah', language: 'Arabic', notes: "خُزَيْمَة — son of Kinana (Sirah al-Ibn Hisham); ancestor of the Quraysh" },
      ],
    },
    {
      canonicalName: 'Mudrika',
      slug: 'mudrika',
      description:
        `Mudrika is the son of Khuzaymah in the Islamic genealogical tradition. Lineage: Khuzaymah → Mudrika → Ilyas → [continues] → Muhammad.`,
      aliases: [
        { tradition: 'ISLAMIC' as const, name: 'Mudrika', language: 'Arabic', notes: "مُدْرِكَة — son of Khuzaymah (Sirah al-Ibn Hisham); ancestor of the Quraysh" },
      ],
    },
    {
      canonicalName: 'Ilyas',
      slug: 'ilyas',
      description:
        `Ilyas is the son of Mudrika in the Islamic genealogical tradition. Lineage: Mudrika → Ilyas → Mudar → [continues] → Muhammad.`,
      aliases: [
        { tradition: 'ISLAMIC' as const, name: 'Ilyas', language: 'Arabic', notes: "إِلْيَاس — son of Mudrika (Sirah al-Ibn Hisham); ancestor of the Quraysh" },
      ],
    },
    {
      canonicalName: 'Mudar',
      slug: 'mudar',
      description:
        `Mudar is the son of Ilyas in the Islamic genealogical tradition. Lineage: Ilyas → Mudar → Nizar → [continues] → Muhammad.`,
      aliases: [
        { tradition: 'ISLAMIC' as const, name: 'Mudar', language: 'Arabic', notes: "مُضَر — son of Ilyas (Sirah al-Ibn Hisham); ancestor of northern Arabian tribes including the Quraysh" },
      ],
    },
    {
      canonicalName: 'Nizar',
      slug: 'nizar',
      description:
        `Nizar is the son of Mudar in the Islamic genealogical tradition. Lineage: Mudar → Nizar → Maad → [continues] → Muhammad.`,
      aliases: [
        { tradition: 'ISLAMIC' as const, name: 'Nizar', language: 'Arabic', notes: "نِزَار — son of Mudar (Sirah al-Ibn Hisham); ancestor of the Quraysh" },
      ],
    },
    {
      canonicalName: 'Maad',
      slug: 'maad',
      description:
        `Maad is the son of Nizar in the Islamic genealogical tradition. Lineage: Nizar → Maad → Qais → [continues] → Muhammad.`,
      aliases: [
        { tradition: 'ISLAMIC' as const, name: 'Maad', language: 'Arabic', notes: "مَعَد — son of Nizar (Sirah al-Ibn Hisham); ancestor of the Quraysh" },
      ],
    },
    {
      canonicalName: 'Qais',
      slug: 'qais',
      description:
        `Qais is the son of Maad in the Islamic genealogical tradition. Lineage: Maad → Qais → Qahtan → [continues] → Muhammad.`,
      aliases: [
        { tradition: 'ISLAMIC' as const, name: 'Qais', language: 'Arabic', notes: "قَيْس — son of Maad (Sirah al-Ibn Hisham); ancestor of the Quraysh" },
      ],
    },
    {
      canonicalName: 'Qahtan',
      slug: 'qahtan',
      description:
        `Qahtan is the son of Qais in the Islamic genealogical tradition. Lineage: Qais → Qahtan → Hashim → [continues] → Muhammad.`,
      aliases: [
        { tradition: 'ISLAMIC' as const, name: 'Qahtan', language: 'Arabic', notes: "قَحْطَان — son of Qais (Sirah al-Ibn Hisham); ancestor of the Quraysh" },
      ],
    },
    {
      canonicalName: 'Hashim',
      slug: 'hashim',
      description:
        `Hashim (Abd al-Manaf's father) is the great-grandfather of Muhammad and founder of the Hashim clan (Banu Hashim). He held the honored position of providing water and food to Hajj pilgrims. His wealth and status gave Muhammad his position within Mecca society. Lineage: Qahtan → Hashim → Abdul-Muttalib → Abdullah → Muhammad.`,
      aliases: [
        { tradition: 'ISLAMIC' as const, name: 'Hashim', language: 'Arabic', notes: "هَاشِم — son of Abd al-Manaf (Sirah al-Ibn Hisham); founder of the Hashim clan (Banu Hashim); provided water (siqayah) and food to Hajj pilgrims; great-grandfather of Muhammad; his son was Abdul-Muttalib" },
      ],
    },
    {
      canonicalName: 'Abdul-Muttalib',
      slug: 'abdul-muttalib',
      description:
        `Abdul-Muttalib is the grandfather of Muhammad. He was the chief of the Quraysh and held the guardianship of the Ka'ba. He took an oath to sacrifice one of his sons if he had ten; when his youngest son Abdullah was selected by lots, he ransomed him for 100 camels. This son Abdullah became Muhammad's father. Lineage: Hashim → Abdul-Muttalib → Abdullah → Muhammad.`,
      aliases: [
        { tradition: 'ISLAMIC' as const, name: 'Abdul-Muttalib', language: 'Arabic', notes: "عَبْد المُطَّلِب — birth name: Shaybah; son of Hashim; grandfather of Muhammad; made a vow to sacrifice a son (the ransom was 100 camels for Abdullah); guardian of the Ka'ba; leader of the Quraysh" },
      ],
    },
    {
      canonicalName: 'Abdullah',
      slug: 'abdullah',
      description:
        `Abdullah is the father of Muhammad. He was the son of Abdul-Muttalib, born as a result of the ransom of 100 camels. He died before Muhammad was born, making Muhammad an orphan. Abdullah is occasionally referenced in Islamic tradition and the Quran as Muhammad's father. Lineage: Abdul-Muttalib → Abdullah → Muhammad.`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'Abdullah', language: 'Hebrew/Arabic', notes: "עבדאללה / عَبْد اللَّهِ — not recognized in Jewish tradition; mentioned as Muhammad's father in Islamic sources" },
        { tradition: 'ISLAMIC' as const, name: 'Abdullah ibn Abdul-Muttalib', language: 'Arabic', notes: "عَبْد اللَّهِ بن عبد المُطَّلِب — father of Muhammad; son of Abdul-Muttalib; died before Muhammad's birth; one of the 'Chosen Ones' (Qur'an 3:144 refers to Muhammad but in context of lineage); ransomed for 100 camels per his father's vow" },
      ],
    },
    // ── Early Islam ──────────────────────────────────────────────────────────
    {
      canonicalName: 'Muhammad',
      slug: 'muhammad',
      description:
        `Muhammad ibn Abdullah (c. 570–632 CE) is the final prophet and messenger of God (Khatam an-Nabiyyin) in Islam. Born in Mecca into the Quraysh tribe (descended from Ishmael through Adnan), he received the Quran through the angel Jibril over 23 years. Judaism and Christianity do not recognize him as a prophet. Lineage: Abraham → Ishmael → Kedar → ... → Adnan → ... → Quraysh → Hashim → Abdullah → Muhammad.`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'Mohammed', language: 'Hebrew/Arabic', notes: "מֻחַמַּד — not recognized as a prophet in Jewish tradition; Maimonides classified his prophecy as false" },
        { tradition: 'CHRISTIAN' as const, name: 'Muhammad', language: 'Arabic', notes: "مُحَمَّد — not recognized as a prophet in mainstream Christianity; some modern theologians explore his role as a \"prophet for the Arabs\"" },
        { tradition: 'ISLAMIC' as const, name: 'Muhammad', language: 'Arabic', notes: "مُحَمَّد — \"the praised one\"; Seal of the Prophets (33:40); given the universal, final message; Night Journey to Jerusalem and Heavens (Isra' wal-Mi'raj); interceder on Judgment Day" },
      ],
    },
    // ── Spiritual Beings ─────────────────────────────────────────────────────
    {
      canonicalName: 'Gabriel',
      slug: 'gabriel',
      description:
        `Gabriel is an angel who appears as a divine messenger in all three traditions. In the Hebrew Bible he interprets visions for Daniel. In the New Testament he announces the births of John the Baptist and Jesus. In Islam, Jibril is the angel of revelation who transmitted the Quran to Muhammad.`,
      aliases: [
        { tradition: 'JEWISH' as const, name: "Gavri'el", language: 'Hebrew', notes: "גַּבְרִיאֵל — 'God is my strength'; appears in Daniel 8 and 9; one of seven archangels in Jewish tradition" },
        { tradition: 'CHRISTIAN' as const, name: 'Gabriel', language: 'Greek', notes: 'Γαβριήλ — announces the births of John (Luke 1:19) and Jesus (Luke 1:26–38); one of three named archangels in the Bible' },
        { tradition: 'ISLAMIC' as const, name: 'Jibril', language: 'Arabic', notes: "جِبْرِيل — the greatest angel; the Ruh al-Qudus (Holy Spirit/Spirit of Holiness); transmitted the Quran; first revelation in the Cave of Hira in 610 CE" },
      ],
    },
    {
      canonicalName: 'Satan',
      slug: 'satan',
      description:
        `Satan (Hebrew: Ha-Satan, "the adversary") appears in different roles across traditions. In Hebrew Bible he is a "prosecuting attorney" in the divine court (Job 1–2). In Christianity he is a fallen angel, the Devil, and ruler of this age whose power is defeated by Christ. In Islam, Iblis is a jinn who refused to bow to Adam and became the eternal adversary of humanity, granted a reprieve until Judgment Day.`,
      aliases: [
        { tradition: 'JEWISH' as const, name: 'Ha-Satan', language: 'Hebrew', notes: "הַשָּׂטָן — \"the adversary/accuser\"; a role, not a name; in Job serves as God's celestial prosecutor; in later Judaism becomes more associated with an evil tempter; Samael in some traditions" },
        { tradition: 'CHRISTIAN' as const, name: 'Satan / the Devil', language: 'Greek', notes: "Σατανᾶς / Διάβολος — \"the accuser\"; a fallen angel (Luke 10:18; Isaiah 14:12–15); prince of this world (John 12:31); tempter in the wilderness (Matt 4); conquered by Christ's resurrection" },
        { tradition: 'ISLAMIC' as const, name: 'Iblis / Shaytan', language: 'Arabic', notes: "إِبْلِيس / شَيْطَان — a jinn (not angel) who refused to prostrate before Adam (2:34); given a reprieve until Judgment Day to mislead humanity (7:14–18); Shaytan is the general term for evil tempters" },
      ],
    },
  ]

  for (const { aliases, ...figure } of figures) {
    const created = await prisma.figure.upsert({
      where: { slug: figure.slug },
      update: {},
      create: figure,
    })

    for (const alias of aliases) {
      await prisma.figureAlias.upsert({
        where: {
          figureId_tradition_name: {
            figureId: created.id,
            tradition: alias.tradition,
            name: alias.name,
          },
        },
        update: {},
        create: { ...alias, figureId: created.id },
      })
    }
  }

  console.log('✓ Figures seeded')
}
