'use client'

import { useEffect, useRef, useState } from 'react'
import type { ClientState, HostFrame } from '@/lib/types'

export type StreamStatus = 'connecting' | 'open' | 'reconnecting' | 'invalid'

interface Options {
  participantId?: string
  /** Projector / display mode: aggregate state, no personal fields. */
  display?: boolean
}

export function useQuizStream({ participantId, display }: Options) {
  const [state, setState] = useState<ClientState | null>(null)
  const [status, setStatus] = useState<StreamStatus>('connecting')
  const [players, setPlayers] = useState(0)

  // Positive when the server clock is ahead of this device.
  const clockOffset = useRef(0)

  useEffect(() => {
    if (!display && !participantId) return

    const url = display ? '/api/stream?role=display' : `/api/stream?pid=${encodeURIComponent(participantId!)}`
    const source = new EventSource(url)
    let cancelled = false

    source.onopen = () => {
      if (cancelled) return
      setStatus('open')
    }

    source.onmessage = (event) => {
      if (cancelled) return
      let frame: ClientState | { t: 'players'; players: number }
      try {
        frame = JSON.parse(event.data)
      } catch {
        return
      }

      if (frame.t === 'players') {
        setPlayers(frame.players)
        return
      }

      if (frame.t === 'state') {
        clockOffset.current = frame.serverNow - Date.now()
        setPlayers(frame.players)
        setState(frame)
      }
    }

    source.onerror = async () => {
      if (cancelled) return
      setStatus('reconnecting')

      // Check immediately whether the participant session is invalid (e.g. server restarted or run cleared)
      if (!display && participantId) {
        try {
          const res = await fetch(`/api/me?pid=${encodeURIComponent(participantId)}`, {
            cache: 'no-store',
          })
          if (res.status === 404 && !cancelled) {
            setStatus('invalid')
            source.close()
          }
        } catch {
          /* offline -- keep retrying */
        }
      }
    }

    return () => {
      cancelled = true
      source.close()
    }
  }, [participantId, display])

  return { state, status, players, clockOffset }
}

/** The same subscription for the authenticated host screen. */
export function useHostStream() {
  const [snapshot, setSnapshot] = useState<HostFrame | null>(null)
  const [status, setStatus] = useState<StreamStatus>('connecting')
  const [liveTally, setLiveTally] = useState<{
    answered: number
    players: number
    spread: number[]
    perQuestion: { questionId: string; answered: number }[]
  } | null>(null)
  const clockOffset = useRef(0)

  useEffect(() => {
    const source = new EventSource('/api/admin/stream')
    let cancelled = false

    source.onopen = () => !cancelled && setStatus('open')
    source.onerror = () => !cancelled && setStatus('reconnecting')

    source.onmessage = (event) => {
      if (cancelled) return
      let frame: HostFrame | { t: 'tally'; answered: number; players: number; spread: number[]; perQuestion: { questionId: string; answered: number }[] }
      try {
        frame = JSON.parse(event.data)
      } catch {
        return
      }

      if (frame.t === 'host') {
        clockOffset.current = frame.serverNow - Date.now()
        setSnapshot(frame)
        setLiveTally(null)
      } else if (frame.t === 'tally') {
        setLiveTally({
          answered: frame.answered,
          players: frame.players,
          spread: frame.spread,
          perQuestion: frame.perQuestion,
        })
      }
    }

    return () => {
      cancelled = true
      source.close()
    }
  }, [])

  return { snapshot, status, liveTally, clockOffset }
}
