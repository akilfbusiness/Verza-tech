import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getReviewBySlug, getAllReviewSlugs } from '@/lib/sanity.queries'
import { urlForImageSafe } from '@/lib/sanity.image'
import {
  generateReviewSchema,
  generateArticleSchema,
  generateBreadcrumbSchema,
  renderJsonLd,
} from '@/lib/schema'
import { PageHero } from '@/components/layout/page-hero'
import { Verdict } from '@/components/aeo/verdict'
import { UpdatedBadge } from '@/components/aeo/updated-badge'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllReviewSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const review = await getReviewBySlug(slug)

  if (!review) return { title: 'Review Not Found' }

  const toolName = review.tool?.name || 'Tool'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.com'
  const ogImageUrl = new URL('/api/og', siteUrl)
  ogImageUrl.searchParams.set('title', review.title)
  ogImageUrl.searchParams.set('subtitle', `Review by ${review.author?.name || 'Verza'}`)
  if (review.rating) ogImageUrl.searchParams.set('rating', review.rating.toString())

  const metaDescription = review.verdict || `Expert review of ${toolName}. Read our in-depth analysis, ratings, pros and cons.`

  return {
    title: `${review.title} | ${toolName} Review 2026 | Verza`,
    description: metaDescription,
    keywords: [toolName, `${toolName} review`, `${toolName} review 2026`, 'tool review', 'expert analysis', 'software review'],
    alternates: { canonical: `${siteUrl}/reviews/${slug}` },
    authors: review.author ? [{ name: review.author.name }] : undefined,
    openGraph: {
      title: review.title,
      description: metaDescription,
      type: 'article',
      url: `${siteUrl}/reviews/${slug}`,
      publishedTime: review.publishedAt,
      modifiedTime: review.updatedAt,
      authors: review.author ? [review.author.name] : undefined,
      images: [{ url: ogImageUrl.toString(), width: 1200, height: 630, alt: review.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: review.title,
      description: metaDescription,
      images: [ogImageUrl.toString()],
    },
  }
}

export const revalidate = 60
export const dynamic = 'force-static'
export const dynamicParams = true
export const fetchCache = 'default-cache'

export default async function ReviewPage({ params }: Props) {
  const { slug } = await params
  const review = await getReviewBySlug(slug)

  if (!review) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.com'

  const reviewSchema = generateReviewSchema(review)
  const articleSchema = generateArticleSchema(review)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteUrl },
    { name: 'Reviews', url: `${siteUrl}/reviews` },
    { name: review.title, url: `${siteUrl}/reviews/${review.slug.current}` },
  ])

  const logoSrc = urlForImageSafe(review.tool?.logo)
  const authorImageSrc = urlForImageSafe(review.author?.image)

  const formattedDate = review.publishedAt
    ? new Date(review.publishedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
    : undefined

  return (
    <>
      {renderJsonLd(reviewSchema)}
      {renderJsonLd(articleSchema)}
      {renderJsonLd(breadcrumbSchema)}

      <PageHero
        label="Expert Review"
        title={review.title}
        breadcrumbs={[
          { label: 'Reviews', href: '/reviews' },
          { label: review.title },
        ]}
      >
        {/* Author + tool + rating row */}
        <div className="flex flex-wrap items-center gap-6">
          {/* Author */}
          {review.author && (
            <div className="flex items-center gap-3">
              {authorImageSrc && (
                <div className="w-8 h-8 overflow-hidden bg-white/10 flex-shrink-0 border border-white/15">
                  <Image src={authorImageSrc} alt={review.author.name} width={32} height={32} className="object-cover w-full h-full" />
                </div>
              )}
              <div>
                <p className="text-[11px] font-semibold text-white/80">{review.author.name}</p>
                {review.author.expertise && review.author.expertise.length > 0 && (
                  <p className="text-[10px] text-white/40">{review.author.expertise[0]}</p>
                )}
              </div>
            </div>
          )}

          {/* Reviewed tool */}
          {review.tool && (
            <Link
              href={`/tools/${review.tool.slug.current}`}
              className="flex items-center gap-2 text-[10px] font-medium tracking-[0.15em] uppercase text-white/40 hover:text-white/60 transition-colors border border-white/15 px-3 py-1.5 hover:border-white/25"
            >
              {logoSrc && (
                <Image src={logoSrc} alt={review.tool.name ?? ''} width={16} height={16} className="w-4 h-4 object-contain opacity-60" />
              )}
              View {review.tool.name}
            </Link>
          )}

          {/* Date */}
          {formattedDate && <p className="text-[10px] tracking-[0.15em] uppercase text-white/30">{formattedDate}</p>}

          {/* Rating */}
          {review.rating && (
            <div className="ml-auto flex items-baseline gap-1.5">
              <span
                className="font-semibold tabular-nums leading-none"
                style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '2.4rem', color: 'oklch(0.72 0.1 255)' }}
              >
                {review.rating}
              </span>
              <span className="text-[10px] tracking-widest uppercase text-white/25">/10</span>
            </div>
          )}
        </div>
      </PageHero>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="bg-background">
        <div className="container mx-auto px-6 max-w-4xl py-16">
          <article className="space-y-12">
            {/* Review Content placeholder */}
            <section>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground">Review content from Sanity CMS will appear here.</p>
              </div>
            </section>

            {/* Pros & Cons */}
            {((review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0)) && (
              <section>
                <h2
                  className="font-light mb-6"
                  style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '1.8rem', letterSpacing: '-0.01em' }}
                >
                  Pros &amp; Cons
                </h2>
                <div className="grid md:grid-cols-2 gap-px bg-border">
                  {review.pros && review.pros.length > 0 && (
                    <div className="bg-background p-6">
                      <h3
                        className="font-medium text-primary mb-4"
                        style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '1.05rem' }}
                      >
                        Pros
                      </h3>
                      <ul className="space-y-3">
                        {review.pros.map((pro, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="text-primary mt-0.5 shrink-0">+</span>
                            <span className="text-sm text-muted-foreground">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {review.cons && review.cons.length > 0 && (
                    <div className="bg-background p-6">
                      <h3
                        className="font-medium text-muted-foreground mb-4"
                        style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '1.05rem' }}
                      >
                        Cons
                      </h3>
                      <ul className="space-y-3">
                        {review.cons.map((con, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="text-muted-foreground mt-0.5 shrink-0">−</span>
                            <span className="text-sm text-muted-foreground">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Verdict */}
            {review.verdict && (
              <Verdict
                title="Final Verdict"
                verdict={review.verdict}
                rating={review.rating}
                recommendation={
                  review.rating && review.rating >= 4.5 ? 'highly-recommended' :
                  review.rating && review.rating >= 3.5 ? 'recommended' :
                  review.rating && review.rating >= 2.5 ? 'conditional' :
                  'not-recommended'
                }
              />
            )}

            {/* Updated Badge */}
            <UpdatedBadge
              publishedAt={review.publishedAt}
              updatedAt={review.updatedAt}
              format="long"
            />

            {/* Tool Info */}
            {review.tool && (
              <section className="border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className="font-medium"
                    style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '1.1rem' }}
                  >
                    About {review.tool.name}
                  </h3>
                  <Link
                    href={`/tools/${review.tool.slug.current}`}
                    className="text-xs font-semibold tracking-[0.15em] uppercase text-primary hover:text-primary/70 transition-colors"
                  >
                    View full profile →
                  </Link>
                </div>
                {review.tool.description && (
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{review.tool.description}</p>
                )}
                <div className="flex gap-3">
                  {review.tool.website && (
                    <a
                      href={review.tool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-border px-4 py-2 text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
                    >
                      Visit Website
                    </a>
                  )}
                  {review.tool.affiliateLink && (
                    <a
                      href={review.tool.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary px-4 py-2 text-[11px] font-semibold tracking-[0.15em] uppercase text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Try {review.tool.name}
                    </a>
                  )}
                </div>
              </section>
            )}
          </article>
        </div>
      </div>
    </>
  )
}
