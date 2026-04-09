import { client } from './sanity.config'
import type { Tool, Category, Review, FAQ, Comparison, Author } from './sanity.types'

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
    `*[_type == "category"] | order(name asc) {
      _id,
      name,
      slug,
      description,
      icon
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
