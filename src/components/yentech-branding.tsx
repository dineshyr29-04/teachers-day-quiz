'use client'

import { Cpu } from 'lucide-react'

export function YentechBranding({ className = '' }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl sticky-note-lavender border border-ink text-ink font-black text-xs shadow-[1.5px_1.5px_0px_#2a2440] ${className}`}
    >
      <Cpu className="w-3.5 h-3.5 text-[#7b1fa2]" />
      <span>YENTECH</span>
      <span className="text-[10px] font-bold text-ink-soft">• YSET Tech Club</span>
    </div>
  )
}

export function YentechFooterCredit() {
  return (
    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-ink-soft pt-2">
      <span>Powered by</span>
      <span className="font-black text-ink underline decoration-[#7b1fa2] decoration-2">YENTECH</span>
      <span className="text-[10px] text-ink-soft">(Official Technical Club, YSET)</span>
    </div>
  )
}
