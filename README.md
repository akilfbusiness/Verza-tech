# Verza - SaaS & AI Tool Review Platform

A high-performance, SEO and AEO-optimized Next.js 16 website for reviewing and comparing SaaS and AI tools.

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19.2)
- **CMS:** Sanity
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Language:** TypeScript
- **Deployment:** Vercel

## Features

### Performance & Architecture
- ✅ Server-Side Rendering (SSR) with React Server Components
- ✅ Next.js 16 with React Compiler and Cache Components
- ✅ Turbopack for fast builds and development
- ✅ Optimized for Core Web Vitals

### SEO & AEO Optimization
- ✅ Native Next.js metadata API with `generateMetadata()`
- ✅ Dynamic sitemap generation from Sanity content
- ✅ Comprehensive robots.txt with explicit AI crawler permissions
- ✅ Semantic HTML structure
- ✅ Proper Open Graph and Twitter Card metadata
- ✅ Canonical URLs with `metadataBase`
- ✅ Ready for Schema.org structured data (Phase 5)

### Content Management
- ✅ Headless CMS with Sanity
- ✅ Content types: Tools, Categories, Reviews, FAQs, Comparisons, Authors
- ✅ Rich text editing with Portable Text
- ✅ Image optimization with Next.js Image
- ✅ Affiliate link management

## Project Structure

```
/app                    # Next.js App Router pages
  layout.tsx           # Root layout with metadata
  robots.ts            # Dynamic robots.txt with AI crawler rules
  sitemap.ts           # Dynamic sitemap from Sanity

/lib                   # Core utilities
  sanity.config.ts     # Sanity client configuration
  sanity.types.ts      # TypeScript types for content
  sanity.queries.ts    # Reusable Sanity queries
  sanity.image.ts      # Image URL builder helpers
  env.ts              # Environment variable validation
  utils.ts            # General utilities

/sanity               # Sanity CMS schemas
  /schemas            # Content type definitions
    tool.schema.ts
    category.schema.ts
    author.schema.ts
    review.schema.ts
    faq.schema.ts
    comparison.schema.ts
  README.md           # Sanity setup guide

/components           # React components
  /ui                 # shadcn/ui components

/public              # Static assets
```

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Sanity CMS

Follow the detailed guide in `/sanity/README.md`:

1. Create a Sanity project
2. Copy schemas to your Sanity Studio
3. Get your project credentials
4. Add environment variables

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Update `.env.local` with your Sanity credentials:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_token
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Development Phases

### ✅ Phase 1: Foundation & Core Architecture (COMPLETE)
- Next.js 16 setup with Turbopack and React Compiler
- Sanity CMS integration
- Root layout with comprehensive metadata
- robots.ts with AI crawler permissions
- Dynamic sitemap generation
- Environment configuration
- TypeScript types and queries

### 🔄 Phase 2: Content Models & Data Structure (NEXT)
- Implement Sanity schemas in Studio
- Set up content workflows
- Create seed content

### ⏳ Phase 3: Dynamic Pages & SSR Implementation
- Tool listing and detail pages
- Review pages
- Category pages
- Comparison pages

### ⏳ Phase 4: Global GEO Optimization
- Dynamic metadata optimization
- OG image generation
- Performance optimization
- Internal linking strategy

### ⏳ Phase 5: Schema.org Structured Data (Critical for AEO)
- SoftwareApplication schema
- Review schema
- FAQPage schema
- Organization schema

### ⏳ Phase 6: Local/National GEO Optimization
- LocalBusiness schema
- Australian market optimization

### ⏳ Phase 7: AEO-Specific Features
- Direct answer sections
- Comparison tables
- Pros/Cons formatting

### ⏳ Phase 8: Performance & Technical SEO
- Core Web Vitals optimization
- Caching strategies
- Error handling

### ⏳ Phase 9: Content Features & UX Polish
- Search functionality
- Filtering and sorting
- Related content

### ⏳ Phase 10: Testing & Launch
- Rich results testing
- Performance audits
- Cross-browser testing

## Key Configuration

### Next.js 16 Features Enabled

- ✅ React Compiler (`reactCompiler: true`)
- ✅ Cache Components (`cacheComponents: true`)
- ✅ Turbopack (default in Next.js 16)

### SEO Configuration

- **Language:** `en-AU` (Australian English)
- **Canonical URLs:** Enabled via `metadataBase`
- **Open Graph:** Optimized for social sharing
- **AI Crawlers:** Explicitly allowed (GPTBot, Claude-Web, PerplexityBot, etc.)

### Performance Targets

- **TTFB:** < 200ms
- **LCP:** < 2.5s
- **CLS:** < 0.1
- **FID:** < 100ms

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables on Vercel

Add these in your Vercel project settings:

```
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SANITY_API_VERSION
SANITY_API_TOKEN
NEXT_PUBLIC_SITE_URL
```

## License

Private - All rights reserved
