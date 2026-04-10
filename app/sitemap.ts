import type { MetadataRoute } from 'next'
import {
  getAllBlogPosts,
  getAllTools,
  getAllAuthors,
  getAllCategorySlugs,
  getAllReviewSlugs,
  getAllComparisonSlugs,
} from '@/lib/sanity.queries'

export const revalidate = 3600

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.tech'

function toDate(val?: string | null): Date {
  if (!val) return new Date()
  const d = new Date(val)
  return isNaN(d.getTime()) ? new Date() : d
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

  try {
    const [blogPosts, tools, authors, categorySlugs, reviewSlugs, comparisonSlugs] =
      await Promise.all([
        getAllBlogPosts().catch(() => []),
        getAllTools().catch(() => []),
        getAllAuthors().catch(() => []),
        getAllCategorySlugs().catch(() => []),
        getAllReviewSlugs().catch(() => []),
        getAllComparisonSlugs().catch(() => []),
      ])

    const blogPages: MetadataRoute.Sitemap = blogPosts.map((post: any) => ({
      url: `${siteUrl}/blog/${post.slug.current}`,
      lastModified: toDate(post.updatedAt || post.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    const categoryPages: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
      url: `${siteUrl}/blog/category/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    const toolPages: MetadataRoute.Sitemap = tools.map((tool: any) => ({
      url: `${siteUrl}/tools/${tool.slug.current}`,
      lastModified: toDate(tool.updatedAt || tool.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    const authorPages: MetadataRoute.Sitemap = authors.map((author: any) => ({
      url: `${siteUrl}/author/${author.slug.current}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    const reviewPages: MetadataRoute.Sitemap = reviewSlugs.map((slug) => ({
      url: `${siteUrl}/reviews/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    const comparisonPages: MetadataRoute.Sitemap = comparisonSlugs.map((slug) => ({
      url: `${siteUrl}/comparisons/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [
      ...staticPages,
      ...blogPages,
      ...categoryPages,
      ...toolPages,
      ...authorPages,
      ...reviewPages,
      ...comparisonPages,
    ]
  } catch (error) {
    return staticPages
  }
}
