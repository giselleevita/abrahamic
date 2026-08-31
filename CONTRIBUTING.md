# Contributing

Thanks for considering a contribution to Abrahamic Texts.

## Getting set up

```bash
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

See the [README](README.md#getting-started) for environment variables and deployment notes.

## Before opening a PR

Run the same checks CI runs:

```bash
npx tsc --noEmit
npm run lint -- --max-warnings 0
npm test
npx next build
```

All four must pass. If you touched `prisma/schema.prisma`, include a generated migration (`npx prisma migrate dev`) rather than hand-written SQL.

## Code style

- TypeScript, strict typing — avoid `any`.
- Match the existing structure: pages in `src/app`, shared UI in `src/components`, data access and pure logic in `src/lib`.
- Prefer pure, unit-testable functions in `src/lib` for anything that isn't a React component or a route handler; add a `*.test.ts` next to it (see `src/lib/*.test.ts` for examples, Vitest).

## Editorial and sourcing standards

This project compares scripture and religious tradition across Judaism, Christianity, and Islam. Content changes carry a higher bar than typical code changes:

- **Claims and comparisons must be attributable** — a claim (`prisma/seed/claims.ts` or the admin UI) should be traceable to a verse, source, or citation, not editorial opinion presented as fact.
- **Neutral framing across traditions.** Comparisons should describe each tradition's position in terms that adherents of that tradition would recognize as accurate, even when traditions disagree. Don't frame one tradition's account as more "true" than another's.
- **No licensed translation text in the public-demo path.** If you touch `src/lib/public-demo-policy.ts`, `src/lib/filter-public-translations.ts`, or seed data, keep it consistent with [`docs/LICENSING.md`](docs/LICENSING.md) — the public deployment must never serve JPS/KJV/ESV/Yusuf Ali/Sahih International (or any other licensed) text. There's test coverage for this in `src/lib/public-demo-policy.test.ts`; extend it if you add a new translation source.
- If you're unsure whether a change is editorially sensitive, say so in the PR description and ask for another set of eyes before merging.

## Reporting bugs / requesting features

Use GitHub Issues. For content-accuracy issues specifically (a claim, citation, or comparison that looks wrong), say which claim/figure/verse and what's inaccurate — that's usually enough to act on.

## Security issues

Do not open a public issue for a security vulnerability — see [`SECURITY.md`](SECURITY.md).
