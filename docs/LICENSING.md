# Content policy — no publisher licenses required

The public demo is designed so you **do not need to pay for or negotiate translation licenses**.

## What visitors see

| Content type | Source | License needed? |
|--------------|--------|-----------------|
| Figures, themes, timeline, comparisons, claims | Written for this demo | No |
| Reader notes (English) | Original project text | No |
| Hebrew / Arabic verse text | Source-language text in seed | No translation license |
| JPS 1985, ESV, KJV, Yusuf Ali, Sahih, etc. | **Not seeded, not served** | N/A |

## Verse display model

1. **Original language** — Hebrew (Tanakh) or Arabic (Qur'an) where available  
2. **Reader note (original)** — short English context written for the demo; explicitly **not** scripture translation text  

Seed and API layers enforce this via `src/lib/public-demo-policy.ts`.

## Re-seed production

```bash
npm run db:seed
```

This deletes removed translation names and rebuilds reader notes.

## Local development

The full `verses.ts` dataset still contains reference translation names for development comparison, but `buildPublicDemoTranslations()` strips them at seed time.

## Not legal advice

This is a conservative portfolio posture. Commercial scripture products need independent legal review.
