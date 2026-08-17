import { requireAdminPage } from '@/lib/auth'
import { adminPath } from '@/lib/admin-route'
import { AdminDashboardClient } from './admin-dashboard-client'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdminDashboardPage() {
  await requireAdminPage(adminPath('login'))
  return <AdminDashboardClient />
}
