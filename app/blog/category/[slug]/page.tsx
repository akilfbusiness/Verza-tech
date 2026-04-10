import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getBlogPostsByCategory, getCategoryBySlug, getAllCategories, getAllCategorySlugs } from '@/lib/sanity.queries'
import { urlForImage } from '@/lib/sanity.config'
import { Breadcrumb } from '@/components/breadcrumb'

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
  return {
    title: `${category.name} Tools & Reviews | Verza`,
    description: category.description || `Browse ${category.name} tool reviews, comparisons, and guides on Verza.`,
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-secondary/30">
        <div className="container mx-auto px-4 py-10 max-w-6xl">
          <Breadcrumb items={[
            { label: 'Blog', href: '/blog' },
            { label: category.name, href: `/blog/category/${slug}` },
          ]} />
          <h1 className="text-4xl font-bold mt-4 mb-2 text-balance">{category.name}</h1>
          {category.description && (
            <p className="text-lg text-muted-foreground max-w-2xl">{category.description}</p>
          )}

          {/* Category filter tabs */}
          <div className="flex gap-2 mt-6 flex-wrap">
            <Link
              href="/blog"
              className="px-4 py-1.5 rounded-full text-sm font-medium border hover:border-primary hover:text-primary transition-colors"
            >
              All
            </Link>
            {allCategories.map((cat) => (
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
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-semibold mb-2">No articles in this category yet</p>
            <p className="text-muted-foreground">Check back soon or browse all articles.</p>
            <Link href="/blog" className="mt-4 inline-block text-primary underline">
              View all articles
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post._id} href={`/blog/${post.slug.current}`} className="group">
                <article className="border rounded-xl overflow-hidden hover:border-primary hover:shadow-md transition-all h-full flex flex-col">
                  <div className="relative h-48 bg-secondary flex-shrink-0">
                    {post.heroImage ? (
                      <Image
                        src={urlForImage(post.heroImage).url()}
                        alt={post.heroImage.alt || post.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
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
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold mb-2 text-balance group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
                        {post.excerpt}
                      </p>
                    )}
                    {post.verdictBox?.summary && (
                      <p className="text-xs text-primary font-medium line-clamp-1 mb-2">
                        {post.verdictBox.summary}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t text-xs text-muted-foreground">
                      {post.author?.name && <span>{post.author.name}</span>}
                      {post.publishedAt && (
                        <span>
                          {new Date(post.publishedAt).toLocaleDateString('en-AU', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
