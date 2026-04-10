import { client } from './sanity.config'
import type { Tool, Category, Review, FAQ, Comparison, Author, Blog, SiteSettings, Navigation } from './sanity.types'

// ─── SITE SETTINGS (singleton) ───────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch(
    `*[_type == "siteSettings" && _id == "siteSettings"][0]`
  )
}

// ─── NAVIGATION (singleton) ──────────────────────────────────────────────────

export async function getNavigation(): Promise<Navigation | null> {
  return client.fetch(
    `*[_type == "navigation" && _id == "navigation"][0] {
      _id,
      _type,
      title,
      headerItems[] {
        label,
        href,
        openInNewTab,
        isBlogDropdown,
        dropdown[] { label, href, openInNewTab }
      },
      headerCtaEnabled,
      headerCtaLabel,
      headerCtaLink,
      headerCtaStyle,
      footerTagline,
      footerColumns[] {
        heading,
        links[] { label, href, openInNewTab }
      },
      footerBottomLinks[] { label, href, openInNewTab }
    }`
  )
}


// Reusable fragments
const toolFragment = `
  _id,
  _createdAt,
  _updatedAt,
  name,
  slug,
  tagline,
  description,
  logo,
  screenshots,
  website,
  affiliateLink,
  categories[]-> {
    _id,
    name,
    slug
  },
  features,
  pricing,
  rating,
  reviewCount,
  pros,
  cons,
  bestFor,
  integrations,
  freeTrialAvailable,
  freePlanAvailable,
  status,
  publishedAt,
  updatedAt
`

const authorFragment = `
  _id,
  name,
  slug,
  bio,
  role,
  yearsOfExperience,
  certifications,
  image,
  expertise,
  socialLinks
`

// Tool queries
export async function getAllTools(): Promise<Tool[]> {
  return client.fetch(
    `*[_type == "tool" && status == "active"] | order(publishedAt desc) {
      ${toolFragment}
    }`
  )
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  return client.fetch(
    `*[_type == "tool" && slug.current == $slug][0] {
      ${toolFragment},
      alternatives[]-> {
        _id,
        name,
        slug,
        tagline,
        logo,
        rating
      }
    }`,
    { slug }
  )
}

export async function getToolsByCategory(categorySlug: string): Promise<Tool[]> {
  return client.fetch(
    `*[_type == "tool" && $categorySlug in categories[]->slug.current] | order(rating desc) {
      ${toolFragment}
    }`,
    { categorySlug }
  )
}

// Category queries
export async function getAllCategories(): Promise<Category[]> {
  return client.fetch(
    `*[_type == "category"] | order(coalesce(order, 99) asc, name asc) {
      _id,
      name,
      slug,
      description,
      icon,
      showInNav,
      order
    }`
  )
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return client.fetch(
    `*[_type == "category" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      description,
      icon
    }`,
    { slug }
  )
}

// Review queries
export async function getAllReviews(): Promise<Review[]> {
  return client.fetch(
    `*[_type == "review"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      tool-> {
        _id,
        name,
        slug,
        logo
      },
      author-> {
        ${authorFragment}
      },
      rating,
      publishedAt
    }`
  )
}

export async function getReviewBySlug(slug: string): Promise<Review | null> {
  return client.fetch(
    `*[_type == "review" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      tool-> {
        ${toolFragment}
      },
      author-> {
        ${authorFragment}
      },
      content,
      rating,
      pros,
      cons,
      verdict,
      publishedAt,
      updatedAt
    }`,
    { slug }
  )
}

// FAQ queries
export async function getFAQsByTool(toolId: string): Promise<FAQ[]> {
  return client.fetch(
    `*[_type == "faq" && tool._ref == $toolId] | order(order asc) {
      _id,
      question,
      answer,
      order
    }`,
    { toolId }
  )
}

// Comparison queries
export async function getComparisonBySlug(slug: string): Promise<Comparison | null> {
  return client.fetch(
    `*[_type == "comparison" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      tools[]-> {
        ${toolFragment}
      },
      author-> {
        ${authorFragment}
      },
      content,
      comparisonTable,
      verdict,
      publishedAt
    }`,
    { slug }
  )
}

// Get all tool slugs for sitemap generation
export async function getAllToolSlugs(): Promise<string[]> {
  const tools = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "tool" && defined(slug.current)] {
      "slug": slug
    }`
  )
  return tools.map((tool) => tool.slug.current)
}

// Get all review slugs for sitemap generation
export async function getAllReviewSlugs(): Promise<string[]> {
  const reviews = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "review" && defined(slug.current)] {
      "slug": slug
    }`
  )
  return reviews.map((review) => review.slug.current)
}

// Get all category slugs for sitemap generation
export async function getAllCategorySlugs(): Promise<string[]> {
  const categories = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "category" && defined(slug.current)] {
      "slug": slug
    }`
  )
  return categories.map((category) => category.slug.current)
}

// Get all comparison slugs for sitemap generation
export async function getAllComparisonSlugs(): Promise<string[]> {
  const comparisons = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "comparison" && defined(slug.current)] {
      "slug": slug
    }`
  )
  return comparisons.map((comparison) => comparison.slug.current)
}

// ─── BLOG QUERIES ──────────────────────────────────────────────────────────

const blogListFragment = `
  _id,
  _createdAt,
  _updatedAt,
  title,
  slug,
  articleType,
  summary,
  publishedAt,
  updatedAt,
  estimatedReadTime,
  heroImage,
  affiliateDisclosure,
  primaryAffiliateLink,
  affiliateButtonLabel,
  promoCode,
  verdictBox,
  keyPoints,
  author-> {
    _id,
    name,
    slug,
    role,
    yearsOfExperience,
    certifications,
    expertise,
    image,
    bio,
    socialLinks
  },
  categories[]-> {
    _id,
    name,
    slug,
    icon
  },
  targetAudience
`

const blogFullFragment = `
  ${blogListFragment},
  introduction,
  contentSections[] {
    heading,
    content
  },
  faqs,
  toolsCompared[] {
    tool-> {
      _id,
      name,
      slug,
      logo,
      website,
      rating
    },
    rating,
    verdict,
    pros,
    cons,
    pricingLastVerified,
    affiliateLink,
    promoCode
  },
  dataSources,
  relatedResources,
  secondaryAffiliateLinks,
  gallery,
  youtubeUrl,
  videoTitle,
  videoDescription,
  metaTitle,
  metaDescription,
  focusKeyword,
  targetKeywords,
  reviewFrequency,
  nextReviewDate,
  relatedArticles[]-> {
    _id,
    title,
    slug,
    summary,
    heroImage,
    publishedAt,
    articleType,
    author-> { _id, name, slug, role, image },
    categories[]-> { _id, name, slug }
  }
`

export async function getAllBlogPosts(): Promise<Blog[]> {
  return client.fetch(
    `*[_type == "blog"] | order(publishedAt desc) {
      ${blogListFragment}
    }`
  )
}

export async function getBlogPostBySlug(slug: string): Promise<Blog | null> {
  return client.fetch(
    `*[_type == "blog" && slug.current == $slug][0] {
      ${blogFullFragment}
    }`,
    { slug }
  )
}

export async function getBlogPostsByCategory(categorySlug: string): Promise<Blog[]> {
  return client.fetch(
    `*[_type == "blog" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
      ${blogListFragment}
    }`,
    { categorySlug }
  )
}

export async function getFeaturedBlogPosts(limit: number = 6): Promise<Blog[]> {
  return client.fetch(
    `*[_type == "blog"] | order(publishedAt desc)[0...$limit] {
      ${blogListFragment}
    }`,
    { limit }
  )
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const posts = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "blog" && defined(slug.current)] {
      "slug": slug
    }`
  )
  return posts.map((post) => post.slug.current)
}

export async function getBlogPostsByArticleType(articleType: string): Promise<Blog[]> {
  return client.fetch(
    `*[_type == "blog" && articleType == $articleType] | order(publishedAt desc) {
      ${blogListFragment}
    }`,
    { articleType }
  )
}

// ─── AUTHOR QUERIES ────────────────────────────────────────────────────────

export async function getAllAuthorSlugs(): Promise<string[]> {
  const authors = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "author" && defined(slug.current)] { "slug": slug }`
  )
  return authors.map((a) => a.slug.current)
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  return client.fetch(
    `*[_type == "author" && slug.current == $slug][0] {
      ${authorFragment}
    }`,
    { slug }
  )
}

export async function getBlogPostsByAuthor(authorSlug: string): Promise<Blog[]> {
  return client.fetch(
    `*[_type == "blog" && author->slug.current == $authorSlug] | order(publishedAt desc) {
      ${blogListFragment}
    }`,
    { authorSlug }
  )
}

// Get all authors for sitemap / listing
export async function getAllAuthors(): Promise<Author[]> {
  return client.fetch(
    `*[_type == "author"] | order(name asc) {
      ${authorFragment}
    }`
  )
}
