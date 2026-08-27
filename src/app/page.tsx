'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  GraduationCap,
  QrFrame,
  PaperClip,
  Book,
  ThumbtackPin,
} from '@/components/icons'
import { NotebookBackgroundDecor } from '@/components/notebook-background-decor'
import { YentechBranding, YentechFooterCredit } from '@/components/yentech-branding'
import { motion } from 'framer-motion'

const TEACHERS_DAY_QUOTES = [
  {
    quote: "Teaching is a very noble profession that shapes the character, caliber, and future of an individual.",
    author: "Dr. A.P.J. Abdul Kalam",
  },
  {
    quote: "Teachers should be the best minds in the country.",
    author: "Dr. Sarvepalli Radhakrishnan",
  },
  {
    quote: "Education is the manifestation of the perfection already in man.",
    author: "Swami Vivekananda",
  },
  {
    quote: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
  },
  {
    quote: "It is the supreme art of the teacher to awaken joy in creative expression and knowledge.",
    author: "Albert Einstein",
  },
  {
    quote: "One child, one teacher, one book, one pen can change the world.",
    author: "Malala Yousafzai",
  },
  {
    quote: "A good teacher can inspire hope, ignite the imagination, and instil a love of learning.",
    author: "Brad Henry",
  },
  {
    quote: "The mind is not a vessel to be filled, but a fire to be kindled.",
    author: "Plutarch",
  },
]

export default function HomePage() {
  const [quote, setQuote] = useState(() => {
    return TEACHERS_DAY_QUOTES[Math.floor(Math.random() * TEACHERS_DAY_QUOTES.length)]
  })

  // Pick a fresh random quote on every client mount/refresh
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * TEACHERS_DAY_QUOTES.length)
    setQuote(TEACHERS_DAY_QUOTES[randomIndex])
  }, [])

  return (
    <main className="min-h-dvh notebook-paper flex flex-col items-center justify-center pl-6 pr-3 sm:px-6 py-3 sm:py-6 pb-safe text-center select-none relative overflow-hidden">
      {/* Consistent Notebook Background Geometry */}
      <NotebookBackgroundDecor />

      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md flex flex-col items-center space-y-3.5 sm:space-y-5 z-10"
      >
        {/* Header Tags & YENTECH Club Branding */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full sticky-note-yellow text-ink font-black text-[11px] sm:text-xs uppercase tracking-wider -rotate-1 shadow-[2px_2px_0px_#2a2440]">
            <PaperClip className="w-3.5 h-3.5 text-ink" />
            <GraduationCap className="w-3.5 h-3.5 text-ink" />
            <span>Teachers' Day Quiz</span>
          </div>
          <YentechBranding />
        </div>

        {/* Title */}
        <div className="space-y-0.5 sm:space-y-1">
          <h1 className="text-2xl sm:text-4xl font-black text-ink tracking-tight leading-tight">
            Teachers' Day Live Quiz
          </h1>
          <p className="text-xs sm:text-sm font-extrabold text-ink-soft">
            Ready to celebrate the teachers who inspire us?
          </p>
        </div>

        {/* Main Hero Card with Teachers' Day Banner Image */}
        <div className="w-full notebook-card p-3.5 sm:p-6 space-y-3.5 sm:space-y-5 bg-[#fffdf7]">
          {/* Main Teachers' Day Banner Image */}
          <div className="w-full overflow-hidden rounded-xl border-2 border-ink bg-white relative aspect-[16/10] max-h-48 sm:max-h-64 shadow-[2px_2px_0px_#2a2440]">
            <Image
              src="/teachers_day_banner.png"
              alt="Teachers' Day Celebration"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Primary Join Action Button */}
          <Link
            href="/join"
            className="w-full py-3 sm:py-4 px-5 sm:px-6 rounded-xl sm:rounded-2xl bg-[#7b1fa2] text-white font-black text-base sm:text-lg border-2 border-ink shadow-[3px_3px_0px_#2a2440] sm:shadow-[4px_4px_0px_#2a2440] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 sm:gap-2.5"
          >
            <QrFrame className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>Join Live Quiz</span>
          </Link>
        </div>

        {/* Teachers' Day Quote Sticky Note Card */}
        <div className="w-full sticky-note-yellow p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-ink shadow-[3px_3px_0px_#2a2440] sm:shadow-[4px_4px_0px_#2a2440] space-y-2 sm:space-y-3 text-left relative -rotate-1">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-black text-ink uppercase tracking-wider">
              <Book className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d32f2f]" />
              <span>Teachers' Day Quote</span>
            </div>
            <ThumbtackPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-ink opacity-70" />
          </div>

          <p className="text-xs sm:text-sm font-extrabold text-ink leading-snug italic">
            "{quote.quote}"
          </p>

          <p className="text-[11px] sm:text-xs font-black text-[#7b1fa2] text-right">
            — {quote.author}
          </p>
        </div>

        {/* YENTECH Official Student Club Footer Credit */}
        <YentechFooterCredit />
      </motion.div>
    </main>
  )
}
