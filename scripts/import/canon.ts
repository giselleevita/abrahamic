/**
 * Canonical verse counts.
 *
 * An import is not "done" because it exited zero — the upstream service
 * rate-limits, and a run can lose whole chapters while reporting no errors. The
 * only way to know a book is complete is to compare against a known total, so
 * those totals live here as data rather than in someone's memory.
 *
 * Counts follow the Masoretic verse divisions for the Hebrew Bible and the
 * standard divisions for the New Testament. Different traditions divide some
 * verses differently; where a source uses another division these numbers are
 * the wrong yardstick and should be adjusted per source rather than fudged.
 */

export interface CanonBook {
  book: string
  bookNumber: number
  chapters: number
  /**
   * Canonical verse total, where it has been verified.
   *
   * Optional on purpose. Chapter counts are easy to state accurately; verse
   * totals for sixty-odd books are not, and a wrong total makes the
   * completeness check lie in both directions — reporting phantom gaps, or
   * declaring a short book complete. Where this is absent the check falls back
   * to chapter coverage, which still catches the failure that actually happens:
   * whole chapters lost to rate limits.
   */
  verses?: number
  /**
   * Verses counted in the canonical total that a critical text legitimately
   * omits, as `chapter:verse`.
   *
   * These are textual variants, not import failures. Recording them keeps the
   * completeness check honest: without this it reports a permanent shortfall,
   * and a check that always fails is one nobody reads.
   */
  knownOmissions?: string[]
  /**
   * The chapter numbers this book actually stores, when they are not 1..chapters.
   *
   * A surah is one "book" whose stored chapter value is its surah number, so
   * Al-Masad holds chapter 111, not chapter 1. Without this the coverage check
   * looks for chapter 1 and reports every surah as missing it.
   */
  chapterNumbers?: number[]
  /**
   * Verse count for a single-chapter book.
   *
   * These need special handling upstream: for a one-chapter book,
   * "Philemon 1" is read as *verse* 1, not chapter 1, so a plain chapter
   * request returns a single verse and the book looks complete because its one
   * chapter exists. An explicit range is required, and the range must be within
   * bounds — "1:1-200" returns 404 rather than clamping.
   */
  singleChapterVerses?: number
}

export const TORAH_CANON: CanonBook[] = [
  { book: 'Genesis',     bookNumber: 1, chapters: 50, verses: 1533 },
  { book: 'Exodus',      bookNumber: 2, chapters: 40, verses: 1213 },
  { book: 'Leviticus',   bookNumber: 3, chapters: 27, verses: 859 },
  { book: 'Numbers',     bookNumber: 4, chapters: 36, verses: 1288 },
  { book: 'Deuteronomy', bookNumber: 5, chapters: 34, verses: 959 },
]

export const GOSPEL_CANON: CanonBook[] = [
  { book: 'Matthew', bookNumber: 40, chapters: 28, verses: 1071 },
  { book: 'Mark',    bookNumber: 41, chapters: 16, verses: 678 },
  {
    book: 'Luke', bookNumber: 42, chapters: 24, verses: 1151,
    // Present in the Textus Receptus and the KJV, absent from the critical
    // texts most modern translations follow. The World English Bible emits the
    // verse number with empty text, which the importer skips.
    knownOmissions: ['17:36'],
  },
  { book: 'John',    bookNumber: 43, chapters: 21, verses: 879 },
]


/**
 * The 114 surahs, with their ayah counts.
 *
 * `chapters: 1` because a surah *is* the unit — the importer fetches a whole
 * surah per request, unlike a biblical book which is fetched chapter by
 * chapter. `bookNumber` is the surah number and is the real identity here.
 *
 * Names are pinned rather than taken from the upstream API, because the API's
 * transliteration differs from the one already in this database for 11 of the
 * 14 surahs that were seeded — "Al-Baqara" against "Al-Baqarah",
 * "Aal-i-Imraan" against "Al-Imran". Importing on API names would have created
 * duplicate books and orphaned the claims and verse links pointing at the
 * seeded verses. Where a name was already in use it is kept verbatim; the rest
 * follow the same transliteration style. Checked for collisions: there are none.
 */
export const QURAN_CANON: CanonBook[] = [
  { book: "Al-Fatihah", bookNumber: 1, chapters: 1, verses: 7, chapterNumbers: [1] },  // name already in use by seeded verses
  { book: "Al-Baqarah", bookNumber: 2, chapters: 1, verses: 286, chapterNumbers: [2] },  // name already in use by seeded verses
  { book: "Al-Imran", bookNumber: 3, chapters: 1, verses: 200, chapterNumbers: [3] },  // name already in use by seeded verses
  { book: "An-Nisa", bookNumber: 4, chapters: 1, verses: 176, chapterNumbers: [4] },  // name already in use by seeded verses
  { book: "Al-Maidah", bookNumber: 5, chapters: 1, verses: 120, chapterNumbers: [5] },  // name already in use by seeded verses
  { book: "Al-Anam", bookNumber: 6, chapters: 1, verses: 165, chapterNumbers: [6] },
  { book: "Al-Araf", bookNumber: 7, chapters: 1, verses: 206, chapterNumbers: [7] },
  { book: "Al-Anfal", bookNumber: 8, chapters: 1, verses: 75, chapterNumbers: [8] },
  { book: "At-Tawbah", bookNumber: 9, chapters: 1, verses: 129, chapterNumbers: [9] },  // name already in use by seeded verses
  { book: "Yunus", bookNumber: 10, chapters: 1, verses: 109, chapterNumbers: [10] },
  { book: "Hud", bookNumber: 11, chapters: 1, verses: 123, chapterNumbers: [11] },  // name already in use by seeded verses
  { book: "Yusuf", bookNumber: 12, chapters: 1, verses: 111, chapterNumbers: [12] },
  { book: "Ar-Rad", bookNumber: 13, chapters: 1, verses: 43, chapterNumbers: [13] },
  { book: "Ibrahim", bookNumber: 14, chapters: 1, verses: 52, chapterNumbers: [14] },
  { book: "Al-Hijr", bookNumber: 15, chapters: 1, verses: 99, chapterNumbers: [15] },
  { book: "An-Nahl", bookNumber: 16, chapters: 1, verses: 128, chapterNumbers: [16] },  // name already in use by seeded verses
  { book: "Al-Isra", bookNumber: 17, chapters: 1, verses: 111, chapterNumbers: [17] },  // name already in use by seeded verses
  { book: "Al-Kahf", bookNumber: 18, chapters: 1, verses: 110, chapterNumbers: [18] },
  { book: "Maryam", bookNumber: 19, chapters: 1, verses: 98, chapterNumbers: [19] },  // name already in use by seeded verses
  { book: "Ta-Ha", bookNumber: 20, chapters: 1, verses: 135, chapterNumbers: [20] },
  { book: "Al-Anbiya", bookNumber: 21, chapters: 1, verses: 112, chapterNumbers: [21] },  // name already in use by seeded verses
  { book: "Al-Hajj", bookNumber: 22, chapters: 1, verses: 78, chapterNumbers: [22] },
  { book: "Al-Muminon", bookNumber: 23, chapters: 1, verses: 118, chapterNumbers: [23] },
  { book: "An-Nor", bookNumber: 24, chapters: 1, verses: 64, chapterNumbers: [24] },
  { book: "Al-Furqan", bookNumber: 25, chapters: 1, verses: 77, chapterNumbers: [25] },
  { book: "Ash-Shuara", bookNumber: 26, chapters: 1, verses: 227, chapterNumbers: [26] },
  { book: "An-Naml", bookNumber: 27, chapters: 1, verses: 93, chapterNumbers: [27] },
  { book: "Al-Qasas", bookNumber: 28, chapters: 1, verses: 88, chapterNumbers: [28] },
  { book: "Al-Ankabot", bookNumber: 29, chapters: 1, verses: 69, chapterNumbers: [29] },
  { book: "Ar-Rom", bookNumber: 30, chapters: 1, verses: 60, chapterNumbers: [30] },
  { book: "Luqman", bookNumber: 31, chapters: 1, verses: 34, chapterNumbers: [31] },
  { book: "As-Sajda", bookNumber: 32, chapters: 1, verses: 30, chapterNumbers: [32] },
  { book: "Al-Ahzab", bookNumber: 33, chapters: 1, verses: 73, chapterNumbers: [33] },  // name already in use by seeded verses
  { book: "Saba", bookNumber: 34, chapters: 1, verses: 54, chapterNumbers: [34] },
  { book: "Fatir", bookNumber: 35, chapters: 1, verses: 45, chapterNumbers: [35] },
  { book: "Yasen", bookNumber: 36, chapters: 1, verses: 83, chapterNumbers: [36] },
  { book: "As-Saffat", bookNumber: 37, chapters: 1, verses: 182, chapterNumbers: [37] },
  { book: "Sad", bookNumber: 38, chapters: 1, verses: 88, chapterNumbers: [38] },
  { book: "Az-Zumar", bookNumber: 39, chapters: 1, verses: 75, chapterNumbers: [39] },
  { book: "Ghafir", bookNumber: 40, chapters: 1, verses: 85, chapterNumbers: [40] },
  { book: "Fussilat", bookNumber: 41, chapters: 1, verses: 54, chapterNumbers: [41] },
  { book: "Ash-Shura", bookNumber: 42, chapters: 1, verses: 53, chapterNumbers: [42] },
  { book: "Az-Zukhruf", bookNumber: 43, chapters: 1, verses: 89, chapterNumbers: [43] },
  { book: "Ad-Dukhan", bookNumber: 44, chapters: 1, verses: 59, chapterNumbers: [44] },
  { book: "Al-Jathiya", bookNumber: 45, chapters: 1, verses: 37, chapterNumbers: [45] },
  { book: "Al-Ahqaf", bookNumber: 46, chapters: 1, verses: 35, chapterNumbers: [46] },
  { book: "Muhammad", bookNumber: 47, chapters: 1, verses: 38, chapterNumbers: [47] },
  { book: "Al-Fath", bookNumber: 48, chapters: 1, verses: 29, chapterNumbers: [48] },
  { book: "Al-Hujurat", bookNumber: 49, chapters: 1, verses: 18, chapterNumbers: [49] },
  { book: "Qaf", bookNumber: 50, chapters: 1, verses: 45, chapterNumbers: [50] },
  { book: "Adh-Dhariyat", bookNumber: 51, chapters: 1, verses: 60, chapterNumbers: [51] },
  { book: "At-Tur", bookNumber: 52, chapters: 1, verses: 49, chapterNumbers: [52] },
  { book: "An-Najm", bookNumber: 53, chapters: 1, verses: 62, chapterNumbers: [53] },
  { book: "Al-Qamar", bookNumber: 54, chapters: 1, verses: 55, chapterNumbers: [54] },
  { book: "Ar-Rahman", bookNumber: 55, chapters: 1, verses: 78, chapterNumbers: [55] },
  { book: "Al-Waqia", bookNumber: 56, chapters: 1, verses: 96, chapterNumbers: [56] },
  { book: "Al-Hadid", bookNumber: 57, chapters: 1, verses: 29, chapterNumbers: [57] },
  { book: "Al-Mujadila", bookNumber: 58, chapters: 1, verses: 22, chapterNumbers: [58] },
  { book: "Al-Hashr", bookNumber: 59, chapters: 1, verses: 24, chapterNumbers: [59] },
  { book: "Al-Mumtahana", bookNumber: 60, chapters: 1, verses: 13, chapterNumbers: [60] },
  { book: "As-Saff", bookNumber: 61, chapters: 1, verses: 14, chapterNumbers: [61] },
  { book: "Al-Jumua", bookNumber: 62, chapters: 1, verses: 11, chapterNumbers: [62] },  // name already in use by seeded verses
  { book: "Al-Munafiqon", bookNumber: 63, chapters: 1, verses: 11, chapterNumbers: [63] },
  { book: "At-Taghabun", bookNumber: 64, chapters: 1, verses: 18, chapterNumbers: [64] },
  { book: "At-Talaq", bookNumber: 65, chapters: 1, verses: 12, chapterNumbers: [65] },
  { book: "At-Tahrim", bookNumber: 66, chapters: 1, verses: 12, chapterNumbers: [66] },
  { book: "Al-Mulk", bookNumber: 67, chapters: 1, verses: 30, chapterNumbers: [67] },
  { book: "Al-Qalam", bookNumber: 68, chapters: 1, verses: 52, chapterNumbers: [68] },
  { book: "Al-Haqqa", bookNumber: 69, chapters: 1, verses: 52, chapterNumbers: [69] },
  { book: "Al-Marij", bookNumber: 70, chapters: 1, verses: 44, chapterNumbers: [70] },
  { book: "Noh", bookNumber: 71, chapters: 1, verses: 28, chapterNumbers: [71] },
  { book: "Al-Jinn", bookNumber: 72, chapters: 1, verses: 28, chapterNumbers: [72] },
  { book: "Al-Muzzammil", bookNumber: 73, chapters: 1, verses: 20, chapterNumbers: [73] },
  { book: "Al-Muddaththir", bookNumber: 74, chapters: 1, verses: 56, chapterNumbers: [74] },
  { book: "Al-Qiyama", bookNumber: 75, chapters: 1, verses: 40, chapterNumbers: [75] },
  { book: "Al-Insan", bookNumber: 76, chapters: 1, verses: 31, chapterNumbers: [76] },
  { book: "Al-Mursalat", bookNumber: 77, chapters: 1, verses: 50, chapterNumbers: [77] },
  { book: "An-Naba", bookNumber: 78, chapters: 1, verses: 40, chapterNumbers: [78] },
  { book: "An-Naziat", bookNumber: 79, chapters: 1, verses: 46, chapterNumbers: [79] },
  { book: "Abasa", bookNumber: 80, chapters: 1, verses: 42, chapterNumbers: [80] },
  { book: "At-Takwir", bookNumber: 81, chapters: 1, verses: 29, chapterNumbers: [81] },
  { book: "Al-Infitar", bookNumber: 82, chapters: 1, verses: 19, chapterNumbers: [82] },
  { book: "Al-Mutaffifin", bookNumber: 83, chapters: 1, verses: 36, chapterNumbers: [83] },
  { book: "Al-Inshiqaq", bookNumber: 84, chapters: 1, verses: 25, chapterNumbers: [84] },
  { book: "Al-Buroj", bookNumber: 85, chapters: 1, verses: 22, chapterNumbers: [85] },
  { book: "At-Tariq", bookNumber: 86, chapters: 1, verses: 17, chapterNumbers: [86] },
  { book: "Al-Ala", bookNumber: 87, chapters: 1, verses: 19, chapterNumbers: [87] },
  { book: "Al-Ghashiya", bookNumber: 88, chapters: 1, verses: 26, chapterNumbers: [88] },
  { book: "Al-Fajr", bookNumber: 89, chapters: 1, verses: 30, chapterNumbers: [89] },
  { book: "Al-Balad", bookNumber: 90, chapters: 1, verses: 20, chapterNumbers: [90] },
  { book: "Ash-Shams", bookNumber: 91, chapters: 1, verses: 15, chapterNumbers: [91] },
  { book: "Al-Lail", bookNumber: 92, chapters: 1, verses: 21, chapterNumbers: [92] },
  { book: "Ad-Dhuha", bookNumber: 93, chapters: 1, verses: 11, chapterNumbers: [93] },
  { book: "Ash-Sharh", bookNumber: 94, chapters: 1, verses: 8, chapterNumbers: [94] },
  { book: "At-Tin", bookNumber: 95, chapters: 1, verses: 8, chapterNumbers: [95] },
  { book: "Al-Alaq", bookNumber: 96, chapters: 1, verses: 19, chapterNumbers: [96] },
  { book: "Al-Qadr", bookNumber: 97, chapters: 1, verses: 5, chapterNumbers: [97] },
  { book: "Al-Bayyina", bookNumber: 98, chapters: 1, verses: 8, chapterNumbers: [98] },
  { book: "Az-Zalzala", bookNumber: 99, chapters: 1, verses: 8, chapterNumbers: [99] },
  { book: "Al-Aadiyat", bookNumber: 100, chapters: 1, verses: 11, chapterNumbers: [100] },
  { book: "Al-Qaria", bookNumber: 101, chapters: 1, verses: 11, chapterNumbers: [101] },
  { book: "At-Takathur", bookNumber: 102, chapters: 1, verses: 8, chapterNumbers: [102] },
  { book: "Al-Asr", bookNumber: 103, chapters: 1, verses: 3, chapterNumbers: [103] },
  { book: "Al-Humaza", bookNumber: 104, chapters: 1, verses: 9, chapterNumbers: [104] },
  { book: "Al-Fil", bookNumber: 105, chapters: 1, verses: 5, chapterNumbers: [105] },
  { book: "Quraish", bookNumber: 106, chapters: 1, verses: 4, chapterNumbers: [106] },
  { book: "Al-Maun", bookNumber: 107, chapters: 1, verses: 7, chapterNumbers: [107] },
  { book: "Al-Kawthar", bookNumber: 108, chapters: 1, verses: 3, chapterNumbers: [108] },
  { book: "Al-Kafiron", bookNumber: 109, chapters: 1, verses: 6, chapterNumbers: [109] },
  { book: "An-Nasr", bookNumber: 110, chapters: 1, verses: 3, chapterNumbers: [110] },
  { book: "Al-Masad", bookNumber: 111, chapters: 1, verses: 5, chapterNumbers: [111] },
  { book: "Al-Ikhlas", bookNumber: 112, chapters: 1, verses: 4, chapterNumbers: [112] },  // name already in use by seeded verses
  { book: "Al-Falaq", bookNumber: 113, chapters: 1, verses: 5, chapterNumbers: [113] },
  { book: "An-Nas", bookNumber: 114, chapters: 1, verses: 6, chapterNumbers: [114] },
]

export const QURAN_TOTAL = QURAN_CANON.reduce((n, s) => n + (s.verses ?? 0), 0)


/**
 * Nevi'im and Ketuvim — the Hebrew Bible beyond the Torah.
 *
 * Verse totals are deliberately absent: chapter counts are easy to state
 * accurately, per-book verse totals for thirty-four books are not, and a wrong
 * total makes the completeness check lie. Chapter coverage still catches the
 * failure that actually happens, which is whole chapters lost to rate limits.
 * Fill in `verses` per book once a complete import has been measured.
 */
export const NEVIIM_KETUVIM_CANON: CanonBook[] = [
  { book: "Joshua", bookNumber: 6, chapters: 24 },
  { book: "Judges", bookNumber: 7, chapters: 21 },
  { book: "Ruth", bookNumber: 8, chapters: 4 },
  { book: "1 Samuel", bookNumber: 9, chapters: 31 },
  { book: "2 Samuel", bookNumber: 10, chapters: 24 },
  { book: "1 Kings", bookNumber: 11, chapters: 22 },
  { book: "2 Kings", bookNumber: 12, chapters: 25 },
  { book: "1 Chronicles", bookNumber: 13, chapters: 29 },
  { book: "2 Chronicles", bookNumber: 14, chapters: 36 },
  { book: "Ezra", bookNumber: 15, chapters: 10 },
  { book: "Nehemiah", bookNumber: 16, chapters: 13 },
  { book: "Esther", bookNumber: 17, chapters: 10 },
  { book: "Job", bookNumber: 18, chapters: 42 },
  { book: "Psalms", bookNumber: 19, chapters: 150 },
  { book: "Proverbs", bookNumber: 20, chapters: 31 },
  { book: "Ecclesiastes", bookNumber: 21, chapters: 12 },
  { book: "Song of Solomon", bookNumber: 22, chapters: 8 },
  { book: "Isaiah", bookNumber: 23, chapters: 66 },
  { book: "Jeremiah", bookNumber: 24, chapters: 52 },
  { book: "Lamentations", bookNumber: 25, chapters: 5 },
  { book: "Ezekiel", bookNumber: 26, chapters: 48 },
  { book: "Daniel", bookNumber: 27, chapters: 12 },
  { book: "Hosea", bookNumber: 28, chapters: 14 },
  { book: "Joel", bookNumber: 29, chapters: 3 },
  { book: "Amos", bookNumber: 30, chapters: 9 },
  { singleChapterVerses: 21, book: "Obadiah", bookNumber: 31, chapters: 1 },
  { book: "Jonah", bookNumber: 32, chapters: 4 },
  { book: "Micah", bookNumber: 33, chapters: 7 },
  { book: "Nahum", bookNumber: 34, chapters: 3 },
  { book: "Habakkuk", bookNumber: 35, chapters: 3 },
  { book: "Zephaniah", bookNumber: 36, chapters: 3 },
  { book: "Haggai", bookNumber: 37, chapters: 2 },
  { book: "Zechariah", bookNumber: 38, chapters: 14 },
  { book: "Malachi", bookNumber: 39, chapters: 4 },
]

/** Acts through Revelation. Same reasoning on verse totals as above. */
export const REST_OF_NT_CANON: CanonBook[] = [
  { book: "Acts", bookNumber: 44, chapters: 28 },
  { book: "Romans", bookNumber: 45, chapters: 16 },
  { book: "1 Corinthians", bookNumber: 46, chapters: 16 },
  { book: "2 Corinthians", bookNumber: 47, chapters: 13 },
  { book: "Galatians", bookNumber: 48, chapters: 6 },
  { book: "Ephesians", bookNumber: 49, chapters: 6 },
  { book: "Philippians", bookNumber: 50, chapters: 4 },
  { book: "Colossians", bookNumber: 51, chapters: 4 },
  { book: "1 Thessalonians", bookNumber: 52, chapters: 5 },
  { book: "2 Thessalonians", bookNumber: 53, chapters: 3 },
  { book: "1 Timothy", bookNumber: 54, chapters: 6 },
  { book: "2 Timothy", bookNumber: 55, chapters: 4 },
  { book: "Titus", bookNumber: 56, chapters: 3 },
  { singleChapterVerses: 25, book: "Philemon", bookNumber: 57, chapters: 1 },
  { book: "Hebrews", bookNumber: 58, chapters: 13 },
  { book: "James", bookNumber: 59, chapters: 5 },
  { book: "1 Peter", bookNumber: 60, chapters: 5 },
  { book: "2 Peter", bookNumber: 61, chapters: 3 },
  { book: "1 John", bookNumber: 62, chapters: 5 },
  { singleChapterVerses: 13, book: "2 John", bookNumber: 63, chapters: 1 },
  { singleChapterVerses: 14, book: "3 John", bookNumber: 64, chapters: 1 },
  { singleChapterVerses: 25, book: "Jude", bookNumber: 65, chapters: 1 },
  { book: "Revelation", bookNumber: 66, chapters: 22 },
]

export const CANON_BY_SOURCE: Record<string, CanonBook[]> = {
  TORAH: TORAH_CANON,
  NEW_TESTAMENT: [...GOSPEL_CANON, ...REST_OF_NT_CANON],
  HEBREW_BIBLE: NEVIIM_KETUVIM_CANON,
  QURAN: QURAN_CANON,
}

export const TORAH_TOTAL = TORAH_CANON.reduce((n, b) => n + (b.verses ?? 0), 0)
export const GOSPEL_TOTAL = GOSPEL_CANON.reduce((n, b) => n + (b.verses ?? 0), 0)
