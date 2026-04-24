import { Metadata } from 'next'
import Link from 'next/link'
import { getAllBlogPosts, getAllCategories } from '@/lib/sanity.queries'
import { urlForImageSafe } from '@/lib/sanity.image'
import { generateItemListSchema, renderJsonLd } from '@/lib/schema'
import { PageHero } from '@/components/layout/page-hero'
import { ContentCard } from '@/components/ui/content-card'
import { StaggerChildren } from '@/components/animations/stagger-children'

export const metadata: Metadata = {
  title: 'Blog - SaaS & AI Tool Reviews, Comparisons & Guides | Verza',
  description: 'In-depth SaaS and AI tool reviews, comparisons, and guides to help you choose the right software for your business.',
}

export const revalidate = 60

const ARTICLE_TYPE_LABELS: Record<string, string> = {
  review: 'Review',
  comparison: 'Comparison',
  'best-of': 'Best Of',
  tutorial: 'Tutorial',
  news: 'News',
  opinion: 'Opinion',
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getAllBlogPosts(),
    getAllCategories(),
  ])

  const featured = posts[0]
  const rest = posts.slice(1)

  const categoryFilters = (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/blog"
        className="text-[10px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5 border border-white/40 text-white/80 hover:border-white hover:text-white transition-colors"
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat._id}
          href={`/blog/category/${cat.slug.current}`}
          className="text-[10px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5 border border-white/20 text-white/50 hover:border-white/50 hover:text-white/80 transition-colors"
        >
          {cat.name}
        </Link>
      ))}
    </div>
  )

  return (
    <>
      <PageHero
        label="Blog"
        title="Articles & Guides"
        subtitle="In-depth reviews, comparisons, and guides for SaaS and AI tools."
        breadcrumbs={[{ label: 'Blog', href: '/blog' }]}
        meta={`${posts.length} articles published`}
      >
        {categories.length > 0 && categoryFilters}
      </PageHero>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
          {posts.length === 0 ? (
            <div className="text-center py-12 border border-border">
              <p className="text-muted-foreground mb-2">No articles yet</p>
              <p className="text-sm text-muted-foreground">
                Add your first blog post in Sanity Studio at /studio
              </p>
            </div>
          ) : (
            <>
              {featured && (
                <div className="mb-8">
                  <ContentCard
                    variant="featured"
                    href={`/blog/${featured.slug.current}`}
                    image={urlForImageSafe(featured.heroImage) ?? undefined}
                    imageAlt={featured.title}
                    label={featured.articleType ? ARTICLE_TYPE_LABELS[featured.articleType] : 'Featured'}
                    title={featured.title}
                    description={featured.summary}
                    meta={[
                      featured.author?.name,
                      featured.publishedAt
                        ? new Date(featured.publishedAt).toLocaleDateString('en-AU', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })
                        : undefined,
                    ].filter(Boolean).join(' · ')}
                  />
                </div>
              )}

              {rest.length > 0 && (
                <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
                  {rest.map((post) => (
                    <ContentCard
                      key={post._id}
                      href={`/blog/${post.slug.current}`}
                      image={urlForImageSafe(post.heroImage) ?? undefined}
                      imageAlt={post.title}
                      label={
                        post.articleType
                          ? ARTICLE_TYPE_LABELS[post.articleType]
                          : post.categories?.[0]?.name
                      }
                      title={post.title}
                      description={post.summary}
                      meta={[
                        post.author?.name,
                        post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString('en-AU', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })
                          : undefined,
                      ].filter(Boolean).join(' · ')}
                      className="bg-background"
                    />
                  ))}
                </StaggerChildren>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
