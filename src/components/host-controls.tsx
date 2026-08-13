'use client'

import { useState } from 'react'
import type { HostFrame } from '@/lib/types'
import { apiPost } from '@/lib/client/api'
import { ANSWER_SHAPES, Users, QrFrame, GraduationCap, PaperClip } from '@/components/icons'
import { Play, Pause, SkipForward, Square, BarChart2 } from 'lucide-react'
import { QrModal } from '@/components/qr-modal'

interface HostControlsProps {
  snapshot: HostFrame
  liveTally: {
    answered: number
    players: number
    spread: number[]
  } | null
}

const ANSWER_COLORS = [
  'bg-[#e53935]',
  'bg-[#1e88e5]',
  'bg-[#fb8c00]',
  'bg-[#43a047]',
]

export function HostControls({ snapshot, liveTally }: HostControlsProps) {
  const [showQr, setShowQr] = useState(false)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  const { status, phase, players, roundIndex, totalRounds, quiz } = snapshot

  const isWaiting = status === 'WAITING'
  const isLive = status === 'LIVE'
  const isPaused = status === 'PAUSED'
  const isCompleted = status === 'COMPLETED'

  const currentAnswered = liveTally?.answered ?? snapshot.answered
  const currentSpread = liveTally?.spread ?? snapshot.spread

  const handleAction = async (action: 'start' | 'pause' | 'resume' | 'skip' | 'end') => {
    try {
      setLoadingAction(action)
      await apiPost('/api/admin/control', { action })
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Control action failed')
    } finally {
      setLoadingAction(null)
    }
  }

  return (
    <div className="w-full space-y-6 select-none">
      {/* Top Banner: Quiz Name, Status, QR Button */}
      <div className="notebook-card p-6 border-2 border-ink space-y-4 shadow-[4px_4px_0px_#2a2440]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full sticky-note-yellow text-ink font-black text-xs -rotate-1">
              <PaperClip className="w-4 h-4 text-ink" />
              <GraduationCap className="w-4 h-4" />
              <span>{quiz.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-ink">
              Host Console
            </h1>
          </div>

          {/* Large QR Code Trigger Button */}
          <button
            type="button"
            onClick={() => setShowQr(true)}
            className="px-5 py-3 rounded-2xl sticky-note-lavender border-2 border-ink text-ink font-black text-sm hover:-translate-y-0.5 transition-all cursor-pointer shadow-[3px_3px_0px_#2a2440] flex items-center gap-2.5"
          >
            <QrFrame className="w-6 h-6 text-[#7b1fa2]" />
            <span>Display Join QR Code</span>
          </button>
        </div>

        <div className="w-full border-t-2 border-ink" />

        {/* Live Status & Main Action Button */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Status Badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-ink sticky-note-mint text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#2a2440]">
              <span
                className={`w-3 h-3 rounded-full border border-ink ${
                  isLive
                    ? 'bg-emerald-500 animate-ping'
                    : isPaused
                    ? 'bg-amber-500'
                    : isCompleted
                    ? 'bg-gray-400'
                    : 'bg-[#7b1fa2]'
                }`}
              />
              <span className="text-ink font-black">{status}</span>
              {phase && phase !== 'WAITING' && (
                <span className="text-ink-soft text-[10px]">({phase})</span>
              )}
            </div>

            {/* Live Participants Count */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl sticky-note-yellow border-2 border-ink text-ink text-sm font-black tnum shadow-[2px_2px_0px_#2a2440]">
              <Users className="w-4 h-4 text-ink" />
              <span>{players} players</span>
            </div>

            {/* Round info */}
            {roundIndex >= 0 && (
              <div className="text-xs font-black text-ink tnum bg-paper-warm px-3 py-2 rounded-xl border-2 border-ink">
                Question {roundIndex + 1} / {totalRounds}
              </div>
            )}
          </div>

          {/* Primary Action Button (START QUIZ) */}
          {isWaiting && (
            <button
              type="button"
              onClick={() => handleAction('start')}
              disabled={loadingAction !== null}
              className="px-7 py-3.5 rounded-2xl bg-[#388e3c] text-white font-black text-base border-2 border-ink shadow-[4px_4px_0px_#2a2440] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center gap-2.5 disabled:opacity-50"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START QUIZ</span>
            </button>
          )}

          {/* Controls during live quiz */}
          {(isLive || isPaused) && (
            <div className="flex items-center gap-2">
              {isPaused ? (
                <button
                  type="button"
                  onClick={() => handleAction('resume')}
                  disabled={loadingAction !== null}
                  className="px-4 py-2.5 rounded-xl bg-[#388e3c] text-white font-black text-xs border-2 border-ink shadow-[2px_2px_0px_#2a2440] flex items-center gap-1.5 hover:-translate-y-0.5 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Resume</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleAction('pause')}
                  disabled={loadingAction !== null}
                  className="px-4 py-2.5 rounded-xl bg-[#fbc02d] text-ink font-black text-xs border-2 border-ink shadow-[2px_2px_0px_#2a2440] flex items-center gap-1.5 hover:-translate-y-0.5 cursor-pointer"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleAction('skip')}
                disabled={loadingAction !== null || isCompleted}
                className="px-4 py-2.5 rounded-xl sticky-note-lavender text-ink font-black text-xs border-2 border-ink shadow-[2px_2px_0px_#2a2440] flex items-center gap-1.5 hover:-translate-y-0.5 cursor-pointer"
              >
                <SkipForward className="w-4 h-4" />
                <span>Skip</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to end the quiz early?')) {
                    handleAction('end')
                  }
                }}
                disabled={loadingAction !== null}
                className="px-4 py-2.5 rounded-xl sticky-note-rose text-ink font-black text-xs border-2 border-ink shadow-[2px_2px_0px_#2a2440] flex items-center gap-1.5 hover:-translate-y-0.5 cursor-pointer"
              >
                <Square className="w-4 h-4" />
                <span>End Quiz</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Live Answers Tally Display */}
      {roundIndex >= 0 && (
        <div className="notebook-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#7b1fa2]" />
              <h2 className="font-black text-ink text-base">Live Question Tallies</h2>
            </div>

            <div className="text-xs font-black text-ink tnum">
              Answered: <span className="text-[#7b1fa2] font-black">{currentAnswered}</span> / {players}
            </div>
          </div>

          {/* Option Tallies */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currentSpread.map((count, idx) => {
              const Shape = ANSWER_SHAPES[idx % ANSWER_SHAPES.length]
              const pct = currentAnswered > 0 ? Math.round((count / currentAnswered) * 100) : 0

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border-2 border-ink bg-paper-cream flex flex-col items-center text-center space-y-2 shadow-[2px_2px_0px_#2a2440]"
                >
                  <div
                    className={`w-9 h-9 rounded-xl ${ANSWER_COLORS[idx]} text-white flex items-center justify-center border-2 border-ink`}
                  >
                    <Shape className="w-5 h-5 fill-current" />
                  </div>
                  <span className="tnum font-black text-2xl text-ink">{count}</span>
                  <span className="text-xs font-extrabold text-ink-soft tnum">{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      <QrModal isOpen={showQr} onClose={() => setShowQr(false)} />
    </div>
  )
}
