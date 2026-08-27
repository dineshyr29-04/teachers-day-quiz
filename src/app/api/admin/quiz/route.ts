import type { NextRequest } from 'next/server'
import { fail, ok, readJson } from '@/lib/api-helpers'
import { requireAdminApi } from '@/lib/auth'
import { getQuiz, updateQuiz, updateAllQuestionsTimer } from '@/lib/content'
import { getEngine } from '@/lib/engine'
import { clamp } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const denied = await requireAdminApi()
  if (denied) return denied
  const engine = getEngine()
  return ok({ quiz: { ...getQuiz(), questionCount: engine.totalRounds } })
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdminApi()
  if (denied) return denied

  const body = await readJson<Record<string, unknown>>(req)
  if (!body) return fail('Invalid request body.')

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  if (name.length < 2) return fail('Give the quiz a title of at least 2 characters.')
  if (name.length > 80) return fail('Quiz title is limited to 80 characters.')

  const description =
    typeof body.description === 'string' ? body.description.trim().slice(0, 200) : ''

  const quiz = getQuiz()

  const num = (value: unknown, fallback: number) => {
    const n = Number(value)
    return Number.isFinite(n) ? n : fallback
  }

  const defaultTimer = clamp(Math.round(num(body.defaultTimer, quiz.defaultTimer)), 5, 120)
  const revealSeconds = clamp(Math.round(num(body.revealSeconds, quiz.revealSeconds)), 2, 60)
  const leaderboardSeconds = clamp(Math.round(num(body.leaderboardSeconds, quiz.leaderboardSeconds)), 2, 60)
  const readySeconds = clamp(Math.round(num(body.readySeconds, quiz.readySeconds)), 0, 10)

  const updated = updateQuiz(quiz.id, {
    name,
    description,
    defaultTimer,
    revealSeconds,
    leaderboardSeconds,
    readySeconds,
  })

  // Synchronize all question timer fields in the database
  updateAllQuestionsTimer(quiz.id, defaultTimer)

  // Refresh live engine instance and broadcast updated quiz state
  getEngine().refreshQuiz()

  return ok({ quiz: updated })
}
