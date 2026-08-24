'use client'

import Link from 'next/link'
import Image from 'next/image'
import { GraduationCap, QrFrame, Star, PaperClip } from '@/components/icons'
import { getAdminRoute } from '@/lib/admin-route'
import { motion } from 'framer-motion'

export default function HomePage() {
  const secretRoute = getAdminRoute()

  return (
    <main className="min-h-screen notebook-paper flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md flex flex-col items-center space-y-6"
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
          <div className="w-full overflow-hidden rounded-xl border-2 border-ink bg-white relative aspect-[4/3]">
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
