import type { NextRequest } from 'next/server'
import { getHub, type SseClient } from '@/lib/bus'
import { getEngine } from '@/lib/engine'
import { requireAdminApi } from '@/lib/auth'
import { newId } from '@/lib/db'

/**
 * Host realtime stream. Carries the full host snapshot (including question text
 * and per-question tallies), so it is authenticated -- a participant must never
 * be able to read upcoming questions from it.
 */

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const denied = await requireAdminApi()
  if (denied) return denied

  const engine = getEngine()
  const id = newId('sse')
  const encoder = new TextEncoder()
  let client: SseClient | null = null

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false
      client = {
        id,
        role: 'admin',
        write(chunk: string) {
          if (closed) return
          try {
            controller.enqueue(encoder.encode(chunk))
          } catch {
            closed = true
            getHub().remove(id)
          }
        },
        close() {
          if (closed) return
          closed = true
          try {
            controller.close()
          } catch {
            /* already closed */
          }
        },
      }

      getHub().add(client)
      client.write('retry: 2000\n\n')
      engine.sendInitial(client, undefined, 'admin')

      req.signal.addEventListener('abort', () => {
        getHub().remove(id)
        client?.close()
      })
    },
    cancel() {
      getHub().remove(id)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
