'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

const PILLARS = [
  {
    number: '01',
    title: 'Independent Testing',
    body: 'We purchase and test tools ourselves. No sponsored rankings, no pay-to-play placements.',
  },
  {
    number: '02',
    title: 'Real-World Context',
    body: 'Every review is grounded in how tools perform for Australian e-commerce and SaaS businesses.',
  },
  {
    number: '03',
    title: 'Honest Verdicts',
    body: 'We tell you what each tool does well and where it falls short — including when to look elsewhere.',
  },
]

export function AboutSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })

  return (
    <section
      ref={ref}
      className="py-24 md:py-36 border-t border-border"
      style={{ background: '#07080c' }}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left — headline + body */}
          <div>
            <motion.p
              className="text-xs font-semibold tracking-[0.3em] uppercase mb-6"
              style={{ color: 'oklch(0.72 0.1 255)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease }}
            >
              About Verza
            </motion.p>

            <motion.h2
              className="text-white font-light leading-[1.05] mb-8"
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 'clamp(2.2rem, 4.5vw, 4rem)',
                letterSpacing: '-0.02em',
              }}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease }}
            >
              The independent source for software decisions
            </motion.h2>

            <motion.p
              className="text-white/45 text-base leading-relaxed mb-10 max-w-lg"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease }}
            >
              We spend hundreds of hours testing the tools that power modern businesses — so you can make confident decisions without the guesswork. No affiliate pressure. No vendor influence. Just honest analysis.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3, ease }}
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors duration-300"
              >
                Learn more about us
                <span className="text-base">→</span>
              </Link>
            </motion.div>
          </div>

          {/* Right — three pillars */}
          <div className="flex flex-col gap-8 pt-4 lg:pt-16">
            {PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.number}
                className="grid grid-cols-[2rem_1fr] gap-5 items-start"
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.12, ease }}
              >
                <span
                  className="text-xs font-semibold tabular-nums mt-1"
                  style={{ color: 'oklch(0.72 0.1 255 / 0.6)' }}
                >
                  {pillar.number}
                </span>
                <div>
                  <p
                    className="text-white font-medium mb-2"
                    style={{
                      fontFamily: 'var(--font-cormorant), Georgia, serif',
                      fontSize: '1.2rem',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {pillar.title}
                  </p>
                  <p className="text-white/35 text-sm leading-relaxed">
                    {pillar.body}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Divider stat */}
            <motion.div
              className="mt-4 pt-8 border-t"
              style={{ borderColor: 'rgba(255,255,255,0.07)' }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6, ease }}
            >
              <p
                className="text-white font-light"
                style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                }}
              >
                500+ tools tested
              </p>
              <p className="text-white/30 text-xs tracking-widest uppercase mt-1">
                and counting
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
