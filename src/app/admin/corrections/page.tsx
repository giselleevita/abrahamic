import { redirect } from 'next/navigation'
import { hasSession } from '@/lib/api-auth'
import { CorrectionInbox } from '@/components/admin/CorrectionInbox'
export default async function CorrectionsPage() {
  if (!await hasSession()) redirect('/login')
  return <div><h1 className="mb-6 text-3xl">Correction inbox</h1><CorrectionInbox /></div>
}
