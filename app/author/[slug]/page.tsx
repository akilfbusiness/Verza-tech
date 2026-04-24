import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Twitter, Linkedin, Globe } from 'lucide-react'
import { getAuthorBySlug, getBlogPostsByAuthor, getAllAuthorSlugs } from '@/lib/sanity.queries'
import { urlForImage, urlForImageSafe } from '@/lib/sanity.image'
import { generatePersonSchema, generateBreadcrumbSchema, renderJsonLd } from '@/lib/schema'
import { ContentCard } from '@/components/ui/content-card'
import { StaggerChildren } from '@/components/animations/stagger-children'

export const revalidate = 60
export const dynamicParams = true

interface Props {
  params: Promise<{ slug: string }>
}

const HERO_BG = '#07080c'
const ACCENT  = 'oklch(0.72 0.1 255)'

const ARTICLE_TYPE_LABELS: Record<string, string> = {
  review: 'Review',
  comparison: 'Comparison',
  'best-of': 'Best Of',
  tutorial: 'Tutorial',
  news: 'News',
  opinion: 'Opinion',
}

export async function generateStaticParams() {
  const slugs = await getAllAuthorSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  if (!author) return {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.tech'
  const title = `${author.name} — Author at Verza`
  const description = author.bio
    ? author.bio.slice(0, 155)
    : `Read articles by ${author.name}${author.role ? `, ${author.role}` : ''} on Verza.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: author.image
        ? [{ url: urlForImage(author.image).width(400).height(400).url(), width: 400, height: 400 }]
        : [{ url: `${siteUrl}/api/og?title=${encodeURIComponent(author.name)}&type=author`, width: 1200, height: 630 }],
    },
    alternates: { canonical: `${siteUrl}/author/${slug}` },
  }
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params
  const [author, posts] = await Promise.all([
    getAuthorBySlug(slug),
    getBlogPostsByAuthor(slug),
  ])

  if (!author) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.tech'

  const personSchema = {
    ...generatePersonSchema(author),
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    url: `${siteUrl}/author/${slug}`,
    ...(author.role && { jobTitle: author.role }),
    ...(author.bio && { description: author.bio }),
    ...(author.yearsOfExperience && {
      description: `${author.bio || ''} ${author.yearsOfExperience}+ years of experience.`.trim(),
    }),
    ...(author.certifications?.length && { hasCredential: author.certifications }),
    ...(author.expertise?.length && { knowsAbout: author.expertise }),
    ...(author.image && { image: urlForImage(author.image).width(400).height(400).url() }),
    ...(author.socialLinks && {
      sameAs: [
        author.socialLinks.twitter,
        author.socialLinks.linkedin,
        author.socialLinks.website,
      ].filter(Boolean),
    }),
    worksFor: { '@type': 'Organization', name: 'Verza', url: siteUrl },
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteUrl },
    { name: 'Blog', url: `${siteUrl}/blog` },
    { name: author.name },
  ])

  const avatarSrc = author.image ? urlForImage(author.image).width(192).height(192).url() : null

  return (
    <>
      {renderJsonLd(personSchema)}
      {renderJsonLd(breadcrumbSchema)}

      {/* ── Dark author hero ─────────────────────────────────────────── */}
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
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-xs tracking-wide text-white/25">
              <li><Link href="/" className="hover:text-white/50 transition-colors">Home</Link></li>
              <li className="flex items-center gap-2"><span aria-hidden>/</span><Link href="/blog" className="hover:text-white/50 transition-colors">Blog</Link></li>
              <li className="flex items-center gap-2"><span aria-hidden>/</span><span className="text-white/45">{author.name}</span></li>
            </ol>
          </nav>

          <div className="flex flex-col sm:flex-row items-start gap-8">
            {/* Avatar */}
            <div className="w-20 h-20 overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
              {avatarSrc ? (
                <Image src={avatarSrc} alt={author.name} width={80} height={80} className="object-cover w-full h-full" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span
                    className="font-bold text-white/30"
                    style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '2rem' }}
                  >
                    {author.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: ACCENT }}>
                Author
              </p>
              <h1
                className="text-white font-light leading-tight mb-2"
                style={{
                  fontFamily: 'var(--font-display), sans-serif',
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  letterSpacing: '-0.01em',
                }}
              >
                {author.name}
              </h1>
              {author.role && (
                <p className="text-sm mb-4" style={{ color: ACCENT }}>{author.role}</p>
              )}
              {author.bio && (
                <p className="text-white/40 text-sm leading-relaxed max-w-2xl mb-6">{author.bio}</p>
              )}

              {/* Credentials */}
              <div className="flex flex-wrap gap-2 mb-6">
                {author.yearsOfExperience && (
                  <span className="text-[10px] font-medium tracking-[0.12em] uppercase border border-white/15 text-white/50 px-2.5 py-1">
                    {author.yearsOfExperience}+ yrs experience
                  </span>
                )}
                {author.certifications?.map((cert) => (
                  <span key={cert} className="text-[10px] font-medium tracking-[0.12em] uppercase border border-white/15 text-white/50 px-2.5 py-1">
                    {cert}
                  </span>
                ))}
                {author.expertise?.map((area) => (
                  <span key={area} className="text-[10px] font-medium tracking-[0.12em] uppercase border border-white/10 text-white/35 px-2.5 py-1">
                    {area}
                  </span>
                ))}
              </div>

              {/* Social links */}
              {author.socialLinks && (
                <div className="flex gap-5">
                  {author.socialLinks.twitter && (
                    <a
                      href={author.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors"
                      aria-label={`${author.name} on Twitter/X`}
                    >
                      <Twitter className="w-3.5 h-3.5" aria-hidden="true" />
                      Twitter/X
                    </a>
                  )}
                  {author.socialLinks.linkedin && (
                    <a
                      href={author.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors"
                      aria-label={`${author.name} on LinkedIn`}
                    >
                      <Linkedin className="w-3.5 h-3.5" aria-hidden="true" />
                      LinkedIn
                    </a>
                  )}
                  {author.socialLinks.website && (
                    <a
                      href={author.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors"
                      aria-label={`${author.name}'s website`}
                    >
                      <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                      Website
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Article count */}
            <div className="shrink-0 text-right">
              <p
                className="font-light leading-none"
                style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '3rem', color: 'rgba(255,255,255,0.15)' }}
              >
                {posts.length}
              </p>
              <p className="text-[10px] tracking-[0.2em] uppercase mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>Articles</p>
            </div>
          </div>

          <div className="mt-12 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
        </div>
      </section>

      {/* ── Articles grid ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary mb-8">
            Articles by {author.name}
            <span className="text-muted-foreground ml-2 font-normal normal-case tracking-normal">({posts.length})</span>
          </p>

          {posts.length === 0 ? (
            <p className="text-muted-foreground text-sm">No articles published yet.</p>
          ) : (
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
              {posts.map((post: any) => (
                <ContentCard
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  image={urlForImageSafe(post.heroImage) ?? undefined}
                  imageAlt={post.title}
                  label={post.articleType ? ARTICLE_TYPE_LABELS[post.articleType] : post.categories?.[0]?.name}
                  title={post.title}
                  description={post.summary}
                  meta={post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
                    : undefined
                  }
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
