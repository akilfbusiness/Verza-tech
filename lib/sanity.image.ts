import imageUrlBuilder from '@sanity/image-url'
import { client } from './sanity.config'
import type { SanityImage } from './sanity.types'

const builder = imageUrlBuilder(client)

// Validates that a heroImage has a real Sanity asset _ref before building a URL.
// Sanity asset _refs follow the pattern: image-<hash>-<width>x<height>-<ext>
// Placeholder values like IMAGE_ASSET_ID or BLOG_ID_HERE will fail this check.
function isValidSanityImageRef(source: SanityImage | null | undefined): boolean {
  if (!source) return false
  const ref = source?.asset?._ref
  if (!ref) return false
  // Must start with "image-" and match the expected Sanity asset ID format
  return /^image-[a-zA-Z0-9]+-\d+x\d+-[a-zA-Z0-9]+$/.test(ref)
}

export function urlForImage(source: SanityImage) {
  return builder.image(source).auto('format').fit('max')
}

// Safe version — returns null instead of throwing if the image ref is a placeholder or malformed.
// Use this anywhere a bad ref could crash a prerender (blog listing pages, OG image generation, etc.)
export function urlForImageSafe(source: SanityImage | null | undefined): string | null {
  if (!isValidSanityImageRef(source)) return null
  try {
    return builder.image(source!).auto('format').fit('max').url()
  } catch {
    return null
  }
}

export function urlForImageWithDimensions(source: SanityImage, width: number, height?: number) {
  const imageBuilder = builder.image(source).auto('format').fit('max').width(width)
  
  if (height) {
    return imageBuilder.height(height)
  }
  
  return imageBuilder
}
