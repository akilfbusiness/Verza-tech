/**
 * Sanity Schema Export
 * 
 * These schemas define your content structure in Sanity Studio.
 * 
 * To use these schemas in your Sanity Studio:
 * 1. Create a Sanity Studio project: npx sanity init
 * 2. Copy all schema files to your studio/schemas directory
 * 3. Import this file in your studio configuration
 * 
 * Example sanity.config.ts:
 * 
 * import { defineConfig } from 'sanity'
 * import { structureTool } from 'sanity/structure'
 * import { visionTool } from '@sanity/vision'
 * import { schemaTypes } from './schemas'
 * 
 * export default defineConfig({
 *   name: 'verza',
 *   title: 'Verza',
 *   projectId: 'your-project-id',
 *   dataset: 'production',
 *   plugins: [structureTool(), visionTool()],
 *   schema: {
 *     types: schemaTypes,
 *   },
 * })
 */

export { toolSchema } from './tool.schema'
export { categorySchema } from './category.schema'
export { authorSchema } from './author.schema'
export { reviewSchema } from './review.schema'
export { faqSchema } from './faq.schema'
export { comparisonSchema } from './comparison.schema'

export const schemaTypes = [
  toolSchema,
  categorySchema,
  authorSchema,
  reviewSchema,
  faqSchema,
  comparisonSchema,
]
