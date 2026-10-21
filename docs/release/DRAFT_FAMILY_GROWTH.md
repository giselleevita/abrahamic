# Draft: growing the family tree (people, mothers, New Testament holds)

**Status: DRAFT PROPOSALS. Nothing here is seeded, published or applied.** AI-assisted. A qualified editor must check each citation against the loaded edition and decide each open question before any of it becomes a seed change or database row. When approved, the people go in as **unpublished** figures first, with a test proving the public queries exclude them until they are published.

## 0. What is wrong today (verified in the repository)

`prisma/seed/figures.ts` has no figure for any of these slugs: `seth`, `enosh`, `terah`, `nahor`, `haran`, `sarah`, `rebekah`, `esau`, `reuben`, `simeon`, `levi`, `judah`, `issachar`, `zebulun`, `gad`, `asher`, `dan`, `naphtali`, `benjamin`.

Yet other seed files already refer to them:

| File | What refers to the missing slug | Effect today |
| --- | --- | --- |
| `prisma/seed/relationships.ts` | Parent links `adam→seth`, `seth→enosh`, `nahor→terah`, `terah→abraham`, `isaac→esau`, `jacob→` each of the eleven sons other than Joseph, `sarah→isaac`, `rebekah→jacob/esau`, `terah→sarah` | `seedFigureRelationships` looks both figures up and silently skips the row when either is missing, so none of these links exist on the site. |
| `prisma/seed/family-policy.ts` (`MOTHER_REFERENCES`) | `sarah→isaac`, `rebekah→jacob`, `rebekah→esau` | The corrections added in the last release have nothing to attach to for these three, and the migration `20261019173000_family_content_corrections` inserts rows that only matter once the figures exist. |
| `prisma/seed/legacy.ts` | `sarah`, `rebekah` legacy text | Updates nothing: there is no figure. |

That is the "three-way mismatch": relationships, mother references and legacy text agree on `sarah`/`rebekah`, but the figures table has neither. The fix is to add the figures, not to rename the slugs.

A second collision is separate and more serious: the slug `joseph` is Jacob's son in `jacob-joseph`, `joseph-manasseh`, `joseph-ephraim`, and also the husband of Mary in `jacob-nt-joseph` and `joseph-jesus`. See section 3.

## 1. Proposed people (Genesis citations)

Citations use the same chapter and verse numbers as the existing `relationshipVerses` map. The reviewer should confirm each against the loaded Hebrew text, not a translation.

| Slug | Name | Role to record | Citation |
| --- | --- | --- | --- |
| `seth` | Seth | Third son of Adam named in Genesis; father of Enosh | Genesis 4:25; 5:3; 5:6 |
| `enosh` | Enosh | Son of Seth | Genesis 5:6 |
| `nahor` | Nahor (grandfather) | Father of Terah. Not to be confused with Terah's son Nahor | Genesis 11:24 |
| `terah` | Terah | Father of Abram, Nahor and Haran | Genesis 11:24–27 |
| `sarah` | Sarah (Sarai) | Wife of Abraham; her name changed from Sarai | Genesis 11:29; 17:15 |
| `rebekah` | Rebekah | Daughter of Bethuel; wife of Isaac | Genesis 22:23; 24:15; 25:20 |
| `esau` | Esau (Edom) | Elder twin son of Isaac and Rebekah | Genesis 25:25; 36:1 |
| `reuben` | Reuben | Son of Jacob and Leah | Genesis 29:32 |
| `simeon` | Simeon | Son of Jacob and Leah | Genesis 29:33 |
| `levi` | Levi | Son of Jacob and Leah | Genesis 29:34 |
| `judah` | Judah | Son of Jacob and Leah | Genesis 29:35 |
| `dan` | Dan | Son of Jacob and Bilhah | Genesis 30:6 |
| `naphtali` | Naphtali | Son of Jacob and Bilhah | Genesis 30:8 |
| `gad` | Gad | Son of Jacob and Zilpah | Genesis 30:11 |
| `asher` | Asher | Son of Jacob and Zilpah | Genesis 30:13 |
| `issachar` | Issachar | Son of Jacob and Leah | Genesis 30:17 |
| `zebulun` | Zebulun | Son of Jacob and Leah | Genesis 30:20 |
| `benjamin` | Benjamin | Son of Jacob and Rachel | Genesis 35:18 |

Cross-check for the twelve sons: the list at Genesis 35:22–26 (and 46:8–27) should agree with the table. The seed's Joseph link cites 30:23.

Relations to add once the figures exist (all `PARENT` unless noted; all already written in the seed, so no new claims):

- `adam→seth`, `seth→enosh`, `nahor→terah`, `terah→abraham`
- `sarah→isaac` (mother; Genesis 21:2–3), `rebekah→jacob` (25:26), `rebekah→esau` (25:25), `isaac→esau` (25:25)
- `jacob→` each of the eleven sons above, with the verse in the table
- Spouse links are **not** in the seed and need their own check: Abraham–Sarah (Genesis 11:29), Isaac–Rebekah (Genesis 24:67; 25:20).

### Open questions the editor must decide

1. **Terah and Sarah.** The seed has `terah→sarah` as `CHILD`, "Daughter (some sources)". Genesis 20:12 is Abraham's own statement that Sarah is "the daughter of my father but not of my mother". Genesis 11:29 names Haran's daughters Milcah and Iscah, and a rabbinic tradition identifies Iscah with Sarah. This is a tradition-attributed or speaker-attributed claim, not a plain genealogy row. Recommendation: keep it **held** unless worded as "Abraham says in Genesis 20:12…".
2. **The name "Nahor".** Two people share it (Terah's father and Terah's son). The seed slug `nahor` is used once, as `nahor→terah`. Give the two different slugs before adding either.
3. **Names in other traditions.** Do **not** add Islamic aliases unless a text supplies them. In the Quran, Abraham's wife and Isaac's wife are not named. Esau is not named. Jacob and Joseph are named, and "the tribes" (al-asbāṭ, for example 2:136) are mentioned without naming each son. Record "not named in the Quran" rather than inventing an alias. The reviewer should confirm each of these against the Arabic.
4. **Christian references.** Sarah, Rebekah and Esau appear in the New Testament (for example Romans 9:6–13 for Rebekah and Esau; Galatians 4:22–31 for Sarah and Hagar; Hebrews 11:11). Quote none of it; cite by reference only, since no licensed translation may appear.

## 2. Mother links: what changes once Sarah and Rebekah exist

No new seed lines are needed. The existing `MOTHER_REFERENCES` already carry the corrected type (`PARENT`) and citation keys (`sarah-isaac` Genesis 21:3, `rebekah-jacob` 25:26, `rebekah-esau` 25:25). Proposed check when approved: a seed test that runs `normalizeFamilyEntry` for these entries and asserts that after seeding a `PARENT` relation exists for each pair with a non-null verse reference.

## 3. New Testament holds

The following are currently stored but withheld (`[EDITORIAL HOLD]`). This section only describes what a decision would need. It resolves nothing.

| Held entry | Problem found in the seed | What the editor must decide |
| --- | --- | --- |
| `zerubbabel→abijah-nt` (key `zerubbabel-abijah-nt`) | The seed calls Zerubbabel's son "Abijah", but Matthew 1:13 names Abiud (Abihud). "Abijah" is a different person elsewhere in the same genealogy (Matthew 1:7). The slug `abijah-nt` collides in meaning. | Rename to the Matthew spelling (for example `abiud-nt`) and cite Matthew 1:13. |
| `abijah-nt→eliakim` | Same slug problem; Matthew 1:13 gives Abiud as the father of Eliakim. | Same rename. |
| `jacob-nt→joseph` | Matthew 1:16 says Jacob fathered Joseph, husband of Mary. Luke 3:23 gives a different father (Heli) for Joseph, as "was supposed". Also uses the Genesis slug `joseph`. | Whether to show Matthew's line only, attributed as "Matthew's genealogy", and whether to show Luke's line separately. Needs its own slug (below). |
| `joseph→jesus` | Points from the Genesis patriarch Joseph to Jesus, which is wrong whatever the answer on Matthew. Matthew 1:16 and Luke 3:23 describe Joseph, Mary's husband, and Christian tradition holds that Jesus was not Joseph's biological son. | Replace with a relation from Mary's husband, worded as "legal or supposed father (Matthew 1:16; Luke 3:23)". |
| `jesus→james-the-less` (`SIBLING`) | The seed's slug names James the Less, a different New Testament person from "James, brother of the Lord" (Galatians 1:19; Mark 6:3). | Which James is meant, and whether this belongs in a family table at all given that traditions differ on the meaning of "brother". |

Proposed new figure, for the editor to approve: `joseph-husband-of-mary`, "Joseph of Nazareth", cited at Matthew 1:16, 1:18–25 and Luke 2:4. The Quran does not name him. This removes the slug collision. Do not reuse the slug `joseph` for him.

Not touched here: the `CHILD`-typed "spiritual" links to apostles, and the Lot link, which stay held under the existing correction log.

## 4. Videos

Three candidate videos are seeded unpublished (`prisma/seed/videos.ts`). They stay unpublished. Publishing requires a named person to watch each one in full and record that in the admin queue. I have not watched them and cannot.

## 5. How to land this safely (after approval)

1. Add the approved figures to the seed as unpublished (or not-yet-public) with their relations.
2. Write a test first: a seeded database contains no public relation to an unpublished figure, and the held rows stay excluded.
3. Run the existing public-query tests, `tsc`, eslint, vitest and the e2e suite.
4. Publish figure by figure through the admin tool so the audit trail records the editor.
