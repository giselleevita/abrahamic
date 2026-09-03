# Engineering case study

Abrahamic demonstrates a licensed-content-aware, structured editorial workflow across traditions. Its core engineering concerns are relational modeling, traceable sources, authorization, neutral presentation, and deterministic demo seeding.

## Review path

1. Open the public demo and inspect Sources and Licensing.
2. Compare one topic across traditions and follow its source references.
3. Inspect a figure, relationship, and timeline event.
4. Review the public-demo translation filter and its tests.
5. Review the Prisma constraints and the viewer/editor/admin route boundary.

## Integrity boundaries

- Public data is limited to original-language text and project-authored reader notes.
- AI features are optional, server-side, and create editorial candidates rather than published claims.
- Published and candidate records remain distinct.
- The application presents sourced comparisons; it does not decide which tradition is correct.

## Local reproduction

Run `docker compose up --build`, deploy migrations, then run the idempotent demo seed. CI separately validates the schema against PostgreSQL, type checks, lints, tests, and builds the production application.
