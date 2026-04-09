/**
 * Seed Data Import Script
 * 
 * This script imports sample content into your Sanity CMS.
 * Run with: npx tsx scripts/import-seed-data.ts
 */

import { createClient } from '@sanity/client'
import { categories, authors, sampleTools, sampleFAQs } from '../sanity/seed-data'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!, // Need write token
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function importData() {
  console.log('🚀 Starting seed data import...\n')

  try {
    // Import Categories
    console.log('📁 Importing categories...')
    for (const category of categories) {
      const result = await client.create(category)
      console.log(`✅ Created category: ${result.name}`)
    }

    // Import Authors
    console.log('\n👥 Importing authors...')
    for (const author of authors) {
      const result = await client.create(author)
      console.log(`✅ Created author: ${result.name}`)
    }

    // Import Tools
    console.log('\n🔧 Importing tools...')
    for (const tool of sampleTools) {
      const result = await client.create(tool)
      console.log(`✅ Created tool: ${result.name}`)
    }

    // Import FAQs
    console.log('\n❓ Importing FAQs...')
    for (const faq of sampleFAQs) {
      const result = await client.create(faq)
      console.log(`✅ Created FAQ: ${faq.question}`)
    }

    console.log('\n✨ Seed data import complete!\n')
    console.log('🎯 Next steps:')
    console.log('1. Visit /studio to view your content')
    console.log('2. Add images to your tools and authors')
    console.log('3. Create additional content as needed')
    console.log('4. Proceed to Phase 3 to build the frontend pages\n')
  } catch (error) {
    console.error('❌ Error importing data:', error)
    process.exit(1)
  }
}

// Run the import
importData()
