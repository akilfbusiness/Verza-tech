'use client'

import { useState } from 'react'
import { ExternalLink, Copy, Check } from 'lucide-react'

interface AffiliateCTAProps {
  primaryLink?: string
  buttonLabel?: string
  promoCode?: string
  disclosure?: boolean
  variant?: 'hero' | 'inline' | 'sticky'
}

export function AffiliateCTA({
  primaryLink,
  buttonLabel = 'Try It Free',
  promoCode,
  disclosure = true,
  variant = 'hero',
}: AffiliateCTAProps) {
  const [copied, setCopied] = useState(false)

  if (!primaryLink) return null

  const handleCopy = () => {
    if (promoCode) {
      navigator.clipboard.writeText(promoCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (variant === 'sticky') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t shadow-lg md:hidden">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <a
            href={primaryLink}
            target="_blank"
            rel="nofollow noopener noreferrer sponsored"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm"
          >
            {buttonLabel}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-xl border-2 border-primary/20 bg-primary/5 p-6 ${variant === 'inline' ? 'my-8' : ''}`}>
      {disclosure && (
        <p className="text-xs text-muted-foreground mb-3">
          * Affiliate disclosure: We may earn a commission if you purchase through this link, at no extra cost to you.
        </p>
      )}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="font-semibold text-lg">{buttonLabel}</p>
          {promoCode && (
            <p className="text-sm text-muted-foreground mt-1">
              Use code <span className="font-mono font-bold text-primary">{promoCode}</span> at checkout
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {promoCode && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium text-sm hover:bg-secondary transition-colors"
              aria-label="Copy promo code"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : promoCode}
            </button>
          )}
          <a
            href={primaryLink}
            target="_blank"
            rel="nofollow noopener noreferrer sponsored"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            {buttonLabel}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
