export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
}

export interface Category {
  _id: string
  _type: 'category'
  _createdAt: string
  _updatedAt: string
  name: string
  slug: {
    current: string
  }
  description?: string
  icon?: string
}

export interface Author {
  _id: string
  _type: 'author'
  _createdAt: string
  _updatedAt: string
  name: string
  slug: {
    current: string
  }
  bio?: string
  image?: SanityImage
  expertise?: string[]
  socialLinks?: {
    twitter?: string
    linkedin?: string
    website?: string
  }
}

export interface PricingTier {
  name: string
  price?: string
  billingPeriod?: 'month' | 'year' | 'one-time'
  features?: string[]
}

export interface Tool {
  _id: string
  _type: 'tool'
  _createdAt: string
  _updatedAt: string
  name: string
  slug: {
    current: string
  }
  tagline?: string
  description?: string
  logo?: SanityImage
  screenshots?: SanityImage[]
  website?: string
  affiliateLink?: string
  categories?: Category[]
  features?: string[]
  pricing?: PricingTier[]
  rating?: number
  reviewCount?: number
  pros?: string[]
  cons?: string[]
  bestFor?: string[]
  alternatives?: Tool[]
  integrations?: string[]
  freeTrialAvailable?: boolean
  freePlanAvailable?: boolean
  status?: 'active' | 'discontinued' | 'beta'
  publishedAt?: string
  updatedAt?: string
}

export interface Review {
  _id: string
  _type: 'review'
  _createdAt: string
  _updatedAt: string
  title: string
  slug: {
    current: string
  }
  tool: Tool
  author: Author
  content: any // Portable Text
  rating: number
  pros?: string[]
  cons?: string[]
  verdict?: string
  publishedAt?: string
  updatedAt?: string
}

export interface FAQ {
  _id: string
  _type: 'faq'
  question: string
  answer: any // Portable Text
  tool?: Tool
  category?: Category
  order?: number
}

export interface Comparison {
  _id: string
  _type: 'comparison'
  _createdAt: string
  _updatedAt: string
  title: string
  slug: {
    current: string
  }
  tools: Tool[]
  author: Author
  content: any // Portable Text
  comparisonTable?: {
    feature: string
    tool1Value?: string
    tool2Value?: string
  }[]
  verdict?: string
  publishedAt?: string
}

export interface BlogVerdictBox {
  summary: string
  rating?: number
  recommendation?: 'highly-recommended' | 'recommended' | 'conditional' | 'not-recommended'
  verdictChanged?: boolean
  verdictChangedDate?: string
}

export interface BlogToolCompared {
  tool: Tool
  rating?: number
  verdict?: string
  pros?: string[]
  cons?: string[]
  pricingLastVerified?: string
  affiliateLink?: string
  promoCode?: string
}

export interface BlogFAQ {
  question: string
  answer: string
}

export interface BlogAffiliateLink {
  label: string
  url: string
  promoCode?: string
}

export interface BlogExternalSource {
  title: string
  url: string
}

export interface Blog {
  _id: string
  _type: 'blog'
  _createdAt: string
  _updatedAt: string
  title: string
  slug: {
    current: string
  }
  articleType: 'review' | 'comparison' | 'best-of' | 'tutorial' | 'news' | 'opinion'
  author: Author
  categories: Category[]
  excerpt: string
  body: any // Portable Text
  publishedAt: string
  updatedAt?: string
  nextReviewDate?: string
  // AEO fields
  verdictBox?: BlogVerdictBox
  keyPoints?: { point: string }[]
  faqs?: BlogFAQ[]
  toolsCompared?: BlogToolCompared[]
  // Affiliate fields
  primaryAffiliateLink?: string
  affiliateButtonLabel?: string
  secondaryAffiliateLinks?: BlogAffiliateLink[]
  promoCode?: string
  affiliateDisclosure?: boolean
  // Media fields
  heroImage?: SanityImage
  gallery?: SanityImage[]
  youtubeUrl?: string
  videoTitle?: string
  videoDescription?: string
  // SEO fields
  metaTitle?: string
  metaDescription?: string
  focusKeyword?: string
  relatedArticles?: Blog[]
  externalSources?: BlogExternalSource[]
}
