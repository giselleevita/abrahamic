# Licensing — public engineering demo

This repository powers a **technical portfolio demo**, not a commercial scripture app.

## Design goal

Show **as much of the platform as possible** (data model, UI, comparisons, search, admin) while **not redistributing modern copyrighted translations** on a public URL.

## Verse text on public deploy

Enforced in `prisma/seed/translation-policy.ts` when you run `npm run db:seed`:

### Allowed (seeded and shown)

| Name | Use |
|------|-----|
| **Hebrew (MT)** | Original-language Tanakh excerpts |
| **Arabic** | Original-language Qur'an excerpts |
| **JPS 1917** | English Tanakh (public domain in the US) |
| **KJV** | English Bible (public domain) |

### Blocked (never seeded; deleted if found)

| Name | Reason |
|------|--------|
| **JPS 1985** | Copyrighted (Jewish Publication Society) |
| **ESV** | Copyrighted (Crossway) |
| **Sahih International** | Copyrighted modern translation |
| **Yusuf Ali** | Copyright / rights vary; excluded for safety |

## Everything else stays rich

The seed still loads (editorial, not third-party translation):

- Sources, books, chapters, verse references
- Figures, relationships, legacy notes
- Themes, concepts, timeline events
- Comparisons and tagged claims (paraphrased statements)
- Verse cross-links

Claims are **original summaries** pointing at verse references — not pasted translation text.

## Production checklist

```bash
npm run db:deploy   # migrations
npm run db:seed     # applies public-demo translation filter
```

On Vercel:

```bash
vercel env run --environment production -- npm run db:deploy
vercel env run --environment production -- npm run db:seed
```

## UI notice

The site shows a banner linking to `/licensing` explaining the public-demo scope.

## Not legal advice

This policy reflects a conservative portfolio posture. A commercial scripture product would need publisher agreements per translation and jurisdiction.
