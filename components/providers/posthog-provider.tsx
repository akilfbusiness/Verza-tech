'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import { useEffect, useRef, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// Captures page views on every client-side navigation (SPA-style route changes)
function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const client = usePostHog()
  const lastUrl = useRef<string>('')

  useEffect(() => {
    if (!client) return
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    if (url === lastUrl.current) return
    lastUrl.current = url

    client.capture('$pageview', {
      $current_url: window.location.href,
      // Captures referrer so you can see traffic from ChatGPT, Perplexity, Google etc.
      $referrer: document.referrer,
      $referring_domain: document.referrer ? new URL(document.referrer).hostname : '',
    })
  }, [pathname, searchParams, client])

  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      // Capture pageviews manually via PostHogPageView so Next.js navigation is tracked correctly
      capture_pageview: false,
      capture_pageleave: true,
      // Respect user privacy — disable session recording by default
      disable_session_recording: false,
      person_profiles: 'identified_only',
      loaded: (ph) => {
        if (process.env.NODE_ENV === 'development') ph.debug()
      },
    })
  }, [])

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  )
}
