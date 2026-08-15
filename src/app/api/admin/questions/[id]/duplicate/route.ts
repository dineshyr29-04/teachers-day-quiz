import type { NextRequest } from 'next/server'
import { fail, ok } from '@/lib/api-helpers'
import { requireAdminApi } from '@/lib/auth'
import { duplicateQuestion } from '@/lib/content'
import { getEngine } from '@/lib/engine'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdminApi()
  if (denied) return denied

  const { id } = await params
  const question = duplicateQuestion(id)
  if (!question) return fail('That question no longer exists.', 404)

  getEngine().refreshQuestions()
  return ok({ question })
}
