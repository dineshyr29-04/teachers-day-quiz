import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Tailwind-aware className joiner (the shadcn/ui convention). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 1234567 -> "12,34,567" */
export function formatNumber(n: number) {
  return n.toLocaleString('en-IN')
}

export function formatPercent(fraction: number) {
  return `${Math.round(fraction * 100)}%`
}

export function formatSeconds(seconds: number) {
  return `${seconds.toFixed(1)}s`
}

export const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/** True for C0/C1 control code points, which must never reach the DOM. */
function isControlCodePoint(code: number) {
  return code < 32 || (code >= 127 && code <= 159)
}

/**
 * Trim a participant-supplied display name down to something safe to render:
 * drop control characters, collapse whitespace, cap the length.
 */
export function sanitizeName(raw: unknown): string {
  if (typeof raw !== 'string') return ''
  let out = ''
  for (const ch of raw) {
    const code = ch.codePointAt(0)
    if (code === undefined || isControlCodePoint(code)) continue
    out += ch
  }
  return out.replace(/\s+/g, ' ').trim().slice(0, 20)
}

export function ordinal(n: number) {
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`
  switch (n % 10) {
    case 1:
      return `${n}st`
    case 2:
      return `${n}nd`
    case 3:
      return `${n}rd`
    default:
      return `${n}th`
  }
}
