import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { UserControls } from '@/components/admin/AccountAdminActions'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') {
    return <p className="text-sm text-stone-600">Only administrators can manage users.</p>
  }

  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 200 })

  return (
    <div className="max-w-5xl">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Accounts</p>
      <h1 className="mt-1 text-3xl font-bold text-stone-900">Users</h1>
      <p className="mt-2 max-w-3xl text-sm text-stone-600">
        Contributors sign in with GitHub or Google. Giving someone the Editor role grants access to this CMS, so do it sparingly.
        Administrators exist only as environment credentials and cannot be created here.
      </p>
      <div className="mt-6 divide-y divide-stone-100 rounded-xl border border-stone-200 bg-white">
        {users.length === 0 ? (
          <p className="p-5 text-sm text-stone-500">No one has signed in yet.</p>
        ) : users.map((user) => (
          <div key={user.id} className="grid gap-2 px-5 py-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-medium text-stone-800">{user.displayName ?? '(no name)'} <span className="text-stone-400">· {user.provider}</span></p>
              <p className="text-xs text-stone-500">{user.email ?? 'no email'} · joined {user.createdAt.toISOString().slice(0, 10)}</p>
            </div>
            <UserControls id={user.id} role={user.role} status={user.status} />
          </div>
        ))}
      </div>
    </div>
  )
}
