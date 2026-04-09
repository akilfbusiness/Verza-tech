import imageUrlBuilder from '@sanity/image-url'
import { client } from './sanity.config'
import type { SanityImage } from './sanity.types'

const builder = imageUrlBuilder(client)

export function urlForImage(source: SanityImage) {
  return builder.image(source).auto('format').fit('max')
}

export function urlForImageWithDimensions(source: SanityImage, width: number, height?: number) {
  const imageBuilder = builder.image(source).auto('format').fit('max').width(width)
  
  if (height) {
    return imageBuilder.height(height)
  }
  
  return imageBuilder
}
