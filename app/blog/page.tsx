import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllBlogPosts, getAllCategories } from '@/lib/sanity.queries'
import { urlForImage } from '@/lib/sanity.image'
import { generateItemListSchema, renderJsonLd } from '@/lib/schema'
import { Breadcrumb } from '@/components/breadcrumb'

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

const RECOMMENDATION_COLORS: Record<string, string> = {
  'highly-recommended': 'bg-green-100 text-green-800',
  'recommended': 'bg-blue-100 text-blue-800',
  'conditional': 'bg-yellow-100 text-yellow-800',
  'not-recommended': 'bg-red-100 text-red-800',
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getAllBlogPosts(),
    getAllCategories(),
  ])

  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-secondary/30">
          <div className="container mx-auto px-4 py-10 max-w-6xl">
            <Breadcrumb items={[{ label: 'Blog', href: '/blog' }]} />
            <h1 className="text-4xl font-bold mt-4 mb-2 text-balance">Blog</h1>
            <p className="text-lg text-muted-foreground">
              In-depth reviews, comparisons, and guides for SaaS and AI tools.
            </p>

            {/* Category filter tabs */}
            {categories.length > 0 && (
              <div className="flex gap-2 mt-6 flex-wrap">
                <Link
                  href="/blog"
                  className="px-4 py-1.5 rounded-full text-sm font-medium bg-primary text-primary-foreground"
                >
                  All
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/blog/category/${cat.slug.current}`}
                    className="px-4 py-1.5 rounded-full text-sm font-medium border hover:border-primary hover:text-primary transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl font-semibold mb-2">No articles yet</p>
              <p className="text-muted-foreground">
                Add your first blog post in Sanity Studio at{' '}
                <Link href="/studio" className="text-primary underline">/studio</Link>
              </p>
            </div>
          ) : (
            <>
              {/* Featured article */}
              {featured && (
                <Link href={`/blog/${featured.slug.current}`} className="block group mb-12">
                  <article className="border rounded-xl overflow-hidden hover:border-primary hover:shadow-lg transition-all">
                    <div className="grid md:grid-cols-2 gap-0">
                      {/* Image */}
                      <div className="relative h-64 md:h-auto bg-secondary">
                        {featured.heroImage ? (
                          <Image
                            src={urlForImage(featured.heroImage).url()}
                            alt={featured.heroImage.alt || featured.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                            <span className="text-4xl font-bold text-primary/20">V</span>
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                            Featured
                          </span>
                        </div>
                      </div>
                      {/* Content */}
                      <div className="p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-3">
                          {featured.articleType && (
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                              {ARTICLE_TYPE_LABELS[featured.articleType]}
                            </span>
                          )}
                          {featured.categories?.slice(0, 2).map((cat) => (
                            <span key={cat._id} className="text-xs text-muted-foreground">
                              {cat.name}
                            </span>
                          ))}
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-balance group-hover:text-primary transition-colors">
                          {featured.title}
                        </h2>
                        {(featured.summary || featured.excerpt) && (
                          <p className="text-muted-foreground mb-4 line-clamp-3">
                            {featured.summary || featured.excerpt}
                          </p>
                        )}
                        {featured.verdictBox && (
                          <div className="mb-4 p-3 rounded-lg bg-secondary/50 border-l-4 border-primary">
                            <p className="text-sm font-medium">{featured.verdictBox.summary}</p>
                            {featured.verdictBox.rating && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Rating: <span className="font-semibold text-foreground">{featured.verdictBox.rating}/5</span>
                              </p>
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          {featured.author?.name && <span>{featured.author.name}</span>}
                          {featured.publishedAt && (
                            <span>
                              {new Date(featured.publishedAt).toLocaleDateString('en-AU', {
                                day: 'numeric', month: 'short', year: 'numeric',
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              )}

              {/* Article grid */}
              {rest.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((post) => (
                    <Link key={post._id} href={`/blog/${post.slug.current}`} className="group">
                      <article className="border rounded-xl overflow-hidden hover:border-primary hover:shadow-md transition-all h-full flex flex-col">
                        {/* Image */}
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
                        {/* Content */}
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {post.categories?.slice(0, 1).map((cat) => (
                              <span key={cat._id} className="text-xs text-primary font-medium">
                                {cat.name}
                              </span>
                            ))}
                            {post.verdictBox?.recommendation && (
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${RECOMMENDATION_COLORS[post.verdictBox.recommendation] || ''}`}>
                                {post.verdictBox.recommendation.replace('-', ' ')}
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold mb-2 text-balance group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          {(post.summary || post.excerpt) && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
                              {post.summary || post.excerpt}
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
            </>
          )}
        </div>
      </div>
    </>
  )
}
