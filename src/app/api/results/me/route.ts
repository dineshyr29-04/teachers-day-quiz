import type { NextRequest } from 'next/server'
import { fail, ok } from '@/lib/api-helpers'
import { getEngine } from '@/lib/engine'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/** Personal end-of-quiz summary for the /results page. */
export async function GET(req: NextRequest) {
  const participantId = new URL(req.url).searchParams.get('pid')
  if (!participantId) return fail('Missing participant id.')

  const result = getEngine().resultFor(participantId)
  if (!result) return fail('Unknown participant.', 404)

  return ok(result)
}
