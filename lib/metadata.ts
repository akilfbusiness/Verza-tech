import { Metadata } from 'next'

const SITE_NAME = 'Verza'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.com'
const CURRENT_YEAR = '2026'

interface OpenGraphImage {
  url: string
  width: number
  height: number
  alt: string
}

interface MetadataConfig {
  title: string
  description: string
  keywords?: string[]
  path: string
  images?: OpenGraphImage[]
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
}

export function generateSEOMetadata(config: MetadataConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    path,
    images = [],
    type = 'website',
    publishedTime,
    modifiedTime,
    authors = [],
  } = config

  const url = `${SITE_URL}${path}`
  const fullTitle = `${title} | ${SITE_NAME}`

  return {
    title: fullTitle,
    description,
    keywords: [...keywords, 'SaaS tools', 'AI tools', 'software reviews'],
    alternates: {
      canonical: url,
    },
    authors: authors.map(name => ({ name })),
    openGraph: {
      title,
      description,
      type,
      url,
      siteName: SITE_NAME,
      locale: 'en_AU',
      publishedTime,
      modifiedTime,
      images: images.length > 0 ? images : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.length > 0 ? images.map(img => img.url) : undefined,
    },
  }
}

export function generateOGImageUrl(params: {
  title: string
  subtitle?: string
  rating?: number
}): string {
  const ogUrl = new URL('/api/og', SITE_URL)
  ogUrl.searchParams.set('title', params.title)
  if (params.subtitle) {
    ogUrl.searchParams.set('subtitle', params.subtitle)
  }
  if (params.rating) {
    ogUrl.searchParams.set('rating', params.rating.toString())
  }
  return ogUrl.toString()
}

export function generateToolTitle(toolName: string): string {
  return `${toolName} Review ${CURRENT_YEAR} - Features, Pricing & Alternatives`
}

export function generateReviewTitle(reviewTitle: string, toolName?: string): string {
  if (toolName) {
    return `${reviewTitle} | ${toolName} Review ${CURRENT_YEAR}`
  }
  return `${reviewTitle} | ${CURRENT_YEAR}`
}

export function generateCategoryTitle(categoryName: string): string {
  return `Best ${categoryName} Tools ${CURRENT_YEAR} - Reviews & Comparisons`
}

export function optimizeDescription(description: string, maxLength: number = 155): string {
  if (description.length <= maxLength) {
    return description
  }
  
  // Find the last complete sentence within the limit
  const truncated = description.substring(0, maxLength)
  const lastPeriod = truncated.lastIndexOf('.')
  
  if (lastPeriod > maxLength * 0.7) {
    return description.substring(0, lastPeriod + 1)
  }
  
  // Otherwise truncate at word boundary
  const lastSpace = truncated.lastIndexOf(' ')
  return truncated.substring(0, lastSpace) + '...'
}
