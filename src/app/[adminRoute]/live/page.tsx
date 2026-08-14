import { requireAdminPage } from '@/lib/auth'
import { adminPath } from '@/lib/admin-route'
import { AdminLiveClient } from './live-client'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdminLivePage() {
  await requireAdminPage(adminPath('login'))
  return <AdminLiveClient />
}
