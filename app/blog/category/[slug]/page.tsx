import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPostsByCategory, getCategoryBySlug, getAllCategories, getAllCategorySlugs } from '@/lib/sanity.queries'
import { urlForImageSafe } from '@/lib/sanity.image'
import { generateBreadcrumbSchema, renderJsonLd } from '@/lib/schema'
import { PageHero } from '@/components/layout/page-hero'
import { ContentCard } from '@/components/ui/content-card'
import { StaggerChildren } from '@/components/animations/stagger-children'

export const revalidate = 60
export const dynamicParams = true

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return {}
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.tech'
  const title = `${category.name} Articles | Verza`
  const description = category.description || `Browse all ${category.name} articles, reviews, and guides on Verza.`
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: `${siteUrl}/api/og?title=${encodeURIComponent(category.name)}&type=category`, width: 1200, height: 630 }],
    },
    alternates: { canonical: `${siteUrl}/blog/category/${slug}` },
  }
}

const ARTICLE_TYPE_LABELS: Record<string, string> = {
  review: 'Review',
  comparison: 'Comparison',
  'best-of': 'Best Of',
  tutorial: 'Tutorial',
  news: 'News',
  opinion: 'Opinion',
}

export default async function BlogCategoryPage({ params }: Props) {
  const { slug } = await params
  const [category, posts, allCategories] = await Promise.all([
    getCategoryBySlug(slug),
    getBlogPostsByCategory(slug),
    getAllCategories(),
  ])

  if (!category) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.tech'
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteUrl },
    { name: 'Blog', url: `${siteUrl}/blog` },
    { name: category.name },
  ])
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.name} Articles`,
    numberOfItems: posts.length,
    itemListElement: posts.map((post: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${siteUrl}/blog/${post.slug.current}`,
      name: post.title,
    })),
  }

  const categoryFilters = (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/blog"
        className="text-[10px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5 border border-white/20 text-white/50 hover:border-white/50 hover:text-white/80 transition-colors"
      >
        All
      </Link>
      {allCategories.map((cat: any) => (
        <Link
          key={cat._id}
          href={`/blog/category/${cat.slug.current}`}
          className={`text-[10px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5 border transition-colors ${
            cat.slug.current === slug
              ? 'border-white/60 text-white/90'
              : 'border-white/20 text-white/50 hover:border-white/50 hover:text-white/80'
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  )

  return (
    <>
      {renderJsonLd(breadcrumbSchema)}
      {renderJsonLd(itemListSchema)}

      <PageHero
        label="Blog"
        title={category.name}
        subtitle={category.description}
        breadcrumbs={[
          { label: 'Blog', href: '/blog' },
          { label: category.name, href: `/blog/category/${slug}` },
        ]}
        meta={`${posts.length} ${posts.length === 1 ? 'article' : 'articles'}`}
      >
        {categoryFilters}
      </PageHero>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
          {posts.length === 0 ? (
            <div className="text-center py-12 border border-border">
              <p className="text-muted-foreground mb-2">No articles in this category yet</p>
              <Link href="/blog" className="text-sm text-primary hover:underline">
                View all articles →
              </Link>
            </div>
          ) : (
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
              {posts.map((post: any) => (
                <ContentCard
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  image={urlForImageSafe(post.heroImage) ?? undefined}
                  imageAlt={post.title}
                  label={post.articleType ? ARTICLE_TYPE_LABELS[post.articleType] : undefined}
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
        </div>
      </section>
    </>
  )
}
