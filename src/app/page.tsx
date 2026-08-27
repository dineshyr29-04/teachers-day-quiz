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
import { getAdminRoute } from '@/lib/admin-route'
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
  const secretRoute = getAdminRoute()
  const [quote, setQuote] = useState(TEACHERS_DAY_QUOTES[0])

  // Pick a random quote on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * TEACHERS_DAY_QUOTES.length)
    setQuote(TEACHERS_DAY_QUOTES[randomIndex])
  }, [])

  return (
    <main className="min-h-screen notebook-paper flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none relative overflow-hidden">
      {/* Consistent Notebook Background Geometry */}
      <NotebookBackgroundDecor />

      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md flex flex-col items-center space-y-6 z-10"
      >
        {/* Header Tag */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full sticky-note-yellow text-ink font-black text-xs uppercase tracking-wider -rotate-1 shadow-[2.5px_2.5px_0px_#2a2440]">
          <PaperClip className="w-4 h-4 text-ink" />
          <GraduationCap className="w-4 h-4 text-ink" />
          <span>Teachers' Day Quiz</span>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
            Teachers' Day Live Quiz
          </h1>
          <p className="text-sm font-extrabold text-ink-soft">
            Ready to celebrate the teachers who inspire us?
          </p>
        </div>

        {/* Main Hero Card with Teachers' Day Banner Image */}
        <div className="w-full notebook-card p-5 sm:p-6 space-y-5 bg-[#fffdf7]">
          {/* Main Teachers' Day Banner Image */}
          <div className="w-full overflow-hidden rounded-xl border-2 border-ink bg-white relative aspect-[4/3] shadow-[2px_2px_0px_#2a2440]">
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
            className="w-full py-4 px-6 rounded-2xl bg-[#7b1fa2] text-white font-black text-lg border-2 border-ink shadow-[4px_4px_0px_#2a2440] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5"
          >
            <QrFrame className="w-6 h-6" />
            <span>Join Live Quiz</span>
          </Link>
        </div>

        {/* Teachers' Day Quote Sticky Note Card */}
        <div className="w-full sticky-note-yellow p-5 rounded-2xl border-2 border-ink shadow-[4px_4px_0px_#2a2440] space-y-3 text-left relative -rotate-1">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-ink uppercase tracking-wider">
              <Book className="w-4 h-4 text-[#d32f2f]" />
              <span>Teachers' Day Quote</span>
            </div>
            <ThumbtackPin className="w-4 h-4 text-ink opacity-70" />
          </div>

          <p className="text-sm font-extrabold text-ink leading-snug italic">
            "{quote.quote}"
          </p>

          <p className="text-xs font-black text-[#7b1fa2] text-right">
            — {quote.author}
          </p>
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
