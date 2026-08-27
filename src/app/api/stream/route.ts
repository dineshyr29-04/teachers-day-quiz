import type { NextRequest } from 'next/server'
import { getHub, type ClientRole, type SseClient } from '@/lib/bus'
import { getEngine } from '@/lib/engine'
import { newId } from '@/lib/db'

/**
 * The single realtime endpoint for participants and projector screens.
 *
 * Clients hold this stream open for the whole event. Frames are pushed on phase
 * transitions only -- countdowns run locally off the absolute deadlines in the
 * payload -- so an idle 20-second question generates no traffic at all.
 */

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const SSE_HEADERS = {
  'Content-Type': 'text/event-stream; charset=utf-8',
  'Cache-Control': 'no-cache, no-store, no-transform',
  Connection: 'keep-alive',
  // Tell nginx and friends not to buffer the stream.
  'X-Accel-Buffering': 'no',
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const participantId = url.searchParams.get('pid') ?? undefined
  const wantsDisplay = url.searchParams.get('role') === 'display'

  const engine = getEngine()

  // A participant id we don't recognise (stale IndexedDB, or the session was
  // reset) should not silently behave like a display screen.
  if (!wantsDisplay) {
    if (!participantId) {
      return Response.json({ error: 'Missing participant id.' }, { status: 400 })
    }
    if (!engine.hasParticipant(participantId)) {
      return Response.json({ error: 'Unknown participant.' }, { status: 404 })
    }
  }

  const role: ClientRole = wantsDisplay ? 'display' : 'player'
  const id = newId('sse')
  const encoder = new TextEncoder()
  let client: SseClient | null = null

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false
      client = {
        id,
        role,
        participantId: wantsDisplay ? undefined : participantId,
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
      // Ask the browser to reconnect quickly if the network blips.
      client.write('retry: 2000\n\n')
      engine.sendInitial(client, participantId, role)

      req.signal.addEventListener('abort', () => {
        getHub().remove(id)
        client?.close()
      })
    },
    cancel() {
      getHub().remove(id)
    },
  })

  if (!wantsDisplay && participantId) engine.touch(participantId)

  return new Response(stream, { headers: SSE_HEADERS })
}
