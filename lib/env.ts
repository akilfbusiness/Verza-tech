/**
 * Environment variable helpers with validation
 */

export function getEnvVar(key: string, required: boolean = false): string {
  const value = process.env[key]
  
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  
  return value || ''
}

export const env = {
  // Sanity
  sanityProjectId: getEnvVar('NEXT_PUBLIC_SANITY_PROJECT_ID', false),
  sanityDataset: getEnvVar('NEXT_PUBLIC_SANITY_DATASET', false),
  sanityApiVersion: getEnvVar('NEXT_PUBLIC_SANITY_API_VERSION', false),
  sanityToken: getEnvVar('SANITY_API_TOKEN', false),
  
  // Site
  siteUrl: getEnvVar('NEXT_PUBLIC_SITE_URL', false) || 'https://verza.com',
  
  // Feature flags
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
}

// Validation helper
export function validateSanityConfig() {
  const required = [
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    'NEXT_PUBLIC_SANITY_DATASET',
  ]
  
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    console.warn(
      '[Sanity] Missing required environment variables:',
      missing.join(', ')
    )
    console.warn('[Sanity] Please check your .env.local file')
    return false
  }
  
  return true
}
