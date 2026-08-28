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
  const [showReconnecting, setShowReconnecting] = useState(false)
  const [players, setPlayers] = useState(0)

  // Positive when the server clock is ahead of this device.
  const clockOffset = useRef(0)

  useEffect(() => {
    if (!display && !participantId) return

    const url = display ? '/api/stream?role=display' : `/api/stream?pid=${encodeURIComponent(participantId!)}`
    const source = new EventSource(url)
    let cancelled = false
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null
    let pollInterval: ReturnType<typeof setInterval> | null = null

    const fetchFallbackState = async () => {
      if (display || !participantId || cancelled) return
      try {
        const res = await fetch(`/api/me?pid=${encodeURIComponent(participantId)}`, {
          cache: 'no-store',
        })
        if (res.status === 404 && !cancelled) {
          setStatus('invalid')
          source.close()
          return
        }
        if (res.ok && !cancelled) {
          const data = await res.json()
          if (data?.state) {
            clockOffset.current = data.state.serverNow - Date.now()
            setPlayers(data.state.players || 0)
            setState(data.state)
          }
        }
      } catch {
        /* offline -- keep retrying */
      }
    }

    source.onopen = () => {
      if (cancelled) return
      setStatus('open')
      setShowReconnecting(false)
      if (reconnectTimer) clearTimeout(reconnectTimer)
      if (pollInterval) clearInterval(pollInterval)
    }

    source.onmessage = (event) => {
      if (cancelled) return
      let frame: ClientState | { t: 'players'; players: number } | { t: 'invalid' }
      try {
        frame = JSON.parse(event.data)
      } catch {
        return
      }

      if ('t' in frame && frame.t === 'invalid') {
        setStatus('invalid')
        source.close()
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

      // Delay showing the "Reconnecting..." badge by 3.5s so brief SSE reconnections don't flash warnings
      if (!reconnectTimer) {
        reconnectTimer = setTimeout(() => {
          if (!cancelled) setShowReconnecting(true)
        }, 3500)
      }

      // Immediately fetch current state via fallback REST endpoint
      fetchFallbackState()

      // Start periodic fallback polling every 3s while SSE is reconnecting
      if (!pollInterval) {
        pollInterval = setInterval(fetchFallbackState, 3000)
      }
    }

    return () => {
      cancelled = true
      if (reconnectTimer) clearTimeout(reconnectTimer)
      if (pollInterval) clearInterval(pollInterval)
      source.close()
    }
  }, [participantId, display])

  return { state, status, showReconnecting, players, clockOffset }
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
    let pollInterval: ReturnType<typeof setInterval> | null = null

    const fetchHostFallback = async () => {
      if (cancelled) return
      try {
        const res = await fetch('/api/admin/snapshot', { cache: 'no-store' })
        if (res.ok && !cancelled) {
          const data = await res.json()
          if (data) {
            clockOffset.current = (data.serverNow || Date.now()) - Date.now()
            setSnapshot(data)
          }
        }
      } catch {}
    }

    source.onopen = () => {
      if (cancelled) return
      setStatus('open')
      if (pollInterval) clearInterval(pollInterval)
    }

    source.onerror = () => {
      if (cancelled) return
      setStatus('reconnecting')
      fetchHostFallback()
      if (!pollInterval) {
        pollInterval = setInterval(fetchHostFallback, 3000)
      }
    }

    source.onmessage = (event) => {
      if (cancelled) return
      let frame: HostFrame | { t: 'tally'; answered: number; players: number; spread: number[]; perQuestion: { questionId: string; answered: number }[] } | { t: 'players'; players: number }
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
      } else if (frame.t === 'players') {
        setSnapshot((prev) => (prev ? { ...prev, players: frame.players } : prev))
      }
    }

    return () => {
      cancelled = true
      if (pollInterval) clearInterval(pollInterval)
      source.close()
    }
  }, [])

  return { snapshot, status, liveTally, clockOffset }
}
