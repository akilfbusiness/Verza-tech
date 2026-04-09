import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getToolBySlug, getAllToolSlugs, getFAQsByTool } from '@/lib/sanity.queries'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllToolSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = await getToolBySlug(slug)

  if (!tool) {
    return {
      title: 'Tool Not Found',
    }
  }

  return {
    title: `${tool.name} Review 2026 - Features, Pricing & Alternatives`,
    description: tool.description || tool.tagline || `Comprehensive review of ${tool.name}. Learn about features, pricing, pros and cons, and find the best alternatives.`,
    keywords: [
      tool.name,
      `${tool.name} review`,
      `${tool.name} pricing`,
      `${tool.name} alternatives`,
      ...(tool.categories?.map(c => c.name) || []),
    ],
    openGraph: {
      title: `${tool.name} Review 2026`,
      description: tool.tagline || tool.description,
      type: 'article',
      publishedTime: tool.publishedAt,
      modifiedTime: tool.updatedAt,
    },
  }
}

export const revalidate = 3600

export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const [tool, faqs] = await Promise.all([
    getToolBySlug(slug),
    getToolBySlug(slug).then(t => t ? getFAQsByTool(t._id) : []),
  ])

  if (!tool) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="flex items-start gap-6">
            {tool.logo && (
              <div className="w-20 h-20 bg-background border rounded-xl flex-shrink-0" />
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{tool.name}</h1>
                  {tool.tagline && (
                    <p className="text-xl text-muted-foreground">{tool.tagline}</p>
                  )}
                </div>
                {tool.rating && (
                  <div className="text-right">
                    <div className="text-3xl font-bold">{tool.rating}</div>
                    <div className="text-sm text-muted-foreground">
                      {tool.reviewCount ? `${tool.reviewCount} reviews` : 'Rating'}
                    </div>
                  </div>
                )}
              </div>

              {tool.categories && tool.categories.length > 0 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                  {tool.categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/category/${category.slug.current}`}
                      className="text-sm bg-background border px-3 py-1 rounded-full hover:border-primary transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                {tool.website && (
                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Visit Website
                  </a>
                )}
                {tool.affiliateLink && (
                  <a
                    href={tool.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Get Started
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-12">
          {/* Description */}
          {tool.description && (
            <section>
              <h2 className="text-2xl font-bold mb-4">About {tool.name}</h2>
              <p className="text-muted-foreground leading-relaxed">{tool.description}</p>
            </section>
          )}

          {/* Quick Facts */}
          <section className="border rounded-lg p-6 bg-muted/30">
            <h3 className="font-semibold mb-4">Quick Facts</h3>
            <dl className="grid grid-cols-2 gap-4">
              {tool.freePlanAvailable !== undefined && (
                <>
                  <dt className="text-sm text-muted-foreground">Free Plan</dt>
                  <dd className="text-sm font-medium">{tool.freePlanAvailable ? 'Yes' : 'No'}</dd>
                </>
              )}
              {tool.freeTrialAvailable !== undefined && (
                <>
                  <dt className="text-sm text-muted-foreground">Free Trial</dt>
                  <dd className="text-sm font-medium">{tool.freeTrialAvailable ? 'Yes' : 'No'}</dd>
                </>
              )}
              {tool.status && (
                <>
                  <dt className="text-sm text-muted-foreground">Status</dt>
                  <dd className="text-sm font-medium capitalize">{tool.status}</dd>
                </>
              )}
            </dl>
          </section>

          {/* Features */}
          {tool.features && tool.features.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Key Features</h2>
              <ul className="grid md:grid-cols-2 gap-3">
                {tool.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Pricing */}
          {tool.pricing && tool.pricing.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Pricing</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {tool.pricing.map((tier, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <h3 className="font-semibold mb-2">{tier.name}</h3>
                    {tier.price && (
                      <div className="text-2xl font-bold mb-4">
                        {tier.price}
                        {tier.billingPeriod && (
                          <span className="text-sm font-normal text-muted-foreground">
                            /{tier.billingPeriod}
                          </span>
                        )}
                      </div>
                    )}
                    {tier.features && tier.features.length > 0 && (
                      <ul className="space-y-2">
                        {tier.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-start gap-2 text-sm">
                            <span className="text-primary mt-0.5">✓</span>
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Pros and Cons */}
          {((tool.pros && tool.pros.length > 0) || (tool.cons && tool.cons.length > 0)) && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Pros & Cons</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {tool.pros && tool.pros.length > 0 && (
                  <div className="border rounded-lg p-6">
                    <h3 className="font-semibold mb-4 text-green-600">Pros</h3>
                    <ul className="space-y-2">
                      {tool.pros.map((pro, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-green-600 mt-0.5">+</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tool.cons && tool.cons.length > 0 && (
                  <div className="border rounded-lg p-6">
                    <h3 className="font-semibold mb-4 text-red-600">Cons</h3>
                    <ul className="space-y-2">
                      {tool.cons.map((con, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-red-600 mt-0.5">-</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Best For */}
          {tool.bestFor && tool.bestFor.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Best For</h2>
              <ul className="space-y-2">
                {tool.bestFor.map((use, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">→</span>
                    <span className="text-muted-foreground">{use}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* FAQs */}
          {faqs.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq._id} className="border rounded-lg p-6">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <div className="text-sm text-muted-foreground">
                      {/* Portable text would go here */}
                      {typeof faq.answer === 'string' ? faq.answer : 'Answer content'}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Alternatives */}
          {tool.alternatives && tool.alternatives.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Alternatives to {tool.name}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {tool.alternatives.map((alt) => (
                  <Link
                    key={alt._id}
                    href={`/tools/${alt.slug.current}`}
                    className="border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all flex items-center gap-4"
                  >
                    {alt.logo && (
                      <div className="w-12 h-12 bg-muted rounded-lg flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{alt.name}</h3>
                      {alt.tagline && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {alt.tagline}
                        </p>
                      )}
                      {alt.rating && (
                        <div className="text-sm mt-1">
                          <span className="font-medium">{alt.rating}</span>
                          <span className="text-muted-foreground">/5</span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
