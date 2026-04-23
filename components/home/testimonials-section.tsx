'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

const TESTIMONIALS = [
  {
    quote: "Verza saved me weeks of research. The comparison breakdowns are genuinely useful — not just feature tick-boxes, but real context about who each tool is for.",
    author: 'Sarah K.',
    role: 'Head of Growth',
    company: 'E-commerce brand, AU',
    initials: 'SK',
  },
  {
    quote: "I switched our entire email stack based on a Verza comparison. The pricing analysis alone justified the read — they found a tier we didn't know existed.",
    author: 'Marcus T.',
    role: 'Founder',
    company: 'SaaS startup, Sydney',
    initials: 'MT',
  },
  {
    quote: "Finally a review site that doesn't just repeat the vendor's own marketing copy. Verza gives you the real trade-offs.",
    author: 'Priya N.',
    role: 'Operations Manager',
    company: 'DTC retailer, Melbourne',
    initials: 'PN',
  },
]

export function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section ref={ref} className="py-24 md:py-36 border-t border-border bg-background overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <motion.p
              className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-5"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease }}
            >
              What readers say
            </motion.p>
            <motion.h2
              className="font-light leading-tight"
              style={{
                fontFamily: 'var(--font-display), sans-serif',
                fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
                letterSpacing: '-0.01em',
              }}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease }}
            >
              Trusted by operators<br className="hidden md:block" /> who ship software decisions
            </motion.h2>
          </div>

          {/* Floating stat */}
          <motion.div
            className="shrink-0 text-right hidden md:block"
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25, ease }}
          >
            <p
              className="text-foreground font-light"
              style={{
                fontFamily: 'var(--font-display), sans-serif',
                fontSize: '3.5rem',
                lineHeight: 1,
              }}
            >
              4.9
            </p>
            <p className="text-muted-foreground text-xs tracking-widest uppercase mt-1">Avg reader rating</p>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              className="relative p-8 border border-border flex flex-col gap-6 group hover:border-primary/40 transition-colors duration-300"
              initial={{ opacity: 0, y: 48 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 + i * 0.13, ease }}
            >
              {/* Top accent on hover */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

              {/* Quote mark */}
              <span
                className="text-5xl leading-none select-none"
                style={{ color: 'var(--primary)', opacity: 0.25 }}
                aria-hidden
              >
                "
              </span>

              <p className="text-foreground/70 text-sm leading-relaxed flex-1">
                {t.quote}
              </p>

              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                  style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role} · {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
