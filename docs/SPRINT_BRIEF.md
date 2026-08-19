# Act I — Operating Brief

The standing instruction for this work. Re-read before each session.

---

## The one thing

The platform holds **94 verses against a canon of ~37,000** — 0.25%. Four phases of
engineering sit on a dataset that fits on one screen. Act I closes that gap and builds
the architecture that can serve it.

Every task below is judged by one question: *does this still work at 37,000 verses?*
If a change is invisible at 94 and fatal at 37,000, it is Act I work. If it is merely
nice, it is not.

## Order of work, and why

1. **Caching architecture** — `force-dynamic` in 39 files including the root layout.
   Nothing is cacheable; every request hits Postgres. Also the root cause of
   `notFound()` returning HTTP 200. One change fixes cost, latency, and SEO
   correctness. Do this first: everything after it is cheaper.
2. **Search** — `ILIKE '%q%'` across six tables, no index. Fine at 150 rows,
   unservable at 100,000+. Rebuild on Postgres FTS before the corpus lands, not after.
3. **RTL** — the app ships Hebrew and Arabic and sets `dir` nowhere. A real
   correctness bug, cheap to fix, embarrassing to ship at scale.
4. **Ingestion** — an idempotent importer carrying provenance, so "where did this text
   come from and under what licence" is answerable per row, forever.

## Rules

**Verify, do not assume.** A test that passes for the wrong reason is worse than no
test. When something is meant to be blocked, first prove it leaks with the guard off —
a canary that never leaks proves nothing. When a page is meant to 404, check the status
code *and* the body. Measure before and after; state real numbers.

**Test at every step, and make the test fail first.** Every change lands with a test
that would catch its regression. If a new test passes immediately against the old code,
it is testing nothing — change it until it fails, then fix the code.

**Preserve what is already enforced.** Three invariants are load-bearing and must
survive every change:
- No licensed English translation reaches any surface (Prisma-layer guard).
- No kids story publishes without approval (database CHECK constraint).
- Every mutating route rejects an anonymous caller before touching the database.
The auth-guard table and the translation-guard tests are the tripwires. If a change
makes one fail, the change is wrong, not the test.

**Match the house style.** Next 16 App Router, React 19, TS strict, Prisma 7 with
`@/generated/prisma/client`. Server components read Prisma directly. Mutating routes:
`requireSession()` → 401, zod `safeParse` → 400, then write. Reuse
`src/lib/constants.ts`, `src/lib/api-auth.ts`, `src/lib/schemas/`. Add a dependency
only when the platform genuinely cannot do the job.

**Ship in reviewable commits.** Each step: change, test, full gate
(`tsc --noEmit`, `lint --max-warnings 0`, `vitest run`, `next build`), commit. A commit
message says what was broken and how it was proven fixed — not what files moved.

**Report honestly.** If a step is skipped, say so and why. If a fix is partial, name
what remains. If a measurement could not be taken in this environment, say that rather
than estimating and presenting it as measured.

## Out of scope

Kids content, video features, multi-user admin, the global cascade-layer fix, mobile,
interface i18n. All plausible later; none is between this and a usable product.


---

## Act I status

| Step | State | Evidence |
|---|---|---|
| 1. Caching + 404 status | Done | 83 dynamic routes → 64ƒ/16○/4●; `x-nextjs-cache: HIT`; all missing pages 404 |
| 2. Search | Done | GIN + trigram indexes; absent-term lookup 50.1ms → 0.05ms |
| 3. RTL | Done | 46 RTL elements on /comparisons with computed `direction: rtl` |
| 4. Ingestion | Done | Genesis complete at 1,533 verses; third run writes zero |

Corpus: 94 → **37,334 verses**. Tests: 126 → 181.

| Source | Verses |
|---|---|
| Hebrew Bible (Nevi'im + Ketuvim) | 17,293 |
| New Testament | 7,953 |
| Quran | 6,236 |
| Torah | 5,852 |

All tracked books complete against canonical counts. Translations are permitted
by `licenseCode` rather than by name, so a new public-domain text is a data
decision.

Still open: the Sirah and Hadith sources are still empty shells, the Masoretic
Hebrew and a second Quran edition would give original-language coverage beyond
the 56 seeded verses, and the harder licensing calls (JPS 1917, KJV, Quran
translations) remain yours to verify. Act II — pgvector and the alignment
pipeline — has not started; confirm pgvector support locally and in production
before writing embedding code.
