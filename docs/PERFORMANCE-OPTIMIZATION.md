# Performance Optimization Guide - Verza

## Overview

This document outlines all performance optimizations implemented in Verza to achieve excellent Core Web Vitals scores and fast page loads for both users and AI crawlers.

---

## Core Web Vitals Targets

### Current Targets (Google Standards)
- **LCP (Largest Contentful Paint)**: < 2.5s (Good)
- **FID (First Input Delay)**: < 100ms (Good)
- **CLS (Cumulative Layout Shift)**: < 0.1 (Good)
- **FCP (First Contentful Paint)**: < 1.8s (Good)
- **TTFB (Time to First Byte)**: < 800ms (Good)

### Why This Matters
- Google uses Core Web Vitals as ranking signals
- AI crawlers prioritize fast, reliable sources
- Better UX = higher engagement = better SEO signals
- Fast sites get crawled more frequently

---

## Implemented Optimizations

### 1. Static Site Generation (SSG) with ISR

**What:**
All content pages are pre-rendered at build time with Incremental Static Regeneration.

**Configuration:**
```typescript
export const revalidate = 3600 // 1 hour
export const dynamic = 'force-static'
export const dynamicParams = true
export const fetchCache = 'default-cache'
```

**Benefits:**
- TTFB < 100ms (served from CDN)
- No database queries on page load
- Scales infinitely without backend load
- AI crawlers get instant HTML

**Pages Using SSG:**
- `/tools/[slug]` - Tool profiles
- `/reviews/[slug]` - Reviews
- `/category/[slug]` - Category pages
- `/` - Homepage
- `/tools` - Tool directory
- `/reviews` - Review directory

---

### 2. Image Optimization

**Next.js Image Component:**
All images use `<Image>` from `next/image` with:
- Automatic WebP/AVIF conversion
- Responsive srcsets
- Lazy loading (below the fold)
- Blur placeholders to prevent CLS

**Sanity CDN Integration:**
- Images served from Sanity CDN with automatic optimization
- Width, quality, and format parameters
- Global CDN with edge caching

**Configuration:**
```typescript
// next.config.mjs
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn.sanity.io',
      pathname: '/**',
    },
  ],
}
```

---

### 3. Font Optimization

**Strategy:**
- Using `next/font` for automatic optimization
- Font files self-hosted (no external requests)
- `font-display: swap` to prevent FOIT
- Subset to Latin characters only
- Variable fonts for smaller file sizes

**Fonts:**
- Geist (sans-serif) - primary
- Geist Mono (monospace) - code/technical

**Implementation:**
```typescript
const geist = Geist({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})
```

---

### 4. Caching Strategy

**Browser Caching:**
- Static assets: 1 year (immutable)
- Images: 1 year with CDN
- API routes: Controlled via Cache-Control headers

**Server-Side Caching:**
- ISR: 1 hour revalidation
- Sanity queries cached per page
- Static generation for all content pages

**CDN Caching (Vercel):**
- Edge network caching
- Automatic cache invalidation on deploy
- Stale-while-revalidate for ISR

---

### 5. Code Splitting & Bundle Optimization

**Automatic Optimizations:**
- Route-based code splitting (Next.js default)
- Server Components (zero client JS where possible)
- Dynamic imports for heavy components
- Tree shaking in production builds

**Bundle Analysis:**
Run `npm run build` to see bundle sizes.

**Server vs Client Components:**
- All content pages: Server Components
- Error boundaries: Client Components
- Interactive elements only: Client Components

---

### 6. Loading States & Skeleton Screens

**Purpose:**
Prevent CLS and show meaningful content immediately.

**Implementation:**
- `/tools/loading.tsx` - Tool directory skeleton
- `/tools/[slug]/loading.tsx` - Tool detail skeleton
- `/reviews/loading.tsx` - Review directory skeleton

**Benefits:**
- CLS score remains < 0.1
- Perceived performance improvement
- Progressive enhancement

---

### 7. Error Handling

**Error Boundaries:**
- `/error.tsx` - Page-level errors
- `/global-error.tsx` - Critical errors
- `/not-found.tsx` - 404 pages

**Benefits:**
- Graceful degradation
- User-friendly error messages
- Preserves SEO (proper 404 status codes)

---

### 8. Streaming & Suspense

**Next.js 16 Streaming:**
- Async Server Components stream HTML
- Above-the-fold content renders first
- Progressive enhancement

**Future Implementation:**
```typescript
<Suspense fallback={<Skeleton />}>
  <HeavyComponent />
</Suspense>
```

---

## Performance Monitoring

### Vercel Analytics

**Setup:**
```bash
# Already installed
@vercel/analytics
```

**Tracks:**
- Core Web Vitals
- Page load times
- User interactions
- Real User Monitoring (RUM)

### Web Vitals Reporting

**Custom Implementation:**
```typescript
// lib/web-vitals.ts
export function reportWebVitals(metric: Metric) {
  // Send to analytics
}
```

**Metrics Tracked:**
- LCP, FID, CLS, FCP, TTFB
- Connection speed
- Page URL
- Device type

---

## Performance Checklist

### Build Time
- [x] Static generation for all content pages
- [x] Image optimization configured
- [x] Font optimization enabled
- [x] Code splitting automatic
- [x] Bundle size optimized

### Runtime
- [x] ISR with 1-hour revalidation
- [x] Loading states for all async content
- [x] Error boundaries
- [x] Proper HTTP caching headers

### Monitoring
- [x] Vercel Analytics enabled
- [x] Web Vitals tracking
- [x] Development performance logging

---

## Testing Performance

### Local Testing

**Lighthouse:**
```bash
# Run Lighthouse in Chrome DevTools
# Target scores:
# Performance: 95+
# Accessibility: 95+
# Best Practices: 95+
# SEO: 100
```

**Chrome DevTools:**
1. Network tab: Check waterfall, TTFB
2. Performance tab: Record page load
3. Coverage tab: Unused CSS/JS

### Production Testing

**Tools:**
- Google PageSpeed Insights
- WebPageTest.org
- GTmetrix
- Vercel Analytics Dashboard

**Real User Monitoring:**
Check Vercel Analytics for actual user metrics.

---

## Optimization Roadmap

### Completed
- Static generation with ISR
- Image optimization
- Font optimization
- Caching strategy
- Loading states
- Error handling

### Future Enhancements
- [ ] Service Worker for offline support
- [ ] Prefetch links on hover
- [ ] Resource hints (dns-prefetch, preconnect)
- [ ] Critical CSS inlining
- [ ] HTTP/3 support (automatic with Vercel)

---

## Performance Budget

### Page Weight Targets
- **Homepage**: < 500 KB (uncompressed)
- **Tool Page**: < 800 KB (with images)
- **Review Page**: < 1 MB (with rich content)

### JavaScript Budget
- **Initial Bundle**: < 100 KB (gzipped)
- **Per Route**: < 50 KB (gzipped)

### Load Time Targets
- **TTFB**: < 200ms (from CDN)
- **FCP**: < 1.0s
- **LCP**: < 2.0s
- **TTI**: < 3.0s

---

## Common Issues & Solutions

### Issue: Slow TTFB
**Solution:** Ensure ISR is working, check Vercel deployment region.

### Issue: Large CLS
**Solution:** Add explicit width/height to images, use loading skeletons.

### Issue: Slow LCP
**Solution:** Optimize hero images, ensure above-fold content is static.

### Issue: Large JavaScript Bundle
**Solution:** Move to Server Components, use dynamic imports.

---

## AI Crawler Specific Optimizations

### Why AI Crawlers Care About Performance

1. **Crawl Budget**: Faster sites get crawled more pages
2. **Reliability**: Slow/timeout sites get deprioritized
3. **Data Quality**: Fast responses = complete HTML = better parsing
4. **Freshness**: ISR ensures content is recent but fast

### Optimizations for AI Crawlers

- **SSR/SSG**: Full HTML in initial response (no JS required)
- **Fast TTFB**: CDN edge caching (< 100ms globally)
- **Semantic HTML**: No hydration needed for parsing
- **Structured Data**: Embedded in initial HTML response
- **robots.txt**: Explicit crawler permissions
- **Sitemap**: Updated hourly with new content

---

## Maintenance

### Weekly
- Check Vercel Analytics dashboard
- Review Core Web Vitals scores
- Check for 404 errors

### Monthly
- Run Lighthouse audit
- Review bundle sizes
- Check for unused dependencies

### Quarterly
- Full performance audit
- Update dependencies
- Review optimization strategy

---

## Resources

- [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Core Web Vitals](https://web.dev/vitals/)
- [Vercel Analytics](https://vercel.com/docs/analytics)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)

---

**Last Updated:** 2026-04-09
**Next Review:** 2026-07-09
