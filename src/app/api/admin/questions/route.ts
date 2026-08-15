import type { NextRequest } from 'next/server'
import { fail, ok, readJson } from '@/lib/api-helpers'
import { requireAdminApi } from '@/lib/auth'
import { createQuestion, getQuiz, listQuestions } from '@/lib/content'
import { getEngine } from '@/lib/engine'
import { validateQuestion } from '@/lib/validate'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const denied = await requireAdminApi()
  if (denied) return denied
  const quiz = getQuiz()
  return ok({ questions: listQuestions(quiz.id) })
}

export async function POST(req: NextRequest) {
  const denied = await requireAdminApi()
  if (denied) return denied

  const body = await readJson<Record<string, unknown>>(req)
  if (!body) return fail('Invalid request body.')

  const result = validateQuestion(body)
  if (!result.ok) return fail(result.error)

  const quiz = getQuiz()
  const question = createQuestion(quiz.id, result.value)
  getEngine().refreshQuestions()
  return ok({ question })
}
