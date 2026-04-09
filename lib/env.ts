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

// Track if we've already warned to avoid spam
let hasWarned = false

// Validation helper
export function validateSanityConfig() {
  const required = [
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    'NEXT_PUBLIC_SANITY_DATASET',
  ]
  
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    // Only warn once to avoid console spam
    if (!hasWarned) {
      hasWarned = true
      // Silently return false - warnings already shown in homepage UI
    }
    return false
  }
  
  return true
}
