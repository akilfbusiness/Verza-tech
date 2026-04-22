'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface CtaSectionProps {
  heading: string
  body: string
  ctaLabel: string
  ctaLink: string
}

export function CtaSection({ heading, body, ctaLabel, ctaLink }: CtaSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

  return (
    <section ref={ref} className="border-b border-border bg-foreground">
      <div className="container mx-auto px-6 py-28 max-w-7xl text-center">

        <motion.p
          className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-6"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          Get Started
        </motion.p>

        <motion.h2
          className="text-4xl md:text-6xl font-light text-background mb-6 leading-tight"
          style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
        >
          {heading}
        </motion.h2>

        <motion.p
          className="text-base text-background/60 mb-10 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, delay: 0.25, ease }}
        >
          {body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, delay: 0.4, ease }}
        >
          <Link
            href={ctaLink}
            className="inline-flex items-center justify-center px-8 py-4 text-sm tracking-widest uppercase bg-background text-foreground hover:bg-secondary hover:text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg group"
          >
            {ctaLabel}
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
