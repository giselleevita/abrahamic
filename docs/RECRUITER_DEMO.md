# Three-minute recruiter demonstration

1. Sign in to the local demonstration CMS as an editor.
2. Open **Claims**, create a sourced draft, and move it to **In Review**.
3. Point out that the editor cannot publish, archive, or delete it.
4. Sign in as an administrator and publish the reviewed claim.
5. Open **Workflow & Audit**.
6. Show the pipeline counts and expand the event's state evidence.
7. Confirm that the claim is now available through the public experience.

The central design point is defense in depth: UI actions follow the role policy, API routes enforce
it independently, the database keeps workflow and publication flags consistent, and mutations plus
audit evidence commit in one transaction.
