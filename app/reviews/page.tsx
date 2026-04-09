import { Metadata } from 'next'
import Link from 'next/link'
import { getAllReviews } from '@/lib/sanity.queries'

export const metadata: Metadata = {
  title: 'Tool Reviews',
  description: 'Expert reviews of SaaS and AI tools. Get in-depth analysis, ratings, and recommendations from our team.',
}

export const revalidate = 60 // Revalidate every minute

export default async function ReviewsPage() {
  const reviews = await getAllReviews()

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <h1 className="text-4xl font-bold mb-4">Expert Reviews</h1>
          <p className="text-lg text-muted-foreground">
            In-depth analysis and expert opinions on the best SaaS and AI tools
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No reviews found</p>
            <p className="text-sm text-muted-foreground">
              Add your first review in Sanity Studio at /studio
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <Link
                key={review._id}
                href={`/reviews/${review.slug.current}`}
                className="border rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-4 mb-4">
                  {review.tool?.logo && (
                    <div className="w-12 h-12 bg-muted rounded-lg flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      {review.title}
                    </h3>
                    {review.tool && (
                      <p className="text-sm text-muted-foreground">
                        Review of {review.tool.name}
                      </p>
                    )}
                  </div>
                  {review.rating && (
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-bold">{review.rating}</div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {review.author && (
                    <div className="flex items-center gap-2">
                      {review.author.image && (
                        <div className="w-6 h-6 bg-muted rounded-full flex-shrink-0" />
                      )}
                      <span>{review.author.name}</span>
                    </div>
                  )}
                  {review.publishedAt && (
                    <span>
                      {new Date(review.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
