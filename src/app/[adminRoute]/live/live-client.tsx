'use client'

import { useHostStream } from '@/lib/client/use-stream'
import { HostControls } from '@/components/host-controls'
import { LeaderboardView } from '@/components/leaderboard-view'

export function AdminLiveClient() {
  const { snapshot, liveTally } = useHostStream()

  if (!snapshot) {
    return (
      <div className="flex items-center justify-center p-8 text-ink-soft font-bold">
        <span>Connecting to live host engine...</span>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <HostControls snapshot={snapshot} liveTally={liveTally} />

      {/* Live Leaders Preview */}
      {snapshot.top && snapshot.top.length > 0 && (
        <div className="notebook-card p-6 space-y-4">
          <h2 className="text-xs font-black uppercase text-ink-soft tracking-wider">
            Current Live Leaderboard Preview
          </h2>
          <LeaderboardView top={snapshot.top} totalPlayers={snapshot.players} />
        </div>
      )}
    </div>
  )
}
