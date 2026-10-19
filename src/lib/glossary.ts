interface GlossaryEntry {
  term: string
  definition: string
  note?: string
  sources?: { label: string; href: string }[]
}

export interface GlossarySection {
  title: string
  entries: GlossaryEntry[]
}

export const GLOSSARY: GlossarySection[] = [
  {
    title: 'Concept categories',
    entries: [
      {
        term: 'Theology',
        definition: 'The study of the nature of God — who or what God is, His attributes, and His relationship to creation.',
        note: 'Includes doctrines of monotheism, the Trinity (Christianity), Tawhid (Islam), and Ein Sof (Judaism).',
      },
      {
        term: 'Soteriology',
        definition: 'The branch of theology dealing with salvation — how human beings are saved, redeemed, or liberated from sin, death, or spiritual peril.',
        note: 'Understandings of salvation vary within as well as between traditions. Consult the attributed source discussions rather than treating one formula as universal.',
      },
      {
        term: 'Eschatology',
        definition: 'Beliefs about the "last things" — the end of history, resurrection, final judgement, heaven, hell, and the World to Come.',
      },
      {
        term: 'Prophethood',
        definition: 'The theology of prophets — their role, authority, nature, and how prophecy functions as communication from God to humanity.',
        note: 'Islam treats prophethood as a formal institution ending with Muhammad. Judaism and Christianity have different understandings of who qualifies as a prophet and whether prophecy has ceased.',
      },
      {
        term: 'Cosmology',
        definition: 'Beliefs about the origin, structure, and ultimate fate of the universe — including creation accounts and the nature of time.',
      },
      {
        term: 'Law & Covenant',
        definition: 'The relationship between God and humanity expressed through binding agreements (covenants) and legal/ethical codes.',
        note: 'The Torah\'s 613 commandments, the New Covenant in Christ, and Sharia all represent distinct understandings of divine law.',
      },
      {
        term: 'Practice',
        definition: 'Religious observances, rituals, and devotional acts — prayer, fasting, pilgrimage, worship, and other embodied forms of piety.',
      },
    ],
  },
  {
    title: 'Timeline presence states',
    entries: [
      {
        term: 'Affirmed',
        definition: 'A project timeline label indicating that the selected tradition’s account includes this event. It describes that account, not independent historical verification.',
      },
      {
        term: 'Modified',
        definition: 'The tradition records this event but with significant differences in narrative detail, theological interpretation, or key participants.',
        note: 'Genesis 22 names Isaac. The sacrifice scene in Quran 37:102–107 does not name the son; identifying him belongs to interpretation.',
        sources: [{ label: 'Genesis 22', href: 'https://bible.usccb.org/bible/genesis/22' }, { label: 'Quran 37:102–107', href: 'https://quran.com/37/102-107' }],
      },
      {
        term: 'Silent',
        definition: 'The tradition\'s scriptures do not mention this event — not necessarily because it is rejected, but because it falls outside the textual record.',
      },
      {
        term: 'Rejected',
        definition: 'The tradition explicitly contradicts or denies this event.',
        note: 'For example, Islam holds that Jesus was not crucified (Quran 4:157), while this is foundational to Christian theology.',
      },
    ],
  },
  {
    title: 'Scripture & tradition',
    entries: [
      {
        term: 'Torah',
        definition: 'The five books of Moses (Genesis, Exodus, Leviticus, Numbers, Deuteronomy) — the foundational text of Judaism, also called the Pentateuch.',
      },
      {
        term: 'Hebrew Bible',
        definition: 'The full canon of Jewish scripture (Tanakh), comprising Torah (Law), Nevi\'im (Prophets), and Ketuvim (Writings). Overlaps with the Christian Old Testament but in different ordering and, for some traditions, with different books.',
      },
      {
        term: 'New Testament',
        definition: 'The second part of the Christian Bible, consisting of the Gospels, Acts, Epistles, and Revelation — describing the life of Jesus and the early Church.',
      },
      {
        term: 'Quran',
        definition: 'The central scripture of Islam, understood by Muslims to be the direct word of God as revealed to the Prophet Muhammad over 23 years. Consists of 114 suras (chapters).',
      },
      {
        term: 'Hadith',
        definition: 'Recorded sayings and actions of the Prophet Muhammad, used alongside the Quran as a source of Islamic law and practice. Not scripture in the strict sense but authoritative in Islamic jurisprudence.',
      },
      {
        term: 'Talmud',
        definition: 'The central text of Rabbinic Judaism, consisting of the Mishnah (oral law) and Gemara (rabbinical discussion). A primary source of Jewish law and theology.',
      },
    ],
  },
  {
    title: 'Interpretive terms',
    entries: [
      {
        term: 'Hermeneutics',
        definition: 'The theory and methodology of interpretation, especially of scripture. Different traditions and denominations apply different hermeneutical principles.',
        note: 'E.g. literal vs allegorical, historical-critical vs traditional, peshat vs derash in Jewish exegesis.',
      },
      {
        term: 'Exegesis',
        definition: 'Critical explanation or interpretation of a text, especially scripture. Contrasted with eisegesis (reading one\'s own ideas into a text).',
      },
      {
        term: 'Typology',
        definition: 'A mode of Christian biblical interpretation in which Old Testament figures and events are seen as prefiguring (or "types" of) New Testament events. E.g. Isaac as a type of Christ.',
      },
      {
        term: 'Tafsir',
        definition: 'The genre of Quranic commentary and exegesis in Islamic scholarship — ranging from classical to contemporary.',
      },
      {
        term: 'Midrash',
        definition: 'A form of Jewish biblical interpretation that explores the meaning behind the biblical text, often through narrative expansion, allegory, and legal analysis.',
      },
    ],
  },
  {
    title: 'Cross-reference link types',
    entries: [
      {
        term: 'Parallel',
        definition: 'Two passages from different sources that describe the same event, figure, or teaching — making them directly comparable.',
      },
      {
        term: 'Contrast',
        definition: 'Two passages that address the same topic but reach opposing conclusions or describe incompatible events.',
      },
      {
        term: 'Elaboration',
        definition: 'One passage expands upon, adds detail to, or contextualises another — typically across traditions.',
      },
      {
        term: 'Fulfillment claim',
        definition: 'One tradition claims that a passage in an earlier scripture is "fulfilled" or completed by a later event or teaching. This is a claim made within that tradition, not an editorial judgment.',
        note: 'E.g. Christian claims that Isaiah 53 is fulfilled by Jesus; Islamic claims that certain biblical passages prophesy Muhammad.',
      },
    ],
  },
  {
    title: 'Key theological concepts',
    entries: [
      {
        term: 'Shema',
        definition: 'The central Jewish declaration of faith: "Hear O Israel, the LORD is our God, the LORD is One" (Deuteronomy 6:4). The cornerstone of Jewish monotheism.',
      },
      {
        term: 'Trinity',
        definition: 'The Nicene Christian doctrine that God exists as three persons — Father, Son, and Holy Spirit — who are co-equal and co-eternal, yet one God.',
        note: 'This describes Nicene Christianity. It is not a statement that every community identifying as Christian uses the same formulation.',
      },
      {
        term: 'Tawhid',
        definition: 'The Islamic concept of the absolute oneness of God — indivisible, without partner, son, or equal. The foundational principle of Islamic theology.',
      },
      {
        term: 'Covenant (Brit)',
        definition: 'A binding agreement between God and a people or individual. The Abrahamic covenant, Mosaic covenant, and Davidic covenant are central to Jewish theology. Christianity speaks of a "New Covenant" in Jesus.',
      },
      {
        term: 'Messiah / Mashiach',
        definition: 'Hebrew for "anointed one." Jewish, Christian, and Islamic traditions develop distinct accounts of messiahship. Christianity identifies Jesus as the Messiah; Quran 3:45 also calls Jesus (Isa) al-Masih. The shared title does not imply agreement about his nature or role.',
        sources: [{ label: 'Quran 3:45', href: 'https://quran.com/3/45' }],
      },
      {
        term: 'Original Sin',
        definition: 'A term used in Christian traditions for humanity’s condition in relation to Adam’s disobedience. Traditions differ in how they describe inherited sin, guilt, and its consequences.',
        note: 'Compare the specifically Catholic explanation with the Orthodox discussion; neither should be presented as the single formulation of every Christian community.',
        sources: [{ label: 'Catholic Catechism: original sin', href: 'https://www.vatican.va/archive/ENG0015/__P1C.HTM' }, { label: 'Orthodox Church in America: original sin', href: 'https://www.oca.org/questions/teaching/original-sin' }],
      },
      {
        term: 'Prophethood (Nubuwwah)',
        definition: 'In Islam, a formalised institution of prophets sent by God throughout history, culminating in Muhammad as the "Seal of the Prophets." Judaism and Christianity have different understandings of prophetic authority and succession.',
      },
    ],
  },
]


export const termAnchor = (term: string) => term.toLowerCase().replace(/\s+/g, '-')
