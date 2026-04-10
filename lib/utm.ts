/**
 * UTM Parameter Utility
 *
 * Appends consistent UTM tracking parameters to all affiliate links
 * so GA4 can attribute traffic and conversions by article, tool, and campaign.
 *
 * Standard pattern:
 *   utm_source=verza
 *   utm_medium=affiliate
 *   utm_campaign=[tool-slug]
 *   utm_content=[article-slug]  (optional — identifies which article drove the click)
 */

interface UTMParams {
  /** The tool or brand slug — becomes utm_campaign. e.g. "notion", "chatgpt" */
  campaign: string
  /** The article slug — becomes utm_content. Optional but recommended. */
  content?: string
  /** Override the medium. Defaults to "affiliate". */
  medium?: string
}

/**
 * Appends UTM parameters to an affiliate URL.
 * Handles existing query strings safely.
 *
 * @example
 * buildAffiliateUrl('https://notion.so/pricing', { campaign: 'notion', content: 'best-note-taking-apps' })
 * // → 'https://notion.so/pricing?utm_source=verza&utm_medium=affiliate&utm_campaign=notion&utm_content=best-note-taking-apps'
 */
export function buildAffiliateUrl(baseUrl: string, params: UTMParams): string {
  if (!baseUrl) return ''

  try {
    const url = new URL(baseUrl)

    url.searchParams.set('utm_source', 'verza')
    url.searchParams.set('utm_medium', params.medium || 'affiliate')
    url.searchParams.set('utm_campaign', params.campaign)

    if (params.content) {
      url.searchParams.set('utm_content', params.content)
    }

    return url.toString()
  } catch {
    // If URL is malformed, return as-is to avoid breaking the page
    return baseUrl
  }
}

/**
 * Derives a campaign slug from a tool name or URL.
 * Lowercases and replaces spaces/special chars with hyphens.
 *
 * @example
 * toCampaignSlug('ChatGPT Plus') // → 'chatgpt-plus'
 */
export function toCampaignSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
