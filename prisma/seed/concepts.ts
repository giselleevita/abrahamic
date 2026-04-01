import type { PrismaClient } from '@prisma/client'

export async function seedConcepts(prisma: PrismaClient) {
  const concepts = [
    // ── Theology ─────────────────────────────────────────────────────────────
    {
      slug: 'monotheism',
      name: 'Monotheism',
      category: 'THEOLOGY' as const,
      summary:
        'Belief in one God is the foundational principle of all three Abrahamic religions. While all three insist on absolute monotheism, their understanding of what "one God" means differs — especially on questions of the Trinity and divine unity.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'Absolute, indivisible unity of God (Echad). The Shema (Deut 6:4) — "Hear O Israel, the LORD our God, the LORD is one" — is the cardinal creed. God has no body, no partners, no son, no intermediaries. The thirteen principles of Maimonides begin with God\'s existence and unity.',
          nuances: 'Kabbalistic tradition speaks of ten sefirot (divine emanations) but insists these are not separate beings. Defining idolatry (avodah zarah) is a major legal category; Christianity\'s Trinity is considered by many halakhic authorities to violate pure monotheism.',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'One God in three persons (Father, Son, Holy Spirit) — the Trinity. Formulated at the Council of Nicaea (325 CE) and Council of Constantinople (381 CE). God is numerically one in essence (ousia) but three in persons (hypostases). Jesus Christ is fully divine and fully human (Chalcedon, 451 CE).',
          nuances: 'The Trinity is the most contested doctrine in Abrahamic dialogue. Critics from Judaism and Islam argue it constitutes tritheism. The Filioque controversy (does the Holy Spirit proceed from the Father alone, or from Father and Son?) split Eastern and Western Christianity in 1054.',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'Absolute tawhid (توحيد) — divine unity is the central pillar of Islam. God (Allah) is one, eternal, uncreated, and absolutely unique (Surah 112: Al-Ikhlas). Shirk (associating partners with God) is the one unforgivable sin (4:48). The Trinity is explicitly rejected (5:73).',
          nuances: 'Islam distinguishes tawhid al-rububiyya (oneness in lordship), tawhid al-uluhiyya (oneness in worship), and tawhid al-asma wa\'l-sifat (oneness in names/attributes). The 99 beautiful names of Allah describe His attributes without compromising His unity.',
        },
      ],
    },
    {
      slug: 'trinity',
      name: 'Trinity',
      category: 'THEOLOGY' as const,
      summary:
        'The Christian doctrine that God is one being in three persons — Father, Son, and Holy Spirit — is the most controversial theological claim across the Abrahamic traditions. Judaism considers it a deviation from monotheism; Islam explicitly rejects it as shirk (polytheism).',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'Judaism rejects the Trinity as a violation of pure monotheism. God is absolutely one and indivisible. The concept of God taking human form (incarnation) is considered impossible. Christian doctrine is seen as mixing paganism with monotheism.',
          nuances: 'Many halakhic authorities (e.g., Maimonides, Rambam) ruled that Christianity is idolatry (avodah zarah) because of the Trinity and image veneration. Some modern authorities (e.g., Meiri, some Contemporary Orthodox) have softened this. The Talmud contains discussions on divine unity relevant to this debate.',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'The Trinity is the central mystery of the Christian faith: one God in three co-equal, co-eternal persons. The Father is not the Son, the Son is not the Spirit, the Spirit is not the Father — yet all are fully God. Defined at Nicaea (325) and Constantinople (381) against Arian heresy (which made Jesus subordinate to the Father).',
          nuances: 'Different Christian traditions emphasize different aspects: Western (Latin) theology stresses the unity of essence; Eastern (Orthodox) theology stresses the three hypostases in communion. Unitarians and Jehovah\'s Witnesses reject the Trinity within Christian movements.',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'The Trinity is explicitly rejected in the Qur\'an. Surah 5:73 states: "They have certainly disbelieved who say Allah is the third of three." Surah 112 (Al-Ikhlas) was revealed in direct refutation of the Trinity concept. God does not beget and is not begotten.',
          nuances: 'Some scholars note that the Qur\'anic critique may target a specific version of the Trinity where Mary was included as the third member (5:116), perhaps reflecting folk Christianity in Arabia. Classical Islamic theology (kalam) developed detailed refutations of the Trinity through logical arguments.',
        },
      ],
    },
    {
      slug: 'original-sin',
      name: 'Original Sin',
      category: 'THEOLOGY' as const,
      summary:
        'The doctrine that Adam\'s sin in the Garden of Eden introduced a hereditary spiritual corruption into all humanity. This is a distinctly Christian doctrine; Judaism and Islam reject inherited guilt though acknowledging human moral frailty.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'Judaism does not have a doctrine of original sin in the Christian sense. Adam\'s sin in the Garden is understood as the first human failure but does not transmit guilt to his descendants. Each person is responsible for their own sins (Ezekiel 18:20). The concept of the yetzer hara (evil inclination) acknowledges human moral frailty without inherited guilt.',
          nuances: 'Some Kabbalistic sources speak of Adam\'s sin causing a cosmic fracture (shevirat hakelim). The Talmud describes humans as having both a good and evil inclination. The focus is on free moral choice, not inherited nature.',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'Original sin (Latin: peccatum originale) is the fallen state of human nature resulting from Adam and Eve\'s disobedience. Formulated by Augustine of Hippo (c. 400 CE), it holds that all humans are born with a corruption of nature and guilt, inherited from Adam. This necessitates the atoning death of Jesus Christ. Baptism removes the guilt of original sin.',
          nuances: 'Eastern Orthodox theology uses "ancestral sin" — emphasizing inherited mortality and tendency toward sin rather than inherited guilt. Pelagius (condemned as heretic) argued humans could choose good without divine grace. The Protestant Reformers emphasized total depravity.',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'Islam explicitly rejects original sin. Each soul is born in a state of fitrah (pure, natural disposition toward God). Adam and Hawwa were forgiven after their sin in the Garden (2:37). No human inherits guilt for another\'s actions: "No bearer of burdens shall bear the burden of another" (6:164).',
          nuances: 'Islam acknowledges that humans are weak and prone to forgetting (ghafala) their covenant with God, but this is not a fallen nature. The Qur\'an describes humans as having been created in the best form (ahsan taqwim, 95:4).',
        },
      ],
    },
    {
      slug: 'prophethood',
      name: 'Prophethood',
      category: 'PROPHETHOOD' as const,
      summary:
        'The nature, function, and authority of prophets differs significantly across traditions. How many prophets there are, whether prophecy has ended, and who qualifies as a prophet are all contested questions.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'Prophecy (nevuah) in Judaism ceased after Malachi, Haggai, and Zechariah (c. 450 BCE). The Talmud (Yoma 9b) states the Holy Spirit departed from Israel after this. Moses is the supreme prophet who spoke to God "face to face" (Deut 34:10). The canon is closed.',
          nuances: 'Maimonides lists 12 degrees of prophecy with Moses uniquely highest. After the biblical canon, prophecy is replaced by Torah study. Claims of new prophecy are viewed with suspicion as potentially undermining the fixed Torah.',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'Christianity accepts the Hebrew prophets as genuine and pointing toward Jesus. After Christ, the Spirit continues to give gifts of prophecy to the Church (1 Cor 14). No new scripture is produced — revelation is complete in Jesus. The New Testament fulfills and supersedes the Old (Hebrews 1:1–2).',
          nuances: 'Pentecostal and charismatic traditions emphasize ongoing prophetic gifts. The canon prevents new authoritative revelation. Muhammad is not accepted as a prophet because his claims post-date Christ. Some theologians distinguish canonical prophecy (ended) from ongoing charismatic prophetic utterance.',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'Islam teaches that God sent 124,000 prophets throughout history. The five Ulul Azm (prophets of strong will) are Noah, Abraham, Moses, Jesus, and Muhammad. Muhammad is Khatam an-Nabiyyin (Seal/Final Prophet, 33:40) — after him, no new prophet will come.',
          nuances: 'All Quranic prophets are Muslim in the sense that they submitted to God. Islam insists all prophets preached the same message of tawhid. The Ahmadiyya movement (which accepts a later prophet) is considered heretical by mainstream Islam.',
        },
      ],
    },
    {
      slug: 'afterlife',
      name: 'Afterlife',
      category: 'ESCHATOLOGY' as const,
      summary:
        'What happens after death — resurrection, heaven, hell, and judgment — is a major topic in all three traditions, though with significant differences in emphasis and detail.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'Traditional Judaism affirms bodily resurrection (techiyat ha-meitim) at the end of days and the World to Come (Olam Ha-Ba). Maimonides lists resurrection as the 13th principle of faith. The intermediate state (Sheol/Gehinnom) is a temporary purification for most. Gan Eden (Paradise) is the reward for the righteous.',
          nuances: 'The Torah says relatively little about the afterlife. Post-biblical Judaism developed richer afterlife concepts. Reform Judaism historically de-emphasized resurrection. Conservative and Orthodox affirm resurrection.',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'Christianity teaches bodily resurrection at the Last Judgment. The righteous receive eternal life in Heaven; the unrighteous receive eternal punishment in Hell. Jesus\'s resurrection is the "first fruits" (1 Cor 15:20) guaranteeing believers\' future resurrection. Catholic doctrine also includes Purgatory.',
          nuances: 'The nature of hell is debated: eternal conscious torment (traditional), annihilationism (the wicked are destroyed), or universal reconciliation (all ultimately saved — rejected as heresy by most). The resurrection body is transformed and spiritual (1 Cor 15:44).',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'Islam gives the most detailed afterlife account. After death, the soul enters the Barzakh (intermediate state). On Judgment Day, all are resurrected, deeds weighed on the Mizan, must cross the Sirat (bridge over Hell). The righteous enter Jannah (Paradise); the wicked enter Jahannam (Hell).',
          nuances: 'The Qur\'an describes hell as eternal for unbelievers (2:81) but some scholars suggest it may end even for the wicked (God\'s mercy). Intercession (shafa\'a) of Muhammad for believers on Judgment Day is a key Islamic belief.',
        },
      ],
    },
    // ── Practice ─────────────────────────────────────────────────────────────
    {
      slug: 'ten-commandments',
      name: 'Ten Commandments',
      category: 'LAW' as const,
      summary:
        'The Decalogue — ten foundational commandments given to Moses at Sinai — is shared scripture across all three traditions but interpreted and numbered differently.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'The Aseret HaDibrot (Ten Statements/Commandments) are given twice in the Torah (Exodus 20, Deuteronomy 5). In Jewish tradition, "I am the LORD your God" is the first commandment, and the prohibition of other gods and idols is split as the second. The Decalogue is foundational but is only part of the 613 mitzvot.',
          nuances: 'Jews do not typically display the Ten Commandments in synagogues (to avoid implying they are more important than other Torah laws). They are chanted as a special reading on Shavuot.',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'Christians affirm the Ten Commandments as morally binding. Catholics and Lutherans combine "no other gods" and "no idols" as the first commandment and split the final commandment on coveting into two. The commandments are considered moral law and remain binding in the New Covenant.',
          nuances: 'The Sabbath commandment is the most debated: most Christians moved worship to Sunday. Seventh-day Adventists insist Saturday Sabbath is still required. Jesus said he came not to abolish but to fulfill the Law (Matt 5:17).',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'Islam does not use the term "Ten Commandments" but affirms the core moral principles they contain. The Quran refers to the Tawrat (Torah) as divinely revealed and repeatedly commands similar ethics. Surah 6:151–153 contains a similar set of commandments.',
          nuances: 'The Quran emphasizes that the Torah given to Moses was original divine revelation but has been corrupted (tahrif) over time. The specific Mosaic commandments are not listed as such in the Quran but the moral content is affirmed.',
        },
      ],
    },
    {
      slug: 'fasting',
      name: 'Fasting',
      category: 'PRACTICE' as const,
      summary:
        'Ritual abstention from food and drink as a spiritual discipline appears in all three traditions, though the specific practice, timing, and theology differ significantly.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'The Torah mandates one annual fast — Yom Kippur (Day of Atonement, Leviticus 16:29). Post-biblical Judaism established five additional major fasts: Tisha B\'Av, 17 Tammuz, Fast of Gedaliah, Fast of Esther, and 10 Tevet. Fasting is a tool of repentance and communal mourning.',
          nuances: 'Jewish fasting means complete abstention from food AND water. Yom Kippur also prohibits washing, cosmetics, leather shoes, and marital relations. Children, pregnant women, and the sick are exempt.',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'Jesus assumed his disciples would fast (Matt 6:16–17) but gave no specific schedule. Catholic and Orthodox traditions observe extensive fasting: Lent (40 days before Easter), Advent, ember days. Protestant traditions vary widely from no fasting to personal fasting.',
          nuances: 'Christian fasting is usually partial (abstaining from certain foods) rather than complete. Orthodox fasting can be very strict — no meat, dairy, oil, or wine on fast days. Fasting is linked to intensified prayer and almsgiving (Matt 6:1–18).',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'The entire month of Ramadan (9th month of the Islamic lunar calendar) is a mandatory fast (Sawm) — one of the Five Pillars of Islam. Muslims abstain from food, drink, smoking, and sexual relations from dawn (Fajr) to sunset (Maghrib).',
          nuances: 'Ramadan fast is broken each evening with iftar and preceded by suhoor. The Night of Power (Laylat al-Qadr) in the last ten nights is the holiest night of the year. Additional voluntary fasts include Mondays/Thursdays and Ashura (10th of Muharram).',
        },
      ],
    },
    {
      slug: 'sabbath',
      name: 'Sabbath',
      category: 'PRACTICE' as const,
      summary:
        'The weekly day of rest commanded in scripture is observed on different days and in fundamentally different ways across traditions.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'Shabbat (Saturday, sundown to nightfall) is the most significant weekly observance in Judaism — described as a "foretaste of the World to Come." The 39 categories of prohibited work (melachot) were derived from Talmudic analysis. Shabbat is welcomed as a "queen" and "bride."',
          nuances: 'Orthodox Jews strictly observe the 39 melachot prohibitions including writing, cooking, driving, and using electricity. Conservative Judaism allows driving to synagogue; Reform Judaism treats Shabbat observance as personally optional. Shabbat is a "sign" of the covenant (Exod 31:13).',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'Most Christians moved the day of worship to Sunday (the Lord\'s Day) in commemoration of the resurrection. The early church met on the first day of the week (Acts 20:7). The Sabbath commandment is interpreted as spiritually fulfilled in Christ (Col 2:16–17).',
          nuances: 'Seventh-day Adventists insist Saturday Sabbath remains binding for Christians. The Catholic Church defended Sunday as the "new Sabbath." Sunday rest laws (Blue Laws) in Western nations reflect this heritage.',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'Islam does not designate a day of complete rest. Friday (Jumu\'ah) is the day of congregational prayer — the noon prayer is replaced by the Jumu\'ah prayer (62:9) and a sermon. Work is permitted on Fridays outside prayer time.',
          nuances: 'The Quran mentions the Sabbath was imposed specifically as a test on the Children of Israel (4:154) — not a universal commandment. The Quran refers to God completing creation without saying God "rested" — Islamic theology rejects any implication of divine tiredness.',
        },
      ],
    },
    {
      slug: 'dietary-laws',
      name: 'Dietary Laws',
      category: 'LAW' as const,
      summary:
        'All three traditions have food regulations derived from scripture, though they differ in scope, detail, and theological rationale. Jewish kashrut and Islamic halal share many elements while Christianity largely abolished food laws.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'Kashrut (dietary fitness) is derived from Torah (Lev 11; Deut 14). Permitted (kosher) animals must have split hooves AND chew cud. Forbidden: pork, shellfish, birds of prey. Meat and dairy must be completely separated. Meat requires ritual slaughter (shechita).',
          nuances: 'Different communities have varying stringencies (glatt kosher, chalav Yisrael). Reform Judaism largely treats kashrut as optional. Orthodox maintains strict separation of meat and dairy with separate dishes and waiting periods (1–6 hours).',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'Jesus declared all foods clean (Mark 7:19). Peter\'s vision (Acts 10) was interpreted as removing food restrictions for Gentile Christians. Paul states that no food is inherently unclean (Rom 14:14). Food laws are described as a "shadow" fulfilled in Christ (Col 2:16–17).',
          nuances: 'Ethiopian Orthodox Christianity maintains extensive food restrictions similar to kashrut. Some Anglican and Catholic traditions observe fasting from meat on Fridays. Vegetarianism has a minority tradition in Christianity.',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'Halal ("permitted") food laws are derived from the Quran. Forbidden (haram): pork, blood, animals not slaughtered in God\'s name, animals that died of themselves, and intoxicants (alcohol is completely forbidden).',
          nuances: 'The Quran explicitly permits food of the People of the Book (5:5). The main differences from kashrut: Islam permits combining meat and dairy; Islam prohibits alcohol while Judaism permits wine. The global halal food industry is worth over $2 trillion annually.',
        },
      ],
    },
    {
      slug: 'charity',
      name: 'Charity & Almsgiving',
      category: 'PRACTICE' as const,
      summary:
        'Giving to the poor is commanded by all three traditions, but the mechanism — obligatory tax vs. voluntary gift — and the spiritual rationale differ.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'Tzedakah (צְדָקָה, "justice/righteousness") is not optional charity but an obligation of justice. The Torah mandates leaving the corners of fields (pe\'ah) for the poor (Lev 19:9–10). There is also a tithe for the poor (ma\'aser ani). Maimonides\' eight levels of tzedakah place anonymous giving highest.',
          nuances: 'The word tzedakah derives from tzedek (justice), emphasizing the poor person\'s right to support. Maximum tzedakah is 20% of income; minimum is 10%.',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'Jesus elevated giving to the poor as a central spiritual practice (Matt 6:2–4). The principle "give in secret" emphasizes interior motive. The early church practiced radical communal sharing (Acts 2:44–45). Christian giving is motivated by gratitude for God\'s grace (2 Cor 9:7).',
          nuances: 'Catholic Social Teaching articulates a "preferential option for the poor." The "prosperity gospel" teaches that giving leads to material blessing — widely criticized as distortion. James 2:14–17 insists faith without works caring for the poor is dead.',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'Zakat (Pillar 3 of Islam) is a mandatory annual wealth tax of 2.5% on savings held for one lunar year above a minimum threshold. It is distributed to eight categories of recipients (9:60). Sadaqa (voluntary charity) is in addition to zakat.',
          nuances: 'Zakat is considered purification (tazkiyah) of wealth. Withholding zakat is a major sin (9:34–35). Sadaqa jariya (ongoing charity — a well, school, or mosque) continues to benefit the donor after death.',
        },
      ],
    },
    {
      slug: 'golden-rule',
      name: 'Golden Rule',
      category: 'THEOLOGY' as const,
      summary:
        'The principle of treating others as you wish to be treated appears in nearly identical form in all three traditions, making it one of the clearest examples of shared ethical ground.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: '"Love your neighbor as yourself" (Leviticus 19:18). Rabbi Hillel: "What is hateful to you, do not do to your neighbor. That is the whole Torah; the rest is commentary — go and learn." (Talmud, Shabbat 31a).',
          nuances: 'Hillel\'s version is negative ("do not do") while Jesus gives a positive version ("do"). The Talmud extends the principle to all humanity (deriving obligations to non-Jews from creation in God\'s image).',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'Jesus cites Leviticus 19:18 as the second greatest commandment and gives the positive version: "Do to others as you would have them do to you" (Matt 7:12, the "Golden Rule"). He expands it to include enemies: "Love your enemies" (Matt 5:44).',
          nuances: 'Jesus\'s expansion of neighbor to include enemies and strangers (Parable of the Good Samaritan, Luke 10) was revolutionary. Paul summarizes the whole law in loving the neighbor (Rom 13:9; Gal 5:14).',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'The Prophet Muhammad said: "None of you truly believes until he loves for his brother what he loves for himself." (Hadith, Bukhari and Muslim). The Quran commands: "Be good to parents, relatives, orphans, the needy, the close neighbor, the distant neighbor..." (4:36).',
          nuances: 'The hadith version uses "brother" which classical scholars interpret as meaning fellow Muslim, though others extend it to all of humanity. The concept of ihsan (excellence in action toward others) extends this principle.',
        },
      ],
    },
    // ── Messianic & Temple ───────────────────────────────────────────────────
    {
      slug: 'messiah',
      name: 'Messiah',
      category: 'PROPHETHOOD' as const,
      summary:
        'The Messiah (anointed one) is the most contested concept between the three Abrahamic traditions. Has the Messiah come? Who is he? What will he accomplish? These questions define the fault lines between Judaism, Christianity, and Islam.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'The Messiah (Mashiach, מָשִׁיחַ) is a future human king from the line of David who will: gather all Jews to the Land of Israel, rebuild the Third Temple, usher in universal peace, end idolatry, and be recognized by all nations. Maimonides\' 12th principle affirms belief in the Messiah. The Messiah has NOT yet come — Jesus failed to fulfill the biblical criteria.',
          nuances: 'Messianic criteria (per Maimonides): building the Temple, gathering exiles, universal Torah observance, universal peace. Jesus did none of these. Jewish tradition has seen many false messiahs (Bar Kokhba, Sabbatai Zevi). The Lubavitch attribution of messiahship to Rabbi Schneerson is controversial within Judaism itself.',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'Jesus of Nazareth is the Christ (Christos = Messiah). He fulfilled the messianic prophecies spiritually — bearing Israel\'s sins (Isaiah 53), entering Jerusalem on a donkey (Zechariah 9:9), born in Bethlehem (Micah 5:2). The physical fulfillments will be accomplished at his Second Coming. The resurrection proves his messianic identity.',
          nuances: 'The "two-stage" fulfillment (spiritual now, physical at Second Coming) is Christianity\'s response to the Jewish objection. Dispensationalists expect a literal Third Temple before the Second Coming. The Messiah is not just king but suffering servant (Isaiah 53), priest (Hebrews), and divine (John 1).',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'Islam acknowledges Isa (Jesus) as the Masih (Messiah) and affirms he will return at the end of days to defeat the Dajjal (Antichrist), break the cross, kill the pig, abolish the jizya, and establish justice. Isa\'s messiahship is real but he is NOT divine. The awaited Mahdi is a separate figure who will appear before Jesus\'s return.',
          nuances: 'The Qur\'an uses the title "Masih" for Isa multiple times (3:45; 4:171) without explaining why. Islamic tradition holds that Isa will return, marry, have children, and die as a normal human. The Mahdi is not mentioned in the Qur\'an but is extensively discussed in hadith.',
        },
      ],
    },
    {
      slug: 'temple-jerusalem',
      name: 'Temple of Jerusalem',
      category: 'THEOLOGY' as const,
      summary:
        'The Jerusalem Temple — its construction, destruction, and future rebuilding — is one of the most politically and religiously charged topics in the Abrahamic world.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'The Temple (Beit HaMikdash) was the singular location of divine presence and sacrificial service. The First Temple (Solomon\'s) was destroyed by Babylon (586 BCE); the Second Temple was destroyed by Rome (70 CE). Tisha B\'Av commemorates both destructions. Traditional Judaism awaits the Third Temple.',
          nuances: 'The Western Wall (Kotel) is the holiest accessible Jewish site. The Temple Mount is currently occupied by the Dome of the Rock and Al-Aqsa Mosque — one of the most volatile flashpoints in the Middle East. Some Orthodox Jews refuse to walk on the Temple Mount for halakhic reasons.',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'Jesus prophesied the Temple\'s destruction (Matt 24:1–2) and it was fulfilled in 70 CE. Christianity understands the Temple as superseded: Jesus\'s body IS the Temple (John 2:19–21); the Church is the temple of the Holy Spirit (1 Cor 3:16–17). The veil torn at Jesus\'s death (Matt 27:51) signifies universal access to God.',
          nuances: 'Some dispensationalist Christians expect a literal Third Temple to be rebuilt before the Second Coming. This has led some Christian Zionists to support Temple Mount organizations. Eastern Orthodox and Catholic traditions see the Church as the new and true Temple.',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'The Temple Mount (Al-Haram al-Sharif) is the third holiest site in Islam. The Dome of the Rock was built over the Foundation Stone (where Muhammad ascended to heaven in the Isra\' wal-Mi\'raj). Al-Aqsa Mosque is directly referenced in Qur\'an 17:1.',
          nuances: 'Jerusalem (al-Quds) was the first qibla (prayer direction) of Muslims before it was changed to Mecca. Islam honors Solomon\'s Temple as a house of worship to God. The question of who controls the Temple Mount is a central point of conflict.',
        },
      ],
    },
    {
      slug: 'red-heifer',
      name: 'Red Heifer',
      category: 'LAW' as const,
      summary:
        'The ritual of the red cow (parah adumah) in Numbers 19 is one of the most enigmatic commandments in Jewish law — purifying the impure while making the pure impure.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'The parah adumah (Numbers 19) commands that a completely red, unblemished cow that has never been yoked be slaughtered, burned with cedar wood, hyssop, and scarlet thread, and its ashes mixed with water to purify anyone who has touched a corpse. The paradox: the ash-water purifies the impure person, but makes the pure priest who sprinkles it impure.',
          nuances: 'This is classified as a chok — a divine decree with no rational explanation. King Solomon himself said he could not understand this law. Only 9 red heifers have been prepared in all of Jewish history; the 10th will be prepared by the Messiah.',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'The Epistle to the Hebrews (9:13–14) interprets the red heifer as a type of Christ: "If the blood of bulls and goats... purify the flesh, how much more will the blood of Christ... purify our conscience from dead works." The red heifer\'s ashes are a shadow of the final purification accomplished by Jesus\'s sacrifice.',
          nuances: 'The paradox of the ritual — purifying while defiling — is seen as reflecting the mystery of the cross: Jesus became sin for us (2 Cor 5:21). The burning outside the camp (Num 19:3) parallels Jesus dying outside Jerusalem\'s city walls (Heb 13:12).',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'Surah 2 (Al-Baqarah, "The Cow") tells Moses commanding the Israelites to sacrifice a cow to identify a murderer — a different story from Numbers 19, though tradition connects the two. The surah\'s name is derived from this story. The lesson is obedience and not over-questioning divine commands.',
          nuances: 'The Quranic cow story in 2:67–73 emphasizes the Israelites\' excessive questioning of Moses and reluctance to obey divine commands. This is considered a major lesson about spiritual obstinacy.',
        },
      ],
    },
    {
      slug: 'noah-and-the-flood',
      name: 'Noah and the Flood',
      category: 'COSMOLOGY' as const,
      summary:
        'The account of a great flood destroying most of humanity while a righteous man builds an ark is found in all three traditions, though with notable differences in detail and theological emphasis.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'Genesis 6–9 records God\'s decision to destroy corrupt humanity with a flood, saving only righteous Noah (tzaddik), his wife, three sons, and their wives — plus pairs of every animal. After 40 days and nights of rain, the waters recede; a rainbow is the sign of God\'s covenant never to destroy the earth by flood again.',
          nuances: 'The rabbis note Noah\'s righteousness was "relative" — righteous in his generation but might have been unremarkable in Abraham\'s time. The Talmud criticizes Noah for not praying for his generation. The Noahide Laws (7 universal commandments) derive from the post-flood covenant.',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'The New Testament uses the flood as a type of final judgment (Matt 24:37–39) and of baptism (1 Pet 3:20–21). Peter describes Noah as a "herald of righteousness." The ark is a type of the Church — those inside are saved, those outside perish.',
          nuances: 'Augustine read the flood allegorically as well as historically. The dimensions of the ark were subject to much typological analysis. Modern debates about the historicity of the flood (global vs. local) are significant within evangelical Christianity.',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'Surah 71 (Nuh) is entirely devoted to Noah\'s 950-year mission. The Quran emphasizes Nuh\'s prophetic preaching and the stubbornness of his people. His own son is drowned in the flood (11:42–43). The flood is a divine punishment for refusing to accept monotheism.',
          nuances: 'The Quran does not mention a rainbow covenant after the flood. Nuh\'s son\'s drowning illustrates that family ties do not override faith. The ark resting on Mount Judi (not Ararat) is mentioned in 11:44.',
        },
      ],
    },
    // ── Enoch / Idris and Heavenly Ascent ───────────────────────────────────
    {
      slug: 'enoch-and-heavenly-ascent',
      name: 'Enoch / Idris & Heavenly Ascent',
      category: 'COSMOLOGY' as const,
      summary:
        'Enoch (Hebrew: Chanoch; Arabic: Idris) is the first human being in Abrahamic scripture taken to heaven without dying. From a single cryptic verse in Genesis, an extraordinary literary and mystical tradition developed across all three religions — encompassing apocalyptic literature, angelic transformation, heavenly knowledge, and the architecture of the cosmos.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'Genesis 5:24 states simply: "Enoch walked with God, and he was not, for God took him." This verse became the seed of one of the richest bodies of Jewish literature outside the Tanakh. 1 Enoch (3rd–1st century BCE) describes Enoch\'s tours of heaven, the fall of the Watchers (angels who mated with women, producing the Nephilim), the origin of evil, and detailed cosmic geography. 2 Enoch (1st century CE) presents him ascending through seven heavens. 3 Enoch (Sefer Hekhalot, 5th–6th century CE) describes Enoch\'s transformation into the archangel Metatron — the "lesser YHWH" — the highest angelic being who sits beside the divine throne.',
          nuances: 'The identification of Enoch with Metatron is one of the most remarkable developments in Jewish mysticism. Metatron is described as having 72 names, a body of cosmic fire, and serving as the heavenly scribe who records the deeds of Israel. The Talmud (Hagigah 15a) records the heretical suggestion that "there are two powers in heaven" based on Metatron\'s authority — showing how controversial Enoch-Metatron theology was within rabbinic Judaism. Despite its exclusion from the canon, 1 Enoch profoundly influenced apocalyptic Judaism, the Dead Sea Scrolls community, and Jewish mystical tradition (merkavah/hekhalot literature).',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'Christianity preserves two explicit references to Enoch: Hebrews 11:5 ("by faith Enoch was translated that he should not see death") places him in the "Hall of Faith" as a model of the righteous life. Jude 1:14–15 directly quotes 1 Enoch 1:9 as prophecy — the only New Testament citation of a text attributed to Enoch. Many early Church Fathers (Tertullian, Irenaeus, Clement of Alexandria) treated 1 Enoch as scripture. The Ethiopian Orthodox Church is the only Christian tradition that includes 1 Enoch in its biblical canon today.',
          nuances: 'The Book of Enoch was enormously influential in early Christianity — its descriptions of the Son of Man, the messianic judgment, and the resurrection of the dead shaped New Testament eschatology (especially the Book of Revelation). The "Watchers" narrative in 1 Enoch (angels mating with women) influenced Christian demonology and the theology of fallen angels. Augustine\'s rejection of 1 Enoch as non-canonical was decisive for the Western church. The rediscovery of the full Ethiopian text in 1773 by James Bruce renewed scholarly interest.',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'The Quran mentions Idris twice: as "a man of truth and a prophet" whom God "raised to a lofty station" (19:56–57), and among "the patient" alongside Ishmael and Dhul-Kifl (21:85). Islamic tradition universally identifies Idris with the biblical Enoch. During the Mi\'raj (Night Journey), Muhammad meets Idris in the fourth heaven. Islamic commentators credit Idris as the first person to write with a pen, the first to sew clothing, and the first to study astronomy and mathematics — making him the patron of knowledge and learning.',
          nuances: 'Some Islamic scholars identify Idris with Hermes Trismegistus (Hermes the Thrice-Great), linking him to the Hermetic tradition of late antiquity and making Enoch/Idris a bridge between Abrahamic and Hellenistic wisdom traditions. Al-Tabari and Ibn Kathir both discuss Idris\'s heavenly ascent extensively. The association with writing and knowledge makes Idris the patron saint of scribes and scholars in Islamic tradition. His placement in the fourth heaven (the heaven of the sun) connects to his traditional association with astronomy.',
        },
      ],
    },

    // ── Highly Controversial ─────────────────────────────────────────────────
    {
      slug: 'jihad',
      name: 'Jihad',
      category: 'THEOLOGY' as const,
      summary:
        'Jihad (Arabic: جِهَاد, "striving/struggle") is one of the most misunderstood and contested concepts in Islam. It has three distinct meanings: internal spiritual struggle, social/moral reform, and armed conflict.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'Judaism has no direct equivalent of jihad but does recognize divinely commanded war (milchemet mitzvah). The conquest of Canaan under Joshua was a divinely commanded war. The concept of rodef (pursuer) allows killing in self-defense. The Talmud discusses various categories of warfare.',
          nuances: 'Jewish "holy war" (cherem warfare) against Canaanites in Deuteronomy 20 is historically parallel to certain jihad rulings. Both traditions struggle with the ethics of divinely commanded killing.',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'Christianity developed the doctrine of Just War (Augustine, Aquinas) which permits violence under strict conditions: just cause, right intention, last resort, proportional response. The Crusades were framed as armed pilgrimage and holy war to recover Jerusalem.',
          nuances: 'Christian pacifism (Quakers, Mennonites) rejects all violence. Just War theory is the mainstream Catholic/Protestant position. The term "Crusade" is used positively in some evangelical contexts and very negatively in Muslim contexts.',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'Classical Islamic jurisprudence distinguishes: (1) Jihad al-nafs — the greater jihad against one\'s own ego; (2) Jihad al-da\'wa — striving to spread Islam through preaching; (3) Jihad al-sayf — armed struggle (the lesser jihad) with strict conditions: declared by legitimate authority, against combatants, with proportional force.',
          nuances: 'The Quran permits defensive war: "Fight in the way of Allah those who fight you, but do not transgress limits" (2:190). Violent extremist groups invoke jihad for terrorism — rejected by the vast majority of Muslim scholars.',
        },
      ],
    },
    {
      slug: 'apostasy',
      name: 'Apostasy & Leaving the Faith',
      category: 'LAW' as const,
      summary:
        'What happens when someone abandons their faith? The legal and social penalties for leaving each Abrahamic tradition range from communal shunning to the historical death penalty.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'A Jew who converts to another religion is called a "meshummad" (apostate). Under traditional halakha, an apostate retains their Jewish status (you cannot stop being Jewish by descent) but forfeits many rights. Historical communities could impose cherem (excommunication). No Jewish state today enforces death for apostasy.',
          nuances: 'The medieval period saw many forced conversions in Spain, Christian Europe, and Islamic lands. Modern Israel does not penalize apostasy. The Jewish view: the apostate remains Jewish and can return, but is cut off from communal life while apostate.',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'Early Christianity viewed apostasy (renouncing faith under persecution) as serious. Medieval Catholic canon law made apostasy a crime; the Inquisition prosecuted suspected apostates. In most Protestant theology, apostasy raises questions about "once saved, always saved."',
          nuances: 'Modern Western Christianity has no legal penalty for leaving the faith. "Deconversion" is rising in Western societies; many former Christians face social and family consequences in conservative evangelical communities.',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'Classical Islamic jurisprudence (fiqh) across all four Sunni schools prescribes the death penalty for apostasy (ridda) for adult men. The legal basis is hadith: "Whoever changes his religion, kill him" (Bukhari). Many Muslim-majority countries have apostasy laws ranging from civil penalties to death.',
          nuances: 'Many contemporary Muslim scholars dispute the death penalty for apostasy, arguing the classical ruling applied to political treason in a theocratic state, not personal belief change. The Quranic position is ambiguous — it threatens afterlife punishment (2:217) but does not explicitly prescribe earthly execution.',
        },
      ],
    },
    {
      slug: 'status-of-women',
      name: 'Status of Women',
      category: 'LAW' as const,
      summary:
        'The role and status of women in religious law, leadership, and practice is one of the most actively debated topics within and between all three Abrahamic traditions.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'Traditional Orthodox Judaism divides commandments into time-bound positive commandments (women exempt), including tallit and tefillin. Women cannot serve as witnesses or rabbis in Orthodox law. Marriage and divorce law places power primarily with the husband.',
          nuances: 'The agunah (chained woman) problem in Orthodox Judaism — a woman whose husband refuses to grant a get (divorce) — is a significant contemporary injustice. Reform (1972) and Conservative (1985) Judaism ordained women as rabbis.',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'Christianity has historically restricted women from church leadership, citing Paul: "I do not permit a woman to teach or to assume authority over a man" (1 Tim 2:12). Catholic and Orthodox churches do not ordain women to the priesthood. Most Protestant denominations now ordain women.',
          nuances: 'Egalitarian Christians note that Paul also writes there is "neither male nor female" in Christ (Gal 3:28). Prominent women in the NT (Mary Magdalene, Priscilla, Phoebe, Junia) suggest leadership roles. Christian feminism has produced significant scholarship.',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'Islam gave women legal rights (property ownership, inheritance, right to refuse marriage) that were revolutionary in 7th-century Arabia. Classical Islamic law: women inherit half what men inherit (4:11); a husband can unilaterally divorce (talaq); women\'s testimony counts as half a man\'s in financial cases (2:282).',
          nuances: 'The hijab/veil is mandated in most traditional interpretations (24:31; 33:59) but interpreted differently. Female genital mutilation (FGM) is practiced in some Muslim communities but has no Quranic basis and is condemned by many scholars. Women scholars (e.g., Aisha bint Abi Bakr) have historically been important transmitters of hadith.',
        },
      ],
    },
    {
      slug: 'satan-and-evil',
      name: 'Satan & the Origin of Evil',
      category: 'THEOLOGY' as const,
      summary:
        'Where does evil come from? Is there a personal evil being opposed to God? The figure of Satan/Iblis and the problem of evil take very different forms across the three traditions.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'In the Hebrew Bible, ha-Satan (the adversary) appears as a member of the divine court who tests humans — not an independent evil being (Job 1–2). Later Jewish tradition developed a more independent Satan (Samael). The evil inclination (yetzer ha-ra) within humans is the central Jewish concept.',
          nuances: 'Judaism does not have a strong devil mythology. The Talmud describes a human being as having both a good and evil inclination. Kabbalah has complex demonology (Lilith, Samael, the Sitra Achra) but this is esoteric rather than mainstream.',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'Christianity has the most developed theology of Satan as a personal evil being — a fallen angel who rebelled against God, the "prince of this world" (John 12:31), the "father of lies" (John 8:44), and the tempter of Christ (Matt 4). His power is defeated by Christ\'s resurrection and will be finally destroyed (Rev 20:10).',
          nuances: 'Christian theodicy (explaining why a good God permits evil) is a major philosophical problem. Classical answers: free will defense (Augustine); soul-making theodicy (Irenaeus). Satan as the origin of evil raises the problem: if God created him good, who caused his fall?',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'Iblis is explicitly a jinn (not a fallen angel) who chose to disobey God\'s command to bow before Adam out of pride ("I am better than him; You created me from fire and created him from clay," 7:12). He was expelled from heaven but given a reprieve until Judgment Day to lead humanity astray.',
          nuances: 'The Quranic account of Iblis\'s rebellion is found in seven surahs. Islamic theology distinguishes Iblis (specific individual) from Shaytan (a category — any being that misleads). There is no equal dualism (God vs. devil) — Iblis operates only by God\'s permission.',
        },
      ],
    },
    {
      slug: 'circumcision',
      name: 'Circumcision',
      category: 'LAW' as const,
      summary:
        'Male circumcision was given to Abraham as a sign of the covenant. Its status as religious obligation, cultural practice, or superseded ritual differs significantly across traditions.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'Brit milah (covenant of circumcision) is mandated by the Torah (Genesis 17) as the physical sign of the Abrahamic covenant. Every Jewish male must be circumcised on the 8th day of life. Failure to circumcise means being "cut off" from the people (karet).',
          nuances: 'The 8th day timing is significant — clotting factors are highest on day 8. The rabbis debate whether an already-circumcised adult male convert needs "hatafat dam brit" (a ritual drop of blood). Female circumcision (FGM) has absolutely no place in Jewish law.',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'The Jerusalem Council (Acts 15; Galatians 2) ruled that Gentile converts do NOT need to be circumcised. Paul argues that physical circumcision is irrelevant for salvation — what matters is "circumcision of the heart" (Rom 2:29). The New Covenant replaces circumcision with baptism (Col 2:11–12).',
          nuances: 'The circumcision controversy was one of the most explosive in early Christianity — Jewish Christians (Judaizers) insisted Gentiles needed to be circumcised to be saved. Ethiopian Orthodox Christians retain circumcision on the 8th day as a cultural-religious practice.',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'Circumcision (khitan) is considered a sunnah (prophetic practice) of Ibrahim and is obligatory (wajib) according to most jurists. It is part of the fitra — the natural state of human beings. Not mandated by the Quran directly but by hadith and scholarly consensus.',
          nuances: 'Circumcision is practiced universally by Muslim males. Female circumcision is practiced in some Muslim communities in East Africa and Egypt but is widely condemned by mainstream Islamic scholars. WHO and Islamic scholars increasingly align in opposing FGM.',
        },
      ],
    },
    {
      slug: 'crucifixion-of-jesus',
      name: 'Crucifixion of Jesus',
      category: 'THEOLOGY' as const,
      summary:
        'Did Jesus die on the cross? This is one of the most fundamental points of division between Christianity on one side, and Islam (and parts of Judaism) on the other.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'Jewish sources (Talmud, Josephus) confirm that a figure named Yeshu or Jesus was executed by the Romans. Jewish tradition does not deny the crucifixion but denies its salvific significance. Jewish responsibility for his death, as claimed in early Christian sources, has been used to justify centuries of antisemitism.',
          nuances: 'The "Christ-killer" accusation against Jews (deicide) fueled medieval pogroms and the Holocaust. The Second Vatican Council\'s Nostra Aetate (1965) formally repudiated collective Jewish guilt for the crucifixion. The Talmud (Sanhedrin 43a) contains a passage suggesting Jesus was executed for sorcery.',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'The crucifixion is the central event of Christian salvation history. Jesus, the sinless Son of God, died as a substitutionary sacrifice for human sin. His death satisfied divine justice. The resurrection three days later vindicates him and guarantees believers\' resurrection.',
          nuances: 'Different atonement theories: Penal Substitution (most evangelical/Reformed); Moral Influence (Liberal); Christus Victor (Orthodox); Satisfaction/Ransom (Catholic medieval). The Apostles\' Creed states: "suffered under Pontius Pilate, was crucified, died, and was buried."',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'The Quran explicitly states that Jesus was NOT crucified: "They did not kill him, nor did they crucify him, but it was made to appear so to them" (4:157). Jesus was raised alive to God. Muslim scholars differ on what exactly happened — most hold the substitution theory (someone else was crucified in his place).',
          nuances: 'Surah 4:157 (the shubbiha lahum verse) is one of the most debated Quranic passages. Some revisionist scholars try to reconcile the Quran with historical crucifixion. The denial of the crucifixion is a major sticking point in Christian-Muslim dialogue.',
        },
      ],
    },
    {
      slug: 'crusades-and-holy-war',
      name: 'Crusades & Holy War',
      category: 'THEOLOGY' as const,
      summary:
        'The Crusades (1095–1291) were a series of religiously-motivated military campaigns by Western Christendom to capture the Holy Land. They shaped Christian-Muslim relations for centuries.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'Jews were victims of the Crusades — Crusaders massacred Jewish communities in the Rhineland en route to the Holy Land (1096 Rhineland massacres). Under Muslim rule in Jerusalem, Jews had been tolerated; under the Crusader Kingdom, Jews were barred from Jerusalem.',
          nuances: 'Jewish communities in the Rhineland (Speyer, Worms, Mainz) were slaughtered in 1096. Some Jews chose kiddush Hashem (martyrdom) rather than forced baptism. The massacres created deep trauma in Ashkenazi Jewish collective memory.',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'Pope Urban II launched the First Crusade in 1095 to liberate Jerusalem and the Holy Sepulchre. Crusades were framed as armed pilgrimage — participants received plenary indulgences. Jerusalem was captured in 1099. The last Crusader state fell in 1291 (Acre).',
          nuances: 'Modern Catholic teaching acknowledges many Crusade actions were unjust. Pope John Paul II asked forgiveness for Crusade-related sins in 2000. The Fourth Crusade (1204) sacked Constantinople — a Christian city — deepening the Catholic-Orthodox split.',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'In Islamic sources, the Crusades are called "al-Hurub al-Salibiyya" (the Cross Wars) — an unprovoked Western Christian invasion of Muslim lands. Saladin (Salah al-Din al-Ayyubi) became the great hero — he recaptured Jerusalem in 1187 and was known for his chivalry.',
          nuances: 'Medieval Muslim sources paid relatively little attention to the Crusades at the time. The Crusades became a major grievance only in 19th-20th century Arab nationalist discourse. Western use of the word "Crusade" is highly sensitive in Muslim contexts.',
        },
      ],
    },
    {
      slug: 'sunni-shia-split',
      name: 'Sunni-Shia Split',
      category: 'THEOLOGY' as const,
      summary:
        'The split between Sunni and Shia Islam originated in a political dispute over succession to Muhammad (632 CE) and evolved into profound theological, legal, and spiritual differences.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'Judaism observes the Sunni-Shia split as an internal Islamic matter. Jewish law must assess each Muslim community separately. The split has geopolitical implications (Saudi Arabia vs. Iran) that affect Israeli foreign policy calculations.',
          nuances: 'Historically, Jews under Ottoman (Sunni) rule differed from Jews under Safavid Persian (Shia) rule. Some Jewish scholars have written comparative analyses of the Islamic split with reference to Jewish sectarian history.',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'Christianity views the Sunni-Shia split as an internal Islamic matter. Christian-Muslim dialogue must engage both communities separately. In regions of sectarian violence (Iraq, Syria, Lebanon), Christian minorities have often been caught between the two factions.',
          nuances: 'Eastern Christian churches (Maronite, Chaldean, Syriac Orthodox) historically maintained relationships with both Muslim communities. Christian scholars note structural parallels between the Sunni-Shia split and the Catholic-Protestant split.',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'After Muhammad\'s death (632 CE), Sunnis accepted Abu Bakr as first Caliph; Shia (Shi\'at Ali) insisted leadership belonged to Ali ibn Abi Talib (Muhammad\'s cousin and son-in-law). The martyrdom of Ali\'s son Husayn at Karbala (680 CE) is the foundational trauma of Shia Islam, commemorated in Ashura.',
          nuances: 'Sunni Islam (85–90% of Muslims): authority in the community, four legal schools. Shia Islam (10–15%): authority in the Imam. Key differences: taqiyya (religious concealment), temporary marriage (mut\'a), commemoration of Karbala, veneration of Imams.',
        },
      ],
    },
    {
      slug: 'antisemitism-and-abrahamic',
      name: 'Antisemitism & the Abrahamic Traditions',
      category: 'THEOLOGY' as const,
      summary:
        'Antisemitism has complex roots in Christian and Islamic theological polemic. Understanding its religious dimensions is essential to honest interfaith engagement.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'Jews have experienced systematic persecution from both Christian and Muslim civilizations throughout history. The Holocaust (Shoah) — the murder of six million Jews by Nazi Germany — was the culmination of centuries of antisemitism. The phrase "never again" has become a foundational post-Holocaust Jewish commitment.',
          nuances: 'Modern antisemitism has found new expression in anti-Zionist rhetoric, creating ongoing debates about the line between legitimate criticism of Israel and antisemitism. The Zionist movement arose partly as a response to European antisemitism.',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'Christian antisemitism has deep roots in the charge of "Christ-killers" (deicide). The Church enacted discriminatory legislation from the 4th century: forced ghettos, yellow badges, expulsions (England 1290, France 1306, Spain 1492), pogroms, and the Inquisition.',
          nuances: 'The Second Vatican Council\'s Nostra Aetate (1965) was a watershed: "What happened in His passion cannot be charged against all the Jews." Pope John Paul II called Jews "elder brothers in faith" and placed a prayer of repentance in the Western Wall.',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'The Quran contains both positive references to Jews (as People of the Book) and polemical passages (e.g., 2:65 — transformation into apes; 5:60 — apes and pigs). These passages were historically read as applying to specific groups of Jews who broke treaties, not to Jews as a race.',
          nuances: 'Classical Islamic antisemitism was religious/theological, not racial. Modern political antisemitism in Muslim-majority countries is largely a product of the Israeli-Palestinian conflict and imported European antisemitic texts. Many Muslim scholars and communities strongly condemn antisemitism.',
        },
      ],
    },
    {
      slug: 'salvation',
      name: 'Salvation & Atonement',
      category: 'SOTERIOLOGY' as const,
      summary:
        'How are human beings saved, forgiven, and brought into right relationship with God? The three traditions give fundamentally different answers.',
      traditions: [
        {
          tradition: 'JEWISH' as const,
          definition: 'Judaism does not have "salvation" in the Christian sense. The focus is on this life — living according to Torah, repentance (teshuva), and the World to Come for the righteous. Teshuva involves: recognizing the sin, regretting it, confessing verbally, making restitution, and resolving not to repeat it.',
          nuances: 'Maimonides teaches that the righteous of all nations have a share in the World to Come — salvation is not exclusive to Jews. Non-Jews need only observe the Seven Noahide Laws. The Temple sacrificial system was the primary atonement mechanism for intentional sins.',
        },
        {
          tradition: 'CHRISTIAN' as const,
          definition: 'Salvation (soteria) is by grace through faith in Jesus Christ (Eph 2:8–9). Jesus\'s atoning death pays the penalty for sin; his resurrection guarantees eternal life. Justification by faith alone (sola fide) is the Protestant Reformation\'s central claim.',
          nuances: 'Catholic and Orthodox traditions emphasize that faith without works is dead and salvation involves ongoing cooperation with grace. The question of whether non-Christians can be saved has evolved: Vatican II affirms non-Christians can be saved through "seeds of the Word."',
        },
        {
          tradition: 'ISLAMIC' as const,
          definition: 'In Islam, salvation (falah/najat) is achieved through: (1) Faith (iman); (2) Islam (submission) — performing the Five Pillars; (3) Ihsan (excellence). God forgives sins directly through sincere repentance (tawba) — no intermediary or atoning sacrifice is needed. Shirk (polytheism) is the one unforgivable sin.',
          nuances: 'Islam denies the need for any sacrifice or mediator between God and humans. The concept of atonement through blood sacrifice is rejected as a distortion. Intercession (shafa\'a) of the Prophet on Judgment Day is accepted by God\'s permission, not the Prophet\'s independent power.',
        },
      ],
    },
  ]

  for (const { traditions, ...concept } of concepts) {
    const created = await prisma.concept.upsert({
      where: { slug: concept.slug },
      update: {},
      create: { ...concept, isPublished: true },
    })

    for (const tradition of traditions) {
      await prisma.conceptTradition.upsert({
        where: { conceptId_tradition: { conceptId: created.id, tradition: tradition.tradition } },
        update: {},
        create: { ...tradition, conceptId: created.id },
      })
    }
  }

  console.log('✓ Concepts seeded')
}
