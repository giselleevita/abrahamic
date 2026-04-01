import { createHash } from 'crypto'
import type { PrismaClient } from '@prisma/client'

function claimHash(sourceId: number, statement: string): string {
  const normalized = statement.trim().toLowerCase().replace(/\s+/g, ' ')
  return createHash('sha256').update(`${sourceId}::${normalized}`).digest('hex')
}

type ComparisonData = {
  title: string
  slug: string
  tag: 'SHARED' | 'SIMILAR_DIFFERENT' | 'CONTRADICTION'
  summary: string
  claimStatements: string[]  // matched by statement text to find the claim
}

const comparisonsData: ComparisonData[] = [
  {
    title: "Abraham's Covenant with God",
    slug: 'abrahams-covenant',
    tag: 'SHARED',
    summary:
      'All three traditions affirm that God entered into a special covenant with Abraham. The Torah establishes this as an everlasting covenant of land and lineage for the Jewish people. The New Testament, through Paul, reinterprets the covenant as fulfilled through faith rather than law. The Qur\'an presents Ibrahim as an Imam for all humanity, with the covenant extending to righteous descendants. Each tradition affirms the covenant\'s divine origin and Abraham\'s central role, while understanding its scope and continuation differently.',
    claimStatements: [
      'God establishes an everlasting covenant with Abraham and his descendants, promising them the land of Canaan.',
      'Paul states that the promise given to Abraham came through the righteousness of faith, not through the Law.',
      'God makes Ibrahim an Imam (leader) for all people after testing him with trials, and the covenant extends through his righteous descendants.',
    ],
  },
  {
    title: 'The Divine Call to Abraham',
    slug: 'abrahams-call',
    tag: 'SHARED',
    summary:
      "The Torah explicitly narrates God's call to Abraham to leave his homeland and go to a new land. Both Paul's letters and the Qur'an reference this call, presenting Abraham as a model of obedience to God. The three traditions share the foundational narrative of Abraham's departure as an act of faith.",
    claimStatements: [
      'God calls Abraham (then Abram) to leave his country, kindred, and father\'s house for a land that God will show him.',
      'Paul states that the promise given to Abraham came through the righteousness of faith, not through the Law.',
    ],
  },
  {
    title: 'The Oneness of God (Monotheism)',
    slug: 'oneness-of-god',
    tag: 'SIMILAR_DIFFERENT',
    summary:
      "All three traditions are strictly monotheistic. The Torah's Shema (Deuteronomy 6:4) is the foundational declaration of God's oneness in Judaism. Surah Al-Ikhlas is the Qur'an's clearest statement of divine unity (tawhid), which explicitly states God neither begets nor is begotten — a formulation that many Islamic scholars read as a direct counter to Trinitarian Christianity. The Gospel of John's identification of the Word with God presents the most complex monotheism: one that Christian theology would later articulate as the Trinity. These traditions share absolute monotheism as a core commitment but disagree on what that oneness entails.",
    claimStatements: [
      'The Shema declares that the LORD (YHWH) is the one God of Israel.',
      'The Gospel of John opens by identifying the Word (Logos) as being with God and being God from the beginning.',
      'Surah Al-Ikhlas declares God as absolutely One, who neither begets nor was begotten, with no equivalent.',
    ],
  },
  {
    title: "The Annunciation: Mary's Conception of Jesus",
    slug: 'annunciation-mary-jesus',
    tag: 'SIMILAR_DIFFERENT',
    summary:
      "Both the New Testament and the Qur'an describe an angelic announcement to Mary concerning the miraculous conception of Jesus. Both affirm the virgin birth. The New Testament identifies the angel as Gabriel and describes the conception as the work of the Holy Spirit, with Jesus declared the Son of God. The Qur'an describes the angel as a divine messenger (identified by commentators as Jibril), announces the birth of a pure son (Isa), and emphasizes his status as a prophet and Word of God — without affirming divine sonship.",
    claimStatements: [
      'The angel Gabriel is sent to Mary in Nazareth to announce that she will conceive a son through the Holy Spirit, who will be called the Son of God.',
      'The Qur\'an describes how a messenger (identified by commentators as Jibril/Gabriel) appeared to Maryam to announce the gift of a pure son.',
    ],
  },
  {
    title: 'The Death of Jesus: Crucifixion or Appearance?',
    slug: 'death-of-jesus',
    tag: 'CONTRADICTION',
    summary:
      "This is one of the clearest direct contradictions between the New Testament and the Qur'an. The New Testament presents the crucifixion of Jesus as a historical event central to Christian theology — the atoning death of the Son of God. The Qur'an (An-Nisa 4:157) directly states that Jesus was not killed nor crucified, but it was made to appear so. Matthew's account of the birth fulfilling Isaiah's Immanuel prophecy further underscores the different theological frameworks: in Christianity, Jesus is Immanuel ('God with us') who dies and is resurrected; in Islam, Isa is a prophet who was raised to heaven by God. These are editorially tagged as a contradiction because the texts make opposing claims about the same historical event.",
    claimStatements: [
      'The Qur\'an states that Jesus was not killed nor crucified, but it was made to appear so to those who claimed it.',
      'Matthew cites Isaiah 7:14 as fulfilled in the birth of Jesus, translating the Hebrew \'almah as parthenos (virgin).',
    ],
  },

  // ── New comparisons ───────────────────────────────────────────────────────
  {
    title: 'The Ten Commandments and the Moral Law',
    slug: 'ten-commandments-moral-law',
    tag: 'SIMILAR_DIFFERENT',
    summary:
      'All three traditions acknowledge that God revealed a foundational moral code to Moses on Mount Sinai. The Torah preserves all Ten Commandments as eternally binding on Israel. Jesus distills them into two love commandments, declaring that all of Torah depends on these. The Quran, in Surah Al-Isra, presents a moral summary strikingly similar to the Decalogue — worship God alone, honour parents, do not kill — though not enumerated as "ten." Each tradition affirms the divine origin of this moral core, while differing on its scope, abrogation, and application.',
    claimStatements: [
      'God opens the Decalogue by identifying Himself as the Redeemer who brought Israel out of Egypt, then commands: have no other gods before Me.',
      'Jesus declares that all the Law and the Prophets hang on two commandments: love God with all your heart, and love your neighbor as yourself.',
      'God commands worshipping Him alone and honouring parents — the Quran\'s moral summary in Al-Isra mirrors the ethical core of the Decalogue.',
    ],
  },
  {
    title: 'The Sabbath and the Day of Rest',
    slug: 'sabbath-day-of-rest',
    tag: 'SIMILAR_DIFFERENT',
    summary:
      'All three traditions institutionalize a sacred time for communal worship and rest, but they do not agree on when, how, or why. Judaism observes the Sabbath from Friday sunset to Saturday nightfall as a perpetual sign of the Sinai covenant — the holiest day on the Jewish calendar. Christianity shifted the day of worship to Sunday (the Lord\'s Day), commemorating the Resurrection; Jesus himself taught that human need takes precedence over Sabbath regulations. Islam does not observe a Sabbath but gathers for Friday Jumu\'ah prayer — a congregational obligation replacing the Sabbath\'s communal character without prohibiting work.',
    claimStatements: [
      'The fourth commandment requires Israel to remember the Sabbath day and keep it holy, refraining from all work — because God rested on the seventh day.',
      'Jesus teaches that the Sabbath was created for the benefit of humanity — it exists to serve people, and the Son of Man is Lord even of the Sabbath.',
      'The Quran commands believers to leave trade and hasten to the congregational prayer (Jumu\'ah) on Friday — Islam\'s weekly communal assembly replaces the Sabbath.',
    ],
  },
  {
    title: 'The Golden Rule: Loving Your Neighbor',
    slug: 'golden-rule-neighbor',
    tag: 'SHARED',
    summary:
      'The principle of treating others as one wishes to be treated — the so-called Golden Rule — appears in all three traditions as a central ethical imperative. The Torah commands "love your neighbor as yourself" (Leviticus 19:18). Jesus elevates this to one of the two greatest commandments and states it explicitly in Matthew 7:12. The Quran commands doing good to every category of neighbor and person in need, embedding the ethic of mutual care in a comprehensive social vision. While the formulations differ, all three converge on the obligation of active, outward love toward others.',
    claimStatements: [
      'The Torah commands: do not bear grudges against your kinsmen — love your neighbor as yourself; this is the LORD\'s command.',
      'Jesus teaches the Golden Rule: do to others whatever you would have them do to you — this, he says, summarizes the entire Law and the Prophets.',
      'God commands worshipping Him alone and doing good to parents, relatives, orphans, the needy, near and far neighbours, and all those in need — the Quranic framework of ethical obligation toward others.',
    ],
  },
  {
    title: 'Fasting: Affliction, Devotion, and Self-Restraint',
    slug: 'fasting-across-traditions',
    tag: 'SIMILAR_DIFFERENT',
    summary:
      'Fasting is a commanded practice in all three traditions, but its timing, purpose, and communal role differ substantially. Judaism observes Yom Kippur (the Day of Atonement) as the most solemn fast of the year — a full day of abstinence commanded in the Torah. Christianity does not mandate specific fast days in its scriptures; Jesus assumes his followers will fast privately and freely. Islam prescribes the entire month of Ramadan as an obligatory fast from dawn to sunset, with the explicit rationale of developing taqwa (God-consciousness). All three traditions agree that fasting is a form of worship; they disagree on when, how long, and for whom it is mandatory.',
    claimStatements: [
      'God commands Israel to observe the Day of Atonement (Yom Kippur) with fasting and complete rest — a statute in perpetuity for the entire community.',
      'Jesus presupposes that his followers will fast, and instructs them not to make a show of it — fasting is a private act of devotion between the individual and God.',
      'God prescribes fasting during the month of Ramadan for all believers, as it was prescribed for peoples before them, so that they may develop God-consciousness (taqwa).',
    ],
  },
  {
    title: 'Dietary Laws: What Is Permitted to Eat?',
    slug: 'dietary-laws',
    tag: 'SIMILAR_DIFFERENT',
    summary:
      'All three traditions regulate what their followers may eat, but the scope and theological rationale diverge sharply. The Torah lays out detailed kashrut laws: clean animals must have split hooves and chew cud; seafood must have fins and scales; birds of prey are forbidden. Christianity, beginning with a vision recorded in Acts and reinforced by Paul, moved away from these regulations — Jewish dietary laws are not binding on Gentile Christians. Islam maintains a simpler set of restrictions (halal/haram): prohibiting pork, blood, carrion, and animals not slaughtered in God\'s name — closely mirroring the Torah\'s minimum prohibitions while not requiring the full kashrut system.',
    claimStatements: [
      'God specifies which land animals may be eaten: only those that have completely split hooves and chew their cud are permitted — the foundation of kashrut.',
      'A voice from heaven tells Peter that what God has made clean must not be called impure — the vision signals that Gentile Christians are not bound by Jewish dietary laws.',
      'God forbids only what is clearly harmful: carrion, blood, pork, and animals slaughtered in any name other than God\'s — beyond these, all food is permitted (halal).',
    ],
  },
  {
    title: "Isaiah 53 — The Suffering Servant",
    slug: 'isaiah-53-suffering-servant',
    tag: 'CONTRADICTION',
    summary:
      'Isaiah 53 is the most contested passage in all of Abrahamic scripture. Judaism reads the Servant as the nation of Israel — suffering in exile, rejected by the nations, eventually vindicated. Christianity reads it as a precise prophecy of Jesus\' crucifixion and atonement, fulfilled verse by verse: despised, rejected, pierced for our transgressions. Islam affirms Jesus as the Messiah honoured in both worlds — but denies his crucifixion entirely (Quran 4:157), making the Christian reading of Isaiah 53 as a death-and-atonement prophecy theologically irreconcilable with Islamic teaching. These three readings do not merely differ — they contradict each other on whether the Servant suffers, dies, and atones.',
    claimStatements: [
      'Isaiah describes the Servant of the LORD as despised, pierced for our transgressions and crushed for our iniquities — the LORD laid on him the iniquity of us all, and by his wounds we are healed.',
      'The New Testament reads Isaiah\'s Suffering Servant as a direct prophecy of Jesus Christ — fulfilled in his rejection, crucifixion, and the healing of humanity through his atoning death.',
      'The Quran honours Isa as the Messiah — a word from God, honoured in this world and the next, and among those brought near to God — but denies his crucifixion, making a suffering-servant reading of his death impossible within Islamic theology.',
    ],
  },
  {
    title: 'The Messiah — Who and What?',
    slug: 'the-messiah-prophecy',
    tag: 'SIMILAR_DIFFERENT',
    summary:
      'All three traditions use the word Messiah (Hebrew: Mashiach; Greek: Christos; Arabic: Al-Masih) — but they mean radically different things by it. Judaism awaits a human king from the line of David who will rebuild the Temple, gather the exiles, and usher in universal peace — criteria Jesus did not fulfill. Christianity teaches that Jesus is the Messiah who fulfilled the prophetic scriptures spiritually and will complete the remaining prophecies at his Second Coming. Islam affirms Jesus as al-Masih — a title of honour — but denies his divinity; a different messianic figure (the Mahdi) is awaited in Islamic eschatology. All three traditions expect a messianic resolution to history; none agree on who it is.',
    claimStatements: [
      'Isaiah prophesies a child born to be king, bearing the names Wonderful Counsellor, Mighty God, Everlasting Father, Prince of Peace — his government and peace shall have no end, established on the throne of David.',
      'Peter confesses Jesus as the Messiah and Son of the living God; Jesus declares this a revelation from the Father, not a human insight — and on this confession he will build his church.',
      'The angels announce to Maryam that God gives her glad tidings of a Word from Him, whose name is the Messiah, Jesus son of Mary — honoured in this world and the next, and among those brought near to God.',
    ],
  },
  {
    title: 'The Temple — Where Does God Dwell?',
    slug: 'temple-dwelling-of-god',
    tag: 'SIMILAR_DIFFERENT',
    summary:
      'All three traditions trace their connection to the Temple in Jerusalem — the most physically contested religious site on earth. Judaism considers it the place God chose for His name to dwell; the Western Wall is all that remains after the Roman destruction of 70 CE, and the Temple\'s rebuilding is central to Jewish messianic expectation. Christianity teaches that Jesus replaced the Temple: his body, then the community of believers (the church), became the new sanctuary of God\'s presence — the stone Temple\'s destruction was theological completion, not tragedy. Islam reveres the Temple Mount (Masjid al-Aqsa) as the third holiest site in Islam — from which Muhammad ascended on the Night Journey — and has maintained a mosque there since the 7th century.',
    claimStatements: [
      'God commands the construction of a sanctuary — the Tabernacle — so that the divine presence may dwell among the Israelites; the portable sanctuary is the model for the later Temple.',
      'Jesus declares that if the Temple is destroyed he will raise it again in three days — John explains that the temple he spoke of was his body, identifying Jesus himself as the new dwelling of God among humanity.',
      'The Quran commemorates God\'s transportation of Muhammad from the Sacred Mosque in Mecca to the Furthest Mosque (al-Masjid al-Aqsa) in Jerusalem — Islam\'s sacred connection to the Temple Mount, the third holiest site in Islam.',
    ],
  },
  {
    title: 'The Red Heifer — Purification and Its Limits',
    slug: 'red-heifer-purification',
    tag: 'SIMILAR_DIFFERENT',
    summary:
      'The red heifer (parah adumah) in Numbers 19 is one of the most enigmatic laws in the Torah — a "statute" (chok) whose reason is not given. A perfect red cow is burned outside the camp; its ashes mixed with water create a purification agent that cleanses those defiled by contact with a corpse, yet paradoxically renders the one who prepares it ritually impure. The rabbis called it the archetype of all inexplicable divine commands. Christianity reads it as a foreshadowing of Christ\'s atoning sacrifice — the perfect unblemished offering outside the city gates that cleanses from "dead works." Islam has a related but distinct "sacred cow" narrative in Surah Al-Baqarah: Moses commands the Israelites to slaughter a cow, which they question repeatedly, and whose flesh is used to miraculously reveal a murderer.',
    claimStatements: [
      'God commands the preparation of the most paradoxical purification: the ashes of a perfect red heifer, burned outside the camp, mixed with water — the water of lustration that cleanses those defiled by contact with death, yet renders the one who prepares it impure.',
      'The author of Hebrews argues from lesser to greater: if the ashes of a heifer can sanctify the flesh, how much more will the blood of Christ — who offered himself without blemish to God — purify the conscience from dead works to serve the living God.',
      'In Surah Al-Baqarah, God commands Moses to tell the Israelites to slaughter a cow — a divine test they resist with repeated questioning. When they finally comply, the cow\'s flesh miraculously reveals a murderer. The Quran\'s sacred cow narrative is related to but distinct from the red heifer purification law.',
    ],
  },
  {
    title: 'Charity and Care for the Poor',
    slug: 'charity-care-for-the-poor',
    tag: 'SHARED',
    summary:
      'Care for the poor is a foundational obligation in all three traditions, but their mechanisms and theological framing differ. Judaism institutionalises charity through tzedakah (righteousness/justice) and specific agricultural laws (pe\'ah — leaving field edges for the poor). Christianity emphasises voluntary, hidden giving as a form of private devotion. Islam makes zakat — a fixed percentage of accumulated wealth given annually — one of the Five Pillars: not optional charity but a religious obligation. All three traditions agree that sharing wealth with those in need is commanded by God and central to righteous living.',
    claimStatements: [
      'God commands landowners to leave the corners and gleanings of their fields unharvested, so that the poor and the stranger may gather food — tzedakah built into the land.',
      'Jesus teaches that authentic charity is entirely private: do not let your left hand know what your right hand is doing — your Father who sees in secret will reward you.',
      'True righteousness, according to the Quran, includes giving wealth — despite loving it — to relatives, orphans, the needy, travellers, and those in bondage; and giving the obligatory zakat.',
    ],
  },
  // ── Newly added comparisons ──────────────────────────────────────────────
  {
    title: 'Was Jesus Crucified? — The Central Divide',
    slug: 'was-jesus-crucified',
    tag: 'CONTRADICTION',
    summary:
      'No single question divides the three Abrahamic traditions more sharply than whether Jesus died on the cross. For Christianity, the crucifixion is the central event of salvation history — the atoning death of God\'s Son for humanity\'s sin, verified by the resurrection. For Islam, the Quran explicitly denies it happened: it was made to appear so, but Jesus was raised alive to God. For Judaism, the crucifixion is historically affirmed (confirmed by Roman sources) but carries no theological significance, and the attribution of Jewish collective guilt for it fueled centuries of Christian antisemitism. Three traditions, three fundamentally irreconcilable positions.',
    claimStatements: [
      'Jesus is declared to be the Christ, the Son of the living God — the first explicit apostolic confession of his divine messianic identity, which Jesus affirms as revealed by the Father in heaven.',
      'The Quran categorically denies that Jesus was killed or crucified — it was made to appear so — and affirms that God raised him up to Himself; those who dispute this have only conjecture and no certainty.',
    ],
  },
  {
    title: 'The Trinity — One God or Three Persons?',
    slug: 'the-trinity-debate',
    tag: 'CONTRADICTION',
    summary:
      'The Christian doctrine of the Trinity — one God in three co-equal persons (Father, Son, Holy Spirit) — is affirmed by all mainstream Christian denominations and contradicted by both Islam and traditional Judaism. The Quran directly and repeatedly rejects the Trinity (5:73), declaring it blasphemy, and Al-Ikhlas (Surah 112) is widely read as a point-by-point counter to Trinitarian claims. Judaism rejects the Trinity as violating pure monotheism (echad — absolute oneness). Christianity responds that the Trinity is monotheism fully understood, not abandoned. This is perhaps the deepest theological fault line between the three traditions.',
    claimStatements: [
      'Surah Al-Ikhlas declares God as absolutely One, who neither begets nor was begotten, with no equivalent.',
      'The Gospel of John opens by identifying the Word (Logos) as being with God and being God from the beginning.',
      'The Quran rejects the Trinity, stating that those who say "God is the third of three" have disbelieved — there is only one God, and Jesus son of Mary was a messenger of God and His Word directed to Mary, not a divine person.',
    ],
  },
  {
    title: 'The Future Prophet — Moses\'s Prophecy Applied',
    slug: 'the-future-prophet-deuteronomy-18',
    tag: 'SIMILAR_DIFFERENT',
    summary:
      'Deuteronomy 18:15 — Moses\'s promise that God will raise up a prophet "like me" from among the Israelites — is one of the most contested messianic proof texts in all Abrahamic scripture. Each tradition applies it to a different figure. Christianity sees it as fulfilled in Jesus, who is the new Moses — bringing a new covenant as Moses brought the old one, and confirmed by Peter\'s sermon in Acts 3. Islam identifies the prophecy as pointing to Muhammad — who brought a new law, led a community, and came from the Abrahamic family. Judaism reads it as a general promise that God will always provide legitimate prophets for Israel, not a single messianic prediction.',
    claimStatements: [
      'Moses prophesies that God will raise up a prophet from among the Israelites who is like Moses — this prophet\'s words must be heeded; Christians apply this to Jesus, Muslims apply it to Muhammad.',
      'Peter quotes Moses\'s prophecy about the future prophet and applies it to Jesus — Jesus is the prophet-like-Moses whom Israel was commanded to obey, now raised from the dead and exalted to God\'s right hand.',
      'Muhammad is declared the Seal of the Prophets (Khatam an-Nabiyyin) — not the father of any man but the Messenger of God and the final prophet, after whom no new prophet will come.',
    ],
  },
  {
    title: 'Apostasy — Freedom of Conscience vs. Divine Law',
    slug: 'apostasy-leaving-the-faith',
    tag: 'CONTRADICTION',
    summary:
      'What happens when someone leaves the Abrahamic faith they were born into? All three traditions have historically penalized apostasy, but the severity differs enormously. Classical Islamic jurisprudence mandates the death penalty for adult male apostates (ridda), based on prophetic hadith, implemented in some Muslim-majority countries today. Medieval Christianity burned heretics and apostates through the Inquisition. Judaism historically imposed excommunication (cherem) but rarely capital punishment. The Quran itself is ambiguous — it threatens afterlife punishment for apostasy but does not explicitly command earthly execution — and contains the radical declaration "no compulsion in religion" (2:256). These texts are in tension with each other and with modern human rights standards.',
    claimStatements: [
      'There is no compulsion in religion — the right path has been made clear from the wrong; this Quranic principle establishes freedom of belief as a divine decree, complicating later juridical rulings on apostasy.',
      'Whoever reverts from their religion and dies as a disbeliever, their deeds become worthless in this world and the Hereafter, and they will be companions of the Fire — the Quranic warning for apostasy focuses on the afterlife rather than specifying an earthly penalty.',
    ],
  },
  {
    title: 'Salvation — Faith, Works, or Submission?',
    slug: 'salvation-faith-works-submission',
    tag: 'SIMILAR_DIFFERENT',
    summary:
      'How is a human being saved, redeemed, or brought into right relationship with God? The three traditions give fundamentally different answers. Paul\'s landmark declaration "a person is justified by faith apart from works of the law" is central to Protestant Christianity and remains a point of debate with Catholic and Orthodox Christianity, both of whom emphasize cooperation with grace. Judaism does not use "salvation" in the Christian sense — the question is how to live rightly according to Torah and seek God\'s forgiveness through repentance. Islam teaches that salvation comes through faith (iman), submission (islam), and excellence (ihsan) — but it is ultimately God\'s mercy (rahma) that saves, since no human\'s deeds are sufficient without it.',
    claimStatements: [
      'Paul teaches that a person is justified by faith apart from works of the law — salvation is a gift of grace through faith in Christ, not earned through observance of the Mosaic commandments.',
      'In Christ there is neither Jew nor Greek, slave nor free, male nor female — all are one in Christ Jesus, and if you belong to Christ you are Abraham\'s offspring, heirs according to the promise.',
      'There is no compulsion in religion — the right path has been made clear from the wrong; this Quranic principle establishes freedom of belief as a divine decree, complicating later juridical rulings on apostasy.',
    ],
  },
  {
    title: 'The Akedah — Which Son Was Offered?',
    slug: 'akedah-which-son',
    tag: 'CONTRADICTION',
    summary:
      'The story of Abraham\'s near-sacrifice of his son is shared by all three traditions and is one of the most theologically rich narratives in Abrahamic scripture. The Torah and New Testament are explicit: the son is Isaac (Yitzchak), Abraham\'s son through Sarah — the covenant heir. Islam agrees this is the supreme test of Abraham\'s faith, but Islamic tradition (supported by most classical commentators) holds that the son was Ishmael (Isma\'il), Abraham\'s firstborn through Hagar. The Quran does not name the son in the sacrifice narrative (Surah 37:100–107), which has generated 1400 years of scholarly debate. At stake in this dispute is the question of which lineage — Israelite or Arab/Ishmaelite — carries the supreme covenantal narrative.',
    claimStatements: [
      'God commands Abraham to take his son Isaac — the beloved, only son — to the land of Moriah and offer him as a burnt offering; Abraham obeys, but God provides a ram at the last moment; all three traditions debate the theological meaning of this test.',
      'God makes Ibrahim an Imam (leader) for all people after testing him with trials, and the covenant extends through his righteous descendants.',
    ],
  },
  {
    title: 'Women in Religious Leadership — Authority, Ordination & Law',
    slug: 'women-in-religious-leadership',
    tag: 'SIMILAR_DIFFERENT',
    summary:
      'The question of women\'s authority in religious leadership is one of the most actively debated topics within all three Abrahamic traditions today. Judaism moved from full exclusion of women in Orthodox tradition to full equality in Reform (1972) and Conservative (1985) movements. Christianity is divided: Catholic and Orthodox churches prohibit women\'s ordination, while most Protestant denominations ordain women — with the debate centering on two Pauline texts (1 Tim 2:12 vs. Gal 3:28). Islam classically restricts female leadership of mixed congregations in prayer and prohibits women from certain testimonial roles, though contemporary scholars debate these limits. All three traditions contain both restrictive and egalitarian impulses.',
    claimStatements: [
      'Paul instructs that he does not permit a woman to teach or exercise authority over a man — she is to remain quiet; this is the most cited text in debates about women\'s ordination and authority in the church.',
      'Paul writes that in Christ there is no male or female — all are equally heirs of the promise of Abraham; egalitarian Christians use this verse to argue for women\'s full equality in church ministry.',
      'Men are declared to be in charge of (qawwamun) women by virtue of what God has given one over the other and because men provide for women from their wealth — the Quranic basis for male guardianship in Islamic law.',
    ],
  },
  {
    title: 'Circumcision — Eternal Sign or Superseded Ritual?',
    slug: 'circumcision-sign-covenant',
    tag: 'SIMILAR_DIFFERENT',
    summary:
      'Circumcision was given to Abraham as the physical sign of the covenant — an outward mark of belonging to God\'s people. Judaism has maintained it as a binding covenant obligation for 4,000 years; brit milah on the 8th day is the most universally observed Jewish ritual. Islam practices circumcision as obligatory sunnah of Ibrahim, universal among Muslim men. Christianity, through Paul\'s decisive intervention at the Jerusalem Council (Galatians 2; Acts 15), declared that circumcision is not required for Gentile Christians and that the "circumcision that counts" is of the heart — the New Covenant replaces the physical sign with baptism. This is one of the clearest examples of Christianity breaking from its Jewish roots.',
    claimStatements: [
      'God commands Abraham that every male in his household must be circumcised as the sign of the covenant — this is the foundational commandment of brit milah, observed by Jews on the 8th day of a male child\'s life.',
      'Paul argues that true circumcision is of the heart, by the Spirit — the physical circumcision of the flesh is not required for Gentile Christians, and those who insist on it are mutilating themselves.',
      'The Quran commands believers to follow the religion of Ibrahim as a hanif (pure monotheist), the same Ibrahim whom God chose as a close friend — Islamic tradition understands this to include circumcision as part of the fitra (natural human state).',
    ],
  },
  {
    title: 'The Virgin Birth — Miracle or Metaphor?',
    slug: 'the-virgin-birth',
    tag: 'SIMILAR_DIFFERENT',
    summary:
      'Isaiah 7:14 is one of the most debated prophecies in the Hebrew Bible. The Hebrew word "almah" simply means "young woman" — the Septuagint (Greek OT) translated it as "parthenos" (virgin), and this translation is the basis for Matthew\'s claim that the virgin birth fulfills Isaiah\'s prophecy. Judaism reads Isaiah 7:14 as a prophecy for Ahaz\'s time — not a virgin birth, and not about a future Messiah. The Quran accepts the miraculous virgin birth of Jesus as historical fact — one of the clear signs (ayat) of God — but does not connect it to Isaiah\'s prophecy. The birth of Jesus from a virgin is simultaneously accepted by Islam, denied as Isaiah\'s prophecy by Judaism, and the specific term\'s meaning is disputed between Judaism and Christianity.',
    claimStatements: [
      'Isaiah prophesies that God Himself will give a sign: a young woman (almah) will conceive and bear a son called Immanuel ("God with us") — Christians read "almah" as "virgin" (parthenos in LXX) and apply this to the virgin birth of Jesus.',
      'The angel Gabriel is sent to Mary in Nazareth to announce that she will conceive a son through the Holy Spirit, who will be called the Son of God.',
      'The Quran commemorates God\'s transportation of Muhammad from the Sacred Mosque in Mecca to the Furthest Mosque (al-Masjid al-Aqsa) in Jerusalem — Islam\'s sacred connection to the Temple Mount, the third holiest site in Islam.',
    ],
  },
  {
    title: 'Elijah\'s Return — A Prophecy Applied Three Ways',
    slug: 'elijahs-return-prophecy',
    tag: 'SIMILAR_DIFFERENT',
    summary:
      'Malachi 4:5 — "I will send you Elijah the prophet before the great and dreadful day of the LORD" — is applied differently by each tradition. Judaism takes it literally: Elijah himself will return before the Messiah, announced at every Passover Seder with a cup set for him at the table. Christianity reads it as fulfilled by John the Baptist, who came "in the spirit and power of Elijah" (Luke 1:17) as the forerunner of Jesus. Islam honors Elijah (Ilyas) as a true prophet but does not develop a theology of Elijah\'s return; the return of Isa (Jesus) at the end of days partially parallels the Elijah role. The prophecy illustrates how the same verse generates radically different theological constructions.',
    claimStatements: [
      'Malachi prophesies that God will send Elijah the prophet before the coming of the great and dreadful day of the LORD — Judaism interprets this as Elijah returning before the Messiah; Christianity interprets it as fulfilled by John the Baptist.',
      'Peter quotes Moses\'s prophecy about the future prophet and applies it to Jesus — Jesus is the prophet-like-Moses whom Israel was commanded to obey, now raised from the dead and exalted to God\'s right hand.',
    ],
  },
  {
    title: 'Noah\'s Flood — Covenant, Baptism, or Judgment?',
    slug: 'noahs-flood-interpretations',
    tag: 'SIMILAR_DIFFERENT',
    summary:
      'All three traditions affirm the story of Noah and the great flood — a righteous man, a divine judgment, an ark, and a new beginning for humanity. But the theological weight each places on the narrative differs sharply. Judaism emphasises the Noahide covenant (7 universal commandments) established after the flood — the rainbow as sign of God\'s faithfulness to all humanity, not just Israel. Christianity reads the flood as prefiguring baptism — as Noah was "saved through water," so believers are saved through the waters of baptism. Islam focuses on Noah\'s prophetic mission — 950 years of preaching, the refusal of his people, and the flood as divine punishment; the drowning of Noah\'s own son despite his father\'s plea is a lesson about faith over kinship.',
    claimStatements: [
      'Noah is singled out as a righteous man, blameless in his generation, who walked with God — the same phrase used of Enoch, marking Noah as the one upright person in a generation consumed by violence and corruption.',
      'Peter uses the days of Noah and the ark as a type of Christian salvation through baptism — as eight people were saved through water, so baptism now saves believers through the resurrection of Jesus Christ.',
      'As the flood rises, Noah calls to his son to board the ark and not remain with the disbelievers — but his son refuses, saying a mountain will protect him, and he is drowned. The Quran uses this to illustrate that kinship cannot save those who reject faith.',
    ],
  },
  // ── Enoch / Idris — Taken to Heaven ──────────────────────────────────────
  {
    title: 'Taken to Heaven Without Dying — Enoch, Elijah, and Beyond',
    slug: 'taken-to-heaven-without-dying',
    tag: 'SIMILAR_DIFFERENT',
    summary:
      'The idea that certain righteous individuals were taken directly to heaven without experiencing death is shared across all three Abrahamic traditions, but the figures involved, the theological significance, and the literary traditions that developed around them differ enormously. The Torah\'s account of Enoch is a single cryptic verse (Gen 5:24), yet it generated one of the richest bodies of apocalyptic literature in antiquity — the Books of Enoch (1 Enoch, 2 Enoch, 3 Enoch), which describe heavenly tours, angelic hierarchies, and cosmic secrets. In some Jewish mystical traditions, Enoch is transformed into the archangel Metatron. The New Testament treats Enoch as a model of faith (Hebrews 11:5) and Jude quotes from 1 Enoch as prophecy. Islam identifies Enoch with the prophet Idris, who was "raised to a lofty station" (Quran 19:57) and encountered by Muhammad in the fourth heaven. The parallel with Elijah (taken by a chariot of fire) and Jesus (the Ascension) makes heavenly translation a recurring pattern in Abrahamic thought — though each tradition limits which figures qualify.',
    claimStatements: [
      'Enoch walked with God for 365 years, and then "was not, for God took him" — the Torah\'s terse account of the first human being taken to heaven without dying, a phrase that generated an enormous body of apocalyptic and mystical literature in all three traditions.',
      'The author of Hebrews lists Enoch among the heroes of faith: "By faith Enoch was translated that he should not see death" — his translation is presented as the reward for a life that pleased God, a prototype of the resurrection hope.',
      'The Quran describes Idris as a siddiq (man of truth) and a prophet whom God "raised to a lofty station" — Islamic tradition identifies Idris with the biblical Enoch, and places him in the fourth heaven where Muhammad met him during the Night Journey (Mi\'raj).',
    ],
  },
  {
    title: 'The Book of Enoch — Scripture, Pseudepigrapha, or Lost Tradition?',
    slug: 'book-of-enoch-status',
    tag: 'CONTRADICTION',
    summary:
      'The Book of Enoch (1 Enoch) is one of the most fascinating texts in Abrahamic history — a 2nd–1st century BCE Jewish apocalyptic work that was enormously influential in its time but whose canonical status diverges sharply across traditions. It describes Enoch\'s journey through the heavens, the fall of the Watchers (angels who mated with human women), the origin of demons, cosmic geography, and detailed prophecies of judgment. Mainstream Judaism excluded it from the Tanakh — though it profoundly influenced Jewish apocalypticism and mysticism. Early Christianity was split: Jude 1:14–15 quotes it as prophecy, and many early Church Fathers treated it as scripture, but it was ultimately excluded from most Christian canons. The Ethiopian Orthodox Church alone preserves 1 Enoch as canonical scripture to this day. Islam does not reference the Book of Enoch but honours Idris as a prophet of knowledge and writing — and Islamic commentators associate him with the transmission of heavenly wisdom, echoing Enochic themes.',
    claimStatements: [
      'Jude quotes directly from the Book of Enoch: "Enoch, the seventh from Adam, prophesied, saying, Behold, the Lord cometh with ten thousands of his saints" — the only New Testament citation of an apocryphal text attributed to Enoch, giving the Book of Enoch apostolic weight.',
      'Enoch walked with God for 365 years, and then "was not, for God took him" — the Torah\'s terse account of the first human being taken to heaven without dying, a phrase that generated an enormous body of apocalyptic and mystical literature in all three traditions.',
      'Idris is listed alongside Ishmael and Dhul-Kifl among "the patient" — prophets praised for constancy and perseverance — confirming his status as a major prophetic figure in the Quranic tradition.',
    ],
  },
]

export async function seedComparisons(prisma: PrismaClient) {
  const sources = await prisma.source.findMany()
  const sourceMap = new Map(sources.map((s) => [s.key, s.id]))

  const allClaims = await prisma.claim.findMany({ include: { source: true } })

  for (const comp of comparisonsData) {
    const comparison = await prisma.comparison.upsert({
      where: { slug: comp.slug },
      update: {},
      create: {
        title: comp.title,
        slug: comp.slug,
        tag: comp.tag,
        summary: comp.summary,
        isPublished: true,
      },
    })

    for (let i = 0; i < comp.claimStatements.length; i++) {
      const stmt = comp.claimStatements[i]
      // Find claim by matching statement text
      const claim = allClaims.find(
        (c) => c.statement.trim().toLowerCase() === stmt.trim().toLowerCase()
      )
      if (!claim) {
        console.warn(`  ⚠ Claim not found for comparison "${comp.title}": "${stmt.slice(0, 60)}..."`)
        continue
      }

      await prisma.comparisonClaim.upsert({
        where: {
          comparisonId_claimId: {
            comparisonId: comparison.id,
            claimId: claim.id,
          },
        },
        update: {},
        create: {
          comparisonId: comparison.id,
          claimId: claim.id,
          position: i,
        },
      })
    }
  }

  console.log(`✓ Comparisons seeded (${comparisonsData.length} comparisons)`)
}
