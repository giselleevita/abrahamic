-- Repair only the known seed note. Quran 21:76 concerns Noah, not Ishmael.
UPDATE figure_relations r
SET notes = 'Genesis 25:13 records Kedar among the sons of Ishmael.'
FROM figures f, figures t
WHERE r."fromFigureId" = f.id AND r."toFigureId" = t.id
  AND f.slug = 'ishmael' AND t.slug = 'kedar' AND r."relationType" = 'PARENT'
  AND r.notes IN (
    'Gen 25:13 (Torah); Qur''an 21:76 mentions Isma''il',
    'Gen 25:13 (Torah); Qur''an 21:76 mentions Isma''il Recorded reference: Genesis 25:13 (passage not loaded in this demonstration).'
  );
