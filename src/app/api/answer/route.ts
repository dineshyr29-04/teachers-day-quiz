import type { NextRequest } from 'next/server'
import { clientIp, fail, ok, rateLimit, readJson } from '@/lib/api-helpers'
import { getEngine } from '@/lib/engine'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Record an answer. The client sends only *which* option it tapped -- the
 * server decides when it arrived, whether it counts, and what it is worth.
 */
export async function POST(req: NextRequest) {
  if (!rateLimit(`answer:${clientIp(req)}`, 240, 60_000)) {
    return fail('Too many requests.', 429)
  }

  const body = await readJson<{
    participantId?: unknown
    roundIndex?: unknown
    choice?: unknown
  }>(req)

  const participantId = typeof body?.participantId === 'string' ? body.participantId : ''
  const roundIndex = typeof body?.roundIndex === 'number' ? body.roundIndex : -1
  if (!participantId) return fail('Missing participant id.')

  const result = getEngine().submitAnswer(participantId, roundIndex, body?.choice)

  if (result.ok) return ok({ accepted: true })

  // Duplicates are the common case (a double tap on a laggy connection), and
  // they are not an error from the participant's point of view: the first tap
  // already counted, so report success and echo what was recorded.
  if (result.reason === 'DUPLICATE') {
    return ok({ accepted: true, duplicate: true, choice: result.choice })
  }

  const messages: Record<string, string> = {
    CLOSED: "That question has closed.",
    STALE: 'That question has already moved on.',
    UNKNOWN: 'We could not find your session.',
    NOT_OPEN: 'Answers have not opened yet.',
    EXPIRED: "Time's up for that question.",
    INVALID: 'That answer is not valid.',
  }

  return ok(
    { accepted: false, reason: result.reason, message: messages[result.reason] ?? 'Not accepted.' },
    { status: 200 },
  )
}
