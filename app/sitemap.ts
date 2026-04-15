import type { MetadataRoute } from 'next'
import { client } from '@/lib/sanity.config'

export const revalidate = 3600

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.tech'

function toDate(val?: string | null): Date {
  if (!val) return new Date()
  const d = new Date(val)
  return isNaN(d.getTime()) ? new Date() : d
}

// Lightweight slug + date queries — only fetch what the sitemap needs, nothing more.
// Each query is independent so one failure never blocks the others.

async function getBlogSlugs() {
  return client.fetch<{ slug: string; updatedAt?: string; publishedAt?: string }[]>(
    `*[_type == "blog" && defined(slug.current)] | order(publishedAt desc) {
      "slug": slug.current,
      updatedAt,
      publishedAt
    }`
  ).catch(() => [])
}

async function getToolSlugs() {
  return client.fetch<{ slug: string; updatedAt?: string; publishedAt?: string }[]>(
    `*[_type == "tool" && defined(slug.current)] | order(publishedAt desc) {
      "slug": slug.current,
      updatedAt,
      publishedAt
    }`
  ).catch(() => [])
}

async function getReviewSlugs() {
  return client.fetch<{ slug: string; updatedAt?: string; publishedAt?: string }[]>(
    `*[_type == "review" && defined(slug.current)] | order(publishedAt desc) {
      "slug": slug.current,
      updatedAt,
      publishedAt
    }`
  ).catch(() => [])
}

async function getComparisonSlugs() {
  return client.fetch<{ slug: string; updatedAt?: string; publishedAt?: string }[]>(
    `*[_type == "comparison" && defined(slug.current)] | order(publishedAt desc) {
      "slug": slug.current,
      updatedAt,
      publishedAt
    }`
  ).catch(() => [])
}

async function getCategorySlugs() {
  return client.fetch<{ slug: string }[]>(
    `*[_type == "category" && defined(slug.current)] | order(name asc) {
      "slug": slug.current
    }`
  ).catch(() => [])
}

async function getAuthorSlugs() {
  return client.fetch<{ slug: string }[]>(
    `*[_type == "author" && defined(slug.current)] | order(name asc) {
      "slug": slug.current
    }`
  ).catch(() => [])
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl,                  lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${siteUrl}/blog`,        lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${siteUrl}/tools`,       lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${siteUrl}/reviews`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${siteUrl}/comparisons`, lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${siteUrl}/about`,       lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/contact`,     lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  // Fetch all content types in parallel — each has its own catch so one failure never blocks the rest
  const [blogPosts, tools, reviews, comparisons, categories, authors] = await Promise.all([
    getBlogSlugs(),
    getToolSlugs(),
    getReviewSlugs(),
    getComparisonSlugs(),
    getCategorySlugs(),
    getAuthorSlugs(),
  ])

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: toDate(post.updatedAt || post.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteUrl}/tools/${tool.slug}`,
    lastModified: toDate(tool.updatedAt || tool.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const reviewPages: MetadataRoute.Sitemap = reviews.map((review) => ({
    url: `${siteUrl}/reviews/${review.slug}`,
    lastModified: toDate(review.updatedAt || review.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const comparisonPages: MetadataRoute.Sitemap = comparisons.map((comparison) => ({
    url: `${siteUrl}/comparisons/${comparison.slug}`,
    lastModified: toDate(comparison.updatedAt || comparison.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${siteUrl}/blog/category/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const authorPages: MetadataRoute.Sitemap = authors.map((author) => ({
    url: `${siteUrl}/author/${author.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [
    ...staticPages,
    ...blogPages,
    ...toolPages,
    ...reviewPages,
    ...comparisonPages,
    ...categoryPages,
    ...authorPages,
  ]
}
