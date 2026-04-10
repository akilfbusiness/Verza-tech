import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPostBySlug, getAllBlogSlugs } from '@/lib/sanity.queries'
import { urlForImage } from '@/lib/sanity.image'
import { Breadcrumb } from '@/components/breadcrumb'
import { VerdictBox } from '@/components/blog/verdict-box'
import { AffiliateCTA } from '@/components/blog/affiliate-cta'
import { PortableText } from '@/components/blog/portable-text'
import { renderJsonLd } from '@/lib/schema'

export const revalidate = 60
export const dynamicParams = true

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}
  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt
  const image = post.heroImage ? urlForImage(post.heroImage).width(1200).height(630).url() : undefined
  return {
    title,
    description,
    openGraph: {
      title,
      description: description || undefined,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || undefined,
      images: image ? [image] : undefined,
    },
  }
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  return match ? match[1] : null
}

function generateArticleSchema(post: any, siteUrl: string) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': post.title,
    'description': post.excerpt,
    'datePublished': post.publishedAt,
    'dateModified': post.updatedAt || post.publishedAt,
    'author': post.author ? {
      '@type': 'Person',
      'name': post.author.name,
      'url': post.author.slug ? `${siteUrl}/author/${post.author.slug.current}` : undefined,
    } : undefined,
    'publisher': {
      '@type': 'Organization',
      'name': 'Verza',
      'url': siteUrl,
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug.current}`,
    },
  }
  if (post.heroImage) {
    schema.image = urlForImage(post.heroImage).width(1200).height(630).url()
  }
  return schema
}

function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  }
}

function generateVideoSchema(post: any, siteUrl: string) {
  if (!post.youtubeUrl || !post.videoTitle) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    'name': post.videoTitle,
    'description': post.videoDescription || post.excerpt,
    'embedUrl': `https://www.youtube.com/embed/${getYouTubeId(post.youtubeUrl)}`,
    'uploadDate': post.publishedAt,
    'publisher': {
      '@type': 'Organization',
      'name': 'Verza',
      'url': siteUrl,
    },
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

const RECOMMENDATION_LABELS: Record<string, string> = {
  'highly-recommended': 'Highly Recommended',
  'recommended': 'Recommended',
  'conditional': 'Conditional',
  'not-recommended': 'Not Recommended',
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.tech'
  const articleSchema = generateArticleSchema(post, siteUrl)
  const faqSchema = post.faqs && post.faqs.length > 0 ? generateFAQSchema(post.faqs) : null
  const videoSchema = post.youtubeUrl ? generateVideoSchema(post, siteUrl) : null

  const youtubeId = post.youtubeUrl ? getYouTubeId(post.youtubeUrl) : null

  return (
    <>
      {renderJsonLd(articleSchema)}
      {faqSchema && renderJsonLd(faqSchema)}
      {videoSchema && renderJsonLd(videoSchema)}

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="border-b bg-secondary/20">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Breadcrumb items={[
              { label: 'Blog', href: '/blog' },
              ...(post.categories?.[0] ? [{
                label: post.categories[0].name,
                href: `/blog/category/${post.categories[0].slug.current}`,
              }] : []),
              { label: post.title, href: `/blog/${slug}` },
            ]} />

            {/* Article type + categories */}
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              {post.articleType && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                  {ARTICLE_TYPE_LABELS[post.articleType]}
                </span>
              )}
              {post.categories?.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/blog/category/${cat.slug.current}`}
                  className="px-3 py-1 rounded-full text-xs font-medium border hover:border-primary hover:text-primary transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-4 text-balance">{post.title}</h1>

            {post.excerpt && (
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">{post.excerpt}</p>
            )}

            {/* Author + dates */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              {post.author && (
                <div className="flex items-center gap-2">
                  {post.author.image && (
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary flex-shrink-0">
                      <Image
                        src={urlForImage(post.author.image).width(64).height(64).url()}
                        alt={post.author.name}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <span className="font-medium text-foreground">{post.author.name}</span>
                </div>
              )}
              {post.publishedAt && (
                <span>
                  Published {new Date(post.publishedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              )}
              {post.updatedAt && (
                <span>
                  Updated {new Date(post.updatedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              )}
            </div>

            {/* Affiliate disclosure banner */}
            {post.affiliateDisclosure && (
              <div className="mt-4 px-4 py-2.5 rounded-lg bg-yellow-50 border border-yellow-200 text-xs text-yellow-800">
                <strong>Affiliate Disclosure:</strong> Some links in this article are affiliate links. If you purchase through them, we may earn a commission at no extra cost to you. This does not influence our editorial opinions.
              </div>
            )}
          </div>
        </div>

        {/* Hero image */}
        {post.heroImage && (
          <div className="container mx-auto px-4 max-w-4xl mt-8">
            <div className="relative rounded-xl overflow-hidden border aspect-video">
              <Image
                src={urlForImage(post.heroImage).width(1200).height(675).url()}
                alt={post.heroImage.alt || post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="container mx-auto px-4 max-w-4xl py-10">
          {/* Key points / Quick answers */}
          {post.keyPoints && post.keyPoints.length > 0 && (
            <div className="mb-8 p-6 rounded-xl bg-secondary/50 border">
              <h2 className="font-bold text-lg mb-3">Key Takeaways</h2>
              <ul className="space-y-2">
                {post.keyPoints.map((kp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    {kp.point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Verdict box */}
          {post.verdictBox && <VerdictBox verdict={post.verdictBox} />}

          {/* Primary affiliate CTA */}
          {post.primaryAffiliateLink && (
            <AffiliateCTA
              primaryLink={post.primaryAffiliateLink}
              buttonLabel={post.affiliateButtonLabel}
              promoCode={post.promoCode}
              disclosure={false}
              variant="hero"
            />
          )}

          {/* YouTube video */}
          {youtubeId && (
            <div className="my-8">
              {post.videoTitle && <h2 className="text-xl font-bold mb-3">{post.videoTitle}</h2>}
              <div className="relative rounded-xl overflow-hidden border aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title={post.videoTitle || post.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          )}

          {/* Tools compared */}
          {post.toolsCompared && post.toolsCompared.length > 0 && (
            <div className="my-8">
              <h2 className="text-2xl font-bold mb-4">Tools Compared</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {post.toolsCompared.map((item, i) => (
                  <div key={i} className="border rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg">{item.tool?.name}</h3>
                      {item.rating && (
                        <span className="font-bold text-xl text-primary">{item.rating}<span className="text-sm text-muted-foreground">/5</span></span>
                      )}
                    </div>
                    {item.verdict && <p className="text-sm text-muted-foreground mb-4">{item.verdict}</p>}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {item.pros && item.pros.length > 0 && (
                        <div>
                          <p className="font-semibold text-green-700 mb-1">Pros</p>
                          <ul className="space-y-1">
                            {item.pros.map((pro, j) => <li key={j} className="text-muted-foreground">+ {pro}</li>)}
                          </ul>
                        </div>
                      )}
                      {item.cons && item.cons.length > 0 && (
                        <div>
                          <p className="font-semibold text-red-700 mb-1">Cons</p>
                          <ul className="space-y-1">
                            {item.cons.map((con, j) => <li key={j} className="text-muted-foreground">- {con}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                    {item.pricingLastVerified && (
                      <p className="text-xs text-muted-foreground mt-3">
                        Pricing verified: {new Date(item.pricingLastVerified).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}
                      </p>
                    )}
                    {item.affiliateLink && (
                      <a
                        href={item.affiliateLink}
                        target="_blank"
                        rel="nofollow noopener noreferrer sponsored"
                        className="mt-4 block text-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        Try {item.tool?.name}
                        {item.promoCode && ` (Code: ${item.promoCode})`}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Body content */}
          <article className="mt-8">
            <PortableText value={post.body} />
          </article>

          {/* Secondary affiliate links */}
          {post.secondaryAffiliateLinks && post.secondaryAffiliateLinks.length > 0 && (
            <div className="my-8 flex flex-col gap-3">
              {post.secondaryAffiliateLinks.map((link, i) => (
                <AffiliateCTA
                  key={i}
                  primaryLink={link.url}
                  buttonLabel={link.label}
                  promoCode={link.promoCode}
                  disclosure={false}
                  variant="inline"
                />
              ))}
            </div>
          )}

          {/* Bottom primary CTA */}
          {post.primaryAffiliateLink && (
            <div className="mt-10 mb-6">
              <AffiliateCTA
                primaryLink={post.primaryAffiliateLink}
                buttonLabel={post.affiliateButtonLabel}
                promoCode={post.promoCode}
                disclosure={post.affiliateDisclosure}
                variant="hero"
              />
            </div>
          )}

          {/* FAQs */}
          {post.faqs && post.faqs.length > 0 && (
            <section className="mt-12" aria-label="Frequently Asked Questions">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {post.faqs.map((faq, i) => (
                  <details key={i} className="border rounded-xl group" open={i === 0}>
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold list-none hover:bg-secondary/50 transition-colors rounded-xl">
                      {faq.question}
                      <span className="ml-4 text-muted-foreground group-open:rotate-180 transition-transform">
                        &#8964;
                      </span>
                    </summary>
                    <div className="px-5 pb-4 text-muted-foreground leading-relaxed text-sm">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* External sources */}
          {post.externalSources && post.externalSources.length > 0 && (
            <section className="mt-10 pt-8 border-t">
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">Sources</h3>
              <ul className="space-y-1">
                {post.externalSources.map((src, i) => (
                  <li key={i}>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {src.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Related articles */}
          {post.relatedArticles && post.relatedArticles.length > 0 && (
            <section className="mt-12 pt-8 border-t">
              <h2 className="text-xl font-bold mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {post.relatedArticles.map((article) => (
                  <Link
                    key={article._id}
                    href={`/blog/${article.slug.current}`}
                    className="border rounded-xl p-5 hover:border-primary hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {article.categories?.[0] && (
                        <span className="text-xs text-primary font-medium">{article.categories[0].name}</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-balance group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{article.excerpt}</p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Sticky mobile CTA */}
      {post.primaryAffiliateLink && (
        <AffiliateCTA
          primaryLink={post.primaryAffiliateLink}
          buttonLabel={post.affiliateButtonLabel}
          variant="sticky"
        />
      )}
    </>
  )
}
