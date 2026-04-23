'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

const ROWS = [
  { feature: 'Email automations',     a: true,  b: true  },
  { feature: 'SMS marketing',         a: true,  b: false },
  { feature: 'AI send-time optimise', a: true,  b: false },
  { feature: 'Shopify native sync',   a: true,  b: true  },
  { feature: 'A/B testing (flows)',   a: true,  b: false },
  { feature: 'Free plan',             a: false, b: true  },
  { feature: 'Predictive analytics',  a: true,  b: false },
]

const Check = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeOpacity="0.2"/>
    <path d="M4.5 8l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const Cross = () => (
  <svg className="w-4 h-4 shrink-0 text-foreground/20" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeOpacity="0.15"/>
    <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

export function ComparisonSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section
      ref={ref}
      className="py-24 md:py-36 border-t border-border overflow-hidden"
      style={{ background: '#07080c' }}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left — copy */}
          <div>
            <motion.p
              className="text-xs font-semibold tracking-[0.3em] uppercase mb-6"
              style={{ color: 'oklch(0.72 0.1 255)' }}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease }}
            >
              Side-by-side comparisons
            </motion.p>

            <motion.h2
              className="text-white font-light leading-tight mb-8"
              style={{
                fontFamily: 'var(--font-display), sans-serif',
                fontSize: 'clamp(2.2rem, 4.5vw, 4rem)',
                letterSpacing: '-0.01em',
              }}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease }}
            >
              Stop guessing.<br />Compare before you commit.
            </motion.h2>

            <motion.p
              className="text-white/40 text-sm leading-relaxed mb-10 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease }}
            >
              Our comparison engine puts any two tools head-to-head — features, pricing, integrations, support, and a final verdict on who each tool is actually built for.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3, ease }}
            >
              <Link
                href="/compare"
                className="group inline-flex items-center gap-3 px-7 py-4 text-[11px] tracking-[0.25em] uppercase font-semibold transition-opacity duration-200 hover:opacity-85"
                style={{ background: 'oklch(0.72 0.1 255)', color: '#07080c' }}
              >
                Try a comparison
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </motion.div>
          </div>

          {/* Right — animated comparison table */}
          <motion.div
            initial={{ opacity: 0, x: 48 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease }}
          >
            {/* Table header */}
            <div className="grid grid-cols-[1fr_72px_72px] gap-0 mb-1">
              <div />
              <div className="text-center pb-3">
                <p className="text-white text-xs font-semibold tracking-wider uppercase">Klaviyo</p>
              </div>
              <div className="text-center pb-3">
                <p className="text-white/35 text-xs font-semibold tracking-wider uppercase">Mailchimp</p>
              </div>
            </div>

            {/* Rows */}
            <div
              className="border overflow-hidden"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              {ROWS.map((row, i) => (
                <motion.div
                  key={row.feature}
                  className="grid grid-cols-[1fr_72px_72px] items-center"
                  style={{ borderBottom: i < ROWS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
                  initial={{ opacity: 0, x: 16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.35 + i * 0.07, ease }}
                >
                  <div className="px-5 py-3.5">
                    <p className="text-white/45 text-xs">{row.feature}</p>
                  </div>
                  <div className="flex items-center justify-center py-3.5" style={{ color: 'oklch(0.72 0.1 255)' }}>
                    {row.a ? <Check /> : <Cross />}
                  </div>
                  <div className="flex items-center justify-center py-3.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {row.b ? <Check /> : <Cross />}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.p
              className="text-white/18 text-xs mt-3 text-right"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.9, ease }}
            >
              Sample — see full comparison →
            </motion.p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
