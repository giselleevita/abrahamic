-- Wording and citation corrections found during the project-editor sign-off of the legacy claims.
-- Each statement is located by its old content hash, so the migration is a no-op on databases
-- that never held the old wording. Editing a statement bumps "revision" (trigger), which voids
-- earlier sign-offs: the corrected claims show "awaiting review" again until re-checked.

UPDATE "claims" SET "statement" = $stmt$Jude quotes a prophecy attributed to Enoch: "Enoch, the seventh from Adam, prophesied, saying, Behold, the Lord cometh with ten thousands of his saints" — a passage also found in the Book of Enoch, and the only New Testament quotation of a text attributed to Enoch. Whether this gives that book authority is disputed: most Christian traditions do not treat it as scripture, while the Ethiopian and Eritrean Orthodox churches do.$stmt$,
  "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$jude quotes a prophecy attributed to enoch: "enoch, the seventh from adam, prophesied, saying, behold, the lord cometh with ten thousands of his saints" — a passage also found in the book of enoch, and the only new testament quotation of a text attributed to enoch. whether this gives that book authority is disputed: most christian traditions do not treat it as scripture, while the ethiopian and eritrean orthodox churches do.$n$, 'UTF8')), 'hex')
WHERE "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$jude quotes directly from the book of enoch: "enoch, the seventh from adam, prophesied, saying, behold, the lord cometh with ten thousands of his saints" — the only new testament citation of an apocryphal text attributed to enoch, giving the book of enoch apostolic weight.$n$, 'UTF8')), 'hex');

UPDATE "claims" SET "statement" = $stmt$The Quran states that the Jews say Uzair (Ezra) is the son of God, just as the Christians say of the Messiah, and it rejects both statements. Classical commentators generally take this to refer to some Jews of Arabia rather than to Jews in general, and Jewish tradition does not teach it.$stmt$,
  "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$the quran states that the jews say uzair (ezra) is the son of god, just as the christians say of the messiah, and it rejects both statements. classical commentators generally take this to refer to some jews of arabia rather than to jews in general, and jewish tradition does not teach it.$n$, 'UTF8')), 'hex')
WHERE "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$the quran states that the jews call uzair (ezra) the son of god, just as christians call the messiah the son of god — both claims are rejected as distortions; the curse is upon those who say this.$n$, 'UTF8')), 'hex');

UPDATE "claims" SET "statement" = $stmt$The Quran commands believers to leave trade and hasten to the congregational prayer (Jumu'ah) on Friday — Islam's weekly day of communal assembly. Unlike the Sabbath, it does not require rest from work once the prayer is over (62:10).$stmt$,
  "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$the quran commands believers to leave trade and hasten to the congregational prayer (jumu'ah) on friday — islam's weekly day of communal assembly. unlike the sabbath, it does not require rest from work once the prayer is over (62:10).$n$, 'UTF8')), 'hex')
WHERE "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$the quran commands believers to leave trade and hasten to the congregational prayer (jumu'ah) on friday — islam's weekly communal assembly replaces the sabbath.$n$, 'UTF8')), 'hex');

UPDATE "claims" SET "statement" = $stmt$The Quran permits fighting those who fight you in the way of God, but prohibits transgressing limits — God does not love those who go beyond what is necessary; many scholars read this verse as setting the limits of defensive warfare, while others read it differently.$stmt$,
  "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$the quran permits fighting those who fight you in the way of god, but prohibits transgressing limits — god does not love those who go beyond what is necessary; many scholars read this verse as setting the limits of defensive warfare, while others read it differently.$n$, 'UTF8')), 'hex')
WHERE "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$the quran permits fighting those who fight you in the way of god, but prohibits transgressing limits — god does not love those who go beyond what is necessary; this establishes the foundational quranic principle of defensive jihad.$n$, 'UTF8')), 'hex');

UPDATE "claims" SET "statement" = $stmt$Men are declared to be in charge of (qawwamun) women by virtue of what God has given one over the other and because men provide for women from their wealth — pre-modern commentators generally read this as men's authority over women in marriage, though not uniformly, while many modern Muslim scholars read it differently, for example as men's duty of financial support.$stmt$,
  "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$men are declared to be in charge of (qawwamun) women by virtue of what god has given one over the other and because men provide for women from their wealth — pre-modern commentators generally read this as men's authority over women in marriage, though not uniformly, while many modern muslim scholars read it differently, for example as men's duty of financial support.$n$, 'UTF8')), 'hex')
WHERE "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$men are declared to be in charge of (qawwamun) women by virtue of what god has given one over the other and because men provide for women from their wealth — the quranic basis for male guardianship in islamic law.$n$, 'UTF8')), 'hex');

UPDATE "claims" SET "statement" = $stmt$Jesus is declared to be the Christ, the Son of the living God — Peter's confession of his messianic identity, which Jesus affirms as revealed by the Father in heaven.$stmt$,
  "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$jesus is declared to be the christ, the son of the living god — peter's confession of his messianic identity, which jesus affirms as revealed by the father in heaven.$n$, 'UTF8')), 'hex')
WHERE "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$jesus is declared to be the christ, the son of the living god — the first explicit apostolic confession of his divine messianic identity, which jesus affirms as revealed by the father in heaven.$n$, 'UTF8')), 'hex');

UPDATE "claims" SET "statement" = $stmt$Isaiah prophesies a child born to be king, bearing the names Wonderful Counsellor, Mighty God, Everlasting Father, Prince of Peace in the Christian rendering — his government and peace shall have no end, established on the throne of David. Jewish tradition reads the passage differently, for example as describing Hezekiah or as praising God, and translates the names differently.$stmt$,
  "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$isaiah prophesies a child born to be king, bearing the names wonderful counsellor, mighty god, everlasting father, prince of peace in the christian rendering — his government and peace shall have no end, established on the throne of david. jewish tradition reads the passage differently, for example as describing hezekiah or as praising god, and translates the names differently.$n$, 'UTF8')), 'hex')
WHERE "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$isaiah prophesies a child born to be king, bearing the names wonderful counsellor, mighty god, everlasting father, prince of peace — his government and peace shall have no end, established on the throne of david.$n$, 'UTF8')), 'hex');

UPDATE "claims" SET "statement" = $stmt$Jesus dies on the cross crying "My God, my God, why have you forsaken me?" — quoting Psalm 22:1 — and gives up his spirit; Christians understand his death as the atoning sacrifice for the sins of all humanity, confirmed by the resurrection three days later.$stmt$,
  "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$jesus dies on the cross crying "my god, my god, why have you forsaken me?" — quoting psalm 22:1 — and gives up his spirit; christians understand his death as the atoning sacrifice for the sins of all humanity, confirmed by the resurrection three days later.$n$, 'UTF8')), 'hex')
WHERE "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$jesus dies on the cross crying "my god, my god, why have you forsaken me?" — quoting psalm 22:1 — and gives up his spirit; his death is the atoning sacrifice for the sins of all humanity, confirmed by the resurrection three days later.$n$, 'UTF8')), 'hex');

DO $relink$
DECLARE cid integer;
BEGIN
  SELECT "id" INTO cid FROM "claims"
   WHERE "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$jesus dies on the cross crying "my god, my god, why have you forsaken me?" — quoting psalm 22:1 — and gives up his spirit; christians understand his death as the atoning sacrifice for the sins of all humanity, confirmed by the resurrection three days later.$n$, 'UTF8')), 'hex');
  IF cid IS NULL THEN RETURN; END IF;
  -- Only replace the citation when every new passage exists in this database.
  IF (SELECT count(*) FROM (VALUES ('Matthew', 27, 46)) AS w(book, chapter, verse)
        WHERE EXISTS (SELECT 1 FROM "verses" v JOIN "sources" s ON s."id" = v."sourceId"
                       WHERE s."key" = 'NEW_TESTAMENT' AND v."book" = w.book AND v."chapter" = w.chapter AND v."verse" = w.verse))
     <> 1 THEN
    RETURN;
  END IF;
  DELETE FROM "claim_verses" WHERE "claimId" = cid;
  INSERT INTO "claim_verses" ("claimId", "verseId", "isPrimary")
  SELECT cid, picked."id", picked.ord = 1
    FROM (VALUES ('Matthew', 27, 46, 1)) AS w(book, chapter, verse, ord)
    JOIN LATERAL (SELECT v."id", w.ord FROM "verses" v JOIN "sources" s ON s."id" = v."sourceId"
                   WHERE s."key" = 'NEW_TESTAMENT' AND v."book" = w.book AND v."chapter" = w.chapter AND v."verse" = w.verse
                   ORDER BY v."id" LIMIT 1) picked ON true;
END
$relink$;

DO $relink$
DECLARE cid integer;
BEGIN
  SELECT "id" INTO cid FROM "claims"
   WHERE "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$peter uses the days of noah and the ark as a type of christian salvation through baptism — as eight people were saved through water, so baptism now saves believers through the resurrection of jesus christ.$n$, 'UTF8')), 'hex');
  IF cid IS NULL THEN RETURN; END IF;
  -- Only replace the citation when every new passage exists in this database.
  IF (SELECT count(*) FROM (VALUES ('1 Peter', 3, 20), ('1 Peter', 3, 21)) AS w(book, chapter, verse)
        WHERE EXISTS (SELECT 1 FROM "verses" v JOIN "sources" s ON s."id" = v."sourceId"
                       WHERE s."key" = 'NEW_TESTAMENT' AND v."book" = w.book AND v."chapter" = w.chapter AND v."verse" = w.verse))
     <> 2 THEN
    RETURN;
  END IF;
  DELETE FROM "claim_verses" WHERE "claimId" = cid;
  INSERT INTO "claim_verses" ("claimId", "verseId", "isPrimary")
  SELECT cid, picked."id", picked.ord = 1
    FROM (VALUES ('1 Peter', 3, 20, 1), ('1 Peter', 3, 21, 2)) AS w(book, chapter, verse, ord)
    JOIN LATERAL (SELECT v."id", w.ord FROM "verses" v JOIN "sources" s ON s."id" = v."sourceId"
                   WHERE s."key" = 'NEW_TESTAMENT' AND v."book" = w.book AND v."chapter" = w.chapter AND v."verse" = w.verse
                   ORDER BY v."id" LIMIT 1) picked ON true;
END
$relink$;

UPDATE "claims" SET "statement" = $stmt$Paul argues that a person is a true Jew inwardly, and that true circumcision is of the heart, by the Spirit rather than by the letter — outward circumcision of the flesh is not what makes someone one of God's people.$stmt$,
  "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$paul argues that a person is a true jew inwardly, and that true circumcision is of the heart, by the spirit rather than by the letter — outward circumcision of the flesh is not what makes someone one of god's people.$n$, 'UTF8')), 'hex')
WHERE "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$paul argues that true circumcision is of the heart, by the spirit — the physical circumcision of the flesh is not required for gentile christians, and those who insist on it are mutilating themselves.$n$, 'UTF8')), 'hex');

DO $relink$
DECLARE cid integer;
BEGIN
  SELECT "id" INTO cid FROM "claims"
   WHERE "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$paul argues that a person is a true jew inwardly, and that true circumcision is of the heart, by the spirit rather than by the letter — outward circumcision of the flesh is not what makes someone one of god's people.$n$, 'UTF8')), 'hex');
  IF cid IS NULL THEN RETURN; END IF;
  -- Only replace the citation when every new passage exists in this database.
  IF (SELECT count(*) FROM (VALUES ('Romans', 2, 28), ('Romans', 2, 29)) AS w(book, chapter, verse)
        WHERE EXISTS (SELECT 1 FROM "verses" v JOIN "sources" s ON s."id" = v."sourceId"
                       WHERE s."key" = 'NEW_TESTAMENT' AND v."book" = w.book AND v."chapter" = w.chapter AND v."verse" = w.verse))
     <> 2 THEN
    RETURN;
  END IF;
  DELETE FROM "claim_verses" WHERE "claimId" = cid;
  INSERT INTO "claim_verses" ("claimId", "verseId", "isPrimary")
  SELECT cid, picked."id", picked.ord = 1
    FROM (VALUES ('Romans', 2, 28, 1), ('Romans', 2, 29, 2)) AS w(book, chapter, verse, ord)
    JOIN LATERAL (SELECT v."id", w.ord FROM "verses" v JOIN "sources" s ON s."id" = v."sourceId"
                   WHERE s."key" = 'NEW_TESTAMENT' AND v."book" = w.book AND v."chapter" = w.chapter AND v."verse" = w.verse
                   ORDER BY v."id" LIMIT 1) picked ON true;
END
$relink$;

UPDATE "claims" SET "statement" = $stmt$The Quran calls believers to follow the religion of Ibrahim as a hanif (pure monotheist) and says God took Ibrahim as a close friend; circumcision is not mentioned in the Quran, but Islamic tradition, drawing on the hadith, counts it among the practices of the fitra (natural human state), though jurists differ on whether it is obligatory.$stmt$,
  "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$the quran calls believers to follow the religion of ibrahim as a hanif (pure monotheist) and says god took ibrahim as a close friend; circumcision is not mentioned in the quran, but islamic tradition, drawing on the hadith, counts it among the practices of the fitra (natural human state), though jurists differ on whether it is obligatory.$n$, 'UTF8')), 'hex')
WHERE "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$the quran commands believers to follow the religion of ibrahim as a hanif (pure monotheist), the same ibrahim whom god chose as a close friend — islamic tradition understands this to include circumcision as part of the fitra (natural human state).$n$, 'UTF8')), 'hex');

DO $relink$
DECLARE cid integer;
BEGIN
  SELECT "id" INTO cid FROM "claims"
   WHERE "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$the quran calls believers to follow the religion of ibrahim as a hanif (pure monotheist) and says god took ibrahim as a close friend; circumcision is not mentioned in the quran, but islamic tradition, drawing on the hadith, counts it among the practices of the fitra (natural human state), though jurists differ on whether it is obligatory.$n$, 'UTF8')), 'hex');
  IF cid IS NULL THEN RETURN; END IF;
  -- Only replace the citation when every new passage exists in this database.
  IF (SELECT count(*) FROM (VALUES ('Al-Baqarah', 2, 135), ('An-Nisa', 4, 125)) AS w(book, chapter, verse)
        WHERE EXISTS (SELECT 1 FROM "verses" v JOIN "sources" s ON s."id" = v."sourceId"
                       WHERE s."key" = 'QURAN' AND v."book" = w.book AND v."chapter" = w.chapter AND v."verse" = w.verse))
     <> 2 THEN
    RETURN;
  END IF;
  DELETE FROM "claim_verses" WHERE "claimId" = cid;
  INSERT INTO "claim_verses" ("claimId", "verseId", "isPrimary")
  SELECT cid, picked."id", picked.ord = 1
    FROM (VALUES ('Al-Baqarah', 2, 135, 1), ('An-Nisa', 4, 125, 2)) AS w(book, chapter, verse, ord)
    JOIN LATERAL (SELECT v."id", w.ord FROM "verses" v JOIN "sources" s ON s."id" = v."sourceId"
                   WHERE s."key" = 'QURAN' AND v."book" = w.book AND v."chapter" = w.chapter AND v."verse" = w.verse
                   ORDER BY v."id" LIMIT 1) picked ON true;
END
$relink$;

UPDATE "claims" SET "statement" = $stmt$The New Testament reads Isaiah's Suffering Servant as a prophecy of Jesus Christ — in Acts, Philip explains Isaiah 53 to an Ethiopian official as pointing to Jesus — understood as fulfilled in his rejection, crucifixion, and atoning death. Jewish tradition reads the Servant differently: Rashi and many medieval commentators take him to be the people of Israel, while some earlier rabbinic sources read the passage of the Messiah.$stmt$,
  "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$the new testament reads isaiah's suffering servant as a prophecy of jesus christ — in acts, philip explains isaiah 53 to an ethiopian official as pointing to jesus — understood as fulfilled in his rejection, crucifixion, and atoning death. jewish tradition reads the servant differently: rashi and many medieval commentators take him to be the people of israel, while some earlier rabbinic sources read the passage of the messiah.$n$, 'UTF8')), 'hex')
WHERE "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$the new testament reads isaiah's suffering servant as a direct prophecy of jesus christ — fulfilled in his rejection, crucifixion, and the healing of humanity through his atoning death.$n$, 'UTF8')), 'hex');

DO $relink$
DECLARE cid integer;
BEGIN
  SELECT "id" INTO cid FROM "claims"
   WHERE "contentHash" = encode(sha256(convert_to("sourceId"::text || '::' || $n$the new testament reads isaiah's suffering servant as a prophecy of jesus christ — in acts, philip explains isaiah 53 to an ethiopian official as pointing to jesus — understood as fulfilled in his rejection, crucifixion, and atoning death. jewish tradition reads the servant differently: rashi and many medieval commentators take him to be the people of israel, while some earlier rabbinic sources read the passage of the messiah.$n$, 'UTF8')), 'hex');
  IF cid IS NULL THEN RETURN; END IF;
  -- Only replace the citation when every new passage exists in this database.
  IF (SELECT count(*) FROM (VALUES ('Acts', 8, 32), ('Acts', 8, 35)) AS w(book, chapter, verse)
        WHERE EXISTS (SELECT 1 FROM "verses" v JOIN "sources" s ON s."id" = v."sourceId"
                       WHERE s."key" = 'NEW_TESTAMENT' AND v."book" = w.book AND v."chapter" = w.chapter AND v."verse" = w.verse))
     <> 2 THEN
    RETURN;
  END IF;
  DELETE FROM "claim_verses" WHERE "claimId" = cid;
  INSERT INTO "claim_verses" ("claimId", "verseId", "isPrimary")
  SELECT cid, picked."id", picked.ord = 1
    FROM (VALUES ('Acts', 8, 32, 1), ('Acts', 8, 35, 2)) AS w(book, chapter, verse, ord)
    JOIN LATERAL (SELECT v."id", w.ord FROM "verses" v JOIN "sources" s ON s."id" = v."sourceId"
                   WHERE s."key" = 'NEW_TESTAMENT' AND v."book" = w.book AND v."chapter" = w.chapter AND v."verse" = w.verse
                   ORDER BY v."id" LIMIT 1) picked ON true;
END
$relink$;
