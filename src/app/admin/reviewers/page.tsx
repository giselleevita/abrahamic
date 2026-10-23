import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { ReviewerControls } from '@/components/admin/AccountAdminActions'

export const dynamic = 'force-dynamic'

const TRADITION_LABEL: Record<string, string> = { JEWISH: 'Judaism', CHRISTIAN: 'Christianity', ISLAMIC: 'Islam' }
const STATUS_STYLE = {
  PENDING: 'bg-amber-100 text-amber-800',
  APPROVED: 'bg-emerald-100 text-emerald-800',
  REVOKED: 'bg-slate-200 text-slate-700',
} as const

export default async function AdminReviewersPage() {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') {
    return <p className="text-sm text-stone-600">Only administrators can approve reviewers.</p>
  }

  const profiles = await prisma.reviewerProfile.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    include: { user: { select: { displayName: true, email: true, provider: true } } },
    take: 200,
  })

  return (
    <div className="max-w-5xl">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Verification</p>
      <h1 className="mt-1 text-3xl font-bold text-stone-900">Reviewer applications</h1>
      <p className="mt-2 max-w-3xl text-sm text-stone-600">
        A reviewer speaks only for the tradition they belong to. We cannot verify belief, so judge the
        community or institution they name and the reason they give. Every decision is audited.
      </p>
      <div className="mt-6 space-y-3">
        {profiles.length === 0 ? (
          <p className="rounded-xl border border-stone-200 bg-white p-5 text-sm text-stone-500">No applications yet.</p>
        ) : profiles.map((profile) => (
          <article key={profile.id} className="rounded-xl border border-stone-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-stone-900">
                  {profile.user.displayName ?? '(no name)'} · {TRADITION_LABEL[profile.tradition]}
                </p>
                <p className="text-xs text-stone-500">{profile.user.email ?? 'no email'} · {profile.user.provider} · applied {profile.createdAt.toISOString().slice(0, 10)}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${STATUS_STYLE[profile.status]}`}>{profile.status}</span>
            </div>
            <p className="mt-3 text-sm text-stone-700"><span className="font-semibold">Affiliation:</span> {profile.affiliation}</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-stone-700"><span className="font-semibold">Statement:</span> {profile.statement}</p>
            <div className="mt-4"><ReviewerControls id={profile.id} status={profile.status} /></div>
          </article>
        ))}
      </div>
    </div>
  )
}
