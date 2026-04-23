'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect } from 'react'

interface HeroSectionProps {
  headline: string
  subheadline: string
  primaryLabel: string
  primaryLink: string
  secondaryLabel: string
  secondaryLink: string
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]
const HERO_BG = '#080808'
const GOLD    = 'oklch(0.62 0.18 55)'

export function HeroSection({
  headline,
  subheadline,
  primaryLabel,
  primaryLink,
  secondaryLabel,
  secondaryLink,
}: HeroSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const contentY       = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])

  // Signal to the nav that this page has a dark hero
  useEffect(() => {
    document.body.setAttribute('data-dark-hero', 'true')
    return () => document.body.removeAttribute('data-dark-hero')
  }, [])

  const words = headline.split(' ')

  return (
    <section
      ref={ref}
      className="relative min-h-[calc(100vh-4rem)] overflow-hidden flex flex-col"
      style={{ background: HERO_BG }}
    >
      {/* Subtle editorial grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),' +
            'linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Main content — parallax */}
      <motion.div
        className="relative flex-1 flex flex-col justify-between container mx-auto px-6 max-w-7xl py-16 md:py-20"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Top row */}
        <div className="flex items-start justify-between">
          <motion.p
            className="text-xs font-semibold tracking-[0.3em] uppercase"
            style={{ color: GOLD }}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
          >
            Trusted Reviews & Comparisons
          </motion.p>
          <motion.p
            className="text-[10px] tracking-[0.25em] uppercase text-white/20 hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease }}
          >
            Scroll ↓
          </motion.p>
        </div>

        {/* Bottom area: headline + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px] gap-10 lg:gap-20 items-end mt-auto pt-16">
          {/* Headline — word-by-word */}
          <h1
            className="text-white font-light leading-[0.88] m-0"
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(2.8rem, 7vw, 6.5rem)',
              letterSpacing: '-0.02em',
            }}
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[0.22em]"
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.35 + i * 0.08, ease }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Right column */}
          <motion.div
            className="flex flex-col gap-7"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease }}
          >
            <p className="text-white/40 text-sm leading-relaxed">
              {subheadline}
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href={primaryLink}
                className="group inline-flex items-center justify-center px-7 py-4 text-[11px] tracking-[0.25em] uppercase font-medium transition-opacity duration-200 hover:opacity-85"
                style={{ background: GOLD, color: HERO_BG }}
              >
                {primaryLabel}
                <span className="ml-2.5 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href={secondaryLink}
                className="inline-flex items-center justify-center px-7 py-4 text-[11px] tracking-[0.25em] uppercase border border-white/15 text-white/45 hover:border-white/35 hover:text-white/70 transition-all duration-300"
              >
                {secondaryLink === '/reviews' ? 'Read Reviews' : secondaryLabel}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Divider line */}
        <motion.div
          className="mt-14 h-px"
          style={{ background: 'rgba(255,255,255,0.08)' }}
          initial={{ scaleX: 0, originX: '0%' }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1.1, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Giant solid brand letters — Arrodz style, Anton font, full bleed */}
      <div className="pointer-events-none select-none w-full" aria-hidden>
        <motion.p
          className="uppercase leading-none whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-anton), Impact, sans-serif',
            fontSize: 'clamp(9rem, 34vw, 32rem)',
            letterSpacing: '-0.02em',
            color: '#ffffff',
            lineHeight: 0.82,
            marginBottom: '-0.18em',
            marginLeft: '-0.02em',
          }}
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease }}
        >
          VERZA
        </motion.p>
      </div>
    </section>
  )
}
