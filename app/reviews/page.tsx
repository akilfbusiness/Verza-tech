import { Metadata } from 'next'
import { getAllReviews } from '@/lib/sanity.queries'
import { PageHero } from '@/components/layout/page-hero'
import { ContentCard } from '@/components/ui/content-card'
import { StaggerChildren } from '@/components/animations/stagger-children'
import { urlForImageSafe } from '@/lib/sanity.image'

export const metadata: Metadata = {
  title: 'Expert Reviews | Verza',
  description: 'Expert reviews of SaaS and AI tools. Get in-depth analysis, ratings, and recommendations from our team.',
}

export const revalidate = 60

export default async function ReviewsPage() {
  const reviews = await getAllReviews()

  return (
    <>
      <PageHero
        label="Expert Reviews"
        title="All Reviews"
        subtitle="In-depth analysis of the tools that power modern businesses."
        breadcrumbs={[{ label: 'Reviews', href: '/reviews' }]}
        meta={`${reviews.length} reviews published`}
      />

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
          {reviews.length === 0 ? (
            <div className="text-center py-12 border border-border">
              <p className="text-muted-foreground mb-2">No reviews found</p>
              <p className="text-sm text-muted-foreground">Add your first review in Sanity Studio at /studio</p>
            </div>
          ) : (
            <StaggerChildren className="flex flex-col gap-px bg-border">
              {reviews.map((review) => {
                const formattedDate = review.publishedAt
                  ? new Date(review.publishedAt).toLocaleDateString('en-AU', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })
                  : undefined
                return (
                  <ContentCard
                    key={review._id}
                    variant="horizontal"
                    href={`/reviews/${review.slug.current}`}
                    logo={urlForImageSafe(review.tool?.logo) ?? undefined}
                    logoAlt={review.tool?.name ?? ''}
                    title={review.title}
                    description={review.tool?.tagline}
                    badge={review.rating}
                    badgeVariant="rating"
                    meta={[review.author?.name, formattedDate].filter(Boolean).join(' · ')}
                    className="bg-background"
                  />
                )
              })}
            </StaggerChildren>
          )}
        </div>
      </section>
    </>
  )
}
