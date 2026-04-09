/**
 * Slug Generation and Utilities
 * 
 * Helper functions for generating and validating SEO-friendly slugs
 */

/**
 * Generate a slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^\w\-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/\-\-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Slugify function for Sanity slug fields
 */
export const slugify = (source: string) => ({
  source,
  slugify: (input: string) => generateSlug(input),
  validation: (Rule: any) =>
    Rule.custom((slug: any) => {
      if (!slug || !slug.current) {
        return 'Slug is required'
      }

      const pattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
      if (!pattern.test(slug.current)) {
        return 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.'
      }

      return true
    }),
})

/**
 * Check if slug is unique across a document type
 */
export async function isSlugUnique(
  slug: string,
  documentType: string,
  documentId?: string,
  client?: any
): Promise<boolean> {
  if (!client) return true

  const query = documentId
    ? `*[_type == $type && slug.current == $slug && _id != $id][0]`
    : `*[_type == $type && slug.current == $slug][0]`

  const params = documentId
    ? { type: documentType, slug, id: documentId }
    : { type: documentType, slug }

  const existing = await client.fetch(query, params)
  return !existing
}

/**
 * Generate unique slug by appending number if needed
 */
export async function generateUniqueSlug(
  baseSlug: string,
  documentType: string,
  client: any,
  documentId?: string
): Promise<string> {
  let slug = baseSlug
  let counter = 1

  while (!(await isSlugUnique(slug, documentType, documentId, client))) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  const pattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return pattern.test(slug)
}

/**
 * Common slug field configuration for Sanity schemas
 */
export const slugField = {
  name: 'slug',
  title: 'Slug',
  type: 'slug',
  description: 'URL-friendly identifier (auto-generated from title)',
  options: {
    source: 'name',
    maxLength: 200,
    slugify: (input: string) => generateSlug(input),
  },
  validation: (Rule: any) =>
    Rule.required().custom((slug: any) => {
      if (!slug || !slug.current) {
        return 'Slug is required'
      }
      if (!isValidSlug(slug.current)) {
        return 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.'
      }
      return true
    }),
}
