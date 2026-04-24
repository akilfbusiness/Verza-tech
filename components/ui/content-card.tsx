import Link from 'next/link'
import Image from 'next/image'

export type ContentCardVariant = 'default' | 'featured' | 'horizontal'
export type BadgeVariant = 'rating' | 'pill' | 'count'

export interface ContentCardProps {
  href: string
  variant?: ContentCardVariant

  /** Small uppercase category/type label */
  label?: string

  /** Title — rendered in Big Shoulders Display */
  title: string

  /** Body excerpt or tagline */
  description?: string

  /** Hero image URL (Sanity CDN or Unsplash) */
  image?: string
  imageAlt?: string

  /** Small logo/icon (tool cards) */
  logo?: string
  logoAlt?: string

  /** Bottom-right badge: rating score, type pill, or count */
  badge?: string | number
  badgeVariant?: BadgeVariant

  /** Author · date · read-time meta string */
  meta?: string

  /** Clickable category tag chips */
  tags?: string[]

  className?: string
}

function RatingBadge({ value }: { value: string | number }) {
  const num = typeof value === 'string' ? parseFloat(value) : value
  const good = num >= 7.5
  return (
    <div className="text-right shrink-0">
      <p
        className="tabular-nums font-semibold leading-none"
        style={{
          fontFamily: 'var(--font-display), sans-serif',
          fontSize: '1.6rem',
          color: good ? 'var(--primary)' : 'var(--muted-foreground)',
        }}
      >
        {value}
      </p>
      <p className="text-[10px] tracking-widest uppercase text-muted-foreground mt-0.5">/10</p>
    </div>
  )
}

function PillBadge({ value }: { value: string | number }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.15em] uppercase border border-primary/30 text-primary">
      {value}
    </span>
  )
}

function LogoBox({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-10 h-10 border border-border shrink-0 overflow-hidden bg-secondary flex items-center justify-center">
      <Image src={src} alt={alt} width={40} height={40} className="w-full h-full object-contain" />
    </div>
  )
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {tags.slice(0, 3).map((tag) => (
        <span
          key={tag}
          className="text-[10px] font-medium tracking-[0.12em] uppercase text-muted-foreground border border-border px-2 py-0.5"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

/* ─────────────────────────────── variants ─────────────────────────────── */

function DefaultCard({
  href, label, title, description, image, imageAlt,
  logo, logoAlt, badge, badgeVariant = 'pill', meta, tags, className,
}: ContentCardProps) {
  return (
    <Link
      href={href}
      className={`group flex flex-col border border-border hover:border-primary/40 transition-colors duration-300 bg-background ${className ?? ''}`}
    >
      {/* Image */}
      {image && (
        <div className="relative w-full aspect-video overflow-hidden border-b border-border">
          <Image
            src={image}
            alt={imageAlt ?? title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* Logo + label row */}
        <div className="flex items-center gap-3">
          {logo && logoAlt && <LogoBox src={logo} alt={logoAlt} />}
          {label && (
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary">
              {label}
            </span>
          )}
        </div>

        {/* Title + description */}
        <div className="flex-1">
          <h3
            className="font-medium leading-snug mb-2 group-hover:text-primary transition-colors duration-200"
            style={{
              fontFamily: 'var(--font-display), sans-serif',
              fontSize: '1.25rem',
              letterSpacing: '-0.005em',
            }}
          >
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {description}
            </p>
          )}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && <TagList tags={tags} />}

        {/* Footer row: meta + badge */}
        {(meta || badge !== undefined) && (
          <div className="flex items-end justify-between pt-3 border-t border-border mt-auto">
            {meta && <p className="text-xs text-muted-foreground">{meta}</p>}
            {badge !== undefined && badgeVariant === 'rating' && <RatingBadge value={badge} />}
            {badge !== undefined && badgeVariant === 'pill'   && <PillBadge value={badge} />}
            {badge !== undefined && badgeVariant === 'count'  && (
              <span className="text-xs font-semibold tabular-nums text-muted-foreground">{badge}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

function FeaturedCard({
  href, label, title, description, image, imageAlt,
  badge, badgeVariant = 'pill', meta, tags, className,
}: ContentCardProps) {
  return (
    <Link
      href={href}
      className={`group grid grid-cols-1 md:grid-cols-[1fr_420px] border border-border hover:border-primary/40 transition-colors duration-300 bg-background ${className ?? ''}`}
    >
      {/* Image */}
      {image ? (
        <div className="relative min-h-[260px] md:min-h-[340px] overflow-hidden border-b md:border-b-0 md:border-r border-border">
          <Image
            src={image}
            alt={imageAlt ?? title}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover transition-transform duration-600 group-hover:scale-[1.025]"
          />
        </div>
      ) : (
        <div className="min-h-[260px] md:min-h-[340px] border-b md:border-b-0 md:border-r border-border bg-secondary/40" />
      )}

      {/* Content */}
      <div className="flex flex-col justify-between p-8 md:p-10">
        <div>
          {label && (
            <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary mb-5">
              {label}
            </p>
          )}
          <h3
            className="font-light leading-tight mb-4 group-hover:text-primary transition-colors duration-200"
            style={{
              fontFamily: 'var(--font-display), sans-serif',
              fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
              {description}
            </p>
          )}
          {tags && tags.length > 0 && <TagList tags={tags} />}
        </div>

        <div className="flex items-end justify-between mt-8 pt-6 border-t border-border">
          {meta && <p className="text-xs text-muted-foreground">{meta}</p>}
          <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase text-primary/70 group-hover:text-primary transition-colors">
            Read more <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
          {badge !== undefined && badgeVariant === 'rating' && <RatingBadge value={badge} />}
          {badge !== undefined && badgeVariant === 'pill'   && <PillBadge value={badge} />}
        </div>
      </div>
    </Link>
  )
}

function HorizontalCard({
  href, label, title, description,
  logo, logoAlt, image, imageAlt,
  badge, badgeVariant = 'rating', meta, className,
}: ContentCardProps) {
  const thumb = logo ?? image
  const thumbAlt = logoAlt ?? imageAlt ?? title

  return (
    <Link
      href={href}
      className={`group flex items-start gap-4 border border-border hover:border-primary/40 transition-colors duration-300 bg-background p-5 ${className ?? ''}`}
    >
      {/* Thumb */}
      {thumb && (
        <div className="w-12 h-12 shrink-0 border border-border overflow-hidden bg-secondary flex items-center justify-center">
          <Image src={thumb} alt={thumbAlt} width={48} height={48} className="w-full h-full object-contain" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {label && (
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-primary mb-1">
            {label}
          </p>
        )}
        <h3
          className="font-medium leading-snug group-hover:text-primary transition-colors duration-200 truncate"
          style={{
            fontFamily: 'var(--font-display), sans-serif',
            fontSize: '1.05rem',
            letterSpacing: '-0.005em',
          }}
        >
          {title}
        </h3>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
        )}
        {meta && <p className="text-xs text-muted-foreground mt-2">{meta}</p>}
      </div>

      {/* Badge */}
      {badge !== undefined && (
        <div className="shrink-0 ml-2">
          {badgeVariant === 'rating' && <RatingBadge value={badge} />}
          {badgeVariant === 'pill'   && <PillBadge value={badge} />}
          {badgeVariant === 'count'  && (
            <span className="text-xs font-semibold tabular-nums text-muted-foreground">{badge}</span>
          )}
        </div>
      )}
    </Link>
  )
}

/* ─────────────────────────────── export ─────────────────────────────── */

export function ContentCard({ variant = 'default', ...props }: ContentCardProps) {
  if (variant === 'featured')   return <FeaturedCard   {...props} variant={variant} />
  if (variant === 'horizontal') return <HorizontalCard {...props} variant={variant} />
  return <DefaultCard {...props} variant={variant} />
}
