import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarDays, Clock, RefreshCw, ShieldCheck, ExternalLink, ChevronRight } from 'lucide-react'
import { getBlogPostBySlug, getAllBlogSlugs } from '@/lib/sanity.queries'
import { urlForImage, urlForImageSafe } from '@/lib/sanity.image'
import { Breadcrumb } from '@/components/breadcrumb'
import { VerdictBox } from '@/components/blog/verdict-box'
import { AffiliateCTA } from '@/components/blog/affiliate-cta'
import { PortableText } from '@/components/blog/portable-text'
import { ReadingProgress } from '@/components/blog/reading-progress'
import { NewsletterCTA } from '@/components/blog/newsletter-cta'
import { generateBreadcrumbSchema, generateHowToSchema, generateSpeakableSchema, renderJsonLd } from '@/lib/schema'

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
  const description = post.metaDescription || post.summary
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.tech'
  const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(post.title)}&type=${encodeURIComponent(post.articleType || '')}&category=${encodeURIComponent(post.categories?.[0]?.name || '')}&author=${encodeURIComponent(post.author?.name || '')}${post.verdictBox?.rating ? `&rating=${post.verdictBox.rating}` : ''}`

  return {
    title,
    description,
    keywords: post.targetKeywords || (post.focusKeyword ? [post.focusKeyword] : undefined),
    authors: post.author?.name ? [{ name: post.author.name }] : undefined,
    openGraph: {
      title,
      description: description || undefined,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || undefined,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
    },
  }
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  return match ? match[1] : null
}

function generateBlogArticleSchema(post: any, siteUrl: string) {
  const articleUrl = `${siteUrl}/blog/${post.slug.current}`

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${articleUrl}#article`,
    headline: post.title,
    description: post.summary,
    inLanguage: 'en',
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'Verza',
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
    },
    image: urlForImageSafe(post.heroImage) ?? `${siteUrl}/api/og?title=${encodeURIComponent(post.title)}`,
  }

  if (post.author) {
    schema.author = {
      '@type': 'Person',
      name: post.author.name,
      url: post.author.slug ? `${siteUrl}/author/${post.author.slug.current}` : undefined,
      ...(post.author.role && { jobTitle: post.author.role }),
      ...(post.author.yearsOfExperience && {
        description: `${post.author.yearsOfExperience}+ years of experience`,
      }),
      ...(post.author.socialLinks?.linkedin && {
        sameAs: [post.author.socialLinks.linkedin].filter(Boolean),
      }),
    }
  }

  // about — what entities this article is primarily about (categories + primary tool)
  const aboutEntities: any[] = []
  if (post.categories?.length) {
    aboutEntities.push(...post.categories
      .filter((cat: any) => cat?.name)
      .map((cat: any) => ({
        '@type': 'Thing',
        name: cat.name,
      })))
  }
  if (aboutEntities.length > 0) schema.about = aboutEntities

  // mentions — specific tools/software the article references
  if (post.toolsCompared?.length) {
    schema.mentions = post.toolsCompared
      .filter((tool: any) => tool?.name)
      .map((tool: any) => ({
        '@type': 'SoftwareApplication',
        name: tool.name,
        ...(tool.website && { url: tool.website }),
      }))
  }

  return schema
}

function generateFAQSchema(faqs: { question: string; quickAnswer: string; fullAnswer?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.fullAnswer || faq.quickAnswer,
      },
    })),
  }
}

function extractHowToSteps(contentSections: any[]): { heading: string; text?: string }[] {
  const steps: { heading: string; text?: string }[] = []
  for (const section of contentSections || []) {
    for (const block of section.content || []) {
      if (block._type === 'howToBlock' && Array.isArray(block.steps)) {
        for (const step of block.steps) {
          steps.push({ heading: step.stepName || step.title || step.heading || '', text: step.stepDescription || step.description })
        }
      }
    }
  }
  return steps
}

function generateVideoSchema(post: any, siteUrl: string) {
  if (!post.youtubeUrl || !post.videoTitle) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: post.videoTitle,
    description: post.videoDescription || post.summary,
    embedUrl: `https://www.youtube.com/embed/${getYouTubeId(post.youtubeUrl)}`,
    uploadDate: post.publishedAt,
    publisher: { '@type': 'Organization', name: 'Verza', url: siteUrl },
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

const RESOURCE_TYPE_LABELS: Record<string, string> = {
  internal: 'Internal',
  external: 'External',
  government: 'Government',
  research: 'Research',
  tool: 'Tool',
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.tech'

  const articleSchema = generateBlogArticleSchema(post, siteUrl)
  const faqSchema = post.faqs?.length > 0 ? generateFAQSchema(post.faqs) : null
  const videoSchema = post.youtubeUrl ? generateVideoSchema(post, siteUrl) : null
  const howToSteps = extractHowToSteps(post.contentSections || [])
  const howToSchema = howToSteps.length > 0
    ? generateHowToSchema(post.title, post.summary || '', howToSteps, `${siteUrl}/blog/${post.slug.current}`)
    : null

  const speakableSelectors = ['h1', '#article-answer-capsule']
  if (post.summary) speakableSelectors.push('#article-summary')
  const speakableSchema = generateSpeakableSchema(`${siteUrl}/blog/${post.slug.current}`, speakableSelectors)

  const breadcrumbItems = [
    { name: 'Home', url: siteUrl },
    { name: 'Blog', url: `${siteUrl}/blog` },
    ...(post.categories?.[0]
      ? [{ name: post.categories[0].name, url: `${siteUrl}/blog/category/${post.categories[0].slug.current}` }]
      : []),
    { name: post.title },
  ]
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems)
  const youtubeId = post.youtubeUrl ? getYouTubeId(post.youtubeUrl) : null

  return (
    <>
      {renderJsonLd(articleSchema)}
      {faqSchema && renderJsonLd(faqSchema)}
      {videoSchema && renderJsonLd(videoSchema)}
      {howToSchema && renderJsonLd(howToSchema)}
      {renderJsonLd(speakableSchema)}
      {renderJsonLd(breadcrumbSchema)}

      <ReadingProgress />

      <div className="min-h-screen bg-background">

        {/* ── Hero header ──────────────────────────────────────────────── */}
        <header className="border-b bg-secondary/20">
          <div className="container mx-auto px-4 py-8 max-w-4xl">

            {/* Breadcrumb */}
            <Breadcrumb items={[
              { label: 'Blog', href: '/blog' },
              ...(post.categories?.[0] ? [{
                label: post.categories[0].name,
                href: `/blog/category/${post.categories[0].slug.current}`,
              }] : []),
              { label: post.title, href: `/blog/${slug}` },
            ]} />

            {/* Type + category tags */}
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              {post.articleType && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                  {ARTICLE_TYPE_LABELS[post.articleType]}
                </span>
              )}
              {post.categories?.filter((cat: any) => cat?.slug?.current).map((cat: any) => (
                <Link
                  key={cat._id}
                  href={`/blog/category/${cat.slug.current}`}
                  className="px-3 py-1 rounded-full text-xs font-medium border hover:border-primary hover:text-primary transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-3 text-balance leading-tight">
              {post.title}
            </h1>

            {/* Summary / TLDR */}
            {post.summary && (
              <p id="article-summary" className="text-lg text-muted-foreground leading-relaxed mb-5">
                {post.summary}
              </p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {post.author && (
                <div className="flex items-center gap-2">
                  {urlForImageSafe(post.author.image) && (
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary flex-shrink-0 border">
                      <Image
                        src={urlForImageSafe(post.author.image)!}
                        alt={post.author.name}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-foreground">{post.author.name}</span>
                    {post.author.role && (
                      <span className="text-xs text-muted-foreground ml-1.5">— {post.author.role}</span>
                    )}
                  </div>
                </div>
              )}
              {post.publishedAt && (
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </time>
                </div>
              )}
              {post.estimatedReadTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{post.estimatedReadTime} min read</span>
                </div>
              )}
              {post.updatedAt && (
                <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-secondary border font-medium text-foreground">
                  <RefreshCw className="w-3 h-3" aria-hidden="true" />
                  Last verified:{' '}
                  <time dateTime={post.updatedAt} className="ml-1">
                    {new Date(post.updatedAt).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}
                  </time>
                </div>
              )}
            </div>

            {/* Affiliate disclosure */}
            {post.affiliateDisclosure && (
              <div className="mt-4 px-4 py-2.5 rounded-lg bg-yellow-50 border border-yellow-200 text-xs text-yellow-800">
                <strong>Affiliate Disclosure:</strong> Some links in this article are affiliate links. If you purchase through them, we may earn a commission at no extra cost to you. This does not influence our editorial opinions.
              </div>
            )}
          </div>
        </header>

        {/* ── Hero image ───────────────────────────────────────────────── */}
        {urlForImageSafe(post.heroImage) && (
          <div className="container mx-auto px-4 max-w-4xl mt-8">
            <figure className="relative rounded-xl overflow-hidden border aspect-video">
              <Image
                src={urlForImageSafe(post.heroImage)!}
                alt={post.heroImage?.alt || post.title}
                fill
                className="object-cover"
                priority
              />
            </figure>
          </div>
        )}

        {/* ── Main content ─────────────────────────────────────────────── */}
        <div className="container mx-auto px-4 max-w-4xl py-10">

          {/* 1. Key Points / Quick Answers */}
          {post.keyPoints?.length > 0 && (
            <section className="mb-8 p-6 rounded-xl bg-secondary/50 border" aria-label="Key Takeaways">
              <h2 className="font-bold text-lg mb-4">Key Takeaways</h2>
              <ul className="space-y-3">
                {post.keyPoints.map((kp: any, i: number) => (
                  <li key={i}>
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        {kp.question && (
                          <p className="font-semibold text-sm text-foreground mb-0.5">{kp.question}</p>
                        )}
                        <p className="text-sm text-muted-foreground leading-relaxed">{kp.quickAnswer}</p>
                        {kp.fullExplanation && (
                          <details className="mt-1">
                            <summary className="text-xs text-primary cursor-pointer hover:underline">Read more</summary>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{kp.fullExplanation}</p>
                          </details>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 2. Verdict box */}
          {post.verdictBox && <VerdictBox verdict={post.verdictBox} />}

          {/* 3. Primary affiliate CTA (top) */}
          {post.primaryAffiliateLink && (
            <AffiliateCTA
              primaryLink={post.primaryAffiliateLink}
              buttonLabel={post.affiliateButtonLabel}
              promoCode={post.promoCode}
              disclosure={false}
              variant="hero"
              articleSlug={slug}
            />
          )}

          {/* 4. Article Answer Capsule — AEO direct answer, pulled verbatim by AI engines */}
          {post.articleAnswerCapsule && (
            <div id="article-answer-capsule" className="mt-6 px-5 py-4 rounded-xl border-l-4 border-primary bg-primary/5">
              <p className="text-base font-medium leading-relaxed text-foreground">
                {post.articleAnswerCapsule}
              </p>
            </div>
          )}

          {/* 5. Introduction */}
          {post.introduction && (
            <div className="mt-6 text-lg leading-relaxed text-foreground">
              <p>{post.introduction}</p>
            </div>
          )}

          {/* 5. YouTube video */}
          {youtubeId && (
            <div className="my-10">
              {post.videoTitle && (
                <h2 className="text-xl font-bold mb-3">{post.videoTitle}</h2>
              )}
              <div className="relative rounded-xl overflow-hidden border aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title={post.videoTitle || post.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              {post.videoDescription && (
                <p className="text-sm text-muted-foreground mt-2">{post.videoDescription}</p>
              )}
            </div>
          )}

          {/* 6. Content sections (main body) */}
          {post.contentSections?.length > 0 ? (
            <article className="mt-8 space-y-2">
              {post.contentSections.map((section: any, i: number) => (
                <section key={i} id={`section-${i}`} className="scroll-mt-20">
                  {section.heading && (
                    <h2 className="text-2xl font-bold mt-10 mb-3 text-balance">{section.heading}</h2>
                  )}
                  {section.sectionAnswerCapsule && (
                    <p className="mb-4 text-base text-muted-foreground italic border-l-2 border-primary/40 pl-4 leading-relaxed">
                      {section.sectionAnswerCapsule}
                    </p>
                  )}
                  <PortableText value={section.content} />
                </section>
              ))}
            </article>
          ) : null}

          {/* 7. Decision Framework */}
          {post.decisionFramework?.steps?.length > 0 && (
            <section className="my-10 border rounded-xl p-6 bg-secondary/30" aria-label="Decision framework">
              {post.decisionFramework.frameworkName && (
                <h2 className="text-xl font-bold mb-5 text-balance">
                  {post.decisionFramework.frameworkName}
                </h2>
              )}
              <ol className="space-y-4">
                {post.decisionFramework.steps.map((step: any, i: number) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{step.stepTitle}</p>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{step.stepDescription}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* 8. Data Provenance */}
          {post.dataProvenance && (
            <div className="my-6 flex items-start gap-3 px-4 py-3 rounded-lg border bg-muted/40 text-sm text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>{post.dataProvenance}</span>
            </div>
          )}

          {/* 9. Tools compared */}
          {post.toolsCompared?.length > 0 && (
            <section className="my-10" aria-label="Tools compared">
              <h2 className="text-2xl font-bold mb-6">Tools Compared</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {post.toolsCompared.map((item: any, i: number) => (
                  <div key={i} className="border rounded-xl p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg">{item.tool?.name}</h3>
                      {item.rating && (
                        <span className="font-bold text-xl text-primary">
                          {item.rating}<span className="text-sm text-muted-foreground">/5</span>
                        </span>
                      )}
                    </div>
                    {item.verdict && (
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{item.verdict}</p>
                    )}
                    <div className="grid grid-cols-2 gap-4 text-sm flex-1">
                      {item.pros?.length > 0 && (
                        <div>
                          <p className="font-semibold text-green-700 dark:text-green-400 mb-1.5">Pros</p>
                          <ul className="space-y-1">
                            {item.pros.map((pro: string, j: number) => (
                              <li key={j} className="text-muted-foreground flex items-start gap-1">
                                <span className="text-green-600 mt-0.5">+</span> {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {item.cons?.length > 0 && (
                        <div>
                          <p className="font-semibold text-red-700 dark:text-red-400 mb-1.5">Cons</p>
                          <ul className="space-y-1">
                            {item.cons.map((con: string, j: number) => (
                              <li key={j} className="text-muted-foreground flex items-start gap-1">
                                <span className="text-red-600 mt-0.5">-</span> {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    {item.pricingLastVerified && (
                      <p className="text-xs text-muted-foreground mt-3 border-t pt-3">
                        Pricing verified:{' '}
                        {new Date(item.pricingLastVerified).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}
                      </p>
                    )}
                    {item.affiliateLink && (
                      <a
                        href={item.affiliateLink}
                        target="_blank"
                        rel="nofollow noopener noreferrer sponsored"
                        className="mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        Try {item.tool?.name}
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                        {item.promoCode && ` — Code: ${item.promoCode}`}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 8. Secondary affiliate links */}
          {post.secondaryAffiliateLinks?.length > 0 && (
            <div className="my-8 flex flex-col gap-3">
              {post.secondaryAffiliateLinks.map((link: any, i: number) => (
                <AffiliateCTA
                  key={i}
                  primaryLink={link.url}
                  buttonLabel={link.label}
                  promoCode={link.promoCode}
                  disclosure={false}
                  variant="inline"
                  articleSlug={slug}
                />
              ))}
            </div>
          )}

          {/* 9. Bottom primary CTA */}
          {post.primaryAffiliateLink && (
            <div className="my-10">
              <AffiliateCTA
                primaryLink={post.primaryAffiliateLink}
                buttonLabel={post.affiliateButtonLabel}
                promoCode={post.promoCode}
                disclosure={post.affiliateDisclosure}
                variant="hero"
                articleSlug={slug}
              />
            </div>
          )}

          {/* 10. FAQs */}
          {post.faqs?.length > 0 && (
            <section className="mt-12" aria-label="Frequently Asked Questions">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {post.faqs.map((faq: any, i: number) => (
                  <details key={i} className="border rounded-xl group" open={i === 0}>
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold list-none hover:bg-secondary/50 transition-colors rounded-xl">
                      <span>{faq.question}</span>
                      <ChevronRight className="w-4 h-4 ml-4 text-muted-foreground group-open:rotate-90 transition-transform flex-shrink-0" aria-hidden="true" />
                    </summary>
                    <div className="px-5 pb-5 space-y-2">
                      <p className="text-sm font-medium text-foreground leading-relaxed">{faq.quickAnswer}</p>
                      {faq.fullAnswer && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.fullAnswer}</p>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* 11. Related Resources */}
          {post.relatedResources?.length > 0 && (
            <section className="mt-10 pt-8 border-t" aria-label="Related resources">
              <h3 className="font-semibold text-base mb-4">Related Resources</h3>
              <ul className="space-y-2">
                {post.relatedResources.map((res: any, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 px-2 py-0.5 rounded text-xs bg-secondary text-muted-foreground font-medium flex-shrink-0">
                      {RESOURCE_TYPE_LABELS[res.resourceType] || 'Link'}
                    </span>
                    <div>
                      <a
                        href={res.url}
                        target={res.resourceType !== 'internal' ? '_blank' : undefined}
                        rel={res.resourceType !== 'internal' ? 'noopener noreferrer' : undefined}
                        className="font-medium text-primary hover:underline"
                      >
                        {res.title}
                      </a>
                      {res.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{res.description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 12. Data Sources */}
          {post.dataSources?.length > 0 && (
            <section className="mt-8 pt-6 border-t" aria-label="Data sources">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                Sources &amp; References
              </h3>
              <ol className="space-y-1 list-decimal list-inside">
                {post.dataSources.map((src: any, i: number) => (
                  <li key={i} className="text-sm">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {src.title}
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* 13. Author card */}
          {post.author && (
            <section className="mt-10 pt-8 border-t" aria-label="About the author">
              <div className="flex items-start gap-4 p-6 rounded-xl bg-secondary/40 border">
                {urlForImageSafe(post.author.image) && (
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-secondary flex-shrink-0 border-2 border-background shadow">
                    <Image
                      src={urlForImageSafe(post.author.image)!}
                      alt={post.author.name}
                      width={56}
                      height={56}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-bold text-foreground">{post.author.name}</p>
                    {post.author.role && (
                      <span className="text-xs text-muted-foreground">{post.author.role}</span>
                    )}
                    {post.author.yearsOfExperience && (
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                        {post.author.yearsOfExperience}+ yrs experience
                      </span>
                    )}
                  </div>
                  {post.author.bio && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">{post.author.bio}</p>
                  )}
                  {post.author.certifications?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.author.certifications.map((cert: string, i: number) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded border bg-background">
                          {cert}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* 14. Review dates */}
          {(post.publishedAt || post.updatedAt || post.reviewFrequency || post.nextReviewDate) && (
            <section className="mt-6 pt-6 border-t text-xs text-muted-foreground space-y-1" aria-label="Article review dates">
              {post.publishedAt && (
                <p>Published: <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</time></p>
              )}
              {post.updatedAt && (
                <p>Last updated: <time dateTime={post.updatedAt}>{new Date(post.updatedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</time></p>
              )}
              {post.reviewFrequency && (
                <p>Review frequency: <span className="capitalize">{post.reviewFrequency}</span></p>
              )}
              {post.nextReviewDate && (
                <p>Next review: <time dateTime={post.nextReviewDate}>{new Date(post.nextReviewDate).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}</time></p>
              )}
            </section>
          )}

          {/* 15. Newsletter CTA */}
          <NewsletterCTA
            variant="card"
            source={`blog-article-${slug}`}
          />

          {/* 16. Related articles */}
          {post.relatedArticles?.length > 0 && (
            <section className="mt-12 pt-8 border-t" aria-label="Related articles">
              <h2 className="text-xl font-bold mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {post.relatedArticles.map((article: any) => (
                  <Link
                    key={article._id}
                    href={`/blog/${article.slug.current}`}
                    className="border rounded-xl p-5 hover:border-primary hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {article.categories?.[0] && (
                        <span className="text-xs text-primary font-medium">{article.categories[0].name}</span>
                      )}
                      {article.articleType && (
                        <span className="text-xs text-muted-foreground">{ARTICLE_TYPE_LABELS[article.articleType]}</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-balance group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    {article.summary && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{article.summary}</p>
                    )}
                    {article.author && (
                      <p className="text-xs text-muted-foreground mt-3">{article.author.name}</p>
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
          articleSlug={slug}
        />
      )}
    </>
  )
}
