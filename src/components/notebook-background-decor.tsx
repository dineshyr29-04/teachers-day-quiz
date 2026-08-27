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
      {/* Left Red Margin Binder Hole Punches */}
      <div className="absolute top-0 bottom-0 left-2 sm:left-4 flex flex-col justify-around py-8 pointer-events-none opacity-50 z-0">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-3.5 h-3.5 rounded-full bg-[#2a2440] border border-ink shadow-inner" />
        ))}
      </div>

      {/* SVG Hand-Drawn Math Formulas (Top-Left Background) */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 left-12 opacity-80 text-ink pointer-events-none hidden md:block z-0"
      >
        <MathFormulaDoodle className="w-44 h-24" />
      </motion.div>

      {/* SVG Paper Airplane (Top-Right Background) */}
      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-14 right-14 opacity-80 text-[#7b1fa2] pointer-events-none hidden md:block z-0"
      >
        <PaperAirplaneDoodle className="w-20 h-20" />
      </motion.div>

      {/* Mid-Page Pencil Scribble & Stars */}
      <div className="absolute top-1/3 left-10 opacity-30 text-ink pointer-events-none hidden lg:block z-0">
        <PencilScribble className="w-36 h-12 -rotate-12" />
      </div>

      <div className="absolute top-1/4 right-8 opacity-40 text-amber-600 pointer-events-none hidden lg:block z-0">
        <DoodleStars className="w-16 h-16" />
      </div>

      {/* Bottom-Left Geometry Compass & Pencil */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-12 left-12 opacity-80 text-[#d32f2f] pointer-events-none hidden lg:block flex items-center gap-3 z-0"
      >
        <CompassRulerDoodle className="w-12 h-12 stroke-[2.2]" />
        <Pencil className="w-10 h-10 stroke-[2.2] -rotate-45" />
      </motion.div>

      {/* Bottom-Right Graduation Cap */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-14 right-14 opacity-80 text-[#7b1fa2] pointer-events-none hidden lg:block z-0"
      >
        <GraduationCap className="w-14 h-14 stroke-[2.2]" />
      </motion.div>

      {/* Side Floating Sticky Note Accents */}
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
