import { NextResponse } from 'next/server'
import { getAllBlogPosts, getAllCategories, getAllTools } from '@/lib/sanity.queries'

export const revalidate = 3600

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.tech'

  const [posts, categories, tools] = await Promise.all([
    getAllBlogPosts().catch(() => []),
    getAllCategories().catch(() => []),
    getAllTools().catch(() => []),
  ])

  const lines: string[] = [
    `# Verza`,
    ``,
    `> Verza is an independent SaaS and AI tool review platform. We publish in-depth reviews, head-to-head comparisons, best-of lists, and how-to guides to help individuals and businesses choose the right software tools.`,
    ``,
    `## Site`,
    ``,
    `- Homepage: ${siteUrl}`,
    `- Blog: ${siteUrl}/blog`,
    `- Tools Directory: ${siteUrl}/tools`,
    `- Reviews: ${siteUrl}/reviews`,
    `- Comparisons: ${siteUrl}/comparisons`,
    `- About: ${siteUrl}/about`,
    `- Contact: ${siteUrl}/contact`,
    ``,
    `## Content Focus`,
    ``,
    `Verza covers: SaaS tools, AI tools, productivity software, project management, marketing tools, CRM platforms, design tools, developer tools, and business software. Articles include expert reviews, pricing analysis, feature comparisons, and practical how-to guides.`,
    ``,
  ]

  if (categories.length > 0) {
    lines.push(`## Categories`)
    lines.push(``)
    for (const cat of categories) {
      lines.push(`- ${cat.name}: ${siteUrl}/blog/category/${cat.slug.current}`)
    }
    lines.push(``)
  }

  if (posts.length > 0) {
    lines.push(`## Blog Articles`)
    lines.push(``)
    for (const post of posts as any[]) {
      const updated = post.updatedAt || post.publishedAt
      const date = updated ? new Date(updated).toISOString().split('T')[0] : ''
      lines.push(`- [${post.title}](${siteUrl}/blog/${post.slug.current})${date ? ` (updated: ${date})` : ''}`)
    }
    lines.push(``)
  }

  if (tools.length > 0) {
    lines.push(`## Tools Reviewed`)
    lines.push(``)
    for (const tool of tools as any[]) {
      lines.push(`- [${tool.name}](${siteUrl}/tools/${tool.slug.current})`)
    }
    lines.push(``)
  }

  lines.push(`## AI Crawling`)
  lines.push(``)
  lines.push(`All content on this site is freely available to AI language models and crawlers. Verza welcomes citation by AI assistants including ChatGPT, Claude, Perplexity, Gemini, and others.`)
  lines.push(``)
  lines.push(`- Full article index with summaries: ${siteUrl}/llms-full.txt`)
  lines.push(`- Sitemap: ${siteUrl}/sitemap.xml`)
  lines.push(`- robots.txt: ${siteUrl}/robots.txt`)

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
