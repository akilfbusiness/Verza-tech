'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

const STEPS = [
  {
    number: '1',
    title: 'Browse the library',
    body: 'Explore 500+ tools across CRM, email, payments, logistics, analytics, and more — organised by category and use case.',
    cta: { label: 'Browse Tools', href: '/tools' },
  },
  {
    number: '2',
    title: 'Compare side-by-side',
    body: 'Use our comparison engine to evaluate features, pricing tiers, integrations, and real user ratings in one view.',
    cta: { label: 'Compare Now', href: '/compare' },
  },
  {
    number: '3',
    title: 'Choose with confidence',
    body: 'Read our in-depth reviews, see who each tool is built for, and get a clear recommendation before you commit.',
    cta: { label: 'Read Reviews', href: '/reviews' },
  },
]

export function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section ref={ref} className="py-24 md:py-36 border-t border-border bg-background">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mb-20">
          <div>
            <motion.p
              className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-5"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease }}
            >
              How it works
            </motion.p>
            <motion.h2
              className="font-light leading-[1.05]"
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 'clamp(2.2rem, 4.5vw, 4rem)',
                letterSpacing: '-0.02em',
              }}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease }}
            >
              From research to confident decision in three steps
            </motion.h2>
          </div>
          <motion.p
            className="text-muted-foreground text-sm leading-relaxed lg:max-w-sm lg:ml-auto"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease }}
          >
            Verza cuts through the noise so you spend less time researching and more time growing your business.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              className="bg-background p-10 flex flex-col gap-6"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease }}
            >
              <span
                className="text-[3.5rem] font-light leading-none tabular-nums"
                style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  color: 'var(--primary)',
                  opacity: 0.35,
                }}
              >
                {step.number}
              </span>
              <div className="flex-1">
                <h3
                  className="text-foreground font-medium mb-3"
                  style={{
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontSize: '1.35rem',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.body}
                </p>
              </div>
              <Link
                href={step.cta.href}
                className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-primary/60 hover:text-primary transition-colors duration-300"
              >
                {step.cta.label}
                <span>→</span>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
