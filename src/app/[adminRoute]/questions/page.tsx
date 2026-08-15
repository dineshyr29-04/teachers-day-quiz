import { requireAdminPage } from '@/lib/auth'
import { adminPath } from '@/lib/admin-route'
import { AdminQuestionsClient } from './questions-client'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdminQuestionsPage() {
  await requireAdminPage(adminPath('login'))
  return <AdminQuestionsClient />
}
