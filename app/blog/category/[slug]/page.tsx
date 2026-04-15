import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { CalendarDays, Clock } from 'lucide-react'
import { getBlogPostsByCategory, getCategoryBySlug, getAllCategories, getAllCategorySlugs } from '@/lib/sanity.queries'
import { urlForImageSafe } from '@/lib/sanity.image'
import { Breadcrumb } from '@/components/breadcrumb'
import { generateBreadcrumbSchema, renderJsonLd } from '@/lib/schema'

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

  return (
    <>
      {renderJsonLd(breadcrumbSchema)}
      {renderJsonLd(itemListSchema)}

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-secondary/30">
          <div className="container mx-auto px-4 py-10 max-w-6xl">
            <Breadcrumb items={[
              { label: 'Blog', href: '/blog' },
              { label: category.name, href: `/blog/category/${slug}` },
            ]} />

            <div className="mt-5">
              <h1 className="text-4xl font-bold mb-2 text-balance">{category.name}</h1>
              {category.description && (
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">{category.description}</p>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                {posts.length} {posts.length === 1 ? 'article' : 'articles'}
              </p>
            </div>

            {/* Category filter tabs */}
            <div className="flex gap-2 mt-6 flex-wrap">
              <Link
                href="/blog"
                className="px-4 py-1.5 rounded-full text-sm font-medium border hover:border-primary hover:text-primary transition-colors"
              >
                All
              </Link>
              {allCategories.map((cat: any) => (
                <Link
                  key={cat._id}
                  href={`/blog/category/${cat.slug.current}`}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    cat.slug.current === slug
                      ? 'bg-primary text-primary-foreground'
                      : 'border hover:border-primary hover:text-primary'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 max-w-6xl">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl font-semibold mb-2">No articles in this category yet</p>
              <p className="text-muted-foreground">Check back soon or browse all articles.</p>
              <Link href="/blog" className="mt-4 inline-block text-primary underline text-sm">
                View all articles
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: any) => (
                <article
                  key={post._id}
                  className="group border rounded-xl overflow-hidden hover:border-primary hover:shadow-md transition-all flex flex-col"
                >
                  {/* Thumbnail */}
                  <Link href={`/blog/${post.slug.current}`} className="block relative h-48 bg-secondary flex-shrink-0 overflow-hidden">
                    {urlForImageSafe(post.heroImage) ? (
                      <Image
                        src={urlForImageSafe(post.heroImage)!}
                        alt={post.heroImage?.alt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary/20">V</span>
                      </div>
                    )}
                    {post.articleType && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-background/90 backdrop-blur-sm">
                          {ARTICLE_TYPE_LABELS[post.articleType]}
                        </span>
                      </div>
                    )}
                  </Link>

                  <div className="p-5 flex flex-col flex-1">
                    <Link href={`/blog/${post.slug.current}`}>
                      <h2 className="font-bold mb-2 text-balance leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>

                    {post.summary && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-3 flex-1 leading-relaxed">
                        {post.summary}
                      </p>
                    )}

                    {post.verdictBox?.summary && (
                      <p className="text-xs text-primary font-medium line-clamp-1 mb-2">
                        {post.verdictBox.summary}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-3 border-t text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        {post.author?.name && (
                          <span className="font-medium text-foreground">{post.author.name}</span>
                        )}
                        {post.publishedAt && (
                          <div className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" aria-hidden="true" />
                            <time dateTime={post.publishedAt}>
                              {new Date(post.publishedAt).toLocaleDateString('en-AU', {
                                day: 'numeric', month: 'short', year: 'numeric',
                              })}
                            </time>
                          </div>
                        )}
                      </div>
                      {post.estimatedReadTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" aria-hidden="true" />
                          <span>{post.estimatedReadTime} min</span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  )
}
