import type { Metadata, Viewport } from 'next'
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Teachers' Day Quiz",
  description:
    'A live quiz celebrating the teachers who inspire us. Scan, join, and play together.',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#FFFBF5',
  width: 'device-width',
  initialScale: 1,
  // Zoom stays available: never trade accessibility for a tidier layout.
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="mesh-ground min-h-dvh antialiased">{children}</body>
    </html>
  )
}
