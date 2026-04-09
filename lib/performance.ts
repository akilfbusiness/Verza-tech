// Cache Life Profiles for Next.js 16
export const cacheProfiles = {
  // Short-lived data (1 hour)
  short: {
    revalidate: 3600,
  },
  // Medium-lived data (1 day)
  medium: {
    revalidate: 86400,
  },
  // Long-lived data (1 week)
  long: {
    revalidate: 604800,
  },
  // Maximum cache (30 days)
  max: {
    revalidate: 2592000,
  },
} as const

// Performance monitoring utilities
export function measurePerformance<T>(
  label: string,
  fn: () => T
): T {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    console.log(`[v0] Performance [${label}]: ${(end - start).toFixed(2)}ms`)
    return result
  }
  return fn()
}

export async function measureAsyncPerformance<T>(
  label: string,
  fn: () => Promise<T>
): Promise<T> {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now()
    const result = await fn()
    const end = performance.now()
    console.log(`[v0] Performance [${label}]: ${(end - start).toFixed(2)}ms`)
    return result
  }
  return fn()
}

// Image optimization helpers
export function getOptimizedImageUrl(
  src: string,
  options: {
    width?: number
    quality?: number
    format?: 'webp' | 'avif' | 'auto'
  } = {}
): string {
  const { width, quality = 85, format = 'auto' } = options
  
  // If it's a Sanity image, use Sanity's image API
  if (src.includes('cdn.sanity.io')) {
    const url = new URL(src)
    if (width) url.searchParams.set('w', width.toString())
    url.searchParams.set('q', quality.toString())
    if (format !== 'auto') url.searchParams.set('fm', format)
    url.searchParams.set('auto', 'format')
    return url.toString()
  }
  
  return src
}

// Core Web Vitals thresholds
export const webVitalsThresholds = {
  LCP: {
    good: 2500,
    needsImprovement: 4000,
  },
  FID: {
    good: 100,
    needsImprovement: 300,
  },
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
  },
  FCP: {
    good: 1800,
    needsImprovement: 3000,
  },
  TTFB: {
    good: 800,
    needsImprovement: 1800,
  },
} as const

// Preload critical resources
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return
  
  // Preload critical fonts
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'font'
  link.type = 'font/woff2'
  link.crossOrigin = 'anonymous'
  document.head.appendChild(link)
}
