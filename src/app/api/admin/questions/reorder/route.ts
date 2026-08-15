import type { NextRequest } from 'next/server'
import { fail, ok, readJson } from '@/lib/api-helpers'
import { requireAdminApi } from '@/lib/auth'
import { getQuiz, listQuestions, reorderQuestions } from '@/lib/content'
import { getEngine } from '@/lib/engine'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/** Persist a new pool order after a drag-and-drop in the question editor. */
export async function POST(req: NextRequest) {
  const denied = await requireAdminApi()
  if (denied) return denied

  const body = await readJson<{ orderedIds?: unknown }>(req)
  const orderedIds = Array.isArray(body?.orderedIds) ? body.orderedIds.map(String) : null
  if (!orderedIds) return fail('Send the new order as `orderedIds`.')

  const quiz = getQuiz()
  const existing = listQuestions(quiz.id).map((q) => q.id)

  // Guard against a stale client sending a partial list, which would otherwise
  // leave some questions with duplicate positions.
  const sameSet =
    orderedIds.length === existing.length && existing.every((id) => orderedIds.includes(id))
  if (!sameSet) return fail('The question list changed. Reload and try again.', 409)

  reorderQuestions(quiz.id, orderedIds)
  getEngine().refreshQuestions()
  return ok({ questions: listQuestions(quiz.id) })
}
