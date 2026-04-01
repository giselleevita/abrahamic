import type { PrismaClient } from '@prisma/client'

type VerseData = {
  sourceKey: 'TORAH' | 'HEBREW_BIBLE' | 'NEW_TESTAMENT' | 'QURAN'
  book: string
  bookNumber: number
  chapter: number
  verse: number
  translations: { label: 'ORIGINAL' | 'CLASSIC' | 'MODERN'; name: string; text: string; isDefault?: boolean }[]
}

const versesData: VerseData[] = [
  // ── Torah / Genesis ──────────────────────────────────────────────────────
  {
    sourceKey: 'TORAH', book: 'Genesis', bookNumber: 1, chapter: 1, verse: 1,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ' },
      { label: 'CLASSIC', name: 'JPS 1917', text: 'In the beginning God created the heaven and the earth.', isDefault: true },
      { label: 'MODERN', name: 'JPS 1985', text: 'When God began to create heaven and earth—' },
    ],
  },
  {
    sourceKey: 'TORAH', book: 'Genesis', bookNumber: 1, chapter: 12, verse: 1,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'וַיֹּאמֶר יְהוָה אֶל-אַבְרָם לֶךְ-לְךָ מֵאַרְצְךָ' },
      { label: 'CLASSIC', name: 'JPS 1917', text: 'Now the LORD said unto Abram: Get thee out of thy country, and from thy kindred, and from thy father\'s house, unto the land that I will show thee.', isDefault: true },
      { label: 'MODERN', name: 'JPS 1985', text: 'The LORD said to Abram, "Go forth from your native land and from your father\'s house to the land that I will show you."' },
    ],
  },
  {
    sourceKey: 'TORAH', book: 'Genesis', bookNumber: 1, chapter: 17, verse: 7,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'וַהֲקִמֹתִי אֶת-בְּרִיתִי בֵּינִי וּבֵינֶךָ וּבֵין זַרְעֲךָ אַחֲרֶיךָ' },
      { label: 'CLASSIC', name: 'JPS 1917', text: 'And I will establish My covenant between Me and thee and thy seed after thee throughout their generations for an everlasting covenant, to be a God unto thee and to thy seed after thee.', isDefault: true },
      { label: 'MODERN', name: 'JPS 1985', text: 'I will maintain My covenant between Me and you, and your offspring to come, as an everlasting covenant throughout the ages, to be God to you and to your offspring to come.' },
    ],
  },
  {
    sourceKey: 'TORAH', book: 'Genesis', bookNumber: 1, chapter: 17, verse: 8,
    translations: [
      { label: 'CLASSIC', name: 'JPS 1917', text: 'And I will give unto thee, and to thy seed after thee, the land of thy sojournings, all the land of Canaan, for an everlasting possession; and I will be their God.', isDefault: true },
      { label: 'MODERN', name: 'JPS 1985', text: 'I assign the land you sojourn in to you and your offspring to come, all the land of Canaan, as an everlasting holding. I will be their God.' },
    ],
  },

  // ── Torah / Exodus ───────────────────────────────────────────────────────
  {
    sourceKey: 'TORAH', book: 'Exodus', bookNumber: 2, chapter: 3, verse: 14,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'וַיֹּאמֶר אֱלֹהִים אֶל-מֹשֶׁה אֶהְיֶה אֲשֶׁר אֶהְיֶה' },
      { label: 'CLASSIC', name: 'JPS 1917', text: 'And God said unto Moses: \'I AM THAT I AM\'; and He said: \'Thus shalt thou say unto the children of Israel: I AM hath sent me unto you.\'', isDefault: true },
      { label: 'MODERN', name: 'JPS 1985', text: 'And God said to Moses, "Ehyeh-Asher-Ehyeh." He continued, "Thus shall you say to the Israelites, \'Ehyeh sent me to you.\'"' },
    ],
  },
  {
    sourceKey: 'TORAH', book: 'Exodus', bookNumber: 2, chapter: 20, verse: 2,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'אָנֹכִי יְהוָה אֱלֹהֶיךָ אֲשֶׁר הוֹצֵאתִיךָ מֵאֶרֶץ מִצְרַיִם מִבֵּית עֲבָדִים' },
      { label: 'CLASSIC', name: 'JPS 1917', text: 'I am the LORD thy God, who brought thee out of the land of Egypt, out of the house of bondage.', isDefault: true },
      { label: 'MODERN', name: 'JPS 1985', text: 'I the LORD am your God who brought you out of the land of Egypt, the house of bondage.' },
    ],
  },
  {
    sourceKey: 'TORAH', book: 'Exodus', bookNumber: 2, chapter: 20, verse: 3,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'לֹא יִהְיֶה לְךָ אֱלֹהִים אֲחֵרִים עַל-פָּנָי' },
      { label: 'CLASSIC', name: 'JPS 1917', text: 'Thou shalt have no other gods before Me.', isDefault: true },
      { label: 'MODERN', name: 'JPS 1985', text: 'You shall have no other gods besides Me.' },
    ],
  },
  {
    sourceKey: 'TORAH', book: 'Exodus', bookNumber: 2, chapter: 20, verse: 8,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'זָכוֹר אֶת-יוֹם הַשַּׁבָּת לְקַדְּשׁוֹ' },
      { label: 'CLASSIC', name: 'JPS 1917', text: 'Remember the sabbath day, to keep it holy.', isDefault: true },
      { label: 'MODERN', name: 'JPS 1985', text: 'Remember the sabbath day and keep it holy.' },
    ],
  },

  // ── Torah / Leviticus ────────────────────────────────────────────────────
  {
    sourceKey: 'TORAH', book: 'Leviticus', bookNumber: 3, chapter: 11, verse: 3,
    translations: [
      { label: 'CLASSIC', name: 'JPS 1917', text: 'Whatsoever parteth the hoof, and is wholly cloven-footed, and cheweth the cud, among the beasts, that may ye eat.', isDefault: true },
      { label: 'MODERN', name: 'JPS 1985', text: 'any animal that has true hoofs, with clefts through the hoofs, and that chews its cud — such you may eat.' },
    ],
  },
  {
    sourceKey: 'TORAH', book: 'Leviticus', bookNumber: 3, chapter: 16, verse: 29,
    translations: [
      { label: 'CLASSIC', name: 'JPS 1917', text: 'And it shall be a statute for ever unto you: in the seventh month, on the tenth day of the month, ye shall afflict your souls, and shall do no manner of work.', isDefault: true },
      { label: 'MODERN', name: 'JPS 1985', text: 'And this shall be to you a law for all time: In the seventh month, on the tenth day of the month, you shall practice self-denial; and you shall do no manner of work.' },
    ],
  },
  {
    sourceKey: 'TORAH', book: 'Leviticus', bookNumber: 3, chapter: 19, verse: 9,
    translations: [
      { label: 'CLASSIC', name: 'JPS 1917', text: 'And when ye reap the harvest of your land, thou shalt not wholly reap the corner of thy field, neither shalt thou gather the gleaning of thy harvest.', isDefault: true },
      { label: 'MODERN', name: 'JPS 1985', text: 'When you reap the harvest of your land, you shall not reap all the way to the edges of your field, or gather the gleanings of your harvest.' },
    ],
  },
  {
    sourceKey: 'TORAH', book: 'Leviticus', bookNumber: 3, chapter: 19, verse: 18,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'וְאָהַבְתָּ לְרֵעֲךָ כָּמוֹךָ אֲנִי יְהוָה' },
      { label: 'CLASSIC', name: 'JPS 1917', text: 'Thou shalt not take vengeance, nor bear any grudge against the children of thy people, but thou shalt love thy neighbour as thyself: I am the LORD.', isDefault: true },
      { label: 'MODERN', name: 'JPS 1985', text: 'You shall not take vengeance or bear a grudge against your kinsfolk. Love your neighbor as yourself: I am the LORD.' },
    ],
  },

  // ── Torah / Deuteronomy ──────────────────────────────────────────────────
  {
    sourceKey: 'TORAH', book: 'Deuteronomy', bookNumber: 5, chapter: 6, verse: 4,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'שְׁמַע יִשְׂרָאֵל יְהוָה אֱלֹהֵינוּ יְהוָה אֶחָד' },
      { label: 'CLASSIC', name: 'JPS 1917', text: 'Hear, O Israel: the LORD our God, the LORD is one.', isDefault: true },
      { label: 'MODERN', name: 'JPS 1985', text: 'Hear, O Israel! The LORD is our God, the LORD alone.' },
    ],
  },

  // ── Hebrew Bible / Psalms ─────────────────────────────────────────────────
  {
    sourceKey: 'HEBREW_BIBLE', book: 'Psalms', bookNumber: 19, chapter: 23, verse: 1,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'The LORD is my shepherd; I shall not want.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'The LORD is my shepherd; I shall not want.' },
    ],
  },

  // ── Hebrew Bible / Isaiah ─────────────────────────────────────────────────
  {
    sourceKey: 'HEBREW_BIBLE', book: 'Isaiah', bookNumber: 23, chapter: 7, verse: 14,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'לָכֵן יִתֵּן אֲדֹנָי הוּא לָכֶם אוֹת הִנֵּה הָעַלְמָה הָרָה וְיֹלֶדֶת בֵּן וְקָרָאת שְׁמוֹ עִמָּנוּ אֵל' },
      { label: 'CLASSIC', name: 'KJV', text: 'Therefore the Lord himself shall give you a sign; Behold, a virgin shall conceive, and bear a son, and shall call his name Immanuel.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'Therefore the Lord himself will give you a sign. Behold, the virgin shall conceive and bear a son, and shall call his name Immanuel.' },
    ],
  },
  {
    sourceKey: 'HEBREW_BIBLE', book: 'Isaiah', bookNumber: 23, chapter: 58, verse: 6,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'Is not this the fast that I have chosen? to loose the bands of wickedness, to undo the heavy burdens, and to let the oppressed go free, and that ye break every yoke?', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'Is not this the fast that I choose: to loose the bonds of wickedness, to undo the straps of the yoke, to let the oppressed go free, and to break every yoke?' },
    ],
  },

  // ── Hebrew Bible / Daniel ─────────────────────────────────────────────────
  {
    sourceKey: 'HEBREW_BIBLE', book: 'Daniel', bookNumber: 27, chapter: 8, verse: 16,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'And I heard a man\'s voice between the banks of Ulai, which called, and said, Gabriel, make this man to understand the vision.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'And I heard a man\'s voice between the banks of the Ulai, and it called, "Gabriel, make this man understand the vision."' },
    ],
  },

  // ── New Testament / Matthew ───────────────────────────────────────────────
  {
    sourceKey: 'NEW_TESTAMENT', book: 'Matthew', bookNumber: 1, chapter: 1, verse: 23,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'Behold, a virgin shall be with child, and shall bring forth a son, and they shall call his name Emmanuel, which being interpreted is, God with us.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: '"Behold, the virgin shall conceive and bear a son, and they shall call his name Immanuel" (which means, God with us).' },
    ],
  },
  {
    sourceKey: 'NEW_TESTAMENT', book: 'Matthew', bookNumber: 1, chapter: 5, verse: 17,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'Think not that I am come to destroy the law, or the prophets: I am not come to destroy, but to fulfil.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: '"Do not think that I have come to abolish the Law or the Prophets; I have not come to abolish them but to fulfill them."' },
    ],
  },
  {
    sourceKey: 'NEW_TESTAMENT', book: 'Matthew', bookNumber: 1, chapter: 6, verse: 3,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'But when thou doest alms, let not thy left hand know what thy right hand doeth.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'But when you give to the needy, do not let your left hand know what your right hand is doing.' },
    ],
  },
  {
    sourceKey: 'NEW_TESTAMENT', book: 'Matthew', bookNumber: 1, chapter: 6, verse: 16,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'Moreover when ye fast, be not, as the hypocrites, of a sad countenance: for they disfigure their faces, that they may appear unto men to fast.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'And when you fast, do not look gloomy like the hypocrites, for they disfigure their faces that their fasting may be seen by others.' },
    ],
  },
  {
    sourceKey: 'NEW_TESTAMENT', book: 'Matthew', bookNumber: 1, chapter: 7, verse: 12,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'Therefore all things whatsoever ye would that men should do to you, do ye even so to them: for this is the law and the prophets.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'So whatever you wish that others would do to you, do also to them, for this is the Law and the Prophets.' },
    ],
  },
  {
    sourceKey: 'NEW_TESTAMENT', book: 'Matthew', bookNumber: 1, chapter: 22, verse: 37,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'Jesus said unto him, Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'And he said to him, "You shall love the Lord your God with all your heart and with all your soul and with all your mind."' },
    ],
  },
  {
    sourceKey: 'NEW_TESTAMENT', book: 'Matthew', bookNumber: 1, chapter: 22, verse: 39,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'And the second is like unto it, Thou shalt love thy neighbour as thyself.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'And a second is like it: You shall love your neighbor as yourself.' },
    ],
  },

  // ── New Testament / Mark ──────────────────────────────────────────────────
  {
    sourceKey: 'NEW_TESTAMENT', book: 'Mark', bookNumber: 2, chapter: 2, verse: 27,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'And he said unto them, The sabbath was made for man, and not man for the sabbath.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'And he said to them, "The Sabbath was made for man, not man for the Sabbath."' },
    ],
  },
  {
    sourceKey: 'NEW_TESTAMENT', book: 'Mark', bookNumber: 2, chapter: 7, verse: 19,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'Because it entereth not into his heart, but into the belly, and goeth out into the draught, purging all meats?', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'since it enters not his heart but his stomach, and is expelled? (Thus he declared all foods clean.)' },
    ],
  },

  // ── New Testament / Luke ──────────────────────────────────────────────────
  {
    sourceKey: 'NEW_TESTAMENT', book: 'Luke', bookNumber: 3, chapter: 1, verse: 26,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'And in the sixth month the angel Gabriel was sent from God unto a city of Galilee, named Nazareth.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'In the sixth month the angel Gabriel was sent from God to a city of Galilee named Nazareth.' },
    ],
  },
  {
    sourceKey: 'NEW_TESTAMENT', book: 'Luke', bookNumber: 3, chapter: 1, verse: 35,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'And the angel answered and said unto her, The Holy Ghost shall come upon thee, and the power of the Highest shall overshadow thee: therefore also that holy thing which shall be born of thee shall be called the Son of God.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'And the angel answered her, "The Holy Spirit will come upon you, and the power of the Most High will overshadow you; therefore the child to be born will be called holy—the Son of God."' },
    ],
  },

  // ── New Testament / John ──────────────────────────────────────────────────
  {
    sourceKey: 'NEW_TESTAMENT', book: 'John', bookNumber: 4, chapter: 1, verse: 1,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'In the beginning was the Word, and the Word was with God, and the Word was God.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'In the beginning was the Word, and the Word was with God, and the Word was God.' },
    ],
  },

  // ── New Testament / Acts ──────────────────────────────────────────────────
  {
    sourceKey: 'NEW_TESTAMENT', book: 'Acts', bookNumber: 5, chapter: 10, verse: 15,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'And the voice spake unto him again the second time, What God hath cleansed, that call not thou common.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'And the voice came to him again a second time, "What God has made clean, do not call common."' },
    ],
  },

  // ── New Testament / Romans ────────────────────────────────────────────────
  {
    sourceKey: 'NEW_TESTAMENT', book: 'Romans', bookNumber: 6, chapter: 4, verse: 13,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'For the promise, that he should be the heir of the world, was not to Abraham, or to his seed, through the law, but through the righteousness of faith.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'For the promise to Abraham and his offspring that he would be heir of the world did not come through the law but through the righteousness of faith.' },
    ],
  },

  // ── New Testament / Galatians ─────────────────────────────────────────────
  {
    sourceKey: 'NEW_TESTAMENT', book: 'Galatians', bookNumber: 9, chapter: 3, verse: 6,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'Even as Abraham believed God, and it was accounted to him for righteousness.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'just as Abraham "believed God, and it was counted to him as righteousness"?' },
    ],
  },

  // ── Qur'an ────────────────────────────────────────────────────────────────
  {
    sourceKey: 'QURAN', book: 'Al-Fatihah', bookNumber: 1, chapter: 1, verse: 1,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'In the name of Allah, Most Gracious, Most Merciful.', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'Al-Baqarah', bookNumber: 2, chapter: 2, verse: 43,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'And be steadfast in prayer; practise regular charity; and bow down your heads with those who bow down (in worship).', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'And establish prayer and give zakah and bow with those who bow [in worship and obedience].' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'Al-Baqarah', bookNumber: 2, chapter: 2, verse: 124,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'وَإِذِ ابْتَلَىٰ إِبْرَاهِيمَ رَبُّهُ بِكَلِمَاتٍ فَأَتَمَّهُنَّ قَالَ إِنِّي جَاعِلُكَ لِلنَّاسِ إِمَامًا' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'And remember that Abraham was tried by his Lord with certain commands, which he fulfilled: He said: "I will make thee an Imam to the Nations."', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'And [mention, O Muhammad], when Abraham was tried by his Lord with commands and he fulfilled them. [Allah] said, "Indeed, I will make you a leader for the people."' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'Al-Baqarah', bookNumber: 2, chapter: 2, verse: 173,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'إِنَّمَا حَرَّمَ عَلَيْكُمُ الْمَيْتَةَ وَالدَّمَ وَلَحْمَ الْخِنزِيرِ وَمَا أُهِلَّ بِهِ لِغَيْرِ اللَّهِ' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'He hath only forbidden you dead meat, and blood, and the flesh of swine, and that on which any other name hath been invoked besides that of Allah.', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'He has only forbidden to you dead animals, blood, the flesh of swine, and that which has been dedicated to other than Allah.' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'Al-Baqarah', bookNumber: 2, chapter: 2, verse: 177,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'لَيْسَ الْبِرَّ أَن تُوَلُّوا وُجُوهَكُمْ قِبَلَ الْمَشْرِقِ وَالْمَغْرِبِ وَلَٰكِنَّ الْبِرَّ مَنْ آمَنَ بِاللَّهِ' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'It is not righteousness that ye turn your faces towards east or west; but it is righteousness to believe in Allah... and to spend of your substance, out of love for Him, for your kin, for orphans, for the needy, for the wayfarer, for those who ask, and for the ransom of slaves.', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'Righteousness is not that you turn your faces toward the east or the west, but [true] righteousness is [in] one who believes in Allah... and gives wealth, in spite of love for it, to relatives, orphans, the needy, the traveler, those who ask [for help], and for freeing slaves.' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'Al-Baqarah', bookNumber: 2, chapter: 2, verse: 183,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'O ye who believe! Fasting is prescribed to you as it was prescribed to those before you, that ye may (learn) self-restraint.', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'O you who have believed, decreed upon you is fasting as it was decreed upon those before you that you may become righteous.' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'Al-Baqarah', bookNumber: 2, chapter: 2, verse: 255,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'Allah! There is no god but He,—the Living, the Self-subsisting, Eternal.', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'An-Nisa', bookNumber: 4, chapter: 4, verse: 36,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'وَاعْبُدُوا اللَّهَ وَلَا تُشْرِكُوا بِهِ شَيْئًا وَبِالْوَالِدَيْنِ إِحْسَانًا وَبِذِي الْقُرْبَىٰ وَالْيَتَامَىٰ وَالْمَسَاكِينِ' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'Serve Allah, and join not any partners with Him; and do good to parents, kinsfolk, orphans, those in need, neighbours who are near, neighbours who are strangers, the companion by your side, the wayfarer.', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'Worship Allah and associate nothing with Him, and to parents do good, and to relatives, orphans, the needy, the near neighbor, the neighbor farther away, the companion at your side, the traveler.' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'An-Nisa', bookNumber: 4, chapter: 4, verse: 157,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'وَمَا قَتَلُوهُ وَمَا صَلَبُوهُ وَلَٰكِن شُبِّهَ لَهُمْ' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'That they said (in boast), "We killed Christ Jesus the son of Mary, the Messenger of Allah";—but they killed him not, nor crucified him, but so it was made to appear to them.', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'And [for] their saying, "Indeed, we have killed the Messiah, Jesus the son of Mary, the messenger of Allah." And they did not kill him, nor did they crucify him; but [another] was made to resemble him to them.' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'Al-Isra', bookNumber: 17, chapter: 17, verse: 23,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'Thy Lord hath decreed that ye worship none but Him, and that ye be kind to parents.', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'And your Lord has decreed that you not worship except Him, and to parents, good treatment.' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'Maryam', bookNumber: 19, chapter: 19, verse: 16,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'وَاذْكُرْ فِي الْكِتَابِ مَرْيَمَ إِذِ انتَبَذَتْ مِنْ أَهْلِهَا مَكَانًا شَرْقِيًّا' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'Relate in the Book (the story of) Mary, when she withdrew from her family to a place in the East.', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'And mention, [O Muhammad], in the Book [the story of] Mary, when she withdrew from her family to a place toward the east.' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'Maryam', bookNumber: 19, chapter: 19, verse: 19,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'قَالَ إِنَّمَا أَنَا رَسُولُ رَبِّكِ لِأَهَبَ لَكِ غُلَامًا زَكِيًّا' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'He said: "Nay, I am only a messenger from thy Lord, (to announce) to thee the gift of a holy son."', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'He said, "I am only the messenger of your Lord to give you [news of] a pure boy."' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'Al-Jumua', bookNumber: 62, chapter: 62, verse: 9,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ وَذَرُوا الْبَيْعَ' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'O ye who believe! When the call is proclaimed to prayer on Friday (the Day of Assembly), hasten earnestly to the Remembrance of Allah, and leave off business (and traffic).', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'O you who have believed, when [the adhan] is called for the prayer on the day of Jumu\'ah [Friday], then proceed to the remembrance of Allah and leave trade.' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'Al-Ikhlas', bookNumber: 112, chapter: 112, verse: 1,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'قُلْ هُوَ اللَّهُ أَحَدٌ' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'Say: He is Allah, the One and Only.', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'Say, "He is Allah, [who is] One."' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'Al-Ikhlas', bookNumber: 112, chapter: 112, verse: 3,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'لَمْ يَلِدْ وَلَمْ يُولَدْ' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'He begetteth not, nor is He begotten.', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'He neither begets nor is born.' },
    ],
  },

  // ── Torah / Numbers ───────────────────────────────────────────────────────
  {
    sourceKey: 'TORAH', book: 'Numbers', bookNumber: 4, chapter: 19, verse: 2,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'זֹאת חֻקַּת הַתּוֹרָה אֲשֶׁר-צִוָּה יְהוָה לֵאמֹר דַּבֵּר אֶל-בְּנֵי יִשְׂרָאֵל וְיִקְחוּ אֵלֶיךָ פָרָה אֲדֻמָּה תְּמִימָה' },
      { label: 'CLASSIC', name: 'JPS 1917', text: 'This is the statute of the law which the LORD hath commanded, saying: Speak unto the children of Israel, that they bring thee a red heifer, faultless, wherein is no blemish, and upon which never came yoke.', isDefault: true },
      { label: 'MODERN', name: 'JPS 1985', text: 'This is the ritual law that the LORD has commanded: Instruct the Israelite people to bring you a red cow without blemish, in which there is no defect and on which no yoke has been laid.' },
    ],
  },
  {
    sourceKey: 'TORAH', book: 'Numbers', bookNumber: 4, chapter: 19, verse: 9,
    translations: [
      { label: 'CLASSIC', name: 'JPS 1917', text: 'And a man that is clean shall gather up the ashes of the heifer, and lay them up without the camp in a clean place, and it shall be kept for the congregation of the children of Israel for a water of sprinkling; it is a purification from sin.', isDefault: true },
      { label: 'MODERN', name: 'JPS 1985', text: 'A man who is pure shall gather up the ashes of the cow and deposit them outside the camp in a pure place, to be kept for water of lustration for the Israelite community. It is for purification.' },
    ],
  },
  {
    sourceKey: 'TORAH', book: 'Exodus', bookNumber: 2, chapter: 25, verse: 8,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'וְעָשׂוּ לִי מִקְדָּשׁ וְשָׁכַנְתִּי בְּתוֹכָם' },
      { label: 'CLASSIC', name: 'JPS 1917', text: 'And let them make Me a sanctuary, that I may dwell among them.', isDefault: true },
      { label: 'MODERN', name: 'JPS 1985', text: 'And let them make Me a sanctuary that I may dwell among them.' },
    ],
  },
  {
    sourceKey: 'TORAH', book: 'Genesis', bookNumber: 1, chapter: 6, verse: 9,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'נֹחַ אִישׁ צַדִּיק תָּמִים הָיָה בְּדֹרֹתָיו אֶת-הָאֱלֹהִים הִתְהַלֶּךְ-נֹחַ' },
      { label: 'CLASSIC', name: 'JPS 1917', text: 'Noah was a righteous man, and perfect in his generations; Noah walked with God.', isDefault: true },
      { label: 'MODERN', name: 'JPS 1985', text: 'Noah was a righteous man; he was blameless in his age; Noah walked with God.' },
    ],
  },

  // ── Hebrew Bible / Isaiah (additional) ────────────────────────────────────
  {
    sourceKey: 'HEBREW_BIBLE', book: 'Isaiah', bookNumber: 23, chapter: 53, verse: 3,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'נִבְזֶה וַחֲדַל אִישִׁים אִישׁ מַכְאֹבוֹת וִידוּעַ חֹלִי' },
      { label: 'CLASSIC', name: 'KJV', text: 'He is despised and rejected of men; a man of sorrows, and acquainted with grief: and we hid as it were our faces from him; he was despised, and we esteemed him not.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'He was despised and rejected by men, a man of sorrows and acquainted with grief; and as one from whom men hide their faces he was despised, and we esteemed him not.' },
    ],
  },
  {
    sourceKey: 'HEBREW_BIBLE', book: 'Isaiah', bookNumber: 23, chapter: 53, verse: 5,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'וְהוּא מְחֹלָל מִפְּשָׁעֵנוּ מְדֻכָּא מֵעֲוֹנֹתֵינוּ מוּסַר שְׁלוֹמֵנוּ עָלָיו וּבַחֲבֻרָתוֹ נִרְפָּא-לָנוּ' },
      { label: 'CLASSIC', name: 'KJV', text: 'But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'But he was pierced for our transgressions; he was crushed for our iniquities; upon him was the chastisement that brought us peace, and with his wounds we are healed.' },
    ],
  },
  {
    sourceKey: 'HEBREW_BIBLE', book: 'Isaiah', bookNumber: 23, chapter: 9, verse: 6,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'כִּי-יֶלֶד יֻלַּד-לָנוּ בֵּן נִתַּן-לָנוּ וַתְּהִי הַמִּשְׂרָה עַל-שִׁכְמוֹ וַיִּקְרָא שְׁמוֹ פֶּלֶא יוֹעֵץ אֵל גִּבּוֹר אֲבִיעַד שַׂר-שָׁלוֹם' },
      { label: 'CLASSIC', name: 'KJV', text: 'For unto us a child is born, unto us a son is given: and the government shall be upon his shoulder: and his name shall be called Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of Peace.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'For to us a child is born, to us a son is given; and the government shall be upon his shoulder, and his name shall be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace.' },
    ],
  },
  {
    sourceKey: 'HEBREW_BIBLE', book: 'Zechariah', bookNumber: 38, chapter: 9, verse: 9,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'Rejoice greatly, O daughter of Zion; shout, O daughter of Jerusalem: behold, thy King cometh unto thee: he is just, and having salvation; lowly, and riding upon an ass, and upon a colt the foal of an ass.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'Rejoice greatly, O daughter of Zion! Shout aloud, O daughter of Jerusalem! Behold, your king is coming to you; righteous and having salvation is he, humble and mounted on a donkey, on a colt, the foal of a donkey.' },
    ],
  },
  {
    sourceKey: 'HEBREW_BIBLE', book: '1 Kings', bookNumber: 11, chapter: 8, verse: 27,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'But will God indeed dwell on the earth? behold, the heaven and heaven of heavens cannot contain thee; how much less this house that I have builded?', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'But will God indeed dwell on the earth? Behold, heaven and the highest heaven cannot contain you; how much less this house that I have built!' },
    ],
  },

  // ── New Testament / John (additional) ─────────────────────────────────────
  {
    sourceKey: 'NEW_TESTAMENT', book: 'John', bookNumber: 4, chapter: 2, verse: 19,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'Jesus answered and said unto them, Destroy this temple, and in three days I will raise it up.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'Jesus answered them, "Destroy this temple, and in three days I will raise it up."' },
    ],
  },

  // ── New Testament / Matthew (additional) ──────────────────────────────────
  {
    sourceKey: 'NEW_TESTAMENT', book: 'Matthew', bookNumber: 1, chapter: 16, verse: 16,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'And Simon Peter answered and said, Thou art the Christ, the Son of the living God.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'Simon Peter replied, "You are the Christ, the Son of the living God."' },
    ],
  },

  // ── New Testament / 1 Corinthians ─────────────────────────────────────────
  {
    sourceKey: 'NEW_TESTAMENT', book: '1 Corinthians', bookNumber: 7, chapter: 3, verse: 16,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'Know ye not that ye are the temple of God, and that the Spirit of God dwelleth in you?', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'Do you not know that you are God\'s temple and that God\'s Spirit dwells in you?' },
    ],
  },

  // ── New Testament / Hebrews ───────────────────────────────────────────────
  {
    sourceKey: 'NEW_TESTAMENT', book: 'Hebrews', bookNumber: 19, chapter: 9, verse: 13,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'For if the blood of bulls and of goats, and the ashes of an heifer sprinkling the unclean, sanctifieth to the purifying of the flesh: How much more shall the blood of Christ...', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'For if the blood of goats and bulls, and the sprinkling of defiled persons with the ashes of a heifer, sanctify for the purification of the flesh, how much more will the blood of Christ...' },
    ],
  },

  // ── Qur'an / Al-Imran ─────────────────────────────────────────────────────
  {
    sourceKey: 'QURAN', book: "Al-Imran", bookNumber: 3, chapter: 3, verse: 45,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'إِذْ قَالَتِ الْمَلَائِكَةُ يَا مَرْيَمُ إِنَّ اللَّهَ يُبَشِّرُكِ بِكَلِمَةٍ مِّنْهُ اسْمُهُ الْمَسِيحُ عِيسَى ابْنُ مَرْيَمَ' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'Behold! the angels said: "O Mary! Allah giveth thee glad tidings of a Word from Him: his name will be Christ Jesus, the son of Mary, held in honour in this world and the Hereafter and of (the company of) those nearest to Allah."', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'The angels said, "O Mary, indeed Allah gives you good tidings of a word from Him, whose name will be the Messiah, Jesus, the son of Mary — distinguished in this world and the Hereafter and among those brought near [to Allah]."' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'Al-Isra', bookNumber: 17, chapter: 17, verse: 1,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا مِّنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'Glory to (Allah) Who did take His Servant for a Journey by night from the Sacred Mosque to the Farthest Mosque, whose precincts We did bless, in order that We might show him some of Our Signs.', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'Exalted is He who took His Servant by night from al-Masjid al-Haram to al-Masjid al-Aqsa, whose surroundings We have blessed, to show him of Our signs.' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'Al-Baqarah', bookNumber: 2, chapter: 2, verse: 67,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'وَإِذْ قَالَ مُوسَىٰ لِقَوْمِهِ إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تَذْبَحُوا بَقَرَةً' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'And remember Moses said to his people: "Allah commands that ye sacrifice a heifer." They said: "Makest thou a laughing-stock of us?" He said: "Allah save me from being an ignorant (fool)!"', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'And [recall] when Moses said to his people, "Indeed, Allah commands you to slaughter a cow." They said, "Do you take us in ridicule?" He said, "I seek refuge in Allah from being among the ignorant."' },
    ],
  },

  // ── Torah / Genesis — Enoch ──────────────────────────────────────────────
  {
    sourceKey: 'TORAH', book: 'Genesis', bookNumber: 1, chapter: 5, verse: 24,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'וַיִּתְהַלֵּךְ חֲנוֹךְ אֶת-הָאֱלֹהִים וְאֵינֶנּוּ כִּי-לָקַח אֹתוֹ אֱלֹהִים' },
      { label: 'CLASSIC', name: 'JPS 1917', text: 'And Enoch walked with God, and he was not; for God took him.', isDefault: true },
      { label: 'MODERN', name: 'JPS 1985', text: 'Enoch walked with God; then he was no more, for God took him.' },
    ],
  },

  // ── Torah / Genesis — Adam, Circumcision, Akedah ──────────────────────────
  {
    sourceKey: 'TORAH', book: 'Genesis', bookNumber: 1, chapter: 2, verse: 7,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'וַיִּיצֶר יְהוָה אֱלֹהִים אֶת-הָאָדָם עָפָר מִן-הָאֲדָמָה וַיִּפַּח בְּאַפָּיו נִשְׁמַת חַיִּים' },
      { label: 'CLASSIC', name: 'JPS 1917', text: 'Then the LORD God formed man of the dust of the ground, and breathed into his nostrils the breath of life; and man became a living soul.', isDefault: true },
      { label: 'MODERN', name: 'JPS 1985', text: 'the LORD God formed man from the dust of the earth. He blew into his nostrils the breath of life, and man became a living being.' },
    ],
  },
  {
    sourceKey: 'TORAH', book: 'Genesis', bookNumber: 1, chapter: 3, verse: 15,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'וְאֵיבָה אָשִׁית בֵּינְךָ וּבֵין הָאִשָּׁה וּבֵין זַרְעֲךָ וּבֵין זַרְעָהּ הוּא יְשׁוּפְךָ רֹאשׁ וְאַתָּה תְּשׁוּפֶנּוּ עָקֵב' },
      { label: 'CLASSIC', name: 'JPS 1917', text: 'And I will put enmity between thee and the woman, and between thy seed and her seed; they shall bruise thy head, and thou shalt bruise their heel.', isDefault: true },
      { label: 'MODERN', name: 'JPS 1985', text: 'I will put enmity between you and the woman, and between your offspring and hers; they shall strike at your head, and you shall strike at their heel.' },
    ],
  },
  {
    sourceKey: 'TORAH', book: 'Genesis', bookNumber: 1, chapter: 17, verse: 10,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'זֹאת בְּרִיתִי אֲשֶׁר תִּשְׁמְרוּ בֵּינִי וּבֵינֵיכֶם וּבֵין זַרְעֲךָ אַחֲרֶיךָ הִמּוֹל לָכֶם כָּל-זָכָר' },
      { label: 'CLASSIC', name: 'JPS 1917', text: 'This is My covenant, which ye shall keep, between Me and you and thy seed after thee: every male among you shall be circumcised.', isDefault: true },
      { label: 'MODERN', name: 'JPS 1985', text: 'Such shall be the covenant between Me and you and your offspring to follow which you shall keep: every male among you shall be circumcised.' },
    ],
  },
  {
    sourceKey: 'TORAH', book: 'Genesis', bookNumber: 1, chapter: 22, verse: 2,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'וַיֹּאמֶר קַח-נָא אֶת-בִּנְךָ אֶת-יְחִידְךָ אֲשֶׁר-אָהַבְתָּ אֶת-יִצְחָק וְלֶךְ-לְךָ אֶל-אֶרֶץ הַמֹּרִיָּה' },
      { label: 'CLASSIC', name: 'JPS 1917', text: 'And He said: Take now thy son, thine only son, whom thou lovest, even Isaac, and get thee into the land of Moriah; and offer him there for a burnt-offering upon one of the mountains which I will tell thee of.', isDefault: true },
      { label: 'MODERN', name: 'JPS 1985', text: 'And He said, "Take your son, your favored one, Isaac, whom you love, and go to the land of Moriah, and offer him there as a burnt offering on one of the heights that I will point out to you."' },
    ],
  },

  // ── Torah / Deuteronomy — Shema, Future Prophet ───────────────────────────
  {
    sourceKey: 'TORAH', book: 'Deuteronomy', bookNumber: 5, chapter: 6, verse: 4,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'שְׁמַע יִשְׂרָאֵל יְהוָה אֱלֹהֵינוּ יְהוָה אֶחָד' },
      { label: 'CLASSIC', name: 'JPS 1917', text: 'Hear, O Israel: the LORD our God, the LORD is one.', isDefault: true },
      { label: 'MODERN', name: 'JPS 1985', text: 'Hear, O Israel! The LORD is our God, the LORD alone.' },
    ],
  },
  {
    sourceKey: 'TORAH', book: 'Deuteronomy', bookNumber: 5, chapter: 18, verse: 15,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'נָבִיא מִקִּרְבְּךָ מֵאַחֶיךָ כָּמֹנִי יָקִים לְךָ יְהוָה אֱלֹהֶיךָ אֵלָיו תִּשְׁמָעוּן' },
      { label: 'CLASSIC', name: 'JPS 1917', text: 'A prophet will the LORD thy God raise up unto thee, from the midst of thee, of thy brethren, like unto me; unto him ye shall hearken.', isDefault: true },
      { label: 'MODERN', name: 'JPS 1985', text: 'The LORD your God will raise up for you a prophet from among your own people, like myself; him you shall heed.' },
    ],
  },

  // ── Hebrew Bible — Isaiah 7:14, Micah 5:2, Malachi 4:5, Psalm 22 ──────────
  {
    sourceKey: 'HEBREW_BIBLE', book: 'Isaiah', bookNumber: 23, chapter: 7, verse: 14,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'לָכֵן יִתֵּן אֲדֹנָי הוּא לָכֶם אוֹת הִנֵּה הָעַלְמָה הָרָה וְיֹלֶדֶת בֵּן וְקָרָאת שְׁמוֹ עִמָּנוּ אֵל' },
      { label: 'CLASSIC', name: 'KJV', text: 'Therefore the Lord himself shall give you a sign; Behold, a virgin shall conceive, and bear a son, and shall call his name Immanuel.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'Therefore the Lord himself will give you a sign. Behold, the virgin shall conceive and bear a son, and shall call his name Immanuel.' },
    ],
  },
  {
    sourceKey: 'HEBREW_BIBLE', book: 'Micah', bookNumber: 33, chapter: 5, verse: 2,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'וְאַתָּה בֵּית-לֶחֶם אֶפְרָתָה צָעִיר לִהְיוֹת בְּאַלְפֵי יְהוּדָה מִמְּךָ לִי יֵצֵא לִהְיוֹת מוֹשֵׁל בְּיִשְׂרָאֵל' },
      { label: 'CLASSIC', name: 'KJV', text: 'But thou, Bethlehem Ephratah, though thou be little among the thousands of Judah, yet out of thee shall he come forth unto me that is to be ruler in Israel; whose goings forth have been from of old, from everlasting.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'But you, O Bethlehem Ephrathah, who are too little to be among the clans of Judah, from you shall come forth for me one who is to be ruler in Israel, whose coming forth is from of old, from ancient days.' },
    ],
  },
  {
    sourceKey: 'HEBREW_BIBLE', book: 'Malachi', bookNumber: 39, chapter: 4, verse: 5,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'הִנֵּה אָנֹכִי שֹׁלֵחַ לָכֶם אֵת אֵלִיָּה הַנָּבִיא לִפְנֵי בּוֹא יוֹם יְהוָה הַגָּדוֹל וְהַנּוֹרָא' },
      { label: 'CLASSIC', name: 'KJV', text: 'Behold, I will send you Elijah the prophet before the coming of the great and dreadful day of the LORD.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'Behold, I will send you Elijah the prophet before the great and awesome day of the LORD comes.' },
    ],
  },
  {
    sourceKey: 'HEBREW_BIBLE', book: 'Psalms', bookNumber: 19, chapter: 22, verse: 1,
    translations: [
      { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'אֵלִי אֵלִי לָמָה עֲזַבְתָּנִי רָחוֹק מִישׁוּעָתִי דִּבְרֵי שַׁאֲגָתִי' },
      { label: 'CLASSIC', name: 'KJV', text: 'My God, my God, why hast thou forsaken me? why art thou so far from helping me, and from the words of my roaring?', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'My God, my God, why have you forsaken me? Why are you so far from saving me, from the words of my groaning?' },
    ],
  },

  // ── New Testament — Hebrews 11:5, Jude 1:14 (Enoch) ─────────────────────
  {
    sourceKey: 'NEW_TESTAMENT', book: 'Hebrews', bookNumber: 19, chapter: 11, verse: 5,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'By faith Enoch was translated that he should not see death; and was not found, because God had translated him: for before his translation he had this testimony, that he pleased God.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'By faith Enoch was taken up so that he should not see death, and he was not found, because God had taken him. Now before he was taken he was commended as having pleased God.' },
    ],
  },
  {
    sourceKey: 'NEW_TESTAMENT', book: 'Jude', bookNumber: 26, chapter: 1, verse: 14,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'And Enoch also, the seventh from Adam, prophesied of these, saying, Behold, the Lord cometh with ten thousands of his saints.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'It was also about these that Enoch, the seventh from Adam, prophesied, saying, "Behold, the Lord comes with ten thousands of his holy ones."' },
    ],
  },

  // ── New Testament — Matthew, Galatians, Romans, 1 Timothy, Rev ───────────
  {
    sourceKey: 'NEW_TESTAMENT', book: 'Matthew', bookNumber: 1, chapter: 5, verse: 44,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'But I say unto you, Love your enemies, bless them that curse you, do good to them that hate you, and pray for them which despitefully use you, and persecute you.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'But I say to you, Love your enemies and pray for those who persecute you.' },
    ],
  },
  {
    sourceKey: 'NEW_TESTAMENT', book: 'Matthew', bookNumber: 1, chapter: 24, verse: 2,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'And Jesus said unto them, See ye not all these things? verily I say unto you, There shall not be left here one stone upon another, that shall not be thrown down.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'But he answered them, "You see all these, do you not? Truly, I say to you, there will not be left here one stone upon another that will not be thrown down."' },
    ],
  },
  {
    sourceKey: 'NEW_TESTAMENT', book: 'Romans', bookNumber: 6, chapter: 3, verse: 28,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'Therefore we conclude that a man is justified by faith without the deeds of the law.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'For we hold that one is justified by faith apart from works of the law.' },
    ],
  },
  {
    sourceKey: 'NEW_TESTAMENT', book: 'Galatians', bookNumber: 9, chapter: 3, verse: 28,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'There is neither Jew nor Greek, there is neither bond nor free, there is neither male nor female: for ye are all one in Christ Jesus.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'There is neither Jew nor Greek, there is neither slave nor free, there is no male and female, for you are all one in Christ Jesus.' },
    ],
  },
  {
    sourceKey: 'NEW_TESTAMENT', book: '1 Timothy', bookNumber: 15, chapter: 2, verse: 12,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'But I suffer not a woman to teach, nor to usurp authority over the man, but to be in silence.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'I do not permit a woman to teach or to exercise authority over a man; she is to remain quiet.' },
    ],
  },
  {
    sourceKey: 'NEW_TESTAMENT', book: 'Revelation', bookNumber: 22, chapter: 20, verse: 10,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'And the devil that deceived them was cast into the lake of fire and brimstone, where the beast and the false prophet are, and shall be tormented day and night for ever and ever.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'and the devil who had deceived them was thrown into the lake of fire and sulfur where the beast and the false prophet were, and they will be tormented day and night forever and ever.' },
    ],
  },
  {
    sourceKey: 'NEW_TESTAMENT', book: 'Acts', bookNumber: 5, chapter: 3, verse: 22,
    translations: [
      { label: 'CLASSIC', name: 'KJV', text: 'For Moses truly said unto the fathers, A prophet shall the Lord your God raise up unto you of your brethren, like unto me; him shall ye hear in all things whatsoever he shall say unto you.', isDefault: true },
      { label: 'MODERN', name: 'ESV', text: 'Moses said, "The Lord God will raise up for you a prophet like me from your brothers. You shall listen to him in whatever he tells you."' },
    ],
  },

  // ── Qur'an — Maryam 19:56-57, Al-Anbiya 21:85 (Idris/Enoch) ─────────────
  {
    sourceKey: 'QURAN', book: 'Maryam', bookNumber: 19, chapter: 19, verse: 56,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'وَاذْكُرْ فِي الْكِتَابِ إِدْرِيسَ ۚ إِنَّهُ كَانَ صِدِّيقًا نَّبِيًّا' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'Also mention in the Book the case of Idris: He was a man of truth (and sincerity), (and) a prophet.', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'And mention in the Book, Idris. Indeed, he was a man of truth and a prophet.' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'Maryam', bookNumber: 19, chapter: 19, verse: 57,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'وَرَفَعْنَاهُ مَكَانًا عَلِيًّا' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'And We raised him to a lofty station.', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'And We raised him to a high station.' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'Al-Anbiya', bookNumber: 21, chapter: 21, verse: 85,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'وَإِسْمَاعِيلَ وَإِدْرِيسَ وَذَا الْكِفْلِ ۖ كُلٌّ مِّنَ الصَّابِرِينَ' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'And (remember) Isma\'il, Idris, and Zul-kifl, all (men) of constancy and patience.', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'And [mention] Ishmael and Idris and Dhul-Kifl; all were of the patient.' },
    ],
  },

  // ── Qur'an — Trinity, Compulsion, Women, Seal of Prophets, Jihad ─────────
  {
    sourceKey: 'QURAN', book: 'Al-Baqarah', bookNumber: 2, chapter: 2, verse: 256,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'لَا إِكْرَاهَ فِي الدِّينِ ۖ قَد تَّبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'Let there be no compulsion in religion: Truth stands out clear from Error.', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'There shall be no compulsion in [acceptance of] the religion. The right course has become clear from the wrong.' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'Al-Baqarah', bookNumber: 2, chapter: 2, verse: 190,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'وَقَاتِلُوا فِي سَبِيلِ اللَّهِ الَّذِينَ يُقَاتِلُونَكُمْ وَلَا تَعْتَدُوا ۚ إِنَّ اللَّهَ لَا يُحِبُّ الْمُعْتَدِينَ' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'Fight in the cause of Allah those who fight you, but do not transgress limits; for Allah loveth not transgressors.', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'Fight in the way of Allah those who fight you but do not transgress. Indeed, Allah does not like transgressors.' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'Al-Maidah', bookNumber: 5, chapter: 5, verse: 73,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'لَقَدْ كَفَرَ الَّذِينَ قَالُوا إِنَّ اللَّهَ ثَالِثُ ثَلَاثَةٍ' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'They do blaspheme who say: Allah is one of three in a Trinity: for there is no god except One God.', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'They have certainly disbelieved who say, "Allah is the third of three." And there is no god except one God.' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'An-Nisa', bookNumber: 4, chapter: 4, verse: 34,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'الرِّجَالُ قَوَّامُونَ عَلَى النِّسَاءِ بِمَا فَضَّلَ اللَّهُ بَعْضَهُمْ عَلَىٰ بَعْضٍ' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'Men are the protectors and maintainers of women, because Allah has given the one more (strength) than the other, and because they support them from their means.', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'Men are in charge of women by [right of] what Allah has given one over the other and what they spend [for maintenance] from their wealth.' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'An-Nisa', bookNumber: 4, chapter: 4, verse: 171,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'يَا أَهْلَ الْكِتَابِ لَا تَغْلُوا فِي دِينِكُمْ وَلَا تَقُولُوا عَلَى اللَّهِ إِلَّا الْحَقَّ ۚ إِنَّمَا الْمَسِيحُ عِيسَى ابْنُ مَرْيَمَ رَسُولُ اللَّهِ' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'O People of the Book! Commit no excesses in your religion: Nor say of Allah aught but the truth. Christ Jesus the son of Mary was (no more than) a messenger of Allah, and His Word.', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'O People of the Scripture, do not commit excess in your religion or say about Allah except the truth. The Messiah, Jesus, the son of Mary, was but a messenger of Allah and His word which He directed to Mary.' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'Al-Ahzab', bookNumber: 33, chapter: 33, verse: 40,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'مَّا كَانَ مُحَمَّدٌ أَبَا أَحَدٍ مِّن رِّجَالِكُمْ وَلَٰكِن رَّسُولَ اللَّهِ وَخَاتَمَ النَّبِيِّينَ' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'Muhammad is not the father of any of your men, but (he is) the Messenger of Allah, and the Seal of the Prophets: and Allah has full knowledge of all things.', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'Muhammad is not the father of [any] one of your men, but [he is] the Messenger of Allah and last of the prophets. And ever is Allah, of all things, Knowing.' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'At-Tawbah', bookNumber: 9, chapter: 9, verse: 30,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'وَقَالَتِ الْيَهُودُ عُزَيْرٌ ابْنُ اللَّهِ وَقَالَتِ النَّصَارَى الْمَسِيحُ ابْنُ اللَّهِ' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'The Jews call Uzair a son of Allah, and the Christians call Christ the son of Allah. That is a saying from their mouth; (in this) they but imitate what the Unbelievers of old used to say.', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'The Jews say, "Ezra is the son of Allah"; and the Christians say, "The Messiah is the son of Allah." That is their statement from their mouths; they imitate the saying of those who disbelieved [before them].' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'Al-Baqarah', bookNumber: 2, chapter: 2, verse: 217,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'وَمَن يَرْتَدِدْ مِنكُمْ عَن دِينِهِ فَيَمُتْ وَهُوَ كَافِرٌ فَأُولَٰئِكَ حَبِطَتْ أَعْمَالُهُمْ' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'And if any of you turn back from their faith and die in unbelief, their works will bear no fruit in this life and in the Hereafter; they will be companions of the Fire and will abide therein.', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'And whoever of you reverts from his religion [to disbelief] and dies while he is a disbeliever — for those, their deeds have become worthless in this world and the Hereafter.' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'Hud', bookNumber: 11, chapter: 11, verse: 42,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'وَهِيَ تَجْرِي بِهِمْ فِي مَوْجٍ كَالْجِبَالِ وَنَادَىٰ نُوحٌ ابْنَهُ وَكَانَ فِي مَعْزِلٍ يَا بُنَيَّ ارْكَب مَّعَنَا وَلَا تَكُن مَّعَ الْكَافِرِينَ' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'So the Ark floated with them on the waves (towering) like mountains, and Noah called out to his son, who had separated himself (from the rest): "O my son! embark with us, and be not with the unbelievers!"', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'And it sailed with them through waves like mountains, and Noah called to his son who was apart [from them], "O my son, come aboard with us and be not with the disbelievers."' },
    ],
  },
  {
    sourceKey: 'QURAN', book: 'An-Nahl', bookNumber: 16, chapter: 16, verse: 90,
    translations: [
      { label: 'ORIGINAL', name: 'Arabic', text: 'إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيتَاءِ ذِي الْقُرْبَىٰ وَيَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ وَالْبَغْيِ' },
      { label: 'CLASSIC', name: 'Yusuf Ali', text: 'Allah commands justice, the doing of good, and liberality to kith and kin, and He forbids all shameful deeds, and injustice and rebellion.', isDefault: true },
      { label: 'MODERN', name: 'Sahih International', text: 'Indeed, Allah orders justice and good conduct and giving to relatives and forbids immorality and bad conduct and oppression.' },
    ],
  },
]

export async function seedVerses(prisma: PrismaClient) {
  const sources = await prisma.source.findMany()
  const sourceMap = new Map(sources.map((s) => [s.key, s.id]))

  for (const v of versesData) {
    const sourceId = sourceMap.get(v.sourceKey)!
    const referenceKey = `${v.sourceKey}.${v.book}.${v.chapter}.${v.verse}`

    const verse = await prisma.verse.upsert({
      where: { referenceKey },
      update: {},
      create: {
        sourceId,
        book: v.book,
        bookNumber: v.bookNumber,
        chapter: v.chapter,
        verse: v.verse,
        referenceKey,
      },
    })

    for (const t of v.translations) {
      await prisma.verseTranslation.upsert({
        where: { verseId_label_name: { verseId: verse.id, label: t.label, name: t.name } },
        update: {},
        create: { verseId: verse.id, label: t.label, name: t.name, text: t.text, isDefault: t.isDefault ?? false },
      })
    }
  }

  console.log(`✓ Verses seeded (${versesData.length} verses)`)
}
