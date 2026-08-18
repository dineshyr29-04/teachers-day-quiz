import { ok } from '@/lib/api-helpers'
import { requireAdminApi } from '@/lib/auth'
import { getEngine } from '@/lib/engine'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const denied = await requireAdminApi()
  if (denied) return denied
  return ok(getEngine().results())
}
