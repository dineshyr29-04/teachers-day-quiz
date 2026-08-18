import { requireAdminPage } from '@/lib/auth'
import { adminPath } from '@/lib/admin-route'
import { AdminResultsClient } from './results-client'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdminResultsPage() {
  await requireAdminPage(adminPath('login'))
  return <AdminResultsClient />
}
