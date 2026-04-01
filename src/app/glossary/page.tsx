import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Glossary' }

interface GlossaryEntry {
  term: string
  definition: string
  note?: string
}

interface GlossarySection {
  title: string
  entries: GlossaryEntry[]
}

const GLOSSARY: GlossarySection[] = [
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
        note: 'Each Abrahamic tradition has a distinct soteriology: grace/faith (Christianity), Torah observance and repentance (Judaism), submission to God and righteous deeds (Islam).',
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
        definition: 'The tradition explicitly records and accepts this event as historical, substantially as described.',
      },
      {
        term: 'Modified',
        definition: 'The tradition records this event but with significant differences in narrative detail, theological interpretation, or key participants.',
        note: 'For example, the Quran affirms the story of Abraham\'s sacrifice but identifies the son as Ishmael rather than Isaac.',
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
        definition: 'The Christian doctrine that God exists as three persons — Father, Son, and Holy Spirit — who are co-equal and co-eternal, yet one God.',
        note: 'Rejected by both Judaism and Islam as incompatible with strict monotheism.',
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
        definition: 'Hebrew for "anointed one." In Judaism, a future king who will restore Israel and bring universal peace. Christianity identifies Jesus as the Messiah; Islam venerates Jesus (Isa) as a prophet but not as a messianic saviour in the Jewish sense.',
      },
      {
        term: 'Original Sin',
        definition: 'The Christian doctrine that Adam and Eve\'s disobedience in Eden brought a state of sinfulness inherited by all humanity, requiring redemption.',
        note: 'Judaism and Islam reject original sin. Islam holds that Adam repented and was forgiven; humans are born innocent.',
      },
      {
        term: 'Prophethood (Nubuwwah)',
        definition: 'In Islam, a formalised institution of prophets sent by God throughout history, culminating in Muhammad as the "Seal of the Prophets." Judaism and Christianity have different understandings of prophetic authority and succession.',
      },
    ],
  },
]

export default function GlossaryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-stone-900">Glossary</h1>
      <p className="mb-10 text-stone-500 leading-relaxed">
        Definitions of terms used across this platform — concept categories, timeline presence states,
        interpretive vocabulary, and key theological concepts.
      </p>

      <div className="space-y-12">
        {GLOSSARY.map((section) => (
          <section key={section.title}>
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-stone-400 border-b border-stone-100 pb-2">
              {section.title}
            </h2>
            <dl className="space-y-6">
              {section.entries.map((entry) => (
                <div key={entry.term} id={entry.term.toLowerCase().replace(/\s+/g, '-')}>
                  <dt className="text-base font-semibold text-stone-900">{entry.term}</dt>
                  <dd className="mt-1 text-sm text-stone-600 leading-relaxed">{entry.definition}</dd>
                  {entry.note && (
                    <p className="mt-1.5 text-xs text-stone-400 italic leading-relaxed">
                      Note: {entry.note}
                    </p>
                  )}
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <div className="mt-14 rounded-lg border border-stone-100 bg-stone-50 p-5">
        <p className="text-sm font-medium text-stone-700">Want to explore these concepts?</p>
        <p className="mt-1 text-sm text-stone-500">
          Browse the{' '}
          <Link href="/concepts" className="underline underline-offset-2 hover:text-stone-700">
            Concepts section
          </Link>{' '}
          for in-depth per-tradition definitions, or view the{' '}
          <Link href="/timeline" className="underline underline-offset-2 hover:text-stone-700">
            Timeline
          </Link>{' '}
          to see how key events are treated across traditions.
        </p>
      </div>
    </div>
  )
}
