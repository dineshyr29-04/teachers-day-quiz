'use client'

import Link from 'next/link'
import Image from 'next/image'
import { GraduationCap, QrFrame, Star, PaperClip, Pencil, PencilScribble } from '@/components/icons'
import { getAdminRoute } from '@/lib/admin-route'
import { motion } from 'framer-motion'

export default function HomePage() {
  const secretRoute = getAdminRoute()

  return (
    <main className="min-h-screen notebook-paper flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none relative overflow-hidden">
      {/* Notebook Margin Hole Punch & Spiral Binder Rings (Left Edge) */}
      <div className="absolute top-0 bottom-0 left-2 sm:left-4 flex flex-col justify-around py-8 pointer-events-none opacity-40">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-3.5 h-3.5 rounded-full bg-[#2a2440] border border-ink shadow-inner" />
        ))}
      </div>

      {/* Pencil Scribbles & Hand-Drawn Background Assets (Top-Left) */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 left-12 opacity-85 pointer-events-none hidden md:block w-36 h-36"
      >
        <Image
          src="/notebook_stationery_decor.png"
          alt="Classroom Stationery Doodles"
          width={140}
          height={140}
          className="object-contain"
        />
      </motion.div>

      {/* Pencil Scribble Underline Doodles (Top-Right) */}
      <div className="absolute top-12 right-28 opacity-30 text-ink pointer-events-none hidden md:block">
        <PencilScribble className="w-28 h-10" />
      </div>

      <motion.div
        animate={{ y: [0, 12, 0], rotate: [0, -4, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-16 right-10 opacity-85 pointer-events-none hidden md:block w-40 h-40"
      >
        <Image
          src="/classroom_learning_hero.png"
          alt="Learning Doodles"
          width={160}
          height={160}
          className="object-contain rounded-2xl border-2 border-ink shadow-[4px_4px_0px_#2a2440]"
        />
      </motion.div>

      {/* Pencil Scribble Underline (Mid-Left) */}
      <div className="absolute top-1/2 left-8 opacity-25 text-ink pointer-events-none hidden lg:block">
        <PencilScribble className="w-36 h-12 -rotate-12" />
      </div>

      {/* Bottom Floating Motifs */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-14 left-14 text-[#d32f2f] opacity-80 pointer-events-none hidden lg:block flex items-center gap-2"
      >
        <Pencil className="w-12 h-12 stroke-[2.2]" />
        <PencilScribble className="w-20 h-6 text-ink opacity-40" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-16 right-14 text-[#7b1fa2] opacity-80 pointer-events-none hidden lg:block"
      >
        <GraduationCap className="w-16 h-16 stroke-[2.2]" />
      </motion.div>

      {/* Side Floating Sticky Note Accents */}
      <div className="absolute top-1/3 left-6 sticky-note-yellow p-4 rounded-xl border-2 border-ink shadow-[3px_3px_0px_#2a2440] -rotate-6 hidden xl:block w-44 text-left">
        <PaperClip className="w-4 h-4 text-ink mb-1" />
        <p className="text-xs font-black text-ink">Campus Event</p>
        <p className="text-[10px] font-bold text-ink-soft">Honoring Teachers</p>
      </div>

      <div className="absolute top-1/2 right-6 sticky-note-lavender p-4 rounded-xl border-2 border-ink shadow-[3px_3px_0px_#2a2440] rotate-6 hidden xl:block w-44 text-left">
        <PaperClip className="w-4 h-4 text-ink mb-1" />
        <p className="text-xs font-black text-ink">Live Rankings</p>
        <p className="text-[10px] font-bold text-ink-soft">Top 10 Leaders</p>
      </div>

      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md flex flex-col items-center space-y-6 z-10"
      >
        {/* Header Tag */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full sticky-note-yellow text-ink font-black text-xs uppercase tracking-wider -rotate-1 shadow-[2px_2px_0px_#2a2440]">
          <PaperClip className="w-4 h-4 text-ink" />
          <GraduationCap className="w-4 h-4 text-ink" />
          <span>Teachers' Day Quiz</span>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black text-ink">
            Teachers' Day Live Quiz
          </h1>
          <p className="text-sm font-extrabold text-ink-soft">
            Ready to celebrate the teachers who inspire us?
          </p>
        </div>

        {/* Main Hero Card */}
        <div className="w-full notebook-card p-5 sm:p-6 space-y-5">
          {/* Banner Illustration */}
          <div className="w-full overflow-hidden rounded-xl border-2 border-ink bg-white relative aspect-[4/3] shadow-[2px_2px_0px_#2a2440]">
            <Image
              src="/teachers_day_banner.png"
              alt="Teachers' Day Celebration"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/join"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#7b1fa2] text-white font-black text-base border-2 border-ink shadow-[4px_4px_0px_#2a2440] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              <QrFrame className="w-5 h-5" />
              <span>Join Live Quiz</span>
            </Link>

            <Link
              href="/leaderboard"
              className="w-full py-3 px-6 rounded-2xl sticky-note-yellow text-ink font-black text-sm border-2 border-ink shadow-[2px_2px_0px_#2a2440] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <Star className="w-4 h-4 fill-current text-[#d32f2f]" />
              <span>View Leaderboard</span>
            </Link>
          </div>
        </div>

        {/* Footer Host Link */}
        <div className="text-xs font-bold text-ink-soft">
          Event Host?{' '}
          <Link
            href={`/${secretRoute}/login`}
            className="font-black text-ink underline hover:text-[#7b1fa2] transition-colors"
          >
            Access Host Console
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
