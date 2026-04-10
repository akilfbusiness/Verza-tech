import type { MetadataRoute } from 'next'
import {
  getAllToolSlugs,
  getAllReviewSlugs,
  getAllCategorySlugs,
  getAllComparisonSlugs,
  getAllBlogSlugs,
} from '@/lib/sanity.queries'

export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  try {
    // Dynamic pages from Sanity
    const [toolSlugs, reviewSlugs, categorySlugs, comparisonSlugs, blogSlugs] = await Promise.all([
      getAllToolSlugs(),
      getAllReviewSlugs(),
      getAllCategorySlugs(),
      getAllComparisonSlugs(),
      getAllBlogSlugs(),
    ])

    const toolPages: MetadataRoute.Sitemap = toolSlugs.map((slug) => ({
      url: `${siteUrl}/tools/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    const reviewPages: MetadataRoute.Sitemap = reviewSlugs.map((slug) => ({
      url: `${siteUrl}/reviews/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    const categoryPages: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
      url: `${siteUrl}/categories/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    const comparisonPages: MetadataRoute.Sitemap = comparisonSlugs.map((slug) => ({
      url: `${siteUrl}/compare/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

    const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
      url: `${siteUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [...staticPages, ...toolPages, ...blogPages, ...reviewPages, ...categoryPages, ...comparisonPages]
  } catch (error) {
    console.error('[v0] Error generating sitemap:', error)
    // Return at least static pages if Sanity fetch fails
    return staticPages
  }
}
