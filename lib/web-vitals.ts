'use client'

import { onCLS, onFID, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals'

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals'

function getConnectionSpeed(): string {
  if (typeof navigator === 'undefined') return 'unknown'
  
  const connection = (navigator as any).connection
  if (!connection) return 'unknown'
  
  return connection.effectiveType || 'unknown'
}

export function reportWebVitals(metric: Metric) {
  const body = {
    dsn: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[v0] Web Vital:', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
    })
  }

  // Send to Vercel Analytics
  if (process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID) {
    const blob = new Blob([new URLSearchParams(body).toString()], {
      type: 'application/x-www-form-urlencoded',
    })
    if (navigator.sendBeacon) {
      navigator.sendBeacon(vitalsUrl, blob)
    }
  }
}

export function initWebVitals() {
  onCLS(reportWebVitals)
  onFID(reportWebVitals)
  onLCP(reportWebVitals)
  onFCP(reportWebVitals)
  onTTFB(reportWebVitals)
}
