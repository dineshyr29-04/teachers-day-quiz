'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Countdown to an absolute server deadline.
 *
 * Takes the server/device clock offset measured by `useQuizStream` so every
 * participant sees the same number at the same moment, regardless of how far
 * their phone's clock has drifted. Updates are driven by requestAnimationFrame
 * but only committed when the value moves meaningfully, which keeps a smooth
 * timer ring from causing 60 React renders a second.
 */
export function useCountdown(deadline: number | undefined, clockOffsetMs: number) {
  const [msLeft, setMsLeft] = useState(() =>
    deadline === undefined ? 0 : Math.max(0, deadline - (Date.now() + clockOffsetMs)),
  )
  const lastCommitted = useRef(msLeft)

  useEffect(() => {
    if (deadline === undefined) {
      setMsLeft(0)
      return
    }

    let frame = 0
    const tick = () => {
      const remaining = Math.max(0, deadline - (Date.now() + clockOffsetMs))
      // Commit on a ~40ms granularity, and always commit the final zero.
      if (Math.abs(remaining - lastCommitted.current) >= 40 || remaining === 0) {
        lastCommitted.current = remaining
        setMsLeft(remaining)
      }
      if (remaining > 0) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [deadline, clockOffsetMs])

  return {
    msLeft,
    /** Whole seconds remaining, rounded up: reads 20 for the first instant. */
    secondsLeft: Math.ceil(msLeft / 1000),
  }
}
