import { createClient } from 'next-sanity'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'
export const useCdn = process.env.NODE_ENV === 'production'

// Check if Sanity is configured
export const isSanityConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && 
  process.env.NEXT_PUBLIC_SANITY_DATASET
)

// Client for server-side data fetching
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: 'published',
  stega: {
    enabled: false,
    studioUrl: '/studio',
  },
})

// Client with token for write operations (if needed)
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'published',
})
