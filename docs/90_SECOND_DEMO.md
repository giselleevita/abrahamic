# Abrahamic editorial workflow in 90 seconds

**0:00–0:15 — Problem.** A multilingual comparison product needs traceable sources, explicit licensing boundaries, and human editorial control—not unrestricted generated interpretation.

**0:15–0:35 — Public boundary.** Open [the public demo](https://abrahamic.vercel.app), then inspect **Sources** and **Licensing**. Public output is limited to original-language text and project-authored reader notes.

**0:35–1:05 — Structured workflow.** In a local seeded environment, sign in as an editor and open **Workflow & Audit**. Show `DRAFT → IN_REVIEW → PUBLISHED → ARCHIVED`, the active role, and the restriction that only administrators publish, archive, or delete.

**1:05–1:20 — Evidence.** Modify a sourced claim and inspect the immutable audit entry: actor, role, action, timestamp, and before/after state are recorded in the same database transaction.

**1:20–1:30 — Reliability.** The PostgreSQL seed is run twice in CI; the second pass must complete without database-error noise. AI assistance is optional, server-side, and never auto-publishes.

## Interview prompts this supports

- How do database constraints reinforce application authorization?
- How is licensed content excluded from a public deployment?
- Why should audit creation share the mutation transaction?
