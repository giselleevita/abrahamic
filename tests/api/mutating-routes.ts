/**
 * Every mutating route handler in the app. Two suites iterate this list:
 *   - auth-guards.test.ts: an anonymous caller gets 401 before the database is touched
 *   - contributor-boundary.test.ts: a signed-in CONTRIBUTOR gets 401 on staff routes
 *
 * When a phase adds a mutating route, add it here. Set `contributorAllowed` only for
 * routes that are meant for contributors (their own account), and `adminOnly` for
 * routes an EDITOR must also be refused.
 */
export type Method = 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type MutatingRoute = {
  path: string
  module: string
  methods: Method[]
  contributorAllowed?: boolean
  /** The environment administrator may also use it (so the 'admin has no contributor identity' check is skipped). */
  adminAllowed?: boolean
  adminOnly?: boolean
  /** Deliberately open to anonymous callers (guarded by abuse controls instead of a session). */
  public?: boolean
  /** Editors may use it (claim drafting and review, handling public reports). Every other staff route is administrator-only. */
  editorAllowed?: boolean
}

export const MUTATING_ROUTES: MutatingRoute[] = [
  { path: '/api/claims', module: '@/app/api/claims/route', methods: ['POST'], editorAllowed: true },
  { path: '/api/claims/[id]', module: '@/app/api/claims/[id]/route', methods: ['PUT', 'DELETE'], editorAllowed: true },
  { path: '/api/comparisons', module: '@/app/api/comparisons/route', methods: ['POST'] },
  { path: '/api/comparisons/[id]', module: '@/app/api/comparisons/[id]/route', methods: ['PUT', 'DELETE'] },
  { path: '/api/concepts', module: '@/app/api/concepts/route', methods: ['POST'] },
  { path: '/api/concepts/[slug]', module: '@/app/api/concepts/[slug]/route', methods: ['PATCH', 'DELETE'] },
  { path: '/api/figures', module: '@/app/api/figures/route', methods: ['POST'] },
  { path: '/api/figures/[slug]', module: '@/app/api/figures/[slug]/route', methods: ['PATCH', 'DELETE'] },
  { path: '/api/themes', module: '@/app/api/themes/route', methods: ['POST'] },
  { path: '/api/themes/[slug]', module: '@/app/api/themes/[slug]/route', methods: ['PATCH', 'DELETE'] },
  { path: '/api/timeline', module: '@/app/api/timeline/route', methods: ['POST'] },
  { path: '/api/timeline/[slug]', module: '@/app/api/timeline/[slug]/route', methods: ['PATCH', 'DELETE'] },
  { path: '/api/translations', module: '@/app/api/translations/route', methods: ['POST'] },
  { path: '/api/translations/[id]', module: '@/app/api/translations/[id]/route', methods: ['PATCH', 'DELETE'] },
  { path: '/api/verse-links', module: '@/app/api/verse-links/route', methods: ['POST'] },
  { path: '/api/verse-links/[id]', module: '@/app/api/verse-links/[id]/route', methods: ['DELETE'] },
  { path: '/api/sources/[sourceKey]', module: '@/app/api/sources/[sourceKey]/route', methods: ['PATCH'] },
  { path: '/api/ai/summary', module: '@/app/api/ai/summary/route', methods: ['POST'] },
  { path: '/api/ai/theme-suggestions', module: '@/app/api/ai/theme-suggestions/route', methods: ['POST'] },
  { path: '/api/ai/verse-link-candidates', module: '@/app/api/ai/verse-link-candidates/route', methods: ['POST'] },
  { path: '/api/ai/verse-link-candidates/[id]', module: '@/app/api/ai/verse-link-candidates/[id]/route', methods: ['PATCH'] },
  { path: '/api/ai/kids-stories', module: '@/app/api/ai/kids-stories/route', methods: ['POST'] },
  { path: '/api/ai/kids-stories/[id]', module: '@/app/api/ai/kids-stories/[id]/route', methods: ['PATCH', 'DELETE'] },
  { path: '/api/videos', module: '@/app/api/videos/route', methods: ['POST'] },
  { path: '/api/videos/[id]', module: '@/app/api/videos/[id]/route', methods: ['PATCH', 'DELETE'] },
  { path: '/api/account/reviewer-applications', module: '@/app/api/account/reviewer-applications/route', methods: ['POST'], contributorAllowed: true },
  { path: '/api/account', module: '@/app/api/account/route', methods: ['DELETE'], contributorAllowed: true },
  { path: '/api/admin/users/[id]', module: '@/app/api/admin/users/[id]/route', methods: ['PATCH'], adminOnly: true },
  { path: '/api/admin/reviewers/[id]', module: '@/app/api/admin/reviewers/[id]/route', methods: ['PATCH'], adminOnly: true },
  { path: '/api/claims/[id]/reviews', module: '@/app/api/claims/[id]/reviews/route', methods: ['POST'], contributorAllowed: true, adminAllowed: true },
  { path: '/api/claims/[id]/contested', module: '@/app/api/claims/[id]/contested/route', methods: ['PATCH'], adminOnly: true },
  { path: '/api/reports', module: '@/app/api/reports/route', methods: ['POST'], public: true },
  { path: '/api/admin/reports/[id]', module: '@/app/api/admin/reports/[id]/route', methods: ['PATCH'], editorAllowed: true },
  { path: '/api/contributions/claims', module: '@/app/api/contributions/claims/route', methods: ['POST'], contributorAllowed: true },
]
