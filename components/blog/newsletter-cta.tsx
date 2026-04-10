'use client'

import { useState } from 'react'
import { Mail, ArrowRight, Check, Loader2 } from 'lucide-react'

interface NewsletterCTAProps {
  /** Compact single-line variant for inline use mid-article */
  variant?: 'inline' | 'card' | 'minimal'
  /** Headline override */
  headline?: string
  /** Subtext override */
  subtext?: string
  /** Context tag — tells the API which article/page triggered the signup */
  source?: string
}

export function NewsletterCTA({
  variant = 'card',
  headline,
  subtext,
  source = 'blog',
}: NewsletterCTAProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const defaultHeadlines: Record<NonNullable<NewsletterCTAProps['variant']>, string> = {
    card:    'Stay ahead of the curve.',
    inline:  'Get the best AI tool picks, weekly.',
    minimal: 'Subscribe for weekly AI tool reviews',
  }

  const defaultSubtext: Record<NonNullable<NewsletterCTAProps['variant']>, string> = {
    card:    'Weekly roundups of the best AI tools, honest reviews, and exclusive deals — straight to your inbox. No spam.',
    inline:  'Join 5,000+ marketers and founders getting our weekly AI tools digest.',
    minimal: '',
  }

  const resolvedHeadline = headline || defaultHeadlines[variant]
  const resolvedSubtext  = subtext  || defaultSubtext[variant]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || status === 'loading') return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Something went wrong.')
      }

      setStatus('success')
      setEmail('')
    } catch (err: any) {
      setStatus('error')
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div
        className={`flex items-center gap-3 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl px-5 py-4 ${
          variant === 'minimal' ? 'rounded-lg' : ''
        }`}
        role="status"
        aria-live="polite"
      >
        <Check className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
        <span>You&apos;re in. Check your inbox for a confirmation email.</span>
      </div>
    )
  }

  // ── Minimal variant ─────────────────────────────────────────────────────
  if (variant === 'minimal') {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2" noValidate>
        <label htmlFor="newsletter-minimal" className="sr-only">Email address</label>
        <input
          id="newsletter-minimal"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {status === 'loading'
            ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            : 'Subscribe'
          }
        </button>
      </form>
    )
  }

  // ── Inline variant ──────────────────────────────────────────────────────
  if (variant === 'inline') {
    return (
      <aside className="my-8 border rounded-xl p-5 bg-secondary/30">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold text-sm">{resolvedHeadline}</p>
              {resolvedSubtext && (
                <p className="text-xs text-muted-foreground mt-0.5">{resolvedSubtext}</p>
              )}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 flex-shrink-0" noValidate>
            <label htmlFor="newsletter-inline" className="sr-only">Email address</label>
            <input
              id="newsletter-inline"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-48 px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Email address"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {status === 'loading'
                ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                : <><span>Join</span><ArrowRight className="w-3.5 h-3.5" aria-hidden="true" /></>
              }
            </button>
          </form>
        </div>
        {status === 'error' && (
          <p className="text-xs text-red-600 mt-2" role="alert">{errorMsg}</p>
        )}
      </aside>
    )
  }

  // ── Card variant (default) ──────────────────────────────────────────────
  return (
    <aside className="my-10 rounded-2xl border-2 border-primary/20 bg-primary/5 p-8 text-center">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Mail className="w-6 h-6 text-primary" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-balance">{resolvedHeadline}</h3>
      {resolvedSubtext && (
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
          {resolvedSubtext}
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" noValidate>
        <label htmlFor="newsletter-card" className="sr-only">Email address</label>
        <input
          id="newsletter-card"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-4 py-3 text-sm border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="flex items-center justify-center gap-2 px-6 py-3 font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          {status === 'loading'
            ? <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /><span>Subscribing...</span></>
            : <><span>Get the digest</span><ArrowRight className="w-4 h-4" aria-hidden="true" /></>
          }
        </button>
      </form>
      {status === 'error' && (
        <p className="text-xs text-red-600 mt-3" role="alert">{errorMsg}</p>
      )}
      <p className="text-xs text-muted-foreground mt-4">No spam. Unsubscribe anytime.</p>
    </aside>
  )
}
