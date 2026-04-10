import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.tech'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/studio', '/studio/'],
      },
      // Explicitly allow AI crawlers for AEO optimization
      {
        userAgent: [
          'GPTBot',              // OpenAI (ChatGPT)
          'ChatGPT-User',        // OpenAI (ChatGPT browsing)
          'Google-Extended',     // Google Bard/Gemini
          'anthropic-ai',        // Anthropic (Claude)
          'Claude-Web',          // Anthropic (Claude browsing)
          'PerplexityBot',       // Perplexity AI
          'Amazonbot',           // Amazon Alexa
          'cohere-ai',           // Cohere
          'Omgilibot',           // Webz.io (used by various AI)
          'FacebookBot',         // Meta AI
          'Applebot',            // Apple Intelligence
          'Bytespider',          // ByteDance (for TikTok)
        ],
        allow: '/',
        disallow: ['/api/', '/admin/', '/studio', '/studio/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
