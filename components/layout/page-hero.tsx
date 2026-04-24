'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeroProps {
  /** Small uppercase label above the title, rendered in slate-blue */
  label?: string
  /** Page title — displayed in Big Shoulders Display */
  title: string
  /** Short subtext beneath the title */
  subtitle?: string
  /** Breadcrumb trail — Home is always prepended automatically */
  breadcrumbs?: BreadcrumbItem[]
  /** Small info line at the bottom, e.g. "142 tools reviewed" */
  meta?: string
  /** Left-aligned (default) or centred layout */
  align?: 'left' | 'center'
  /** Extra slot — search bar, CTA buttons, filter chips, etc. */
  children?: ReactNode
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]
const HERO_BG = '#07080c'
const ACCENT  = 'oklch(0.72 0.1 255)'

export function PageHero({
  label,
  title,
  subtitle,
  breadcrumbs,
  meta,
  align = 'left',
  children,
}: PageHeroProps) {
  const centred = align === 'center'

  return (
    <section
      className="relative overflow-hidden border-b border-border"
      style={{ background: HERO_BG }}
    >
      {/* Editorial grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),' +
            'linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Subtle glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-10%',
          right: centred ? '35%' : '5%',
          width: '50vw',
          height: '50vw',
          maxWidth: '600px',
          maxHeight: '600px',
          background: 'radial-gradient(circle, oklch(0.72 0.1 255 / 0.07) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      <div
        className={`relative container mx-auto px-6 max-w-7xl py-20 md:py-28 ${centred ? 'text-center' : ''}`}
      >
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <motion.nav
            aria-label="Breadcrumb"
            className={`mb-6 ${centred ? 'flex justify-center' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease }}
          >
            <ol className="flex items-center gap-2 text-xs tracking-wide text-white/25">
              <li>
                <Link href="/" className="hover:text-white/50 transition-colors duration-200">
                  Home
                </Link>
              </li>
              {breadcrumbs.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span aria-hidden>/</span>
                  {item.href && i < breadcrumbs.length - 1 ? (
                    <Link href={item.href} className="hover:text-white/50 transition-colors duration-200">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-white/45">{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </motion.nav>
        )}

        {/* Label */}
        {label && (
          <motion.p
            className="text-xs font-semibold tracking-[0.3em] uppercase mb-5"
            style={{ color: ACCENT }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
          >
            {label}
          </motion.p>
        )}

        {/* Title */}
        <motion.h1
          className="text-white font-light leading-[1.0] m-0"
          style={{
            fontFamily: 'var(--font-display), sans-serif',
            fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
            letterSpacing: '-0.01em',
          }}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            className="mt-5 text-white/40 text-sm leading-relaxed max-w-xl"
            style={centred ? { margin: '1.25rem auto 0' } : {}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Extra slot (search, CTAs, filters) */}
        {children && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease }}
          >
            {children}
          </motion.div>
        )}

        {/* Meta line */}
        {meta && (
          <motion.p
            className="mt-6 text-[11px] tracking-[0.2em] uppercase text-white/22"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease }}
          >
            {meta}
          </motion.p>
        )}

        {/* Divider */}
        <motion.div
          className="mt-12 h-px"
          style={{ background: 'rgba(255,255,255,0.07)' }}
          initial={{ scaleX: 0, originX: centred ? '50%' : '0%' }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: 'easeInOut' }}
        />
      </div>
    </section>
  )
}
