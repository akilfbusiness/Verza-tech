import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getReviewBySlug, getAllReviewSlugs } from '@/lib/sanity.queries'
import { Breadcrumb } from '@/components/breadcrumb'
import {
  generateReviewSchema,
  generateArticleSchema,
  generateBreadcrumbSchema,
  renderJsonLd,
} from '@/lib/schema'
import { Verdict } from '@/components/aeo/verdict'
import { UpdatedBadge } from '@/components/aeo/updated-badge'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllReviewSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const review = await getReviewBySlug(slug)

  if (!review) {
    return {
      title: 'Review Not Found',
    }
  }

  const toolName = review.tool?.name || 'Tool'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.com'
  const ogImageUrl = new URL('/api/og', siteUrl)
  ogImageUrl.searchParams.set('title', review.title)
  ogImageUrl.searchParams.set('subtitle', `Review by ${review.author?.name || 'Verza'}`)
  if (review.rating) {
    ogImageUrl.searchParams.set('rating', review.rating.toString())
  }

  const metaDescription = review.verdict || `Expert review of ${toolName}. Read our in-depth analysis, ratings, pros and cons.`

  return {
    title: `${review.title} | ${toolName} Review 2026 | Verza`,
    description: metaDescription,
    keywords: [
      toolName,
      `${toolName} review`,
      `${toolName} review 2026`,
      'tool review',
      'expert analysis',
      'software review',
    ],
    alternates: {
      canonical: `${siteUrl}/reviews/${slug}`,
    },
    authors: review.author ? [{ name: review.author.name }] : undefined,
    openGraph: {
      title: review.title,
      description: metaDescription,
      type: 'article',
      url: `${siteUrl}/reviews/${slug}`,
      publishedTime: review.publishedAt,
      modifiedTime: review.updatedAt,
      authors: review.author ? [review.author.name] : undefined,
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: review.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: review.title,
      description: metaDescription,
      images: [ogImageUrl.toString()],
    },
  }
}

export const revalidate = 3600

export default async function ReviewPage({ params }: Props) {
  const { slug } = await params
  const review = await getReviewBySlug(slug)

  if (!review) {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.com'

  // Generate schema markup
  const reviewSchema = generateReviewSchema(review)
  const articleSchema = generateArticleSchema(review)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteUrl },
    { name: 'Reviews', url: `${siteUrl}/reviews` },
    { name: review.title, url: `${siteUrl}/reviews/${review.slug.current}` },
  ])

  return (
    <>
      {/* JSON-LD Structured Data */}
      {renderJsonLd(reviewSchema)}
      {renderJsonLd(articleSchema)}
      {renderJsonLd(breadcrumbSchema)}

      <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Breadcrumb
            items={[
              { label: 'Reviews', href: '/reviews' },
              { label: review.title },
            ]}
          />
          <div className="flex items-start gap-6 mb-6">
            {review.tool?.logo && (
              <div className="w-16 h-16 bg-background border rounded-xl flex-shrink-0" />
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2 text-balance">{review.title}</h1>
              {review.tool && (
                <Link
                  href={`/tools/${review.tool.slug.current}`}
                  className="text-lg text-primary hover:underline"
                >
                  Review of {review.tool.name}
                </Link>
              )}
            </div>
            {review.rating && (
              <div className="text-center">
                <div className="text-4xl font-bold">{review.rating}</div>
                <div className="text-sm text-muted-foreground">out of 5</div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm">
            {review.author && (
              <div className="flex items-center gap-2">
                {review.author.image && (
                  <div className="w-8 h-8 bg-muted rounded-full flex-shrink-0" />
                )}
                <div>
                  <div className="font-medium text-foreground">{review.author.name}</div>
                  {review.author.expertise && review.author.expertise.length > 0 && (
                    <div className="text-xs text-muted-foreground">{review.author.expertise[0]}</div>
                  )}
                </div>
              </div>
            )}
            <UpdatedBadge
              publishedAt={review.publishedAt}
              updatedAt={review.updatedAt}
              format="long"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="space-y-12">
          {/* Review Content */}
          <section>
            <div className="prose prose-lg max-w-none">
              {/* Portable text would render here */}
              <p className="text-muted-foreground">Review content from Sanity CMS will appear here.</p>
            </div>
          </section>

          {/* Pros and Cons */}
          {((review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0)) && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Pros & Cons</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {review.pros && review.pros.length > 0 && (
                  <div className="border rounded-lg p-6">
                    <h3 className="font-semibold mb-4 text-green-600 flex items-center gap-2">
                      <span className="text-xl">+</span>
                      Pros
                    </h3>
                    <ul className="space-y-3">
                      {review.pros.map((pro, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {review.cons && review.cons.length > 0 && (
                  <div className="border rounded-lg p-6">
                    <h3 className="font-semibold mb-4 text-red-600 flex items-center gap-2">
                      <span className="text-xl">-</span>
                      Cons
                    </h3>
                    <ul className="space-y-3">
                      {review.cons.map((con, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">×</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Verdict - AI-Optimized */}
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

          {/* Tool Info */}
          {review.tool && (
            <section className="border rounded-lg p-6 bg-muted/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">About {review.tool.name}</h3>
                <Link
                  href={`/tools/${review.tool.slug.current}`}
                  className="text-sm text-primary hover:underline"
                >
                  View full profile →
                </Link>
              </div>
              {review.tool.description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {review.tool.description}
                </p>
              )}
              <div className="flex gap-3">
                {review.tool.website && (
                  <a
                    href={review.tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                  >
                    Visit Website
                  </a>
                )}
                {review.tool.affiliateLink && (
                  <a
                    href={review.tool.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
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
