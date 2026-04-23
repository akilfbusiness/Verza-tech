'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function NewsletterSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) setSubmitted(true)
  }

  return (
    <section
      ref={ref}
      className="py-24 md:py-36 border-t border-border"
      style={{ background: '#07080c' }}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <motion.p
              className="text-xs font-semibold tracking-[0.3em] uppercase mb-6"
              style={{ color: 'oklch(0.72 0.1 255)' }}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease }}
            >
              Stay informed
            </motion.p>

            <motion.h2
              className="text-white font-light leading-[1.05] mb-6"
              style={{
                fontFamily: 'var(--font-display), sans-serif',
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                letterSpacing: '-0.02em',
              }}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease }}
            >
              The best tool reviews, delivered to your inbox
            </motion.h2>

            <motion.p
              className="text-white/35 text-sm leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease }}
            >
              Join 10,000+ founders, operators, and marketers who get Verza's weekly digest of tool reviews, comparisons, and recommendations.
            </motion.p>
          </div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease }}
          >
            {submitted ? (
              <div
                className="p-8 border"
                style={{ borderColor: 'oklch(0.72 0.1 255 / 0.3)' }}
              >
                <p
                  className="text-white font-light"
                  style={{
                    fontFamily: 'var(--font-display), sans-serif',
                    fontSize: '1.4rem',
                    letterSpacing: '-0.01em',
                  }}
                >
                  You're on the list.
                </p>
                <p className="text-white/35 text-sm mt-2">
                  We'll be in touch soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-5 py-4 text-sm bg-transparent border text-white placeholder:text-white/20 focus:outline-none focus:ring-0 transition-colors duration-200"
                  style={{ borderColor: 'rgba(255,255,255,0.12)' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'oklch(0.72 0.1 255 / 0.5)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                />
                <button
                  type="submit"
                  className="w-full px-7 py-4 text-[11px] tracking-[0.25em] uppercase font-medium transition-opacity duration-200 hover:opacity-85"
                  style={{ background: 'oklch(0.72 0.1 255)', color: '#07080c' }}
                >
                  Subscribe — it's free
                </button>
                <p className="text-white/18 text-xs text-center mt-1">
                  No spam. Unsubscribe any time.
                </p>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
