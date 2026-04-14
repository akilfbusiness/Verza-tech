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
  slug: { current: string }
  description?: string
  icon?: string
  showInNav?: boolean
  order?: number
}

export interface Author {
  _id: string
  _type: 'author'
  _createdAt: string
  _updatedAt: string
  name: string
  slug: { current: string }
  bio?: string
  role?: string
  yearsOfExperience?: number
  certifications?: string[]
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

export interface BlogKeyPoint {
  question?: string
  quickAnswer: string
  fullExplanation?: string
}

export interface BlogFAQ {
  question: string
  quickAnswer: string
  fullAnswer?: string
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

export interface BlogAffiliateLink {
  label: string
  url: string
  promoCode?: string
}

export interface BlogDataSource {
  title: string
  url: string
}

export interface BlogRelatedResource {
  title: string
  url: string
  description?: string
  resourceType?: 'internal' | 'external' | 'government' | 'research' | 'tool'
}

export interface BlogContentSection {
  heading: string
  sectionAnswerCapsule?: string
  content: any // Portable Text
}

export interface DecisionFrameworkStep {
  stepTitle: string
  stepDescription: string
}

export interface DecisionFramework {
  frameworkName?: string
  steps?: DecisionFrameworkStep[]
}

// ─── SITE SETTINGS ──────────────────────────────────────────────────────────

export interface SiteStat {
  value: string
  label: string
}

export interface SiteSettings {
  _id: string
  _type: 'siteSettings'
  siteName: string
  tagline?: string
  logo?: SanityImage
  // Hero
  heroHeadline?: string
  heroSubheadline?: string
  heroPrimaryCtaLabel?: string
  heroPrimaryCtaLink?: string
  heroSecondaryCtaLabel?: string
  heroSecondaryCtaLink?: string
  // Stats bar
  statsEnabled?: boolean
  stats?: SiteStat[]
  // Homepage section toggles
  showCategoriesSection?: boolean
  categoriesSectionHeading?: string
  categoriesSectionSubheading?: string
  showFeaturedToolsSection?: boolean
  featuredToolsHeading?: string
  featuredToolsSubheading?: string
  // Bottom CTA
  bottomCtaHeading?: string
  bottomCtaBody?: string
  bottomCtaButtonLabel?: string
  bottomCtaButtonLink?: string
  // Contact + social
  contactEmail?: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    youtube?: string
    instagram?: string
    facebook?: string
    tiktok?: string
  }
  // Legal + trust
  affiliateDisclosureText?: string
  cookieBannerText?: string
  copyrightText?: string
  // SEO
  defaultMetaDescription?: string
  defaultOgImage?: SanityImage
}

// ─── NAVIGATION ─────────────────────────────────────────────────────────────

export interface NavLink {
  label: string
  href: string
  openInNewTab?: boolean
}

export interface NavItem {
  label: string
  href?: string
  openInNewTab?: boolean
  isBlogDropdown?: boolean
  dropdown?: NavLink[]
}

export interface FooterColumn {
  heading: string
  links: NavLink[]
}

export interface Navigation {
  _id: string
  _type: 'navigation'
  title?: string
  // Header
  headerItems?: NavItem[]
  headerCtaEnabled?: boolean
  headerCtaLabel?: string
  headerCtaLink?: string
  headerCtaStyle?: 'primary' | 'outline' | 'ghost'
  // Footer
  footerTagline?: string
  footerColumns?: FooterColumn[]
  footerBottomLinks?: NavLink[]
}

export interface Blog {
  _id: string
  _type: 'blog'
  _createdAt: string
  _updatedAt: string
  title: string
  slug: { current: string }
  articleType: 'review' | 'comparison' | 'best-of' | 'tutorial' | 'news' | 'opinion'
  categories: Category[]
  targetAudience?: string[]
  summary: string
  articleAnswerCapsule?: string
  introduction: string
  contentSections?: BlogContentSection[]
  // Authorship (referenced Author document)
  author?: Author
  estimatedReadTime?: number
  publishedAt: string
  updatedAt?: string
  reviewFrequency?: 'monthly' | 'quarterly' | 'bi-annually' | 'annually'
  nextReviewDate?: string
  // AEO fields
  decisionFramework?: DecisionFramework
  dataProvenance?: string
  verdictBox?: BlogVerdictBox
  keyPoints?: BlogKeyPoint[]
  faqs?: BlogFAQ[]
  toolsCompared?: BlogToolCompared[]
  dataSources?: BlogDataSource[]
  relatedResources?: BlogRelatedResource[]
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
  targetKeywords?: string[]
  relatedArticles?: Blog[]
}
