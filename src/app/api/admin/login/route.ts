import type { NextRequest } from 'next/server'
import { clientIp, fail, ok, rateLimit, clearRateLimit, readJson } from '@/lib/api-helpers'
import { checkCredentials, startAdminSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const ipKey = `login:${clientIp(req)}`
  const maxAttempts = process.env.NODE_ENV === 'development' ? 50 : 8

  if (!rateLimit(ipKey, maxAttempts, 5 * 60_000)) {
    return fail('Too many login attempts. Please wait five minutes.', 429)
  }

  const body = await readJson<{ username?: unknown; password?: unknown }>(req)
  const username = typeof body?.username === 'string' ? body.username : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!username || !password) return fail('Enter a username and password.')
  if (!checkCredentials(username, password)) {
    return fail('Incorrect username or password.', 401)
  }

  clearRateLimit(ipKey)
  await startAdminSession(username)
  return ok({ ok: true })
}
