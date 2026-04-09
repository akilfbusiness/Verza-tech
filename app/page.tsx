import Link from 'next/link'
import { getAllTools, getAllCategories } from '@/lib/sanity.queries'
import { isSanityConfigured } from '@/lib/sanity.config'
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateItemListSchema,
  renderJsonLd,
} from '@/lib/schema'

export const revalidate = 3600 // Revalidate every hour

export default async function HomePage() {
  if (!isSanityConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Verza
            </h1>
            <p className="text-xl text-muted-foreground">
              SaaS & AI Tool Reviews and Comparisons
            </p>
          </div>
          <div className="bg-card border rounded-xl p-8 shadow-lg text-left">
            <h2 className="font-semibold text-lg mb-3">Sanity CMS Setup Required</h2>
            <p className="text-sm text-muted-foreground mb-6">
              To start using Verza, configure your Sanity environment variables.
            </p>
            <ol className="text-sm space-y-3 list-decimal list-inside mb-6">
              <li>Create a Sanity project at sanity.io</li>
              <li>Copy your Project ID and Dataset name</li>
              <li>Add them to your environment variables</li>
              <li>Access Sanity Studio at /studio to add content</li>
            </ol>
            <Link
              href="/studio"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all"
            >
              Go to Studio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const [tools, categories] = await Promise.all([
    getAllTools(),
    getAllCategories(),
  ])

  const featuredTools = tools.slice(0, 6)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Gradient */}
      <section className="relative border-b overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
        <div className="container relative mx-auto px-4 py-32 max-w-6xl">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold tracking-tight mb-6">
              <span className="block text-balance">Discover the Best</span>
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                SaaS & AI Tools
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 text-pretty leading-relaxed">
              In-depth reviews, pricing comparisons, and expert recommendations to help you choose the right software for your needs.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/tools"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-base font-medium text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:scale-105 transition-all"
              >
                Browse All Tools
              </Link>
              <Link
                href="/reviews"
                className="inline-flex items-center justify-center rounded-lg border-2 border-primary/20 bg-background px-8 py-4 text-base font-medium hover:border-primary hover:bg-accent/10 transition-all"
              >
                Read Reviews
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">{tools.length}+</div>
              <div className="text-sm text-muted-foreground">Tools Reviewed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">{categories.length}+</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">Expert</div>
              <div className="text-sm text-muted-foreground">Reviews</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">AU Based</div>
              <div className="text-sm text-muted-foreground">Global Reach</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="border-b">
          <div className="container mx-auto px-4 py-20 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Browse by Category</h2>
              <p className="text-lg text-muted-foreground">Find the perfect tools for your needs</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/category/${category.slug.current}`}
                  className="group p-6 border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 hover:shadow-lg transition-all"
                >
                  {category.icon && (
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{category.icon}</div>
                  )}
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Tools Section */}
      {featuredTools.length > 0 && (
        <section className="border-b bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 py-20 max-w-6xl">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold mb-2">Featured Tools</h2>
                <p className="text-muted-foreground">Handpicked tools we recommend</p>
              </div>
              <Link
                href="/tools"
                className="text-sm font-medium text-primary hover:underline hidden md:block"
              >
                View all tools →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTools.map((tool) => (
                <Link
                  key={tool._id}
                  href={`/tools/${tool.slug.current}`}
                  className="group border-2 border-border rounded-xl p-6 hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all bg-card"
                >
                  <div className="flex items-start gap-4 mb-4">
                    {tool.logo && (
                      <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1 truncate group-hover:text-primary transition-colors">{tool.name}</h3>
                      {tool.tagline && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {tool.tagline}
                        </p>
                      )}
                    </div>
                  </div>
                  {tool.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {tool.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm">
                    {tool.rating && (
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-primary">{tool.rating}</span>
                        <span className="text-muted-foreground">/5</span>
                      </div>
                    )}
                    {tool.pricing && tool.pricing.length > 0 && (
                      <div className="text-muted-foreground">
                        {tool.freePlanAvailable ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-md text-xs font-medium">
                            Free plan
                          </span>
                        ) : (
                          tool.pricing[0].price || 'Paid'
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8 md:hidden">
              <Link
                href="/tools"
                className="inline-flex items-center justify-center rounded-lg border-2 border-primary/20 bg-background px-6 py-3 text-sm font-medium hover:border-primary hover:bg-accent/10 transition-all"
              >
                View all tools →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section>
        <div className="container mx-auto px-4 py-20 max-w-6xl">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary to-accent rounded-2xl p-12 text-center text-white shadow-2xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
            <div className="relative">
              <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto opacity-95">
                Get the latest tool reviews, comparisons, and recommendations delivered to your inbox.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-lg bg-white text-primary px-8 py-4 text-base font-medium hover:bg-white/90 hover:shadow-xl transition-all"
              >
                Learn More About Verza
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
