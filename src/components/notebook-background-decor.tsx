'use client'

import { motion } from 'framer-motion'
import {
  GraduationCap,
  Pencil,
  PencilScribble,
  PaperAirplaneDoodle,
  MathFormulaDoodle,
  CompassRulerDoodle,
  DoodleStars,
  PaperClip,
} from '@/components/icons'

export function NotebookBackgroundDecor() {
  return (
    <>
      {/* Left Red Margin Binder Hole Punches (Scaled for mobile left-1 & desktop left-3) */}
      <div className="absolute top-0 bottom-0 left-1 sm:left-3 flex flex-col justify-around py-6 pointer-events-none opacity-40 z-0">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#2a2440] border border-ink shadow-inner" />
        ))}
      </div>

      {/* SVG Hand-Drawn Math Formulas (Top-Left Background) */}
      <motion.div
        animate={{ y: [0, -6, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-4 left-6 sm:top-10 sm:left-12 opacity-50 sm:opacity-80 text-ink pointer-events-none z-0"
      >
        <MathFormulaDoodle className="w-28 h-14 sm:w-44 sm:h-24" />
      </motion.div>

      {/* SVG Paper Airplane (Top-Right Background) */}
      <motion.div
        animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-4 right-4 sm:top-14 sm:right-14 opacity-60 sm:opacity-80 text-[#7b1fa2] pointer-events-none z-0"
      >
        <PaperAirplaneDoodle className="w-10 h-10 sm:w-20 sm:h-20" />
      </motion.div>

      {/* Mid-Page Pencil Scribble & Stars */}
      <div className="absolute top-1/4 left-5 opacity-25 text-ink pointer-events-none z-0">
        <PencilScribble className="w-24 h-8 sm:w-36 sm:h-12 -rotate-12" />
      </div>

      <div className="absolute top-1/3 right-4 opacity-40 text-amber-600 pointer-events-none z-0">
        <DoodleStars className="w-10 h-10 sm:w-16 sm:h-16" />
      </div>

      {/* Bottom-Left Geometry Compass & Pencil */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-6 left-6 sm:bottom-12 sm:left-12 opacity-60 sm:opacity-80 text-[#d32f2f] pointer-events-none flex items-center gap-1.5 sm:gap-3 z-0"
      >
        <CompassRulerDoodle className="w-7 h-7 sm:w-12 sm:h-12 stroke-[2.2]" />
        <Pencil className="w-6 h-6 sm:w-10 sm:h-10 stroke-[2.2] -rotate-45" />
      </motion.div>

      {/* Bottom-Right Graduation Cap */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-6 right-6 sm:bottom-14 sm:right-14 opacity-60 sm:opacity-80 text-[#7b1fa2] pointer-events-none z-0"
      >
        <GraduationCap className="w-8 h-8 sm:w-14 sm:h-14 stroke-[2.2]" />
      </motion.div>

      {/* Side Floating Sticky Note Accents (Desktop Large Viewports) */}
      <div className="absolute top-1/3 left-6 sticky-note-yellow p-4 rounded-xl border-2 border-ink shadow-[3px_3px_0px_#2a2440] -rotate-6 hidden xl:block w-44 text-left pointer-events-none z-0">
        <PaperClip className="w-4 h-4 text-ink mb-1" />
        <p className="text-xs font-black text-ink">Campus Event</p>
        <p className="text-[10px] font-bold text-ink-soft">Honoring Teachers</p>
      </div>

      <div className="absolute top-1/2 right-6 sticky-note-lavender p-4 rounded-xl border-2 border-ink shadow-[3px_3px_0px_#2a2440] rotate-6 hidden xl:block w-44 text-left pointer-events-none z-0">
        <PaperClip className="w-4 h-4 text-ink mb-1" />
        <p className="text-xs font-black text-ink">Live Rankings</p>
        <p className="text-[10px] font-bold text-ink-soft">Top 10 Leaders</p>
      </div>
    </>
  )
}
