/**
 * Sanity Validation Utilities
 * 
 * Custom validation rules for Sanity schemas
 */

// Slug validation - ensures SEO-friendly slugs
export const slugValidation = (Rule: any) =>
  Rule.custom((slug: any) => {
    if (!slug || !slug.current) {
      return 'Slug is required'
    }

    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!slugPattern.test(slug.current)) {
      return 'Slug must be lowercase, use hyphens for spaces, and contain only letters, numbers, and hyphens'
    }

    if (slug.current.length < 3) {
      return 'Slug must be at least 3 characters long'
    }

    if (slug.current.length > 200) {
      return 'Slug must be less than 200 characters'
    }

    return true
  })

// URL validation
export const urlValidation = (Rule: any) =>
  Rule.uri({
    scheme: ['http', 'https'],
  }).custom((url: string) => {
    if (!url) return true // Optional field

    try {
      const urlObj = new URL(url)
      if (!urlObj.protocol || !urlObj.hostname) {
        return 'Invalid URL format'
      }
      return true
    } catch {
      return 'Invalid URL format'
    }
  })

// Email validation
export const emailValidation = (Rule: any) =>
  Rule.regex(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    'Must be a valid email address'
  )

// Rating validation (0-5 scale)
export const ratingValidation = (Rule: any) =>
  Rule.min(0)
    .max(5)
    .precision(1)
    .custom((rating: number) => {
      if (rating < 0 || rating > 5) {
        return 'Rating must be between 0 and 5'
      }
      if (rating % 0.5 !== 0) {
        return 'Rating must be in increments of 0.5'
      }
      return true
    })

// Price validation (non-negative)
export const priceValidation = (Rule: any) =>
  Rule.min(0).custom((price: number) => {
    if (price < 0) {
      return 'Price cannot be negative'
    }
    return true
  })

// Array min/max validation
export const arrayMinValidation = (min: number) => (Rule: any) =>
  Rule.min(min).error(`Must have at least ${min} item${min > 1 ? 's' : ''}`)

export const arrayMaxValidation = (max: number) => (Rule: any) =>
  Rule.max(max).warning(`Should have at most ${max} item${max > 1 ? 's' : ''}`)

// Text length validation
export const textLengthValidation = (min: number, max: number) => (Rule: any) =>
  Rule.min(min)
    .max(max)
    .custom((text: string) => {
      if (!text) return true // Handle optional fields
      const length = text.length
      if (length < min) {
        return `Must be at least ${min} characters (currently ${length})`
      }
      if (length > max) {
        return `Must be less than ${max} characters (currently ${length})`
      }
      return true
    })

// SEO title validation (optimal length for search results)
export const seoTitleValidation = (Rule: any) =>
  Rule.min(30)
    .max(60)
    .warning(
      'For best SEO, titles should be between 30-60 characters (displayed in search results)'
    )

// SEO description validation (optimal length for search results)
export const seoDescriptionValidation = (Rule: any) =>
  Rule.min(120)
    .max(160)
    .warning(
      'For best SEO, descriptions should be between 120-160 characters (displayed in search results)'
    )

// Portable Text validation
export const portableTextValidation = (minBlocks: number = 1) => (Rule: any) =>
  Rule.custom((blocks: any[]) => {
    if (!blocks || blocks.length < minBlocks) {
      return `Content must have at least ${minBlocks} block${
        minBlocks > 1 ? 's' : ''
      }`
    }

    // Check if content has meaningful text
    const hasText = blocks.some((block: any) => {
      if (block._type !== 'block') return true
      return block.children?.some((child: any) => child.text?.trim().length > 0)
    })

    if (!hasText) {
      return 'Content cannot be empty'
    }

    return true
  })

// Date validation - ensure not in future
export const pastDateValidation = (Rule: any) =>
  Rule.custom((date: string) => {
    if (!date) return true
    const dateObj = new Date(date)
    const now = new Date()
    if (dateObj > now) {
      return 'Date cannot be in the future'
    }
    return true
  })

// Custom error messages
export const required = (fieldName: string) => (Rule: any) =>
  Rule.required().error(`${fieldName} is required`)
