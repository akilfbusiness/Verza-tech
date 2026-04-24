## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)

---

## Verza Design System

All pages and components must follow this design system. Diverging from it without a strong reason creates visual inconsistency.

### Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Display headings | `var(--font-display)` = Big Shoulders | 300–600 | All h1–h6, card titles, section headings |
| Brand letters | `var(--font-bebas-neue)` = Bebas Neue | 400 | VERZA hero letterform only |
| Body | `var(--font-inter)` = Inter | 400–500 | Body text, nav, labels |
| Mono | `var(--font-mono)` = JetBrains Mono | 400 | Code blocks |

Never hardcode `fontFamily: 'Cormorant Garamond'` or `Georgia` — use `var(--font-display)`.

### Colour Tokens

| Token | Value | Use |
|-------|-------|-----|
| `--primary` | `oklch(0.42 0.15 262)` | CTAs, links, accent labels (light bg) |
| `ACCENT` (dark sections) | `oklch(0.72 0.1 255)` | CTAs and labels on dark (`#07080c`) backgrounds |
| `--foreground` | near-black | All body text on white |
| `--muted-foreground` | mid-grey | Secondary text, meta info |
| `--border` | `oklch(0.91 0.003 262)` | All dividers and card borders |
| Hero bg | `#07080c` | Dark sections: hero, about, comparison, newsletter |

No orange, amber, or warm gold anywhere. The orange accent was intentionally replaced.

### Section Rhythm

Interior pages alternate between dark and light sections when possible:

```
Dark hero banner  →  Light content  →  Dark CTA/newsletter
```

Dark section template:
```tsx
<section style={{ background: '#07080c' }} className="py-24 md:py-36 border-t border-border">
```

Light section template:
```tsx
<section className="py-24 md:py-36 border-t border-border bg-background">
```

### Shared Components

Always use these — do not roll custom versions:

| Component | Path | Purpose |
|-----------|------|---------|
| `PageHero` | `components/layout/page-hero.tsx` | Dark banner header for every interior page |
| `ContentCard` | `components/ui/content-card.tsx` | Tool / review / blog post cards (3 variants) |
| `FadeIn` | `components/animations/fade-in.tsx` | Scroll-triggered reveal |
| `StaggerChildren` | `components/animations/stagger-children.tsx` | Staggered list/grid reveals |

### PageHero Usage

```tsx
import { PageHero } from '@/components/layout/page-hero'

// Minimal
<PageHero title="All Tools" />

// Full
<PageHero
  label="Expert Reviews"
  title="All Reviews"
  subtitle="In-depth analysis of the tools that power modern businesses."
  breadcrumbs={[{ label: 'Reviews', href: '/reviews' }]}
  meta="142 tools reviewed"
>
  {/* optional: search bar, filter chips, CTA */}
</PageHero>
```

### ContentCard Usage

```tsx
import { ContentCard } from '@/components/ui/content-card'

// Tool card (default)
<ContentCard
  href={`/tools/${tool.slug.current}`}
  logo={urlForImageSafe(tool.logo, 40)}
  logoAlt={tool.name}
  label={tool.categories?.[0]?.name}
  title={tool.name}
  description={tool.tagline}
  badge={tool.rating}
  badgeVariant="rating"
  tags={tool.categories?.map(c => c.name)}
/>

// Blog article (default with image)
<ContentCard
  href={`/blog/${post.slug.current}`}
  image={urlForImageSafe(post.mainImage, 800)}
  imageAlt={post.title}
  label={post.articleType}
  title={post.title}
  description={post.excerpt}
  meta={`By ${post.author?.name} · ${formattedDate}`}
/>

// Featured article (first post on blog page)
<ContentCard
  variant="featured"
  href={`/blog/${post.slug.current}`}
  image={urlForImageSafe(post.mainImage, 1200)}
  title={post.title}
  description={post.excerpt}
  label="Featured"
  meta={formattedDate}
/>

// Horizontal (compact review or tool list item)
<ContentCard
  variant="horizontal"
  href={`/reviews/${review.slug.current}`}
  logo={urlForImageSafe(review.tool?.logo, 48)}
  logoAlt={review.tool?.name ?? ''}
  title={review.title}
  description={review.tool?.tagline}
  badge={review.rating}
  badgeVariant="rating"
  meta={formattedDate}
/>
```

### Card Grids

Wrap card grids in `StaggerChildren` for staggered scroll reveals:

```tsx
import { StaggerChildren } from '@/components/animations/stagger-children'

<StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
  {items.map(item => (
    <ContentCard key={item._id} {...props} className="bg-background" />
  ))}
</StaggerChildren>
```

Use `gap-px bg-border` for a flush grid-line aesthetic instead of gapped cards on light backgrounds.

### Labels and Tags

- Labels: `text-[10px] font-semibold tracking-[0.25em] uppercase text-primary`
- Tags (chips): `text-[10px] font-medium tracking-[0.12em] uppercase border border-border px-2 py-0.5`
- Never use coloured background pills (no `bg-green-100 text-green-800` etc.)

### Sharp Corners

`--radius: 0.25rem` in globals.css. Avoid `rounded-lg`, `rounded-xl`. Use `rounded-none` or nothing. Small `rounded-sm` is acceptable for avatars only.

### Sanity Images

Always use `urlForImageSafe()` from `@/lib/sanity.image` — never hardcode Sanity CDN URLs.

```tsx
import { urlForImageSafe } from '@/lib/sanity.image'

const src = urlForImageSafe(tool.logo, 400)  // returns '' if null
```

Handle the empty string case (`src && <img src={src} />`).

### Animation Defaults

```tsx
const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]
```

Use this ease for all Framer Motion transitions. Duration: 0.6–0.9s for reveals, 1.2s for large hero elements.

### New Page Checklist

Before marking a page complete:
- [ ] Uses `PageHero` for the header (not a custom `border-b` div)
- [ ] All headings use `var(--font-display)`
- [ ] No `rounded-lg` on content cards
- [ ] No orange/amber/warm-gold colours
- [ ] Card grids wrapped in `StaggerChildren`
- [ ] Dark sections use `#07080c`, not `bg-gray-900` or arbitrary hex
- [ ] Sanity images go through `urlForImageSafe()`
