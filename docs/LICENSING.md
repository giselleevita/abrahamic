# Content policy — no publisher licenses required

The public demo is designed so you **do not need to pay for or negotiate translation licenses**.

## What visitors see

| Content type | Source | License needed? |
|--------------|--------|-----------------|
| Figures, themes, timeline, comparisons, claims | Written for this demo | No |
| Reader notes (English) | Original project text | No |
| World English Bible | [eBible.org](https://ebible.org/find/show.php?id=engwebp) | Public domain |
| Hebrew Tanakh | “Tanach with Nikkud” via [Sefaria](https://www.sefaria.org/texts/Tanakh) | Upstream reports public domain for each imported chapter |
| Arabic Quran text | AlQuran Cloud Uthmani text | Displayed with source attribution under its published terms |
| JPS 1985, ESV, KJV, Yusuf Ali, Sahih, etc. | **Not seeded, not served** | N/A |

## Verse display model

1. **Public-domain edition** — World English Bible where present.
2. **Original language** — Hebrew (Tanakh) in its own Masoretic numbering or Arabic (Qur'an).
3. **Reader note (original)** — short English context written for the demo; explicitly **not** scripture translation text.

Seed and API layers enforce this via `src/lib/public-demo-policy.ts`. Hebrew is
not automatically paired with an English verse of the same number: the schemes
can differ even when their chapter lengths match.

## Re-seed production

```bash
npm run db:seed
```

This deletes removed translation names and rebuilds reader notes.

## Local development

The full `verses.ts` dataset still contains reference translation names for development comparison, but `buildPublicDemoTranslations()` strips them at seed time.

## Terms last checked: 22 October 2026

| Source | What its terms say | How the project meets it |
|--------|--------------------|--------------------------|
| AlQuran Cloud (Arabic Uthmani text) | Free to reproduce and display; a source acknowledgement is requested; text must not be altered or mixed with non-Quranic material in a misleading way; credits Tanzil.net and Quran Academy | Stored attribution credits all three; text is imported verbatim |
| World English Bible (eBible.org) | Public domain; the name "World English Bible" is a trademark and may not be used for a modified text | Text is imported unchanged and keeps its name |
| Sefaria "Tanach with Nikkud" | The Sefaria landing page does not state a licence for this text | The importer reads the licence Sefaria reports for each chapter and **refuses to import** anything that is not public domain |

These were read from the providers' public pages and are a summary, not a legal opinion. Re-check them before any commercial use,
and if a provider changes its terms.

## Not legal advice

This is a conservative portfolio posture. Commercial scripture products need independent legal review.
