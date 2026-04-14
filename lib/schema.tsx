import { Tool, Review, Author, FAQ, Category } from './sanity.types'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.tech'

// Organization Schema - Used site-wide
export function generateOrganizationSchema(siteSettings?: {
  socialLinks?: {
    twitter?: string
    linkedin?: string
    youtube?: string
    instagram?: string
    facebook?: string
    tiktok?: string
  }
  contactEmail?: string
} | null) {
  const sameAs: string[] = []
  if (siteSettings?.socialLinks?.twitter)   sameAs.push(siteSettings.socialLinks.twitter)
  if (siteSettings?.socialLinks?.linkedin)  sameAs.push(siteSettings.socialLinks.linkedin)
  if (siteSettings?.socialLinks?.youtube)   sameAs.push(siteSettings.socialLinks.youtube)
  if (siteSettings?.socialLinks?.instagram) sameAs.push(siteSettings.socialLinks.instagram)
  if (siteSettings?.socialLinks?.facebook)  sameAs.push(siteSettings.socialLinks.facebook)

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'Verza',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo.png`,
      width: 200,
      height: 60,
    },
    description: 'Independent SaaS and AI tool reviews, comparisons, and recommendations to help businesses choose the right software.',
    inLanguage: 'en',
    areaServed: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'Australia' },
      { '@type': 'Country', name: 'Canada' },
      { '@type': 'AdministrativeArea', name: 'Global' },
    ],
    ...(sameAs.length > 0 && { sameAs }),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      url: `${siteUrl}/contact`,
      ...(siteSettings?.contactEmail && { email: siteSettings.contactEmail }),
      availableLanguage: 'English',
    },
  }
}

// WebPage Schema for generic pages
export function generateWebPageSchema(title: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    isPartOf: { '@type': 'WebSite', name: 'Verza', url: siteUrl },
  }
}

// Website Schema with SearchAction
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: 'Verza',
    url: siteUrl,
    inLanguage: 'en',
    description: 'Independent SaaS and AI tool reviews, comparisons, and how-to guides.',
    publisher: { '@id': `${siteUrl}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/tools?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

// BreadcrumbList Schema
export function generateBreadcrumbSchema(items: { name: string; url?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  }
}

// SoftwareApplication Schema for Tool pages
export function generateSoftwareApplicationSchema(tool: Tool) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    url: tool.website || `${siteUrl}/tools/${tool.slug.current}`,
    description: tool.description || tool.tagline,
    applicationCategory: tool.categories?.[0]?.name || 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
  }

  // Add rating if available
  if (tool.rating && tool.reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: tool.rating,
      ratingCount: tool.reviewCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  // Add offers/pricing if available (supporting both USD and AUD)
  if (tool.pricing && tool.pricing.length > 0) {
    schema.offers = tool.pricing.map((tier) => ({
      '@type': 'Offer',
      name: tier.name,
      price: tier.price || '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      ...(tier.billingPeriod && {
        priceValidUntil: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ).toISOString(),
      }),
    }))
  }

  // Add screenshot if available
  if (tool.screenshots && tool.screenshots.length > 0) {
    schema.screenshot = `${siteUrl}/api/og?title=${encodeURIComponent(tool.name)}`
  }

  // Add features
  if (tool.features && tool.features.length > 0) {
    schema.featureList = tool.features
  }

  return schema
}

// Review Schema
export function generateReviewSchema(review: Review) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'SoftwareApplication',
      name: review.tool?.name || 'Unknown Tool',
      url: review.tool?.website || '',
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    name: review.title,
    reviewBody: review.verdict || '',
    datePublished: review.publishedAt,
    ...(review.updatedAt && { dateModified: review.updatedAt }),
  }

  // Add author information
  if (review.author) {
    schema.author = generatePersonSchema(review.author)
  }

  // Add publisher (Verza)
  schema.publisher = {
    '@type': 'Organization',
    name: 'Verza',
    url: siteUrl,
  }

  return schema
}

// Person Schema for authors
export function generatePersonSchema(author: Author) {
  const schema: any = {
    '@type': 'Person',
    name: author.name,
    url: `${siteUrl}/author/${author.slug.current}`,
  }

  if (author.bio) {
    schema.description = author.bio
  }

  if (author.image) {
    schema.image = `${siteUrl}/api/og?title=${encodeURIComponent(author.name)}`
  }

  if (author.socialLinks) {
    const sameAs = []
    if (author.socialLinks.twitter) sameAs.push(author.socialLinks.twitter)
    if (author.socialLinks.linkedin) sameAs.push(author.socialLinks.linkedin)
    if (author.socialLinks.website) sameAs.push(author.socialLinks.website)
    if (sameAs.length > 0) {
      schema.sameAs = sameAs
    }
  }

  if (author.expertise && author.expertise.length > 0) {
    schema.jobTitle = author.expertise[0]
  }

  return schema
}

// FAQPage Schema
export function generateFAQPageSchema(faqs: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: typeof faq.answer === 'string' ? faq.answer : 'Answer available on page',
      },
    })),
  }
}

// ItemList Schema for tool listings
export function generateItemListSchema(tools: Tool[], listName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: tool.name,
        url: `${siteUrl}/tools/${tool.slug.current}`,
        description: tool.tagline || tool.description,
        ...(tool.rating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: tool.rating,
            bestRating: 5,
          },
        }),
      },
    })),
  }
}

// Article Schema for review pages (additional to Review schema)
export function generateArticleSchema(review: Review) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: review.title,
    description: review.verdict || '',
    url: `${siteUrl}/reviews/${review.slug.current}`,
    datePublished: review.publishedAt,
    ...(review.updatedAt && { dateModified: review.updatedAt }),
    image: `${siteUrl}/api/og?title=${encodeURIComponent(review.title)}`,
  }

  if (review.author) {
    schema.author = generatePersonSchema(review.author)
  }

  schema.publisher = {
    '@type': 'Organization',
    name: 'Verza',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo.png`,
    },
  }

  return schema
}

// Speakable Schema — marks content suitable for audio playback (Google Assistant, voice search)
export function generateSpeakableSchema(pageUrl: string, cssSelectors: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': pageUrl,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: cssSelectors,
    },
    url: pageUrl,
  }
}

// HowTo Schema — generated from howToBlock content sections
export function generateHowToSchema(
  name: string,
  description: string,
  steps: { heading: string; text?: string }[],
  url: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    url,
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.heading,
      text: step.text || step.heading,
    })),
  }
}

// Helper to render JSON-LD script tag
export function renderJsonLd(data: any) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data, null, 2) }}
    />
  )
}
