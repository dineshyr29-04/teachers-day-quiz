import { ok } from '@/lib/api-helpers'
import { endAdminSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST() {
  await endAdminSession()
  return ok({ ok: true })
}
