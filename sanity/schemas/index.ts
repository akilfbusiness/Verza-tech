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

import { toolSchema } from './tool.schema'
import { categorySchema } from './category.schema'
import { authorSchema } from './author.schema'
import { reviewSchema } from './review.schema'
import { faqSchema } from './faq.schema'
import { comparisonSchema } from './comparison.schema'
import { blogSchema } from './blog.schema'
import { siteSettingsSchema } from './siteSettings.schema'
import { navigationSchema } from './navigation.schema'

export const schemaTypes = [
  // Singletons — site-wide config
  siteSettingsSchema,
  navigationSchema,
  // Content
  blogSchema,
  categorySchema,
  toolSchema,
  authorSchema,
  reviewSchema,
  faqSchema,
  comparisonSchema,
]
