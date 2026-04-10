import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarDays, Clock, Twitter, Linkedin, Globe, Award, Briefcase, Star } from 'lucide-react'
import { getAuthorBySlug, getBlogPostsByAuthor, getAllAuthorSlugs } from '@/lib/sanity.queries'
import { urlForImage } from '@/lib/sanity.image'
import { Breadcrumb } from '@/components/breadcrumb'
import { generatePersonSchema, generateBreadcrumbSchema, renderJsonLd } from '@/lib/schema'

export const revalidate = 60
export const dynamicParams = true

interface Props {
  params: Promise<{ slug: string }>
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
    alternates: {
      canonical: `${siteUrl}/author/${slug}`,
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
    ...(author.image && {
      image: urlForImage(author.image).width(400).height(400).url(),
    }),
    ...(author.socialLinks && {
      sameAs: [
        author.socialLinks.twitter,
        author.socialLinks.linkedin,
        author.socialLinks.website,
      ].filter(Boolean),
    }),
    worksFor: {
      '@type': 'Organization',
      name: 'Verza',
      url: siteUrl,
    },
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteUrl },
    { name: 'Authors', url: `${siteUrl}/author` },
    { name: author.name },
  ])

  return (
    <>
      {renderJsonLd(personSchema)}
      {renderJsonLd(breadcrumbSchema)}

      <div className="min-h-screen bg-background">
        {/* Profile header */}
        <header className="border-b bg-secondary/20">
          <div className="container mx-auto px-4 py-10 max-w-5xl">
            <Breadcrumb items={[
              { label: 'Blog', href: '/blog' },
              { label: author.name, href: `/author/${slug}` },
            ]} />

            <div className="flex flex-col sm:flex-row items-start gap-6 mt-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-secondary flex-shrink-0 border-2 border-border">
                {author.image ? (
                  <Image
                    src={urlForImage(author.image).width(192).height(192).url()}
                    alt={author.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <span className="text-3xl font-bold text-primary">
                      {author.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-balance">{author.name}</h1>
                {author.role && (
                  <p className="text-base text-primary font-medium mt-1">{author.role}</p>
                )}
                {author.bio && (
                  <p className="text-muted-foreground leading-relaxed mt-3 max-w-2xl">
                    {author.bio}
                  </p>
                )}

                {/* E-E-A-T credentials row */}
                <div className="flex flex-wrap gap-3 mt-4">
                  {author.yearsOfExperience && (
                    <div className="flex items-center gap-1.5 text-sm bg-secondary px-3 py-1.5 rounded-full">
                      <Briefcase className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                      <span>{author.yearsOfExperience}+ years experience</span>
                    </div>
                  )}
                  {author.certifications?.map((cert) => (
                    <div key={cert} className="flex items-center gap-1.5 text-sm bg-secondary px-3 py-1.5 rounded-full">
                      <Award className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                      <span>{cert}</span>
                    </div>
                  ))}
                  {author.expertise?.map((area) => (
                    <div key={area} className="flex items-center gap-1.5 text-sm border px-3 py-1.5 rounded-full text-muted-foreground">
                      <Star className="w-3 h-3" aria-hidden="true" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>

                {/* Social links */}
                {author.socialLinks && (
                  <div className="flex gap-3 mt-4">
                    {author.socialLinks.twitter && (
                      <a
                        href={author.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={`${author.name} on Twitter/X`}
                      >
                        <Twitter className="w-4 h-4" aria-hidden="true" />
                        <span>Twitter/X</span>
                      </a>
                    )}
                    {author.socialLinks.linkedin && (
                      <a
                        href={author.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={`${author.name} on LinkedIn`}
                      >
                        <Linkedin className="w-4 h-4" aria-hidden="true" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {author.socialLinks.website && (
                      <a
                        href={author.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={`${author.name}'s website`}
                      >
                        <Globe className="w-4 h-4" aria-hidden="true" />
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex sm:flex-col gap-4 sm:gap-2 sm:text-right flex-shrink-0">
                <div>
                  <p className="text-2xl font-bold">{posts.length}</p>
                  <p className="text-xs text-muted-foreground">Articles</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Articles */}
        <main className="container mx-auto px-4 py-12 max-w-5xl">
          <h2 className="text-xl font-bold mb-6">
            Articles by {author.name}
            <span className="text-muted-foreground font-normal text-base ml-2">({posts.length})</span>
          </h2>

          {posts.length === 0 ? (
            <p className="text-muted-foreground">No articles published yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post: any) => (
                <article
                  key={post._id}
                  className="group border rounded-xl overflow-hidden hover:border-primary hover:shadow-md transition-all flex flex-col"
                >
                  {post.heroImage && (
                    <Link href={`/blog/${post.slug.current}`} className="block relative h-40 overflow-hidden flex-shrink-0">
                      <Image
                        src={urlForImage(post.heroImage).width(500).height(280).url()}
                        alt={post.heroImage.alt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {post.articleType && (
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-background/90 backdrop-blur-sm">
                            {ARTICLE_TYPE_LABELS[post.articleType]}
                          </span>
                        </div>
                      )}
                    </Link>
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <Link href={`/blog/${post.slug.current}`}>
                      <h3 className="font-semibold text-sm leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2 text-balance">
                        {post.title}
                      </h3>
                    </Link>
                    {post.summary && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1 leading-relaxed">
                        {post.summary}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-auto pt-3 border-t text-xs text-muted-foreground">
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
                      {post.estimatedReadTime && (
                        <div className="flex items-center gap-1 ml-auto">
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
