import { requireAdminPage } from '@/lib/auth'
import { adminPath } from '@/lib/admin-route'
import { AdminQuizClient } from './quiz-client'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdminQuizPage() {
  await requireAdminPage(adminPath('login'))
  return <AdminQuizClient />
}
