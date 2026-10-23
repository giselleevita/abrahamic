-- Preserve legacy records for editorial inspection. Match repository seed identities and notes only.
WITH known("fromSlug", "toSlug", kind, note) AS (VALUES
('kedar','adnan','PARENT','[Sirah: Islamic historical tradition] Ancestor of Muhammad through the Quraysh tribe'),
('adnan','umayyah','PARENT','[Sirah al-Ibn Hisham]'),
('umayyah','murrah','PARENT','[Sirah al-Ibn Hisham]'),
('murrah','kaab','PARENT','[Sirah al-Ibn Hisham]'),
('kaab','luayy','PARENT','[Sirah al-Ibn Hisham]'),
('luayy','ghalib','PARENT','[Sirah al-Ibn Hisham]'),
('ghalib','fihr','PARENT','[Sirah al-Ibn Hisham] Founder of Quraysh tribe'),
('fihr','malik','PARENT','[Sirah al-Ibn Hisham]'),
('malik','nadhr','PARENT','[Sirah al-Ibn Hisham]'),
('nadhr','kinana','PARENT','[Sirah al-Ibn Hisham]'),
('kinana','khuzaymah','PARENT','[Sirah al-Ibn Hisham]'),
('khuzaymah','mudrika','PARENT','[Sirah al-Ibn Hisham]'),
('mudrika','ilyas','PARENT','[Sirah al-Ibn Hisham]'),
('ilyas','mudar','PARENT','[Sirah al-Ibn Hisham]'),
('mudar','nizar','PARENT','[Sirah al-Ibn Hisham]'),
('nizar','maad','PARENT','[Sirah al-Ibn Hisham]'),
('maad','qais','PARENT','[Sirah al-Ibn Hisham]'),
('qais','qahtan','PARENT','[Sirah al-Ibn Hisham]'),
('qahtan','hashim','PARENT','[Sirah al-Ibn Hisham] Muhammad''s great-grandfather; founder of Hashim clan'),
('hashim','abdul-muttalib','PARENT','[Hadith tradition]'),
('abdul-muttalib','abdullah','PARENT','[Hadith tradition]'),
('abdullah','muhammad','PARENT','[Qur''an 3:144, 33:40] Muhammad''s father'),
('zerubbabel','abijah-nt','PARENT',NULL),
('abijah-nt','eliakim','PARENT',NULL),
('jacob-nt','joseph','PARENT',NULL),
('joseph','jesus','PARENT','Earthly father (Matthew genealogy)'),
('jesus','james-the-less','SIBLING','Brother (according to some traditions)'),
('jesus','peter','CHILD','Spiritual relationship'),
('jesus','james-the-greater','CHILD','Spiritual relationship'),
('jesus','john','CHILD','Spiritual relationship'),
('abraham','lot','CHILD','Nephew'),
('terah','sarah','CHILD','Daughter (some sources)'),
('hagar','ishmael','SPOUSE','Mother of Ishmael'),
('sarah','isaac','SPOUSE','Mother of Isaac'),
('rebekah','jacob','SPOUSE','Mother of Jacob'),
('rebekah','esau','SPOUSE','Mother of Esau'),
('mary-of-nazareth','jesus','SPOUSE','Mother')
)
UPDATE figure_relations r SET notes = '[EDITORIAL HOLD] ' || COALESCE(r.notes, 'Identity or source attribution requires verification.')
FROM known k, figures f, figures t
WHERE r."fromFigureId" = f.id AND r."toFigureId" = t.id
  AND f.slug = k."fromSlug" AND t.slug = k."toSlug" AND r."relationType"::text = k.kind
  AND (r.notes IS NOT DISTINCT FROM k.note OR (k.note IS NOT NULL AND r.notes = k.note || ' Recorded reference: Matthew 1:16 (passage not loaded in this demonstration).')
    OR (k.note IS NULL AND r.notes LIKE 'Recorded reference: Matthew 1:% (passage not loaded in this demonstration).'));

-- Insert corrected mother/child categories only where the exact erroneous seed row was held.
-- Never overwrite an existing independently edited PARENT record.
WITH mothers("fromSlug", "toSlug", note, source, book, chapter, verse) AS (VALUES
('hagar','ishmael','Mother of Ishmael','TORAH','Genesis',16,15),
('sarah','isaac','Mother of Isaac','TORAH','Genesis',21,3),
('rebekah','jacob','Mother of Jacob','TORAH','Genesis',25,26),
('rebekah','esau','Mother of Esau','TORAH','Genesis',25,25),
('mary-of-nazareth','jesus','Mother','NEW_TESTAMENT','Luke',2,7)
)
INSERT INTO figure_relations ("fromFigureId", "toFigureId", "relationType", notes, "sourceId", "verseId")
SELECT f.id, t.id, 'PARENT', m.note || ' Recorded reference: ' || m.book || ' ' || m.chapter || ':' || m.verse || '.', s.id, v.id
FROM mothers m JOIN figures f ON f.slug = m."fromSlug" JOIN figures t ON t.slug = m."toSlug"
JOIN sources s ON s.key::text = m.source
JOIN figure_relations old ON old."fromFigureId" = f.id AND old."toFigureId" = t.id AND old."relationType" = 'SPOUSE'
LEFT JOIN verses v ON v."referenceKey" = m.source || '.' || m.book || '.' || m.chapter || '.' || m.verse AND v.versification = 'CHRISTIAN'
WHERE old.notes = '[EDITORIAL HOLD] ' || m.note
ON CONFLICT ("fromFigureId", "toFigureId", "relationType") DO NOTHING;
