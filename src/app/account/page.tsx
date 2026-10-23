import type { Metadata } from 'next'
import Link from 'next/link'
import { configuredOAuthProviders } from '@/lib/auth'
import { getContributorSessionSafe } from '@/lib/contributor-session'
import prisma from '@/lib/prisma'
import { AccountActions, ReviewerApplicationForm, SignInButtons } from '@/components/account/AccountClient'

export const metadata: Metadata = {
  title: 'Contribute',
  description: 'Sign in to suggest content or apply to review how your own tradition is described.',
  robots: { index: false },
}
export const dynamic = 'force-dynamic'

const TRADITION_LABEL: Record<string, string> = { JEWISH: 'Judaism', CHRISTIAN: 'Christianity', ISLAMIC: 'Islam' }
const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Waiting for an administrator',
  APPROVED: 'Approved',
  REVOKED: 'Not approved',
}

export default async function AccountPage() {
  const session = await getContributorSessionSafe()

  if (!session) {
    const providers = configuredOAuthProviders()
    return (
      <div className="mx-auto max-w-2xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-violet-700">Contribute</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-950">Help keep this fair</h1>
        <p className="mt-5 text-lg leading-8 text-slate-700">Suggest corrections and new material, or apply to review how your own tradition is described. Nothing you contribute is published without review.</p>
        {providers.length > 0 ? (
          <>
            <SignInButtons providers={providers} />
            <p className="mt-4 text-xs text-slate-500">We store your sign-in provider ID, display name and email, as described in the <Link href="/privacy" className="underline">privacy page</Link>. You can delete your account at any time.</p>
          </>
        ) : (
          <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Contributor sign-in is not open yet. In the meantime you can report a problem from the <Link href="/about" className="font-semibold underline">About page</Link>.</p>
        )}
      </div>
    )
  }

  const profiles = await prisma.reviewerProfile.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'asc' },
    select: { id: true, tradition: true, affiliation: true, status: true },
  })
  const taken = new Set(profiles.map((profile) => profile.tradition))
  const available = ['JEWISH', 'CHRISTIAN', 'ISLAMIC'].filter((tradition) => !taken.has(tradition as 'JEWISH'))

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-violet-700">Contribute</p>
      <h1 className="mt-2 text-4xl font-bold text-slate-950">Your account</h1>
      <p className="mt-3 text-slate-700">Signed in as <strong>{session.user.name ?? 'contributor'}</strong>. Role: {session.user.role.toLowerCase()}.</p>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-950">Propose a claim</h2>
        <p className="mt-3 leading-7 text-slate-700">Suggest a new, sourced claim. It becomes a draft for the editors and is reviewed by members of the tradition it describes before anything is published.</p>
        <Link href="/account/propose" className="mt-4 inline-flex rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800">Propose a claim</Link>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-950">Reviewing for your tradition</h2>
        <p className="mt-3 leading-7 text-slate-700">A reviewer confirms whether their <em>own</em> tradition is described fairly. Please apply only for the tradition you belong to. An administrator approves each application.</p>
        {profiles.length > 0 && (
          <ul className="mt-4 space-y-2">
            {profiles.map((profile) => (
              <li key={profile.id} className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
                <strong>{TRADITION_LABEL[profile.tradition]}</strong> · {profile.affiliation} · <span className="font-semibold">{STATUS_LABEL[profile.status]}</span>
              </li>
            ))}
          </ul>
        )}
        {session.user.reviewerTraditions && session.user.reviewerTraditions.length > 0 && (
          <Link href="/review" className="mt-4 inline-flex rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800">
            Open the review queue
          </Link>
        )}
        <ReviewerApplicationForm available={available} />
      </section>

      <AccountActions />
    </div>
  )
}
