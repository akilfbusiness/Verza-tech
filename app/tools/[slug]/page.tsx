import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getToolBySlug, getAllToolSlugs, getFAQsByTool, getAllTools } from '@/lib/sanity.queries'
import { urlForImageSafe } from '@/lib/sanity.image'
import {
  generateSoftwareApplicationSchema,
  generateBreadcrumbSchema,
  generateFAQPageSchema,
  renderJsonLd,
} from '@/lib/schema'
import { QuickAnswer } from '@/components/aeo/quick-answer'
import { KeyFacts } from '@/components/aeo/key-facts'
import { BestFor } from '@/components/aeo/best-for'
import { UpdatedBadge } from '@/components/aeo/updated-badge'
import { RelatedTools } from '@/components/features/related-tools'

type Props = {
  params: Promise<{ slug: string }>
}

const HERO_BG = '#07080c'
const ACCENT  = 'oklch(0.72 0.1 255)'

export async function generateStaticParams() {
  const slugs = await getAllToolSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = await getToolBySlug(slug)

  if (!tool) return { title: 'Tool Not Found' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.com'
  const ogImageUrl = new URL('/api/og', siteUrl)
  ogImageUrl.searchParams.set('title', tool.name)
  ogImageUrl.searchParams.set('subtitle', tool.tagline || 'SaaS & AI Tool Review')
  if (tool.rating) ogImageUrl.searchParams.set('rating', tool.rating.toString())

  const metaDescription = tool.description || tool.tagline || `Comprehensive review of ${tool.name}. Learn about features, pricing, pros and cons, and find the best alternatives.`

  return {
    title: `${tool.name} Review 2026 - Features, Pricing & Alternatives | Verza`,
    description: metaDescription,
    keywords: [
      tool.name, `${tool.name} review`, `${tool.name} review 2026`,
      `${tool.name} pricing`, `${tool.name} alternatives`,
      'SaaS review', 'AI tool review',
      ...(tool.categories?.map(c => c.name) || []),
    ],
    alternates: { canonical: `${siteUrl}/tools/${slug}` },
    openGraph: {
      title: `${tool.name} Review 2026`,
      description: metaDescription,
      type: 'article',
      url: `${siteUrl}/tools/${slug}`,
      publishedTime: tool.publishedAt,
      modifiedTime: tool.updatedAt,
      images: [{ url: ogImageUrl.toString(), width: 1200, height: 630, alt: `${tool.name} Review` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} Review 2026`,
      description: metaDescription,
      images: [ogImageUrl.toString()],
    },
  }
}

export const revalidate = 60
export const dynamic = 'force-static'
export const dynamicParams = true
export const fetchCache = 'default-cache'

export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const [tool, faqs, allTools] = await Promise.all([
    getToolBySlug(slug),
    getToolBySlug(slug).then(t => t ? getFAQsByTool(t._id) : []),
    getAllTools(),
  ])

  if (!tool) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.com'

  const softwareSchema = generateSoftwareApplicationSchema(tool)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteUrl },
    { name: 'Tools', url: `${siteUrl}/tools` },
    { name: tool.name, url: `${siteUrl}/tools/${tool.slug.current}` },
  ])
  const faqSchema = faqs.length > 0 ? generateFAQPageSchema(faqs) : null

  const logoSrc = urlForImageSafe(tool.logo)

  return (
    <>
      {renderJsonLd(softwareSchema)}
      {renderJsonLd(breadcrumbSchema)}
      {faqSchema && renderJsonLd(faqSchema)}

      {/* ── Dark hero header ─────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden border-b border-border"
        style={{ background: HERO_BG }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-10%', right: '5%',
            width: '40vw', height: '40vw',
            maxWidth: '500px', maxHeight: '500px',
            background: 'radial-gradient(circle, oklch(0.72 0.1 255 / 0.06) 0%, transparent 65%)',
            filter: 'blur(60px)',
          }}
        />

        <div className="relative container mx-auto px-6 max-w-7xl py-20 md:py-28">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-xs tracking-wide text-white/25">
              <li><Link href="/" className="hover:text-white/50 transition-colors">Home</Link></li>
              <li className="flex items-center gap-2"><span aria-hidden>/</span><Link href="/tools" className="hover:text-white/50 transition-colors">Tools</Link></li>
              <li className="flex items-center gap-2"><span aria-hidden>/</span><span className="text-white/45">{tool.name}</span></li>
            </ol>
          </nav>

          <div className="flex items-start gap-8 flex-wrap">
            {/* Logo */}
            {logoSrc && (
              <div className="w-16 h-16 border border-white/10 shrink-0 overflow-hidden bg-white/5 flex items-center justify-center">
                <Image src={logoSrc} alt={tool.name} width={64} height={64} className="w-full h-full object-contain" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              {/* Label */}
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: ACCENT }}>
                {tool.categories?.[0]?.name ?? 'Tool Review'}
              </p>

              {/* Name */}
              <h1
                className="text-white font-light leading-[1.0] mb-3"
                style={{
                  fontFamily: 'var(--font-display), sans-serif',
                  fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
                  letterSpacing: '-0.01em',
                }}
              >
                {tool.name}
              </h1>

              {/* Tagline */}
              {tool.tagline && (
                <p className="text-white/45 text-sm leading-relaxed mb-6 max-w-xl">{tool.tagline}</p>
              )}

              {/* Category chips */}
              {tool.categories && tool.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {tool.categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/category/${category.slug.current}`}
                      className="text-[10px] font-medium tracking-[0.12em] uppercase border border-white/20 text-white/50 px-2.5 py-1 hover:border-white/40 hover:text-white/70 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                {tool.website && (
                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-white/20 text-white/70 px-5 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase hover:border-white/40 hover:text-white/90 transition-colors"
                  >
                    Visit Website
                  </a>
                )}
                {tool.affiliateLink && (
                  <a
                    href={tool.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors"
                    style={{ background: ACCENT, color: '#07080c' }}
                  >
                    Get Started
                  </a>
                )}
              </div>
            </div>

            {/* Rating */}
            {tool.rating && (
              <div className="shrink-0 text-right">
                <p
                  className="font-semibold leading-none tabular-nums"
                  style={{
                    fontFamily: 'var(--font-display), sans-serif',
                    fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                    color: ACCENT,
                  }}
                >
                  {tool.rating}
                </p>
                <p className="text-[10px] tracking-widest uppercase mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>/10</p>
              </div>
            )}
          </div>

          <div className="mt-12 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="bg-background">
        <div className="container mx-auto px-6 max-w-4xl py-16">
          <div className="space-y-12">
            {/* Quick Answer */}
            {tool.description && (
              <QuickAnswer
                question={`What is ${tool.name}?`}
                answer={tool.description}
                highlights={tool.features?.slice(0, 3)}
              />
            )}

            {/* Updated Badge */}
            {(tool.publishedAt || tool.updatedAt) && (
              <UpdatedBadge publishedAt={tool.publishedAt} updatedAt={tool.updatedAt} format="long" />
            )}

            {/* Key Facts */}
            <KeyFacts
              title="Quick Facts"
              columns={2}
              facts={[
                ...(tool.freePlanAvailable !== undefined ? [{ label: 'Free Plan Available', value: tool.freePlanAvailable, icon: '💰' }] : []),
                ...(tool.freeTrialAvailable !== undefined ? [{ label: 'Free Trial', value: tool.freeTrialAvailable, icon: '🎁' }] : []),
                ...(tool.status ? [{ label: 'Status', value: tool.status, icon: '📊' }] : []),
                ...(tool.rating ? [{ label: 'Rating', value: `${tool.rating}/10`, icon: '⭐' }] : []),
                ...(tool.website ? [{ label: 'Website', value: new URL(tool.website).hostname, icon: '🌐' }] : []),
              ]}
            />

            {/* Features */}
            {tool.features && tool.features.length > 0 && (
              <section>
                <h2
                  className="font-light mb-6"
                  style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '1.8rem', letterSpacing: '-0.01em' }}
                >
                  Key Features
                </h2>
                <ul className="grid md:grid-cols-2 gap-3">
                  {tool.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 py-3 border-b border-border">
                      <span className="text-primary mt-0.5 shrink-0">✓</span>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Pricing */}
            {tool.pricing && tool.pricing.length > 0 && (
              <section>
                <h2
                  className="font-light mb-6"
                  style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '1.8rem', letterSpacing: '-0.01em' }}
                >
                  Pricing
                </h2>
                <div className="grid md:grid-cols-3 gap-px bg-border">
                  {tool.pricing.map((tier, index) => (
                    <div key={index} className="bg-background p-6">
                      <h3
                        className="font-medium mb-3"
                        style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '1.1rem' }}
                      >
                        {tier.name}
                      </h3>
                      {tier.price && (
                        <p
                          className="font-light mb-4"
                          style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '2rem', color: 'var(--primary)' }}
                        >
                          {tier.price}
                          {tier.billingPeriod && (
                            <span className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-inter)' }}>
                              /{tier.billingPeriod}
                            </span>
                          )}
                        </p>
                      )}
                      {tier.features && tier.features.length > 0 && (
                        <ul className="space-y-2">
                          {tier.features.map((feature, fIndex) => (
                            <li key={fIndex} className="flex items-start gap-2 text-sm">
                              <span className="text-primary mt-0.5 shrink-0">✓</span>
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

            {/* Pros & Cons */}
            {((tool.pros && tool.pros.length > 0) || (tool.cons && tool.cons.length > 0)) && (
              <section>
                <h2
                  className="font-light mb-6"
                  style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '1.8rem', letterSpacing: '-0.01em' }}
                >
                  Pros &amp; Cons
                </h2>
                <div className="grid md:grid-cols-2 gap-px bg-border">
                  {tool.pros && tool.pros.length > 0 && (
                    <div className="bg-background p-6">
                      <h3
                        className="font-medium mb-4 text-primary"
                        style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '1.05rem' }}
                      >
                        Pros
                      </h3>
                      <ul className="space-y-3">
                        {tool.pros.map((pro, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm">
                            <span className="text-primary mt-0.5 shrink-0">+</span>
                            <span className="text-muted-foreground">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {tool.cons && tool.cons.length > 0 && (
                    <div className="bg-background p-6">
                      <h3
                        className="font-medium mb-4 text-muted-foreground"
                        style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '1.05rem' }}
                      >
                        Cons
                      </h3>
                      <ul className="space-y-3">
                        {tool.cons.map((con, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm">
                            <span className="text-muted-foreground mt-0.5 shrink-0">−</span>
                            <span className="text-muted-foreground">{con}</span>
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
              <BestFor title="Best For" useCases={tool.bestFor} />
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <section>
                <h2
                  className="font-light mb-6"
                  style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '1.8rem', letterSpacing: '-0.01em' }}
                >
                  Frequently Asked Questions
                </h2>
                <div className="space-y-px bg-border">
                  {faqs.map((faq) => (
                    <div key={faq._id} className="bg-background p-6">
                      <h3
                        className="font-medium mb-2"
                        style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '1.05rem' }}
                      >
                        {faq.question}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {typeof faq.answer === 'string' ? faq.answer : 'Answer content'}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Alternatives */}
            {tool.alternatives && tool.alternatives.length > 0 && (
              <section>
                <h2
                  className="font-light mb-6"
                  style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '1.8rem', letterSpacing: '-0.01em' }}
                >
                  Alternatives to {tool.name}
                </h2>
                <div className="grid md:grid-cols-2 gap-px bg-border">
                  {tool.alternatives.map((alt) => {
                    const altLogo = urlForImageSafe(alt.logo)
                    return (
                      <Link
                        key={alt._id}
                        href={`/tools/${alt.slug.current}`}
                        className="bg-background p-5 hover:border-primary/40 transition-colors flex items-center gap-4 border border-transparent hover:bg-secondary/10"
                      >
                        {altLogo && (
                          <div className="w-10 h-10 border border-border shrink-0 overflow-hidden bg-secondary flex items-center justify-center">
                            <Image src={altLogo} alt={alt.name} width={40} height={40} className="w-full h-full object-contain" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-medium truncate"
                            style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '1.05rem' }}
                          >
                            {alt.name}
                          </h3>
                          {alt.tagline && (
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{alt.tagline}</p>
                          )}
                        </div>
                        {alt.rating && (
                          <div className="text-right shrink-0">
                            <p className="font-semibold tabular-nums text-primary" style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>{alt.rating}</p>
                            <p className="text-[10px] text-muted-foreground">/10</p>
                          </div>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Related Tools */}
            <RelatedTools currentTool={tool} allTools={allTools} maxResults={4} />
          </div>
        </div>
      </div>
    </>
  )
}
