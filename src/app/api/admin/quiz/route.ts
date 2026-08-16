import type { NextRequest } from 'next/server'
import { fail, ok, readJson } from '@/lib/api-helpers'
import { requireAdminApi } from '@/lib/auth'
import { getQuiz, updateQuiz } from '@/lib/content'
import { getEngine } from '@/lib/engine'
import { TIMER_CHOICES } from '@/lib/types'
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
  if (name.length < 2) return fail('Give the quiz a name.')
  if (name.length > 80) return fail('Quiz names are limited to 80 characters.')

  const description = typeof body.description === 'string' ? body.description.trim().slice(0, 200) : ''

  const defaultTimer = Number(body.defaultTimer)
  if (!TIMER_CHOICES.includes(defaultTimer as (typeof TIMER_CHOICES)[number])) {
    return fail(`Default timer must be one of ${TIMER_CHOICES.join(', ')} seconds.`)
  }

  const quiz = getQuiz()

  // `readySeconds` may legitimately be 0, so a `||` fallback would be wrong.
  const num = (value: unknown, fallback: number) => {
    const n = Number(value)
    return Number.isFinite(n) ? n : fallback
  }

  const updated = updateQuiz(quiz.id, {
    name,
    description,
    defaultTimer,
    revealSeconds: clamp(num(body.revealSeconds, quiz.revealSeconds), 2, 20),
    leaderboardSeconds: clamp(num(body.leaderboardSeconds, quiz.leaderboardSeconds), 2, 20),
    readySeconds: clamp(num(body.readySeconds, quiz.readySeconds), 0, 10),
  })

  getEngine().refreshQuiz()
  return ok({ quiz: updated })
}
