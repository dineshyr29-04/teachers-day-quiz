'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { GraduationCap, QrFrame, PaperClip, Pencil, PencilScribble, Book } from '@/components/icons'
import { getAdminRoute } from '@/lib/admin-route'
import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'

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
  const [quoteIndex, setQuoteIndex] = useState(0)

  // Pick a random quote on mount
  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * TEACHERS_DAY_QUOTES.length))
  }, [])

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % TEACHERS_DAY_QUOTES.length)
  }

  const currentQuote = TEACHERS_DAY_QUOTES[quoteIndex]

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

        {/* Main Hero Card (Join Quiz Action Only) */}
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

          {/* Primary Join Action Button */}
          <Link
            href="/join"
            className="w-full py-4 px-6 rounded-2xl bg-[#7b1fa2] text-white font-black text-lg border-2 border-ink shadow-[4px_4px_0px_#2a2440] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5"
          >
            <QrFrame className="w-6 h-6" />
            <span>Join Live Quiz</span>
          </Link>
        </div>

        {/* Randomized Teachers' Day Quote Sticky Note Card */}
        <motion.div
          key={quoteIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full sticky-note-yellow p-5 rounded-2xl border-2 border-ink shadow-[4px_4px_0px_#2a2440] space-y-3 text-left relative -rotate-1"
        >
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-ink uppercase tracking-wider">
              <Book className="w-4 h-4 text-[#d32f2f]" />
              <span>Teachers' Day Quote</span>
            </div>

            <button
              type="button"
              onClick={handleNextQuote}
              title="Next Quote"
              className="p-1.5 rounded-lg bg-paper-cream border border-ink text-ink hover:bg-paper-light transition-all cursor-pointer shadow-[1px_1px_0px_#2a2440]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-sm font-extrabold text-ink leading-snug italic">
            "{currentQuote.quote}"
          </p>

          <p className="text-xs font-black text-[#7b1fa2] text-right">
            — {currentQuote.author}
          </p>
        </motion.div>

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
