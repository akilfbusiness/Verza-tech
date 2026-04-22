'use client'

import { useInView, useMotionValue, useSpring, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface CountUpProps {
  value: string
  className?: string
}

export function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  // Extract the numeric part and suffix (e.g. "134.7x" → 134.7, "x")
  const match = value.match(/^([0-9,]+\.?[0-9]*)(.*)$/)

  useEffect(() => {
    if (!inView || !ref.current || !match) return
    const num = parseFloat(match[1].replace(/,/g, ''))
    const suffix = match[2] || ''
    const controls = animate(0, num, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate(v) {
        if (!ref.current) return
        ref.current.textContent =
          (num % 1 === 0 ? Math.round(v).toLocaleString() : v.toFixed(1)) + suffix
      },
    })
    return () => controls.stop()
  }, [inView, value, match])

  if (!match) {
    return <span ref={ref} className={className}>{value}</span>
  }

  return <span ref={ref} className={className}>0{match[2]}</span>
}
