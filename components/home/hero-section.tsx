'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface HeroSectionProps {
  headline: string
  subheadline: string
  primaryLabel: string
  primaryLink: string
  secondaryLabel: string
  secondaryLink: string
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function HeroSection({
  headline,
  subheadline,
  primaryLabel,
  primaryLink,
  secondaryLabel,
  secondaryLink,
}: HeroSectionProps) {
  const words = headline.split(' ')

  return (
    <section className="relative border-b border-border overflow-hidden">
      {/* Subtle warm gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/40 via-background to-background pointer-events-none" />

      <div className="container relative mx-auto px-6 py-40 max-w-7xl">
        <div className="max-w-4xl mx-auto text-center">

          {/* Eyebrow */}
          <motion.p
            className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            Trusted Reviews & Comparisons
          </motion.p>

          {/* Headline — word-by-word reveal */}
          <h1
            className="text-6xl md:text-7xl lg:text-8xl font-light leading-tight mb-8 text-foreground"
            style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[0.25em]"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.06, ease }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subheadline */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease }}
          >
            {subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex gap-4 justify-center flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease }}
          >
            <Link
              href={primaryLink}
              className="group inline-flex items-center justify-center px-8 py-4 text-sm tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              {primaryLabel}
              <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href={secondaryLink}
              className="inline-flex items-center justify-center px-8 py-4 text-sm tracking-widest uppercase border border-border text-foreground/70 hover:border-foreground hover:text-foreground transition-all duration-300"
            >
              {secondaryLabel}
            </Link>
          </motion.div>

          {/* Decorative line */}
          <motion.div
            className="mt-20 mx-auto h-px bg-border w-0"
            animate={{ width: '100%' }}
            transition={{ duration: 1.2, delay: 0.9, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </section>
  )
}
